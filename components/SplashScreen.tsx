// components/SplashScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
// Removed LinearGradient since we just want a solid white background
import { BrandHeader } from '@/lib/ui'; 

const { width, height } = Dimensions.get('window');

export const SplashScreen = () => {
  // 1. Logo Entrance Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // 2. Typing Animation State
  const [displayedText, setDisplayedText] = useState('');
  const fullTagline = "Interview with real professionals";

  useEffect(() => {
    // Step 1: Animate the Logo In
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
    ]).start(() => {
      // Step 2: Start Typing AFTER logo animation finishes (approx 700ms total)
      startTyping();
    });
  }, []);

  const startTyping = () => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullTagline.length) {
        setDisplayedText(fullTagline.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Adjust speed here (lower = faster)
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        {/* Logo Animation */}
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

        {/* Typing Animation Tagline */}
        {/* We use a fixed height container to prevent layout jumps as text appears */}
        <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>
              {displayedText}
              <Text style={styles.cursor}>|</Text> 
            </Text>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#f8f5f0', // ✅ Pure white background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  taglineContainer: {
    marginTop: 20,
    minHeight: 30, // Reserves space so layout doesn't jump
    justifyContent: 'center',
  },
  tagline: {
    fontSize: 24,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Courier', // Monospace fonts look best with typing effects
  },
  cursor: {
    color: '#00BFA5', // Blinking cursor color (optional)
  },
});