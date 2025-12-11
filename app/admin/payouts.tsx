// app/admin/payouts.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase/client';
import { Ionicons } from '@expo/vector-icons';

export default function AdminPayouts() {
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    setLoading(true);
    
    // ✅ FIXED: Profile is now fetched inside 'package' to resolve relationship error
    const { data, error } = await supabase
      .from('interview_sessions')
      .select(`
        id, scheduled_at, created_at,
        candidate:candidates!candidate_id (
            id, profile:profiles!id ( full_name, email )
        ),
        mentor:mentors!mentor_id (
            id, profile:profiles!id ( full_name )
        ),
        package:interview_packages!package_id!inner (
            id, total_amount_inr, mentor_payout_inr, platform_fee_inr,
            payment_status, payment_method, razorpay_payment_id,
            profile:interview_profiles_admin!interview_profile_id (
                name
            )
        ),
        skill:interview_skills_admin!skill_id (
            name
        )
      `)
      .eq('package.payment_status', 'held_in_escrow')
      .order('created_at', { ascending: false });

    if (error) {
        console.error('Fetch Error:', error);
        Alert.alert("Error", "Could not fetch pending payments");
    } else {
        // Filter out any null packages to be safe
        const validData = data?.filter((item: any) => item.package) || [];
        setPendingPayments(validData);
    }
    setLoading(false);
  };

  const verifyAndRelease = async (sessionId: string, packageId: string, amount: number) => {
    Alert.alert(
      "Verify Payment",
      `Verify that ₹${amount} has been received from the candidate?\n\nThis will release the booking to the mentor for approval.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Verify & Release",
          style: "default",
          onPress: async () => {
            setProcessing(sessionId);
            try {
              // Update package payment status to 'confirmed'
              const { error: pkgError } = await supabase
                .from('interview_packages')
                .update({ 
                  payment_status: 'confirmed',
                  updated_at: new Date().toISOString()
                })
                .eq('id', packageId);

              if (pkgError) throw pkgError;

              // Update session status to 'pending' (awaiting mentor approval)
              const { error: sessionError } = await supabase
                .from('interview_sessions')
                .update({ 
                  status: 'pending',
                  updated_at: new Date().toISOString()
                })
                .eq('id', sessionId);

              if (sessionError) throw sessionError;

              Alert.alert("Success", "Payment verified! Booking released to mentor for approval.");
              fetchPendingPayments();
            } catch (e: any) {
              console.error('Release Error:', e);
              Alert.alert("Error", e.message || "Could not process payment verification");
            } finally {
              setProcessing(null);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading pending payments...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.headerTitle}>Payment Verification</Text>
          <Text style={styles.subHeader}>
            Bookings awaiting payment confirmation • Held in Escrow
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{pendingPayments.length}</Text>
        </View>
      </View>

      {pendingPayments.length === 0 ? (
        <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle" size={64} color="#10B981" />
            <Text style={styles.emptyText}>All Verified!</Text>
            <Text style={styles.emptySub}>No pending payment verifications.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {pendingPayments.map((item) => {
            const pkg = item.package;
            const isProcessing = processing === item.id;
            // ✅ FIXED: Access profile name from nested package object
            const profileName = pkg?.profile?.name || 'Interview';
            
            return (
              <View key={item.id} style={styles.card}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.profileRow}>
                      <Text style={styles.profileLabel}>Candidate:</Text>
                      <Text style={styles.profileName}>
                        {item.candidate?.profile?.full_name || 'Unknown'}
                      </Text>
                    </View>
                    <View style={styles.profileRow}>
                      <Text style={styles.profileLabel}>Mentor:</Text>
                      <Text style={styles.mentorName}>
                        {item.mentor?.profile?.full_name || 'Unassigned'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.amountBadge}>
                    <Text style={styles.amountText}>₹{pkg.total_amount_inr}</Text>
                  </View>
                </View>

                {/* Session Details */}
                <View style={styles.detailsBox}>
                  <View style={styles.detailRow}>
                    <Ionicons name="briefcase-outline" size={16} color="#64748b" />
                    <Text style={styles.detailText}>
                      {profileName} • {item.skill?.name || 'Session'}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#64748b" />
                    <Text style={styles.detailText}>
                      {formatDate(item.scheduled_at)} at {formatTime(item.scheduled_at)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="card-outline" size={16} color="#64748b" />
                    <Text style={styles.detailText}>
                      {pkg.payment_method || 'Razorpay'} • {pkg.razorpay_payment_id || 'N/A'}
                    </Text>
                  </View>
                </View>

                {/* Payment Breakdown */}
                <View style={styles.breakdownBox}>
                  <Text style={styles.breakdownTitle}>PAYMENT BREAKDOWN</Text>
                  
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Total Amount</Text>
                    <Text style={styles.breakdownValue}>₹{pkg.total_amount_inr}</Text>
                  </View>
                  
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Mentor Payout</Text>
                    <Text style={styles.breakdownValue}>₹{pkg.mentor_payout_inr}</Text>
                  </View>
                  
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Platform Fee</Text>
                    <Text style={styles.breakdownValuePrimary}>₹{pkg.platform_fee_inr}</Text>
                  </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity 
                    style={[styles.verifyBtn, isProcessing && styles.verifyBtnDisabled]} 
                    onPress={() => verifyAndRelease(item.id, pkg.id, pkg.total_amount_inr)}
                    disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text style={styles.verifyBtnText}>Verify & Release to Mentor</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Timestamp */}
                <Text style={styles.timestamp}>
                  Booked {formatDate(item.created_at)} at {formatTime(item.created_at)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f9fafb'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b'
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1e293b',
    marginBottom: 4
  },
  subHeader: { 
    fontSize: 14, 
    color: '#64748b',
    lineHeight: 20
  },
  countBadge: {
    backgroundColor: '#2563eb',
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  countText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800'
  },
  list: { 
    gap: 16, 
    paddingBottom: 40 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, 
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16, 
    alignItems: 'flex-start'
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6
  },
  profileLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    minWidth: 75
  },
  profileName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1e293b'
  },
  mentorName: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#475569'
  },
  amountBadge: { 
    backgroundColor: '#FEF3C7', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE047'
  },
  amountText: { 
    color: '#B45309', 
    fontWeight: '800', 
    fontSize: 18 
  },
  detailsBox: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500'
  },
  breakdownBox: { 
    backgroundColor: '#f0f9ff', 
    padding: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#BAE6FD', 
    marginBottom: 16 
  },
  breakdownTitle: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: '#0369a1', 
    marginBottom: 10, 
    letterSpacing: 0.5 
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500'
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155'
  },
  breakdownValuePrimary: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563eb'
  },
  verifyBtn: { 
    backgroundColor: '#10B981', 
    padding: 14, 
    borderRadius: 12, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  verifyBtnDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0
  },
  verifyBtnText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 15
  },
  timestamp: {
    marginTop: 12,
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center'
  },
  emptyState: { 
    alignItems: 'center', 
    marginTop: 80,
    paddingHorizontal: 40
  },
  emptyText: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginTop: 16 
  },
  emptySub: { 
    color: '#64748b',
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center'
  }
});