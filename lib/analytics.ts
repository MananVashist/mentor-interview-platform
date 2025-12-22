import { Platform } from 'react-native';

/**
 * Google Analytics helper for tracking custom events
 * Works on web only - mobile platforms are ignored
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

/**
 * Track a custom event in Google Analytics
 * @param eventName - Name of the event (e.g., 'booking_started')
 * @param params - Optional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
): void => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track a page view manually (auto-tracked by default, use for SPA navigation)
 * @param path - Page path (e.g., '/candidate/dashboard')
 * @param title - Optional page title
 */
export const trackPageView = (path: string, title?: string): void => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: path,
      page_title: title,
    });
  }
};

/**
 * Track user properties (e.g., user role, tier)
 * @param properties - User properties to set
 */
export const setUserProperties = (
  properties: Record<string, any>
): void => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};