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
import Svg, { Path } from 'react-native-svg';

// --- SVG ICON COMPONENTS ---
const TwitterIcon = ({ size = 24, color = '#ccc' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M22.46 6c-.85.38-1.75.64-2.7.75a4.7 4.7 0 0 0 2.06-2.6c-.9.54-1.9.93-2.98 1.14a4.69 4.69 0 0 0-8 4.27A13.3 13.3 0 0 1 1.64 4.16a4.69 4.69 0 0 0 1.45 6.26 4.65 4.65 0 0 1-2.12-.58v.06a4.69 4.69 0 0 0 3.76 4.6 4.7 4.7 0 0 1-2.12.08 4.69 4.69 0 0 0 4.38 3.26A9.4 9.4 0 0 1 0 19.54a13.25 13.25 0 0 0 7.18 2.1c8.61 0 13.32-7.14 13.32-13.32 0-.2 0-.4-.02-.6A9.5 9.5 0 0 0 22.46 6z" 
      fill={color}
    />
  </Svg>
);

const LinkedInIcon = ({ size = 24, color = '#ccc' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" 
      fill={color}
    />
  </Svg>
);

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
            Anonymous mock interviews with verified experts from top companies.
          </Text>
          <View style={styles.socialRow}>
            {/* Replace with your actual profiles */}
            
            <TouchableOpacity onPress={() => openExternal('https://linkedin.com/company/crackjobs')} accessibilityLabel="Follow us on LinkedIn">
              <LinkedInIcon size={24} color="#ccc" />
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