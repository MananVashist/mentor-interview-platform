// components/Footer.tsx
import React from 'react';
import { 
  View, 
  StyleSheet, 
  useWindowDimensions,
  Platform,
  ViewStyle 
} from 'react-native';
import { Link } from 'expo-router'; // 👈 SEO Magic: Imports Link

export const Footer = () => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const Separator = () => (
    !isSmall ? <View style={styles.dotSeparator} /> : null
  );

  return (
    <View style={styles.footer} accessibilityRole="contentinfo">
      <View style={[styles.footerContent, isSmall && styles.footerContentMobile]}>
        
        {/* ✅ SEO FIX: Using <Link> generates real <a href="..."> tags */}
        
        <Link href="/" style={styles.footerLink}>Home</Link>
        <Separator />

        <Link href="/how-it-works" style={styles.footerLink}>How It Works</Link>
        <Separator />

        <Link href="/about" style={styles.footerLink}>About</Link>
        <Separator />

        <Link href="/blog" style={styles.footerLink}>Blog</Link>
        <Separator />

        <Link href="/faq" style={styles.footerLink}>FAQ</Link>
        <Separator />

        <Link href="/contact" style={styles.footerLink}>Contact</Link>
        <Separator />

        <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
        <Separator />

        <Link href="/cancellation-policy" style={styles.footerLink}>Cancellation Policy</Link>
        <Separator />

        <Link href="/terms" style={styles.footerLink}>Terms & Conditions</Link>
        
      </View>
    </View>
  );
};

// 🔥 System Font Stack (Performance)
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
});

const styles = StyleSheet.create({
  footer: { 
    backgroundColor: '#333', 
    paddingVertical: 32, 
    paddingHorizontal: 40,
    marginTop: 'auto', 
    marginBottom: 0, 
  },
  footerContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 16, 
    maxWidth: 1400, 
    marginHorizontal: 'auto', 
    flexWrap: 'wrap' 
  },
  footerContentMobile: { 
    flexDirection: 'column', 
    gap: 12 
  },
  footerLink: { 
    // 🟢 WEB: Force System Font (0ms load)
    fontFamily: SYSTEM_FONT,
    color: '#fff', 
    fontSize: 14, 
    textDecorationLine: 'none',
    // On web, Link behaves like text, but let's ensure it's clickable area is nice
    padding: 4, 
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
  },
});