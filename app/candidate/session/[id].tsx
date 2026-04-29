// app/candidate/session/[id].tsx
// Place this file at: app/candidate/session/[id].tsx

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  ios: 'System',
  android: 'Roboto',
  default: 'System',
}) as string;

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface MentorEvaluation {
  meta: { profile_used: string; skill_used: string; submitted_at: string };
  template: { title: string; questions: { id: string; text: string; type: string }[] }[];
  answers: Record<string, any>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const getReadinessColor = (label: string) => {
  if (label === 'Needs Improvement') return '#BE123C';
  if (label === 'On Track') return '#D97706';
  return '#166534';
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ScoreRing = ({ score }: { score: number }) => {
  const color = getScoreColor(score);
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      {/* Simple circle representation using View */}
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        borderWidth: strokeWidth, borderColor: '#E5E7EB',
        alignItems: 'center', justifyContent: 'center',
        position: 'absolute'
      }} />
      <View style={{
        width: size - strokeWidth * 2, height: size - strokeWidth * 2,
        borderRadius: (size - strokeWidth * 2) / 2,
        backgroundColor: '#F9FAFB',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color, fontFamily: SYSTEM_FONT }}>{score}%</Text>
      </View>
    </View>
  );
};

const CompetencyCard = ({ item }: { item: AICompetency }) => {
  const [expanded, setExpanded] = useState(false);
  const colors = getSeverityColor(item.severity);
  const scoreColor = getScoreColor(item.score);

  return (
    <View style={[feedbackStyles.compCard, { borderLeftColor: scoreColor }]}>
      <TouchableOpacity
        style={feedbackStyles.compHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <Text style={feedbackStyles.compTitle}>{item.title}</Text>
          <View style={[feedbackStyles.severityBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <Text style={[feedbackStyles.severityText, { color: colors.text }]}>{item.severity}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={[feedbackStyles.compScore, { color: scoreColor }]}>{item.score}%</Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18} color="#9CA3AF"
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={feedbackStyles.compBody}>
          {item.did_well.length > 0 && (
            <View style={feedbackStyles.compSection}>
              <View style={feedbackStyles.compSectionHeader}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={[feedbackStyles.compSectionTitle, { color: '#059669' }]}>What you did well</Text>
              </View>
              {item.did_well.map((point, i) => (
                <View key={i} style={feedbackStyles.bullet}>
                  <View style={[feedbackStyles.bulletDot, { backgroundColor: '#059669' }]} />
                  <Text style={feedbackStyles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>
          )}

          {item.needs_improvement.length > 0 && (
            <View style={feedbackStyles.compSection}>
              <View style={feedbackStyles.compSectionHeader}>
                <Ionicons name="trending-up" size={16} color="#D97706" />
                <Text style={[feedbackStyles.compSectionTitle, { color: '#D97706' }]}>Needs improvement</Text>
              </View>
              {item.needs_improvement.map((point, i) => (
                <View key={i} style={feedbackStyles.bullet}>
                  <View style={[feedbackStyles.bulletDot, { backgroundColor: '#D97706' }]} />
                  <Text style={feedbackStyles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>
          )}

          {item.what_you_said && (
            <View style={feedbackStyles.quoteBox}>
              <Text style={feedbackStyles.quoteLabel}>What you said:</Text>
              <Text style={feedbackStyles.quoteText}>"{item.what_you_said}"</Text>
            </View>
          )}

          {item.suggested_answer && (
            <View style={feedbackStyles.suggestedBox}>
              <Text style={feedbackStyles.suggestedLabel}>Suggested answer:</Text>
              <Text style={feedbackStyles.suggestedText}>{item.suggested_answer}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const RatingDisplay = ({ value }: { value: number }) => (
  <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
    {[1, 2, 3, 4, 5].map((v) => (
      <View
        key={v}
        style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: v <= value ? '#0E9384' : '#F1F5F9',
          borderWidth: 1, borderColor: v <= value ? '#0E9384' : '#E2E8F0',
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: '600', color: v <= value ? '#FFF' : '#94A3B8' }}>{v}</Text>
      </View>
    ))}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CandidateFeedbackScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ai' | 'mentor'>('ai');

  const [sessionInfo, setSessionInfo] = useState({ profile: '', skill: '', date: '', mentorTitle: '' });
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [mentorEval, setMentorEval] = useState<MentorEvaluation | null>(null);

  useEffect(() => {
    if (id) loadFeedback();
  }, [id]);

  const loadFeedback = async () => {
    try {
      const { data: session, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          package:interview_packages(id, interview_profile_id, booking_metadata),
          skill:interview_skills_admin!skill_id(name),
          evaluation:session_evaluations(checklist_data, ai_feedback, status),
          mentor:mentors(professional_title)
        `)
        .eq('id', String(id))
        .maybeSingle();

      if (error) throw error;
      if (!session) throw new Error('Session not found');

      // Profile name
      let displayProfile = 'Interview';
      if (session.package?.interview_profile_id) {
        const { data: profileData } = await supabase
          .from('interview_profiles_admin')
          .select('name')
          .eq('id', session.package.interview_profile_id)
          .single();
        if (profileData?.name) displayProfile = profileData.name;
      }

      const evalRow = Array.isArray(session.evaluation)
        ? session.evaluation[0]
        : session.evaluation;

      setSessionInfo({
        profile: displayProfile,
        skill: session.skill?.name || 'General',
        date: new Date(session.scheduled_at).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        }),
        mentorTitle: session.mentor?.professional_title || 'Mentor',
      });

      if (evalRow?.ai_feedback) setAiFeedback(evalRow.ai_feedback as AIFeedback);
      if (evalRow?.checklist_data) setMentorEval(evalRow.checklist_data as MentorEvaluation);

      // Default to mentor tab if no AI feedback yet
      if (!evalRow?.ai_feedback && evalRow?.checklist_data) setActiveTab('mentor');

    } catch (err) {
      console.error('[CandidateFeedback] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>{sessionInfo.profile} Feedback</Text>
          <Text style={styles.headerSub}>{sessionInfo.skill} · {sessionInfo.date}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ai' && styles.tabActive]}
          onPress={() => setActiveTab('ai')}
          activeOpacity={0.8}
        >
          <Ionicons name="flash" size={15} color={activeTab === 'ai' ? theme.colors.primary : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'ai' && styles.tabTextActive]}>AI Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mentor' && styles.tabActive]}
          onPress={() => setActiveTab('mentor')}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={15} color={activeTab === 'mentor' ? theme.colors.primary : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'mentor' && styles.tabTextActive]}>Mentor Evaluation</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── AI FEEDBACK TAB ── */}
        {activeTab === 'ai' && (
          <>
            {!aiFeedback ? (
              <View style={styles.emptyState}>
                <Ionicons name="hourglass-outline" size={40} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>Analysis Coming Soon</Text>
                <Text style={styles.emptyText}>
                  Your AI-powered feedback report will be available shortly after your mentor submits their evaluation.
                </Text>
              </View>
            ) : (
              <>
                {/* Score Card */}
                <View style={feedbackStyles.scoreCard}>
                  <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <ScoreRing score={aiFeedback.readiness_score} />
                    <Text style={[
                      feedbackStyles.readinessLabel,
                      { color: getReadinessColor(aiFeedback.readiness_label) }
                    ]}>
                      {aiFeedback.readiness_label}
                    </Text>
                  </View>

                  <View style={feedbackStyles.divider} />

                  <View style={feedbackStyles.summaryRow}>
                    <Ionicons name="chatbubble-ellipses" size={18} color="#0E9384" style={{ marginTop: 2 }} />
                    <Text style={feedbackStyles.summaryText}>{aiFeedback.feedback_summary}</Text>
                  </View>

                  {aiFeedback.red_flags.length > 0 && (
                    <>
                      <View style={feedbackStyles.divider} />
                      <View style={feedbackStyles.redFlagSection}>
                        <View style={feedbackStyles.redFlagHeader}>
                          <Ionicons name="flag" size={16} color="#BE123C" />
                          <Text style={feedbackStyles.redFlagTitle}>Red flags</Text>
                        </View>
                        {aiFeedback.red_flags.map((flag, i) => (
                          <View key={i} style={feedbackStyles.redFlagItem}>
                            <Text style={feedbackStyles.redFlagNum}>{i + 1}</Text>
                            <Text style={feedbackStyles.redFlagText}>{flag}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </View>

                {/* Competencies */}
                <Text style={styles.sectionTitle}>Detailed Performance Analysis</Text>
                {aiFeedback.competencies.map((comp, i) => (
                  <CompetencyCard key={i} item={comp} />
                ))}

                {/* Next Steps */}
                {aiFeedback.next_steps.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Next Steps</Text>
                    <View style={feedbackStyles.nextStepsCard}>
                      {aiFeedback.next_steps.map((step, i) => (
                        <View key={i} style={[feedbackStyles.nextStep, i < aiFeedback.next_steps.length - 1 && feedbackStyles.nextStepBorder]}>
                          <View style={feedbackStyles.nextStepNum}>
                            <Text style={feedbackStyles.nextStepNumText}>{i + 1}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={feedbackStyles.nextStepAction}>{step.action}</Text>
                            <Text style={feedbackStyles.nextStepDrill}>{step.drill}</Text>
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

        {/* ── MENTOR EVALUATION TAB ── */}
        {activeTab === 'mentor' && (
          <>
            {!mentorEval ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={40} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>Evaluation Pending</Text>
                <Text style={styles.emptyText}>
                  Your mentor hasn't submitted their evaluation yet. Check back after your session.
                </Text>
              </View>
            ) : (
              <>
                <View style={mentorStyles.metaCard}>
                  <Text style={mentorStyles.metaProfile}>{mentorEval.meta.profile_used}</Text>
                  <Text style={mentorStyles.metaSkill}>{mentorEval.meta.skill_used}</Text>
                  <Text style={mentorStyles.metaDate}>
                    Submitted {new Date(mentorEval.meta.submitted_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </Text>
                </View>

                {mentorEval.template.map((section, si) => (
                  <View key={si} style={mentorStyles.section}>
                    <Text style={mentorStyles.sectionTitle}>{section.title}</Text>
                    {section.questions.map((q) => {
                      const ans = mentorEval.answers[q.id];
                      if (ans === undefined || ans === null) return null;
                      return (
                        <View key={q.id} style={mentorStyles.questionRow}>
                          <Text style={mentorStyles.questionText}>{q.text}</Text>
                          {q.type === 'rating' && typeof ans === 'number' && (
                            <RatingDisplay value={ans} />
                          )}
                          {q.type === 'text' && typeof ans === 'string' && ans.trim() !== '' && (
                            <View style={mentorStyles.textAnswerBox}>
                              <Text style={mentorStyles.textAnswer}>{ans}</Text>
                            </View>
                          )}
                          {q.type === 'boolean' && typeof ans === 'boolean' && (
                            <View style={[
                              mentorStyles.boolAnswer,
                              { backgroundColor: ans ? '#DCFCE7' : '#FEE2E2', borderColor: ans ? '#86EFAC' : '#FCA5A5' }
                            ]}>
                              <Ionicons
                                name={ans ? 'checkmark-circle' : 'close-circle'}
                                size={16}
                                color={ans ? '#059669' : '#DC2626'}
                              />
                              <Text style={{ color: ans ? '#059669' : '#DC2626', fontWeight: '600', fontSize: 14, fontFamily: SYSTEM_FONT }}>
                                {ans ? 'Yes' : 'No'}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827', fontFamily: SYSTEM_FONT },
  headerSub: { fontSize: 12, color: '#6B7280', marginTop: 2, fontFamily: SYSTEM_FONT },

  tabRow: {
    flexDirection: 'row', backgroundColor: '#F3F4F6',
    margin: 16, borderRadius: 12, padding: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 9, gap: 6,
  },
  tabActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6B7280', fontFamily: SYSTEM_FONT },
  tabTextActive: { color: '#0E9384' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 20 },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: '#111827',
    marginTop: 24, marginBottom: 12, fontFamily: SYSTEM_FONT,
  },

  emptyState: { alignItems: 'center', marginTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 16, fontFamily: SYSTEM_FONT },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginTop: 8, fontFamily: SYSTEM_FONT },
});

const feedbackStyles = StyleSheet.create({
  scoreCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 24,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8,
  },
  readinessLabel: {
    fontSize: 18, fontWeight: '800', marginTop: 12, fontFamily: SYSTEM_FONT,
  },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  summaryRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  summaryText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 22, fontFamily: SYSTEM_FONT },

  redFlagSection: {},
  redFlagHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  redFlagTitle: { fontSize: 14, fontWeight: '700', color: '#BE123C', fontFamily: SYSTEM_FONT },
  redFlagItem: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: '#FFF1F2', borderRadius: 8, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: '#FECDD3',
  },
  redFlagNum: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#FEE2E2',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: '700', color: '#BE123C', fontFamily: SYSTEM_FONT,
  },
  redFlagText: { flex: 1, fontSize: 13, color: '#9F1239', lineHeight: 20, fontFamily: SYSTEM_FONT },

  compCard: {
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1,
    borderColor: '#E5E7EB', borderLeftWidth: 4, marginBottom: 10, overflow: 'hidden',
  },
  compHeader: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: 16, justifyContent: 'space-between',
  },
  compTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6, fontFamily: SYSTEM_FONT },
  severityBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, borderWidth: 1,
  },
  severityText: { fontSize: 11, fontWeight: '700', fontFamily: SYSTEM_FONT },
  compScore: { fontSize: 22, fontWeight: '800', fontFamily: SYSTEM_FONT },

  compBody: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  compSection: { marginTop: 14 },
  compSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  compSectionTitle: { fontSize: 13, fontWeight: '700', fontFamily: SYSTEM_FONT },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  bulletText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 20, fontFamily: SYSTEM_FONT },

  quoteBox: {
    marginTop: 14, backgroundColor: '#F8FAFC', borderRadius: 8,
    padding: 12, borderLeftWidth: 3, borderLeftColor: '#CBD5E1',
  },
  quoteLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 6, fontFamily: SYSTEM_FONT },
  quoteText: { fontSize: 13, color: '#475569', fontStyle: 'italic', lineHeight: 20, fontFamily: SYSTEM_FONT },

  suggestedBox: {
    marginTop: 10, backgroundColor: '#F0FDFA', borderRadius: 8,
    padding: 12, borderLeftWidth: 3, borderLeftColor: '#0E9384',
  },
  suggestedLabel: { fontSize: 11, fontWeight: '700', color: '#0E9384', marginBottom: 6, fontFamily: SYSTEM_FONT },
  suggestedText: { fontSize: 13, color: '#134E4A', lineHeight: 20, fontFamily: SYSTEM_FONT },

  nextStepsCard: {
    backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  nextStep: { flexDirection: 'row', gap: 12, padding: 16, alignItems: 'flex-start' },
  nextStepBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  nextStepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#F0FDFA', borderWidth: 1, borderColor: '#0E9384',
    alignItems: 'center', justifyContent: 'center',
  },
  nextStepNumText: { fontSize: 13, fontWeight: '700', color: '#0E9384', fontFamily: SYSTEM_FONT },
  nextStepAction: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4, fontFamily: SYSTEM_FONT },
  nextStepDrill: { fontSize: 13, color: '#6B7280', lineHeight: 20, fontFamily: SYSTEM_FONT },
});

const mentorStyles = StyleSheet.create({
  metaCard: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16,
  },
  metaProfile: { fontSize: 16, fontWeight: '700', color: '#111827', fontFamily: SYSTEM_FONT },
  metaSkill: { fontSize: 14, color: '#0E9384', fontWeight: '600', marginTop: 2, fontFamily: SYSTEM_FONT },
  metaDate: { fontSize: 12, color: '#9CA3AF', marginTop: 6, fontFamily: SYSTEM_FONT },

  section: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15, fontWeight: '800', color: '#1E293B',
    borderLeftWidth: 4, borderLeftColor: '#0E9384',
    paddingLeft: 10, marginBottom: 16, fontFamily: SYSTEM_FONT,
  },
  questionRow: { marginBottom: 18 },
  questionText: { fontSize: 14, color: '#334155', fontWeight: '600', lineHeight: 20, fontFamily: SYSTEM_FONT },

  textAnswerBox: {
    marginTop: 8, backgroundColor: '#F8FAFC', borderRadius: 8,
    padding: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  textAnswer: { fontSize: 14, color: '#374151', lineHeight: 22, fontFamily: SYSTEM_FONT },

  boolAnswer: {
    marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1, alignSelf: 'flex-start',
  },
});