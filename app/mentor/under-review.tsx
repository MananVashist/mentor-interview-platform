import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/lib/store';
import { BrandHeader } from '@/lib/ui';

export default function UnderReviewScreen() {
  const router = useRouter();
  const { clear } = useAuthStore();

  const handleLogout = async () => {
    await authService.signOut();
    clear();
    router.replace('/auth/sign-in');
  };

  return (
    <View style={styles.container}>
      {/* Brand Header for consistent identity */}
      <View style={styles.headerSpacer}>
        <BrandHeader />
      </View>

      <View style={styles.card}>
        <View style={styles.statusIconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="hourglass" size={42} color="#D97706" />
          </View>
        </View>
        
        <Text style={styles.title}>Application Under Review</Text>
        
        <Text style={styles.description}>
          Thank you for applying to be a mentor! Your profile is currently being reviewed by our admin team.
        </Text>

        <View style={styles.divider} />

        {/* Process Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.sectionHeader}>WHAT HAPPENS NEXT?</Text>
          
          <View style={styles.stepRow}>
            <Ionicons name="document-text-outline" size={20} color="#0E9384" />
            <Text style={styles.stepText}>We review your LinkedIn & experience.</Text>
          </View>
          
          <View style={styles.stepRow}>
            <Ionicons name="call-outline" size={20} color="#0E9384" />
            <Text style={styles.stepText}>We may call you for a quick verification.</Text>
          </View>
          
          <View style={styles.stepRow}>
            <Ionicons name="mail-open-outline" size={20} color="#0E9384" />
            <Text style={styles.stepText}>You'll receive an email once approved.</Text>
          </View>
        </View>

        {/* Support Link */}
        <TouchableOpacity 
          style={styles.helpLink} 
          onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}
        >
          <Text style={styles.helpLinkText}>Need help? Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Action */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f5f0', // Matches your global bg
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 24,
  },
  headerSpacer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  card: { 
    backgroundColor: '#fff', 
    width: '100%', 
    maxWidth: 400,
    padding: 32, 
    borderRadius: 24, 
    alignItems: 'center', 
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  statusIconContainer: { 
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7', // Amber-100
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFBEB', // Amber-50 ring
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 12,
    textAlign: 'center',
  },
  description: { 
    fontSize: 15, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginBottom: 24, 
    lineHeight: 22,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 24,
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  helpLink: {
    marginTop: 8,
    padding: 8,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#0E9384',
    fontWeight: '600',
  },
  logoutBtn: { 
    marginTop: 32, 
    paddingVertical: 12, 
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  logoutText: { 
    color: '#EF4444', 
    fontWeight: '600', 
    fontSize: 15,
  }
});