// app/contact.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

const SUPPORT_EMAIL = 'crackjobshelpdesk@gmail.com';

// SVG Icons
const MailIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Email">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpCircleIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Help">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="17" r="0.5" fill={color} stroke={color} strokeWidth="1" />
  </Svg>
);

const UsersIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Users">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CreditCardIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Payment">
    <Rect x="1" y="4" width="22" height="16" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M1 10h22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ToolIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Technical">
    <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BriefcaseIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Business">
    <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Clock">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CheckIcon = ({ size = 18, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Check">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M7 12l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export default function Contact() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const handleEmailPress = (subject?: string) => {
    const emailUrl = subject 
      ? `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`
      : `mailto:${SUPPORT_EMAIL}`;
    Linking.openURL(emailUrl);
  };

  return (
    <>
      <Head>
        <title>Contact Us | Get Help with Your Interview Preparation - CrackJobs</title>
        <meta name="description" content="Contact CrackJobs support team for help with booking mock interviews, payment issues, technical support, or partnership inquiries. Email us at crackjobshelpdesk@gmail.com. Response within 24-48 hours." />
        <meta name="keywords" content="contact crackjobs, support, help, customer service, mock interview support, technical help, payment issues, booking help" />
        <link rel="canonical" href="https://crackjobs.com/contact" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/contact" />
        <meta property="og:title" content="Contact Us | Get Help with Your Interview Preparation - CrackJobs" />
        <meta property="og:description" content="Contact CrackJobs support for help with bookings, payments, or technical issues. We respond within 24-48 hours." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://crackjobs.com/contact" />
        <meta property="twitter:title" content="Contact Us | Get Help with Your Interview Preparation - CrackJobs" />
        <meta property="twitter:description" content="Contact CrackJobs support for help with bookings, payments, or technical issues." />
        <meta property="twitter:image" content="https://crackjobs.com/og-image.png" />
      </Head>

      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          
          {/* Header */}
          <View>
          <Header/>
          </View>

          {/* Hero */}
          <View style={[styles.hero, isSmall && styles.heroMobile]}>
            <View style={styles.badge}><Text style={styles.badgeText}>CONTACT US</Text></View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
              We're Here to Help
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              Have questions about mock interviews, booking sessions, or platform features? Our support team is ready to assist you.
            </Text>
          </View>

          {/* Main Contact */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <View style={styles.mainContactCard}>
              <MailIcon size={56} color={CTA_TEAL} />
              <Text style={styles.mainContactTitle}>Email Support</Text>
              <Text style={styles.mainContactDesc}>
                For all inquiries, questions, and support requests, reach us at:
              </Text>
              <TouchableOpacity 
                style={styles.emailButton}
                onPress={() => handleEmailPress()}
              >
                <Text style={styles.emailButtonText}>{SUPPORT_EMAIL}</Text>
              </TouchableOpacity>
              <View style={styles.responseTime}>
                <ClockIcon size={20} color={BRAND_ORANGE} />
                <Text style={styles.responseTimeText}>Response within 24-48 hours</Text>
              </View>
            </View>
          </View>

          {/* What We Can Help With */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>HOW WE CAN HELP</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Common Support Topics</Text>
            <Text style={styles.sectionDesc}>
              Whether you're a candidate preparing for interviews or a mentor sharing your expertise, we're here to support you.
            </Text>
            <View style={styles.topicsGrid}>
              <View style={styles.topicCard}>
                <View style={styles.topicIcon}>
                  <HelpCircleIcon size={32} color={CTA_TEAL} />
                </View>
                <Text style={styles.topicTitle}>General Inquiries</Text>
                <Text style={styles.topicDesc}>Questions about how CrackJobs works, our mentor vetting process, session format, or getting started on the platform.</Text>
                <TouchableOpacity 
                  style={styles.topicBtn}
                  onPress={() => handleEmailPress('General Inquiry')}
                >
                  <Text style={styles.topicBtnText}>Email Us</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicIcon}>
                  <UsersIcon size={32} color={CTA_TEAL} />
                </View>
                <Text style={styles.topicTitle}>Candidate Support</Text>
                <Text style={styles.topicDesc}>Help with booking sessions, choosing the right mentor, preparing for your mock interview, understanding feedback, or tracking progress.</Text>
                <TouchableOpacity 
                  style={styles.topicBtn}
                  onPress={() => handleEmailPress('Candidate Support')}
                >
                  <Text style={styles.topicBtnText}>Email Us</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicIcon}>
                  <CreditCardIcon size={32} color={CTA_TEAL} />
                </View>
                <Text style={styles.topicTitle}>Payment & Billing</Text>
                <Text style={styles.topicDesc}>Payment failures, refund requests, invoice queries, or issues with Razorpay transactions. Include your booking ID for faster resolution.</Text>
                <TouchableOpacity 
                  style={styles.topicBtn}
                  onPress={() => handleEmailPress('Payment Issue')}
                >
                  <Text style={styles.topicBtnText}>Email Us</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicIcon}>
                  <ToolIcon size={32} color={CTA_TEAL} />
                </View>
                <Text style={styles.topicTitle}>Technical Support</Text>
                <Text style={styles.topicDesc}>Video call connectivity issues, platform bugs, login problems, or mobile app technical difficulties. Please include device/browser details.</Text>
                <TouchableOpacity 
                  style={styles.topicBtn}
                  onPress={() => handleEmailPress('Technical Issue')}
                >
                  <Text style={styles.topicBtnText}>Email Us</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicIcon}>
                  <UsersIcon size={32} color={CTA_TEAL} />
                </View>
                <Text style={styles.topicTitle}>Mentor Support</Text>
                <Text style={styles.topicDesc}>Mentor application status, session management, payout questions, profile updates, or help with conducting effective mock interviews.</Text>
                <TouchableOpacity 
                  style={styles.topicBtn}
                  onPress={() => handleEmailPress('Mentor Support')}
                >
                  <Text style={styles.topicBtnText}>Email Us</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicIcon}>
                  <BriefcaseIcon size={32} color={CTA_TEAL} />
                </View>
                <Text style={styles.topicTitle}>Business & Partnerships</Text>
                <Text style={styles.topicDesc}>Corporate training packages, bulk bookings for teams, university partnerships, or strategic collaboration opportunities.</Text>
                <TouchableOpacity 
                  style={styles.topicBtn}
                  onPress={() => handleEmailPress('Business Inquiry')}
                >
                  <Text style={styles.topicBtnText}>Email Us</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Before You Contact Us */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>SELF-SERVICE RESOURCES</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Find Answers Faster</Text>
            <Text style={styles.sectionDesc}>
              Many common questions are already answered in our help resources. Check these first for instant solutions.
            </Text>
            <View style={styles.resourcesGrid}>
              <TouchableOpacity 
                style={styles.resourceCard}
                onPress={() => router.push('/faq')}
              >
                <Text style={styles.resourceIcon}>❓</Text>
                <Text style={styles.resourceTitle}>Frequently Asked Questions</Text>
                <Text style={styles.resourceDesc}>Common questions about bookings, sessions, payments, and platform features.</Text>
                <Text style={styles.resourceLink}>View FAQ →</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resourceCard}
                onPress={() => router.push('/how-it-works')}
              >
                <Text style={styles.resourceIcon}>📖</Text>
                <Text style={styles.resourceTitle}>How It Works</Text>
                <Text style={styles.resourceDesc}>Complete guide to booking sessions, practicing interviews, and getting feedback.</Text>
                <Text style={styles.resourceLink}>Learn More →</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resourceCard}
                onPress={() => router.push('/cancellation-policy')}
              >
                <Text style={styles.resourceIcon}>📋</Text>
                <Text style={styles.resourceTitle}>Policies</Text>
                <Text style={styles.resourceDesc}>Cancellation policy, refund terms, and rescheduling guidelines.</Text>
                <Text style={styles.resourceLink}>Read Policies →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Response Expectations */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]}>
            <Text style={styles.sectionLabel}>WHAT TO EXPECT</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Our Support Process</Text>
            <View style={styles.expectationsContent}>
              <View style={styles.expectationCard}>
                <Text style={styles.expectationNum}>24-48 hrs</Text>
                <Text style={styles.expectationTitle}>Standard Response Time</Text>
                <Text style={styles.expectationDesc}>We aim to respond to all inquiries within 24-48 hours during business days (Monday-Saturday). Urgent issues may receive faster attention.</Text>
              </View>
              <View style={styles.expectationCard}>
                <Text style={styles.expectationNum}>Mon-Sat</Text>
                <Text style={styles.expectationTitle}>Business Days</Text>
                <Text style={styles.expectationDesc}>Monday-Friday: 9:00 AM - 6:00 PM IST. Saturday: 10:00 AM - 4:00 PM IST. Sunday: Closed. Emails received outside business hours will be responded to on the next business day.</Text>
              </View>
              <View style={styles.expectationCard}>
                <Text style={styles.expectationNum}>📧</Text>
                <Text style={styles.expectationTitle}>What to Include</Text>
                <Text style={styles.expectationDesc}>For faster resolution, include: Your registered email, booking ID (if applicable), detailed description of the issue, screenshots (for technical issues), and device/browser information.</Text>
              </View>
            </View>
          </View>

          {/* Tips for Contacting */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>PRO TIPS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Get Help Faster</Text>
            <View style={styles.tipsGrid}>
              <View style={styles.tipCard}>
                <CheckIcon size={16} color={CTA_TEAL} />
                <Text style={styles.tipText}>Use descriptive subject lines (e.g., "Payment Failed - Booking #1234")</Text>
              </View>
              <View style={styles.tipCard}>
                <CheckIcon size={16} color={CTA_TEAL} />
                <Text style={styles.tipText}>Include your booking ID for session-related issues</Text>
              </View>
              <View style={styles.tipCard}>
                <CheckIcon size={16} color={CTA_TEAL} />
                <Text style={styles.tipText}>Attach screenshots for technical or UI issues</Text>
              </View>
              <View style={styles.tipCard}>
                <CheckIcon size={16} color={CTA_TEAL} />
                <Text style={styles.tipText}>Provide device/browser info (e.g., "Chrome on Windows 11")</Text>
              </View>
              <View style={styles.tipCard}>
                <CheckIcon size={16} color={CTA_TEAL} />
                <Text style={styles.tipText}>Check spam folder if you don't receive a response in 48 hours</Text>
              </View>
              <View style={styles.tipCard}>
                <CheckIcon size={16} color={CTA_TEAL} />
                <Text style={styles.tipText}>Be specific about what you've already tried to fix the issue</Text>
              </View>
            </View>
          </View>

          {/* FAQ */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>COMMON QUESTIONS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>About Contacting Support</Text>
            <View style={styles.faqContainer}>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>Do you have phone support?</Text>
                <Text style={styles.faqAnswer}>Currently, we only provide email support at crackjobshelpdesk@gmail.com. This allows us to maintain detailed records of all communications and provide thoughtful, comprehensive responses to your questions.</Text>
              </View>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>Can I get support for urgent issues?</Text>
                <Text style={styles.faqAnswer}>For time-sensitive issues (e.g., unable to join a session starting in 1 hour), clearly mark your email subject as "URGENT" and include your booking ID. We monitor our inbox frequently during business hours and will prioritize urgent requests.</Text>
              </View>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>What if I don't get a response in 48 hours?</Text>
                <Text style={styles.faqAnswer}>First, check your spam/junk folder. If you still don't see our response after 48 business hours, send a follow-up email referencing your original message. There may have been a technical issue with email delivery.</Text>
              </View>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>Can mentors contact support on my behalf?</Text>
                <Text style={styles.faqAnswer}>Mentors and candidates must contact support separately using their registered email addresses. This protects anonymity and ensures we can verify your identity before discussing account-specific information.</Text>
              </View>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>Is there a live chat option?</Text>
                <Text style={styles.faqAnswer}>We currently don't offer live chat. Email support allows us to provide detailed, well-researched responses and maintain a record of all communications. Most issues are resolved within 1-2 email exchanges.</Text>
              </View>
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>EMERGENCY SITUATIONS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Cannot Join Your Session?</Text>
            <View style={styles.emergencyCard}>
              <Text style={styles.emergencyTitle}>If you're unable to join your scheduled session:</Text>
              <View style={styles.emergencySteps}>
                <View style={styles.emergencyStep}>
                  <Text style={styles.emergencyStepNum}>1</Text>
                  <Text style={styles.emergencyStepText}>Check your internet connection and refresh the page</Text>
                </View>
                <View style={styles.emergencyStep}>
                  <Text style={styles.emergencyStepNum}>2</Text>
                  <Text style={styles.emergencyStepText}>Try a different browser (Chrome recommended)</Text>
                </View>
                <View style={styles.emergencyStep}>
                  <Text style={styles.emergencyStepNum}>3</Text>
                  <Text style={styles.emergencyStepText}>Clear browser cache and cookies, then try again</Text>
                </View>
                <View style={styles.emergencyStep}>
                  <Text style={styles.emergencyStepNum}>4</Text>
                  <Text style={styles.emergencyStepText}>Email us immediately at crackjobshelpdesk@gmail.com with subject "URGENT - Cannot Join Session #[BookingID]"</Text>
                </View>
              </View>
              <Text style={styles.emergencyNote}>
                We'll work with your mentor to reschedule at no additional cost if the issue is on our end.
              </Text>
            </View>
          </View>

          {/* Final CTA */}
          <View style={styles.finalCta}>
            <Text style={[styles.finalCtaTitle, isSmall && { fontSize: 34 }]}>Still Have Questions?</Text>
            <Text style={[styles.finalCtaSubtitle, isSmall && { fontSize: 17 }]}>We're here to help you succeed. Reach out anytime and we'll get back to you within 24-48 hours.</Text>
            <TouchableOpacity 
              style={styles.finalCtaBtn}
              onPress={() => handleEmailPress()}
            >
              <Text style={styles.finalCtaBtnText}>Email Support →</Text>
            </TouchableOpacity>
            <Text style={styles.finalCtaEmail}>{SUPPORT_EMAIL}</Text>
          </View>

          <Footer />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },
  hero: { maxWidth: 900, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 70, alignItems: 'center' },
  heroMobile: { paddingVertical: 45 },
  badge: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d8eded', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, marginBottom: 28 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, letterSpacing: 0.6 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '900', fontSize: 56, color: BRAND_ORANGE, lineHeight: 64, textAlign: 'center', marginBottom: 24 },
  heroTitleMobile: { fontSize: 38, lineHeight: 46 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 32, textAlign: 'center', maxWidth: 750 },
  heroSubtitleMobile: { fontSize: 18, lineHeight: 28 },
  section: { paddingVertical: 80, paddingHorizontal: 24 },
  sectionLabel: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: CTA_TEAL, letterSpacing: 1.8, textAlign: 'center', marginBottom: 14, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontSize: 42, fontWeight: '800', color: TEXT_DARK, textAlign: 'center', marginBottom: 18, maxWidth: 850, alignSelf: 'center' },
  sectionTitleMobile: { fontSize: 32 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 17, color: TEXT_GRAY, textAlign: 'center', marginBottom: 48, maxWidth: 750, alignSelf: 'center', lineHeight: 27 },
  mainContactCard: { maxWidth: 600, alignSelf: 'center', alignItems: 'center', backgroundColor: BG_CREAM, padding: 48, borderRadius: 20, borderWidth: 1, borderColor: '#e8e8e8' },
  mainContactTitle: { fontFamily: SYSTEM_FONT, fontSize: 32, fontWeight: '800', color: TEXT_DARK, marginTop: 20, marginBottom: 12, textAlign: 'center' },
  mainContactDesc: { fontFamily: SYSTEM_FONT, fontSize: 17, color: TEXT_GRAY, textAlign: 'center', marginBottom: 28, lineHeight: 27 },
  emailButton: { backgroundColor: CTA_TEAL, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 100, marginBottom: 20 },
  emailButtonText: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: 'white' },
  responseTime: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff8f0', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  responseTimeText: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '600', color: BRAND_ORANGE },
  topicsGrid: { maxWidth: 1100, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  topicCard: { flex: 1, minWidth: 280, maxWidth: 340, backgroundColor: 'white', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e8e8e8' },
  topicIcon: { marginBottom: 16 },
  topicTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 12, textAlign: 'center' },
  topicDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, textAlign: 'center', marginBottom: 20 },
  topicBtn: { backgroundColor: BG_CREAM, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100, borderWidth: 1, borderColor: CTA_TEAL },
  topicBtnText: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700', color: CTA_TEAL },
  resourcesGrid: { maxWidth: 1000, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  resourceCard: { flex: 1, minWidth: 280, maxWidth: 300, backgroundColor: BG_CREAM, padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e8e8e8' },
  resourceIcon: { fontSize: 48, marginBottom: 16 },
  resourceTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 12, textAlign: 'center' },
  resourceDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, textAlign: 'center', marginBottom: 16 },
  resourceLink: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: '600', color: CTA_TEAL },
  expectationsContent: { maxWidth: 1000, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  expectationCard: { flex: 1, minWidth: 280, maxWidth: 300, backgroundColor: 'white', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e8e8e8' },
  expectationNum: { fontFamily: SYSTEM_FONT, fontSize: 36, fontWeight: '800', color: CTA_TEAL, marginBottom: 12 },
  expectationTitle: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 12, textAlign: 'center' },
  expectationDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, textAlign: 'center' },
  tipsGrid: { maxWidth: 900, alignSelf: 'center', gap: 16 },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: BG_CREAM, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e8e8e8' },
  tipText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 24, flex: 1 },
  faqContainer: { maxWidth: 900, alignSelf: 'center', gap: 20 },
  faqCard: { backgroundColor: 'white', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  faqQuestion: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 12 },
  faqAnswer: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 26 },
  emergencyCard: { maxWidth: 800, alignSelf: 'center', backgroundColor: '#fff5f0', padding: 36, borderRadius: 16, borderWidth: 2, borderColor: BRAND_ORANGE },
  emergencyTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 24, textAlign: 'center' },
  emergencySteps: { gap: 16, marginBottom: 24 },
  emergencyStep: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  emergencyStepNum: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '800', color: BRAND_ORANGE, width: 32, height: 32, borderRadius: 16, backgroundColor: 'white', textAlign: 'center', lineHeight: 32 },
  emergencyStepText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 24, flex: 1 },
  emergencyNote: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, fontStyle: 'italic', textAlign: 'center', lineHeight: 22 },
  finalCta: { backgroundColor: '#0f0f0f', paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontFamily: SYSTEM_FONT, fontSize: 46, fontWeight: '900', color: 'white', marginBottom: 22, textAlign: 'center', maxWidth: 750 },
  finalCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 42, textAlign: 'center', maxWidth: 650, lineHeight: 29 },
  finalCtaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 50, paddingVertical: 22, borderRadius: 100, marginBottom: 20 },
  finalCtaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  finalCtaEmail: { fontFamily: SYSTEM_FONT, fontSize: 16, color: 'rgba(255,255,255,0.7)' },
});