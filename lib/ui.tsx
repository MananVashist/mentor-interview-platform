// lib/ui.tsx
import React, { useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
  TextInputProps,
  Animated,
  Platform,
  Easing,
} from "react-native";
import Svg, { Path } from 'react-native-svg'; // 🟢 Added imports
import { theme } from "./theme";

// --- Types ---
interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  style?: TextStyle;
}

interface AppTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
}

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

interface BrandHeaderProps {
  style?: ViewStyle;
  small?: boolean;
}

// 🟢 NEW INTERFACES FOR MOVED COMPONENTS
interface TrackCardProps {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  skills: string[];
}

interface StatItemProps {
  number: string;
  label: string;
  icon: string;
}

interface ReviewCardProps {
  text: string;
  title: string;
  subtitle: string;
}

// --- Icons (Moved from index) ---
export const Icon = ({ name, size = 24, color = "#000" }: { name: string, size?: number, color?: string }) => {
  switch (name) {
    case 'medal-outline':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M14.94 19.5L12 17.77L9.06 19.5L9.84 16.16L7.25 13.94L10.66 13.65L12 10.5L13.34 13.65L16.75 13.94L14.16 16.16L14.94 19.5M20 2H4V4L7.81 7.81C6.12 9.67 5 12.2 5 15C5 19.42 8.58 23 13 23C17.42 23 21 19.42 21 15C21 12.2 19.88 9.67 18.19 7.81L22 4V2M7.19 5H16.81L15.54 6.27C14.5 5.5 13.28 5 12 5C10.72 5 9.5 5.5 8.46 6.27L7.19 5M12 21C9.68 21 7.73 19.5 7.17 17.41L8.53 16.67L12 15.1L15.47 16.68L16.83 17.41C16.27 19.5 14.32 21 12 21Z" fill={color} /></Svg>;
    case 'medal':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M20,2H4V4L9.81,9.81C9.29,10.79 9,11.87 9,13A6,6 0 0,0 15,19C16.13,19 17.21,18.71 18.19,18.19L22,22V20L18.19,16.19C18.71,15.21 19,14.13 19,13A6,6 0 0,0 13,7C11.87,7 10.79,7.29 9.81,7.81L4,2M14.94,16L12,14.27L9.06,16L9.84,12.66L7.25,10.44L10.66,10.15L12,7L13.34,10.15L16.75,10.44L14.16,12.66L14.94,16Z" fill={color} /></Svg>;
    case 'trophy':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M20,2H4V4L4.34,4.34C3.5,5.16 3,6.29 3,7.5C3,9.45 4.55,11 6.5,11C7.71,11 8.84,10.5 9.66,9.66L10,10C9.39,10 8.84,10.24 8.42,10.66L8.41,10.67C7.84,11.24 7.5,12 7.5,12.83V18H7V20H17V18H16.5V12.83C16.5,12 16.16,11.24 15.59,10.67L15.58,10.66C15.16,10.24 14.61,10 14,10L14.34,9.66C15.16,10.5 16.29,11 17.5,11C19.45,11 21,9.45 21,7.5C21,6.29 20.5,5.16 19.66,4.34L20,4M6.5,9C5.67,9 5,8.33 5,7.5C5,6.67 5.67,6 6.5,6C7.33,6 8,6.67 8,7.5C8,8.33 7.33,9 6.5,9M17.5,9C16.67,9 16,8.33 16,7.5C16,6.67 16.67,6 17.5,6C18.33,6 19,6.67 19,7.5C19,8.33 18.33,9 17.5,9Z" fill={color} /></Svg>;
    case 'check-circle-outline':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill={color} /></Svg>;
    case 'calendar-check':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M16.5,16.25L13.5,13.25L14.9,11.84L16.5,13.44L19.6,10.34L21,11.75L16.5,16.25Z" fill={color} /></Svg>;
    case 'account-tie':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12,3A4,4 0 0,1 16,7A4,4 0 0,1 12,11A4,4 0 0,1 8,7A4,4 0 0,1 12,3M16,13.54C16,14.6 15.72,17.07 13.81,19.83L13,15L13.94,13.12C13.32,13.05 12.67,13 12,13C11.33,13 10.68,13.05 10.06,13.12L11,15L10.19,19.83C8.28,17.07 8,14.6 8,13.54C5.61,14.24 4,15.5 4,17V21H10L11.09,21H12.91L14,21H20V17C20,15.5 18.4,14.24 16,13.54Z" fill={color} /></Svg>;
    case 'star':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" fill={color} /></Svg>;
    case 'clipboard-flow':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12,2A2,2 0 0,1 14,4V5C14,5.55 13.55,6 13,6H11C10.45,6 10,5.55 10,5V4A2,2 0 0,1 12,2M19,4C20.11,4 21,4.9 21,6V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V6C3,4.9 3.9,4 5,4H9.18C9.6,2.84 10.7,2 12,2C13.3,2 14.4,2.84 14.82,4H19M18,11V9H6V11H18M18,15V13H6V15H18M18,19V17H6V19H18Z" fill={color} /></Svg>;
    case 'chart-box':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z" fill={color} /></Svg>;
    case 'brain':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M21.33,12.91C21.42,14.46 20.71,15.95 19.44,16.86L19.44,17A2,2 0 0,1 17.44,19H11.55C9.64,19 7.47,18.3 5.41,17.07L5.06,16.86C3.79,15.95 3.08,14.46 3.17,12.91C2.74,12.75 2.32,12.5 2,12.15C1.17,11.24 1,9.94 1.61,8.82C2.21,7.7 3.46,7.12 4.7,7.29C4.8,6.36 5.32,5.5 6.12,4.97C6.92,4.44 7.92,4.27 8.85,4.5C9.78,4.73 10.57,5.36 11,6.23C11.4,5.36 12.21,4.73 13.14,4.5C14.07,4.27 15.07,4.44 15.87,4.97C16.67,5.5 17.19,6.36 17.29,7.29C18.53,7.12 19.78,7.7 20.38,8.82C20.99,9.94 20.82,11.24 20,12.15C19.68,12.5 19.26,12.75 18.83,12.91L18.83,12.91C18.83,12.91 18.83,12.91 18.83,12.91L18.83,12.91C18.83,12.91 18.83,12.91 18.83,12.91C18.83,12.91 18.83,12.91 18.83,12.91M18,11.71C18,11.71 18,11.71 18,11.71L18,11.71C18.08,11.36 18.19,11 18.32,10.68C18.91,9.18 19.04,7.77 18.66,6.6C18.12,4.93 16.64,3.79 14.88,3.55C14.06,3.44 13.22,3.62 12.5,4.06C11.78,4.5 11.24,5.17 10.97,5.96L10.97,5.96C10.97,5.96 10.97,5.96 10.97,5.96C10.97,5.96 10.97,5.96 10.97,5.96C10.7,5.17 10.16,4.5 9.44,4.06C8.72,3.62 7.88,3.44 7.06,3.55C5.3,3.79 3.82,4.93 3.28,6.6C2.9,7.77 3.03,9.18 3.62,10.68C3.75,11 3.86,11.36 3.94,11.71L3.94,11.71C3.94,11.71 3.94,11.71 3.94,11.71C3.94,11.71 3.94,11.71 3.94,11.71C3.94,11.71 3.94,11.71 3.94,11.71L3.94,11.71C3.94,11.71 3.94,11.71 3.94,11.71L3.94,11.71C3.42,11.94 2.94,12.27 2.54,12.68C1.86,13.38 1.52,14.32 1.61,15.26C1.7,16.2 2.19,17.05 2.94,17.63L3.94,17.63C4.69,17.63 5.42,17.42 6.06,17C6.7,16.58 7.22,15.98 7.56,15.26C7.9,14.54 8.04,13.74 7.97,12.96C7.9,12.18 7.61,11.44 7.13,10.83L7.13,10.83C7.13,10.83 7.13,10.83 7.13,10.83C7.13,10.83 7.13,10.83 7.13,10.83M11.97,5.96L11.97,5.96L11.97,5.96C11.97,5.96 11.97,5.96 11.97,5.96L11.97,5.96L11.97,5.96C11.97,5.96 11.97,5.96 11.97,5.96L11.97,5.96C11.97,5.96 11.97,5.96 11.97,5.96Z" fill={color} /></Svg>;
    case 'account-group':
      return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12,5A3.5,3.5 0 0,0 8.5,8.5A3.5,3.5 0 0,0 12,12A3.5,3.5 0 0,0 15.5,8.5A3.5,3.5 0 0,0 12,5M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M5.5,8A2.5,2.5 0 0,0 3,10.5C3,11.44 3.53,12.25 4.29,12.68C4.65,12.88 5.06,13 5.5,13C5.94,13 6.35,12.88 6.71,12.68C7.08,12.47 7.39,12.17 7.62,11.81C6.89,10.86 6.5,9.7 6.5,8.5C6.5,8.41 6.5,8.31 6.5,8.22C6.2,8.08 5.86,8 5.5,8M18.5,8C18.14,8 17.8,8.08 17.5,8.22C17.5,8.31 17.5,8.41 17.5,8.5C17.5,9.7 17.11,10.86 16.38,11.81C16.5,12 16.63,12.15 16.78,12.3C16.94,12.45 17.1,12.58 17.29,12.68C17.65,12.88 18.06,13 18.5,13C18.94,13 19.35,12.88 19.71,12.68C20.47,12.25 21,11.44 21,10.5A2.5,2.5 0 0,0 18.5,8M12,14C9.66,14 5,15.17 5,17.5V19H19V17.5C19,15.17 14.34,14 12,14M4.71,14.55C2.78,14.78 0,15.76 0,17.5V19H3V17.07C3,16.06 3.69,15.22 4.71,14.55M19.29,14.55C20.31,15.22 21,16.06 21,17.07V19H24V17.5C24,15.76 21.22,14.78 19.29,14.55M12,16C13.53,16 15.24,16.5 16.23,17H7.77C8.76,16.5 10.47,16 12,16Z" fill={color} /></Svg>;
    default:
      return null;
  }
};

