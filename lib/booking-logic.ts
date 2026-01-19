// lib/booking-logic.ts
import { DateTime } from 'luxon';

export type BookingUIState = 
  | 'AWAITING_PAYMENT' // ✅ NEW: Payment not yet completed
  | 'APPROVAL'         // Pending mentor approval (payment complete, mentor hasn't accepted)
  | 'SCHEDULED'        // Future confirmed meeting
  | 'RESCHEDULE_PENDING' // Reschedule proposed, awaiting other party's acceptance
  | 'JOIN'             // Active window (15m before -> 60m after)
  | 'POST_PENDING'     // Past, needs evaluation
  | 'POST_COMPLETED'   // Past, evaluation done
  | 'CANCELLED';

/**
 * 1. Determine the UI State based on Status + Time + Payment Status
 */
export function getBookingState(session: any): BookingUIState {
  // 1. Final states take absolute priority
  if (session.status === 'cancelled') return 'CANCELLED';
  if (session.status === 'completed') return 'POST_COMPLETED';
  
  // 2. ✅ NEW: Check if payment is still pending (awaiting_payment status)
  if (session.status === 'awaiting_payment') {
    return 'AWAITING_PAYMENT';
  }
  
  // 3. 🟢 PRIORITY FIX: Check Reschedule Pending BEFORE 'pending' (Approval)
  // This ensures that if a 'pending' session is rescheduled, it enters the negotiation loop
  // instead of getting stuck in the 'APPROVAL' UI state.
  if (session.pending_reschedule_approval === true) {
    return 'RESCHEDULE_PENDING';
  }

  // 4. Approval state (payment complete, awaiting mentor acceptance)
  // ✅ This now correctly shows after payment is done but before mentor accepts
  if (session.status === 'pending') return 'APPROVAL';

  // 5. Confirmed/Scheduled Logic
  if (session.status === 'confirmed' || session.status === 'scheduled') {
    const date = DateTime.fromISO(session.scheduled_at);
    const diffMinutes = date.diffNow('minutes').as('minutes');

    // RULE: Join allowed 15 mins before start, up to 60 mins after start
    if (diffMinutes <= 15 && diffMinutes > -60) {
      return 'JOIN';
    }
    
    // RULE: If more than 60 mins past start, and not completed, it needs eval
    if (diffMinutes <= -60) {
      return 'POST_PENDING';
    }

    return 'SCHEDULED';
  }

  return 'SCHEDULED'; 
}

/**
 * 2. Format details (Date, Names, Profile)
 */
export function getBookingDetails(session: any) {
  const date = DateTime.fromISO(session.scheduled_at);
  
  return {
    dateLabel: date.toFormat('MMM dd, yyyy'),
    timeLabel: date.toFormat('h:mm a'),
    
    skillName: session.skill_name || 'Interview Session',
    
    profileName: session.package?.interview_profile_name || 'Mock Interview',
    
    // Logic to resolve the other person's name
    getCounterpartName: (viewerRole: 'mentor' | 'candidate') => {
      if (viewerRole === 'mentor') return session.candidate?.professional_title || 'Candidate';
      return session.mentor_name || 'Mentor'; 
    },
    mentorPayout: session.package?.mentor_payout_inr || 0,
    
    // 🟢 Get who initiated the reschedule
    rescheduledBy: session.rescheduled_by || null
  };
}

/**
 * 3. Centralized Template Lookup
 */
export function getEvaluationTemplate(session: any) {
  const title = session.skill_name || session.package?.interview_profile_name || 'Evaluation Details';

  const content = session.skill_description 
    ? `GUIDELINES & EXAMPLES:\n\n${session.skill_description}`
    : session.package?.interview_profile_description 
    || "No specific guidelines available for this session.";

  return { title, content };
}