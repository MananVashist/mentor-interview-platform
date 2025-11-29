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
import { theme } from '@/lib/theme'; // Ensure this path is correct

const CTA_TEAL = '#18a7a7';

type MenuItem = {
  name: string;
  path: string;
  icon: keyof typeof Ionicons.glyphMap;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  userProfile: any; // Replace with your Profile type
  menuItems: MenuItem[];
  onSignOut: () => void;
  brandSubtitle?: string; // e.g., "Mentor" or "Candidate"
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
                <Text style={styles.logoMainCrack}>Crack</Text>
                <Text style={styles.logoMainJobs}>Jobs</Text>
             </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeLabel}>Welcome back,</Text>
          <Text style={styles.welcomeName} numberOfLines={1}>
            {userProfile?.full_name?.split(' ')[0] || 'User'}
          </Text>
        </View>
      </View>

      {/* --- MENU --- */}
      <View style={styles.navContainer}>
        <ScrollView 
          contentContainerStyle={styles.menuScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item) => {
            // Check if active (handle sub-routes if needed)
            const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
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
          <Text style={{ fontFamily: 'DancingScript', fontSize: 24, color: theme.colors.primary }}>
            CrackJobs
          </Text>
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
  welcomeContainer: {
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  welcomeLabel: {
    fontSize: 22,
    color: theme.colors.text.light,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeName: { 
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.body,
    fontSize: 16,
    textAlign: 'center',
  },

  // Navigation
  navContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  menuScrollContent: { 
    paddingHorizontal: 16, 
    paddingTop: 32, 
    paddingBottom: 20,
    gap: 4 
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
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14
  },
  menuTextActive: { 
    color: theme.colors.primary, 
    fontFamily: theme.typography.fontFamily.semibold 
  },
  
  // Footer
  footerSection: {
    padding: 16,
    borderTopWidth: 1, 
    borderTopColor: 'rgba(0,0,0,0.05)', 
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

  // Header Mobile
  mobileHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    backgroundColor: '#f8f5f0', 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border, 
    alignItems: 'center' 
  },
  mainContent: { 
    flex: 1,
    maxWidth: '100%', 
  },
});