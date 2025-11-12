// components/ui.tsx
// Reusable UI components using centralized theme

import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInputProps,
  TouchableOpacityProps,
  TextProps,
  ViewProps,
} from 'react-native';
import { THEME } from '@/lib/theme';

// ============================================
// Button Component
// ============================================
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.button_fullWidth,
    disabled && styles.button_disabled,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    styles[`buttonText_${variant}`],
    styles[`buttonText_${size}`],
    disabled && styles.buttonText_disabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? THEME.colors.primary : THEME.colors.background} 
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// ============================================
// Input Component
// ============================================
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      
      <View style={[styles.inputWrapper, error && styles.inputWrapper_error]}>
        {leftIcon && <View style={styles.inputIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.input_withLeftIcon,
            rightIcon && styles.input_withRightIcon,
            style,
          ]}
          placeholderTextColor={THEME.colors.textTertiary}
          {...props}
        />
        
        {rightIcon && <View style={styles.inputIcon}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
}

// ============================================
// Label Component
// ============================================
interface LabelProps extends TextProps {
  required?: boolean;
}

export function Label({ children, required, style, ...props }: LabelProps) {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
      {required && <Text style={styles.labelRequired}> *</Text>}
    </Text>
  );
}

// ============================================
// Card Component
// ============================================
interface CardProps extends ViewProps {
  variant?: 'default' | 'bordered' | 'elevated';
}

export function Card({ variant = 'default', style, children, ...props }: CardProps) {
  return (
    <View 
      style={[
        styles.card,
        variant === 'bordered' && styles.card_bordered,
        variant === 'elevated' && styles.card_elevated,
        style,
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}

// ============================================
// Divider Component
// ============================================
interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ orientation = 'horizontal', style, ...props }: DividerProps) {
  return (
    <View
      style={[
        styles.divider,
        orientation === 'vertical' && styles.divider_vertical,
        style,
      ]}
      {...props}
    />
  );
}

// ============================================
// Badge Component
// ============================================
interface BadgeProps extends ViewProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ variant = 'primary', size = 'md', style, children, ...props }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        styles[`badge_${variant}`],
        styles[`badge_${size}`],
        style,
      ]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.badgeText, styles[`badgeText_${variant}`], styles[`badgeText_${size}`]]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

// ============================================
// Role Toggle Component (for auth screens)
// ============================================
interface RoleToggleProps {
  value: 'candidate' | 'mentor' | 'admin';
  onChange: (role: 'candidate' | 'mentor' | 'admin') => void;
  disabled?: boolean;
}

export function RoleToggle({ value, onChange, disabled }: RoleToggleProps) {
  const roles: Array<{ key: 'candidate' | 'mentor' | 'admin'; label: string }> = [
    { key: 'candidate', label: 'Candidate' },
    { key: 'mentor', label: 'Mentor' },
    { key: 'admin', label: 'Admin' },
  ];

  return (
    <View style={styles.roleToggle}>
      {roles.map((role) => (
        <TouchableOpacity
          key={role.key}
          style={[
            styles.roleButton,
            value === role.key && styles.roleButton_active,
            disabled && styles.roleButton_disabled,
          ]}
          onPress={() => !disabled && onChange(role.key)}
          disabled={disabled}
        >
          <Text
            style={[
              styles.roleButtonText,
              value === role.key && styles.roleButtonText_active,
            ]}
          >
            {role.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
  // Button styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.borderRadius.round,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  button_primary: {
    backgroundColor: THEME.colors.primary,
  },
  button_secondary: {
    backgroundColor: THEME.colors.backgroundSecondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_sm: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
  },
  button_md: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  button_lg: {
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
  },
  button_fullWidth: {
    width: '100%',
  },
  button_disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonText_primary: {
    color: THEME.colors.background,
  },
  buttonText_secondary: {
    color: THEME.colors.text,
  },
  buttonText_outline: {
    color: THEME.colors.primary,
  },
  buttonText_ghost: {
    color: THEME.colors.primary,
  },
  buttonText_sm: {
    fontSize: THEME.typography.fontSize.sm,
  },
  buttonText_md: {
    fontSize: THEME.typography.fontSize.base,
  },
  buttonText_lg: {
    fontSize: THEME.typography.fontSize.lg,
  },
  buttonText_disabled: {
    opacity: 0.5,
  },

  // Input styles
  inputContainer: {
    marginBottom: THEME.spacing.md,
  },
  inputLabel: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: '600',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.background,
  },
  inputWrapper_error: {
    borderColor: THEME.colors.error,
  },
  input: {
    flex: 1,
    padding: THEME.spacing.md,
    fontSize: THEME.typography.fontSize.base,
    color: THEME.colors.text,
  },
  input_withLeftIcon: {
    paddingLeft: THEME.spacing.sm,
  },
  input_withRightIcon: {
    paddingRight: THEME.spacing.sm,
  },
  inputIcon: {
    paddingHorizontal: THEME.spacing.md,
  },
  inputError: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.error,
    marginTop: THEME.spacing.xs,
  },

  // Label styles
  label: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: '600',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  labelRequired: {
    color: THEME.colors.error,
  },

  // Card styles
  card: {
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
  },
  card_bordered: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  card_elevated: {
    ...THEME.shadows.md,
  },

  // Divider styles
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
  },
  divider_vertical: {
    width: 1,
    height: '100%',
  },

  // Badge styles
  badge: {
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
    alignSelf: 'flex-start',
  },
  badge_primary: {
    backgroundColor: THEME.colors.primary,
  },
  badge_success: {
    backgroundColor: THEME.colors.success,
  },
  badge_warning: {
    backgroundColor: THEME.colors.warning,
  },
  badge_error: {
    backgroundColor: THEME.colors.error,
  },
  badge_info: {
    backgroundColor: THEME.colors.info,
  },
  badge_sm: {
    paddingVertical: 2,
    paddingHorizontal: THEME.spacing.xs,
  },
  badge_md: {
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.sm,
  },
  badgeText: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: '600',
    color: THEME.colors.background,
  },
  badgeText_primary: {
    color: THEME.colors.background,
  },
  badgeText_success: {
    color: THEME.colors.background,
  },
  badgeText_warning: {
    color: THEME.colors.background,
  },
  badgeText_error: {
    color: THEME.colors.background,
  },
  badgeText_info: {
    color: THEME.colors.background,
  },
  badgeText_sm: {
    fontSize: 10,
  },
  badgeText_md: {
    fontSize: THEME.typography.fontSize.xs,
  },

  // Role toggle styles
  roleToggle: {
    flexDirection: 'row',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 4,
    backgroundColor: THEME.colors.backgroundSecondary,
  },
  roleButton: {
    flex: 1,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
  },
  roleButton_active: {
    backgroundColor: THEME.colors.primary,
  },
  roleButton_disabled: {
    opacity: 0.5,
  },
  roleButtonText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  roleButtonText_active: {
    color: THEME.colors.background,
  },
});