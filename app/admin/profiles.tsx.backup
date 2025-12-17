import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  StyleSheet, Alert, Switch, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { supabase } from '@/lib/supabase/client';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilesSettings() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('interview_profiles_admin')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) console.error(error);
    setProfiles(data || []);
    setFetching(false);
  };

  const addProfile = async () => {
    if (!name.trim()) return;
    setLoading(true);
    
    const { error } = await supabase
      .from('interview_profiles_admin')
      .insert({ 
        name: name.trim(),
        description: description.trim() || null,
        is_active: true 
      });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
        setName('');
        setDescription('');
        fetchProfiles();
    }
    setLoading(false);
  };

  const toggleActive = async (id: number, currentState: boolean) => {
    // Optimistic update
    setProfiles(prev => prev.map(p => p.id === id ? {...p, is_active: !currentState} : p));
    
    const { error } = await supabase
      .from('interview_profiles_admin')
      .update({ is_active: !currentState })
      .eq('id', id);
      
    if (error) fetchProfiles(); // Revert on error
  };

  const deleteProfile = async (id: number) => {
    Alert.alert("Delete", "Are you sure? This cannot be undone.", [
        { text: "Cancel" },
        { text: "Delete", style: 'destructive', onPress: async () => {
            await supabase.from('interview_profiles_admin').delete().eq('id', id);
            fetchProfiles();
        }}
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.rowHeader}>
        <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, !item.is_active && styles.disabledText]}>
                {item.name}
            </Text>
            {item.description && (
                <Text style={styles.profileDesc}>{item.description}</Text>
            )}
        </View>
        <Switch 
            value={item.is_active} 
            onValueChange={() => toggleActive(item.id, item.is_active)}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={item.is_active ? '#2563eb' : '#f4f3f4'}
        />
      </View>
      
      <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProfile(item.id)}>
        <Ionicons name="trash-outline" size={16} color="#EF4444" />
        <Text style={styles.deleteText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.headerTitle}>Job Profiles</Text>
      <Text style={styles.subHeader}>Manage the roles available for candidates.</Text>
      
      {/* Add New Form */}
      <View style={styles.addForm}>
        <TextInput 
            style={styles.input} 
            placeholder="Role Name (e.g. SDE II)" 
            value={name}
            onChangeText={setName}
        />
        <TextInput 
            style={[styles.input, { marginTop: 8 }]} 
            placeholder="Description (Optional)" 
            value={description}
            onChangeText={setDescription}
        />
        <TouchableOpacity 
            style={[styles.addBtn, !name.trim() && styles.disabledBtn]} 
            onPress={addProfile} 
            disabled={loading || !name.trim()}
        >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.addBtnText}>Add Profile</Text>}
        </TouchableOpacity>
      </View>

      {/* List */}
      {fetching ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
            data={profiles}
            keyExtractor={i => i.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={<Text style={styles.empty}>No profiles added yet.</Text>}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
  subHeader: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  
  addForm: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 16 },
  addBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  disabledBtn: { backgroundColor: '#94a3b8' },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  disabledText: { color: '#94a3b8', textDecorationLine: 'line-through' },
  profileDesc: { fontSize: 14, color: '#64748b', marginTop: 2 },
  
  deleteBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 12, alignSelf: 'flex-start', gap: 4, opacity: 0.8 },
  deleteText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
  
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 20 }
});