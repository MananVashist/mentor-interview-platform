// app/mentor/mentorship.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Libs
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';
import { Heading, AppText, Section, Card, ScreenBackground } from '@/lib/ui';
import { NotificationBanner } from '@/lib/ui/NotificationBanner';

// Configuration
const LINKEDIN_SHARE_BASE = "https://www.linkedin.com/feed/?shareActive=true&text=";
const SUPPORT_EMAIL = "support@crackjobs.com";

type MentorRow = {
  id: string;
  profile_ids: number[]; // Interview profile type IDs
  total_sessions?: number;
  expertise_profiles?: string[];
  [key: string]: any;
};

type BannerState = { type: 'success' | 'error'; message: string } | null;

export default function MentorshipScreen() {
  const { profile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<MentorRow | null>(null);
  const [banner, setBanner] = useState<BannerState>(null);

  useEffect(() => {
    if (!profile?.id) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('mentors')
          .select('*')
          .eq('id', profile.id)
          .maybeSingle();

        if (error) {
          console.log('[mentorship] load mentor error', error);
          if (mounted) {
            setBanner({
              type: 'error',
              message: 'Failed to load mentorship settings.',
            });
          }
        } else if (data && mounted) {
          const m = data as MentorRow;
          console.log('[mentorship] ✅ Loaded mentor data successfully');
          console.log('[mentorship] total_sessions:', m.total_sessions);
          setMentor(m);
        }
      } catch (e) {
        console.log('[mentorship] unexpected load error', e);
        if (mounted) {
          setBanner({
            type: 'error',
            message: 'Something went wrong while loading mentorship settings.',
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [profile?.id]);

  const handleClaim = (type: 'linkedin' | 'request_post', tier: string) => {
    if (type === 'linkedin') {
      const text = `Excited to announce I've reached ${tier} Mentor status on CrackJobs! 🚀 #Mentorship #CareerGrowth #CrackJobs`;
      const url = `${LINKEDIN_SHARE_BASE}${encodeURIComponent(text)}`;
      Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open LinkedIn."));
    } else if (type === 'request_post') {
      const subject = `Requesting Appreciation Post - ${tier} Mentor`;
      const body = `Hi Team,\n\nI have reached the ${tier} Mentor tier and would like to request my appreciation post.\n\nProfile ID: ${profile?.id || 'N/A'}`;
      const mailUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      Linking.openURL(mailUrl).catch(() => {
        Alert.alert("Request Sent", "We have noted your request! Our team will contact you shortly.");
      });
    }
  };

  if (loading) {
    return (
      <ScreenBackground>
        <NotificationBanner
          visible={!!banner}
          type={banner?.type}
          message={banner?.message ?? ''}
          onHide={() => setBanner(null)}
        />
        <Section style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
          <AppText style={styles.loadingText}>Loading mentorship settings…</AppText>
        </Section>
      </ScreenBackground>
    );
  }

  // Tier Logic - using total_sessions from mentor table
  const totalSessions = mentor?.total_sessions || 0;
  
  console.log('[mentorship] 🎯 Calculating tier for sessions:', totalSessions);
  
  let currentTier = 'new';
  let nextTier = 'Bronze';
  let target = 1;
  
  if (totalSessions >= 31) {
    currentTier = 'gold';
    nextTier = 'Max Level';
    target = totalSessions;
  } else if (totalSessions >= 11) {
    currentTier = 'silver';
    nextTier = 'Gold';
    target = 31;
  } else if (totalSessions >= 1) {
    currentTier = 'bronze';
    nextTier = 'Silver';
    target = 11;
  }

  console.log('[mentorship] 🏆 Current tier:', currentTier, `(${totalSessions}/${target} sessions)`);

  return (
    <ScreenBackground>
      <NotificationBanner
        visible={!!banner}
        type={banner?.type}
        message={banner?.message ?? ''}
        onHide={() => setBanner(null)}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Section style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="ribbon-outline" size={32} color={theme.colors.primary} />
          </View>
          <Heading level={1}>Mentorship Journey</Heading>
          <AppText style={styles.headerSub}>
            Track your progress and unlock achievements
          </AppText>
        </Section>

        {/* Current Tier Card */}
        <Section>
          <Card style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <View style={styles.tierBadge}>
                <Ionicons 
                  name={
                    currentTier === 'gold' ? 'trophy' :
                    currentTier === 'silver' ? 'star' :
                    currentTier === 'bronze' ? 'medal' : 'rocket'
                  } 
                  size={24} 
                  color={
                    currentTier === 'gold' ? '#D97706' :
                    currentTier === 'silver' ? '#9CA3AF' :
                    currentTier === 'bronze' ? '#B45309' : theme.colors.primary
                  } 
                />
              </View>
              <View style={styles.tierInfo}>
                <AppText style={styles.tierLabel}>Current Level</AppText>
                <AppText style={styles.tierName}>
                  {currentTier === 'gold' ? 'Gold Mentor' :
                   currentTier === 'silver' ? 'Silver Mentor' :
                   currentTier === 'bronze' ? 'Bronze Mentor' : 'New Mentor'}
                </AppText>
              </View>
            </View>
            
            <View style={styles.tierProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.min((totalSessions / target) * 100, 100)}%`,
                      backgroundColor: 
                        currentTier === 'gold' ? '#D97706' :
                        currentTier === 'silver' ? '#9CA3AF' : 
                        currentTier === 'bronze' ? '#B45309' : theme.colors.primary
                    }
                  ]} 
                />
              </View>
              <View style={styles.progressInfo}>
                <AppText style={styles.progressText}>
                  {totalSessions} {currentTier === 'gold' ? 'sessions' : `/ ${target} sessions`}
                </AppText>
                {currentTier !== 'gold' && (
                  <AppText style={styles.progressText}>Next: {nextTier}</AppText>
                )}
              </View>
            </View>
          </Card>
        </Section>

        {/* Mentor Levels */}
        <Section>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="ribbon-outline" size={20} color={theme.colors.primary} />
              <Heading level={3} style={styles.cardTitle}>Mentor Levels</Heading>
            </View>
            <AppText style={styles.cardDescription}>
              Complete more sessions to unlock benefits and recognition
            </AppText>

            {/* Bronze Level */}
            <View style={[styles.levelCard, currentTier === 'bronze' && styles.levelCardActive]}>
              <View style={styles.levelHeader}>
                <View style={[styles.levelIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="medal" size={20} color="#B45309" />
                </View>
                <View style={styles.levelInfo}>
                  <AppText style={styles.levelTitle}>Bronze Mentor</AppText>
                  <AppText style={styles.levelRequirement}>1-10 sessions</AppText>
                </View>
                {currentTier === 'bronze' && (
                  <View style={styles.currentBadge}>
                    <AppText style={styles.currentBadgeText}>CURRENT</AppText>
                  </View>
                )}
              </View>
              
              <AppText style={styles.levelDescription}>
                Welcome to the mentor community! Start building your reputation.
              </AppText>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Profile badge</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>LinkedIn sharable certificate</AppText>
                </View>
              </View>

              {currentTier === 'bronze' && (
                <View style={styles.levelPerks}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { borderColor: '#0077B5', backgroundColor: '#0077B5' }]}
                    onPress={() => handleClaim('linkedin', 'Bronze')}
                  >
                    <Ionicons name="logo-linkedin" size={14} color="#FFF" />
                    <AppText style={[styles.actionBtnText, { color: '#FFF' }]}>Share on LinkedIn</AppText>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Silver Level */}
            <View style={[styles.levelCard, currentTier === 'silver' && styles.levelCardActive]}>
              <View style={styles.levelHeader}>
                <View style={[styles.levelIcon, { backgroundColor: '#F3F4F6' }]}>
                  <Ionicons name="star" size={20} color="#9CA3AF" />
                </View>
                <View style={styles.levelInfo}>
                  <AppText style={styles.levelTitle}>Silver Mentor</AppText>
                  <AppText style={styles.levelRequirement}>11-30 sessions</AppText>
                </View>
                {currentTier === 'silver' && (
                  <View style={styles.currentBadge}>
                    <AppText style={styles.currentBadgeText}>CURRENT</AppText>
                  </View>
                )}
              </View>
              
              <AppText style={styles.levelDescription}>
                Experienced mentor with proven track record.
              </AppText>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>All Bronze benefits</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Enhanced profile visibility</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Appreciation post on our socials</AppText>
                </View>
              </View>

              {currentTier === 'silver' && (
                <View style={styles.levelPerks}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { borderColor: '#0077B5', backgroundColor: '#0077B5' }]}
                    onPress={() => handleClaim('linkedin', 'Silver')}
                  >
                    <Ionicons name="logo-linkedin" size={14} color="#FFF" />
                    <AppText style={[styles.actionBtnText, { color: '#FFF' }]}>Share on LinkedIn</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { borderColor: theme.colors.primary, backgroundColor: 'transparent' }]}
                    onPress={() => handleClaim('request_post', 'Silver')}
                  >
                    <Ionicons name="megaphone-outline" size={14} color={theme.colors.primary} />
                    <AppText style={[styles.actionBtnText, { color: theme.colors.primary }]}>Request Post</AppText>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Gold Level */}
            <View style={[styles.levelCard, currentTier === 'gold' && styles.levelCardActive]}>
              <View style={styles.levelHeader}>
                <View style={[styles.levelIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="trophy" size={20} color="#D97706" />
                </View>
                <View style={styles.levelInfo}>
                  <AppText style={styles.levelTitle}>Gold Mentor</AppText>
                  <AppText style={styles.levelRequirement}>31+ sessions</AppText>
                </View>
                {currentTier === 'gold' && (
                  <View style={styles.currentBadge}>
                    <AppText style={styles.currentBadgeText}>CURRENT</AppText>
                  </View>
                )}
              </View>
              
              <AppText style={styles.levelDescription}>
                Elite mentor status with exceptional experience.
              </AppText>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>All Silver benefits</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Priority profile placement</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Featured mentor spotlight</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Exclusive networking opportunities</AppText>
                </View>
              </View>

              {currentTier === 'gold' && (
                <View style={styles.levelPerks}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { borderColor: '#0077B5', backgroundColor: '#0077B5' }]}
                    onPress={() => handleClaim('linkedin', 'Gold')}
                  >
                    <Ionicons name="logo-linkedin" size={14} color="#FFF" />
                    <AppText style={[styles.actionBtnText, { color: '#FFF' }]}>Share on LinkedIn</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { borderColor: theme.colors.primary, backgroundColor: 'transparent' }]}
                    onPress={() => handleClaim('request_post', 'Gold')}
                  >
                    <Ionicons name="megaphone-outline" size={14} color={theme.colors.primary} />
                    <AppText style={[styles.actionBtnText, { color: theme.colors.primary }]}>Request Post</AppText>
                  </TouchableOpacity>
                </View>
              )}

              {currentTier === 'gold' && (
                <View style={styles.levelFooter}>
                  <Ionicons name="sparkles-outline" size={14} color="#D97706" />
                  <AppText style={styles.levelFooterText}>
                    You've reached the highest mentor level! Keep up the amazing work.
                  </AppText>
                </View>
              )}
            </View>
          </Card>
        </Section>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 16, color: theme.colors.text.light },
  scrollContent: { paddingBottom: 40 },
  header: { paddingTop: 24, paddingBottom: 16, alignItems: 'center' },
  headerIcon: { marginBottom: 12 },
  headerSub: { color: theme.colors.text.light, marginTop: 4, textAlign: 'center' },
  tierCard: { padding: 20, borderRadius: 16, backgroundColor: 'rgba(14,147,132,0.05)' },
  tierHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  tierBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  tierInfo: { flex: 1 },
  tierLabel: { fontSize: 12, color: theme.colors.text.light, marginBottom: 2 },
  tierName: { fontSize: 18, fontWeight: '700', color: theme.colors.text.main },
  tierProgress: { gap: 8 },
  progressBar: { height: 8, backgroundColor: '#FFFFFF', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  progressText: { fontSize: 12, color: theme.colors.text.light, fontWeight: '500' },
  card: { padding: 20, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  cardTitle: { fontSize: 18 },
  cardDescription: { color: theme.colors.text.light, fontSize: 14, lineHeight: 20, marginBottom: 16 },
  levelCard: { padding: 16, borderRadius: 12, borderWidth: 2, borderColor: theme.colors.border, backgroundColor: theme.colors.background, marginTop: 12 },
  levelCardActive: { backgroundColor: 'rgba(14,147,132,0.05)', borderColor: theme.colors.primary },
  levelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  levelIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text.main },
  levelRequirement: { fontSize: 12, color: theme.colors.text.light },
  currentBadge: { backgroundColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  currentBadgeText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  levelDescription: { fontSize: 14, color: theme.colors.text.light, lineHeight: 20, marginBottom: 12 },
  benefitsList: { gap: 8, marginBottom: 12 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  benefitText: { fontSize: 14, color: theme.colors.text.main, fontWeight: '500' },
  levelPerks: { gap: 8, marginTop: 12 },
  levelFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 8 },
  levelFooterText: { flex: 1, fontSize: 12, color: theme.colors.text.light },
  actionBtn: { flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1, borderRadius: 8, gap: 8, marginTop: 4, justifyContent: 'center' },
  actionBtnText: { fontSize: 12, fontWeight: '600' },
});