import { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Pressable, 
  useWindowDimensions, 
  Platform, 
  ScrollView 
} from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';
import { theme } from '@/lib/theme';

const CTA_TEAL = '#18a7a7';

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
    router.replace('/auth/sign-in');
  };

  const menuItems = [
    { name: 'Browse Mentors', path: '/candidate', icon: 'search-outline' },
    { name: 'My Bookings', path: '/candidate/bookings', icon: 'calendar-outline' },
    { name: 'My Profile', path: '/candidate/profile', icon: 'person-outline' },
  ];

  const Sidebar = () => (
    <View style={styles.sidebar}>
      {/* 1. Header Section */}
      <View style={styles.brandSection}>
        <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8}>
          <View style={{ alignItems: 'center' }}> 
             <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.logoMainCrack}>Crack</Text>
                <Text style={styles.logoMainJobs}>Jobs</Text>
             </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeLabel}>Welcome back,</Text>
          <Text style={styles.welcomeName} numberOfLines={1}>
            {profile?.full_name?.split(' ')[0] || 'Candidate'}
          </Text>
        </View>
      </View>

      {/* 2. Navigation Menu (Takes remaining space) */}
      <ScrollView 
        style={styles.navScroll} 
        contentContainerStyle={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item) => {
          const active = pathname === item.path;
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
                size={22} 
                color={active ? theme.colors.primary : theme.colors.text.light} 
              />
              <Text style={[styles.menuText, active && styles.menuTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 3. Sticky Footer Section */}
      <View style={styles.footerSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!isDesktop && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name="menu" size={24} color={theme.colors.text.main} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'DancingScript', fontSize: 24, color: theme.colors.primary }}>
            CrackJobs
          </Text>
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
  container: { flex: 1, backgroundColor: '#f8f5f0', },
  mobileHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', padding: 16, 
    backgroundColor: '#f8f5f0', borderBottomWidth: 1, borderBottomColor: theme.colors.border, 
    alignItems: 'center' 
  },
  content: { flex: 1, flexDirection: 'row' },
  
  // Sidebar Layout
  sidebar: { 
    width: 260, 
    backgroundColor: '#f8f5f0', // White background as per screenshot
    borderRightWidth: 1, 
    borderRightColor: theme.colors.border,
    height: '100%', 
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarMobile: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 260, backgroundColor: '#f8f5f0', zIndex: 50 },
  overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 },
  
  brandSection: { 
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMainCrack: { 
    fontFamily: 'DancingScript', 
    fontSize: 40, 
    color: theme.colors.text.main, 
    fontWeight: '700',
    ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #111827' })
  },
  logoMainJobs: { 
    fontFamily: 'DancingScript', 
    fontSize: 40, 
    color: theme.colors.primary, 
    fontWeight: '700',
    ...(Platform.OS === 'web' && { WebkitTextStroke: `0.5px ${CTA_TEAL}` })
  },
  
  // 🟢 Typography matched to screenshot
  welcomeContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  welcomeLabel: {
    fontSize: 22,
    color: theme.colors.text.light, // Grey
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeName: { 
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.body, // Slightly darker/different shade
    fontSize: 16,
    textAlign: 'center',
  },

  // 🟢 Flexible Scroll Container
  navScroll: {
    flex: 1, 
  },
  menuContainer: { 
    paddingHorizontal: 16, 
    paddingTop: 32, 
    gap: 4 
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8 },
  menuItemActive: { backgroundColor: theme.colors.pricing.greenBg },
  menuText: { 
    color: theme.colors.text.light, 
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14
  },
  menuTextActive: { 
    color: theme.colors.primary, 
    fontFamily: theme.typography.fontFamily.semibold 
  },
  
  // 🟢 Sticky Footer Wrapper
  footerSection: {
    padding: 16,
    borderTopWidth: 1, // Optional: adds subtle separation like standard sidebars
    borderTopColor: 'transparent', // Hidden unless you want a line
    backgroundColor: '#f8f5f0',
  },
  signOutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    padding: 12,
    borderRadius: 8,
  },
  signOutText: { 
    color: '#ef4444', 
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14
  },
  mainContent: { flex: 1 },
});