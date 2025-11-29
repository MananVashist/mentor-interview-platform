// app/admin/_layout.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/auth.service';

export default function AdminLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { label: 'Overview', path: '/admin', icon: 'stats-chart' }, 
    { label: 'Approvals', path: '/admin/approvals', icon: 'checkmark-done-circle' },
    { label: 'Job Profiles', path: '/admin/profiles', icon: 'briefcase' },
    // ✅ NEW ITEM
    { label: 'Checklists', path: '/admin/templates', icon: 'list-circle' },
  ];

  const isActive = (path: string) => {
      if (path === '/admin') return pathname === '/admin';
      return pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    router.replace('/auth/sign-in');
  };

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <View style={styles.header}>
            <Ionicons name="shield-checkmark" size={28} color="#2563eb" />
            <Text style={styles.title}>Admin Panel</Text>
        </View>
        
        <ScrollView style={{ flex: 1 }}>
            {menu.map(item => (
            <TouchableOpacity
                key={item.path}
                style={[styles.menuItem, isActive(item.path) && styles.menuItemActive]}
                onPress={() => router.push(item.path as any)}
            >
                <Ionicons 
                    name={item.icon as any} 
                    size={20} 
                    color={isActive(item.path) ? '#2563eb' : '#64748b'} 
                />
                <Text style={isActive(item.path) ? styles.menuTextActive : styles.menuText}>
                {item.label}
                </Text>
            </TouchableOpacity>
            ))}
        </ScrollView>

        <TouchableOpacity style={styles.signout} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
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
  sidebar: { width: 240, backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#e5e7eb', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 30 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginBottom: 4 },
  menuItemActive: { backgroundColor: '#eff6ff' },
  menuText: { color: '#64748b', fontWeight: '500', fontSize: 15 },
  menuTextActive: { color: '#2563eb', fontWeight: '700', fontSize: 15 },
  signout: { marginTop: 'auto', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center', gap: 8 },
  content: { flex: 1, padding: 24 },
});