// app/candidate/session/[id].tsx
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';
import { MASTER_TEMPLATES } from '@/lib/evaluation-templates';

export default function CandidateViewEvaluation() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [template, setTemplate] = useState<any[]>([]);
  const [sessionInfo, setSessionInfo] = useState({ 
    profile: '', 
    round: '', 
    mentorName: '',
    date: ''
  });

  useEffect(() => {
    if (id && id !== 'undefined') {
      loadEvaluation();
    } else {
      Alert.alert('Error', 'Invalid session ID');
      router.back();
    }
  }, [id]);

  const loadEvaluation = async () => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid session ID');
      }

      // 1. Fetch Session and Evaluation
      const { data: session, error: sessionError } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          package:interview_packages(
            id,
            interview_profile_id
          ),
          mentor:mentors!mentor_id(
            id,
            professional_title
          ),
          evaluation:session_evaluations(*)
        `)
        .eq('id', String(id))
        .single();

      if (sessionError) throw sessionError;
      if (!session) throw new Error('Session not found');

      // Check if evaluation exists
      if (!session.evaluation || session.evaluation.length === 0) {
        Alert.alert('Not Available', 'The mentor has not submitted feedback yet.');
        router.back();
        return;
      }

      const evaluationData = Array.isArray(session.evaluation) 
        ? session.evaluation[0] 
        : session.evaluation;

      setEvaluation(evaluationData);

      // 2. Get profile name
      let profile = 'Product Manager';
      if (session.package?.interview_profile_id) {
        const { data: profileData } = await supabase
          .from('interview_profiles_admin')
          .select('name')
          .eq('id', session.package.interview_profile_id)
          .single();
        
        if (profileData) profile = profileData.name;
      }

      const round = session.round || 'round_1';
      const mentorName = session.mentor?.professional_title || 'Your Mentor';
      const date = new Date(session.scheduled_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      setSessionInfo({ profile, round, mentorName, date });

      // 3. Load template
      const profileTemplates = MASTER_TEMPLATES[profile] || MASTER_TEMPLATES["Product Manager"];
      const roundQuestions = profileTemplates[round] || profileTemplates["round_1"];
      setTemplate(roundQuestions);

    } catch (e: any) {
      console.error('Load evaluation error:', e);
      Alert.alert("Error", e.message || "Failed to load evaluation.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const getAnswerDisplay = (questionId: string, questionType: string) => {
    const answer = evaluation?.checklist_data?.answers?.[questionId];
    
    if (answer === undefined || answer === null) {
      return { text: 'Not answered', color: '#9CA3AF' };
    }

    if (questionType === 'boolean') {
      return {
        text: answer ? 'Yes ✓' : 'No ✗',
        color: answer ? '#10B981' : '#EF4444'
      };
    }

    if (questionType === 'rating') {
      return {
        text: `${answer}/5`,
        color: answer >= 4 ? '#10B981' : answer >= 3 ? '#F59E0B' : '#EF4444'
      };
    }

    return { text: String(answer), color: '#374151' };
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interview Feedback</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Session Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="document-text" size={24} color="#2563eb" />
            <Text style={styles.infoTitle}>Session Details</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Interview Type:</Text>
            <Text style={styles.infoValue}>{sessionInfo.profile}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Round:</Text>
            <Text style={styles.infoValue}>{sessionInfo.round.replace('_', ' ')}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mentor:</Text>
            <Text style={styles.infoValue}>{sessionInfo.mentorName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{sessionInfo.date}</Text>
          </View>
        </View>

        {/* Evaluation Sections */}
        <Text style={styles.sectionTitle}>Detailed Evaluation</Text>
        
        {template.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            
            {section.example && (
              <View style={styles.exampleBox}>
                <Text style={styles.exampleLabel}>SCENARIO DISCUSSED:</Text>
                <Text style={styles.exampleText}>{section.example}</Text>
              </View>
            )}
            
            {section.questions.map((q: any) => {
              const answer = getAnswerDisplay(q.id, q.type);
              
              return (
                <View key={q.id} style={styles.qRow}>
                  <View style={styles.qHeader}>
                    <Text style={styles.qText}>{q.text}</Text>
                    <View style={[styles.answerBadge, { backgroundColor: answer.color + '20' }]}>
                      <Text style={[styles.answerText, { color: answer.color }]}>
                        {answer.text}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Rating visualization */}
                  {q.type === 'rating' && evaluation?.checklist_data?.answers?.[q.id] && (
                    <View style={styles.ratingDots}>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <View 
                          key={score} 
                          style={[
                            styles.dot,
                            evaluation.checklist_data.answers[q.id] >= score && styles.dotFilled
                          ]} 
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {/* Overall Feedback */}
        {evaluation?.checklist_data?.summary_feedback && (
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <Ionicons name="chatbox-ellipses" size={20} color="#2563eb" />
              <Text style={styles.feedbackTitle}>Overall Feedback from Mentor</Text>
            </View>
            <Text style={styles.feedbackText}>
              {evaluation.checklist_data.summary_feedback}
            </Text>
          </View>
        )}

        {/* Encouragement Message */}
        <View style={styles.encouragementCard}>
          <Ionicons name="star" size={24} color="#F59E0B" />
          <Text style={styles.encouragementText}>
            Review this feedback carefully and use it to improve for your next interview. 
            Keep practicing and you'll get better with each session!
          </Text>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 20, 
    paddingBottom: 16, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  
  content: { padding: 20, paddingBottom: 50 },
  
  infoCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  
  section: { 
    marginBottom: 24,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#1E293B', 
    marginBottom: 12,
    paddingLeft: 12,
    borderLeftWidth: 4, 
    borderLeftColor: '#2563eb',
  },
  
  exampleBox: { 
    backgroundColor: '#EFF6FF', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#BFDBFE' 
  },
  exampleLabel: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: '#1E40AF', 
    marginBottom: 4 
  },
  exampleText: { 
    fontSize: 13, 
    color: '#1E3A8A', 
    fontStyle: 'italic',
    lineHeight: 18,
  },

  qRow: { 
    backgroundColor: '#F8FAFC',
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  qText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#334155',
    flex: 1,
    marginRight: 12,
  },
  answerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  answerText: {
    fontSize: 13,
    fontWeight: '700',
  },
  
  ratingDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  dotFilled: {
    backgroundColor: '#2563eb',
  },
  
  feedbackCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  feedbackText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  
  encouragementCard: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  encouragementText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});