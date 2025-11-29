// services/mentor.service.ts
import { supabase } from '@/lib/supabase/client';
import { calculateMentorTier } from '@/lib/logic';

const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

// Type definitions
type Mentor = {
  id: string;
  profile_id: string;
  professional_title?: string;
  experience_description?: string;
  expertise_profiles?: string[];
  session_price_inr?: number;
  session_price?: number;
  total_sessions?: number;
  average_rating?: number;
  is_hr_mentor?: boolean;
  status?: string;
  kyc_document_url?: string;
  bank_details?: any;
  mentor_level?: string;
  [key: string]: any;
};

type MentorWithProfile = Mentor & {
  profile?: any;
};

type MentorAvailability = {
  id?: string;
  mentor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
  created_at?: string;
};

export const mentorService = {
  /**
   * ✅ FIX #2: Uses status=eq.approved to filter only approved mentors
   * Safe REST API version that bypasses RLS issues
   */
  async getMentorsByProfileSafe(profile: string): Promise<MentorWithProfile[]> {
    try {
      // FIX #2: Check 'status' column instead of 'is_approved'
      const url = `${SUPABASE_URL}/rest/v1/mentors?status=eq.approved&select=*,profile:profiles(*)`;

      const res = await fetch(url, {
        headers: { 
          apikey: SUPABASE_ANON_KEY, 
          Authorization: `Bearer ${SUPABASE_ANON_KEY}` 
        },
      });

      const text = await res.text();
      
      if (!res.ok) {
        console.error('[mentorService.getMentorsByProfileSafe] HTTP', res.status, text);
        return [];
      }

      const all = JSON.parse(text) as MentorWithProfile[];

      // Case-insensitive match on expertise_profiles
      const target = profile.trim().toLowerCase();
      const filtered = all.filter((m) => {
        const arr = m.expertise_profiles || [];
        return arr.some(
          (item) => item && item.trim().toLowerCase() === target
        );
      });

      // Inject dynamic tier calculation
      return filtered.map(m => ({
        ...m,
        mentor_level: calculateMentorTier(m.total_sessions)
      }));

    } catch (error) {
      console.error('Error fetching mentors (REST safe):', error);
      return [];
    }
  },

  /**
   * Original Supabase client version - uses status instead of is_approved
   */
  async getMentorsByProfile(profile: string): Promise<MentorWithProfile[]> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`*, profile:profiles(*)`)
        .eq('status', 'approved') // ✅ FIX #2: Changed from is_approved to status
        .contains('expertise_profiles', [profile]);

      if (error) throw error;
      
      // Calculate tiers on the fly
      const mentorsWithTiers = (data as MentorWithProfile[]).map(m => ({
        ...m,
        mentor_level: calculateMentorTier(m.total_sessions)
      }));

      return mentorsWithTiers;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      return [];
    }
  },

  async getHRMentors(): Promise<MentorWithProfile[]> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`*, profile:profiles(*)`)
        .eq('status', 'approved') // ✅ FIX #2: Changed from is_approved to status
        .eq('is_hr_mentor', true);

      if (error) throw error;

      // Calculate tiers on the fly
      const mentorsWithTiers = (data as MentorWithProfile[]).map(m => ({
        ...m,
        mentor_level: calculateMentorTier(m.total_sessions)
      }));

      return mentorsWithTiers;
    } catch (error) {
      console.error('Error fetching HR mentors:', error);
      return [];
    }
  },

  async getMentorById(mentorId: string): Promise<MentorWithProfile | null> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`*, profile:profiles(*)`)
        .eq('id', mentorId)
        .single();

      if (error) throw error;

      // Inject calculated tier
      const mentor = data as MentorWithProfile;
      mentor.mentor_level = calculateMentorTier(mentor.total_sessions);

      return mentor;
    } catch (error) {
      console.error('Error fetching mentor:', error);
      return null;
    }
  },

  async updateMentor(mentorId: string, updates: Partial<Mentor>) {
    const { data, error } = await supabase
      .from('mentors')
      .update(updates)
      .eq('id', mentorId)
      .select()
      .single();

    return { data, error };
  },

  async getMentorAvailability(mentorId: string): Promise<MentorAvailability[]> {
    try {
      const { data, error } = await supabase
        .from('mentor_availability')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('is_active', true)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      return data as MentorAvailability[];
    } catch (error) {
      console.error('Error fetching mentor availability:', error);
      return [];
    }
  },

  async setMentorAvailability(
    mentorId: string,
    availability: Omit<MentorAvailability, 'id' | 'mentor_id' | 'created_at'>[]
  ) {
    // Deactivate existing
    await supabase
      .from('mentor_availability')
      .update({ is_active: false })
      .eq('mentor_id', mentorId);

    // Insert new
    const slotsToInsert = availability.map((slot) => ({
      mentor_id: mentorId,
      ...slot,
      is_active: true,
    }));

    const { data, error } = await supabase
      .from('mentor_availability')
      .insert(slotsToInsert)
      .select();

    return { data, error };
  },

  async updateKYC(mentorId: string, kycDocumentUrl: string, bankDetails: any) {
    const { data, error } = await supabase
      .from('mentors')
      .update({
        kyc_document_url: kycDocumentUrl,
        bank_details: bankDetails,
      })
      .eq('id', mentorId)
      .select()
      .single();

    return { data, error };
  },

  async getMentorStats(mentorId: string) {
    try {
      const { data: mentor } = await supabase
        .from('mentors')
        .select('total_sessions, average_rating')
        .eq('id', mentorId)
        .single();

      const { data: upcomingSessions } = await supabase
        .from('interview_sessions')
        .select('count')
        .eq('mentor_id', mentorId)
        .in('status', ['pending', 'confirmed'])
        .single();

      const { data: completedThisMonth } = await supabase
        .from('interview_sessions')
        .select('count')
        .eq('mentor_id', mentorId)
        .eq('status', 'completed')
        .gte(
          'updated_at',
          new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        )
        .single();

      // DYNAMIC CALCULATION
      const totalSessions = mentor?.total_sessions || 0;
      const dynamicLevel = calculateMentorTier(totalSessions);

      return {
        totalSessions: totalSessions,
        averageRating: mentor?.average_rating || 0,
        mentorLevel: dynamicLevel,
        upcomingSessions: upcomingSessions?.count || 0,
        completedThisMonth: completedThisMonth?.count || 0,
      };
    } catch (error) {
      console.error('Error fetching mentor stats:', error);
      return null;
    }
  },
};