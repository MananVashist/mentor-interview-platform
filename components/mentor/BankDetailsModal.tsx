import React, { useState } from 'react';
import { Modal, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';
import { AppText, Heading } from '@/lib/ui';

interface BankDetailsModalProps {
  visible: boolean;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BankDetailsModal({ visible, userId, onClose, onSuccess }: BankDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ holder: '', account: '', ifsc: '' });

  const handleSave = async () => {
    if (!form.holder || !form.account || !form.ifsc) {
      Alert.alert('Missing Fields', 'Please fill in all details.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('mentors')
        .update({
          bank_details: {
            holder_name: form.holder,
            account_number: form.account,
            ifsc_code: form.ifsc.toUpperCase(),
            updated_at: new Date().toISOString()
          }
        })
        .eq('id', userId);

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
            </View>
            <View>
              <Heading level={3}>Payout Details Required</Heading>
              <AppText style={styles.subtitle}>Where should we send your earnings?</AppText>
            </View>
          </View>

          <ScrollView style={styles.form}>
            <AppText style={styles.label}>Account Holder Name</AppText>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Rahul Verma" 
              value={form.holder} 
              onChangeText={t => setForm({...form, holder: t})} 
            />

            <AppText style={styles.label}>Account Number</AppText>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 1234567890" 
              keyboardType="numeric" 
              value={form.account} 
              onChangeText={t => setForm({...form, account: t})} 
            />

            <AppText style={styles.label}>IFSC Code</AppText>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. SBIN0001234" 
              autoCapitalize="characters" 
              value={form.ifsc} 
              onChangeText={t => setForm({...form, ifsc: t})} 
            />
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.btnCancel}>
              <AppText style={{ color: '#666', fontWeight: '600' }}>Cancel</AppText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSave} 
              style={styles.btnSave} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <AppText style={{ color: '#fff', fontWeight: '700' }}>Save & Continue</AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, maxHeight: '80%' },
  header: { flexDirection: 'row', gap: 12, marginBottom: 20, alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  subtitle: { color: '#666', fontSize: 13, marginTop: 2 },
  form: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, fontSize: 16 },
  actions: { flexDirection: 'row', gap: 12 },
  btnCancel: { flex: 1, padding: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  btnSave: { flex: 2, padding: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: theme.colors.primary },
});