// app/mentor/session/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform, TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';
import { MASTER_TEMPLATES, INTRO_CALL_TEMPLATES, INTRO_CALL_TEMPLATE_FALLBACK } from '@/lib/evaluation-templates';
import { useNotification } from '@/lib/ui/NotificationBanner';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  ios: 'System', android: 'Roboto', default: 'System',
}) as string;

// ── AI Feedback Types ──────────────────────────────────────────────────────
interface AICompetency {
  title: string;
  score: number;
  severity: 'Must Fix Before Interview' | 'Important Gap to Address' | 'Good';
  did_well: string[];
  needs_improvement: string[];
  what_you_said?: string;
  suggested_answer?: string;
}
interface AIFeedback {
  readiness_score: number;
  readiness_label: string;
  feedback_summary: string;
  red_flags: string[];
  competencies: AICompetency[];
  next_steps: { action: string; drill: string }[];
}

// ── AI Feedback Helpers ────────────────────────────────────────────────────
const getSeverityColor = (severity: string) => {
  if (severity === 'Must Fix Before Interview') return { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' };
  if (severity === 'Important Gap to Address') return { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' };
  return { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' };
};
const getScoreColor = (score: number) => {
  if (score < 40) return '#BE123C';
  if (score < 60) return '#D97706';
  if (score < 80) return '#0E9384';
  return '#166534';
};

// ── Competency Card ────────────────────────────────────────────────────────
const CompetencyCard = ({ item }: { item: AICompetency }) => {
  const [expanded, setExpanded] = useState(false);
  const colors = getSeverityColor(item.severity);
  const scoreColor = getScoreColor(item.score);
  return (
    <View style={[ai.compCard, { borderLeftColor: scoreColor }]}>
      <TouchableOpacity style={ai.compHeader} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View style={{ flex: 1 }}>
          <Text style={ai.compTitle}>{item.title}</Text>
          <View style={[ai.severityBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <Text style={[ai.severityText, { color: colors.text }]}>{item.severity}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={[ai.compScore, { color: scoreColor }]}>{item.score}%</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={ai.compBody}>
          {item.did_well.length > 0 && (
            <View style={ai.compSection}>
              <View style={ai.compSectionHeader}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={[ai.compSectionTitle, { color: '#059669' }]}>What they did well</Text>
              </View>
              {item.did_well.map((point, i) => (
                <View key={i} style={ai.bullet}>
                  <View style={[ai.bulletDot, { backgroundColor: '#059669' }]} />
                  <Text style={ai.bulletText}>{point}</Text>
                </View>
              ))}
            </View>
          )}
          {item.needs_improvement.length > 0 && (
            <View style={ai.compSection}>
              <View style={ai.compSectionHeader}>
                <Ionicons name="trending-up" size={16} color="#D97706" />
                <Text style={[ai.compSectionTitle, { color: '#D97706' }]}>Needs improvement</Text>
              </View>
              {item.needs_improvement.map((point, i) => (
                <View key={i} style={ai.bullet}>
                  <View style={[ai.bulletDot, { backgroundColor: '#D97706' }]} />
                  <Text style={ai.bulletText}>{point}</Text>
                </View>
              ))}
            </View>
          )}
          {item.what_you_said && (
            <View style={ai.quoteBox}>
              <Text style={ai.quoteLabel}>What they said:</Text>
              <Text style={ai.quoteText}>"{item.what_you_said}"</Text>
            </View>
          )}
          {item.suggested_answer && (
            <View style={ai.suggestedBox}>
              <Text style={ai.suggestedLabel}>Suggested answer:</Text>
              <Text style={ai.suggestedText}>{item.suggested_answer}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// ── Main Screen ────────────────────────────────────────────────────────────
export default function MentorEvaluationScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const router = useRouter();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const [template, setTemplate] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isViewMode, setIsViewMode] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [activeTab, setActiveTab] = useState<'mentor' | 'ai'>('mentor');

  const [sessionInfo, setSessionInfo] = useState({
    profile: '', skill: '', candidateName: '', date: '',
  });

  useEffect(() => {
    if (id && id !== 'undefined') {
      loadSessionAndTemplate();
    } else {
      showNotification('Invalid session ID', 'error');
      router.back();
    }
  }, [id]);

  const loadSessionAndTemplate = async () => {
    try {
      if (!id) throw new Error('Invalid ID');

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

      let candidateName = 'Candidate';
      if (session.candidate_id) {
        const { data: candidateData } = await supabase
          .from('candidates').select('professional_title').eq('id', session.candidate_id).single();
        if (candidateData?.professional_title) candidateName = candidateData.professional_title;
      }

      const evaluationRow = Array.isArray(session.evaluation) ? session.evaluation[0] : session.evaluation;
      const existingAnswers = evaluationRow?.checklist_data?.answers || {};
      const existingTemplate = evaluationRow?.checklist_data?.template || null;
      const isCompleted = evaluationRow?.status === 'completed';

      setAnswers(existingAnswers);
      setIsViewMode(isCompleted && existingTemplate !== null);
      if (evaluationRow?.ai_feedback) {
        setAiFeedback(evaluationRow.ai_feedback as AIFeedback);
      }

      let displayProfile = 'Interview Evaluation';
      let displaySkill = 'General Skill';

      if (session.session_type === 'intro') {
        displayProfile = 'Intro Call';
        displaySkill = 'Intro Call';
      } else {
        if (session.package?.interview_profile_id) {
          const { data: profileData } = await supabase
            .from('interview_profiles_admin').select('name')
            .eq('id', session.package.interview_profile_id).single();
          if (profileData?.name) displayProfile = profileData.name;
        }
        if (session.skill?.name) {
          displaySkill = session.skill.name;
        } else if (session.skill_id) {
          const { data: skillData } = await supabase
            .from('interview_skills_admin').select('name').eq('id', session.skill_id).single();
          if (skillData?.name) displaySkill = skillData.name;
        }
      }

      let selectedTemplate: any[] = [];
      if (isCompleted && existingTemplate) {
        selectedTemplate = existingTemplate;
      } else if (session.session_type === 'intro') {
        const profileId = session.package?.interview_profile_id;
        selectedTemplate = (profileId && INTRO_CALL_TEMPLATES[profileId])
          ? INTRO_CALL_TEMPLATES[profileId] : INTRO_CALL_TEMPLATE_FALLBACK;
      } else {
        const profileId = session.package?.interview_profile_id;
        const skillId = session.skill_id;
        if (profileId && MASTER_TEMPLATES[profileId]) {
          const profileEntry = MASTER_TEMPLATES[profileId];
          if (skillId && profileEntry.skills[skillId]) {
            selectedTemplate = profileEntry.skills[skillId].templates;
          } else {
            const firstSkillKey = Object.keys(profileEntry.skills)[0];
            if (firstSkillKey) selectedTemplate = profileEntry.skills[firstSkillKey].templates;
          }
        }
      }

      setTemplate(selectedTemplate || []);
      setSessionInfo({ profile: displayProfile, skill: displaySkill, candidateName, date: new Date(session.scheduled_at).toLocaleDateString() });

    } catch (err: any) {
      console.error('[Evaluation] Error loading session:', err);
      showNotification('Failed to load session details', 'error');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qId: string, value: any) => setAnswers((prev) => ({ ...prev, [qId]: value }));

  const validateEvaluation = () => {
    let missingCount = 0;
    template.forEach(section => {
      section.questions.forEach((q: any) => {
        const val = answers[q.id];
        if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) missingCount++;
      });
    });
    return missingCount;
  };

  const triggerFeedbackGeneration = async () => {
    try {
      const { error } = await supabase.functions.invoke('generate-session-feedback', { body: { session_id: String(id) } });
      if (error) throw error;
      // Poll for ai_feedback after triggering
      setTimeout(async () => {
        const { data } = await supabase.from('session_evaluations').select('ai_feedback').eq('session_id', id).maybeSingle();
        if (data?.ai_feedback) setAiFeedback(data.ai_feedback as AIFeedback);
      }, 15000); // Check after 15 seconds
    } catch (err) {
      console.error('[Evaluation] AI feedback trigger failed (non-blocking):', err);
    }
  };

  const saveToDatabase = async (isFinalSubmission: boolean) => {
    if (isFinalSubmission) {
      const missingCount = validateEvaluation();
      if (missingCount > 0) {
        showNotification(`Please complete ${missingCount} missing question${missingCount > 1 ? 's' : ''} before submitting.`, 'error');
        return;
      }
    }
    try {
      setSubmitting(true);
      const templateForStorage = template.map(section => ({ title: section.title, questions: section.questions }));
      const payload = {
        meta: { profile_used: sessionInfo.profile, skill_used: sessionInfo.skill, submitted_at: new Date().toISOString() },
        template: templateForStorage,
        answers: answers
      };
      const status = isFinalSubmission ? 'completed' : 'in_progress';
      const { data: existingEval, error: fetchError } = await supabase.from('session_evaluations').select('id').eq('session_id', id).maybeSingle();
      if (fetchError) throw fetchError;
      let error;
      if (existingEval) {
        const { error: updateErr } = await supabase.from('session_evaluations').update({ checklist_data: payload, updated_at: new Date().toISOString(), status }).eq('session_id', id);
        error = updateErr;
      } else {
        const { error: insertErr } = await supabase.from('session_evaluations').insert({ session_id: id, checklist_data: payload, status });
        error = insertErr;
      }
      if (error) throw error;
      if (isFinalSubmission) {
        await supabase.from('interview_sessions').update({ status: 'completed' }).eq('id', id);
        setGeneratingFeedback(true);
        triggerFeedbackGeneration().finally(() => setGeneratingFeedback(false));
        setIsViewMode(true);
        showNotification("Evaluation submitted! AI feedback is being generated.", 'success');
      } else {
        showNotification("Draft saved successfully", 'success');
      }
    } catch (err: any) {
      console.error('[Evaluation] Save error:', err);
      showNotification(err.message || "Failed to save evaluation", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0E9384" /></View>;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{isViewMode ? 'View Evaluation' : 'Evaluate Candidate'}</Text>
          <Text style={styles.headerSub}>{sessionInfo.candidateName}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs — only show in view mode */}
      {isViewMode && (
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tab, activeTab === 'mentor' && styles.tabActive]} onPress={() => setActiveTab('mentor')} activeOpacity={0.8}>
            <Ionicons name="person" size={15} color={activeTab === 'mentor' ? '#0E9384' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'mentor' && styles.tabTextActive]}>Your Evaluation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'ai' && styles.tabActive]} onPress={() => setActiveTab('ai')} activeOpacity={0.8}>
            <Ionicons name="flash" size={15} color={activeTab === 'ai' ? '#0E9384' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'ai' && styles.tabTextActive]}>AI Analysis</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>

        {/* ── AI FEEDBACK TAB ── */}
        {isViewMode && activeTab === 'ai' && (
          <>
            {generatingFeedback && !aiFeedback ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#0E9384" />
                <Text style={{ marginTop: 12, color: '#6B7280', fontFamily: SYSTEM_FONT }}>Generating AI feedback...</Text>
              </View>
            ) : !aiFeedback ? (
              <View style={styles.emptyState}>
                <Ionicons name="hourglass-outline" size={40} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>AI Analysis Pending</Text>
                <Text style={styles.emptyText}>The AI feedback report will be available once the transcript is processed. This usually takes a few minutes after the session ends.</Text>
              </View>
            ) : (
              <>
                {/* Score Card */}
                <View style={ai.scoreCard}>
                  <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Text style={[ai.bigScore, { color: getScoreColor(aiFeedback.readiness_score) }]}>
                      {aiFeedback.readiness_score}%
                    </Text>
                    <Text style={[ai.readinessLabel, { color: getScoreColor(aiFeedback.readiness_score) }]}>
                      {aiFeedback.readiness_label}
                    </Text>
                  </View>
                  <View style={ai.divider} />
                  <View style={ai.summaryRow}>
                    <Ionicons name="chatbubble-ellipses" size={18} color="#0E9384" style={{ marginTop: 2 }} />
                    <Text style={ai.summaryText}>{aiFeedback.feedback_summary}</Text>
                  </View>
                  {aiFeedback.red_flags.length > 0 && (
                    <>
                      <View style={ai.divider} />
                      <View style={ai.redFlagHeader}>
                        <Ionicons name="flag" size={16} color="#BE123C" />
                        <Text style={ai.redFlagTitle}>Red flags</Text>
                      </View>
                      {aiFeedback.red_flags.map((flag, i) => (
                        <View key={i} style={ai.redFlagItem}>
                          <Text style={ai.redFlagNum}>{i + 1}</Text>
                          <Text style={ai.redFlagText}>{flag}</Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>

                <Text style={styles.sectionTitle}>Detailed Performance Analysis</Text>
                {aiFeedback.competencies.map((comp, i) => <CompetencyCard key={i} item={comp} />)}

                {aiFeedback.next_steps.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Suggested Next Steps for Candidate</Text>
                    <View style={ai.nextStepsCard}>
                      {aiFeedback.next_steps.map((step, i) => (
                        <View key={i} style={[ai.nextStep, i < aiFeedback.next_steps.length - 1 && ai.nextStepBorder]}>
                          <View style={ai.nextStepNum}><Text style={ai.nextStepNumText}>{i + 1}</Text></View>
                          <View style={{ flex: 1 }}>
                            <Text style={ai.nextStepAction}>{step.action}</Text>
                            <Text style={ai.nextStepDrill}>{step.drill}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ── MENTOR EVALUATION TAB (or full screen when not in view mode) ── */}
        {(!isViewMode || activeTab === 'mentor') && (
          <>
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
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#666' }}>No evaluation template found for this skill.</Text>
              </View>
            ) : (
              template.map((section, idx) => (
                <View key={idx} style={styles.section}>
                  <Text style={styles.sectionHeader}>{section.title}</Text>
                  {!isViewMode && section.example && (
                    <View style={styles.exampleBox}>
                      {Array.isArray(section.example) ? (
                        <View>
                          <Text style={styles.exampleHeader}>💡 Example Scenarios:</Text>
                          {section.example.map((item: string, exIdx: number) => (
                            <Text key={exIdx} style={styles.exampleItem}>{exIdx + 1}. {item}</Text>
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
                          multiline placeholder="Enter your feedback here..."
                          value={answers[q.id] || ''} onChangeText={(text) => handleAnswerChange(q.id, text)}
                          editable={!isViewMode}
                        />
                      )}
                      {q.type === 'rating' && (
                        <View style={styles.ratingContainer}>
                          {[1, 2, 3, 4, 5].map((val) => {
                            const isSelected = answers[q.id] === val;
                            return (
                              <TouchableOpacity key={val} style={[styles.ratingBtn, isSelected && styles.ratingBtnSelected]}
                                onPress={() => !isViewMode && handleAnswerChange(q.id, val)} disabled={isViewMode}>
                                <Text style={[styles.ratingText, isSelected && styles.ratingTextSelected]}>{val}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                      {q.type === 'boolean' && (
                        <View style={styles.boolContainer}>
                          <TouchableOpacity style={[styles.boolBtn, answers[q.id] === true && styles.boolBtnYes]}
                            onPress={() => !isViewMode && handleAnswerChange(q.id, true)} disabled={isViewMode}>
                            <Text style={[styles.boolText, answers[q.id] === true && styles.boolTextSelected]}>Yes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.boolBtn, answers[q.id] === false && styles.boolBtnNo]}
                            onPress={() => !isViewMode && handleAnswerChange(q.id, false)} disabled={isViewMode}>
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
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.draftBtn, submitting && styles.btnDisabled]} onPress={() => saveToDatabase(false)} disabled={submitting}>
                  <Text style={styles.draftBtnText}>Save Draft</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submitBtn, submitting && styles.btnDisabled]} onPress={() => saveToDatabase(true)} disabled={submitting}>
                  {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Submit</Text>}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.completedBanner}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.submittedBtnText}>Evaluation Submitted</Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  headerSub: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  tabRow: { flexDirection: 'row', backgroundColor: '#F3F4F6', margin: 16, borderRadius: 12, padding: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 9, gap: 6 },
  tabActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6B7280', fontFamily: SYSTEM_FONT },
  tabTextActive: { color: '#0E9384' },
  content: { padding: 20, paddingBottom: 60 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 24, marginBottom: 12, fontFamily: SYSTEM_FONT },
  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 16, fontFamily: SYSTEM_FONT },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginTop: 8, fontFamily: SYSTEM_FONT },
  infoCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  infoSub: { fontSize: 14, color: '#64748B', marginTop: 4 },
  viewModeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#EEF2FF', borderRadius: 6, alignSelf: 'flex-start' },
  viewModeText: { fontSize: 11, fontWeight: '600', color: '#6366F1' },
  section: { marginBottom: 32 },
  sectionHeader: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#0E9384', paddingLeft: 12 },
  exampleBox: { backgroundColor: '#F0FDFA', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#CCFBF1' },
  exampleHeader: { fontSize: 13, color: '#0F766E', fontWeight: '700', marginBottom: 8 },
  exampleItem: { fontSize: 13, color: '#0F766E', lineHeight: 20, marginBottom: 6 },
  exampleText: { fontSize: 13, color: '#0F766E', fontStyle: 'italic' },
  questionContainer: { marginBottom: 20 },
  questionText: { fontSize: 15, fontWeight: '600', color: '#334155', marginBottom: 10 },
  textArea: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 12, height: 100, textAlignVertical: 'top', fontSize: 14 },
  disabled: { backgroundColor: '#F9FAFB', color: '#6B7280' },
  ratingContainer: { flexDirection: 'row', gap: 10 },
  ratingBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  ratingBtnSelected: { backgroundColor: '#0E9384', borderColor: '#0E9384' },
  ratingText: { fontSize: 16, fontWeight: '600', color: '#64748B' },
  ratingTextSelected: { color: '#FFF' },
  boolContainer: { flexDirection: 'row', gap: 12 },
  boolBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  boolBtnYes: { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' },
  boolBtnNo: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  boolText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  boolTextSelected: { color: '#1E293B' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 40 },
  draftBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1' },
  draftBtnText: { color: '#475569', fontSize: 16, fontWeight: '700' },
  submitBtn: { flex: 1, backgroundColor: '#0E9384', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.7 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  completedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#059669', padding: 16, borderRadius: 12, marginTop: 20, gap: 8 },
  submittedBtnText: { color: '#059669', fontSize: 16, fontWeight: '700' },
});

const ai = StyleSheet.create({
  scoreCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  bigScore: { fontSize: 48, fontWeight: '800', fontFamily: SYSTEM_FONT },
  readinessLabel: { fontSize: 18, fontWeight: '700', marginTop: 4, fontFamily: SYSTEM_FONT },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  summaryRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  summaryText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 22, fontFamily: SYSTEM_FONT },
  redFlagHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  redFlagTitle: { fontSize: 14, fontWeight: '700', color: '#BE123C', fontFamily: SYSTEM_FONT },
  redFlagItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#FFF1F2', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#FECDD3' },
  redFlagNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: '700', color: '#BE123C', fontFamily: SYSTEM_FONT },
  redFlagText: { flex: 1, fontSize: 13, color: '#9F1239', lineHeight: 20, fontFamily: SYSTEM_FONT },
  compCard: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 4, marginBottom: 10, overflow: 'hidden' },
  compHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, justifyContent: 'space-between' },
  compTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6, fontFamily: SYSTEM_FONT },
  severityBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  severityText: { fontSize: 11, fontWeight: '700', fontFamily: SYSTEM_FONT },
  compScore: { fontSize: 22, fontWeight: '800', fontFamily: SYSTEM_FONT },
  compBody: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  compSection: { marginTop: 14 },
  compSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  compSectionTitle: { fontSize: 13, fontWeight: '700', fontFamily: SYSTEM_FONT },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  bulletText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 20, fontFamily: SYSTEM_FONT },
  quoteBox: { marginTop: 14, backgroundColor: '#F8FAFC', borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: '#CBD5E1' },
  quoteLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 6, fontFamily: SYSTEM_FONT },
  quoteText: { fontSize: 13, color: '#475569', fontStyle: 'italic', lineHeight: 20, fontFamily: SYSTEM_FONT },
  suggestedBox: { marginTop: 10, backgroundColor: '#F0FDFA', borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: '#0E9384' },
  suggestedLabel: { fontSize: 11, fontWeight: '700', color: '#0E9384', marginBottom: 6, fontFamily: SYSTEM_FONT },
  suggestedText: { fontSize: 13, color: '#134E4A', lineHeight: 20, fontFamily: SYSTEM_FONT },
  nextStepsCard: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  nextStep: { flexDirection: 'row', gap: 12, padding: 16, alignItems: 'flex-start' },
  nextStepBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  nextStepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0FDFA', borderWidth: 1, borderColor: '#0E9384', alignItems: 'center', justifyContent: 'center' },
  nextStepNumText: { fontSize: 13, fontWeight: '700', color: '#0E9384', fontFamily: SYSTEM_FONT },
  nextStepAction: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4, fontFamily: SYSTEM_FONT },
  nextStepDrill: { fontSize: 13, color: '#6B7280', lineHeight: 20, fontFamily: SYSTEM_FONT },
});