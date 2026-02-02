// lib/BrandHeader.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ViewStyle,
  Animated,
  Platform,
  Easing,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";

interface BrandHeaderProps {
  style?: ViewStyle;
  small?: boolean;
}

export const BrandHeader = ({ style, small }: BrandHeaderProps) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  // Auto-detect mobile based on screen width
  const isMobile = width < 768;
  const shouldBeSmall = small || isMobile;
  
  // Track mounting for animations only (prevents animation glitches during SSR)
  const [isMounted, setIsMounted] = useState(false);
  
  const leftEyeX = useRef(new Animated.Value(0)).current;
  const leftEyeY = useRef(new Animated.Value(0)).current;
  const rightEyeX = useRef(new Animated.Value(0)).current;
  const rightEyeY = useRef(new Animated.Value(0)).current;

  const leftPos = useRef({ x: 0, y: 0 });
  const rightPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Eye Animation Loop
  useEffect(() => {
    if (!isMounted) return; 
    
    const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const SPEED = 0.04; 
    const MIN_DISTANCE = 8;
    const MAX_DISTANCE = 12;

    const moveEye = (
      animX: Animated.Value, 
      animY: Animated.Value, 
      currentPos: { x: number, y: number }
    ) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = randomRange(MIN_DISTANCE, MAX_DISTANCE);
      let targetX = currentPos.x + Math.cos(angle) * distance;
      let targetY = currentPos.y + Math.sin(angle) * distance;
      
      targetX = Math.max(-10, Math.min(10, targetX));
      targetY = Math.max(-10, Math.min(10, targetY));
      
      const duration = Math.max(300, Math.sqrt((targetX - currentPos.x) ** 2 + (targetY - currentPos.y) ** 2) / SPEED);
      
      Animated.parallel([
        Animated.timing(animX, { toValue: targetX, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(animY, { toValue: targetY, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]).start(() => {
        currentPos.x = targetX;
        currentPos.y = targetY;
        moveEye(animX, animY, currentPos);
      });
    };
    
    moveEye(leftEyeX, leftEyeY, leftPos.current);
    moveEye(rightEyeX, rightEyeY, rightPos.current);
  }, [isMounted]);

  return (
    <TouchableOpacity 
      onPress={() => router.push('/')}
      activeOpacity={0.8}
      accessibilityRole="link"
      accessibilityLabel="CrackJobs home"
    >
      <View style={[styles.brandContainer, style]} nativeID="brand-header">
        
        {/* Eyes wrapper - hidden on mobile */}
        {!shouldBeSmall && (
          <View style={styles.eyesWrapper} nativeID="brand-eyes">
            <View style={styles.eye}>
              <Animated.View style={[styles.pupil, { transform: [{ translateX: leftEyeX }, { translateY: leftEyeY }] }]} />
            </View>
            <View style={styles.eye}>
              <Animated.View style={[styles.pupil, { transform: [{ translateX: rightEyeX }, { translateY: rightEyeY }] }]} />
            </View>
          </View>
        )}

        {/* Text container - responsive sizing */}
        <View nativeID="brand-text-container">
          <Text style={[styles.logoMain, shouldBeSmall && styles.logoMainSmall]}>
            <Text style={styles.logoMainCrack}>Crack</Text>
            <Text style={styles.logoMainJobs}>Jobs</Text>
          </Text>
          <Text style={[styles.logoTagline, shouldBeSmall && styles.logoTaglineSmall]}>
            Mad skills. Dream job!
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SYSTEM_FONT = Platform.select({
  web: "sans-serif",
  ios: "sans-serif",
  android: "sans-serif",
  default: "sans-serif"
}) as string;

const styles = StyleSheet.create({
  brandContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginBottom: 15
  },
  eyesWrapper: { 
    flexDirection: 'row', 
    gap: 6, 
    marginRight: 12
  },
  eye: { 
    width: 32, 
    height: 32, 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    borderWidth: 2.5, 
    borderColor: '#333', 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden' 
  },
  pupil: { 
    width: 12, 
    height: 12, 
    backgroundColor: '#333', 
    borderRadius: 6 
  },
  logoMain: { 
    fontFamily: SYSTEM_FONT, 
    fontSize: 26, 
    fontWeight: '800', 
    lineHeight: 38 
  },
  logoMainSmall: { 
    fontSize: 26, // Reduced from 24px for mobile
    lineHeight: 24 
  },
  logoMainCrack: { 
    color: '#333' 
  },
  logoMainJobs: { 
    color: '#18a7a7' 
  },
  logoTagline: { 
    fontFamily: SYSTEM_FONT, 
    fontSize: 10, 
    fontWeight: '700', 
    color: '#18a7a7', 
    marginTop: 0,
    marginLeft: 2
  },
  logoTaglineSmall: { 
    fontSize: 12 // Reduced from 12px for mobile
  },
});