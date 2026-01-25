import { Platform } from 'react-native';

/**
 * Google Tag Manager helper for tracking custom events
 * Works on web only - mobile platforms are ignored
 * Uses dataLayer to send events to GTM
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, any>>;
  }
}

/**
 * Track a custom event in Google Tag Manager via dataLayer
 * @param eventName - Name of the event (e.g., 'sign_up', 'select_mentor')
 * @param params - Optional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
): void => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
    
    // Debug log (remove in production if needed)
    console.log('GTM Event Tracked:', eventName, params);
  }
};

/**
 * Track a page view manually (auto-tracked by GoogleTagManager component)
 * @param path - Page path (e.g., '/candidate/dashboard')
 * @param title - Optional page title
 */
export const trackPageView = (path: string, title?: string): void => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
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
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'user_properties',
      user_properties: properties,
    });
  }
};