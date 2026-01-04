// app/mentor/mentorship.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
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
  profile_ids: number[];
  total_sessions?: number;
  expertise_profiles?: string[];
  rating?: number;
  [key: string]: any;
};

type BannerState = { type: 'success' | 'error'; message: string } | null;


// 🎓 CERTIFICATE TEMPLATE GENERATOR
function generateCertificateHTML(data: {
  mentorName: string;
  tier: 'silver' | 'gold';
}): string {
  const tierLabel = data.tier === 'gold' ? 'Gold' : 'Silver';
  
  // Silver Certificate Template
  if (data.tier === 'silver') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Silver Mentor Certificate - CrackJobs</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 297mm; height: 210mm; background: #f8f5f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      display: flex; align-items: center; justify-content: center;
      padding: 0; margin: 0;
    }
    .certificate {
      width: 1050px; height: 740px;
      border: 6px solid #18a7a7; padding: 12px;
      position: relative; background: #f8f5f0;
      box-shadow: inset 0 0 60px rgba(24, 167, 167, 0.05);
    }
    .inner-border {
      width: 100%; height: 100%;
      border: 2px solid #18a7a7; padding: 35px 40px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    .logo-section { margin-bottom: 18px; }
    .logo {
      font-size: 38px; font-weight: 900;
      color: #000; line-height: 1;
      text-align: center; letter-spacing: -1px;
    }
    .logo-jobs { color: #18a7a7; }
    .divider {
      width: 320px; height: 2px;
      background: linear-gradient(90deg, transparent, #18a7a7, transparent);
      margin: 16px 0;
    }
    .title {
      font-size: 36px; font-weight: 900;
      color: #f58742; margin-bottom: 6px;
      letter-spacing: 3px; text-transform: uppercase;
    }
    .subtitle {
      font-size: 18px; color: #555;
      margin-bottom: 25px; font-weight: 300;
      letter-spacing: 2px;
    }
    .medal-container { margin-bottom: 25px; }
    .medal {
      width: 90px; height: 90px; border-radius: 50%;
      background: linear-gradient(135deg, #e5e7eb 0%, #c0c0c0 50%, #9ca3af 100%);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
      position: relative;
    }
    .medal::before {
      content: ''; position: absolute;
      width: 76px; height: 76px;
      border-radius: 50%; background: white;
    }
    .medal-icon {
      font-size: 50px; position: relative; z-index: 1;
      filter: grayscale(100%) brightness(0.95);
    }
    .presented-to {
      font-size: 16px; color: #555;
      margin-bottom: 16px; font-weight: 400;
    }
    .mentor-name {
      font-size: 48px; font-weight: 900;
      color: #18a7a7; margin-bottom: 12px;
    }
    .name-underline {
      width: 400px; height: 2px;
      background: #333; margin-bottom: 24px;
    }
    .achievement-text {
      font-size: 17px; color: #333;
      text-align: center; line-height: 1.5;
      margin-bottom: 35px; max-width: 600px;
    }
    .achievement-highlight {
      color: #f58742; font-weight: 700;
    }
    .signature-section {
      margin-top: 20px; text-align: center;
    }
    .signature {
      font-size: 26px; font-style: italic;
      color: #333; margin-bottom: 6px;
      font-family: 'Brush Script MT', cursive;
    }
    .signature-line {
      width: 180px; height: 1px;
      background: #333; margin: 8px auto;
    }
    .signature-name {
      font-size: 15px; color: #333;
      margin-bottom: 3px; font-weight: 600;
    }
    .signature-title {
      font-size: 13px; color: #666; font-weight: 400;
    }
    .corner {
      position: absolute; width: 35px; height: 35px;
      border: 3px solid #18a7a7;
    }
    .corner-tl {
      top: 8px; left: 8px;
      border-right: none; border-bottom: none;
    }
    .corner-tr {
      top: 8px; right: 8px;
      border-left: none; border-bottom: none;
    }
    .corner-bl {
      bottom: 8px; left: 8px;
      border-right: none; border-top: none;
    }
    .corner-br {
      bottom: 8px; right: 8px;
      border-left: none; border-top: none;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="inner-border">
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>
      <div class="logo-section">
        <div class="logo">Crack<span class="logo-jobs">Jobs</span></div>
      </div>
      <div class="divider"></div>
      <div class="title">Certificate</div>
      <div class="subtitle">OF ACHIEVEMENT</div>
      <div class="medal-container">
        <div class="medal">
          <div class="medal-icon">🏆</div>
        </div>
      </div>
      <div class="presented-to">This certificate is presented to</div>
      <div class="mentor-name">${data.mentorName}</div>
      <div class="name-underline"></div>
      <div class="achievement-text">
        For achieving <span class="achievement-highlight">${tierLabel} Mentor</span> status on CrackJobs<br>
        and helping candidates crack their interviews<br>
        at top companies
      </div>
      <div class="signature-section">
        <div class="signature">Manan Vashist</div>
        <div class="signature-line"></div>
        <div class="signature-name">Manan Vashist</div>
        <div class="signature-title">Founder, CrackJobs</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }
  
  // Gold Certificate Template
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gold Mentor Certificate - CrackJobs</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 297mm; height: 210mm; background: #f8f5f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      display: flex; align-items: center; justify-content: center;
      padding: 0; margin: 0;
    }
    .certificate {
      width: 1050px; height: 740px;
      border: 6px solid #d97706; padding: 12px;
      position: relative; background: #f8f5f0;
      box-shadow: inset 0 0 60px rgba(217, 119, 6, 0.05);
    }
    .inner-border {
      width: 100%; height: 100%;
      border: 2px solid #f59e0b; padding: 35px 40px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    .logo-section { margin-bottom: 18px; }
    .logo {
      font-size: 38px; font-weight: 900;
      color: #000; line-height: 1;
      text-align: center; letter-spacing: -1px;
    }
    .logo-jobs { color: #18a7a7; }
    .divider {
      width: 320px; height: 2px;
      background: linear-gradient(90deg, transparent, #d97706, transparent);
      margin: 16px 0;
    }
    .title {
      font-size: 36px; font-weight: 900;
      color: #f58742; margin-bottom: 6px;
      letter-spacing: 3px; text-transform: uppercase;
    }
    .subtitle {
      font-size: 18px; color: #555;
      margin-bottom: 25px; font-weight: 300;
      letter-spacing: 2px;
    }
    .medal-container { margin-bottom: 25px; }
    .medal {
      width: 90px; height: 90px; border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 12px rgba(217, 119, 6, 0.3);
      position: relative;
    }
    .medal::before {
      content: ''; position: absolute;
      width: 76px; height: 76px;
      border-radius: 50%; background: white;
    }
    .medal-icon {
      font-size: 50px; position: relative; z-index: 1;
    }
    .presented-to {
      font-size: 16px; color: #555;
      margin-bottom: 16px; font-weight: 400;
    }
    .mentor-name {
      font-size: 48px; font-weight: 900;
      color: #d97706; margin-bottom: 12px;
    }
    .name-underline {
      width: 400px; height: 2px;
      background: #333; margin-bottom: 24px;
    }
    .achievement-text {
      font-size: 17px; color: #333;
      text-align: center; line-height: 1.5;
      margin-bottom: 35px; max-width: 600px;
    }
    .achievement-highlight {
      color: #f58742; font-weight: 700;
    }
    .signature-section {
      margin-top: 20px; text-align: center;
    }
    .signature {
      font-size: 26px; font-style: italic;
      color: #333; margin-bottom: 6px;
      font-family: 'Brush Script MT', cursive;
    }
    .signature-line {
      width: 180px; height: 1px;
      background: #333; margin: 8px auto;
    }
    .signature-name {
      font-size: 15px; color: #333;
      margin-bottom: 3px; font-weight: 600;
    }
    .signature-title {
      font-size: 13px; color: #666; font-weight: 400;
    }
    .corner {
      position: absolute; width: 35px; height: 35px;
      border: 3px solid #d97706;
    }
    .corner-tl {
      top: 8px; left: 8px;
      border-right: none; border-bottom: none;
    }
    .corner-tr {
      top: 8px; right: 8px;
      border-left: none; border-bottom: none;
    }
    .corner-bl {
      bottom: 8px; left: 8px;
      border-right: none; border-top: none;
    }
    .corner-br {
      bottom: 8px; right: 8px;
      border-left: none; border-top: none;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="inner-border">
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>
      <div class="logo-section">
        <div class="logo">Crack<span class="logo-jobs">Jobs</span></div>
      </div>
      <div class="divider"></div>
      <div class="title">Certificate</div>
      <div class="subtitle">OF ACHIEVEMENT</div>
      <div class="medal-container">
        <div class="medal">
          <div class="medal-icon">🏆</div>
        </div>
      </div>
      <div class="presented-to">This certificate is presented to</div>
      <div class="mentor-name">${data.mentorName}</div>
      <div class="name-underline"></div>
      <div class="achievement-text">
        For achieving <span class="achievement-highlight">${tierLabel} Mentor</span> status on CrackJobs<br>
        and helping candidates crack their interviews<br>
        at top companies
      </div>
      <div class="signature-section">
        <div class="signature">Manan Vashist</div>
        <div class="signature-line"></div>
        <div class="signature-name">Manan Vashist</div>
        <div class="signature-title">Founder, CrackJobs</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}


export default function MentorshipScreen() {
  const { profile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<MentorRow | null>(null);
  const [banner, setBanner] = useState<BannerState>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);

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

  const handleDownloadCertificate = async (tier: 'silver' | 'gold') => {
    if (!profile?.id || !mentor) return;

    try {
      setDownloadingCert(true);


      // Prepare certificate data
      const certData = {
        mentorName: profile.full_name || 'Mentor',
        tier,
      };

      if (Platform.OS === 'web') {
        // Generate HTML certificate
        const html = generateCertificateHTML(certData);
        
        // Open in new window and trigger print dialog
        const printWindow = window.open('', '', 'width=1122,height=793');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          
          // Wait for content to load, then open print dialog
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }

        setBanner({
          type: 'success',
          message: 'Certificate opened! Use "Save as PDF" in the print dialog.',
        });
      } else {
        // Mobile: Direct to web version
        Alert.alert(
          'Certificate Available',
          'Please visit the web version of CrackJobs to download your certificate.',
          [
            { text: 'OK', style: 'default' },
            {
              text: 'Email Me',
              onPress: () => {
                const mailUrl = `mailto:${SUPPORT_EMAIL}?subject=Send My ${tier} Mentor Certificate&body=Please send my ${tier} mentor certificate to this email.`;
                Linking.openURL(mailUrl);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('[certificate] Error:', error);
      setBanner({
        type: 'error',
        message: 'Failed to generate certificate. Please try again.',
      });
    } finally {
      setDownloadingCert(false);
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

  // Tier Logic
  const totalSessions = mentor?.total_sessions || 0;
  
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
                <AppText style={styles.tierLabel}>Your Current Status</AppText>
                <AppText style={styles.tierName}>
                  {currentTier === 'gold' ? 'Gold Mentor' :
                   currentTier === 'silver' ? 'Silver Mentor' :
                   currentTier === 'bronze' ? 'Bronze Mentor' : 'New Mentor'}
                </AppText>
              </View>
            </View>

            {currentTier !== 'gold' && (
              <View style={styles.tierProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: theme.colors.primary,
                        width: `${(totalSessions / target) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.progressInfo}>
                  <AppText style={styles.progressText}>
                    {totalSessions} / {target} sessions
                  </AppText>
                  <AppText style={styles.progressText}>
                    {target - totalSessions} more to {nextTier}
                  </AppText>
                </View>
              </View>
            )}
          </Card>
        </Section>

        {/* Progression Path */}
        <Section>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="trending-up" size={20} color={theme.colors.primary} />
              <AppText style={styles.cardTitle}>Your Journey</AppText>
            </View>
            <AppText style={styles.cardDescription}>
              Complete sessions to unlock exclusive benefits and recognition.
            </AppText>

            {/* Bronze Level */}
            <View style={[styles.levelCard, currentTier === 'bronze' && styles.levelCardActive]}>
              <View style={styles.levelHeader}>
                <View style={[styles.levelIcon, { backgroundColor: '#FEF3E7' }]}>
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
                Welcome to the mentorship community!
              </AppText>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Trust Badge on your CrackJobs profile</AppText>
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
                  <AppText style={styles.benefitText}>Silver badge on profile</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Downloadable certificate</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Appreciation post on our socials</AppText>
                </View>
              </View>

              {currentTier === 'silver' && (
                <>
                  {/* Certificate Download Button */}
                  <TouchableOpacity 
                    style={[styles.certificateBtn, downloadingCert && styles.certificateBtnDisabled]}
                    onPress={() => handleDownloadCertificate('silver')}
                    disabled={downloadingCert}
                  >
                    <Ionicons 
                      name={downloadingCert ? "hourglass-outline" : "document-text"} 
                      size={16} 
                      color="#FFF" 
                    />
                    <AppText style={styles.certificateBtnText}>
                      {downloadingCert ? 'Generating...' : 'Download Silver Certificate'}
                    </AppText>
                  </TouchableOpacity>

                  <AppText style={styles.certHelpText}>
                    Add to LinkedIn Licenses & Certifications or Featured section
                  </AppText>

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
                </>
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
                  <AppText style={styles.benefitText}>Gold badge on profile</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Priority profile placement</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Downloadable certificate</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#047857" />
                  <AppText style={styles.benefitText}>Exclusive networking opportunities</AppText>
                </View>
              </View>

              {currentTier === 'gold' && (
                <>
                  {/* Certificate Download Button */}
                  <TouchableOpacity 
                    style={[styles.certificateBtn, downloadingCert && styles.certificateBtnDisabled]}
                    onPress={() => handleDownloadCertificate('gold')}
                    disabled={downloadingCert}
                  >
                    <Ionicons 
                      name={downloadingCert ? "hourglass-outline" : "document-text"} 
                      size={16} 
                      color="#FFF" 
                    />
                    <AppText style={styles.certificateBtnText}>
                      {downloadingCert ? 'Generating...' : 'Download Gold Certificate'}
                    </AppText>
                  </TouchableOpacity>

                  <AppText style={styles.certHelpText}>
                    Add to LinkedIn Licenses & Certifications or Featured section
                  </AppText>

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

                  <View style={styles.levelFooter}>
                    <Ionicons name="sparkles-outline" size={14} color="#D97706" />
                    <AppText style={styles.levelFooterText}>
                      You've reached the highest mentor level! Keep up the amazing work.
                    </AppText>
                  </View>
                </>
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
  
  // Certificate Button Styles
  certificateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  certificateBtnDisabled: {
    opacity: 0.6,
  },
  certificateBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  certHelpText: {
    fontSize: 11,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
});