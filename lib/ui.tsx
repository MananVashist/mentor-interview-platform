// lib/ui.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from './theme_provider';

type WithChildren = {
  children: React.ReactNode;
  style?: ViewStyle | TextStyle;
};

export const AppText = ({ children, style }: WithChildren) => {
  const theme = useTheme();
  return (
    <Text
      style={[
        {
          color: theme.colors.text,
          fontSize: theme.typography.body,
          fontFamily: theme.fonts.body,
        },
        style as TextStyle,
      ]}
    >
      {children}
    </Text>
  );
};

export const Heading = ({
  children,
  level = 1,
  style,
}: {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  style?: TextStyle;
}) => {
  const theme = useTheme();
  const size =
    level === 1
      ? theme.typography.heading1
      : level === 2
      ? theme.typography.heading2
      : theme.typography.body;
  return (
    <Text
      style={[
        {
          fontSize: size,
          fontWeight: '700',
          color: theme.colors.text,
          fontFamily: theme.fonts.heading,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Label = ({ children, style }: WithChildren) => {
  const theme = useTheme();
  return (
    <Text
      style={[
        {
          marginBottom: theme.spacing.xs,
          color: theme.colors.textSecondary,
          fontSize: theme.typography.small,
          fontWeight: '500',
        },
        style as TextStyle,
      ]}
    >
      {children}
    </Text>
  );
};

export const Input = ({
  style,
  ...props
}: TextInputProps & { style?: ViewStyle | TextStyle }) => {
  const theme = useTheme();
  return (
    <TextInput
      placeholderTextColor={theme.colors.textMuted}
      style={[
        {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          fontSize: theme.typography.body,
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
        },
        style as ViewStyle,
      ]}
      {...props}
    />
  );
};

export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const Section = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          width: '100%',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
  textStyle,
}: {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}) => {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  const bg = isPrimary
    ? theme.colors.primary
    : variant === 'ghost'
    ? 'transparent'
    : theme.colors.surface;

  const borderColor = isOutline ? theme.colors.border : 'transparent';
  const txtColor = isPrimary ? theme.colors.onPrimary : theme.colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? theme.colors.disabled : bg,
          borderWidth: isOutline ? StyleSheet.hairlineWidth : 0,
          borderColor,
          borderRadius: theme.radius.pill,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            color: txtColor,
            fontSize: theme.typography.button,
            fontWeight: '600',
            fontFamily: theme.fonts.heading,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const ScreenBackground = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.colors.background }}>{children}</View>;
};

// keep old names so existing code won’t break
export const ThemedButton = Button;
export const ThemedCard = Card;
