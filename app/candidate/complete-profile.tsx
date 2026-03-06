// app/candidate/complete-profile.tsx
// Mandatory screen: blocks dashboard access until full_name and professional_title are set.
// Password is handled separately via Forgot Password — no password field here.
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';
import { candidateService } from '@/services/candidate.service';

const F = Platform.select({ web: "-apple-system, BlinkMacSystemFont, sans-serif", default: "System" }) as string;

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { user, profile, setCandidateProfile, setProfile } = useAuthStore();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (fullName.trim().length < 2) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    if (title.trim().length < 3) {
      Alert.alert('Required', 'Please enter a valid professional title (e.g., Product Manager at Startup)');
      return;
    }

    setLoading(true);
    try {
      if (!user) throw new Error("User not found");

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', user.id);
      if (profileError) throw profileError;

      const { error: titleError } = await supabase
        .from('candidates')
        .upsert({ id: user.id, professional_title: title.trim() });
      if (titleError) throw titleError;

      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      const updatedCandidate = await candidateService.getCandidateById(user.id);

      if (updatedProfile) setProfile(updatedProfile as any);
      setCandidateProfile(updatedCandidate ?? null);

      router.replace('/candidate/bookings');

    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.card}>

        <Text style={s.emoji}>👤</Text>
        <Text style={s.title}>One last step</Text>
        <Text style={s.subtitle}>
          Your mentor needs to know who they're speaking with. Please add your name and current role to continue.
        </Text>

        <View style={s.divider} />

        <Text style={s.label}>FULL NAME <Text style={{ color: '#EF4444' }}>*</Text></Text>
        <TextInput
          style={s.input}
          placeholder="e.g., Jane Doe"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <Text style={s.label}>CURRENT / TARGET ROLE <Text style={{ color: '#EF4444' }}>*</Text></Text>
        <TextInput
          style={s.input}
          placeholder="e.g., Product Manager at Series B Startup"
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity style={s.btn} onPress={handleSave} disabled={loading} activeOpacity={0.85}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnTxt}>Save & Go to My Bookings →</Text>
          }
        </TouchableOpacity>

        <Text style={s.note}>
          This information is only shared with your session mentor and is never publicly visible.
        </Text>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F0', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#fff', padding: 32, borderRadius: 16, width: '100%', maxWidth: 450, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20, shadowOffset: { width: 0, height: 4 } },
  emoji: { fontSize: 40, textAlign: 'center', marginBottom: 12 },
  title: { fontFamily: F, fontSize: 24, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontFamily: F, fontSize: 14, color: '#374151', textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 24 },
  label: { fontFamily: F, fontSize: 11, fontWeight: '700', color: '#374151', letterSpacing: 0.5, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 14, fontSize: 15, marginBottom: 20, fontFamily: F, color: '#111827', backgroundColor: '#FAFAFA' },
  btn: { backgroundColor: '#0E9384', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 15, fontFamily: F },
  note: { fontFamily: F, fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 16, lineHeight: 18 },
});