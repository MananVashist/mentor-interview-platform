// app/candidate/bookings.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, ScrollView, StyleSheet, TouchableOpacity, Linking, 
  ActivityIndicator, Alert, Platform, RefreshControl, StatusBar, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Libs
import { supabase } from '@/lib/supabase/client'; 
import { useAuthStore } from '@/lib/store';
import { theme } from '@/lib/theme';
import { Heading, AppText, Card, ScreenBackground } from '@/lib/ui';

// Components
import RatingModal from '@/components/RatingModal';

// 🟢 SINGLE SOURCE OF TRUTH (Calculates UI state from DB status)
import { getBookingState, getBookingDetails, BookingUIState } from '@/lib/booking-logic';

const BookingCard = ({ session, onJoin, onViewDetails, onViewEvaluation, onRebook, onRateSession }: any) => {
  const uiState = getBookingState(session);
  const details = getBookingDetails(session);
  const counterpartName = details.getCounterpartName('candidate'); 

  const skillName = session.skill_name || 'Interview Session';

  return (
    <Card style={styles.sessionCard}>
      <View style={styles.splitContainer}>
        {/* LEFT SIDE: Info */}
        <View style={styles.leftSection}>
          <Heading level={4} style={styles.cardTitle}>
            {details.profileName} interview with {counterpartName}
          </Heading>
          
          <View style={styles.infoRow}>
            <Ionicons name="bulb-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>{skillName}</AppText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>
              {details.dateLabel} • {details.timeLabel}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>55 mins (45 min interview + 10 min feedback)</AppText>
          </View>
        </View>

        {/* RIGHT SIDE: Badge */}
        <View style={styles.rightSection}>
          <Badge state={uiState} />
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* --- DYNAMIC ACTIONS --- */}

      {/* 1. PENDING */}
      {uiState === 'APPROVAL' && (
        <View style={styles.actionRowFull}>
          <View style={[styles.btnFull, styles.btnDisabled]}>
            <Ionicons name="hourglass-outline" size={16} color="#6B7280" style={{marginRight: 6}} />
            <AppText style={styles.textGray}>Pending Mentor Approval</AppText>
          </View>
        </View>
      )}

      {/* 2. CONFIRMED Future */}
      {uiState === 'SCHEDULED' && (
        <View style={styles.actionRowFull}>
           <View style={[styles.btnFull, styles.btnDisabled]}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#059669" style={{marginRight: 6}} />
            <AppText style={[styles.textGray, {color: '#059669'}]}>Confirmed</AppText>
          </View>
          <TouchableOpacity 
            style={[styles.btnFull, styles.btnSecondary]} 
            onPress={() => onViewDetails(session)}
          >
            <AppText style={styles.textPrimary}>View Details</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 3. LIVE NOW */}
      {uiState === 'JOIN' && (
        <View style={styles.actionRowFull}>
           <TouchableOpacity style={[styles.btnFull, styles.btnGreen]} onPress={() => onJoin(session.meeting_link)}>
            <Ionicons name="videocam" size={18} color="#fff" style={{marginRight:4}}/>
            <AppText style={styles.textWhite}>Join Meeting</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. PAST */}
      {uiState === 'POST_PENDING' && (
        <View style={styles.actionRowFull}>
          <View style={[styles.btnFull, styles.btnDisabled]}>
            <Ionicons name="clipboard-outline" size={16} color="#6B7280" style={{marginRight: 6}} />
            <AppText style={styles.textGray}>Awaiting Evaluation</AppText>
          </View>
        </View>
      )}

      {/* 5. COMPLETED - With Rate Session */}
      {uiState === 'POST_COMPLETED' && (
        <>
          <View style={styles.actionRowFull}>
            <TouchableOpacity 
              style={[styles.btnFull, styles.btnSecondary]} 
              onPress={() => onRebook(session.mentor_id)}
            >
              <Ionicons name="refresh-outline" size={16} color={theme.colors.primary} style={{marginRight: 6}} />
              <AppText style={styles.textPrimary}>Rebook</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.btnFull, styles.btnPrimary]} 
              onPress={() => onViewEvaluation(session.id)}
            >
              <AppText style={styles.textWhite}>View Feedback</AppText>
            </TouchableOpacity>
          </View>
          
          {/* 🆕 Rate Session Button - Only show if not rated yet */}
          {!session.has_review && (
            <TouchableOpacity 
              style={[styles.btnFull, styles.btnRating, { marginTop: 10 }]} 
              onPress={() => onRateSession(session)}
            >
              <Ionicons name="star-outline" size={16} color="#F59E0B" style={{marginRight: 6}} />
              <AppText style={styles.textRating}>Rate Session</AppText>
            </TouchableOpacity>
          )}

          {/* Show rating if already rated */}
          {session.has_review && session.review_rating && (
            <View style={styles.ratedContainer}>
              <AppText style={styles.ratedLabel}>Your rating:</AppText>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <AppText key={star} style={styles.starText}>
                    {star <= session.review_rating ? '⭐' : '☆'}
                  </AppText>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </Card>
  );
};

const Badge = ({ state }: { state: BookingUIState }) => {
  let bg = '#E5E7EB'; let text = '#374151'; let label = 'Unknown';
  
  if(state === 'APPROVAL') { bg = '#FEF3C7'; text = '#B45309'; label = 'Pending'; }
  else if(state === 'SCHEDULED') { bg = '#DBEAFE'; text = '#1E40AF'; label = 'Confirmed'; }
  else if(state === 'JOIN') { bg = '#D1FAE5'; text = '#047857'; label = 'Live Now'; }
  else if(state === 'POST_PENDING') { bg = '#F3F4F6'; text = '#6B7280'; label = 'Ended'; }
  else if(state === 'POST_COMPLETED') { bg = '#DEF7EC'; text = '#03543F'; label = 'Finished'; }
  else if(state === 'CANCELLED') { bg = '#FEE2E2'; text = '#991B1B'; label = 'Cancelled'; }
  
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
      <AppText style={{ color: text, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{label}</AppText>
    </View>
  );
};

// --- MAIN SCREEN ---
export default function CandidateBookingsScreen() {
  const { user } = useAuthStore(); 
  const router = useRouter();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Detail Modal State
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailContent, setDetailContent] = useState<{name: string, desc: string} | null>(null);

  // 🆕 Rating Modal State
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const fetchBookings = async () => {
    let currentUser = user;
    if (!currentUser) {
       const { data } = await supabase.auth.getUser();
       currentUser = data.user;
    }

    if (!currentUser) {
        setLoading(false); setRefreshing(false);
        return;
    }
    
    try {
      // 1. Fetch Sessions with package payment status
      const { data: sessionsData, error } = await supabase
        .from('interview_sessions')
        .select(`
          id, scheduled_at, status, skill_id, meeting_link, mentor_id, package_id,
          package:interview_packages!package_id(id, payment_status, interview_profile_id)
        `)
        .eq('candidate_id', currentUser.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        setLoading(false); setRefreshing(false);
        return;
      }

      // Filter out sessions where payment is still pending (exclude unpaid bookings)
      const paidSessions = sessionsData.filter((s: any) => 
        s.package?.payment_status && s.package.payment_status !== 'pending'
      );

      // 🆕 2. Fetch Reviews for these packages
      const packageIds = paidSessions.map((s: any) => s.package_id).filter(Boolean);
      let reviewsMap: any = {};

      if (packageIds.length > 0) {
        const { data: reviewsData } = await supabase
          .from('candidate_reviews')
          .select('package_id, rating')
          .in('package_id', packageIds);

        if (reviewsData) {
          reviewsMap = reviewsData.reduce((acc: any, curr: any) => {
            acc[curr.package_id] = curr.rating;
            return acc;
          }, {});
        }
      }

      // 3. Fetch Mentors
      const mentorIds = [...new Set(paidSessions.map((s: any) => s.mentor_id))];
      const { data: mentorData } = await supabase
        .from('mentors')
        .select('id, professional_title')
        .in('id', mentorIds);

      const profileMap = (mentorData || []).reduce((acc: any, curr: any) => {
         acc[curr.id] = curr; return acc;
      }, {});

      // 4. Fetch Interview Profiles
      const profileIds = [...new Set(paidSessions.map((s: any) => s.package?.interview_profile_id).filter(Boolean))];
      let interviewProfileMap: any = {};

      if (profileIds.length > 0) {
        const { data: ipData } = await supabase
          .from('interview_profiles_admin')
          .select('id, name, description')
          .in('id', profileIds);
        
        if (ipData) {
          interviewProfileMap = ipData.reduce((acc:any, curr:any) => {
            acc[curr.id] = curr; return acc;
          }, {});
        }
      }

      // 5. Fetch Skills
      const skillIds = [...new Set(paidSessions.map((s: any) => s.skill_id).filter(Boolean))];
      let skillMap: any = {};

      if (skillIds.length > 0) {
          const { data: skillsData } = await supabase
            .from('interview_skills_admin')
            .select('id, name, description')
            .in('id', skillIds);
          
          if (skillsData) {
              skillMap = skillsData.reduce((acc: any, curr: any) => {
                  acc[curr.id] = curr; return acc;
              }, {});
          }
      }

      // 6. Merge Data
      const merged = paidSessions.map((s: any) => {
          const profileId = s.package?.interview_profile_id;
          const profileMeta = profileId ? interviewProfileMap[profileId] : null;
          const skillMeta = s.skill_id ? skillMap[s.skill_id] : null;

          // Check if review exists
          const hasReview = reviewsMap[s.package_id] !== undefined;
          const reviewRating = reviewsMap[s.package_id] || null;

          return {
            ...s,
            mentor_name: profileMap[s.mentor_id]?.professional_title || 'Mentor',
            skill_name: skillMeta?.name || 'Mock Interview',
            skill_description: skillMeta?.description || '',
            package: s.package_id ? {
                id: s.package_id,
                interview_profile_id: profileId,
                interview_profile_name: profileMeta?.name || 'Mock Interview',
                interview_profile_description: profileMeta?.description || 'No description available.'
            } : null,
            has_review: hasReview,
            review_rating: reviewRating
          };
      });

      const sorted = merged.sort((a, b) => {
         const isADone = a.status === 'completed';
         const isBDone = b.status === 'completed';
         if (isADone === isBDone) {
             return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
         }
         return isADone ? 1 : -1;
      });

      setSessions(sorted);

    } catch (err: any) {
      console.error("[CandidateBookings] Fetch Error:", err.message);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [user]);
  const onRefresh = () => { setRefreshing(true); fetchBookings(); };

  const handleJoin = (link: string) => {
    if (!link) return Alert.alert("Not Ready", "The meeting link hasn't been generated yet.");
    Linking.openURL(link).catch(err => Alert.alert("Error", "Could not open link."));
  };

  const handleViewDetails = (session: any) => {
    const title = session.skill_name || session.package?.interview_profile_name || 'Interview Details';
    const description = session.skill_description || session.package?.interview_profile_description || 'No additional details provided.';

    setDetailContent({
      name: title,
      desc: description
    });
    setDetailModalVisible(true);
  };

  const handleViewEvaluation = (sessionId: string) => {
    router.push({ pathname: `/candidate/session/[id]`, params: { id: sessionId, mode:'read' } });
  };

  const handleRebook = (mentorId: string) => {
    router.push({ pathname: `/candidate/[id]`, params: { id: mentorId } });
  };

  // 🆕 Rating Handler
  const handleRateSession = (session: any) => {
    setSelectedSession(session);
    setRatingModalVisible(true);
  };

  // 🆕 Submit Rating to Database
    const handleSubmitRating = async (rating: number, reviewText: string) => {
  if (!selectedSession || !user) {
    console.error('Missing session or user');
    return;
  }

  // 🔍 COMPREHENSIVE DEBUG LOGGING
  console.log('========================================');
  console.log('🔍 SUBMIT RATING DEBUG');
  console.log('========================================');
  console.log('📊 Rating:', rating);
  console.log('📝 Review Text (raw):', `"${reviewText}"`);
  console.log('📏 Review Text Length:', reviewText.length);
  console.log('✂️  Review Text (trimmed):', `"${reviewText.trim()}"`);
  console.log('📏 Trimmed Length:', reviewText.trim().length);
  console.log('💾 Will save as:', reviewText.trim() || null);
  console.log('📦 Package ID:', selectedSession.package_id);
  console.log('👤 Candidate ID:', user.id);
  console.log('👨‍🏫 Mentor ID:', selectedSession.mentor_id);
  console.log('========================================');

  try {
    const trimmedReview = reviewText.trim();
    
    const payload = {
      package_id: selectedSession.package_id,
      candidate_id: user.id,
      mentor_id: selectedSession.mentor_id,
      rating: rating,
      review_text: trimmedReview.length > 0 ? trimmedReview : null
    };

    console.log('📤 Full Payload:', JSON.stringify(payload, null, 2));

    const { data, error } = await supabase
      .from('candidate_reviews')
      .insert(payload)
      .select('*'); // Return the inserted row

    if (error) {
      console.error('❌ Insert Error:', error);
      throw error;
    }

    console.log('✅ Successfully Inserted:');
    console.log(JSON.stringify(data, null, 2));
    console.log('========================================');
    
    Alert.alert('Success', 'Thank you for your feedback!');
    await fetchBookings();
  } catch (error: any) {
    console.error('❌ Failed to submit review:', error);
    Alert.alert('Error', 'Failed to submit review. Please try again.');
    throw error;
  }
};

  if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <AppText style={{marginTop: 10, color: theme.colors.text.light}}>Loading your bookings...</AppText>
        </View>
      );
  }

  return (
    <ScreenBackground style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <Heading level={3}>My Bookings</Heading>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
            <AppText style={styles.emptyText}>You haven't booked any interviews yet.</AppText>
          </View>
        ) : (
          <View style={styles.list}>
            {sessions.map((session) => (
              <BookingCard 
                key={session.id} 
                session={session}
                onJoin={handleJoin}
                onViewDetails={handleViewDetails}
                onViewEvaluation={handleViewEvaluation}
                onRebook={handleRebook}
                onRateSession={handleRateSession}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Details Modal */}
      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Heading level={3} style={{marginBottom:12}}>{detailContent?.name}</Heading>
            <ScrollView style={{maxHeight: 300}}>
                <AppText style={{marginBottom: 24, lineHeight: 22, color: theme.colors.text.light}}>
                {detailContent?.desc}
                </AppText>
            </ScrollView>
            <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.modalCloseBtn}>
              <AppText style={styles.textWhite}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🆕 Rating Modal */}
      <RatingModal
        visible={ratingModalVisible}
        mentorName={selectedSession?.mentor_name || 'your mentor'}
        onClose={() => {
          setRatingModalVisible(false);
          setSelectedSession(null);
        }}
        onSubmit={handleSubmitRating}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: { 
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16,
      paddingTop: Platform.OS === 'ios' ? 60 : 20, backgroundColor: theme.colors.background,
      borderBottomWidth: 1, borderBottomColor: theme.colors.border
  },
  backBtn: { marginRight: 16 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  list: { gap: 16 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: theme.colors.text.main },
  sessionCard: { padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border },
  splitContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  leftSection: { flex: 1, paddingRight: 12 },
  rightSection: { paddingTop: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text.main, marginBottom: 12, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  cardDivider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 12 },
  actionRowFull: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  btnFull: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: theme.colors.primary },
  btnSecondary: { backgroundColor: '#eff6ff' },
  btnGreen: { backgroundColor: '#059669' },
  btnDisabled: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  btnRating: { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A' },
  textWhite: { color: '#fff', fontWeight: '600', fontSize: 13 },
  textPrimary: { color: theme.colors.primary, fontWeight: '600', fontSize: 13 },
  textGray: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  textRating: { color: '#F59E0B', fontSize: 13, fontWeight: '600' },
  ratedContainer: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ratedLabel: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  starsRow: { flexDirection: 'row', gap: 2 },
  starText: { fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 16 },
  modalCloseBtn: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
});