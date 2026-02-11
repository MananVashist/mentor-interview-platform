// app/_layout.tsx
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Slot, SplashScreen } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationProvider } from '@/lib/ui/NotificationBanner';
import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

import { GoogleTagManager } from '@/components/GoogleTagManager';
// alias import to avoid name collision
import { SplashScreen as AppSplash } from '@/components/SplashScreen';

// Prevent native splash from auto-hiding
SplashScreen.preventAutoHideAsync();

// Web static routing safeguard
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const staticPaths = ['/robots.txt', '/sitemap.xml', '/_headers'];
  if (staticPaths.includes(window.location.pathname)) {
    window.location.reload();
  }
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // SEO FIX: Disable custom splash by default on Web.
  const [showSplash, setShowSplash] = useState(Platform.OS !== 'web');

  // Load fonts using useFonts hook
  const [fontsLoaded] = useFonts(
    Platform.OS === 'web'
      ? {
          Ionicons: require('../assets/fonts/Ionicons.ttf'),
        }
      : {
          Inter_400Regular,
          Inter_500Medium,
          Inter_600SemiBold,
          Inter_700Bold,
          Inter_800ExtraBold,
        }
  );

  // CRITICAL FIX: Process recovery token FIRST, before any auth checks
  useEffect(() => {
    let mounted = true;

    const handleRecoveryToken = async () => {
      // Only run on web platform
      if (Platform.OS !== 'web' || typeof window === 'undefined') {
        return false;
      }

      const hash = window.location.hash;
      const pathname = window.location.pathname;

      // Check if this is a password reset page with recovery token
      if (pathname.includes('/auth/reset-password') && 
          hash.includes('access_token=') && 
          hash.includes('type=recovery')) {
        
        console.log('[App] 🔐 Processing recovery token EARLY to prevent auth errors...');
        
        try {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken) {
            // Set the session IMMEDIATELY before any other auth checks
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (error) {
              console.error('[App] ❌ Failed to set recovery session:', error);
              return false;
            }

            if (data.session && mounted) {
              console.log('[App] ✅ Recovery session established early');
              setSession(data.session);
              return true; // Token processed successfully
            }
          }
        } catch (err) {
          console.error('[App] ❌ Exception processing recovery token:', err);
        }
      }

      return false; // No recovery token or failed to process
    };

    // Init session
    const initSession = async () => {
      // First, try to handle recovery token if present
      const tokenProcessed = await handleRecoveryToken();
      
      if (tokenProcessed && mounted) {
        // Recovery token was processed, we already have the session
        setIsReady(true);
        return;
      }

      // Normal session initialization
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (mounted) {
          setSession(session);
          setIsReady(true);
        }
      });
    };

    initSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Native splash → animated splash → app
  useEffect(() => {
    if (fontsLoaded && isReady) {
      SplashScreen.hideAsync();

      if (Platform.OS === 'web') {
        setShowSplash(false);
        return;
      }

      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, isReady]);

  const shouldBlockRender = Platform.OS !== 'web' && (!fontsLoaded || !isReady);

  if (shouldBlockRender) return null;

  // Phase 1: animated splash (Native Only)
  if (showSplash) return <AppSplash />;

  // Phase 2: app
  return (
    <>
      {/* Tracking is handled via GTM container only (no direct gtag.js on site). */}
      <GoogleTagManager />

      <SafeAreaProvider>
        <NotificationProvider>
          <Head>
            <title>
              CrackJobs | Mock Interviews for Product Manager, Data Analyst, Data
              Scientist & HR
            </title>
            <meta
              name="description"
              content="Master your interview skills with expert mentors from FAANG."
            />
            <meta name="theme-color" content="#11998e" />
            <meta property="og:site_name" content="CrackJobs" />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
          </Head>

          <Slot />
        </NotificationProvider>
      </SafeAreaProvider>
    </>
  );
}