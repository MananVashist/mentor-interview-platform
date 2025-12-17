// lib/BrandHeader.tsx
// ⚡ CRITICAL: Animated brand logo with eyes - used above-the-fold
import React, { useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  ViewStyle,
  Animated,
  Platform,
  Easing,
} from "react-native";

interface BrandHeaderProps {
  style?: ViewStyle;
  small?: boolean;
}

export const BrandHeader = ({ style, small = false }: BrandHeaderProps) => {
  const leftEyeX = useRef(new Animated.Value(0)).current;
  const leftEyeY = useRef(new Animated.Value(0)).current;
  const rightEyeX = useRef(new Animated.Value(0)).current;
  const rightEyeY = useRef(new Animated.Value(0)).current;

  const leftPos = useRef({ x: 0, y: 0 });
  const rightPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
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
      
      const dx = targetX - currentPos.x;
      const dy = targetY - currentPos.y;
      const actualDistance = Math.sqrt(dx * dx + dy * dy);
      const duration = Math.max(300, actualDistance / SPEED);
      
      Animated.parallel([
        Animated.timing(animX, {
          toValue: targetX,
          duration: duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animY, {
          toValue: targetY,
          duration: duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        currentPos.x = targetX;
        currentPos.y = targetY;
        moveEye(animX, animY, currentPos);
      });
    };
    moveEye(leftEyeX, leftEyeY, leftPos.current);
    moveEye(rightEyeX, rightEyeY, rightPos.current);
  }, []);

  return (
    <View style={[styles.brandContainer, style]}>
      {!small && (  
        <View style={styles.eyesWrapper}>
          <View style={styles.eye}>
            <Animated.View
              style={[
                styles.pupil,
                { transform: [{ translateX: leftEyeX }, { translateY: leftEyeY }] },
              ]}
            />
          </View>
          <View style={styles.eye}>
            <Animated.View
              style={[
                styles.pupil,
                { transform: [{ translateX: rightEyeX }, { translateY: rightEyeY }] },
              ]}
            />
          </View>
        </View>
      )}
      <View>
        <Text style={[styles.logoMain, small && styles.logoMainSmall]}>
          <Text style={styles.logoMainCrack}>Crack</Text>
          <Text style={styles.logoMainJobs}>Jobs</Text>
        </Text>
        <Text style={[styles.logoTagline, small && styles.logoTaglineSmall]}>
          Mad skills. Dream job!
        </Text>
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
  // Brand Container
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
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
    overflow: 'hidden',
  },
  pupil: {
    width: 12,
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
  },
  logoMain: {
    fontFamily: SYSTEM_FONT,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
  },
  logoMainSmall: {
    fontSize: 24,
    lineHeight: 30,
  },
  logoMainCrack: { color: '#333' },
  logoMainJobs: { color: '#18a7a7' },
  logoTagline: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    fontWeight: '900',
    color: '#18a7a7',
    marginTop: -4,
  },
  logoTaglineSmall: {
    fontSize: 12,
  },
});