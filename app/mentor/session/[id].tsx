import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';

// ✅ IMPORT the central templates (Make sure you created lib/evaluation-templates.ts)
import { MASTER_TEMPLATES } from '@/lib/evaluation-templates';

export default function SessionFeedback() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [template, setTemplate] = useState<any[]>([]);
  const [sessionInfo, setSessionInfo] = useState({ profile: '', round: '' });

  useEffect(() => {
    if (id) loadSessionAndTemplate();
  }, [id]);

  const loadSessionAndTemplate = async () => {
    try {
      // 1. Fetch Session Info
      const { data: session, error } = await supabase
        .from('interview_sessions')
        .select(`
            *, 
            package:interview_packages(target_profile),
            candidate:candidates(target_profile)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // 2. Determine Profile & Round
      const profile = session.package?.target_profile || session.candidate?.target_profile || 'Product Manager';
      const round = session.round || 'round_1'; // Ensure DB uses 'round_1', 'round_2'

      setSessionInfo({ profile, round });

      // 3. Pick the correct template from the Central File
      // Try exact match, otherwise fallback to Product Manager
      const profileTemplates = MASTER_TEMPLATES[profile] || MASTER_TEMPLATES["Product Manager"];
      const roundQuestions = profileTemplates[round] || profileTemplates["round_1"];

      console.log(`🔎 Loaded Template for: [${profile}] - [${round}]`);
      setTemplate(roundQuestions);

    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load session details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qId: string, val: any) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Bundle data
      const finalChecklistData = {
          answers: answers,
          summary_feedback: feedback,
          meta: {
              profile_used: sessionInfo.profile,
              round_used: sessionInfo.round
          }
      };

      // Save to Supabase
      const { error } = await supabase.from('session_evaluations').upsert({
          session_id: id,
          checklist_data: finalChecklistData, 
          created_at: new Date().toISOString()
      }, { onConflict: 'session_id' });
      
      if (error) throw error;

      // Mark completed
      await supabase.from('interview_sessions').update({ status: 'completed' }).eq('id', id);
      
      Alert.alert("Success", "Feedback submitted!");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Evaluate: {sessionInfo.profile}</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* RENDER TEMPLATE */}
        {template.map((section, idx) => (
            <View key={idx} style={styles.section}>
                <Text style={styles.sectionHeader}>{section.title}</Text>
                
                {section.example && (
                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleLabel}>EXAMPLE SCENARIO:</Text>
                    <Text style={styles.exampleText}>{section.example}</Text>
                  </View>
                )}
                
                {section.questions.map((q: any) => (
                    <View key={q.id} style={styles.qRow}>
                        <Text style={styles.qText}>{q.text}</Text>
                        
                        {/* 1. Boolean */}
                        {q.type === 'boolean' && (
                            <View style={styles.toggleRow}>
                                <TouchableOpacity onPress={() => handleAnswer(q.id, true)} style={[styles.toggleBtn, answers[q.id] === true && styles.yesBtn]}>
                                    <Text style={[styles.toggleText, answers[q.id] === true && styles.whiteText]}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAnswer(q.id, false)} style={[styles.toggleBtn, answers[q.id] === false && styles.noBtn]}>
                                    <Text style={[styles.toggleText, answers[q.id] === false && styles.whiteText]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        
                        {/* 2. Rating */}
                        {q.type === 'rating' && (
                            <View style={styles.ratingRow}>
                                {[1, 2, 3, 4, 5].map((score) => (
                                    <TouchableOpacity key={score} onPress={() => handleAnswer(q.id, score)} style={[styles.circleBtn, answers[q.id] === score && styles.circleBtnSelected]}>
                                        <Text style={[styles.circleText, answers[q.id] === score && styles.whiteText]}>{score}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        ))}

        {/* OVERALL FEEDBACK */}
        <View style={styles.card}>
            <Text style={styles.label}>Overall Feedback</Text>
            <TextInput 
                style={[styles.input, {height: 120}]} multiline 
                value={feedback} onChangeText={setFeedback} 
                textAlignVertical="top" placeholder="Summary..."
            />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Submit Evaluation</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    headerTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
    content: { padding: 20, paddingBottom: 50 },
    
    section: { marginBottom: 24 },
    sectionHeader: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#2563eb', paddingLeft: 10 },
    
    exampleBox: { backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#BFDBFE' },
    exampleLabel: { fontSize: 10, fontWeight: '700', color: '#1E40AF', marginBottom: 4 },
    exampleText: { fontSize: 13, color: '#1E3A8A', fontStyle: 'italic' },

    qRow: { flexDirection: 'column', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9' },
    qText: { fontSize: 15, fontWeight: '500', color: '#334155', marginBottom: 10 },
    
    toggleRow: { flexDirection: 'row', gap: 12 },
    toggleBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#F1F5F9' },
    yesBtn: { backgroundColor: '#10B981' },
    noBtn: { backgroundColor: '#EF4444' },
    toggleText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
    whiteText: { color: '#FFF' },
    
    ratingRow: { flexDirection: 'row', gap: 12 },
    circleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
    circleBtnSelected: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
    circleText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
    
    card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
    label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#F8FAFC' },
    btn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});