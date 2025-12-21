// app/mentor/_layout.tsx
import { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';
import { mentorService } from '@/services/mentor.service';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase/client'; 

export default function MentorLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, mentorProfile, setMentorProfile, setUser, setProfile, clear } = useAuthStore();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const checkMentorStatus = async () => {
      try {
        // 🟢 1. REHYDRATION LOGIC
        // If the store is empty (refresh), try to get the user/profile again.
        let currentUser = user;
        let currentProfile = profile;

        if (!currentUser) {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (!authUser) {
            // No session at all? Kick them out.
            await handleSignOut();
            return;
          }

          // We have a session, but no profile data in store. Fetch it.
          const { data: fetchedProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (error || !fetchedProfile) {
            console.error("Error fetching profile on refresh", error);
            await handleSignOut();
            return;
          }

          // Hydrate the store
          setUser(authUser);
          setProfile(fetchedProfile);
          currentUser = authUser;
          currentProfile = fetchedProfile;
        }

        // 🟢 2. ADMIN BYPASS
        if (currentProfile?.role === 'admin' || currentProfile?.is_admin) {
          setIsCheckingStatus(false);
          return;
        }

        // 🟢 3. FETCH MENTOR DATA
        // Check if we already have it to avoid double fetching
        if (!mentorProfile && currentUser) {
          const fetchedMentor = await mentorService.getMentorById(currentUser.id);
          if (fetchedMentor) {
            setMentorProfile(fetchedMentor);
            // Use local variable for the check below
            var activeMentorStatus = fetchedMentor.status; 
          }
        } else {
           var activeMentorStatus = mentorProfile?.status;
        }

        // 🟢 4. REDIRECT LOGIC
        const isUnderReviewPage = pathname.includes('/under-review');
        const isApproved = activeMentorStatus === 'approved';

        if (!isApproved && !isUnderReviewPage) {
          // Not approved yet -> Force them to the "Under Review" page
          router.replace('/mentor/under-review');
        } else if (isApproved && isUnderReviewPage) {
          // Approved but trying to see "Under Review" -> Send to Dashboard
          router.replace('/mentor/bookings');
        }

      } catch (err) {
        console.error('❌ [Layout] Error checking mentor status:', err);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkMentorStatus();
  }, [pathname, user, profile]); 

  const handleSignOut = async () => {
    await authService.signOut();
    clear();
    router.replace('/auth/sign-in');
  };

  const mentorMenuItems = [
    { name: 'My Profile', path: '/mentor/profile', icon: 'person-outline' as const },
    { name: 'My Bookings', path: '/mentor/bookings', icon: 'calendar-outline' as const },
    { name: 'Mentorship', path: '/mentor/mentorship', icon: 'trophy-outline' as const },
  ];

  if (isCheckingStatus) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5F0' }}>
        <ActivityIndicator size="large" color="#0E9384" />
        <Text style={{ marginTop: 12, color: '#6B7280' }}>Verifying account status...</Text>
      </View>
    );
  }

  // ⚡ CRITICAL: Do not render Dashboard Layout if Under Review
  if (pathname.includes('/under-review')) {
    return <Slot />;
  }

  return (
    <DashboardLayout
      userProfile={profile}
      menuItems={mentorMenuItems}
      onSignOut={handleSignOut}
    >
      <Slot />
    </DashboardLayout>
  );
}   