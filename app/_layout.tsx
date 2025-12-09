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
import { Ionicons } from '@expo/vector-icons';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Load Ionicons and Inter fonts on ALL platforms (Web included)
  const [fontsLoaded] = useFonts({
    'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    // Initialize Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Hide Splash Screen only after fonts are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Block rendering until fonts and session check are complete
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