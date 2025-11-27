import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

const CTA_TEAL = '#18a7a7';

export const Header = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // --- Eye Animation Logic (Extracted from index.tsx) ---
  const leftEyeX = useRef(new Animated.Value(0)).current;
  const leftEyeY = useRef(new Animated.Value(0)).current;
  const rightEyeX = useRef(new Animated.Value(0)).current;
  const rightEyeY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateEyes = () => {
       const randomMove = () => {
        const maxMove = 10;
        const makeTwitch = (xVal: Animated.Value, yVal: Animated.Value) => {
          const toX = (Math.random() - 0.5) * maxMove;
          const toY = (Math.random() - 0.5) * maxMove;
          return [
            Animated.timing(xVal, { toValue: toX, duration: 70, useNativeDriver: Platform.OS !== 'web' }),
            Animated.timing(yVal, { toValue: toY, duration: 70, useNativeDriver: Platform.OS !== 'web' }),
          ];
        };
        Animated.parallel([...makeTwitch(leftEyeX, leftEyeY), ...makeTwitch(rightEyeX, rightEyeY)]).start();
      };
      randomMove();
      const interval = setInterval(randomMove, 2000); // 2s interval (slower than index.tsx 120ms to be less distracting on inner pages)
      return () => clearInterval(interval);
    };
    return animateEyes();
  }, [leftEyeX, leftEyeY, rightEyeX, rightEyeY]);

  return (
    <View style={styles.header} accessibilityRole="header">
      <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
        
        {/* Brand Section with Eyes */}
        <View style={[styles.brand, isSmall && styles.brandMobile]}>
          {!isSmall && (
            <View style={styles.eyesWrapper}>
               <View style={styles.eye}>
                 <Animated.View style={[styles.pupil, { transform: [{ translateX: leftEyeX }, { translateY: leftEyeY }] }]} />
               </View>
               <View style={styles.eye}>
                 <Animated.View style={[styles.pupil, { transform: [{ translateX: rightEyeX }, { translateY: rightEyeY }] }]} />
               </View>
            </View>
          )}
          <TouchableOpacity onPress={() => router.push('/')}>
            <View>
              <Text style={[styles.logoMain, isSmall && styles.logoMainMobile]} accessibilityRole="header" aria-level={1}>
                <Text style={styles.logoMainCrack}>Crack</Text>
                <Text style={styles.logoMainJobs}>Jobs</Text>
              </Text>
              <Text style={[styles.logoTagline, isSmall && styles.logoTaglineMobile]}>Mad skills. Dream job.</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={[styles.navRight, isSmall && styles.navRightMobile]} accessibilityRole="header">
          <TouchableOpacity 
            style={[styles.btn, styles.btnSecondary, isSmall && styles.btnMobile]} 
            onPress={() => router.push('/auth/sign-in')}
          >
            <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, styles.btnPrimary, isSmall && styles.btnMobile]} 
            onPress={() => router.push('/auth/sign-up')}
          >
            <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>SIGN UP</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { backgroundColor: '#f8f5f0', paddingVertical: 16 }, // Exact match
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1400, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40 },
  headerInnerMobile: { paddingHorizontal: 12, justifyContent: 'space-between' },
  
  // Brand & Eyes
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandMobile: {},
  eyesWrapper: { flexDirection: 'row', gap: 8, marginRight: 12 },
  eye: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, borderWidth: 3, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  pupil: { width: 16, height: 16, backgroundColor: '#333', borderRadius: 8 },
  
  // Logo
  logoMain: { fontFamily: 'DancingScript', fontSize: 44, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  logoMainCrack: { color: '#333', ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #333' }) },
  logoMainJobs: { color: CTA_TEAL, ...(Platform.OS === 'web' && { WebkitTextStroke: `0.5px ${CTA_TEAL}` }) },
  logoMainMobile: { fontSize: 24 },
  logoTagline: { fontFamily: 'DancingScript', fontSize: 28, fontWeight: '900', color: CTA_TEAL, marginTop: -8, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2, ...(Platform.OS === 'web' && { WebkitTextStroke: `0.5px ${CTA_TEAL}` }) },
  logoTaglineMobile: { fontSize: 14 },
  
  // Buttons
  navRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  navRightMobile: { gap: 8 },
  btn: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 30, borderWidth: 2 },
  btnPrimary: { backgroundColor: CTA_TEAL, borderColor: CTA_TEAL },
  btnSecondary: { backgroundColor: 'transparent', borderColor: '#333' },
  btnMobile: { paddingHorizontal: 18, paddingVertical: 8 },
  btnText: { fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  btnTextMobile: { fontSize: 11, letterSpacing: 0.5 },
});