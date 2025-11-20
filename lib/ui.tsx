// lib/ui.tsx
import React from "react";
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
} from "react-native";
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
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

// --- Components ---

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
  btnTextDisabled: {
    color: theme.colors.gray[500],
  },
});