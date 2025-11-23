import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
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
    // FIX #1: Correct path for sign out
    router.replace('/auth/sign-in');
  };

  const menuItems = [
    { name: 'Browse Mentors', path: '/candidate', icon: 'search-outline' },
    { name: 'My Bookings', path: '/candidate/bookings', icon: 'calendar-outline' },
  ];

  const Sidebar = () => (
    <View style={styles.sidebar}>
      <View style={styles.userSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{profile?.full_name?.charAt(0).toUpperCase() || 'C'}</Text>
        </View>
        <Text style={styles.userName}>{profile?.full_name || 'Candidate'}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => {
          const active = pathname === item.path;
          return (
            <TouchableOpacity
              key={item.path}
              style={[styles.menuItem, active && styles.menuItemActive]}
              onPress={() => router.push(item.path as any)}
            >
              <Ionicons name={item.icon as any} size={22} color={active ? '#0E9384' : '#6b7280'} />
              <Text style={[styles.menuText, active && styles.menuTextActive]}>{item.name}</Text>
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

  return (
    <View style={styles.container}>
      {!isDesktop && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name="menu" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.mobileHeaderTitle}>CrackJobs</Text>
          <View style={{ width: 24 }} />
        </View>
      )}
      <View style={styles.content}>
        {isDesktop && <Sidebar />}
        {!isDesktop && menuOpen && (
          <>
            <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)} />
            <View style={styles.sidebarMobile}><Sidebar /></View>
          </>
        )}
        <View style={styles.mainContent}><Slot /></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', alignItems: 'center' },
  mobileHeaderTitle: { fontSize: 18, fontWeight: '700' },
  content: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 260, backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#e5e7eb' },
  sidebarMobile: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 260, backgroundColor: '#fff', zIndex: 50 },
  overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 },
  userSection: { padding: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#0E9384', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  userName: { fontWeight: '600', fontSize: 16 },
  menuContainer: { padding: 16, gap: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8 },
  menuItemActive: { backgroundColor: '#F0FDFA' },
  menuText: { color: '#6b7280', fontWeight: '500' },
  menuTextActive: { color: '#0E9384', fontWeight: '600' },
  signOutButton: { marginTop: 'auto', flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  signOutText: { color: '#ef4444', fontWeight: '600' },
  mainContent: { flex: 1 },
});