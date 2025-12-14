// components/Footer.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useWindowDimensions, 
  Platform, 
  TouchableOpacity,
  Linking
} from 'react-native';
import { Link } from 'expo-router'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const Footer = () => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const openExternal = (url: string) => Linking.openURL(url);

  return (
    <View style={styles.footer} accessibilityRole="contentinfo">
      <View style={[styles.contentContainer, isSmall && styles.contentContainerMobile]}>
        
        {/* --- COLUMN 1: BRAND & SOCIALS --- */}
        <View style={styles.column}>
          <Link href="/" style={{ textDecorationLine: 'none' }}>
            <Text style={styles.brandTitle}>CrackJobs</Text>
          </Link>
          <Text style={styles.brandDesc}>
            Anonymous mock interviews with verified experts from top tech companies.
          </Text>
          <View style={styles.socialRow}>
            {/* Replace with your actual profiles */}
            <TouchableOpacity onPress={() => openExternal('https://twitter.com')}>
              <MaterialCommunityIcons name="twitter" size={24} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openExternal('https://linkedin.com')}>
              <MaterialCommunityIcons name="linkedin" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- COLUMN 2: INTERVIEW TRACKS (New SEO Pages) --- */}
        <View style={styles.column}>
          <Text style={styles.colHeader}>INTERVIEW TRACKS</Text>
          <Link href="/interviews/product-management" style={styles.link}>Product Management</Link>
          <Link href="/interviews/data-analytics" style={styles.link}>Data Analytics</Link>
          <Link href="/interviews/data-science" style={styles.link}>Data Science / ML</Link>
          <Link href="/interviews/hr" style={styles.link}>HR & Behavioral</Link>
        </View>

        {/* --- COLUMN 3: COMPANY (Your Original Links) --- */}
        <View style={styles.column}>
          <Text style={styles.colHeader}>COMPANY</Text>
          <Link href="/" style={styles.link}>Home</Link>
          <Link href="/about" style={styles.link}>About Us</Link>
          <Link href="/how-it-works" style={styles.link}>How It Works</Link>
          <Link href="/blog" style={styles.link}>Blog & Guides</Link>
          <Link href="/contact" style={styles.link}>Contact Support</Link>
          <Link href="/auth/sign-up" style={[styles.link, { color: '#18a7a7', fontWeight: '700' }]}>
            Become a Mentor
          </Link>
        </View>
      </View>

      {/* --- BOTTOM BAR: LEGAL & POLICIES --- */}
      <View style={styles.bottomBar}>
        <View style={styles.divider} />
        <View style={[styles.bottomContent, isSmall && styles.bottomContentMobile]}>
          <Text style={styles.copyright}>© 2025 CrackJobs. All rights reserved.</Text>
          
          <View style={styles.legalLinks}>
            <Link href="/faq" style={styles.legalLink}>FAQ</Link>
            <Link href="/privacy" style={styles.legalLink}>Privacy</Link>
            <Link href="/terms" style={styles.legalLink}>Terms</Link>
            <Link href="/cancellation-policy" style={styles.legalLink}>Cancellation Policy</Link>
          </View>
        </View>
      </View>
    </View>
  );
};

// System Font Stack
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

const styles = StyleSheet.create({
  footer: { 
    backgroundColor: '#333', 
    paddingTop: 60, 
    paddingBottom: 40,
    marginTop: 'auto', 
  },
  contentContainer: { 
    maxWidth: 1200, 
    width: '100%', 
    alignSelf: 'center', 
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
    flexWrap: 'wrap',
  },
  contentContainerMobile: { 
    flexDirection: 'column', 
    gap: 40 
  },
  
  // Columns
  column: { minWidth: 200, flex: 1 },
  colHeader: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#888', 
    marginBottom: 20, 
    letterSpacing: 1, 
    fontFamily: SYSTEM_FONT 
  },
  
  // Links
  link: { 
    fontFamily: SYSTEM_FONT,
    color: '#ddd', 
    fontSize: 15, 
    marginBottom: 12, 
    textDecorationLine: 'none',
  },
  
  // Brand
  brandTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 16, fontFamily: SYSTEM_FONT },
  brandDesc: { fontSize: 14, color: '#aaa', lineHeight: 22, maxWidth: 300, marginBottom: 24, fontFamily: SYSTEM_FONT },
  socialRow: { flexDirection: 'row', gap: 16 },

  // Bottom Bar
  bottomBar: { marginTop: 60, width: '100%', maxWidth: 1200, alignSelf: 'center', paddingHorizontal: 24 },
  divider: { height: 1, backgroundColor: '#444', width: '100%', marginBottom: 24 },
  bottomContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottomContentMobile: { flexDirection: 'column-reverse', gap: 20 },
  
  copyright: { color: '#666', fontSize: 14, fontFamily: SYSTEM_FONT },
  legalLinks: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center' },
  legalLink: { color: '#666', fontSize: 13, textDecorationLine: 'none', fontFamily: SYSTEM_FONT },
});