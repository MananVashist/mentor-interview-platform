// services/mentor.service.ts
import { supabase } from '@/lib/supabase/client';
import { logger } from '@/lib/debug';

export type Mentor = {
  id: string;            // mentor row PK
  profile_id: string;    // FK → profiles.id
  pricing_inr?: number | null;
  title?: string | null;
  description?: string | null;
  linkedin_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type MentorAvailability = {
  id: string;
  mentor_id: string;
  weekday: number;       // 0..6
  start_minute: number;  // 0..1439
  end_minute: number;    // 1..1440
  is_active: boolean;
};

export type MentorBooking = {
  id: string;
  mentor_id: string;
  candidate_id: string;
  scheduled_at: string;
  status: string;
};

export const mentorService = {
  async getMyMentorRow(profileId: string) {
    logger.debug('[MentorService] getMyMentorRow', { profileId });
    // If your schema is mentors.id == profiles.id, switch to .eq('id', profileId)
    const { data, error } = await supabase
      .from('mentors')
      .select('*, profile:profiles(*)')
      .eq('profile_id', profileId)       // 👈 adjust if needed
      .maybeSingle();

    if (error) {
      logger.warn('[MentorService] getMyMentorRow error', error);
      return { mentor: null, error };
    }
    return { mentor: data as any as Mentor, error: null };
  },

  async upsertMyMentorRow(partial: Partial<Mentor>) {
    logger.debug('[MentorService] upsertMyMentorRow', partial);
    const { data, error } = await supabase
      .from('mentors')
      .upsert(partial, { onConflict: 'id' })
      .select()
      .single();

    if (error) return { mentor: null, error };
    return { mentor: data as Mentor, error: null };
  },

  async listMyBookings(mentorId: string) {
    logger.debug('[MentorService] listMyBookings', { mentorId });
    const { data, error } = await supabase
      .from('bookings')
      .select('*, candidate:candidates(id, profile:profiles(*))')
      .eq('mentor_id', mentorId)
      .order('scheduled_at', { ascending: true });

    if (error) return { bookings: [], error };
    return { bookings: (data ?? []) as any as MentorBooking[], error: null };
  },

  async listMyAvailability(mentorId: string) {
    logger.debug('[MentorService] listMyAvailability', { mentorId });
    const { data, error } = await supabase
      .from('mentor_availability')
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('is_active', true)
      .order('weekday', { ascending: true });

    if (error) return { availability: [], error };
    return { availability: (data ?? []) as MentorAvailability[], error: null };
  },
};
