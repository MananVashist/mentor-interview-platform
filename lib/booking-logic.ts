import { DateTime } from 'luxon';
import { MASTER_TEMPLATES } from '@/lib/evaluation-templates';

export type BookingUIState = 
  | 'APPROVAL'       // Pending mentor approval
  | 'SCHEDULED'      // Future confirmed meeting
  | 'JOIN'           // Active window (15m before -> 60m after)
  | 'POST_PENDING'   // Past, needs evaluation
  | 'POST_COMPLETED' // Past, evaluation done
  | 'CANCELLED';

/**
 * 1. Determine the UI State based on Status + Time
 */
export function getBookingState(session: any): BookingUIState {
  if (session.status === 'pending') return 'APPROVAL';
  if (session.status === 'cancelled') return 'CANCELLED';
  if (session.status === 'completed') return 'POST_COMPLETED';

  // If status is confirmed or scheduled, we check the time
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

    // Otherwise it is in the future
    return 'SCHEDULED';
  }

  return 'SCHEDULED'; // Fallback
}

/**
 * 2. Format details (Date, Names, Profile)
 */
export function getBookingDetails(session: any) {
  const date = DateTime.fromISO(session.scheduled_at);
  
  return {
    dateLabel: date.toFormat('MMM dd, yyyy'),
    timeLabel: date.toFormat('h:mm a'),
    roundLabel: session.round ? session.round.match(/\d+/)?.[0] || '1' : '1',
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
 * Returns the specific formatted text for the modal
 */
export function getEvaluationTemplate(session: any) {
  const profileName = session.package?.interview_profile_name;
  const desc = session.package?.interview_profile_description;

  // Parse round (e.g. "Round 1" -> "round_1")
  let roundKey = 'round_1';
  if (session.round) {
    const num = session.round.match(/\d+/)?.[0] || '1';
    roundKey = `round_${num}`;
  }

  const roleTemplates = MASTER_TEMPLATES[profileName];
  const roundTemplate = roleTemplates ? roleTemplates[roundKey] : null;

  let content = "";
  if (roundTemplate) {
    content += `Evaluation Focus for ${profileName} (${roundKey.replace('_', ' ')}):\n\n`;
    roundTemplate.forEach((item: any) => {
      content += `📌 ${item.title}\n   Example: "${item.example}"\n`;
      content += `   Criteria:\n`;
      item.questions.forEach((q: any) => content += `   • ${q.text}\n`);
      content += `\n`;
    });
  } else {
    content = desc || "No specific guidelines available for this profile.";
  }

  return { title: profileName || 'Details', content };
}