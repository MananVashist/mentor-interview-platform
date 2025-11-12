import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';

export default function MentorLayout() {
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

  const menuItems = [
    { name: 'My Profile', path: '/(mentor)/profile', icon: 'person' },
    { name: 'My Bookings', path: '/(mentor)/bookings', icon: 'calendar' },
    { name: 'My Mentorship', path: '/(mentor)/mentorship', icon: 'trophy' },
  ];

  const isActive = (path: string) => {
    if (path === '/(mentor)/profile') {
      return pathname === '/(mentor)/profile' || pathname === '/(mentor)' || pathname === '/';
    }
    return pathname === path;
  };

  const Sidebar = () => (
    <View style={styles.sidebar}>
      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0) || 'M'}
          </Text>
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {profile?.full_name || 'Mentor'}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {profile?.email}
        </Text>
        <View style={styles.badge}>
          <Ionicons name="star" size={14} color="#f59e0b" />
          <Text style={styles.badgeText}>Bronze Mentor</Text>
        </View>
      </View>

      {/* Navigation */}
      <ScrollView style={styles.menuScroll}>
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
              <Ionicons
                name={item.icon as any}
                size={20}
                color={active ? '#7c3aed' : '#6b7280'}
              />
              <Text style={[styles.menuText, active && styles.menuTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sign Out */}
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
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name="menu" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.mobileHeaderTitle}>Mentor Dashboard</Text>
          <View style={{ width: 24 }} />
        </View>
      )}

      <View style={styles.content}>
        {/* Desktop Sidebar - Always visible */}
        {isDesktop && <Sidebar />}

        {/* Mobile Sidebar - Overlay */}
        {!isDesktop && menuOpen && (
          <>
            <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)} />
            <View style={styles.sidebarMobile}>
              <Sidebar />
            </View>
          </>
        )}

        {/* Main Content */}
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
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mobileHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    zIndex: 50,
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  menuScroll: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: '#f5f3ff',
    borderRightWidth: 3,
    borderRightColor: '#7c3aed',
  },
  menuText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  menuTextActive: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  signOutText: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
  },
});