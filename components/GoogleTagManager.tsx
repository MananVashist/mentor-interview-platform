// components/GoogleTagManager.tsx
import { useEffect } from 'react';
import { Platform } from 'react-native';

const GTM_ID = 'GTM-WCMZH59K';

/**
 * GTM ONLY injection.
 * - No GA4/gtag.js in website code (GA4 lives inside GTM via Google Tag).
 * - No manual "page_view" pushes (avoid double counting).
 * - SPA pageviews should be handled in GTM using History Change trigger.
 */
export const GoogleTagManager = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Ensure dataLayer exists
    (window as any).dataLayer = (window as any).dataLayer || [];

    // Prevent double-injection across rerenders/layouts
    if (document.getElementById('google-tag-manager')) return;

    const script = document.createElement('script');
    script.id = 'google-tag-manager';
    script.async = true;

    // Standard GTM loader snippet
    script.text = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `;

    document.head.appendChild(script);
  }, []);

  return null;
};
