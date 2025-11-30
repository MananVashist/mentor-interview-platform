import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

export const Footer = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // Helper component for the dot separator
  const Separator = () => (
    !isSmall ? <View style={styles.dotSeparator} /> : null
  );

  return (
    <View style={styles.footer} accessibilityRole="contentinfo">
      <View style={[styles.footerContent, isSmall && styles.footerContentMobile]}>
        
        {/* --- ADDED HOME LINK --- */}
        <TouchableOpacity onPress={() => router.push('/')} accessibilityRole="link">
          <Text style={styles.footerLink}>Home</Text>
        </TouchableOpacity>

        <Separator />
        {/* --- END ADDITION --- */}

        <TouchableOpacity onPress={() => router.push('/how-it-works')} accessibilityRole="link">
          <Text style={styles.footerLink}>How It Works</Text>
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity onPress={() => router.push('/about')} accessibilityRole="link">
          <Text style={styles.footerLink}>About</Text>
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity onPress={() => router.push('/blog')} accessibilityRole="link">
          <Text style={styles.footerLink}>Blog</Text>
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity onPress={() => router.push('/contact')} accessibilityRole="link">
          <Text style={styles.footerLink}>Contact</Text>
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity onPress={() => router.push('/privacy')} accessibilityRole="link">
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity onPress={() => router.push('/cancellation-policy')} accessibilityRole="link">
          <Text style={styles.footerLink}>Cancellation Policy</Text>
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity onPress={() => router.push('/terms')} accessibilityRole="link">
          <Text style={styles.footerLink}>Terms & Conditions</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: { 
    backgroundColor: '#333', 
    paddingVertical: 32, 
    paddingHorizontal: 40,
    marginTop: 'auto' 
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
    color: '#fff', 
    fontSize: 14, 
    textDecorationLine: 'none' 
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
  },
});