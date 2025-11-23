// app/admin/templates.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';

export default function TemplateBuilder() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter / Form State
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedRound, setSelectedRound] = useState('round_1'); // round_1, round_2, hr_round
  
  // New Question Form
  const [section, setSection] = useState('');
  const [desc, setDesc] = useState('');
  const [example, setExample] = useState('');
  const [type, setType] = useState('boolean'); // boolean, rating, text

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    if (selectedProfile) fetchQuestions();
  }, [selectedProfile, selectedRound]);

  // 1. Fetch available profiles for dropdown logic
  const fetchMeta = async () => {
    const { data } = await supabase.from('interview_profiles_admin').select('name').eq('is_active', true);
    if (data && data.length > 0) {
        const names = data.map(d => d.name);
        setProfiles(names);
        setSelectedProfile(names[0]); // Default to first
    }
  };

  // 2. Fetch Questions for current selection
  const fetchQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('feedback_questions')
      .select('*')
      .eq('target_profile', selectedProfile)
      .eq('round', selectedRound)
      .order('section_title', { ascending: true })
      .order('order_index', { ascending: true });
      
    if (!error) setQuestions(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!desc || !section) return Alert.alert("Error", "Description and Section are required");

    const { error } = await supabase.from('feedback_questions').insert({
      target_profile: selectedProfile,
      round: selectedRound,
      section_title: section,
      description: desc,
      example_text: example,
      question_type: type,
      order_index: questions.length + 1
    });

    if (error) Alert.alert("Error", error.message);
    else {
      setDesc('');
      setExample('');
      fetchQuestions(); // Refresh list
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('feedback_questions').delete().eq('id', id);
    fetchQuestions();
  };

  const renderQuestion = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
        <View style={{flex: 1}}>
            <Text style={styles.itemSection}>{item.section_title}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
            {item.example_text && <Text style={styles.itemExample}>Ex: {item.example_text}</Text>}
            <View style={styles.badgeRow}>
                <Text style={styles.itemType}>{item.question_type}</Text>
            </View>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{padding: 8}}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Checklist Builder</Text>
      
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
          {/* LEFT: List */}
          <View style={styles.listContainer}>
             {loading ? <ActivityIndicator color="#2563eb" /> : (
                 <FlatList 
                    data={questions} 
                    renderItem={renderQuestion}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.empty}>No questions added yet.</Text>}
                 />
             )}
          </View>

          {/* RIGHT: Add Form */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formContainer}>
            <ScrollView>
                <Text style={styles.cardTitle}>Add Question</Text>
                
                <Text style={styles.label}>Section Title</Text>
                <TextInput style={styles.input} value={section} onChangeText={setSection} placeholder="e.g. Problem Solving" />

                <Text style={styles.label}>Question</Text>
                <TextInput style={styles.input} value={desc} onChangeText={setDesc} placeholder="Did they identify the root cause?" />

                <Text style={styles.label}>Mentor Guide (Example)</Text>
                <TextInput style={styles.input} value={example} onChangeText={setExample} placeholder="Look for 5 Whys framework" />

                <Text style={styles.label}>Response Type</Text>
                <View style={styles.typeRow}>
                    {['boolean', 'rating', 'text'].map(t => (
                        <TouchableOpacity key={t} onPress={() => setType(t)} style={[styles.typeChip, type === t && styles.typeChipActive]}>
                            <Text style={[styles.typeText, type === t && styles.textWhite]}>{t.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                    <Text style={styles.addBtnText}>+ Add to Checklist</Text>
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

  itemCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  itemSection: { fontSize: 10, fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', marginBottom: 2 },
  itemDesc: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  itemExample: { fontSize: 12, color: '#64748b', fontStyle: 'italic', marginTop: 2 },
  badgeRow: { flexDirection: 'row', marginTop: 6 },
  itemType: { fontSize: 10, backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', color: '#475569' },

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