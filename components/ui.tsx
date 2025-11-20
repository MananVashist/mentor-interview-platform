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
import { theme } from '@/lib/theme';

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
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.background} 
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
          placeholderTextColor={theme.colors.textTertiary}
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
    borderRadius: theme.borderRadius.round,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  button_primary: {
    backgroundColor: theme.colors.primary,
  },
  button_secondary: {
    backgroundColor: theme.colors.backgroundSecondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_sm: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  button_md: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  button_lg: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
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
    color: theme.colors.background,
  },
  buttonText_secondary: {
    color: theme.colors.text,
  },
  buttonText_outline: {
    color: theme.colors.primary,
  },
  buttonText_ghost: {
    color: theme.colors.primary,
  },
  buttonText_sm: {
    fontSize: theme.typography.fontSize.sm,
  },
  buttonText_md: {
    fontSize: theme.typography.fontSize.base,
  },
  buttonText_lg: {
    fontSize: theme.typography.fontSize.lg,
  },
  buttonText_disabled: {
    opacity: 0.5,
  },

  // Input styles
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  inputWrapper_error: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  input_withLeftIcon: {
    paddingLeft: theme.spacing.sm,
  },
  input_withRightIcon: {
    paddingRight: theme.spacing.sm,
  },
  inputIcon: {
    paddingHorizontal: theme.spacing.md,
  },
  inputError: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },

  // Label styles
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  labelRequired: {
    color: theme.colors.error,
  },

  // Card styles
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  card_bordered: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  card_elevated: {
    ...theme.shadows.md,
  },

  // Divider styles
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  divider_vertical: {
    width: 1,
    height: '100%',
  },

  // Badge styles
  badge: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  badge_primary: {
    backgroundColor: theme.colors.primary,
  },
  badge_success: {
    backgroundColor: theme.colors.success,
  },
  badge_warning: {
    backgroundColor: theme.colors.warning,
  },
  badge_error: {
    backgroundColor: theme.colors.error,
  },
  badge_info: {
    backgroundColor: theme.colors.info,
  },
  badge_sm: {
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.xs,
  },
  badge_md: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.background,
  },
  badgeText_primary: {
    color: theme.colors.background,
  },
  badgeText_success: {
    color: theme.colors.background,
  },
  badgeText_warning: {
    color: theme.colors.background,
  },
  badgeText_error: {
    color: theme.colors.background,
  },
  badgeText_info: {
    color: theme.colors.background,
  },
  badgeText_sm: {
    fontSize: 10,
  },
  badgeText_md: {
    fontSize: theme.typography.fontSize.xs,
  },

  // Role toggle styles
  roleToggle: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  roleButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  roleButton_active: {
    backgroundColor: theme.colors.primary,
  },
  roleButton_disabled: {
    opacity: 0.5,
  },
  roleButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  roleButtonText_active: {
    color: theme.colors.background,
  },
});