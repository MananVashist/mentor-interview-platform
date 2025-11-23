// components/SplashScreen.tsx
// Mobile-only splash screen that reuses BrandHeader from lib/ui.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandHeader } from '@/lib/ui'; // ✅ Reusing your existing component!

const { width, height } = Dimensions.get('window');

export const SplashScreen = () => {
  // Entrance animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(20)).current;

  // Wiggle animations for logo
  const crackRotate = useRef(new Animated.Value(0)).current;
  const jobsRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance sequence
    Animated.sequence([
      // BrandHeader (with eyes) pops in
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          delay: 100,
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 600,
          delay: 100,
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          useNativeDriver: true,
        }),
      ]),
      // Tagline fades in
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 800,
          delay: 400,
          useNativeDriver: true,
        }),
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 800,
          delay: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#f8f5f0', '#e8e5e0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Use BrandHeader from lib/ui.tsx - it already has crazy eyes! */}
        <Animated.View
          style={[
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <BrandHeader />
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineY }],
            },
          ]}
        >
          Interview with real professionals
        </Animated.Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  tagline: {
    fontSize: 24,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
  },
});