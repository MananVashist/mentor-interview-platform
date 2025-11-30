import React, { useState } from 'react';
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
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// 1. Import SafeAreaView
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/lib/theme'; 

const CTA_TEAL = '#18a7a7';

type MenuItem = {
  name: string;
  path: string;
  icon: keyof typeof Ionicons.glyphMap;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  userProfile: any;
  menuItems: MenuItem[];
  onSignOut: () => void;
  brandSubtitle?: string;
}

export function DashboardLayout({ 
  children, 
  userProfile, 
  menuItems, 
  onSignOut 
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { width, height } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Get insets for the sidebar (to push it down if needed)
  const insets = useSafeAreaInsets(); 

  const isDesktop = width >= 768;

  // Active Tab Logic
  const activeItem = menuItems
    .filter(item => pathname === item.path || pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];

  const Sidebar = () => (
    <View style={[styles.sidebar, isDesktop && { height: height, position: 'sticky' as any, top: 0 }]}>
      
      {/* BRAND */}
      <View style={styles.brandSection}>
        <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8}>
          <View style={{ alignItems: 'center' }}> 
             <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.logoMainCrack}>Crack</Text>
                <Text style={styles.logoMainJobs}>Jobs</Text>
             </View>
          </View>
        </TouchableOpacity>
        
        {/* WELCOME */}
        <View style={styles.welcomeContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userProfile?.full_name ? userProfile.full_name[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.welcomeTextGroup}>
            <Text style={styles.welcomeLabel}>Welcome back,</Text>
            <Text style={styles.welcomeName} numberOfLines={1}>
              {userProfile?.full_name?.split(' ')[0] || 'User'}
            </Text>
          </View>
        </View>
      </View>

      {/* MENU */}
      <View style={styles.navContainer}>
        <ScrollView contentContainerStyle={styles.menuScrollContent} showsVerticalScrollIndicator={false}>
          {menuItems.map((item) => {
            const active = activeItem?.path === item.path;
            return (
              <TouchableOpacity
                key={item.path}
                style={[styles.menuItem, active && styles.menuItemActive]}
                onPress={() => { router.push(item.path as any); setMenuOpen(false); }}
              >
                <Ionicons name={item.icon} size={22} color={active ? theme.colors.primary : theme.colors.text.light} />
                <Text style={[styles.menuText, active && styles.menuTextActive]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* FOOTER */}
      <View style={styles.footerSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { minHeight: height }]}>
      
      {/* 2. Use SafeAreaView for Mobile Header */}
      {!isDesktop && (
        <SafeAreaView edges={['top']} style={styles.mobileHeaderSafe}>
          <View style={styles.mobileHeaderContent}>
            <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
              <Ionicons name="menu" size={24} color={theme.colors.text.main} />
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontFamily: 'DancingScript', fontSize: 24, color: theme.colors.text.main }}>Crack</Text>
              <Text style={{ fontFamily: 'DancingScript', fontSize: 24, color: theme.colors.primary }}>Jobs</Text>
            </View>
            
            {/* Spacer for balance */}
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
      )}

      <View style={styles.content}>
        {isDesktop && <Sidebar />}
        
        {/* Mobile Sidebar Overlay */}
        {!isDesktop && menuOpen && (
          <>
            <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)} />
            <View style={[styles.sidebarMobile, { height: height, paddingTop: insets.top }]}>
              {/* Add SafeAreaView inside sidebar too so top content isn't hidden */}
              <Sidebar />
            </View>
          </>
        )}
        
        <View style={styles.mainContent}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  content: { flex: 1, flexDirection: 'row' },
  
  sidebar: { 
    width: 260, backgroundColor: '#f8f5f0', borderRightWidth: 1, borderRightColor: theme.colors.border, display: 'flex', flexDirection: 'column'
  },
  sidebarMobile: { 
    position: 'absolute', top: 0, left: 0, width: 260, backgroundColor: '#f8f5f0', zIndex: 50, borderRightWidth: 1, borderRightColor: theme.colors.border
  },
  overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 },

  brandSection: { paddingTop: 40, paddingBottom: 20, alignItems: 'center', justifyContent: 'center' },
  logoMainCrack: { 
    fontFamily: 'DancingScript', fontSize: 40, color: theme.colors.text.main, fontWeight: '700',
    ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #111827' })
  },
  logoMainJobs: { 
    fontFamily: 'DancingScript', fontSize: 40, color: theme.colors.primary, fontWeight: '700',
    ...(Platform.OS === 'web' && { WebkitTextStroke: `0.5px ${CTA_TEAL}` })
  },
  
  welcomeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 32, paddingHorizontal: 20, width: '100%', gap: 12 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.pricing.greenBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.primary },
  avatarText: { fontSize: 18, fontWeight: '700', color: theme.colors.primary, fontFamily: theme.typography.fontFamily.bold },
  welcomeTextGroup: { flex: 1 },
  welcomeLabel: { fontSize: 12, color: theme.colors.text.light, fontFamily: theme.typography.fontFamily.medium, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  welcomeName: { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.text.main, fontSize: 16 },

  navContainer: { flex: 1, overflow: 'hidden' },
  menuScrollContent: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 20, gap: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8 },
  menuItemActive: { backgroundColor: theme.colors.pricing.greenBg },
  menuText: { color: theme.colors.text.light, fontFamily: theme.typography.fontFamily.medium, fontSize: 14 },
  menuTextActive: { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.semibold },
  
  footerSection: { padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', backgroundColor: '#f8f5f0' },
  signOutButton: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8 },
  signOutText: { color: '#ef4444', fontFamily: theme.typography.fontFamily.medium, fontSize: 14 },

  // --- NEW MOBILE HEADER STYLES ---
  mobileHeaderSafe: {
    backgroundColor: '#f8f5f0', 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border, 
    zIndex: 100,
    // Add shadow/elevation to prevent content bleeding through
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 4 }
    })
  },
  mobileHeaderContent: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  mainContent: { 
    flex: 1,
    maxWidth: '100%', 
  },
});