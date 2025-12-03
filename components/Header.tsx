// components/Header.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandHeader } from '@/lib/ui'; // ← Using BrandHeader from ui.tsx

const CTA_TEAL = '#18a7a7';

export const Header = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (
    <View style={styles.header} accessibilityRole="banner">
      <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
        
        {/* Brand Section with Animated Eyes (from ui.tsx) */}
        <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8}>
          <BrandHeader small={isSmall} style={styles.brandOverride} />
        </TouchableOpacity>

        {/* Navigation Buttons */}
        <View style={[styles.navRight, isSmall && styles.navRightMobile]} accessibilityRole="navigation">
          <TouchableOpacity 
            style={[styles.btn, styles.btnSecondary, isSmall && styles.btnMobile]} 
            onPress={() => router.push('/auth/sign-in')}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnText, styles.btnTextSecondary, isSmall && styles.btnTextMobile]}>
              LOGIN
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.btn, styles.btnPrimary, isSmall && styles.btnMobile]} 
            onPress={() => router.push('/auth/sign-up')}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnText, styles.btnTextPrimary, isSmall && styles.btnTextMobile]}>
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    backgroundColor: '#f8f5f0', 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  
  headerInner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    maxWidth: 1400, 
    width: '100%', 
    marginHorizontal: 'auto', 
    paddingHorizontal: 40 
  },
  
  headerInnerMobile: { 
    paddingHorizontal: 16, 
    justifyContent: 'space-between' 
  },
  
  // Override BrandHeader's default marginBottom
  brandOverride: {
    marginBottom: 0,
  },
  
  // Navigation Buttons
  navRight: { 
    flexDirection: 'row', 
    gap: 12, 
    alignItems: 'center' 
  },
  
  navRightMobile: { 
    gap: 8 
  },
  
  btn: { 
    paddingHorizontal: 24, 
    paddingVertical: 10, 
    borderRadius: 999, 
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
    paddingHorizontal: 16, 
    paddingVertical: 8 
  },
  
  btnText: { 
    fontWeight: '700', 
    fontSize: 13, 
    letterSpacing: 1 
  },
  
  btnTextPrimary: {
    color: '#fff',
  },
  
  btnTextSecondary: {
    color: '#333',
  },
  
  btnTextMobile: { 
    fontSize: 11, 
    letterSpacing: 0.5 
  },
});