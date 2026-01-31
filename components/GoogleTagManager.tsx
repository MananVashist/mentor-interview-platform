// components/GoogleTagManager.tsx - OPTIMIZED VERSION
import { useEffect } from 'react';
import { Platform } from 'react-native';

const GTM_ID = 'GTM-WCMZH59K';

/**
 * GTM ONLY injection - OPTIMIZED FOR PERFORMANCE
 * - Loads 2 seconds after page is interactive (doesn't block initial render)
 * - No GA4/gtag.js in website code (GA4 lives inside GTM via Google Tag)
 * - No manual "page_view" pushes (avoid double counting)
 * - SPA pageviews handled in GTM using History Change trigger
 */
export const GoogleTagManager = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Ensure dataLayer exists immediately (lightweight)
    (window as any).dataLayer = (window as any).dataLayer || [];

    // Prevent double-injection
    if (document.getElementById('google-tag-manager')) return;

    // 🟢 PERFORMANCE FIX: Delay GTM loading until after page is interactive
    const loadGTM = () => {
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
    };

    // Wait for page to be fully loaded, then delay another 2 seconds
    if (document.readyState === 'complete') {
      // Page already loaded - delay GTM
      setTimeout(loadGTM, 2000);
    } else {
      // Wait for page load, then delay GTM
      window.addEventListener('load', () => {
        setTimeout(loadGTM, 2000);
      });
    }
  }, []);

  return null;
};