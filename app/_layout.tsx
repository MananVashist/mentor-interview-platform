import { useEffect } from 'react';
import { Platform } from 'react-native'; // 1. Import Platform
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

SplashScreen.preventAutoHideAsync();

// app/_layout.tsx

// ... keep your imports ...

export default function RootLayout() {
  // 🟢 FIX: Pass an EMPTY object on Web.
  // This stops the browser from downloading the files in your screenshot.
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
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // ... keep the rest of your code ...

  // ---------------------------------------------------------
  // THE LOGIC SPLIT
  // ---------------------------------------------------------
  
  // Mobile: We MUST wait for fonts, or the app will crash/look broken.
  // We return 'null' to keep the native white splash screen visible until fonts are ready.
  if (!fontsLoaded && Platform.OS !== 'web') {
    return null;
  }

  // Web: We do NOT wait. 
  // Even if !fontsLoaded, we render the <Slot /> immediately.
  // Because 'index.tsx' uses System Fonts, it will look perfect instantly.
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