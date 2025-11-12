import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';

export default function CandidateLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, clear } = useAuthStore();
  const { width } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDesktop = width >= 768;

  const handleSignOut = async () => {
    await authService.signOut();
    clear();
    router.replace('/(auth)/sign-in');
  };

  // Side menu items as per requirement
  const menuItems = [
    { 
      name: 'Browse Mentors', 
      path: '/(candidate)', 
      icon: 'search-outline',
      description: 'Find and book mentors'
    },
    { 
      name: 'My Profile', 
      path: '/(candidate)/profile', 
      icon: 'person-outline',
      description: 'Resume & LinkedIn'
    },
    { 
      name: 'My Bookings', 
      path: '/(candidate)/bookings', 
      icon: 'calendar-outline',
      description: 'Your upcoming sessions'
    },
  ];

  const isActive = (path: string) => {
    if (path === '/(candidate)') {
      return pathname === '/(candidate)' || pathname === '/' || 
             (pathname.includes('/(candidate)') && !pathname.includes('/profile') && !pathname.includes('/bookings'));
    }
    return pathname.includes(path);
  };

  const Sidebar = () => (
    <View style={styles.sidebar}>
      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0).toUpperCase() || 'C'}
          </Text>
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {profile?.full_name || 'Candidate'}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {profile?.email}
        </Text>
      </View>

      {/* Navigation Menu */}
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
                  color={active ? '#2563eb' : '#6b7280'}
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

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Mobile Header */}
      {!isDesktop && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity 
            onPress={() => setMenuOpen(!menuOpen)}
            style={styles.menuButton}
          >
            <Ionicons name={menuOpen ? "close" : "menu"} size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.mobileHeaderTitle}>Interview Platform</Text>
          <View style={{ width: 40 }} />
        </View>
      )}

      <View style={styles.content}>
        {/* Desktop Sidebar */}
        {isDesktop && <Sidebar />}

        {/* Mobile Sidebar */}
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

        {/* Main Content Area */}
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
    backgroundColor: '#2563eb',
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
    backgroundColor: '#eff6ff',
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
    color: '#2563eb',
    fontWeight: '600',
  },
  menuDescription: {
    fontSize: 11,
    color: '#9ca3af',
  },
  activeIndicator: {
    width: 3,
    height: '100%',
    backgroundColor: '#2563eb',
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