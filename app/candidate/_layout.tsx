// app/candidate/_layout.tsx
import { Slot, useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CandidateLayout() {
  const router = useRouter();
  const { profile, clear } = useAuthStore();

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