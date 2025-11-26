// app/admin/templates.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Modal 
} from 'react-native';
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
  target_profile: string;
  round: string;
  section_title: string; // This is now the Question Title
  criteria: Criterion[];
  order_index: number;
}

export default function TemplateBuilder() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedRound, setSelectedRound] = useState('round_1');
  
  // New Question Form
  const [questionTitle, setQuestionTitle] = useState('');
  
  // Criterion Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [criterionDesc, setCriterionDesc] = useState('');
  const [criterionType, setCriterionType] = useState<'boolean' | 'rating' | 'text'>('boolean');
  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(null);

  // Expanded state for accordion
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    if (selectedProfile) fetchQuestions();
  }, [selectedProfile, selectedRound]);

  const fetchMeta = async () => {
    const { data } = await supabase.from('interview_profiles_admin').select('name').eq('is_active', true);
    if (data && data.length > 0) {
      const names = data.map(d => d.name);
      setProfiles(names);
      setSelectedProfile(names[0]);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('feedback_questions')
      .select('*')
      .eq('target_profile', selectedProfile)
      .eq('round', selectedRound)
      .order('order_index', { ascending: true });
      
    if (!error && data) {
      // Ensure criteria is parsed correctly
      const parsedData = data.map(q => ({
        ...q,
        criteria: Array.isArray(q.criteria) ? q.criteria : []
      }));
      setQuestions(parsedData);
    }
    setLoading(false);
  };

  const handleAddQuestion = async () => {
    if (!questionTitle.trim()) {
      Alert.alert("Error", "Question title is required");
      return;
    }

    // ✅ DEBUG: Check current user and their profile
    const { data: { user } } = await supabase.auth.getUser();
    console.log('🔍 Current user ID:', user?.id);
    console.log('🔍 User email:', user?.email);
    
    if (!user) {
      Alert.alert("Not Authenticated", "You must be logged in to add questions.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_admin, full_name')
      .eq('id', user.id)
      .single();
    
    console.log('🔍 User profile:', profile);
    console.log('🔍 Profile error:', profileError);

    if (!profile || (!profile.is_admin && profile.role !== 'admin')) {
      Alert.alert(
        "Access Denied", 
        `You need admin access to add questions.\n\nYour role: ${profile?.role || 'none'}\nIs Admin: ${profile?.is_admin || false}\n\nPlease update your profile in Supabase.`
      );
      return;
    }

    console.log('✅ Admin check passed, attempting insert...');

    const { data, error } = await supabase.from('feedback_questions').insert({
      target_profile: selectedProfile,
      round: selectedRound,
      section_title: questionTitle,
      description: questionTitle,
      question_type: 'hierarchical',
      example_text: null,
      criteria: [],
      order_index: questions.length + 1
    }).select();

    if (error) {
      console.error('❌ Insert error:', error);
      Alert.alert("Insert Error", `Code: ${error.code}\nMessage: ${error.message}\nDetails: ${error.details || 'none'}`);
    } else {
      console.log('✅ Successfully inserted:', data);
      setQuestionTitle('');
      fetchQuestions();
      Alert.alert("Success", "Question added successfully!");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    Alert.alert(
      "Delete Question",
      "This will delete the question and all its criteria. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await supabase.from('feedback_questions').delete().eq('id', id);
            fetchQuestions();
          }
        }
      ]
    );
  };

  const toggleExpand = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const openCriterionModal = (question: Question, criterion?: Criterion) => {
    setEditingQuestion(question);
    if (criterion) {
      setCriterionDesc(criterion.description);
      setCriterionType(criterion.type);
      setEditingCriterionId(criterion.id);
    } else {
      setCriterionDesc('');
      setCriterionType('boolean');
      setEditingCriterionId(null);
    }
    setModalVisible(true);
  };

  const handleSaveCriterion = async () => {
    if (!criterionDesc.trim() || !editingQuestion) {
      Alert.alert("Error", "Criterion description is required");
      return;
    }

    const currentCriteria = editingQuestion.criteria || [];
    let updatedCriteria: Criterion[];

    if (editingCriterionId) {
      // Edit existing criterion
      updatedCriteria = currentCriteria.map(c =>
        c.id === editingCriterionId
          ? { ...c, description: criterionDesc, type: criterionType }
          : c
      );
    } else {
      // Add new criterion
      const newCriterion: Criterion = {
        id: `crit_${Date.now()}`,
        description: criterionDesc,
        type: criterionType,
        order: currentCriteria.length + 1
      };
      updatedCriteria = [...currentCriteria, newCriterion];
    }

    const { error } = await supabase
      .from('feedback_questions')
      .update({ criteria: updatedCriteria })
      .eq('id', editingQuestion.id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setModalVisible(false);
      fetchQuestions();
    }
  };

  const handleDeleteCriterion = async (question: Question, criterionId: string) => {
    Alert.alert(
      "Delete Criterion",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedCriteria = question.criteria.filter(c => c.id !== criterionId);
            await supabase
              .from('feedback_questions')
              .update({ criteria: updatedCriteria })
              .eq('id', question.id);
            fetchQuestions();
          }
        }
      ]
    );
  };

  const renderQuestion = ({ item }: { item: Question }) => {
    const isExpanded = expandedQuestions.has(item.id);
    const criteriaCount = item.criteria?.length || 0;

    return (
      <View style={styles.questionCard}>
        {/* Question Header */}
        <TouchableOpacity 
          style={styles.questionHeader}
          onPress={() => toggleExpand(item.id)}
        >
          <View style={styles.questionHeaderLeft}>
            <Ionicons 
              name={isExpanded ? "chevron-down" : "chevron-forward"} 
              size={20} 
              color="#64748B" 
            />
            <View style={{flex: 1, marginLeft: 8}}>
              <Text style={styles.questionTitle}>{item.section_title}</Text>
              <Text style={styles.criteriaBadge}>
                {criteriaCount} {criteriaCount === 1 ? 'criterion' : 'criteria'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => handleDeleteQuestion(item.id)}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Expanded Criteria List */}
        {isExpanded && (
          <View style={styles.criteriaContainer}>
            {item.criteria && item.criteria.length > 0 ? (
              item.criteria.map((criterion, idx) => (
                <View key={criterion.id} style={styles.criterionRow}>
                  <View style={styles.criterionBullet}>
                    <Text style={styles.criterionNumber}>{idx + 1}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.criterionDesc}>{criterion.description}</Text>
                    <Text style={styles.criterionType}>{criterion.type.toUpperCase()}</Text>
                  </View>
                  <View style={styles.criterionActions}>
                    <TouchableOpacity 
                      onPress={() => openCriterionModal(item, criterion)}
                      style={styles.iconBtn}
                    >
                      <Ionicons name="pencil" size={16} color="#2563EB" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeleteCriterion(item, criterion.id)}
                      style={styles.iconBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyCriteria}>No criteria yet. Add one below.</Text>
            )}
            
            {/* Add Criterion Button */}
            <TouchableOpacity 
              style={styles.addCriterionBtn}
              onPress={() => openCriterionModal(item)}
            >
              <Ionicons name="add-circle-outline" size={18} color="#059669" />
              <Text style={styles.addCriterionText}>Add Criterion</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Evaluation Template Builder</Text>
      <Text style={styles.headerSubtitle}>
        Create hierarchical evaluation templates: Questions → Criteria
      </Text>
      
      {/* Filters */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginRight: 10}}>
          {profiles.map(p => (
            <TouchableOpacity 
              key={p} 
              onPress={() => setSelectedProfile(p)}
              style={[styles.filterChip, selectedProfile === p && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, selectedProfile === p && styles.textWhite]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.divider} />
        <View style={{flexDirection:'row', gap: 4}}>
          {['round_1', 'round_2'].map(r => (
            <TouchableOpacity 
              key={r} 
              onPress={() => setSelectedRound(r)}
              style={[styles.filterChip, selectedRound === r && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, selectedRound === r && styles.textWhite]}>
                {r.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.contentRow}>
        {/* LEFT: Questions List */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Questions</Text>
            <Text style={styles.listHeaderCount}>{questions.length}</Text>
          </View>
          
          {loading ? (
            <ActivityIndicator color="#2563eb" style={{marginTop: 20}} />
          ) : (
            <FlatList 
              data={questions} 
              renderItem={renderQuestion}
              keyExtractor={item => item.id}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="document-outline" size={48} color="#CBD5E1" />
                  <Text style={styles.emptyText}>No questions added yet.</Text>
                  <Text style={styles.emptySubtext}>Add your first question using the form →</Text>
                </View>
              }
            />
          )}
        </View>

        {/* RIGHT: Add Question Form */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.formContainer}
        >
          <ScrollView>
            <Text style={styles.formTitle}>Add New Question</Text>
            <Text style={styles.formSubtitle}>
              Questions group multiple evaluation criteria together
            </Text>
            
            <Text style={styles.label}>Question Title *</Text>
            <TextInput 
              style={styles.input} 
              value={questionTitle} 
              onChangeText={setQuestionTitle} 
              placeholder="e.g., Problem Solving Assessment" 
            />

            <Text style={styles.helperText}>
              After adding the question, expand it to add evaluation criteria
            </Text>

            <TouchableOpacity style={styles.addBtn} onPress={handleAddQuestion}>
              <Ionicons name="add-circle" size={20} color="#FFF" />
              <Text style={styles.addBtnText}>Add Question</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Criterion Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCriterionId ? 'Edit Criterion' : 'Add Criterion'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Criterion Description *</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={criterionDesc} 
              onChangeText={setCriterionDesc} 
              placeholder="e.g., Did they identify the root cause?" 
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Response Type</Text>
            <View style={styles.typeRow}>
              {['boolean', 'rating', 'text'].map(t => (
                <TouchableOpacity 
                  key={t} 
                  onPress={() => setCriterionType(t as any)}
                  style={[styles.typeChip, criterionType === t && styles.typeChipActive]}
                >
                  <Text style={[styles.typeText, criterionType === t && styles.textWhite]}>
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.helperText}>
              • Boolean: Yes/No toggle{'\n'}
              • Rating: 1-5 numeric scale{'\n'}
              • Text: Free-form text input
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveBtn}
                onPress={handleSaveCriterion}
              >
                <Text style={styles.modalSaveText}>
                  {editingCriterionId ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 16 },
  
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, height: 40 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 8 },
  filterChipActive: { backgroundColor: '#2563eb' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  textWhite: { color: '#FFF' },
  divider: { width: 1, height: 24, backgroundColor: '#CBD5E1', marginHorizontal: 12 },

  contentRow: { flex: 1, flexDirection: 'row', gap: 20 },
  
  listContainer: { flex: 2, backgroundColor: '#FFF', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  listHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  listHeaderCount: { fontSize: 14, fontWeight: '600', color: '#64748B', backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },

  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: '#64748B' },
  emptySubtext: { marginTop: 4, fontSize: 13, color: '#94A3B8' },

  questionCard: { backgroundColor: '#FAFAFA', borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#FFF' },
  questionHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  questionTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  criteriaBadge: { fontSize: 11, color: '#64748B', marginTop: 2 },
  deleteBtn: { padding: 6 },

  criteriaContainer: { padding: 14, paddingTop: 8, backgroundColor: '#FAFAFA' },
  criterionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  criterionBullet: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  criterionNumber: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  criterionDesc: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 4 },
  criterionType: { fontSize: 10, fontWeight: '700', color: '#64748B', backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  criterionActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 4 },
  
  emptyCriteria: { textAlign: 'center', color: '#94A3B8', fontSize: 13, fontStyle: 'italic', paddingVertical: 12 },
  
  addCriterionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#86EFAC', borderRadius: 8, paddingVertical: 10, marginTop: 8 },
  addCriterionText: { fontSize: 13, fontWeight: '600', color: '#059669' },

  formContainer: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  formTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4, color: '#1E293B' },
  formSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 12, fontSize: 14, backgroundColor: '#FAFAFA' },
  textArea: { height: 80, textAlignVertical: 'top' },
  helperText: { fontSize: 12, color: '#94A3B8', marginTop: 8, lineHeight: 18 },
  
  typeRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  typeChip: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  typeChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  typeText: { fontSize: 12, fontWeight: '700', color: '#475569' },

  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#059669', padding: 14, borderRadius: 10, marginTop: 24 },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, shadowColor: '#000', shadowOpacity: 0.2, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center' },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  modalSaveBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#2563EB', alignItems: 'center' },
  modalSaveText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});