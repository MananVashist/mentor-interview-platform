// app/mentor/session/[id].tsx - DEBUG VERSION
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';

interface Criterion {
  id: string;
  description: string;
  type: 'boolean' | 'rating' | 'text';
  order: number;
}

interface Question {
  id: string;
  section_title: string;
  criteria: Criterion[];
}

export default function SessionFeedback() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Standard Scores
  const [techScore, setTechScore] = useState('');
  const [commScore, setCommScore] = useState('');
  const [feedback, setFeedback] = useState('');

  // Hierarchical Questions & Answers
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Record<string, any>>>({});

  useEffect(() => {
    if (id) loadSessionAndQuestions();
  }, [id]);

  const loadSessionAndQuestions = async () => {
    try {
      console.log('🔍 Loading session:', id);

      // 1. Get Session Info
      const { data: session, error: sErr } = await supabase
        .from('interview_sessions')
        .select(`*, package:interview_packages(target_profile)`)
        .eq('id', id)
        .single();

      if (sErr) throw sErr;

      console.log('✅ Session loaded:', session);
      console.log('📦 Package data:', session.package);

      // 2. Fetch Questions with Criteria
      const profile = session.package?.target_profile || 'Product Manager';
      const round = session.round || 'round_1';

      console.log('🔍 Fetching questions for:', { profile, round });

      const { data: questionsData, error: qErr } = await supabase
        .from('feedback_questions')
        .select('*')
        .eq('target_profile', profile)
        .eq('round', round)
        .order('order_index', { ascending: true });

      if (qErr) throw qErr;

      console.log('📋 Raw questions from DB:', questionsData);
      console.log('📊 Number of questions:', questionsData?.length || 0);

      if (questionsData && questionsData.length > 0) {
        const parsedQuestions = questionsData.map(q => {
          console.log('Question:', q.section_title, 'Criteria:', q.criteria);
          return {
            id: q.id,
            section_title: q.section_title,
            criteria: Array.isArray(q.criteria) ? q.criteria : []
          };
        });
        
        setQuestions(parsedQuestions);
        console.log('✅ Questions set:', parsedQuestions);

        // Initialize answers structure
        const initialAnswers: Record<string, Record<string, any>> = {};
        parsedQuestions.forEach(q => {
          initialAnswers[q.id] = {};
        });
        setAnswers(initialAnswers);
      } else {
        console.warn('⚠️ No questions found for this profile/round');
        Alert.alert(
          "No Template Found", 
          `No evaluation template exists for:\nProfile: ${profile}\nRound: ${round}\n\nPlease create questions in the admin template builder first.`
        );
      }

    } catch (e) {
      console.error('❌ Error loading:', e);
      Alert.alert("Error", "Failed to load evaluation template.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, criterionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [criterionId]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (!techScore || !commScore || !feedback) {
      Alert.alert("Missing Fields", "Please provide scores and feedback text.");
      return;
    }

    // Validate that all criteria are answered (only if questions exist)
    if (questions.length > 0) {
      let allAnswered = true;
      questions.forEach(q => {
        q.criteria.forEach(c => {
          if (answers[q.id]?.[c.id] === undefined || answers[q.id]?.[c.id] === '') {
            allAnswered = false;
          }
        });
      });

      if (!allAnswered) {
        Alert.alert("Incomplete", "Please answer all evaluation criteria before submitting.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('session_evaluations').insert({
        session_id: id,
        score_technical: Number(techScore),
        score_communication: Number(commScore),
        feedback_text: feedback,
        checklist_data: answers,
        created_at: new Date().toISOString()
      });
      
      if (error) throw error;

      await supabase.from('interview_sessions').update({ status: 'completed' }).eq('id', id);
      
      Alert.alert("Success", "Feedback submitted successfully!");
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Evaluate Candidate</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* DEBUG INFO */}
        <View style={{backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, marginBottom: 16}}>
          <Text style={{fontSize: 12, fontWeight: '600', color: '#92400E', marginBottom: 4}}>
            🐛 DEBUG INFO
          </Text>
          <Text style={{fontSize: 11, color: '#78350F'}}>
            Questions loaded: {questions.length}
          </Text>
          <Text style={{fontSize: 11, color: '#78350F'}}>
            Check browser console (F12) for details
          </Text>
        </View>

        {/* Hierarchical Questions */}
        {questions.length > 0 ? (
          questions.map((question, qIdx) => (
            <View key={question.id} style={styles.questionSection}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>{qIdx + 1}</Text>
                </View>
                <Text style={styles.questionTitle}>{question.section_title}</Text>
              </View>

              {/* Criteria under this question */}
              {question.criteria && question.criteria.length > 0 ? (
                question.criteria.map((criterion, cIdx) => (
                  <View key={criterion.id} style={styles.criterionCard}>
                    <View style={styles.criterionHeader}>
                      <Text style={styles.criterionLabel}>{cIdx + 1}.</Text>
                      <Text style={styles.criterionDesc}>{criterion.description}</Text>
                    </View>

                    {/* Render input based on type */}
                    {criterion.type === 'boolean' && (
                      <View style={styles.toggleRow}>
                        <TouchableOpacity 
                          onPress={() => handleAnswer(question.id, criterion.id, true)}
                          style={[
                            styles.toggleBtn, 
                            answers[question.id]?.[criterion.id] === true && styles.yesBtn
                          ]}
                        >
                          <Ionicons 
                            name={answers[question.id]?.[criterion.id] === true ? "checkmark-circle" : "ellipse-outline"} 
                            size={18} 
                            color={answers[question.id]?.[criterion.id] === true ? "#FFF" : "#94A3B8"} 
                          />
                          <Text style={[
                            styles.toggleText, 
                            answers[question.id]?.[criterion.id] === true && styles.whiteText
                          ]}>
                            Yes
                          </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          onPress={() => handleAnswer(question.id, criterion.id, false)}
                          style={[
                            styles.toggleBtn, 
                            answers[question.id]?.[criterion.id] === false && styles.noBtn
                          ]}
                        >
                          <Ionicons 
                            name={answers[question.id]?.[criterion.id] === false ? "close-circle" : "ellipse-outline"} 
                            size={18} 
                            color={answers[question.id]?.[criterion.id] === false ? "#FFF" : "#94A3B8"} 
                          />
                          <Text style={[
                            styles.toggleText, 
                            answers[question.id]?.[criterion.id] === false && styles.whiteText
                          ]}>
                            No
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    
                    {criterion.type === 'rating' && (
                      <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map(num => (
                          <TouchableOpacity 
                            key={num}
                            onPress={() => handleAnswer(question.id, criterion.id, num)}
                            style={[
                              styles.ratingBtn,
                              answers[question.id]?.[criterion.id] === num && styles.ratingBtnActive
                            ]}
                          >
                            <Text style={[
                              styles.ratingText,
                              answers[question.id]?.[criterion.id] === num && styles.whiteText
                            ]}>
                              {num}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {criterion.type === 'text' && (
                      <TextInput 
                        style={styles.textInput} 
                        placeholder="Enter your notes..."
                        multiline
                        numberOfLines={3}
                        value={answers[question.id]?.[criterion.id] || ''}
                        onChangeText={v => handleAnswer(question.id, criterion.id, v)}
                      />
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.noCriteria}>No criteria defined for this question.</Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={32} color="#D97706" />
            <Text style={styles.warningTitle}>No Evaluation Template</Text>
            <Text style={styles.warningText}>
              No questions have been created for this profile/round combination yet.
            </Text>
            <Text style={styles.warningSubtext}>
              You can still submit general feedback below, or ask an admin to create the template.
            </Text>
          </View>
        )}

        {/* Overall Scores & Feedback */}
        <View style={styles.overallSection}>
          <Text style={styles.sectionTitle}>Overall Assessment</Text>
          
          <View style={styles.scoreRow}>
            <View style={styles.scoreInput}>
              <Text style={styles.label}>Technical Score (1-10)</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                value={techScore} 
                onChangeText={setTechScore}
                placeholder="1-10"
              />
            </View>
            
            <View style={styles.scoreInput}>
              <Text style={styles.label}>Communication Score (1-10)</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                value={commScore} 
                onChangeText={setCommScore}
                placeholder="1-10"
              />
            </View>
          </View>
          
          <Text style={styles.label}>Overall Feedback</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            multiline 
            value={feedback} 
            onChangeText={setFeedback} 
            textAlignVertical="top"
            placeholder="Provide comprehensive feedback on the candidate's performance..."
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} 
          onPress={handleSubmit} 
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff"/>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={styles.submitBtnText}>Submit Evaluation</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 16, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  
  content: { padding: 20, paddingBottom: 40 },

  // Warning Box
  warningBox: {
    backgroundColor: '#FFF7ED',
    borderWidth: 2,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
    marginTop: 12,
    marginBottom: 8
  },
  warningText: {
    fontSize: 14,
    color: '#78350F',
    textAlign: 'center',
    marginBottom: 8
  },
  warningSubtext: {
    fontSize: 12,
    color: '#A16207',
    textAlign: 'center',
    fontStyle: 'italic'
  },

  // Question Sections
  questionSection: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1
  },
  questionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  questionNumber: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#2563EB', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 12
  },
  questionNumberText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  questionTitle: { 
    flex: 1,
    fontSize: 17, 
    fontWeight: '700', 
    color: '#1E293B' 
  },
  
  noCriteria: { 
    textAlign: 'center', 
    color: '#94A3B8', 
    fontSize: 13, 
    fontStyle: 'italic',
    paddingVertical: 16
  },

  // Criterion Cards
  criterionCard: { 
    backgroundColor: '#FAFAFA', 
    borderRadius: 10, 
    padding: 14, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  criterionHeader: { 
    flexDirection: 'row', 
    marginBottom: 12 
  },
  criterionLabel: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#64748B',
    marginRight: 8
  },
  criterionDesc: { 
    flex: 1,
    fontSize: 14, 
    fontWeight: '500', 
    color: '#334155',
    lineHeight: 20
  },

  // Boolean Toggle
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: { 
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10, 
    borderRadius: 8, 
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  yesBtn: { backgroundColor: '#10B981', borderColor: '#10B981' },
  noBtn: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  whiteText: { color: '#FFF' },

  // Rating Scale
  ratingRow: { flexDirection: 'row', gap: 8 },
  ratingBtn: { 
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  ratingBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  ratingText: { fontSize: 14, fontWeight: '600', color: '#64748B' },

  // Text Input
  textInput: { 
    borderWidth: 1, 
    borderColor: '#CBD5E1', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 14,
    backgroundColor: '#FFF',
    minHeight: 80,
    textAlignVertical: 'top'
  },

  // Overall Section
  overallSection: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 20, 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginBottom: 16 
  },
  scoreRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  scoreInput: { flex: 1 },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#475569', 
    marginBottom: 8 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#CBD5E1', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 15,
    backgroundColor: '#FAFAFA'
  },
  textArea: { 
    height: 120, 
    textAlignVertical: 'top' 
  },

  // Submit Button
  submitBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB', 
    padding: 16, 
    borderRadius: 12, 
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 16 
  }
});