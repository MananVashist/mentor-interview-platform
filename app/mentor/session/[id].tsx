// app/mentor/session/[id].tsx
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';

export default function SessionFeedback() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Standard Scores
  const [techScore, setTechScore] = useState('');
  const [commScore, setCommScore] = useState('');
  const [feedback, setFeedback] = useState('');

  // Dynamic Checklist Data
  const [checklistSections, setChecklistSections] = useState<any[]>([]); // Grouped questions
  const [checklistAnswers, setChecklistAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (id) loadSessionAndQuestions();
  }, [id]);

  const loadSessionAndQuestions = async () => {
    try {
      // 1. Get Session Info to know which Profile/Round
      const { data: session, error: sErr } = await supabase
        .from('interview_sessions')
        .select(`*, package:interview_packages(target_profile)`)
        .eq('id', id)
        .single();

      if (sErr) throw sErr;

      // 2. Fetch Matching Questions
      const profile = session.package?.target_profile || 'Product Manager'; // Default fallback
      const round = session.round || 'round_1';

      const { data: questions, error: qErr } = await supabase
        .from('feedback_questions')
        .select('*')
        .eq('target_profile', profile)
        .eq('round', round)
        .order('section_title', { ascending: true })
        .order('order_index', { ascending: true });

      if (qErr) throw qErr;

      // 3. Group questions by Section
      if (questions) {
        const grouped = questions.reduce((acc: any, q) => {
          const sec = q.section_title;
          if (!acc[sec]) acc[sec] = [];
          acc[sec].push(q);
          return acc;
        }, {});

        // Convert to array
        const sectionsArray = Object.keys(grouped).map(title => ({
            title,
            questions: grouped[title]
        }));
        setChecklistSections(sectionsArray);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load checklist.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qId: string, val: any) => {
    setChecklistAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async () => {
    if (!techScore || !commScore || !feedback) {
      Alert.alert("Missing Fields", "Please provide scores and feedback text.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('session_evaluations').insert({
          session_id: id,
          score_technical: Number(techScore),
          score_communication: Number(commScore),
          feedback_text: feedback,
          checklist_data: checklistAnswers, // ✅ Saving the dynamic JSON
          created_at: new Date().toISOString()
      });
      
      if (error) throw error;

      await supabase.from('interview_sessions').update({ status: 'completed' }).eq('id', id);
      
      Alert.alert("Success", "Feedback submitted!");
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Submission failed.");
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
        <Text style={styles.headerTitle}>Evaluate Candidate</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* DYNAMIC CHECKLIST */}
        {checklistSections.map((section, idx) => (
            <View key={idx} style={styles.section}>
                <Text style={styles.sectionHeader}>{section.title}</Text>
                
                {section.questions.map((q: any) => (
                    <View key={q.id} style={styles.qRow}>
                        <View style={{flex: 1, marginRight: 12}}>
                            <Text style={styles.qText}>{q.description}</Text>
                            {q.example_text && <Text style={styles.qExample}>{q.example_text}</Text>}
                        </View>
                        
                        {/* Render Input based on Type */}
                        {q.question_type === 'boolean' && (
                            <View style={styles.toggleRow}>
                                <TouchableOpacity 
                                    onPress={() => handleAnswer(q.id, true)}
                                    style={[styles.toggleBtn, checklistAnswers[q.id] === true && styles.yesBtn]}
                                >
                                    <Text style={[styles.toggleText, checklistAnswers[q.id] === true && styles.whiteText]}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => handleAnswer(q.id, false)}
                                    style={[styles.toggleBtn, checklistAnswers[q.id] === false && styles.noBtn]}
                                >
                                    <Text style={[styles.toggleText, checklistAnswers[q.id] === false && styles.whiteText]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        
                        {q.question_type === 'rating' && (
                            <TextInput 
                                style={styles.miniInput} 
                                keyboardType="numeric" 
                                placeholder="1-5"
                                onChangeText={v => handleAnswer(q.id, v)}
                            />
                        )}
                    </View>
                ))}
            </View>
        ))}

        {/* STATIC SCORES */}
        <View style={styles.card}>
            <Text style={styles.label}>Technical Score (1-10)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={techScore} onChangeText={setTechScore} />
            
            <Text style={styles.label}>Communication Score (1-10)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={commScore} onChangeText={setCommScore} />
            
            <Text style={styles.label}>Overall Feedback</Text>
            <TextInput style={[styles.input, {height: 100}]} multiline value={feedback} onChangeText={setFeedback} textAlignVertical="top" />
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
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
    content: { padding: 20, paddingBottom: 50 },

    section: { marginBottom: 24 },
    sectionHeader: { fontSize: 14, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
    
    qRow: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 8, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
    qText: { fontSize: 15, fontWeight: '500', color: '#1E293B' },
    qExample: { fontSize: 12, color: '#94A3B8', marginTop: 4, fontStyle: 'italic' },

    toggleRow: { flexDirection: 'row', gap: 8 },
    toggleBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#F1F5F9' },
    yesBtn: { backgroundColor: '#10B981' },
    noBtn: { backgroundColor: '#EF4444' },
    toggleText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
    whiteText: { color: '#FFF' },

    miniInput: { width: 50, height: 36, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, textAlign: 'center' },

    card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
    label: { fontSize: 14, fontWeight: '600', color: '#334155', marginTop: 12, marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#F8FAFC' },

    btn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});