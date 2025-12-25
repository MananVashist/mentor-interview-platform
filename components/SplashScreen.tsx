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
import { BrandHeader } from '@/lib/ui'; 

const { width, height } = Dimensions.get('window');

export const SplashScreen = () => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const [displayedText, setDisplayedText] = useState('');
  const fullTagline = "Anonymous mock interviews with real mentors";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      // Step 2: Start Typing AFTER logo animation finishes
      startTyping();
    });

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTyping = () => {
    let currentIndex = 0;
    
    intervalRef.current = setInterval(() => {
      if (currentIndex <= fullTagline.length) {
        setDisplayedText(fullTagline.slice(0, currentIndex));
        currentIndex++;
      } else {
        // Animation complete, clear interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 50); // 80ms per character = smooth and readable
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
    backgroundColor: '#f8f5f0',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  taglineContainer: {
    marginTop: 20,
    minHeight: 30,
    justifyContent: 'center',
  },
  tagline: {
    fontSize: 24,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Courier',
  },
  cursor: {
    color: '#00BFA5',
  },
});