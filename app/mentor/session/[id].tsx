import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase/client';

export default function SessionFeedback() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [techScore, setTechScore] = useState('');
  const [commScore, setCommScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    if (!techScore || !commScore || !feedback) {
      Alert.alert("Missing Fields", "Please provide scores and feedback.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('session_evaluations').insert({
          session_id: id,
          score_technical: Number(techScore),
          score_communication: Number(commScore),
          feedback_text: feedback,
          created_at: new Date().toISOString()
      });
      if (error) throw error;

      await supabase.from('interview_sessions').update({ status: 'completed' }).eq('id', id);
      
      Alert.alert("Success", "Feedback submitted!");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
            <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Evaluate Candidate</Text>
        
        <Text style={styles.label}>Technical Score (1-10)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={techScore} onChangeText={setTechScore} />
        
        <Text style={styles.label}>Communication Score (1-10)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={commScore} onChangeText={setCommScore} />
        
        <Text style={styles.label}>Feedback</Text>
        <TextInput style={[styles.input, {height: 100}]} multiline value={feedback} onChangeText={setFeedback} />
        
        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Submit</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
    btn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});