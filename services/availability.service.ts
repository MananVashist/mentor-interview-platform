import { supabase } from '@/lib/supabase/client';
import { DateTime } from 'luxon';

export type TimeSlot = {
  time: string;
  isAvailable: boolean;
  reason?: 'booked' | 'unavailable' | 'past';
};

export const availabilityService = {
  async getSlotsForDate(mentorId: string, dateStr: string): Promise<TimeSlot[]> {
    const date = DateTime.fromISO(dateStr);
    
    // Map Luxon (1=Mon...7=Sun) to DB (0=Sun, 1=Mon...6=Sat)
    const dbDayOfWeek = date.weekday === 7 ? 0 : date.weekday;

    const dayStart = date.startOf('day').toISO();
    const dayEnd = date.endOf('day').toISO();

    // 1. Run queries in parallel
    const [availabilityRes, unavailabilityRes, bookingsRes] = await Promise.all([
      // A. Check for EXPLICIT schedule in DB (Uses start_time / end_time)
      supabase
        .from('mentor_availability')
        .select('start_time, end_time, is_active')
        .eq('mentor_id', mentorId)
        .eq('day_of_week', dbDayOfWeek)
        .maybeSingle(),

      // B. Check Exceptions (Uses start_at / end_at) <--- FIXED COLUMN NAMES
      supabase
        .from('mentor_unavailability')
        .select('start_at, end_at')
        .eq('mentor_id', mentorId)
        .or(`start_at.lte.${dayEnd},end_at.gte.${dayStart}`),

      // C. Check Bookings (Uses scheduled_at)
      supabase
        .from('interview_sessions')
        .select('scheduled_at')
        .eq('mentor_id', mentorId)
        .gte('scheduled_at', dayStart)
        .lte('scheduled_at', dayEnd)
        .neq('status', 'cancelled')
    ]);

    if (availabilityRes.error) console.error('Availability Error:', availabilityRes.error);
    if (unavailabilityRes.error) console.error('Unavailability Error:', unavailabilityRes.error);

    // --- 2. DETERMINE SCHEDULE (DB vs DEFAULT) ---
    let startStr = '';
    let endStr = '';

    if (availabilityRes.data) {
      // CASE A: We have a specific rule for this day
      if (availabilityRes.data.is_active === false) {
        // Mentor explicitly marked this day as CLOSED
        return [];
      }
      startStr = availabilityRes.data.start_time;
      endStr = availabilityRes.data.end_time;
    } else {
      // CASE B: No DB record (New Mentor) -> Use DEFAULT Rules
      // 0=Sun, 6=Sat
      const isWeekend = dbDayOfWeek === 0 || dbDayOfWeek === 6;
      if (isWeekend) {
        startStr = '12:00:00'; // 12 PM
        endStr = '17:00:00';   // 5 PM
      } else {
        startStr = '20:00:00'; // 8 PM
        endStr = '22:00:00';   // 10 PM
      }
    }

    // --- 3. GENERATE SLOTS ---
    const ruleStart = DateTime.fromFormat(startStr, 'HH:mm:ss');
    const ruleEnd = DateTime.fromFormat(endStr, 'HH:mm:ss');
    
    const slots: TimeSlot[] = [];
    let current = ruleStart;
    
    // Loop hourly until end time
    while (current < ruleEnd) {
      const timeStr = current.toFormat('HH:mm'); // e.g. "20:00"
      const slotDateTime = date.set({ hour: current.hour, minute: current.minute });
      
      let isAvailable = true;
      let reason: TimeSlot['reason'] = undefined;

      // Filter: Past Time
      if (slotDateTime < DateTime.now()) {
        isAvailable = false;
        reason = 'past';
      }

      // Filter: Already Booked
      if (isAvailable && bookingsRes.data?.some(b => {
        const bookingTime = DateTime.fromISO(b.scheduled_at);
        return bookingTime.hasSame(slotDateTime, 'hour');
      })) {
        isAvailable = false;
        reason = 'booked';
      }

      // Filter: Specific Unavailability (Vacation)
      // FIXED: Uses u.start_at and u.end_at
      if (isAvailable && unavailabilityRes.data?.some(u => {
        const uStart = DateTime.fromISO(u.start_at);
        const uEnd = DateTime.fromISO(u.end_at);
        // Check if slot overlaps with "Out of Office" block
        return slotDateTime >= uStart && slotDateTime < uEnd;
      })) {
        isAvailable = false;
        reason = 'unavailable';
      }

      slots.push({ time: timeStr, isAvailable, reason });
      current = current.plus({ hours: 1 });
    }

    return slots;
  }
};