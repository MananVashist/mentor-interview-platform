// components/GoogleTagManager.tsx
import { useEffect } from 'react';
import { Platform } from 'react-native';

const GTM_ID = 'GTM-WCMZH59K';

export const GoogleTagManager = () => {
  useEffect(() => {
    // 1. Guard clause: Only run on Web
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // 2. The GTM Loader Function
    const loadGTM = () => {
      if ((window as any).__GTM_LOADED__) return;
      (window as any).__GTM_LOADED__ = true;

      // Initialize dataLayer
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });

      // Inject Script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      script.async = true;
      document.head.appendChild(script);

      console.log('[GTM] ✅ Google Tag Manager loaded lazy (on interaction)');
    };

    // 3. Event Listeners for "User Interaction"
    const userInteractionEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    const triggerLoad = () => {
      loadGTM();
      // Cleanup listeners immediately after firing once
      userInteractionEvents.forEach(event => 
        window.removeEventListener(event, triggerLoad)
      );
    };

    // 4. Attach listeners (passive for performance)
    userInteractionEvents.forEach(event => 
      window.addEventListener(event, triggerLoad, { passive: true })
    );

    // Cleanup on unmount
    return () => {
      userInteractionEvents.forEach(event => 
        window.removeEventListener(event, triggerLoad)
      );
    };
  }, []);

  return null;
};