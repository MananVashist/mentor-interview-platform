import { useEffect } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import Head from 'expo-router/head';
import { Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';
import { ToastBanner } from '@/components/ToastBanner'; // 🟢 Import Toast

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

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <Head>
        <title>CrackJobs - Ace Your Tech Interviews</title>
        <meta name="description" content="Master your interview skills with expert mentors from FAANG." />
        <meta name="theme-color" content="#11998e" />
      </Head>

      {/* 🟢 ToastBanner sits here, outside SafeAreaView to overlay everything */}
      <ToastBanner />

      <SafeAreaView 
        style={{ flex: 1, backgroundColor: '#f8f5f0' }} 
        edges={Platform.OS === 'web' ? [] : ['top', 'left', 'right']}
      >
        <Slot />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}