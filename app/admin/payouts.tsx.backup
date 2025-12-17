// app/admin/payouts.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, ActivityIndicator, RefreshControl, StatusBar, Platform 
} from 'react-native';
import { supabase } from '@/lib/supabase/client';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function AdminPayouts() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalEscrow: 0,
    readyToRelease: 0,
    count: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await fetchEscrowPackages();
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEscrowPackages();
    setRefreshing(false);
  }, []);

  const fetchEscrowPackages = async () => {
    console.log("🔄 Fetching escrow packages...");
    
    const { data, error } = await supabase
      .from('interview_packages')
      .select(`
        id, total_amount_inr, mentor_payout_inr, platform_fee_inr,
        payment_status, razorpay_payment_id, created_at, booking_metadata,
        candidate:candidates!candidate_id (
            id, profile:profiles!id ( full_name, email )
        ),
        mentor:mentors!mentor_id (
            id, profile:profiles!id ( full_name )
        ),
        profile:interview_profiles_admin!fk_interview_profile (
            name
        ),
        session:interview_sessions!package_id (
            id, scheduled_at, status, 
            skill:interview_skills_admin!skill_id ( name )
        )
      `)
      .eq('payment_status', 'held_in_escrow')
      .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Fetch Error:', error);
        if (Platform.OS === 'web') {
            window.alert("Error: Could not load escrow data.");
        } else {
            Alert.alert("Error", "Could not load escrow data.");
        }
    } else {
        const validData = data || [];
        console.log(`✅ Found ${validData.length} packages in escrow`);

        setPayments(validData);

        // Stats Calculation
        const totalHeld = validData.reduce((sum, item) => sum + (item.total_amount_inr || 0), 0);
        
        const readyCount = validData.filter(item => {
            const status = item.session?.[0]?.status || '';
            return status.trim().toLowerCase() === 'completed'; 
        }).length;
        
        setStats({
          totalEscrow: totalHeld,
          readyToRelease: readyCount,
          count: validData.length
        });
    }
  };

  const releasePayment = async (pkg: any) => {
    // 1. Define the release logic function
    const executeRelease = async () => {
        setProcessing(pkg.id);
        try {
            console.log("🚀 executing release for:", pkg.id);
            const { error: pkgError } = await supabase
                .from('interview_packages')
                .update({ 
                    payment_status: 'completed',
                    updated_at: new Date().toISOString()
                })
                .eq('id', pkg.id);

            if (pkgError) throw pkgError;

            const successMsg = "Funds released successfully!";
            if (Platform.OS === 'web') {
                window.alert(successMsg);
            } else {
                Alert.alert("Success", successMsg);
            }
            
            fetchEscrowPackages();
        } catch (e: any) {
            console.error('Release Error:', e);
            const errorMsg = e.message || "Unknown error occurred";
            if (Platform.OS === 'web') {
                window.alert("Error: " + errorMsg);
            } else {
                Alert.alert("Error", errorMsg);
            }
        } finally {
            setProcessing(null);
        }
    };

    // 2. Prepare Confirmation Message
    const confirmMessage = `Are you sure you want to release ₹${pkg.mentor_payout_inr} to the mentor?\n\nPlatform Fee Earned: ₹${pkg.platform_fee_inr}`;

    // 3. Handle Platform Specific Confirmation
    if (Platform.OS === 'web') {
        // WEB: Use native window.confirm
        const confirmed = window.confirm(confirmMessage);
        if (confirmed) {
            executeRelease();
        }
    } else {
        // MOBILE: Use Native Alert with callbacks
        Alert.alert(
            "Confirm Payout Release",
            confirmMessage,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Release Funds",
                    style: "default",
                    onPress: executeRelease
                }
            ]
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0E9384" />
        <Text style={styles.loadingText}>Loading Escrow Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
      {/* 1. Dashboard Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total in Escrow</Text>
          <Text style={styles.statValue}>{formatCurrency(stats.totalEscrow)}</Text>
        </View>
        <View style={[styles.statCard, { borderLeftWidth: 1, borderLeftColor: '#e5e7eb' }]}>
          <Text style={styles.statLabel}>Ready to Release</Text>
          <Text style={[styles.statValue, { color: stats.readyToRelease > 0 ? '#059669' : '#6b7280' }]}>
            {stats.readyToRelease} <Text style={styles.statSub}>/ {stats.count}</Text>
          </Text>
        </View>
      </View>

      {/* 2. Bookings List */}
      <ScrollView 
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0E9384']} />}
      >
        <Text style={styles.sectionTitle}>Active Transactions</Text>

        {payments.length === 0 ? (
            <View style={styles.emptyState}>
                <Ionicons name="shield-checkmark-outline" size={64} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Funds in Escrow</Text>
                <Text style={styles.emptySub}>All payments have been processed or released.</Text>
            </View>
        ) : (
            payments.map((pkg) => {
                const session = pkg.session?.[0];
                
                // DEBUGGING LOGIC: Handle missing sessions explicitly
                let rawStatus = 'NO SESSION';
                let isCompleted = false;

                if (session) {
                    rawStatus = session.status || 'NULL';
                    // Trim whitespace before check
                    isCompleted = rawStatus.trim().toLowerCase() === 'completed';
                }
                
                // Allow release if completed
                const isReadyToRelease = isCompleted;
                
                const skillName = session?.skill?.name || 'Interview Session';
                const scheduledDate = session?.scheduled_at || pkg.booking_metadata?.scheduled_at;

                return (
                    <View key={pkg.id} style={styles.card}>
                        {/* Status Bar */}
                        <View style={styles.cardStatusBar}>
                            <View style={styles.statusBadge}>
                                <Ionicons name="lock-closed" size={12} color="#B45309" />
                                <Text style={styles.statusText}>HELD IN ESCROW</Text>
                            </View>
                            
                            {/* STATUS BADGE - Shows exactly what is in DB */}
                            <View style={[
                                styles.sessionBadge, 
                                isCompleted ? styles.badgeSuccess : styles.badgePending
                            ]}>
                                <Text style={[
                                    styles.sessionText, 
                                    isCompleted ? styles.textSuccess : styles.textPending
                                ]}>
                                    {rawStatus.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        {/* Main Content */}
                        <View style={styles.cardBody}>
                            <View style={styles.rowBetween}>
                                <View>
                                    <Text style={styles.amount}>{formatCurrency(pkg.total_amount_inr)}</Text>
                                    <Text style={styles.dateLabel}>{formatDate(scheduledDate)}</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <MaterialIcons name="payments" size={24} color="#0E9384" />
                                </View>
                            </View>

                            <View style={styles.peopleContainer}>
                                <View style={styles.personRow}>
                                    <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>C</Text></View>
                                    <View>
                                        <Text style={styles.personLabel}>Candidate</Text>
                                        <Text style={styles.personName}>{pkg.candidate?.profile?.full_name || 'Unknown'}</Text>
                                    </View>
                                </View>
                                <View style={styles.dividerVertical} />
                                <View style={styles.personRow}>
                                    <View style={[styles.avatarPlaceholder, { backgroundColor: '#E0F2FE' }]}><Text style={[styles.avatarText, { color: '#0284C7' }]}>M</Text></View>
                                    <View>
                                        <Text style={styles.personLabel}>Mentor</Text>
                                        <Text style={styles.personName}>{pkg.mentor?.profile?.full_name || 'Unknown'}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.skillRow}>
                                <FontAwesome5 name="chalkboard-teacher" size={14} color="#64748b" />
                                <Text style={styles.skillText}>
                                    {pkg.profile?.name} • {skillName}
                                </Text>
                            </View>
                        </View>

                        {/* Action Footer */}
                        <View style={styles.cardFooter}>
                            <View style={styles.feeInfo}>
                                <Text style={styles.feeLabel}>Platform Fee</Text>
                                <Text style={styles.feeValue}>{formatCurrency(pkg.platform_fee_inr)}</Text>
                            </View>

                            <TouchableOpacity 
                                style={[
                                    styles.actionBtn, 
                                    isReadyToRelease ? styles.btnActive : styles.btnDisabled,
                                    processing === pkg.id && styles.btnProcessing
                                ]}
                                disabled={!isReadyToRelease || processing === pkg.id}
                                onPress={() => releasePayment(pkg)}
                            >
                                {processing === pkg.id ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <Text style={styles.btnText}>
                                            {isReadyToRelease ? "Release Payout" : `Wait: ${rawStatus}`}
                                        </Text>
                                        {isReadyToRelease && <Ionicons name="arrow-forward" size={16} color="#fff" />}
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 16 },

  // Stats Header
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statCard: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: 12, textTransform: 'uppercase', color: '#6b7280', letterSpacing: 0.5, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#111827' },
  statSub: { fontSize: 16, color: '#9ca3af', fontWeight: '500' },

  // List
  listContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f293b', marginBottom: 16, marginLeft: 4 },

  // Card Design
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden'
  },
  cardStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 4
  },
  statusText: { fontSize: 10, fontWeight: '700', color: '#B45309' },
  sessionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePending: { backgroundColor: '#F1F5F9' },
  badgeSuccess: { backgroundColor: '#DCFCE7' },
  sessionText: { fontSize: 11, fontWeight: '700' },
  textPending: { color: '#64748b' },
  textSuccess: { color: '#166534' },

  // Card Body
  cardBody: { padding: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  amount: { fontSize: 28, fontWeight: '800', color: '#1f293b' },
  dateLabel: { fontSize: 14, color: '#64748b', marginTop: 2 },
  iconContainer: { backgroundColor: '#F0FDFA', padding: 10, borderRadius: 12 },
  
  peopleContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F8FAFC', 
    padding: 12, 
    borderRadius: 12,
    marginBottom: 16 
  },
  personRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerVertical: { width: 1, backgroundColor: '#E2E8F0', marginHorizontal: 8 },
  avatarPlaceholder: { 
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#FEF3C7', 
    alignItems: 'center', justifyContent: 'center' 
  },
  avatarText: { fontWeight: '700', color: '#B45309', fontSize: 14 },
  personLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' },
  personName: { fontSize: 13, fontWeight: '700', color: '#334155' },

  skillRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  skillText: { fontSize: 13, color: '#475569', fontWeight: '500' },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff'
  },
  feeInfo: { flexDirection: 'column' },
  feeLabel: { fontSize: 11, color: '#94a3b8' },
  feeValue: { fontSize: 14, fontWeight: '700', color: '#0E9384' },

  actionBtn: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  btnActive: { backgroundColor: '#0E9384', shadowColor: '#0E9384', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  btnDisabled: { backgroundColor: '#E2E8F0' },
  btnProcessing: { opacity: 0.8 },
  btnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Empty State
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#334155', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#94a3b8', marginTop: 4 }
});