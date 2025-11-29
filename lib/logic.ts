// lib/logic.ts

/**
 * Calculates the mentor's tier based on their completed session count.
 * Logic:
 * - 0 sessions: New
 * - 1-10 sessions: Bronze
 * - 11-20 sessions: Silver
 * - 21+ sessions: Gold
 */
export function calculateMentorTier(sessionCount: number | null | undefined): string {
  const count = sessionCount || 0;

  if (count === 0) return 'New';
  if (count <= 10) return 'Bronze';
  if (count <= 20) return 'Silver';
  return 'Gold';
}

/**
 * Formats a UTC ISO date string to a readable IST string.
 * Use this for display purposes.
 */
export function formatToIST(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}