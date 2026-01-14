// app/video-call.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';

export default function VideoCallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    sessionId: string;
    role: 'host' | 'guest';
  }>();

  const { sessionId, role = 'guest' } = params;
  const [loading, setLoading] = useState(false);
  const [fetchingName, setFetchingName] = useState(true);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    fetchProfessionalTitle();
  }, []);

  const fetchProfessionalTitle = async () => {
    try {
      // Fetch session with mentor and candidate details
      const { data: session, error: sessionError } = await supabase
        .from('interview_sessions')
        .select(`
          id,
          mentor_id,
          candidate_id,
          mentors!interview_sessions_mentor_id_fkey (
            id,
            professional_title
          ),
          candidates!interview_sessions_candidate_id_fkey (
            id,
            professional_title
          )
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Determine display name based on role
      let title = '';
      
      if (role === 'host') {
        // User is mentor - get MENTOR's professional title
        title = session.mentors?.professional_title || 'Mentor';
      } else {
        // User is candidate - get CANDIDATE's professional title
        title = session.candidates?.professional_title || 'Candidate';
      }

      console.log('Professional title:', title);
      setDisplayName(title);

    } catch (err: any) {
      console.error('Error fetching professional title:', err);
      // Fallback names
      setDisplayName(role === 'host' ? 'Mentor' : 'Candidate');
    } finally {
      setFetchingName(false);
    }
  };

  const joinMeeting = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Unable to determine your professional title');
      return;
    }

    setLoading(true);

    try {
      console.log(`Getting code for Session: ${sessionId}, Role: ${role}`);

      const { data, error } = await supabase.functions.invoke('get-room-code', {
        body: { sessionId, role }
      });

      if (error) throw new Error(error.message || 'Failed to communicate with server');
      if (!data?.code) throw new Error(data?.error || 'No room code returned');

      const roomCode = data.code;
      console.log('✅ Received Room Code:', roomCode);

      const CUSTOM_SUBDOMAIN = 'crackjobs';
      const meetingUrl = `https://${CUSTOM_SUBDOMAIN}.app.100ms.live/meeting/${roomCode}?name=${encodeURIComponent(displayName)}`;

      console.log('Opening:', meetingUrl);

      if (Platform.OS === 'web') {
        window.open(meetingUrl, '_blank');
        setTimeout(() => router.back(), 1000);
      } else {
        const { Linking } = require('react-native');
        const supported = await Linking.canOpenURL(meetingUrl);
        
        if (supported) {
          await Linking.openURL(meetingUrl);
          router.back();
        } else {
          Alert.alert("Error", "Cannot open the meeting URL");
        }
      }

    } catch (err: any) {
      console.error('Join Error:', err);
      Alert.alert('Unable to Join', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingName) {
    return (
      <View style={styles.container}>
        <View style={styles.modal}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Preparing to join...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Join Interview</Text>
        <Text style={styles.subtitle}>
          {Platform.OS === 'web' ? 'Opens in new tab' : 'Opens in your browser'}
        </Text>

        {/* Display Name (Read-only) */}
        <View style={styles.nameDisplay}>
          <Text style={styles.nameLabel}>Joining as:</Text>
          <Text style={styles.nameValue}>{displayName}</Text>
          <Text style={styles.nameHint}>
            Your professional title ensures anonymity during the interview
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.joinButton, loading && styles.buttonDisabled]}
            onPress={joinMeeting}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.joinButtonText}>Join Call</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.roleHint}>
          Role: {role === 'host' ? 'Mentor' : 'Candidate'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  nameDisplay: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  nameLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  nameValue: {
    fontSize: 18,
    color: '#111',
    fontWeight: '600',
    marginBottom: 6,
  },
  nameHint: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  roleHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
});