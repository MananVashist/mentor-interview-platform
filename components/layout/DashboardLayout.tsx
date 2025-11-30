import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Pressable, 
  useWindowDimensions, 
  Platform, 
  ScrollView,
  StatusBar
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

  const isDesktop = width >= 768;

  const Sidebar = () => (
    <View style={[styles.sidebar, isDesktop && { height: height, position: 'sticky' as any, top: 0 }]}>
      
      {/* --- BRAND HEADER --- */}
      <View style={styles.brandSection}>
        <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8}>
          <View style={{ alignItems: 'center' }}> 
             <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                {/* REMOVED DANCINGSCRIPT */}
                <Text style={styles.logoMainCrack}>Crack</Text>
                <Text style={styles.logoMainJobs}>Jobs</Text>
             </View>
          </View>
        </TouchableOpacity>
        
        {/* --- WELCOME SECTION --- */}
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

      {/* --- MENU --- */}
      <View style={styles.navContainer}>
        <ScrollView 
          contentContainerStyle={styles.menuScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Added Label for clarity */}
          <Text style={styles.sectionLabel}>MENU</Text> 
          {menuItems.map((item) => {
            const isExact = pathname === item.path;
            const isSub = pathname.startsWith(`${item.path}/`);
            const betterMatchExists = menuItems.some(other => 
              other.path !== item.path && 
              pathname.startsWith(other.path) && 
              other.path.length > item.path.length
            );
            const active = isExact || (isSub && !betterMatchExists);

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
                  name={item.icon} 
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
      </View>

      {/* --- FOOTER --- */}
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
      
      {/* --- MOBILE HEADER --- */}
      {!isDesktop && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name="menu" size={24} color={theme.colors.text.main} />
          </TouchableOpacity>
          <View style={styles.mobileLogoGroup}>
            {/* REMOVED DANCINGSCRIPT */}
            <Text style={styles.logoMainCrackMobile}>Crack</Text>
            <Text style={styles.logoMainJobsMobile}>Jobs</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      )}

      <View style={styles.content}>
        {isDesktop && <Sidebar />}
        
        {/* Mobile Sidebar Overlay */}
        {!isDesktop && menuOpen && (
          <>
            <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)} />
            <View style={[styles.sidebarMobile, { height: height }]}>
              <Sidebar />
            </View>
          </>
        )}
        
        {/* Main Content Slot */}
        <View style={styles.mainContent}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f5f0', 
  },
  content: { 
    flex: 1, 
    flexDirection: 'row',
  },
  
  // Sidebar
  sidebar: { 
    width: 260, 
    backgroundColor: '#f8f5f0',
    borderRightWidth: 1, 
    borderRightColor: theme.colors.border,
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarMobile: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: 260, 
    backgroundColor: '#f8f5f0', 
    zIndex: 50,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  overlay: { 
    position: 'absolute', 
    inset: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    zIndex: 40 
  },

  // Brand
  brandSection: { 
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMainCrack: { 
    fontSize: 40, 
    color: theme.colors.text.main, 
    fontWeight: '700',
    // Removed fontFamily: 'DancingScript'
    ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #111827' })
  },
  logoMainJobs: { 
    fontSize: 40, 
    color: theme.colors.primary, 
    fontWeight: '700',
    // Removed fontFamily: 'DancingScript'
    ...(Platform.OS === 'web' && { WebkitTextStroke: `0.5px ${CTA_TEAL}` })
  },
  
  // Welcome Styles
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
    width: '100%',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.pricing.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  welcomeTextGroup: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: 12,
    color: theme.colors.text.light,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  welcomeName: { 
    fontWeight: '700',
    color: theme.colors.text.main,
    fontSize: 16,
  },

  // Navigation
  navContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  menuScrollContent: { 
    paddingHorizontal: 16, 
    paddingTop: 24, 
    paddingBottom: 20,
    gap: 4 
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8', // Slate 400
    marginLeft: 12,
    marginBottom: 8,
    letterSpacing: 1,
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    padding: 12, 
    borderRadius: 8 
  },
  menuItemActive: { 
    backgroundColor: theme.colors.pricing.greenBg 
  },
  menuText: { 
    color: theme.colors.text.light, 
    fontWeight: '500',
    fontSize: 14
  },
  menuTextActive: { 
    color: theme.colors.primary, 
    fontWeight: '700' 
  },
  
  // Footer
  footerSection: {
    padding: 16,
    borderTopWidth: 1, 
    borderTopColor: theme.colors.border, 
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
    fontWeight: '600',
    fontSize: 14
  },

  // Header Mobile (Fixed)
  mobileHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    // FIX: Dynamic padding for status bar safety
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 50, 
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8f5f0', 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border, 
    alignItems: 'center',
    elevation: 4, 
    zIndex: 100, 
  },
  mobileLogoGroup: {
    flexDirection: 'row', 
    alignItems: 'baseline'
  },
  logoMainCrackMobile: {
    fontSize: 24, 
    color: theme.colors.text.main, 
    fontWeight: '700'
  },
  logoMainJobsMobile: {
    fontSize: 24, 
    color: theme.colors.primary, 
    fontWeight: '700'
  },
  mainContent: { 
    flex: 1,
    maxWidth: '100%', 
  },
});