import { supabase } from '@/lib/supabase/client';
import { Mentor, MentorAvailability, MentorWithProfile } from '@/lib/types';

const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

export const mentorService = {
  /**
   * REST version – used by candidate browse screen.
   * Fetch all approved mentors, then match profile name in JS (case-insensitive).
   */
  async getMentorsByProfileSafe(profile: string): Promise<MentorWithProfile[]> {
    try {
      // 1) get all approved mentors
      const url =
        `${SUPABASE_URL}/rest/v1/mentors` +
        `?is_approved=eq.true` +
        `&select=*,profile:profiles(*)`;

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      const text = await res.text();
      if (!res.ok) {
        console.error('[mentorService.getMentorsByProfileSafe] HTTP', res.status, text);
        return [];
      }

      const all = JSON.parse(text) as (MentorWithProfile & {
        expertise_profiles?: string[];
      })[];

      // 2) case-insensitive match
      const target = profile.trim().toLowerCase();

      const filtered = all.filter((m) => {
        const arr = m.expertise_profiles || [];
        return arr.some(
          (item) => item && item.trim().toLowerCase() === target
        );
      });

      return filtered;
    } catch (error) {
      console.error('Error fetching mentors (REST safe):', error);
      return [];
    }
  },

  // keep your original js version for other places
  async getMentorsByProfile(profile: string): Promise<MentorWithProfile[]> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(
          `
          *,
          profile:profiles(*)
        `
        )
        .eq('is_approved', true)
        .contains('expertise_profiles', [profile]);

      if (error) throw error;
      return data as MentorWithProfile[];
    } catch (error) {
      console.error('Error fetching mentors:', error);
      return [];
    }
  },

  async getHRMentors(): Promise<MentorWithProfile[]> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(
          `
          *,
          profile:profiles(*)
        `
        )
        .eq('is_approved', true)
        .eq('is_hr_mentor', true);

      if (error) throw error;
      return data as MentorWithProfile[];
    } catch (error) {
      console.error('Error fetching HR mentors:', error);
      return [];
    }
  },

  async getMentorById(mentorId: string): Promise<MentorWithProfile | null> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(
          `
          *,
          profile:profiles(*)
        `
        )
        .eq('id', mentorId)
        .single();

      if (error) throw error;
      return data as MentorWithProfile;
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
    // deactivate existing
    await supabase.from('mentor_availability').update({ is_active: false }).eq('mentor_id', mentorId);

    // insert new
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
        .select('total_sessions, average_rating, mentor_level')
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

      return {
        totalSessions: mentor?.total_sessions || 0,
        averageRating: mentor?.average_rating || 0,
        mentorLevel: mentor?.mentor_level || 'bronze',
        upcomingSessions: upcomingSessions?.count || 0,
        completedThisMonth: completedThisMonth?.count || 0,
      };
    } catch (error) {
      console.error('Error fetching mentor stats:', error);
      return null;
    }
  },
};
