// lib/booking-logic.ts
import { DateTime } from 'luxon';

// 🔴 REMOVED: import { MASTER_TEMPLATES } ... (Data is now in the DB)

export type BookingUIState = 
  | 'APPROVAL'       // Pending mentor approval
  | 'SCHEDULED'      // Future confirmed meeting
  | 'JOIN'           // Active window (15m before -> 60m after)
  | 'POST_PENDING'   // Past, needs evaluation
  | 'POST_COMPLETED' // Past, evaluation done
  | 'CANCELLED';

/**
 * 1. Determine the UI State based on Status + Time
 * (Logic remains same as before)
 */
export function getBookingState(session: any): BookingUIState {
  if (session.status === 'pending') return 'APPROVAL';
  if (session.status === 'cancelled') return 'CANCELLED';
  if (session.status === 'completed') return 'POST_COMPLETED';

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
    
    // 🟢 CHANGED: Replaced 'roundLabel' with 'skillName'
    skillName: session.skill_name || 'Interview Session',
    
    profileName: session.package?.interview_profile_name || 'Mock Interview',
    
    // Logic to resolve the other person's name
    getCounterpartName: (viewerRole: 'mentor' | 'candidate') => {
      if (viewerRole === 'mentor') return session.candidate?.professional_title || 'Candidate';
      return session.mentor_name || 'Mentor'; 
    },
    mentorPayout: session.package?.mentor_payout_inr || 0
  };
}

/**
 * 3. Centralized Template Lookup
 * 🟢 UPDATED: Now fetches directly from the session object (populated from DB)
 * instead of a hardcoded JSON file.
 */
export function getEvaluationTemplate(session: any) {
  // 1. Title: Prefer the specific Skill, fallback to Profile
  const title = session.skill_name || session.package?.interview_profile_name || 'Evaluation Details';

  // 2. Content: The DB description now contains the Examples/Criteria text
  const content = session.skill_description 
    ? `GUIDELINES & EXAMPLES:\n\n${session.skill_description}`
    : session.package?.interview_profile_description 
    || "No specific guidelines available for this session.";

  return { title, content };
}