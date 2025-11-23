import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import MentorAvailabilityEditor from '@/components/MentorAvailabilityEditor'; 
import { useAuthStore } from '@/lib/store';

export default function AvailabilityPage() {
  const { user, mentorProfile } = useAuthStore();

  if (!user || !mentorProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0E9384" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <MentorAvailabilityEditor mentorId={mentorProfile.id} />
    </View>
  );
}