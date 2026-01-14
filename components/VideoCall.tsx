import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import { HMSSDK, HMSUpdateListenerActions } from '@100mslive/react-native-hms';
import { supabase } from '@/lib/supabase/client';
import { Ionicons } from '@expo/vector-icons';

interface VideoCallProps {
  sessionId: string;
  userName: string;
  role: 'host' | 'guest'; // host for mentor, guest for candidate
  onLeave: () => void;
}

export default function VideoCall({ sessionId, userName, role, onLeave }: VideoCallProps) {
  const [loading, setLoading] = useState(true);
  const [hmsInstance, setHmsInstance] = useState<HMSSDK | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    initializeAndJoin();
    return () => {
      cleanup();
    };
  }, []);

  const initializeAndJoin = async () => {
    try {
      console.log('🎥 Initializing 100ms SDK...');

      // Step 1: Generate auth token from your edge function
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('generate-token', {
        body: { sessionId, userName, role }
      });

      if (tokenError || !tokenData?.token) {
        throw new Error('Failed to generate room token');
      }

      console.log('✅ Token generated successfully');

      // Step 2: Build HMS SDK instance
      const hms = await HMSSDK.build();
      setHmsInstance(hms);

      // Step 3: Add event listeners
      hms.addEventListener(HMSUpdateListenerActions.ON_JOIN, onJoinSuccess);
      hms.addEventListener(HMSUpdateListenerActions.ON_ERROR, onError);
      hms.addEventListener(HMSUpdateListenerActions.ON_PEER_UPDATE, onPeerUpdate);

      // Step 4: Join room configuration
      const config = {
        userName,
        authToken: tokenData.token,
      };

      console.log('🚀 Joining room...');
      await hms.join(config);

    } catch (err: any) {
      console.error('❌ Join error:', err);
      Alert.alert('Error', err.message || 'Failed to join video call');
      onLeave();
    }
  };

  const onJoinSuccess = () => {
    console.log('✅ Successfully joined the room');
    setLoading(false);
  };

  const onError = (error: any) => {
    console.error('❌ HMS Error:', error);
    Alert.alert('Error', 'A video call error occurred');
  };

  const onPeerUpdate = (data: any) => {
    console.log('👤 Peer update:', data);
  };

  const toggleAudio = async () => {
    if (hmsInstance) {
      await hmsInstance.localPeer?.localAudioTrack?.setMute(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = async () => {
    if (hmsInstance) {
      await hmsInstance.localPeer?.localVideoTrack?.setMute(!isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const cleanup = async () => {
    if (hmsInstance) {
      try {
        await hmsInstance.leave();
        await hmsInstance.destroy();
      } catch (err) {
        console.error('Cleanup error:', err);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E9384" />
        <Text style={styles.loadingText}>Connecting to video call...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Video will render here automatically by HMS SDK */}
      
      {/* Control buttons */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleAudio}>
          <Ionicons 
            name={isAudioMuted ? 'mic-off' : 'mic'} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={toggleVideo}>
          <Ionicons 
            name={isVideoMuted ? 'videocam-off' : 'videocam'} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.leaveButton]} onPress={onLeave}>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaveButton: {
    backgroundColor: '#EF4444',
  },
});