// services/availability.service.ts
import { supabase } from '@/lib/supabase/client';
import { DateTime, Interval } from 'luxon';

// CONSTANTS
const SLOT_DURATION_MINUTES = 60;
const BOOKING_WINDOW_DAYS = 30;
const IST_ZONE = 'Asia/Kolkata';
const DAY_KEY_MAP = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// ✅ Statuses that block a slot from being available
// NOTE: 'scheduled' is NOT a valid enum value in the database
const BLOCKING_STATUSES = ['awaiting_payment', 'pending', 'confirmed', 'completed'];

// Default availability rules
const DEFAULT_RULES = {
  weekdays: {
    monday: { start: '20:00', end: '22:00', isActive: true },
    tuesday: { start: '20:00', end: '22:00', isActive: true },
    wednesday: { start: '20:00', end: '22:00', isActive: true },
    thursday: { start: '20:00', end: '22:00', isActive: true },
    friday: { start: '20:00', end: '22:00', isActive: true }
  },
  weekends: {
    saturday: { start: '12:00', end: '17:00', isActive: true },
    sunday: { start: '12:00', end: '17:00', isActive: true }
  }
};

// TYPES
export type Slot = {
  time: string;
  isAvailable: boolean;
  dateTime: DateTime;
  reason?: string;
};

export type DayAvailability = {
  dateStr: string;
  weekdayName: string;
  monthDay: string;
  slots: Slot[];
  isFullDayOff: boolean;
};

export type AvailabilityRules = {
  weekdays: {
    [key: string]: { start: string; end: string; isActive: boolean };
  };
  weekends: {
    [key: string]: { start: string; end: string; isActive: boolean };
  };
};

/**
 * Generate 30-day availability for a mentor
 * Used by: schedule.tsx, candidate bookings.tsx (reschedule), mentor bookings.tsx (reschedule)
 */
