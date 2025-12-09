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
// 1. Import Ionicons component
import { Ionicons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // 2. Load Fonts: Use '...Ionicons.font' instead of the long hardcoded path.
  // This safely loads the font file from the package, regardless of OS.
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font, 
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. White Screen Fix: Unblock splash screen even if fonts fail
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }

    return () => subscription.unsubscribe();
  }, [fontsLoaded, fontError]);

  if (!isReady) {
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
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/7.1.0/collection/components/icon/icon.min.css"
          />
        </Head>
        
        <Slot />
      </NotificationProvider>
    </SafeAreaProvider>
  );
}