// --- Components ---

// 🟢 BRAND HEADER: FIXED & SMOOTH
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

export const ScreenBackground = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => (
  <SafeAreaView style={[styles.screen, style]}>
    <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
    <View style={{ flex: 1 }}>{children}</View>
  </SafeAreaView>
);

export const Section = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => <View style={[styles.section, style]}>{children}</View>;

export const Heading = ({ level = 1, children, style }: HeadingProps) => {
  const getStyle = () => {
    switch (level) {
      case 1:
        return styles.h1;
      case 2:
        return styles.h2;
      case 3:
        return styles.h3;
      default:
        return styles.h4;
    }
  };
  return <Text style={[getStyle(), style]}>{children}</Text>;
};

export const AppText = ({ children, style, numberOfLines }: AppTextProps) => (
  <Text style={[styles.text, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const Label = ({ children, style }: { children: React.ReactNode, style?: TextStyle }) => (
  <Text style={[styles.label, style]}>{children}</Text>
);

export const Input = ({ style, ...props }: TextInputProps & { style?: TextStyle }) => (
  <TextInput 
    placeholderTextColor={theme.colors.gray[400]}
    style={[styles.input, style]} 
    {...props} 
  />
);

export const Card = ({ children, style }: CardProps) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  style,
  textStyle,
  disabled,
  loading,
}: ButtonProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "outline":
        return styles.btnOutline;
      case "ghost":
        return styles.btnGhost;
      case "white": // 🟢 Added new variant used in index
        return styles.btnWhite;
      default:
        return styles.btnPrimary;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.btnTextOutline;
      case "ghost":
        return styles.btnTextGhost;
      case "white": // 🟢 Added new variant used in index
        return styles.btnTextDark;
      default:
        return styles.btnTextPrimary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case "lg":
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.buttonBase,
        getVariantStyle(),
        getSizeStyle(),
        disabled && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFF" : theme.colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.btnTextBase,
            getVariantTextStyle(),
            disabled && styles.btnTextDisabled,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// 🟢 NEW COMPONENTS (MOVED FROM INDEX)

export const StatItem = ({ number, label, icon }: StatItemProps) => (
  <View style={styles.statItem}>
    <View style={{ marginBottom: 8 }}>
      <Icon name={icon} size={32} color={theme.colors.primary} />
    </View>
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const TrackCard = ({ icon, iconColor, title, description, skills }: TrackCardProps) => (
  <View style={styles.trackCard}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }}>
      <Icon name={icon} size={32} color={iconColor} />
      <Text style={styles.trackCardTitle}>{title}</Text>
    </View>
    <Text style={styles.trackCardBody}>{description}</Text>
    <View style={styles.skillsContainer}>
      {skills.map((skill, index) => (
        <View key={index} style={styles.skillChip}><Text style={styles.skillText}>{skill}</Text></View>
      ))}
    </View>
  </View>
);

export const WorkStep = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <View style={styles.workStepCard}>
    <Text style={styles.workStepIcon}>{icon}</Text>
    <Text style={styles.workStepTitle}>{title}</Text>
    <Text style={styles.workStepDesc}>{desc}</Text>
  </View>
);

