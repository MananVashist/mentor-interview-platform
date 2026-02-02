// components/Header.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandHeader } from '@/lib/BrandHeader';

const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';

interface HeaderProps {
  showGetStarted?: boolean; // Controls whether to show "Get Started" or "Sign Up"
}

export const Header = ({ showGetStarted = false }: HeaderProps) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.header} accessibilityRole="banner">
      <View style={[styles.headerInner, isMobile && styles.headerInnerMobile]}>
        
        {/* Brand Section */}
        <TouchableOpacity 
          onPress={() => router.push('/')} 
          activeOpacity={0.8}
          style={styles.brandTouchable}
        >
          <BrandHeader small={isMobile} style={styles.brandOverride} />
        </TouchableOpacity>

        {/* Navigation Buttons */}
        <View style={[styles.navRight, isMobile && styles.navRightMobile]} accessibilityRole="navigation">
          {/* Log in / Login - Text on mobile, Button on desktop */}
          {isMobile ? (
            <TouchableOpacity 
              onPress={() => router.push('/auth/sign-in')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginTextMobile}>Log in</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.btn, styles.btnSecondary]} 
              onPress={() => router.push('/auth/sign-in')}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, styles.btnTextSecondary]}>
                LOGIN
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Get Started / Sign Up Button */}
          <TouchableOpacity 
            style={[styles.btn, styles.btnPrimary, isMobile && styles.btnMobile]} 
            onPress={() => router.push('/auth/sign-up')}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnText, styles.btnTextPrimary, isMobile && styles.btnTextMobile]}>
              {showGetStarted ? 'Get Started' : 'SIGN UP'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

const styles = StyleSheet.create({
  header: { 
    backgroundColor: BG_CREAM, 
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  
  headerInner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    maxWidth: 1200, 
    width: '100%', 
    marginHorizontal: 'auto', 
    paddingHorizontal: 32 
  },
  
  headerInnerMobile: { 
    paddingHorizontal: 16,
  },
  
  brandTouchable: {
    // No extra styles needed, just for grouping
  },
  
  brandOverride: {
    marginBottom: 0,
  },
  
  // Mobile "Log in" text (not a button)
  loginTextMobile: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  
  // Navigation Buttons
  navRight: { 
    flexDirection: 'row', 
    gap: 24, 
    alignItems: 'center' 
  },
  
  navRightMobile: { 
    gap: 16, 
  },
  
  btn: { 
    paddingHorizontal: 28, 
    paddingVertical: 10, 
    borderRadius: 100, 
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  btnPrimary: { 
    backgroundColor: CTA_TEAL, 
    borderColor: CTA_TEAL 
  },
  
  btnSecondary: { 
    backgroundColor: 'transparent', 
    borderColor: '#333' 
  },
  
  btnMobile: { 
    paddingHorizontal: 5, 
    paddingVertical: 10,
  },
  
  btnText: { 
    fontWeight: '700', 
    fontSize: 15, 
    letterSpacing: 1,
    fontFamily: SYSTEM_FONT,
  },
  
  btnTextPrimary: {
    color: '#fff',
  },
  
  btnTextSecondary: {
    color: '#333',
  },
  
  btnTextMobile: { 
    fontSize: 12, 
    fontWeight: '700',
    letterSpacing: 0,
  },
});