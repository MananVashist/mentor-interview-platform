// app/mentor/session/[id].tsx
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
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';
import { MASTER_TEMPLATES } from '@/lib/evaluation-templates';

export default function MentorEvaluationScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isViewMode, setIsViewMode] = useState(false);
  
  // Metadata for the session (Display Only)
  const [sessionInfo, setSessionInfo] = useState({
    profile: '',
    skill: '',
    candidateName: '',
    date: '',
  });

  useEffect(() => {
    if (id && id !== 'undefined') {
      loadSessionAndTemplate();
    } else {
      Alert.alert('Error', 'Invalid session ID');
      router.back();
    }
  }, [id]);

  const loadSessionAndTemplate = async () => {
    try {
      if (!id) throw new Error('Invalid ID');

      // ============================================================================
      // 1. FETCH SESSION DATA (including existing evaluation answers if present)
      // ============================================================================
      const { data: session, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          package:interview_packages(id, interview_profile_id),
          skill:interview_skills_admin!skill_id(name),
          evaluation:session_evaluations(*)
        `)
        .eq('id', String(id))
        .maybeSingle();

      if (error) throw error;
      if (!session) throw new Error('Session not found');

      // ============================================================================
      // 2. FETCH CANDIDATE PROFESSIONAL TITLE (for anonymity)
      // ============================================================================
      let candidateName = 'Candidate';
      if (session.candidate_id) {
        const { data: candidateData } = await supabase
          .from('candidates')
          .select('professional_title')
          .eq('id', session.candidate_id)
          .single();
        
        if (candidateData?.professional_title) {
          candidateName = candidateData.professional_title;
        }
      }

      // ============================================================================
      // 3. CHECK IF EVALUATION EXISTS (determines view vs edit mode)
      // ============================================================================
      const evaluationRow = Array.isArray(session.evaluation) 
        ? session.evaluation[0] 
        : session.evaluation;
      
      const existingAnswers = evaluationRow?.checklist_data?.answers || {};
      const existingTemplate = evaluationRow?.checklist_data?.template || null;
      const isCompleted = evaluationRow?.status === 'completed';

      setAnswers(existingAnswers);
      setIsViewMode(isCompleted && existingTemplate !== null);

      // ============================================================================
      // 4. FETCH CURRENT PROFILE & SKILL NAMES FROM DATABASE
      // ============================================================================
      let displayProfile = 'Interview Evaluation';
      let displaySkill = 'General Skill';

      // Get Profile Name
      if (session.package?.interview_profile_id) {
        const { data: profileData } = await supabase
          .from('interview_profiles_admin')
          .select('name')
          .eq('id', session.package.interview_profile_id)
          .single();
        if (profileData?.name) {
          displayProfile = profileData.name;
        }
      }

      // Get Skill Name
      if (session.skill?.name) {
        displaySkill = session.skill.name;
      } else if (session.skill_id) {
        const { data: skillData } = await supabase
          .from('interview_skills_admin')
          .select('name')
          .eq('id', session.skill_id)
          .single();
        if (skillData?.name) {
          displaySkill = skillData.name;
        }
      }

      // ============================================================================
      // 5. 🟢 LOAD TEMPLATE - DIFFERENT LOGIC FOR VIEW VS EDIT
      //    EDIT MODE: Load current template with examples from file
      //    VIEW MODE: Load stored questions only (no examples)
      // ============================================================================
      let selectedTemplate: any[] = [];

      if (isCompleted && existingTemplate) {
        // 🔵 VIEW MODE: Use stored questions (no examples saved)
        console.log('📖 [Evaluation] VIEW MODE: Using stored questions from submission');
        selectedTemplate = existingTemplate;
      } else {
        // 🟢 EDIT MODE: Use current template from file (with examples)
        console.log('✏️ [Evaluation] EDIT MODE: Using current template from file');
        
        const profileId = session.package?.interview_profile_id;
        const skillId = session.skill_id;

        if (profileId && MASTER_TEMPLATES[profileId]) {
          const profileEntry = MASTER_TEMPLATES[profileId];
          
          // Try exact skill match
          if (skillId && profileEntry.skills[skillId]) {
            selectedTemplate = profileEntry.skills[skillId].templates;
            console.log(`✅ Found current template with ${selectedTemplate.length} sections`);
          } 
          // Fallback: Use first available skill if exact ID fails
          else {
            const firstSkillKey = Object.keys(profileEntry.skills)[0];
            if (firstSkillKey) {
              selectedTemplate = profileEntry.skills[firstSkillKey].templates;
              console.log(`⚠️ Using fallback skill template`);
            }
          }
        } else {
          console.error(`❌ No template found for Profile ID: ${profileId}`);
        }
      }

      setTemplate(selectedTemplate || []);

      // ============================================================================
      // 6. SET DISPLAY INFO
      // ============================================================================
      setSessionInfo({
        profile: displayProfile,
        skill: displaySkill,
        candidateName: candidateName,
        date: new Date(session.scheduled_at).toLocaleDateString(),
      });

    } catch (err: any) {
      console.error('[Evaluation] Error loading session:', err);
      Alert.alert('Error', 'Failed to load session.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // ============================================================================
      // 🟢 PREPARE TEMPLATE FOR STORAGE (Questions only, no examples)
      // This ensures we can always display the exact questions that were answered,
      // even if the template file changes later
      // ============================================================================
      const templateForStorage = template.map(section => ({
        title: section.title,
        questions: section.questions // Only store questions, not examples
      }));

      const payload = {
        meta: {
          profile_used: sessionInfo.profile,
          skill_used: sessionInfo.skill,
          submitted_at: new Date().toISOString(),
        },
        template: templateForStorage, // 🔑 Store questions only
        answers: answers
      };

      console.log('💾 [Evaluation] Saving evaluation with question structure');

      // Check if evaluation already exists
      const { data: existingEval, error: fetchError } = await supabase
        .from('session_evaluations')
        .select('id')
        .eq('session_id', id)
        .maybeSingle(); 

      if (fetchError) throw fetchError;

      let error;

      if (existingEval) {
        // Update existing evaluation
        const { error: updateErr } = await supabase
          .from('session_evaluations')
          .update({
            checklist_data: payload,
            updated_at: new Date().toISOString(),
            status: 'completed'
          })
          .eq('session_id', id);
        error = updateErr;

      } else {
        // Create new evaluation
        const { error: insertErr } = await supabase
          .from('session_evaluations')
          .insert({
            session_id: id,
            checklist_data: payload,
            status: 'completed'
          });
        error = insertErr;
      }

      if (error) throw error;

      // Mark session as completed
      await supabase
        .from('interview_sessions')
        .update({ status: 'completed' })
        .eq('id', id);

      Alert.alert("Success", "Feedback submitted successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);

    } catch (err: any) {
      console.error('[Evaluation] Submission error:', err);
      Alert.alert("Submission Failed", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0E9384" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>
            {isViewMode ? 'View Evaluation' : 'Evaluate Candidate'}
          </Text>
          <Text style={styles.headerSub}>{sessionInfo.candidateName}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{sessionInfo.profile}</Text>
          <Text style={styles.infoSub}>{sessionInfo.skill} • {sessionInfo.date}</Text>
          {isViewMode && (
            <View style={styles.viewModeBadge}>
              <Ionicons name="eye-outline" size={14} color="#6366F1" />
              <Text style={styles.viewModeText}>Read-only View</Text>
            </View>
          )}
        </View>

        {template.length === 0 ? (
          <View style={{padding: 20, alignItems:'center'}}>
             <Text style={{color:'#666'}}>No evaluation template found for this skill.</Text>
          </View>
        ) : (
          template.map((section, idx) => (
            <View key={idx} style={styles.section}>
              <Text style={styles.sectionHeader}>{section.title}</Text>
              
              {/* Display example scenarios (only in EDIT mode, not stored in VIEW mode) */}
              {!isViewMode && section.example && (
                <View style={styles.exampleBox}>
                  {Array.isArray(section.example) ? (
                    <View>
                      <Text style={styles.exampleHeader}>💡 Example Scenarios:</Text>
                      {section.example.map((item: string, exIdx: number) => (
                        <Text key={exIdx} style={styles.exampleItem}>
                          {exIdx + 1}. {item}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.exampleText}>💡 {section.example}</Text>
                  )}
                </View>
              )}

              {section.questions.map((q: any) => (
                <View key={q.id} style={styles.questionContainer}>
                  <Text style={styles.questionText}>{q.text}</Text>

                  {q.type === 'text' && (
                    <TextInput
                      style={[styles.textArea, isViewMode && styles.disabled]}
                      multiline
                      placeholder="Enter your feedback here..."
                      value={answers[q.id] || ''}
                      onChangeText={(text) => handleAnswerChange(q.id, text)}
                      editable={!isViewMode}
                    />
                  )}

                  {q.type === 'rating' && (
                    <View style={styles.ratingContainer}>
                      {[1, 2, 3, 4, 5].map((val) => {
                        const isSelected = answers[q.id] === val;
                        return (
                          <TouchableOpacity
                            key={val}
                            style={[styles.ratingBtn, isSelected && styles.ratingBtnSelected]}
                            onPress={() => !isViewMode && handleAnswerChange(q.id, val)}
                            disabled={isViewMode}
                          >
                            <Text style={[styles.ratingText, isSelected && styles.ratingTextSelected]}>
                              {val}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  {q.type === 'boolean' && (
                    <View style={styles.boolContainer}>
                      <TouchableOpacity
                        style={[styles.boolBtn, answers[q.id] === true && styles.boolBtnYes]}
                        onPress={() => !isViewMode && handleAnswerChange(q.id, true)}
                        disabled={isViewMode}
                      >
                        <Text style={[styles.boolText, answers[q.id] === true && styles.boolTextSelected]}>Yes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.boolBtn, answers[q.id] === false && styles.boolBtnNo]}
                        onPress={() => !isViewMode && handleAnswerChange(q.id, false)}
                        disabled={isViewMode}
                      >
                        <Text style={[styles.boolText, answers[q.id] === false && styles.boolTextSelected]}>No</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))
        )}

        {!isViewMode ? (
          <TouchableOpacity 
            style={[styles.submitBtn, submitting && styles.btnDisabled]} 
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Evaluation</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={[styles.submitBtn, styles.btnSubmitted]}>
            <Ionicons name="checkmark-circle" size={20} color="#059669" style={{marginRight: 8}} />
            <Text style={styles.submittedBtnText}>Evaluation Submitted</Text>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  headerSub: { fontSize: 12, color: '#64748B', textAlign: 'center' },

  content: { padding: 20, paddingBottom: 60 },

  infoCard: {
    backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 24,
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  infoSub: { fontSize: 14, color: '#64748B', marginTop: 4 },
  viewModeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8,
    paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#EEF2FF',
    borderRadius: 6, alignSelf: 'flex-start'
  },
  viewModeText: { fontSize: 11, fontWeight: '600', color: '#6366F1' },

  section: { marginBottom: 32 },
  sectionHeader: { 
    fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 12, 
    borderLeftWidth: 4, borderLeftColor: '#0E9384', paddingLeft: 12 
  },
  exampleBox: { 
    backgroundColor: '#F0FDFA', padding: 12, borderRadius: 8, marginBottom: 16,
    borderWidth: 1, borderColor: '#CCFBF1'
  },
  exampleHeader: { 
    fontSize: 13, color: '#0F766E', fontWeight: '700', marginBottom: 8 
  },
  exampleItem: { 
    fontSize: 13, color: '#0F766E', lineHeight: 20, marginBottom: 6 
  },
  exampleText: { fontSize: 13, color: '#0F766E', fontStyle: 'italic' },

  questionContainer: { marginBottom: 20 },
  questionText: { fontSize: 15, fontWeight: '600', color: '#334155', marginBottom: 10 },

  textArea: {
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8,
    padding: 12, height: 100, textAlignVertical: 'top', fontSize: 14
  },
  disabled: { backgroundColor: '#F9FAFB', color: '#6B7280' },

  ratingContainer: { flexDirection: 'row', gap: 10 },
  ratingBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0'
  },
  ratingBtnSelected: { backgroundColor: '#0E9384', borderColor: '#0E9384' },
  ratingText: { fontSize: 16, fontWeight: '600', color: '#64748B' },
  ratingTextSelected: { color: '#FFF' },

  boolContainer: { flexDirection: 'row', gap: 12 },
  boolBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F1F5F9',
    alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0'
  },
  boolBtnYes: { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' },
  boolBtnNo: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  boolText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  boolTextSelected: { color: '#1E293B' },

  submitBtn: {
    backgroundColor: '#0E9384', paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'center'
  },
  btnDisabled: { opacity: 0.7 },
  btnSubmitted: { backgroundColor: '#ECFDF5', borderWidth: 2, borderColor: '#059669' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  submittedBtnText: { color: '#059669', fontSize: 16, fontWeight: '700' },
});