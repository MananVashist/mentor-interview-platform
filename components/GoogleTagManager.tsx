// components/GoogleTagManager.tsx - Conditional Partytown
import { useEffect } from 'react';
import { Platform } from 'react-native';

const GTM_ID = 'GTM-WCMZH59K';

// Use Partytown only in production for SEO
// Development uses standard GTM for Tag Assistant compatibility
const USE_PARTYTOWN = Platform.OS === 'web' && 
                      typeof window !== 'undefined' && 
                      window.location.hostname !== 'localhost' &&
                      !window.location.hostname.includes('127.0.0.1');

export const GoogleTagManager = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined') return;

    // Initialize dataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'gtm_init',
      timestamp: new Date().toISOString()
    });

    if (USE_PARTYTOWN) {
      // PRODUCTION: Use Partytown for performance
      loadWithPartytown();
    } else {
      // DEVELOPMENT: Use standard GTM for Tag Assistant
      loadStandardGTM();
    }

    // Debug helper (works for both)
    (window as any).debugGTM = () => {
      console.log('========== GTM Debug Info ==========');
      console.log('Container ID:', GTM_ID);
      console.log('Mode:', USE_PARTYTOWN ? 'Partytown (Production)' : 'Standard (Development)');
      console.log('DataLayer events:', (window as any).dataLayer);
      console.log('Partytown loaded:', !!(window as any).__GTM_PARTYTOWN_LOADED__);
      console.log('Standard loaded:', !!(window as any).__GTM_LOADED__);
      console.log('====================================');
      return (window as any).dataLayer;
    };

  }, []);

  return null;
};

function loadWithPartytown() {
  if ((window as any).__GTM_PARTYTOWN_LOADED__) return;
  (window as any).__GTM_PARTYTOWN_LOADED__ = true;

  // Configure Partytown
  (window as any).partytown = {
    lib: "/~partytown/",
    forward: ["dataLayer.push"],
    debug: false,
  };

  // Load Partytown library
  const partytownScript = document.createElement('script');
  partytownScript.src = '/~partytown/partytown.js?v=0.10.2';
  partytownScript.async = true;
  document.head.appendChild(partytownScript);

  // Load GTM in web worker
  setTimeout(() => {
    const gtmScript = document.createElement('script');
    gtmScript.id = 'google-tag-manager';
    gtmScript.type = 'text/partytown';
    gtmScript.text = `
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),
            dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.type='text/partytown';
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `;
    document.head.appendChild(gtmScript);
    
    console.log('[Partytown] ✅ GTM loaded in web worker (production mode)');
    console.log('[Partytown] Tag Assistant won\'t work - use GTM Preview mode');
    console.log('[Partytown] Type "debugGTM()" for debug info');
  }, 100);
}

function loadStandardGTM() {
  if ((window as any).__GTM_LOADED__) return;
  (window as any).__GTM_LOADED__ = true;

  (window as any).dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  script.async = true;
  document.head.appendChild(script);

  console.log('[GTM] ✅ Standard GTM loaded (development mode)');
  console.log('[GTM] Tag Assistant will work');
  console.log('[GTM] Type "debugGTM()" for debug info');
}

/**
 * VERIFICATION GUIDE:
 * 
 * DEVELOPMENT (localhost):
 * - Uses standard GTM
 * - Tag Assistant WILL work ✅
 * - Type: dataLayer (should show events)
 * - Network tab: look for gtm.js
 * 
 * PRODUCTION (crackjobs.com):
 * - Uses Partytown (SEO optimized)
 * - Tag Assistant WON'T work ❌
 * - Use GTM Preview mode instead:
 *   1. Go to https://tagmanager.google.com
 *   2. Click "Preview"
 *   3. Enter: https://crackjobs.com
 *   4. See all tags firing
 * 
 * TEST CONVERSIONS (both environments):
 * window.dataLayer.push({
 *   event: 'payment_success',
 *   transaction_id: 'test_' + Date.now(),
 *   value: 1500,
 *   currency: 'INR'
 * });
 */