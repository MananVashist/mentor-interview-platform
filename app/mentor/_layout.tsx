// app/mentor/_layout.tsx
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';
import { mentorService } from '@/services/mentor.service';

export default function MentorLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  
  const { user, profile, mentorProfile, setMentorProfile, clear } = useAuthStore();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const isDesktop = width >= 768;

  // 🔒 ENHANCED GATEKEEPER LOGIC
  useEffect(() => {
    const checkMentorStatus = async () => {
      // 1. If no user/profile, let root _layout handle auth
      if (!user || !profile) {
        setIsCheckingStatus(false);
        return;
      }

      // 2. Allow Admin overrides
      if (profile.role === 'admin' || profile.is_admin) {
        console.log('✅ [Layout] Admin access granted');
        setIsCheckingStatus(false);
        return;
      }

      // 3. Get fresh mentor status from DB (don't trust store)
      let currentMentor = null;
      
      try {
        currentMentor = await mentorService.getMentorById(user.id);
        
        if (currentMentor) {
          setMentorProfile(currentMentor);
          console.log('🔵 [Layout] Mentor status:', currentMentor.status);
        } else {
          console.warn('⚠️ [Layout] No mentor record found for user:', user.id);
        }
      } catch (err) {
        console.error('❌ [Layout] Error fetching mentor status:', err);
      }

      // 4. STRICT CHECK - Only 'approved' status allowed
      const isUnderReviewPage = pathname.includes('/under-review');
      
      // ✅ FIX: Only check 'status' column (ignore deprecated is_approved)
      const isApproved = currentMentor?.status === 'approved';

      if (!isApproved && !isUnderReviewPage) {
        console.log('⛔ [Layout] Access DENIED - Status:', currentMentor?.status || 'missing');
        await authService.signOut(); // Force sign out
        clear(); // Clear store
        router.replace('/mentor/under-review');
      } else if (isApproved && isUnderReviewPage) {
        console.log('✅ [Layout] Approved mentor on under-review, redirecting to dashboard');
        router.replace('/mentor/bookings');
      } else if (isApproved) {
        console.log('✅ [Layout] Access granted - Mentor approved');
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

  const menuItems = [
    { 
      name: 'My Profile', 
      path: '/mentor/profile', 
      icon: 'person-outline',
      description: 'Professional details'
    },
    { 
      name: 'Mentorship', 
      path: '/mentor/mentorship', 
      icon: 'school-outline',
      description: 'Pricing & levels'
    },
    { 
      name: 'My Bookings', 
      path: '/mentor/bookings', 
      icon: 'calendar-outline',
      description: 'Scheduled sessions'
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const Sidebar = () => (
    <View style={styles.sidebar}>
      <View style={styles.userSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0).toUpperCase() || 'M'}
          </Text>
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {profile?.full_name || 'Mentor'}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {profile?.email}
        </Text>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: mentorProfile?.status === 'approved' ? '#DCFCE7' : '#FEF3C7' }]}>
           <Text style={[styles.statusText, { color: mentorProfile?.status === 'approved' ? '#166534' : '#D97706' }]}>
             {mentorProfile?.status?.toUpperCase() || 'PENDING'}
           </Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuLabel}>MENU</Text>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <TouchableOpacity
              key={item.path}
              style={[styles.menuItem, active && styles.menuItemActive]}
              onPress={() => {
                router.push(item.path as any);
                setMenuOpen(false);
              }}
            >
              <View style={styles.menuItemContent}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={active ? '#0E9384' : '#6b7280'}
                />
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuText, active && styles.menuTextActive]}>
                    {item.name}
                  </Text>
                  <Text style={styles.menuDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
              {active && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

  // Loading state
  if (isCheckingStatus) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
              <ActivityIndicator size="large" color="#0E9384" />
              <Text style={{ marginTop: 12, color: '#6B7280' }}>Verifying account status...</Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      {!isDesktop && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity 
            onPress={() => setMenuOpen(!menuOpen)}
            style={styles.menuButton}
          >
            <Ionicons name={menuOpen ? "close" : "menu"} size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.mobileHeaderTitle}>CrackJobs</Text>
          <View style={{ width: 40 }} />
        </View>
      )}

      <View style={styles.content}>
        {isDesktop && <Sidebar />}

        {!isDesktop && menuOpen && (
          <>
            <Pressable 
              style={styles.overlay} 
              onPress={() => setMenuOpen(false)} 
            />
            <View style={styles.sidebarMobile}>
              <Sidebar />
            </View>
          </>
        )}

        <View style={styles.mainContent}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  sidebarMobile: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    zIndex: 50,
    backgroundColor: '#ffffff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40,
  },
  userSection: {
    padding: 24,
    paddingTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0E9384',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
  },
  statusText: {
      fontSize: 10,
      fontWeight: '700',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 16,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    paddingHorizontal: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 2,
  },
  menuItemActive: {
    backgroundColor: 'rgba(14,147,132,0.08)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  menuTextActive: {
    color: '#0E9384',
    fontWeight: '600',
  },
  menuDescription: {
    fontSize: 11,
    color: '#9ca3af',
  },
  activeIndicator: {
    width: 3,
    height: '100%',
    backgroundColor: '#0E9384',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 'auto',
  },
  signOutText: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});