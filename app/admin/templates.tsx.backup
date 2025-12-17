// app/admin/templates.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';

export default function TemplateBuilder() {
  const [groupedQuestions, setGroupedQuestions] = useState<any[]>([]); 
  const [profiles, setProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedRound, setSelectedRound] = useState('round_1'); 
  
  // Form State
  const [questionTitle, setQuestionTitle] = useState(''); // Acts as Parent Question
  const [criteriaDesc, setCriteriaDesc] = useState('');   // Acts as Criteria
  const [criteriaExample, setCriteriaExample] = useState('');
  const [criteriaType, setCriteriaType] = useState('boolean'); // boolean, rating, text

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
      .order('created_at', { ascending: false }); // Most recent first
      
    if (!error && data) {
        // Group by 'section_title' (Parent Question)
        const grouped = data.reduce((acc: any, item) => {
            const key = item.section_title;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
        
        setGroupedQuestions(Object.keys(grouped).map(key => ({
            title: key,
            data: grouped[key]
        })));
    }
    setLoading(false);
  };

  const handleAddCriteria = async () => {
    if (!questionTitle || !criteriaDesc) return Alert.alert("Error", "Question Title and Criteria Description are required");

    const { error } = await supabase.from('feedback_questions').insert({
      target_profile: selectedProfile,
      round: selectedRound,
      section_title: questionTitle.trim(),
      description: criteriaDesc.trim(),
      example_text: criteriaExample,
      question_type: criteriaType,
    });

    if (error) Alert.alert("Error", error.message);
    else {
      setCriteriaDesc('');
      setCriteriaExample('');
      // Keep questionTitle so you can add more criteria to the same question easily
      fetchQuestions(); 
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('feedback_questions').delete().eq('id', id);
    fetchQuestions();
  };

  const renderGroup = ({ item }: { item: any }) => (
    <View style={styles.groupCard}>
        <View style={styles.groupHeader}>
            <Ionicons name="help-circle" size={18} color="#2563eb" />
            <Text style={styles.groupTitle}>{item.title}</Text>
        </View>
        
        {item.data.map((criteria: any) => (
            <View key={criteria.id} style={styles.criteriaRow}>
                <View style={styles.criteriaInfo}>
                    <Text style={styles.criteriaText}>• {criteria.description}</Text>
                    {criteria.example_text ? <Text style={styles.exampleText}>Guide: {criteria.example_text}</Text> : null}
                    <View style={styles.typeBadge}>
                         <Text style={styles.typeBadgeText}>{criteria.question_type}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => handleDelete(criteria.id)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Template Builder</Text>
      
      {/* 1. Filters (Profile & Round) */}
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
                    <Text style={[styles.filterText, selectedRound === r && styles.textWhite]}>{r.replace('_', ' ')}</Text>
                 </TouchableOpacity>
             ))}
         </View>
      </View>

      <View style={styles.contentRow}>
          {/* LEFT: Hierarchical List */}
          <View style={styles.listContainer}>
             {loading ? <ActivityIndicator color="#2563eb" /> : (
                 <FlatList 
                    data={groupedQuestions} 
                    renderItem={renderGroup}
                    keyExtractor={item => item.title}
                    ListEmptyComponent={<Text style={styles.empty}>No questions added yet.</Text>}
                 />
             )}
          </View>

          {/* RIGHT: Add Form */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formContainer}>
            <ScrollView>
                <Text style={styles.cardTitle}>Add Criteria</Text>
                
                <Text style={styles.label}>Parent Question</Text>
                <TextInput 
                    style={styles.input} 
                    value={questionTitle} 
                    onChangeText={setQuestionTitle} 
                    placeholder="e.g. Root Cause Analysis" 
                />

                <Text style={styles.label}>Evaluation Criteria</Text>
                <TextInput 
                    style={styles.input} 
                    value={criteriaDesc} 
                    onChangeText={setCriteriaDesc} 
                    placeholder="e.g. Did they drill down to the root?" 
                    multiline
                />

                <Text style={styles.label}>Mentor Guide (Optional)</Text>
                <TextInput 
                    style={styles.input} 
                    value={criteriaExample} 
                    onChangeText={setCriteriaExample} 
                    placeholder="Look for 5 Whys" 
                />

                <Text style={styles.label}>Criteria Type</Text>
                <View style={styles.typeRow}>
                    {['boolean', 'rating', 'text'].map(t => (
                        <TouchableOpacity key={t} onPress={() => setCriteriaType(t)} style={[styles.typeChip, criteriaType === t && styles.typeChipActive]}>
                            <Text style={[styles.typeText, criteriaType === t && styles.textWhite]}>{t.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.addBtn} onPress={handleAddCriteria}>
                    <Text style={styles.addBtnText}>+ Add Criteria</Text>
                </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 },
  
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, height: 40 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 8 },
  filterChipActive: { backgroundColor: '#2563eb' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  textWhite: { color: '#FFF' },
  divider: { width: 1, height: 24, backgroundColor: '#CBD5E1', marginHorizontal: 8 },

  contentRow: { flex: 1, flexDirection: 'row', gap: 20 },
  
  listContainer: { flex: 2 },
  empty: { textAlign: 'center', marginTop: 40, color: '#94a3b8' },

  groupCard: { backgroundColor: '#FFF', borderRadius: 8, marginBottom: 12, padding: 12, borderLeftWidth: 4, borderLeftColor: '#2563eb', shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  groupTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  
  criteriaRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, paddingLeft: 8 },
  criteriaInfo: { flex: 1, marginRight: 8 },
  criteriaText: { fontSize: 14, color: '#334155', fontWeight: '500' },
  exampleText: { fontSize: 12, color: '#64748b', fontStyle: 'italic', marginTop: 2, marginLeft: 8 },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: '#F1F5F9', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2, marginTop: 4, marginLeft: 8 },
  typeBadgeText: { fontSize: 10, color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },

  formContainer: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, fontSize: 14 },
  
  typeRow: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 16 },
  typeChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  typeChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  typeText: { fontSize: 11, fontWeight: '700', color: '#475569' },

  addBtn: { backgroundColor: '#059669', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  addBtnText: { color: '#FFF', fontWeight: '700' }
});