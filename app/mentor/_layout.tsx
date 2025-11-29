// app/mentor/_layout.tsx
import { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';
import { mentorService } from '@/services/mentor.service';
import { DashboardLayout } from '@/components/layout/DashboardLayout'; // Import shared component

export default function MentorLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, mentorProfile, setMentorProfile, clear } = useAuthStore();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // 🔒 GATEKEEPER LOGIC (Unchanged)
  useEffect(() => {
    const checkMentorStatus = async () => {
      if (!user || !profile) {
        setIsCheckingStatus(false);
        return;
      }

      // Admin Override
      if (profile.role === 'admin' || profile.is_admin) {
        setIsCheckingStatus(false);
        return;
      }

      // Fetch Mentor Data
      let currentMentor = null;
      try {
        currentMentor = await mentorService.getMentorById(user.id);
        if (currentMentor) {
          setMentorProfile(currentMentor);
        }
      } catch (err) {
        console.error('❌ [Layout] Error fetching mentor status:', err);
      }

      // Redirect Logic
      const isUnderReviewPage = pathname.includes('/under-review');
      const isApproved = currentMentor?.status === 'approved';

      if (!isApproved && !isUnderReviewPage) {
        // Not approved, trying to access dashboard -> Send to Under Review
        await authService.signOut(); 
        clear();
        router.replace('/mentor/under-review');
      } else if (isApproved && isUnderReviewPage) {
        // Approved, trying to access Under Review -> Send to Dashboard
        router.replace('/mentor/bookings');
      }

      setIsCheckingStatus(false);
    };

    checkMentorStatus();
  }, [pathname, user, profile]);

  const handleSignOut = async () => {
    await authService.signOut();
    clear();
    router.replace('/auth/sign-in');
  };

  // Mentor Menu
  const mentorMenuItems = [
    { name: 'My Profile', path: '/mentor/profile', icon: 'person-outline' as const },
    { name: 'Mentorship', path: '/mentor/mentorship', icon: 'school-outline' as const },
    { name: 'My Bookings', path: '/mentor/bookings', icon: 'calendar-outline' as const },
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

  // Render Dashboard for all other mentor pages
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