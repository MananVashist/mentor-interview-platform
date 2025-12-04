import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Slot, SplashScreen } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';
import { NotificationProvider } from '@/lib/ui/NotificationBanner';
import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const [fontsLoaded] = useFonts(
    Platform.OS === 'web'
      ? {} 
      : {
          Inter_400Regular,
          Inter_500Medium,
          Inter_600SemiBold,
          Inter_700Bold,
          Inter_800ExtraBold,
        }
  );

  useEffect(() => {
    // 1. Initialize Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Hide Splash Screen only after fonts are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    return () => subscription.unsubscribe();
  }, [fontsLoaded]);

  // Block rendering until session check is complete
  if (!isReady) {
    return null;
  }

  // Mobile: Wait for fonts to prevent crash/glitch
  if (!fontsLoaded && Platform.OS !== 'web') {
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
        </Head>
        
        <Slot />
      </NotificationProvider>
    </SafeAreaProvider>
  );
}