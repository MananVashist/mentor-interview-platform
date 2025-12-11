import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Slot, SplashScreen } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationProvider } from '@/lib/ui/NotificationBanner';
import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
// 👇 Add Asset import
import { Asset } from 'expo-asset';

// Only load fonts on native platforms (iOS/Android)
let fontsLoaded = true; 
let fontError: Error | undefined = undefined;

// 👇 Require the icon font file to get the asset URI for Web
const ioniconsFont = require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf');

if (Platform.OS !== 'web') {
  const { 
    useFonts, 
    Inter_400Regular, 
    Inter_500Medium, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    Inter_800ExtraBold 
  } = require('@expo-google-fonts/inter');
  
  const [loaded, error] = useFonts({
    // Native loading
    'Ionicons': ioniconsFont, // reusing the require from above
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  
  fontsLoaded = loaded;
  fontError = error;
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // 👇 Resolve URI for Web
  const ioniconsUri = Asset.fromModule(ioniconsFont).uri;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isReady]);

  if (!fontsLoaded || !isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <Head>
          <title>CrackJobs | Mock Interviews for Product Manager, Data Analyst, Data Scientist & HR</title>
          <meta name="description" content="Master your interview skills with expert mentors from FAANG." />
          <meta name="theme-color" content="#11998e" />
          <meta property="og:site_name" content="CrackJobs" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          
          {Platform.OS === 'web' && (
            <>
              {/* Google Fonts (Inter) - This part is fine */}
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
              
              {/* 👇 FIX: Preload Ionicons */}
              <link 
                rel="preload" 
                href={ioniconsUri} 
                as="font" 
                type="font/ttf" 
                crossOrigin="anonymous" 
              />

              {/* 👇 FIX: Inject proper CSS for React Native Web */}
              {/* Removed the <script> tags for ionicons.esm.js as they conflict */}
              <style type="text/css">{`
                @font-face {
                  font-family: 'Ionicons';
                  src: url('${ioniconsUri}') format('truetype');
                  font-display: swap;
                }
              `}</style>
            </>
          )}
        </Head>
        
        <Slot />
      </NotificationProvider>
    </SafeAreaProvider>
  );
}