export const ReviewCard = ({ text, title, subtitle }: ReviewCardProps) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
    <Text style={styles.reviewText}>"{text}"</Text>
    <View style={styles.reviewAuthor}>
      <View style={styles.avatarPlaceholder}><Text style={{fontSize: 12}}>💼</Text></View>
      <View>
        <Text style={styles.authorName}>{title}</Text>
        <Text style={styles.authorRole}>{subtitle}</Text>
      </View>
    </View>
  </View>
);

// --- Styles ---
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  
  // Brand Styles
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
    fontFamily: theme.typography.fontFamily.bold,
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
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    fontWeight: '900',
    color: '#18a7a7',
    marginTop: -4,
  },
  logoTaglineSmall: {
    fontSize: 12,
  },

  // Typography
  h1: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.size.xxl,
    color: theme.colors.text.main,
    marginBottom: theme.spacing.xs,
  },
  h2: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.xl,
    color: theme.colors.text.main,
    marginBottom: theme.spacing.xs,
  },
  h3: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.main,
    marginBottom: theme.spacing.xs,
  },
  h4: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.main,
  },
  text: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.body,
  },
  label: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.light,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Forms
  input: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.main,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
  },

  // Cards
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Buttons
  buttonBase: {
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary,
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnGhost: {
    backgroundColor: "transparent",
  },
  btnWhite: { 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee'
  },
  btnDisabled: {
    backgroundColor: theme.colors.gray[200],
    borderColor: theme.colors.gray[200],
  },

  // Button Text
  btnTextBase: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.sm,
  },
  btnTextPrimary: {
    color: "#FFFFFF",
  },
  btnTextOutline: {
    color: theme.colors.text.main,
  },
  btnTextGhost: {
    color: theme.colors.primary,
  },
  btnTextDark: {
    color: '#222',
  },
  btnTextDisabled: {
    color: theme.colors.gray[500],
  },
  
  // 🟢 NEW STYLES (MOVED)
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 32, fontWeight: '800', color: '#222', fontFamily: Platform.OS === 'web' ? "System" : undefined },
  statLabel: { fontSize: 14, color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  
  trackCard: { flex: 1, minWidth: 280, backgroundColor: '#fff', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  trackCardTitle: { fontFamily: Platform.OS === 'web' ? "System" : undefined, fontWeight: '700', fontSize: 18, color: '#222' },
  trackCardBody: { fontFamily: Platform.OS === 'web' ? "System" : undefined, fontSize: 15, color: '#555', lineHeight: 24, marginBottom: 20 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 'auto' },
  skillChip: { backgroundColor: '#f0f5f5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  skillText: { fontSize: 12, fontWeight: '600', color: '#444', fontFamily: Platform.OS === 'web' ? "System" : undefined },

  workStepCard: { flex: 1, alignItems: 'center', padding: 20 },
  workStepIcon: { fontSize: 48, marginBottom: 16 },
  workStepTitle: { fontFamily: Platform.OS === 'web' ? "System" : undefined, fontWeight: '700', fontSize: 18, color: '#222', marginBottom: 8, textAlign: 'center' },
  workStepDesc: { fontFamily: Platform.OS === 'web' ? "System" : undefined, fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 22 },
  
  reviewCard: { flex: 1, minWidth: 280, backgroundColor: '#fff', padding: 32, borderRadius: 12, borderWidth: 1, borderColor: '#eaeaea' },
  reviewStars: { marginBottom: 16, fontSize: 12, letterSpacing: 2 },
  reviewText: { fontFamily: Platform.OS === 'web' ? "System" : undefined, fontSize: 16, color: '#333', lineHeight: 26, fontStyle: 'italic', marginBottom: 24 },
  reviewAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e0f5f5', alignItems: 'center', justifyContent: 'center' },
  authorName: { fontWeight: '700', fontSize: 14, color: '#222' },
  authorRole: { fontSize: 12, color: '#555', marginTop: 2 },
});