// services/availability.service.ts
import { supabase } from '@/lib/supabase/client';
import { DateTime, Interval } from 'luxon';

// ... (Keep your CONSTANTS and existing types) ...
const SLOT_DURATION_MINUTES = 60;
const BOOKING_WINDOW_DAYS = 30;
const IST_ZONE = 'Asia/Kolkata';
const DAY_KEY_MAP = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const BLOCKING_STATUSES = ['awaiting_payment', 'pending', 'confirmed', 'completed'];

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
  weekdays: { [key: string]: { start: string; end: string; isActive: boolean } };
  weekends: { [key: string]: { start: string; end: string; isActive: boolean } };
};

export const availabilityService = {

  /**
   * 🟢 CALLS YOUR EXISTING DB FUNCTION
   */
  async cleanupExpiredSessions() {
    try {
      const { error } = await supabase.rpc('delete_expired_pending_packages');
      if (error) {
        console.error('[AvailabilityService] RPC Cleanup failed:', error.message);
      } else {
        console.log('[AvailabilityService] 🧹 Triggered DB cleanup: delete_expired_pending_packages');
      }
    } catch (err) {
      console.error('[AvailabilityService] Cleanup Exception:', err);
    }
  },

  async generateAvailability(
    mentorId: string,
    excludeSessionId?: string
  ): Promise<DayAvailability[]> {
    try {
      const now = DateTime.now().setZone(IST_ZONE);
      const startDate = now.plus({ days: 1 }).startOf('day');
      const endDate = startDate.plus({ days: BOOKING_WINDOW_DAYS }).endOf('day');

      // 1. Fetch rules
      const { data: rulesData } = await supabase
        .from('mentor_availability_rules')
        .select('weekdays, weekends')
        .eq('mentor_id', mentorId)
        .maybeSingle();
      const finalRulesData: AvailabilityRules = rulesData || DEFAULT_RULES;

      // 2. Fetch unavailability
      const { data: unavailData } = await supabase
        .from('mentor_unavailability')
        .select('start_at, end_at')
        .eq('mentor_id', mentorId)
        .or(`start_at.lte.${endDate.toISO()},end_at.gte.${startDate.toISO()}`);

      const unavailabilityIntervals = (unavailData || []).map(row => {
        return Interval.fromDateTimes(
          DateTime.fromISO(row.start_at, { zone: IST_ZONE }),
          DateTime.fromISO(row.end_at, { zone: IST_ZONE })
        );
      });

      // 3. Fetch bookings
      const startDateStr = startDate.toFormat('yyyy-MM-dd HH:mm:ss');
      const endDateStr = endDate.toFormat('yyyy-MM-dd HH:mm:ss');
      
      const { data: bookingsData } = await supabase
        .from('interview_sessions')
        .select('scheduled_at, id, status, created_at') 
        .eq('mentor_id', mentorId)
        .gte('scheduled_at', startDateStr)
        .lte('scheduled_at', endDateStr)
        .in('status', BLOCKING_STATUSES);

      const bookedSlots = new Set<string>();
      
      (bookingsData || []).forEach(b => {
        if (excludeSessionId && b.id === excludeSessionId) return;

        // Ignore recently expired pending slots locally if DB job hasn't run
        if (b.status === 'awaiting_payment') {
          const createdAt = DateTime.fromISO(b.created_at || '').toUTC();
          if (createdAt.isValid) {
             const ageInMinutes = DateTime.now().toUTC().diff(createdAt, 'minutes').minutes;
             if (ageInMinutes > 15) return; 
          }
        }

        const dbTimestamp = b.scheduled_at;
        let dt = DateTime.fromISO(dbTimestamp);
        if (!dt.isValid) dt = DateTime.fromSQL(dbTimestamp, { zone: 'utc' });
        
        const istISO = dt.setZone(IST_ZONE).toISO();
        if (istISO) {
          bookedSlots.add(istISO);
          bookedSlots.add(istISO.split('.')[0] + '+05:30');
        }
      });

      // 4. Generate Slots
      const daysArray: DayAvailability[] = [];
      let cursor = startDate;

      while (cursor <= endDate) {
        const dayOfWeek = cursor.weekday % 7;
        const dayKey = DAY_KEY_MAP[dayOfWeek];
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const dayRule = isWeekend ? finalRulesData.weekends[dayKey] : finalRulesData.weekdays[dayKey];

        let slots: Slot[] = [];
        let isFullDayOff = false;

        if (!dayRule || dayRule.isActive === false) {
          isFullDayOff = true;
        } else {
          const dayInterval = Interval.fromDateTimes(cursor.startOf('day'), cursor.endOf('day'));
          if (unavailabilityIntervals.some(ui => ui.engulfs(dayInterval))) {
            isFullDayOff = true;
          } else {
            const [startHour, startMin] = dayRule.start.split(':').map(Number);
            const [endHour, endMin] = dayRule.end.split(':').map(Number);
            let slotTime = cursor.set({ hour: startHour, minute: startMin, second: 0, millisecond: 0 });
            const dayEndTime = cursor.set({ hour: endHour, minute: endMin, second: 0, millisecond: 0 });

            while (slotTime < dayEndTime) {
              const slotEnd = slotTime.plus({ minutes: SLOT_DURATION_MINUTES });
              if (slotTime <= now) {
                slotTime = slotEnd; 
                continue;
              }

              const slotInterval = Interval.fromDateTimes(slotTime, slotEnd);
              const isUnavailable = unavailabilityIntervals.some(ui => ui.overlaps(slotInterval));
              
              const slotISO = slotTime.toISO();
              const slotISOShort = slotISO?.split('.')[0] + '+05:30';
              const isBooked = (slotISO && bookedSlots.has(slotISO)) || (slotISOShort && bookedSlots.has(slotISOShort));

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

      return daysArray;
    } catch (err) {
      console.error('[AvailabilityService] ❌ Error:', err);
      throw err;
    }
  },

  /**
   * 🟢 UPDATED: actually finds the next slot
   */
  async findNextAvailableSlot(mentorId: string): Promise<string> {
    try {
      // Reuse the generator logic to find the very first slot
      const days = await this.generateAvailability(mentorId);
      
      for (const day of days) {
        const firstAvailable = day.slots.find(s => s.isAvailable);
        if (firstAvailable) {
          // Format: "Mon, 12 Oct • 8:00 PM"
          return `${day.weekdayName}, ${day.monthDay} • ${firstAvailable.time}`;
        }
      }
      return 'No slots available';
    } catch (error) {
      console.error("Error finding next slot", error);
      return 'Check Calendar'; // Fallback
    }
  }
};