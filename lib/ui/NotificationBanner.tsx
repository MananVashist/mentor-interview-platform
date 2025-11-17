// lib/ui/NotificationBanner.tsx
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@/lib/theme';

type NotificationBannerProps = {
  visible: boolean;
  message: string;
  type?: 'success' | 'error';
  onHide?: () => void;
};

type NotificationContextType = {
  showNotification: (message: string, type?: 'success' | 'error') => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  visible,
  message,
  type = 'success',
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-80)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!visible || !message) return;

    // Slide in
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Auto hide after 2.5s
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -80,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        if (onHide) onHide();
      });
    }, 2500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, message, translateY, onHide]);

  if (!visible || !message) return null;

  const bgColor = type === 'success' ? colors.success || '#22c55e' : colors.error || '#ef4444';

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{ 
    visible: boolean;
    message: string; 
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ visible: true, message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationBanner
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onHide={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    zIndex: 1000,
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});