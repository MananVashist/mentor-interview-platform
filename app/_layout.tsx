import { useEffect } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import Head from 'expo-router/head';
import { Platform } from 'react-native';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';

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
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      {/* Global Fallback SEO - Applies to all pages unless overridden */}
      <Head>
        <title>CrackJobs - Ace Your Tech Interviews</title>
        <meta name="description" content="Master your interview skills with expert mentors from FAANG. Practice mock interviews for PM, SDE, and Engineering Manager roles." />
        <meta name="theme-color" content="#11998e" />
        <meta property="og:site_name" content="CrackJobs" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Slot />
    </>
  );
}