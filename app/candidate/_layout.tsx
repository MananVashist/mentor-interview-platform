// app/candidate/_layout.tsx
import { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase/client';

export default function CandidateLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, profile, setUser, setProfile, clear } = useAuthStore();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // 🟢 PAYMENT FLOW BYPASS — no enforcer redirect AND no DashboardLayout chrome.
  //   review         → active booking being configured
  //   pgscreen       → Razorpay is open, any redirect = lost payment
  //   booking-confirmed → post-payment; profile is intentionally null here
  //   complete-profile  → legacy fallback, kept for safety
  const isPaymentFlow =
    segments.includes('review') ||
    segments.includes('pgscreen') ||
    segments.includes('booking-confirmed') ||
    segments.includes('complete-profile');

  // 🟢 ENFORCER BYPASS — extends payment flow with 'profile' so the enforcer
  // never redirects away from the profile page itself (infinite loop prevention).
  // Unlike payment screens, profile still gets the full DashboardLayout.
  const isEnforcerBypass = isPaymentFlow || segments.includes('profile');

  useEffect(() => {
    const checkCandidateStatus = async () => {
      try {
        let currentUser = user;

        if (!currentUser) {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (!authUser) {
            await handleSignOut();
            return;
          }
          currentUser = authUser;
        }

        const { data: fetchedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        const { data: fetchedCandidate } = await supabase
          .from('candidates')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        const title = fetchedCandidate?.professional_title?.trim() || '';
        const name = fetchedProfile?.full_name?.trim() || '';
        const needsProfile = !title || !name;

        if (needsProfile && !isEnforcerBypass) {
          setIsCheckingStatus(false);
          router.replace('/candidate/profile');
          return;
        }

        if (!user) {
          setUser(currentUser);
          // 🟢 Always hydrate the store from DB so the sidebar name is always fresh
          if (fetchedProfile) setProfile(fetchedProfile);
        }

      } catch (err) {
        console.error('❌ [CandidateLayout] Error:', err);
        await handleSignOut();
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkCandidateStatus();
  }, [user, segments]);

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

  if (isCheckingStatus) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5F0' }}>
        <ActivityIndicator size="large" color="#0E9384" />
        <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 14 }}>Loading dashboard...</Text>
      </View>
    );
  }

  // Payment/onboarding flow: bare Slot — no sidebar, no escape hatch
  if (isPaymentFlow) {
    return <Slot />;
  }

  // 🟢 FIX: Pass `userProfile={profile}` (the full object), NOT `userName` (a string).
  // DashboardLayout reads `userProfile?.full_name` and `userProfile?.full_name[0]`
  // for the avatar initial. Passing a string means both always come back undefined.
  // Since `profile` is reactive in the zustand store, updating it in profile.tsx
  // via `setProfile({...profile, full_name: ...})` will cause this layout to
  // re-render and the sidebar name will update immediately.
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