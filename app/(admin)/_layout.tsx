// app/(admin)/_layout.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { authService } from '@/services/auth.service';

export default function AdminLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { label: 'Profiles', path: '/(admin)' },
    // later you can add:
    // { label: 'Documents', path: '/(admin)/documents' },
    // { label: 'Session Templates', path: '/(admin)/sessions' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await authService.signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <Text style={styles.title}>Admin</Text>
        {menu.map(item => (
          <TouchableOpacity
            key={item.path}
            style={[styles.menuItem, isActive(item.path) && styles.menuItemActive]}
            onPress={() => router.push(item.path as any)}
          >
            <Text style={isActive(item.path) ? styles.menuTextActive : styles.menuText}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.signout} onPress={handleSignOut}>
          <Text style={{ color: '#ef4444', fontWeight: '600' }}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: '#f3f4f6' },
  sidebar: {
    width: 220,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  menuItemActive: {
    backgroundColor: '#eff6ff',
  },
  menuText: { color: '#374151', fontWeight: '500' },
  menuTextActive: { color: '#2563eb', fontWeight: '600' },
  signout: { marginTop: 'auto', paddingTop: 16 },
  content: { flex: 1, padding: 16 },
});
