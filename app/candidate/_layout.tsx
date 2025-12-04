// app/candidate/_layout.tsx
import { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase/client'; // 🟢 Import supabase

export default function CandidateLayout() {
  const router = useRouter();
  // 🟢 Destructure setters to update store on refresh
  const { user, profile, setUser, setProfile, clear } = useAuthStore();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const checkCandidateStatus = async () => {
      try {
        // 🟢 REHYDRATION LOGIC
        // If store is empty (user refreshed), try to fetch from Supabase
        if (!user) {
          const { data: { user: authUser } } = await supabase.auth.getUser();

          if (!authUser) {
            // No session? Kick them out.
            await handleSignOut();
            return;
          }

          // Session exists, but profile is missing. Fetch it.
          const { data: fetchedProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (error || !fetchedProfile) {
            console.error("❌ Error fetching candidate profile on refresh", error);
            await handleSignOut();
            return;
          }

          // Hydrate the store
          setUser(authUser);
          setProfile(fetchedProfile);
        }
        
      } catch (err) {
        console.error('❌ [CandidateLayout] Error:', err);
        await handleSignOut();
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkCandidateStatus();
  }, [user]); 

  const handleSignOut = async () => {
    await authService.signOut();
    clear();
    router.replace('/auth/sign-in');
  };

  const candidateMenuItems = [
    { name: 'Browse Mentors', path: '/candidate', icon: 'search-outline' as const },
    { name: 'My Bookings', path: '/candidate/bookings', icon: 'calendar-outline' as const },
    { name: 'My Profile', path: '/candidate/profile', icon: 'person-outline' as const },
  ];

  // 🟢 Loading State to prevent UI flash/crash
  if (isCheckingStatus) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5F0' }}>
        <ActivityIndicator size="large" color="#0E9384" />
        <Text style={{ marginTop: 12, color: '#6B7280' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <DashboardLayout
      userProfile={profile}
      menuItems={candidateMenuItems}
      onSignOut={handleSignOut}
    >
      <Slot />
    </DashboardLayout>
  );
}