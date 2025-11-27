import React, { useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToastStore } from '@/lib/toast.store';

export function ToastBanner() {
  const { visible, message, type, hide } = useToastStore();
  const slideAnim = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;

    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 4,
      }).start();

      hideTimer = setTimeout(hide, 4000);
    } else {
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }

    return () => clearTimeout(hideTimer);
  }, [visible, slideAnim, hide]);

  const getTheme = () => {
    switch (type) {
      case 'success': return { bg: '#10B981', icon: 'checkmark-circle' as const };
      case 'error': return { bg: '#EF4444', icon: 'alert-circle' as const };
      case 'info': default: return { bg: '#3B82F6', icon: 'information-circle' as const };
    }
  };

  const theme = getTheme();
  // Adjust top padding for Android status bar
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 0;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { paddingTop }]}>
          <Ionicons name={theme.icon} size={24} color="#fff" />
          <Text style={styles.text}>{message}</Text>
          <TouchableOpacity onPress={hide} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // 🟢 WEB FIX: 'fixed' sticks to the window. 'absolute' sticks to the parent view.
    position: Platform.OS === 'web' ? ('fixed' as 'absolute') : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  safeArea: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    minHeight: 60,
    gap: 12,
    width: '100%',
    maxWidth: 600, // Keeps it looking nice on desktop
    alignSelf: 'center',
  },
  text: {
    flex: 1,
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
  },
});