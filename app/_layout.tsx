import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Slot, SplashScreen, usePathname } from 'expo-router';
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
import { trackPageView } from '@/lib/analytics';

// ⬇️ IMPORTANT: alias import to avoid name collision
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
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const pathname = usePathname();

  // Load fonts using useFonts hook
  const [fontsLoaded] = useFonts(
    Platform.OS === 'web'
      ? {
          // For web, load Ionicons from local assets
          Ionicons: require('../assets/fonts/Ionicons.ttf'),
        }
      : {
          // For native, load Inter fonts
          Inter_400Regular,
          Inter_500Medium,
          Inter_600SemiBold,
          Inter_700Bold,
          Inter_800ExtraBold,
        }
  );

  // Init session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

    return () => subscription.unsubscribe();
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
      }, 4000); // match your animation duration

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, isReady]);

  // Track page views on route changes (web only)
  useEffect(() => {
    if (Platform.OS === 'web' && !showSplash) {
      trackPageView(pathname);
    }
  }, [pathname, showSplash]);

  // Phase 0: native splash still visible
  if (!fontsLoaded || !isReady) {
    return null;
  }

  // Phase 1: animated splash
  if (showSplash) {
    return <AppSplash />;
  }

  // Phase 2: app
  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <Head>
          <title>
            CrackJobs | Mock Interviews for Product Manager, Data Analyst,
            Data Scientist & HR
          </title>
          <meta
            name="description"
            content="Master your interview skills with expert mentors from FAANG."
          />
          <meta name="theme-color" content="#11998e" />
          <meta property="og:site_name" content="CrackJobs" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />

          {Platform.OS === 'web' && (
            <>
              {/* Google Analytics */}
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />

              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
              />
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
              />
            </>
          )}
        </Head>

        <Slot />
      </NotificationProvider>
    </SafeAreaProvider>
  );
}