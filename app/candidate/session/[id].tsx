// app/candidate/session/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';

export default function CandidateViewEvaluation() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [template, setTemplate] = useState<any[]>([]);

  const [sessionInfo, setSessionInfo] = useState({
    profile: '',
    skill: '',
    mentorName: '',
    date: '',
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
      if (!id || id === 'undefined') throw new Error('Invalid session ID');

      // ============================================================================
      // 1. FETCH SESSION DATA with evaluation
      // ============================================================================
      const { data: session, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          package:interview_packages(id, interview_profile_id),
          mentor:mentors!mentor_id(id, professional_title, profile:profiles(full_name)),
          skill:interview_skills_admin!skill_id(name),
          evaluation:session_evaluations(*)
        `)
        .eq('id', String(id))
        .single();

      if (error) throw error;
      if (!session) throw new Error('Session not found');

      // ============================================================================
      // 2. EXTRACT EVALUATION DATA
      // ============================================================================
      const evaluationData = Array.isArray(session.evaluation)
        ? session.evaluation[0]
        : session.evaluation;
      setEvaluation(evaluationData || null);

      // ============================================================================
      // 3. 🟢 USE STORED TEMPLATE (from evaluation submission time)
      //    This ensures we display exactly what was evaluated, even if 
      //    the template file has been updated since
      // ============================================================================
      let displayTemplate: any[] = [];
      
      if (evaluationData?.checklist_data?.template) {
        console.log('✅ [CandidateView] Using stored template from evaluation');
        displayTemplate = evaluationData.checklist_data.template;
      } else {
        console.warn('⚠️ [CandidateView] No stored template found - evaluation may be incomplete');
      }

      setTemplate(displayTemplate);

      // ============================================================================
      // 4. GET DISPLAY NAMES (from meta or fetch from DB)
      // ============================================================================
      const metaProfile = evaluationData?.checklist_data?.meta?.profile_used || null;
      const metaSkill = evaluationData?.checklist_data?.meta?.skill_used || null;

      // Profile name
      let profileName: string = metaProfile || '';
      if (!profileName && session.package?.interview_profile_id) {
        const { data: p } = await supabase
          .from('interview_profiles_admin')
          .select('name')
          .eq('id', session.package.interview_profile_id)
          .single();
        if (p?.name) profileName = p.name;
      }

      // Skill name
      let skillName: string | undefined = metaSkill || session.skill?.name;
      if (!skillName && session.skill_id) {
        const { data: skillData } = await supabase
          .from('interview_skills_admin')
          .select('name')
          .eq('id', session.skill_id)
          .single();
        
        if (skillData?.name) {
          skillName = skillData.name;
        }
      }

      // ============================================================================
      // 5. SET DISPLAY INFO
      // ============================================================================
      const mentorName =
        session.mentor?.professional_title ||
        'Senior Mentor';
      const date = new Date(session.scheduled_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      setSessionInfo({
        profile: profileName || 'Interview Session',
        skill: skillName || 'General',
        mentorName,
        date,
      });
    } catch (e: any) {
      console.error('[CandidateView] Load Error:', e);
      Alert.alert('Error', 'Failed to load session details.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Helper to style answers (as badges)
  const getAnswerDisplay = (qId: string, type: string) => {
    const val = evaluation?.checklist_data?.answers?.[qId];

    // Empty state
    if (val === undefined || val === null) {
      return {
        text: 'Not answered',
        color: '#6B7280',
        bg: '#F3F4F6',
        border: '#E5E7EB',
      };
    }

    // Boolean state
    if (type === 'boolean') {
      return {
        text: val ? 'Yes' : 'No',
        color: val ? '#059669' : '#DC2626',
        bg: val ? '#ECFDF5' : '#FEF2F2',
        border: val ? '#6EE7B7' : '#FECACA',
      };
    }

    // Rating state
    if (type === 'rating') {
      const isGood = val >= 4;
      const isAvg = val === 3;
      return {
        text: `${val}/5`,
        color: isGood ? '#059669' : isAvg ? '#D97706' : '#DC2626',
        bg: isGood ? '#ECFDF5' : isAvg ? '#FFFBEB' : '#FEF2F2',
        border: isGood ? '#6EE7B7' : isAvg ? '#FDE68A' : '#FECACA',
      };
    }

    // Default fallback (text, etc.)
    return {
      text: String(val),
      color: '#374151',
      bg: '#F3F4F6',
      border: '#E5E7EB',
    };
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0E9384" />
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
          <Ionicons name="close" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Evaluation</Text>
          <Text style={styles.headerSub}>
            {sessionInfo.profile} • {sessionInfo.skill}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Session details card */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionCardHeader}>
            <Ionicons name="document-text-outline" size={18} color="#0E9384" />
            <Text style={styles.sessionCardTitle}>Session Details</Text>
          </View>
          <View style={styles.sessionDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Interview Type</Text>
            <Text style={styles.detailValue}>{sessionInfo.profile}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Focus Skill</Text>
            <Text style={styles.detailValue}>{sessionInfo.skill}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mentor</Text>
            <Text style={styles.detailValue}>{sessionInfo.mentorName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{sessionInfo.date}</Text>
          </View>
        </View>

        {/* If no evaluation yet, show pending state */}
        {!evaluation?.checklist_data && (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={40} color="#9CA3AF" />
            <Text style={styles.emptyText}>
              Feedback is pending. The mentor will submit it soon.
            </Text>
          </View>
        )}

        {/* Detailed evaluation - using STORED template */}
        {evaluation?.checklist_data &&
          template.map((section, idx) => (
            <View key={idx} style={styles.section}>
              <Text style={styles.sectionHeader}>{section.title}</Text>

              {/* Display example scenarios */}
              {section.example && (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>SCENARIO DISCUSSED:</Text>
                  {Array.isArray(section.example) ? (
                    <View style={{ marginTop: 8 }}>
                      {section.example.map((item: string, exIdx: number) => (
                        <Text key={exIdx} style={styles.exampleItem}>
                          {exIdx + 1}. {item}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.exampleText}>{section.example}</Text>
                  )}
                </View>
              )}

              {section.questions.map((q: any) => {
                // Text feedback → comment box
                if (q.type === 'text') {
                  const txt = evaluation?.checklist_data?.answers?.[q.id];
                  if (!txt) return null;
                  return (
                    <View key={q.id} style={styles.commentBox}>
                      <Text style={styles.qText}>{q.text}</Text>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentText}>{txt}</Text>
                      </View>
                    </View>
                  );
                }

                // Rating / Boolean → badge (read-only)
                const ans = getAnswerDisplay(q.id, q.type);
                return (
                  <View key={q.id} style={styles.qRow}>
                    <Text style={styles.qText}>{q.text}</Text>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: ans.bg, borderColor: ans.border },
                      ]}
                    >
                      <Text
                        style={[styles.badgeText, { color: ans.color }]}
                      >
                        {ans.text}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },

  content: { padding: 20, paddingBottom: 50 },

  // Session summary card
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  sessionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sessionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  sessionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },

  // Section styling
  section: { marginBottom: 24 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0E9384',
    paddingLeft: 10,
  },

  exampleBox: {
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  exampleLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 4,
  },
  exampleItem: {
    fontSize: 13,
    color: '#134E4A',
    lineHeight: 20,
    marginBottom: 6,
  },
  exampleText: {
    fontSize: 13,
    color: '#134E4A',
    fontStyle: 'italic',
  },

  // Question row card
  qRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginRight: 12,
    flex: 1,
  },

  // Badge showing answer
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Text comment card
  commentBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  commentContent: {
    marginTop: 8,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#9CA3AF',
  },
  commentText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Empty / pending state
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});