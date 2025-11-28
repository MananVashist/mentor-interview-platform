import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// 🟢 HARDCODED TEMPLATES DATABASE
// ---------------------------------------------------------------------------
const MASTER_TEMPLATES: Record<string, any> = {
  "Product Manager": {
    "round_1": [
      {
        title: "Q1 – RCA",
        example: "DAU for search feature fell 22% WoW. Investigate.",
        questions: [
          { id: "pm_r1_q1_c1", text: "Structured approach", type: "rating" },
          { id: "pm_r1_q1_c2", text: "Root-cause depth", type: "rating" },
          { id: "pm_r1_q1_c3", text: "Data thinking", type: "rating" },
          { id: "pm_r1_q1_c4", text: "Hypothesis quality", type: "rating" },
        ]
      },
      {
        title: "Q2 – Product Thinking",
        example: "Design a phone‑free morning routine system for screen‑addicted users.",
        questions: [
          { id: "pm_r1_q2_c1", text: "User understanding", type: "rating" },
          { id: "pm_r1_q2_c2", text: "Prioritisation", type: "boolean" },
          { id: "pm_r1_q2_c3", text: "Creativity", type: "rating" },
          { id: "pm_r1_q2_c4", text: "Problem framing", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – Prioritisation",
        example: "You inherit 15 urgent asks from 6 stakeholders with low engg bandwidth.",
        questions: [
          { id: "pm_r2_q1_c1", text: "Prioritisation framework", type: "rating" },
          { id: "pm_r2_q1_c2", text: "Constraint handling", type: "rating" },
          { id: "pm_r2_q1_c3", text: "Stakeholder mgmt", type: "rating" },
          { id: "pm_r2_q1_c4", text: "Tradeoff clarity", type: "rating" },
        ]
      },
      {
        title: "Q2 – Metrics & Experiments",
        example: "Feature increased engagement but worsened 2‑week retention.",
        questions: [
          { id: "pm_r2_q2_c1", text: "Metric selection", type: "rating" },
          { id: "pm_r2_q2_c2", text: "Experiment design", type: "rating" },
          { id: "pm_r2_q2_c3", text: "Guardrails", type: "rating" },
          { id: "pm_r2_q2_c4", text: "Systems thinking", type: "rating" },
        ]
      }
    ]
  },
  "Data Analyst / BA": {
    "round_1": [
      {
        title: "Q1 – SQL & Logic",
        example: "Compute ‘time to first purchase’ by acquisition channel across 100M rows.",
        questions: [
          { id: "da_r1_q1_c1", text: "Query efficiency", type: "rating" },
          { id: "da_r1_q1_c2", text: "Correctness", type: "rating" },
          { id: "da_r1_q1_c3", text: "Scalability awareness", type: "rating" },
        ]
      },
      {
        title: "Q2 – Insights",
        example: "Repeat users rising but revenue/user dropping — advise CEO in 30 mins.",
        questions: [
          { id: "da_r1_q2_c1", text: "Hypothesis clarity", type: "rating" },
          { id: "da_r1_q2_c2", text: "Analytical structure", type: "rating" },
          { id: "da_r1_q2_c3", text: "Business reasoning", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – Business Case",
        example: "Competitor launched cheaper version — analyse + recommend pricing action.",
        questions: [
          { id: "da_r2_q1_c1", text: "Strategic thinking", type: "rating" },
          { id: "da_r2_q1_c2", text: "Data framing", type: "rating" },
          { id: "da_r2_q1_c3", text: "Impact estimation", type: "rating" },
        ]
      },
      {
        title: "Q2 – Data Quality",
        example: "Conversion spikes 40% overnight — determine real or data issue.",
        questions: [
          { id: "da_r2_q2_c1", text: "Data validation depth", type: "rating" },
          { id: "da_r2_q2_c2", text: "Debugging approach", type: "rating" },
          { id: "da_r2_q2_c3", text: "Risk assessment", type: "rating" },
        ]
      }
    ]
  },
  "Data Scientist / MLE": {
    "round_1": [
      {
        title: "Q1 – Problem Formulation",
        example: "Translate vague goal ‘reduce churn with ML’ into a real ML problem.",
        questions: [
          { id: "ds_r1_q1_c1", text: "Problem reframing", type: "rating" },
          { id: "ds_r1_q1_c2", text: "Feature reasoning", type: "rating" },
          { id: "ds_r1_q1_c3", text: "Feasibility", type: "rating" },
        ]
      },
      {
        title: "Q2 – Metrics",
        example: "Fraud model catches 80% fraud but losses increased.",
        questions: [
          { id: "ds_r1_q2_c1", text: "Metric interpretation", type: "rating" },
          { id: "ds_r1_q2_c2", text: "Edge-case reasoning", type: "rating" },
          { id: "ds_r1_q2_c3", text: "Real-world ML intuition", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – System Design",
        example: "Design instant personalised recos for 50M DAU, refreshing within seconds.",
        questions: [
          { id: "ds_r2_q1_c1", text: "Architecture quality", type: "rating" },
          { id: "ds_r2_q1_c2", text: "Latency/infra reasoning", type: "rating" },
          { id: "ds_r2_q1_c3", text: "Feature store logic", type: "rating" },
        ]
      },
      {
        title: "Q2 – Production Debug",
        example: "Model works in staging but fails after 2 months in prod.",
        questions: [
          { id: "ds_r2_q2_c1", text: "Drift detection", type: "rating" },
          { id: "ds_r2_q2_c2", text: "Pipeline debugging", type: "rating" },
          { id: "ds_r2_q2_c3", text: "Monitoring depth", type: "rating" },
        ]
      }
    ]
  },
  "HR – L&D": {
    "round_1": [
      {
        title: "Q1 – Org Diagnosis",
        example: "Sales team says they lack coaching but training hours increased.",
        questions: [
          { id: "ld_r1_q1_c1", text: "Diagnosis depth", type: "rating" },
          { id: "ld_r1_q1_c2", text: "Stakeholder insight", type: "rating" },
          { id: "ld_r1_q1_c3", text: "Data triangulation", type: "rating" },
        ]
      },
      {
        title: "Q2 – Program Design",
        example: "Design leadership program for first‑time managers who struggle with people skills.",
        questions: [
          { id: "ld_r1_q2_c1", text: "Program structure", type: "rating" },
          { id: "ld_r1_q2_c2", text: "Relevance", type: "rating" },
          { id: "ld_r1_q2_c3", text: "Behavioural insight", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – ROI Measurement",
        example: "Management wants proof training dollars create ROI — define framework.",
        questions: [
          { id: "ld_r2_q1_c1", text: "Metric selection", type: "rating" },
          { id: "ld_r2_q1_c2", text: "Attribution logic", type: "rating" },
          { id: "ld_r2_q1_c3", text: "Practicality", type: "rating" },
        ]
      },
      {
        title: "Q2 – Stakeholder Mgmt",
        example: "Two VPs disagree whether training should be mandatory.",
        questions: [
          { id: "ld_r2_q2_c1", text: "Communication", type: "rating" },
          { id: "ld_r2_q2_c2", text: "Alignment ability", type: "rating" },
          { id: "ld_r2_q2_c3", text: "Decision justification", type: "rating" },
        ]
      }
    ]
  },
  "HR – Talent Mgmt": {
    "round_1": [
      {
        title: "Q1 – Performance System",
        example: "Design performance system for hybrid org where remote workers feel undervalued.",
        questions: [
          { id: "tm_r1_q1_c1", text: "Fairness logic", type: "rating" },
          { id: "tm_r1_q1_c2", text: "Scalability", type: "rating" },
          { id: "tm_r1_q1_c3", text: "Measurement clarity", type: "rating" },
        ]
      },
      {
        title: "Q2 – Succession",
        example: "Define HiPo rubric that works across engg, sales, ops.",
        questions: [
          { id: "tm_r1_q2_c1", text: "Criteria clarity", type: "rating" },
          { id: "tm_r1_q2_c2", text: "Cross-role fairness", type: "rating" },
          { id: "tm_r1_q2_c3", text: "Development fit", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – Attrition Diagnosis",
        example: "High performers attriting faster than low performers — diagnose.",
        questions: [
          { id: "tm_r2_q1_c1", text: "Segmentation depth", type: "rating" },
          { id: "tm_r2_q1_c2", text: "Root-cause clarity", type: "rating" },
          { id: "tm_r2_q1_c3", text: "Solution quality", type: "rating" },
        ]
      },
      {
        title: "Q2 – Culture",
        example: "Design 12‑month plan to improve psychological safety measurably.",
        questions: [
          { id: "tm_r2_q2_c1", text: "Intervention depth", type: "rating" },
          { id: "tm_r2_q2_c2", text: "Strategic relevance", type: "rating" },
          { id: "tm_r2_q2_c3", text: "Measurement quality", type: "rating" },
        ]
      }
    ]
  }
};

// ---------------------------------------------------------------------------
// 🟢 COMPONENT LOGIC
// ---------------------------------------------------------------------------

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

      // 3. Pick the correct hardcoded template
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