export const availabilityService = {
  async generateAvailability(
    mentorId: string,
    excludeSessionId?: string
  ): Promise<DayAvailability[]> {
    try {
      const now = DateTime.now().setZone(IST_ZONE);
      const startDate = now.plus({ days: 1 }).startOf('day');
      const endDate = startDate.plus({ days: BOOKING_WINDOW_DAYS }).endOf('day');

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[AvailabilityService] 🔍 DEBUGGING SLOT AVAILABILITY');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[AvailabilityService] Mentor ID:', mentorId);
      console.log('[AvailabilityService] Date Range:', startDate.toISODate(), 'to', endDate.toISODate());
      console.log('[AvailabilityService] Exclude Session:', excludeSessionId || 'None');

      // 1. Fetch availability rules
      const { data: rulesData, error: rulesError } = await supabase
        .from('mentor_availability_rules')
        .select('weekdays, weekends')
        .eq('mentor_id', mentorId)
        .maybeSingle();

      if (rulesError && rulesError.code !== 'PGRST116') throw rulesError;

      const finalRulesData: AvailabilityRules = rulesData || DEFAULT_RULES;

      // 2. Fetch unavailability periods
      const { data: unavailData } = await supabase
        .from('mentor_unavailability')
        .select('start_at, end_at')
        .eq('mentor_id', mentorId)
        .or(`start_at.lte.${endDate.toISO()},end_at.gte.${startDate.toISO()}`);

      const unavailabilityIntervals = (unavailData || []).map(row => {
        const s = DateTime.fromISO(row.start_at, { zone: IST_ZONE });
        const e = DateTime.fromISO(row.end_at, { zone: IST_ZONE });
        return Interval.fromDateTimes(s, e);
      });

      console.log('[AvailabilityService] 📅 Unavailability periods:', unavailabilityIntervals.length);

      // 3. Fetch existing bookings - ✅ Include ALL blocking statuses
      console.log('[AvailabilityService] 🔍 Fetching bookings with statuses:', BLOCKING_STATUSES);
      
      // ✅ FIX: Use simple date strings without timezone to avoid URL encoding issues
      // Supabase will interpret these as the database's timezone
      const startDateStr = startDate.toFormat('yyyy-MM-dd HH:mm:ss');
      const endDateStr = endDate.toFormat('yyyy-MM-dd HH:mm:ss');
      
      console.log('[AvailabilityService] Query range:', startDateStr, 'to', endDateStr);
      
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('interview_sessions')
        .select('scheduled_at, id, status')
        .eq('mentor_id', mentorId)
        .gte('scheduled_at', startDateStr)
        .lte('scheduled_at', endDateStr)
        .in('status', BLOCKING_STATUSES);

      if (bookingsError) {
        console.error('[AvailabilityService] ❌ Error fetching bookings:', bookingsError);
        console.error('[AvailabilityService] ❌ Error details:', JSON.stringify(bookingsError, null, 2));
      }

      console.log('[AvailabilityService] 📊 RAW BOOKINGS FROM DB:', JSON.stringify(bookingsData, null, 2));
      console.log('[AvailabilityService] 📊 Total bookings fetched:', bookingsData?.length || 0);

      // Filter out excluded session (for reschedule)
      const filteredBookings = (bookingsData || []).filter(
        b => !excludeSessionId || b.id !== excludeSessionId
      );

      console.log('[AvailabilityService] 📊 After filtering exclusions:', filteredBookings.length);

      // Log each booking for debugging
      filteredBookings.forEach((booking, index) => {
        const dbValue = booking.scheduled_at;
        
        console.log(`[Booking ${index + 1}]`, {
          id: booking.id,
          status: booking.status,
          dbValue: dbValue,
          dbValueType: typeof dbValue
        });
      });

      // ✅ FIX: Parse DB timestamps and normalize to IST for matching
      const bookedSlots = new Set<string>();
      filteredBookings.forEach(b => {
        // Parse the timestamp from DB (may be in various formats)
        const dbTimestamp = b.scheduled_at;
        
        // Try parsing as ISO string first
        let dt = DateTime.fromISO(dbTimestamp);
        
        // If invalid, try SQL format
        if (!dt.isValid) {
          dt = DateTime.fromSQL(dbTimestamp, { zone: 'utc' });
        }
        
        // Convert to IST for comparison
        const istDT = dt.setZone(IST_ZONE);
        const istISO = istDT.toISO();
        
        if (istISO) {
          bookedSlots.add(istISO);
          // Also add without milliseconds for compatibility
          const withoutMs = istISO.split('.')[0] + '+05:30';
          bookedSlots.add(withoutMs);
          
          console.log(`  → Parsed to IST:`, istDT.toFormat('MMM d, h:mm a'), '/', istISO);
        }
      });

      console.log('[AvailabilityService] 🔒 Booked slots Set size:', bookedSlots.size);
      console.log('[AvailabilityService] 🔒 Booked slots:', Array.from(bookedSlots));

      // 4. Generate day-by-day availability
      const daysArray: DayAvailability[] = [];
      let cursor = startDate;

      while (cursor <= endDate) {
        const dayOfWeek = cursor.weekday % 7; // 0=Sunday, 1=Monday, ..., 6=Saturday
        const dayKey = DAY_KEY_MAP[dayOfWeek];
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const source = isWeekend ? finalRulesData.weekends : finalRulesData.weekdays;
        const dayRule = source[dayKey];

        let slots: Slot[] = [];
        let isFullDayOff = false;

        if (!dayRule || dayRule.isActive === false) {
          isFullDayOff = true;
        } else {
          // Check if entire day is blocked by unavailability
          const dayStart = cursor.startOf('day');
          const dayEnd = cursor.endOf('day');
          const dayInterval = Interval.fromDateTimes(dayStart, dayEnd);

          const hasFullDayException = unavailabilityIntervals.some(ui =>
            ui.engulfs(dayInterval)
          );

          if (hasFullDayException) {
            isFullDayOff = true;
          } else {
            // Generate hourly slots
            const [startHour, startMin] = dayRule.start.split(':').map(Number);
            const [endHour, endMin] = dayRule.end.split(':').map(Number);

            let slotTime = cursor.set({ hour: startHour, minute: startMin, second: 0, millisecond: 0 });
            const dayEndTime = cursor.set({ hour: endHour, minute: endMin, second: 0, millisecond: 0 });

            while (slotTime < dayEndTime) {
              const slotEnd = slotTime.plus({ minutes: SLOT_DURATION_MINUTES });

              // Skip past slots
              if (slotTime <= now) {
                slotTime = slotEnd;
                continue;
              }

              // Check overlaps
              const slotInterval = Interval.fromDateTimes(slotTime, slotEnd);
              const isUnavailable = unavailabilityIntervals.some(ui => ui.overlaps(slotInterval));
              
              // ✅ FIX: Simple ISO comparison (both are in IST now)
              const slotISO = slotTime.toISO();
              const slotISOWithoutMs = slotISO?.split('.')[0] + '+05:30';
              
              const isBooked = (slotISO && bookedSlots.has(slotISO)) || 
                               (slotISOWithoutMs && bookedSlots.has(slotISOWithoutMs));

              slots.push({
                time: slotTime.toFormat('h:mm a'),
                isAvailable: !isUnavailable && !isBooked,
                dateTime: slotTime,
                reason: isBooked ? 'Booked' : isUnavailable ? 'Unavailable' : undefined
              });

              slotTime = slotEnd;
            }
          }
        }

        daysArray.push({
          dateStr: cursor.toISODate()!,
          weekdayName: cursor.toFormat('EEE'),
          monthDay: cursor.toFormat('MMM d'),
          slots,
          isFullDayOff
        });

        cursor = cursor.plus({ days: 1 });
      }

      console.log('[AvailabilityService] ✅ Generated availability for', daysArray.length, 'days');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return daysArray;
    } catch (err) {
      console.error('[AvailabilityService] ❌ Error generating availability:', err);
      throw err;
    }
  },

  /**
   * Find next available slot for a mentor (used in candidate dashboard)
   * Returns formatted string like "Jan 15" or "No slots available"
   */
  async findNextAvailableSlot(mentorId: string): Promise<string> {
    try {
      const now = DateTime.now().setZone(IST_ZONE);
      const startDate = now.plus({ days: 1 }).startOf('day');
      const endDate = startDate.plus({ days: BOOKING_WINDOW_DAYS }).endOf('day');

      // 1. Fetch rules (using fetch API for consistency with existing code)
      const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

      const rulesRes = await fetch(
        `${SUPABASE_URL}/rest/v1/mentor_availability_rules?mentor_id=eq.${mentorId}&select=weekdays,weekends`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const rulesData = await rulesRes.json();

      const finalRulesData: AvailabilityRules = (rulesData && rulesData[0]) || DEFAULT_RULES;

      // 2. Fetch unavailability
      const unavailRes = await fetch(
        `${SUPABASE_URL}/rest/v1/mentor_unavailability?mentor_id=eq.${mentorId}&select=start_at,end_at`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const unavailData = await unavailRes.json();

      const unavailabilityIntervals = (Array.isArray(unavailData) ? unavailData : [])
        .filter((row: any) => {
          const s = DateTime.fromISO(row.start_at, { zone: IST_ZONE });
          const e = DateTime.fromISO(row.end_at, { zone: IST_ZONE });
          return e >= startDate && s <= endDate;
        })
        .map((row: any) => {
          const s = DateTime.fromISO(row.start_at, { zone: IST_ZONE });
          const e = DateTime.fromISO(row.end_at, { zone: IST_ZONE });
          return Interval.fromDateTimes(s, e);
        });

      // 3. Fetch bookings - ✅ Include ALL blocking statuses
      // ✅ FIX: Use simple date strings for API query
      const startDateStr = startDate.toFormat('yyyy-MM-dd HH:mm:ss');
      const endDateStr = endDate.toFormat('yyyy-MM-dd HH:mm:ss');
      
      const statusQuery = BLOCKING_STATUSES.join(',');
      const bookingsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/interview_sessions?mentor_id=eq.${mentorId}&scheduled_at=gte.${encodeURIComponent(startDateStr)}&scheduled_at=lte.${encodeURIComponent(endDateStr)}&status=in.(${statusQuery})&select=scheduled_at`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const bookingsData = await bookingsRes.json();

      // ✅ Parse timestamps from DB and convert to IST for comparison
      const bookedTimesSet = new Set(
        (Array.isArray(bookingsData) ? bookingsData : []).map((b: any) => {
          const dt = DateTime.fromISO(b.scheduled_at);
          if (!dt.isValid) {
            return DateTime.fromSQL(b.scheduled_at, { zone: 'utc' }).setZone(IST_ZONE).toFormat('yyyy-MM-dd HH:mm');
          }
          return dt.setZone(IST_ZONE).toFormat('yyyy-MM-dd HH:mm');
        })
      );

      // 4. Search for first available slot
      let slotsChecked = 0;

      for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
        const dateStr = startDate.plus({ days: i }).toFormat('yyyy-MM-dd');
        const cursor = DateTime.fromFormat(dateStr, 'yyyy-MM-dd', { zone: IST_ZONE });

        const dayOfWeek = cursor.weekday % 7;
        const dayKey = DAY_KEY_MAP[dayOfWeek];
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const source = isWeekend ? finalRulesData.weekends : finalRulesData.weekdays;
        const dayRule = source?.[dayKey];

        if (!dayRule || typeof dayRule !== 'object') continue;

        const isActive = dayRule.isActive === true || 
                        dayRule.isActive === 'true' || 
                        dayRule.isActive === 't' || 
                        dayRule.isActive === undefined;

        if (!isActive) continue;

        const startStr = String(dayRule.start);
        const endStr = String(dayRule.end);
        const ruleStartDT = DateTime.fromFormat(`${dateStr} ${startStr}`, 'yyyy-MM-dd HH:mm', { zone: IST_ZONE });
        const ruleEndDT = DateTime.fromFormat(`${dateStr} ${endStr}`, 'yyyy-MM-dd HH:mm', { zone: IST_ZONE });

        if (!ruleStartDT.isValid || !ruleEndDT.isValid) continue;

        let slotCursor = ruleStartDT;
        while (slotCursor < ruleEndDT) {
          const slotStart = slotCursor;
          const slotEnd = slotCursor.plus({ minutes: SLOT_DURATION_MINUTES });
          if (slotEnd > ruleEndDT) break;

          slotsChecked++;
          const slotKey = slotStart.toFormat('yyyy-MM-dd HH:mm');

          const isBooked = bookedTimesSet.has(slotKey);
          const slotInterval = Interval.fromDateTimes(slotStart, slotEnd);
          const isTimeOffSlot = unavailabilityIntervals.some(u => u.overlaps(slotInterval));

          if (!isBooked && !isTimeOffSlot) {
            const month = slotStart.toFormat('MMM');
            const day = slotStart.toFormat('d');
            return `${month} ${day}`;
          }

          slotCursor = slotEnd;
        }
      }

      return 'No slots available';
    } catch (err) {
      console.error('[AvailabilityService] Error finding next slot:', err);
      return 'No slots available';
    }
  }
};