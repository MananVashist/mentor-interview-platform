// app/candidate/schedule.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, StatusBar 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DateTime } from 'luxon';

import { theme } from '@/lib/theme';
import { Heading, AppText } from '@/lib/ui';
import { supabase } from '@/lib/supabase/client';
import { paymentService } from '@/services/payment.service';
import { useAuthStore } from '@/lib/store';

type TimeSlot = {
  time: string;
  isAvailable: boolean;
};

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const mentorId = Array.isArray(params.mentorId) ? params.mentorId[0] : params.mentorId;
  
  // Get the entire auth store to debug
  const authStore = useAuthStore();
  const { user, setUser } = authStore;

  console.log('🔐 FULL Auth Store:', authStore);
  console.log('🔐 Auth state on mount:', { user, userId: user?.id });
  console.log('🔐 User object type:', typeof user);
  console.log('🔐 User keys:', user ? Object.keys(user) : 'null');

  const [isLoading, setIsLoading] = useState(true);
  const [mentor, setMentor] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // CRITICAL: Initialize auth on mount with retry
  useEffect(() => {
    let mounted = true;
    
    async function initializeAuth() {
      console.log('🔐 Initializing auth...');
      
      try {
        // Try multiple times in case session is loading
        for (let attempt = 0; attempt < 3; attempt++) {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          console.log(`🔐 Auth attempt ${attempt + 1}:`, {
            hasSession: !!session,
            userId: session?.user?.id,
            error
          });
          
          if (session?.user) {
            console.log('✅ Session found on attempt', attempt + 1);
            if (mounted) {
              setCurrentUserId(session.user.id);
              // Also update the auth store
              setUser(session.user as any);
              setAuthChecked(true);
            }
            return;
          }
          
          // Wait before retry
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
        
        // After 3 attempts, no session found
        console.log('❌ No session after 3 attempts');
        if (mounted) {
          setAuthChecked(true);
          Alert.alert(
            'Sign In Required',
            'Please sign in to continue',
            [{ text: 'OK', onPress: () => router.replace('/sign-in') }]
          );
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) setAuthChecked(true);
      }
    }
    
    initializeAuth();
    
    return () => { mounted = false; };
  }, []);

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      console.log('🔐 Checking authentication on mount...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📱 Session on mount:', session);
      
      if (!session) {
        console.log('❌ No session found - redirecting to sign-in...');
        Alert.alert(
          'Authentication Required',
          'You need to be logged in to book sessions. Please sign in.',
          [
            {
              text: 'Sign In',
              onPress: () => router.replace('/sign-in')
            }
          ]
        );
      } else {
        console.log('✅ Session found:', session.user.id);
        setCurrentUserId(session.user.id);
      }
    }
    
    checkAuth();
  }, []);

  // Fallback: Get user from Supabase session if auth store is empty
  useEffect(() => {
    async function getCurrentUser() {
      console.log('🔍 Checking Supabase session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📱 Supabase session:', session);
      
      if (session?.user) {
        console.log('✅ User found in session:', session.user.id);
        setCurrentUserId(session.user.id);
      } else {
        console.log('❌ No session found');
      }
    }
    
    if (!user?.id) {
      console.log('⚠️ User not in auth store, fetching from Supabase...');
      getCurrentUser();
    } else {
      console.log('✅ User already in auth store:', user.id);
      setCurrentUserId(user.id);
    }
  }, [user]);
  
  // Initialize Date in Indian Standard Time (IST)
  const [selectedDate, setSelectedDate] = useState(
    DateTime.now().setZone('Asia/Kolkata').plus({ days: 1 }) // Start from tomorrow
  );
  
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Selection State
  const [session1, setSession1] = useState<string | null>(null);
  const [session2, setSession2] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<'session1' | 'session2'>('session1');
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Fetch mentor info
  useEffect(() => {
    async function fetchMentor() {
      if (!mentorId) return;

      try {
        const { data, error } = await supabase
          .from('mentors')
          .select('session_price_inr, professional_title, profile:profiles(full_name)')
          .eq('id', mentorId)
          .single();

        if (error) throw error;
        
        setMentor({
          id: mentorId,
          name: data.profile?.full_name || 'Mentor',
          title: data.professional_title || 'Senior Interviewer',
          price: data.session_price_inr || 1000,
        });
      } catch (e) {
        console.error('Error fetching mentor:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMentor();
  }, [mentorId]);

  // Generate available slots
  useEffect(() => {
    if (mentorId) generateSlots();
  }, [selectedDate, mentorId]);

  const generateSlots = async () => {
    setLoadingSlots(true);
    
    try {
      const timeSlots = [
        '09:00', '10:00', '11:00', '14:00', '15:00', 
        '16:00', '17:00', '18:00', '19:00', '20:00'
      ];

      const dateStr = selectedDate.toISODate();
      if (!dateStr) return;

      const startOfDay = DateTime.fromISO(dateStr, { zone: 'Asia/Kolkata' }).startOf('day').toISO();
      const endOfDay = DateTime.fromISO(dateStr, { zone: 'Asia/Kolkata' }).endOf('day').toISO();

      const { data: bookedSessions } = await supabase
        .from('interview_sessions')
        .select('scheduled_at')
        .eq('mentor_id', mentorId)
        .gte('scheduled_at', startOfDay)
        .lte('scheduled_at', endOfDay)
        .in('status', ['pending', 'confirmed']);

      const bookedTimes = new Set(
        (bookedSessions || []).map(s => {
          const dt = DateTime.fromISO(s.scheduled_at, { zone: 'Asia/Kolkata' });
          return dt.toFormat('HH:mm');
        })
      );

      const availableSlots: TimeSlot[] = timeSlots.map(time => ({
        time,
        isAvailable: !bookedTimes.has(time),
      }));

      setSlots(availableSlots);
    } catch (e) {
      console.error('Error generating slots:', e);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSlotPress = (time: string) => {
    if (activeField === 'session1') {
      if (session2 === time) setSession2(null);
      setSession1(time);
      setActiveField('session2');
    } else {
      if (session1 === time) setSession1(null);
      setSession2(time);
    }
  };

  // 🟢 🟢 🟢 UPDATED HANDLE PROCEED 🟢 🟢 🟢
  const handleProceed = async () => {
    console.log('🚀 BUTTON CLICKED - handleProceed called');
    console.log('📊 Current state:', { 
      session1, 
      session2, 
      userId: user?.id, 
      currentUserId,
      mentorId, 
      mentor 
    });

    if (!session1 || !session2) {
      console.log('❌ Validation failed: Missing time slots');
      Alert.alert("Select Slots", "Please select 2 time slots to proceed.");
      return;
    }

    // Try to get user ID from multiple sources
    let activeUserId = currentUserId || user?.id;
    
    // If still no user, try to get from Supabase session directly
    if (!activeUserId) {
      console.log('⚠️ No user ID found, fetching from Supabase session immediately...');
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        console.log('📱 FULL Session data:', data);
        console.log('📱 Session object:', data?.session);
        console.log('📱 User object:', data?.session?.user);
        console.log('📱 User ID:', data?.session?.user?.id);
        console.log('📱 Session error:', sessionError);
        
        if (data?.session?.user?.id) {
          activeUserId = data.session.user.id;
          console.log('✅ Got user ID from session:', activeUserId);
        } else {
          console.log('❌ No user in session - checking auth state...');
          const { data: { user: authUser } } = await supabase.auth.getUser();
          console.log('👤 getUser result:', authUser);
          if (authUser?.id) {
            activeUserId = authUser.id;
            console.log('✅ Got user ID from getUser:', activeUserId);
          }
        }
      } catch (err) {
        console.error('❌ Failed to get session:', err);
      }
    }
    
    if (!activeUserId || !mentorId || !mentor) {
      console.log('❌ Validation failed: Missing required data', { 
        hasActiveUserId: !!activeUserId,
        hasUser: !!user?.id,
        hasCurrentUserId: !!currentUserId,
        hasMentorId: !!mentorId, 
        hasMentor: !!mentor 
      });
      Alert.alert('Error', 'You must be logged in to book a session. Please sign in and try again.');
      return;
    }
    
    const dateStr = selectedDate.toISODate();
    console.log('📅 Selected date ISO:', dateStr);
    if (!dateStr) {
      console.log('❌ Failed to get date string');
      return;
    }

    console.log('✅ All validations passed, starting booking process...');
    setBookingInProgress(true);

    try {
      console.log('🔵 Step 1: Starting booking process...');
      console.log('🔍 Using user ID as candidate ID:', activeUserId);

      // In your schema, candidates.id IS the user_id (same UUID)
      // So we can use the user ID directly as the candidate ID
      const candidateId = activeUserId;

      // Optional: Verify the candidate record exists
      const { data: candidateExists, error: candidateError } = await supabase
        .from('candidates')
        .select('id')
        .eq('id', activeUserId)
        .single();

      console.log('📦 Candidate verification result:', { 
        exists: !!candidateExists, 
        candidateError 
      });

      if (candidateError || !candidateExists) {
        console.error('❌ Candidate record not found:', candidateError);
        throw new Error('Candidate profile not found. Please complete your profile first.');
      }

      console.log('✅ Candidate verified:', candidateId);

      // Construct ISO timestamps in IST
      console.log('🕐 Constructing timestamps...');
      const dt1 = DateTime.fromFormat(`${dateStr} ${session1}`, "yyyy-MM-dd HH:mm", { zone: 'Asia/Kolkata' });
      const dt2 = DateTime.fromFormat(`${dateStr} ${session2}`, "yyyy-MM-dd HH:mm", { zone: 'Asia/Kolkata' });
      const selectedSlots = [dt1.toISO(), dt2.toISO()].filter(Boolean) as string[];
      console.log('✅ Timestamps created:', selectedSlots);

      const totalPrice = mentor.price + 300; // mentor price + platform fee
      const targetProfile = mentor.title || 'Software Engineer';
      
      console.log('💰 Package details:', {
        candidateId: candidateId,
        mentorId,
        targetProfile,
        totalPrice,
        slots: selectedSlots
      });

      // 1. Create Package in Database (using candidate ID, not user ID)
      console.log('🔵 Step 2: Calling paymentService.createPackage...');
      const { package: pkg, error } = await paymentService.createPackage(
        candidateId, // ✅ Use candidate ID (which is the same as user ID in your schema)
        mentorId as string,
        targetProfile,
        totalPrice,
        selectedSlots
      );

      console.log('📦 createPackage response:', { pkg, error });

      if (error || !pkg) {
        console.error('❌ Failed to create package:', error);
        throw new Error(error?.message || 'Failed to create booking');
      }

      console.log('✅ Booking Package Created successfully!');
      console.log('📋 Package details:', { 
        id: pkg.id, 
        status: pkg.payment_status,
        razorpayId: pkg.razorpay_payment_id 
      });

      // 🟢 2. CHECK STATUS & REDIRECT CORRECTLY
      if (pkg.payment_status === 'pending_payment') {
        // ==> RAZORPAY FLOW
        console.log('🔵 Step 3: Redirecting to Payment Gateway...');
        console.log('🔗 Navigation params:', { 
          packageId: pkg.id, 
          amount: totalPrice,
          orderId: pkg.razorpay_payment_id 
        });
        router.replace({
            pathname: '/candidate/pgscreen',
            params: { 
                packageId: pkg.id, 
                amount: totalPrice,
                // Pass orderId if it exists, otherwise PGScreen will generate mock order
                orderId: pkg.razorpay_payment_id 
            }
        });
        console.log('✅ Navigation triggered');
      } else {
        // ==> AUTO-CONFIRM FLOW (MVP/Fallback)
        console.log('✅ Auto-confirm flow - showing success alert');
        Alert.alert(
          '🎉 Booking Confirmed!',
          'Your sessions are ready. Redirecting to My Bookings...',
          [{ text: 'OK', onPress: () => router.replace('/candidate/bookings') }],
          { cancelable: false }
        );
      }

    } catch (error: any) {
      console.error('❌❌❌ BOOKING ERROR CAUGHT ❌❌❌');
      console.error('Error type:', typeof error);
      console.error('Error object:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      Alert.alert(
        'Booking Failed', 
        error.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      console.log('🔄 Finally block - resetting bookingInProgress');
      setBookingInProgress(false);
    }
  };

  if (isLoading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  if (!mentor) return <View style={styles.loadingContainer}><AppText>Mentor not found</AppText></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Heading level={1} style={styles.pageTitle}>Select Times</Heading>
          <AppText style={styles.pageSubtitle}>
            Book with {mentor.name} • ₹{(mentor.price + 300).toLocaleString()} total
          </AppText>
          
          {/* DEBUG: Auth Test Button */}
          <TouchableOpacity 
            style={{ backgroundColor: '#EF4444', padding: 12, borderRadius: 8, marginTop: 12 }}
            onPress={async () => {
              console.log('🔍 MANUAL AUTH CHECK');
              const { data: { session }, error } = await supabase.auth.getSession();
              console.log('Session:', session);
              console.log('Error:', error);
              
              const { data: { user } } = await supabase.auth.getUser();
              console.log('User:', user);
              
              Alert.alert('Auth Status', `Session: ${session ? 'EXISTS' : 'NULL'}\nUser: ${user ? user.id : 'NULL'}`);
            }}
          >
            <AppText style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>
              🔐 TEST AUTH STATUS
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Selectors */}
        <View style={styles.selectorsRow}>
          <TouchableOpacity 
            style={[styles.selectorBox, activeField === 'session1' && styles.selectorBoxActive]}
            onPress={() => setActiveField('session1')}
            activeOpacity={0.9}
          >
            <AppText style={styles.selectorLabel}>SESSION 1 (IST)</AppText>
            <View style={styles.selectorValueRow}>
              <Ionicons name="time-outline" size={18} color={activeField === 'session1' ? theme.colors.primary : '#9CA3AF'} />
              <AppText style={[styles.selectorValue, !session1 && styles.placeholder]}>
                {session1 || "Select"}
              </AppText>
            </View>
          </TouchableOpacity>

          <Ionicons name="arrow-forward" size={20} color="#D1D5DB" style={{ marginTop: 14 }} />

          <TouchableOpacity 
            style={[styles.selectorBox, activeField === 'session2' && styles.selectorBoxActive]}
            onPress={() => setActiveField('session2')}
            activeOpacity={0.9}
          >
            <AppText style={styles.selectorLabel}>SESSION 2 (IST)</AppText>
            <View style={styles.selectorValueRow}>
              <Ionicons name="time-outline" size={18} color={activeField === 'session2' ? theme.colors.primary : '#9CA3AF'} />
              <AppText style={[styles.selectorValue, !session2 && styles.placeholder]}>
                {session2 || "Select"}
              </AppText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Calendar Navigation */}
        <View style={styles.calendarSection}>
          <View style={styles.dateNav}>
            <TouchableOpacity style={styles.navBtn} onPress={() => setSelectedDate(d => d.minus({ days: 1 }))}>
              <Ionicons name="chevron-back" size={20} color={theme.colors.text.main} />
            </TouchableOpacity>
            
            <View style={styles.dateDisplay}>
              <AppText style={styles.dateDay}>{selectedDate.toFormat('cccc')}</AppText>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <AppText style={styles.dateDate}>{selectedDate.toFormat('MMM d')}</AppText>
                <View style={styles.istBadge}><AppText style={styles.istText}>IST</AppText></View>
              </View>
            </View>

            <TouchableOpacity style={styles.navBtn} onPress={() => setSelectedDate(d => d.plus({ days: 1 }))}>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.main} />
            </TouchableOpacity>
          </View>

          {/* Slots Grid */}
          <View style={styles.slotsContainer}>
            {loadingSlots ? (
              <ActivityIndicator color={theme.colors.primary} style={{ margin: 20 }} />
            ) : slots.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="moon-outline" size={32} color={theme.colors.text.light} />
                <AppText style={styles.emptyText}>No slots available.</AppText>
              </View>
            ) : (
              <View style={styles.slotsGrid}>
                {slots.map((slot, idx) => {
                  const isSelected1 = session1 === slot.time;
                  const isSelected2 = session2 === slot.time;
                  const isDisabled = !slot.isAvailable || (activeField === 'session1' ? isSelected2 : isSelected1);

                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.7}
                      disabled={isDisabled}
                      onPress={() => handleSlotPress(slot.time)}
                      style={[
                        styles.slotBadge,
                        !slot.isAvailable && styles.slotDisabled,
                        ((activeField === 'session1' && isSelected1) || (activeField === 'session2' && isSelected2)) && styles.slotActiveSelect,
                        (isDisabled && slot.isAvailable) && styles.slotTaken
                      ]}
                    >
                      <AppText style={[
                        styles.slotText,
                        !slot.isAvailable && styles.slotTextDisabled,
                        ((activeField === 'session1' && isSelected1) || (activeField === 'session2' && isSelected2)) && styles.slotTextSelected,
                        (isDisabled && slot.isAvailable) && styles.slotTextTaken
                      ]}>
                        {slot.time}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
           <TouchableOpacity 
            style={[styles.proceedBtn, ((!session1 || !session2) || bookingInProgress) && styles.proceedBtnDisabled]}
            onPress={() => {
              console.log('🎯 BUTTON PHYSICALLY PRESSED');
              console.log('Button state:', { 
                session1, 
                session2, 
                bookingInProgress,
                disabled: !session1 || !session2 || bookingInProgress 
              });
              handleProceed();
            }}
            disabled={!session1 || !session2 || bookingInProgress}
          >
            {bookingInProgress ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <AppText style={styles.proceedBtnText}>Confirm Booking</AppText>
                <Ionicons name="checkmark-circle" size={18} color="#FFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f5f0" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 20 },
  pageTitle: { fontSize: 24, marginBottom: 4 },
  pageSubtitle: { fontSize: 15, color: theme.colors.text.body },
  selectorsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 8 },
  selectorBox: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.border },
  selectorBoxActive: { borderColor: theme.colors.primary, backgroundColor: '#F0FDFA', borderWidth: 2 },
  selectorLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.text.light, marginBottom: 6, letterSpacing: 0.5 },
  selectorValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  selectorValue: { fontSize: 15, fontWeight: '700', color: theme.colors.text.main },
  placeholder: { color: '#9CA3AF', fontWeight: '500' },
  calendarSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 2 },
  dateNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 8 },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  dateDisplay: { alignItems: 'center' },
  dateDay: { fontSize: 13, color: theme.colors.text.light, fontWeight: '600', textTransform: 'uppercase' },
  dateDate: { fontSize: 18, color: theme.colors.text.main, fontWeight: '700' },
  istBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 },
  istText: { fontSize: 10, color: '#059669', fontWeight: '800' },
  slotsContainer: { minHeight: 100, justifyContent: 'center' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotBadge: { flexGrow: 1, flexBasis: '30%', paddingVertical: 12, borderRadius: 10, backgroundColor: theme.colors.pricing.greenBg, borderWidth: 1, borderColor: theme.colors.pricing.greenText, alignItems: 'center', position: 'relative' },
  slotActiveSelect: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  slotDisabled: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', opacity: 0.5 },
  slotTaken: { opacity: 0.5, borderColor: theme.colors.text.main },
  slotText: { color: theme.colors.pricing.greenText, fontWeight: '600', fontSize: 14 },
  slotTextSelected: { color: '#FFFFFF' },
  slotTextDisabled: { color: '#9CA3AF', textDecorationLine: 'line-through' },
  slotTextTaken: { color: theme.colors.text.main },
  emptyState: { alignItems: 'center', padding: 20 },
  emptyText: { marginTop: 8, color: theme.colors.text.light, fontSize: 14 },
  footerContainer: { marginTop: 24 },
  proceedBtn: { flexDirection: 'row', backgroundColor: theme.colors.text.main, paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  proceedBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  proceedBtnText: { color: "#FFF", fontSize: 16, fontWeight: '700' },
});