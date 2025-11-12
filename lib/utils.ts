import { DateTime } from 'luxon';

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, format: string = 'MMM dd, yyyy'): string {
  return DateTime.fromISO(date.toString()).toFormat(format);
}

/**
 * Format time to readable string
 */
export function formatTime(time: string): string {
  return DateTime.fromISO(`2000-01-01T${time}`).toFormat('h:mm a');
}

/**
 * Format datetime to readable string
 */
export function formatDateTime(datetime: string, format: string = 'MMM dd, yyyy h:mm a'): string {
  return DateTime.fromISO(datetime).toFormat(format);
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(datetime: string): string {
  return DateTime.fromISO(datetime).toRelative() || '';
}

/**
 * Check if a datetime is in the past
 */
export function isPast(datetime: string): boolean {
  return DateTime.fromISO(datetime) < DateTime.now();
}

/**
 * Check if a datetime is in the future
 */
export function isFuture(datetime: string): boolean {
  return DateTime.fromISO(datetime) > DateTime.now();
}

/**
 * Get available time slots for a given day
 */
export function getAvailableSlots(
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  slotDuration: number = 60
): string[] {
  const slots: string[] = [];
  const start = DateTime.fromISO(`2000-01-01T${startTime}`);
  const end = DateTime.fromISO(`2000-01-01T${endTime}`);

  let current = start;
  while (current < end) {
    slots.push(current.toFormat('HH:mm'));
    current = current.plus({ minutes: slotDuration });
  }

  return slots;
}

/**
 * Format currency (INR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate session end time
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const start = DateTime.fromISO(startTime);
  const end = start.plus({ minutes: durationMinutes });
  return end.toISO()!;
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate meeting link (placeholder)
 */
export function generateMeetingLink(sessionId: string): string {
  // TODO: Integrate with actual Zoom/Google Meet API
  return `https://meet.mentorplatform.com/${sessionId}`;
}
