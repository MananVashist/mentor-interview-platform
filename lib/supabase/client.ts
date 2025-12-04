// lib/supabase/client.ts
import { Platform } from 'react-native';

// 🟢 FIX: Only apply the URL polyfill on Native (Android/iOS).
// On Web, the browser's native URL implementation is better and stricter.
// Polyfilling it on Web often breaks CORS handling and third-party libraries.
if (Platform.OS !== 'web') {
  require('react-native-url-polyfill/auto');
}

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { logger } from '@/lib/debug';

// Hardcoded credentials
const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  logger.error('Supabase', 'Missing Supabase credentials', {
    hasUrl: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
  });
}

// Native-only storage adapter (prevents hangs/errors on web)
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return Platform.OS === 'web' 
        ? AsyncStorage.getItem(key) 
        : SecureStore.getItemAsync(key);
    } catch (error) {
      logger.error('Storage', `getItem failed: ${key}`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      return Platform.OS === 'web'
        ? AsyncStorage.setItem(key, value)
        : SecureStore.setItemAsync(key, value);
    } catch (error) {
      logger.error('Storage', `setItem failed: ${key}`, error);
    }
  },
  removeItem: async (key: string) => {
    try {
      return Platform.OS === 'web' 
        ? AsyncStorage.removeItem(key) 
        : SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error('Storage', `removeItem failed: ${key}`, error);
    }
  },
};

// Initialize Client
// Web: Use default storage (localStorage) for better compatibility
// Native: Use SecureStore adapter for security
export const supabase =
  Platform.OS === 'web'
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storage: AsyncStorage,    
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storage: ExpoSecureStoreAdapter as any,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });

logger.info('[Supabase] client initialized', {
  platform: Platform.OS === 'web' ? 'web(simple)' : Platform.OS,
  url: SUPABASE_URL,
});

// Optional quick connectivity ping (dev only)
if (__DEV__) {
  supabase
    .from('profiles')
    .select('count', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        console.error('[Supabase] ping failed', error);
      } else {
        console.log('[Supabase] ping ok');
      }
    })
    .catch(err => console.error('[Supabase] ping exception', err));
}