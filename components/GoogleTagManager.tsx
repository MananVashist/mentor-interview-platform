// components/GoogleTagManager.tsx
import { useEffect } from 'react';
import { Platform } from 'react-native';

const GTM_ID = 'GTM-WCMZH59K';

/**
 * Google Tag Manager - Standard Implementation
 * 
 * Uses async GTM loading for reliable conversion tracking.
 * Compatible with Google Ads, Tag Assistant, and all debugging tools.
 */
export const GoogleTagManager = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined') return;

    // Prevent double-injection
    if ((window as any).__GTM_LOADED__) return;
    (window as any).__GTM_LOADED__ = true;

    // Initialize dataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    // Load GTM script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    script.async = true;
    document.head.appendChild(script);

    console.log('[GTM] ✅ Google Tag Manager loaded');
    console.log('[GTM] Container:', GTM_ID);

    // Debug helper
    (window as any).debugGTM = () => {
      console.log('========== GTM Debug Info ==========');
      console.log('Container ID:', GTM_ID);
      console.log('DataLayer:', (window as any).dataLayer);
      console.log('GTM Loaded:', !!(window as any).__GTM_LOADED__);
      console.log('====================================');
      console.log('\nTest conversion:');
      console.log('window.dataLayer.push({');
      console.log('  event: "Payment_success",');
      console.log('  transaction_id: "test_" + Date.now(),');
      console.log('  value: 1500,');
      console.log('  currency: "INR"');
      console.log('});');
      return (window as any).dataLayer;
    };

  }, []);

  return null;
};

/**
 * VERIFICATION:
 * 
 * Check GTM loads:
 * - Console: dataLayer
 * - Console: debugGTM()
 * - Tag Assistant: Should detect GTM-WCMZH59K ✅
 * 
 * Test conversions:
 * window.dataLayer.push({
 *   event: 'Payment_success',
 *   transaction_id: 'test_' + Date.now(),
 *   value: 1500,
 *   currency: 'INR'
 * });
 * 
 * Use GTM Preview Mode:
 * 2. Click "Preview"
 * 3. Enter your site URL
 * 4. See all tags firing
 */