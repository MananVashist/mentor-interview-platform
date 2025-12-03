import { useEffect } from 'react';
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

// 1. Import your custom splash screen component (Renamed to avoid conflict)
import { SplashScreen as CustomSplash } from '../components/SplashScreen';

// Keep the native splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the native white screen once fonts are ready
      // (Your CustomSplash will have already been showing)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 2. THE FIX: Show your Custom Splash Screen while fonts load.
  // Since CustomSplash uses system fonts (Courier), it renders INSTANTLY (0ms).
  // This counts as "Content" for Lighthouse, fixing the "Font display" penalty.
  if (!fontsLoaded) {
    return <CustomSplash />;
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