// app/contact.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';

const CTA_TEAL = '#18a7a7';

export default function Contact() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (<ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <View>
                <Text style={[styles.logoMain, isSmall && styles.logoMainMobile]}>
                  CrackJobs
                </Text>
                <Text style={[styles.logoTagline, isSmall && styles.logoTaglineMobile]}>
                  Mad skills. Dream job.
                </Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary, isSmall && styles.btnMobile]}
                onPress={() => router.push('/(auth)/sign-in')}
              >
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>
                  LOGIN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, isSmall && styles.btnMobile]}
                onPress={() => router.push('/(auth)/sign-up')}
              >
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]}>
            Get in Touch
          </Text>
          <Text style={[styles.pageSubtitle, isSmall && styles.pageSubtitleMobile]}>
            We'd love to hear from you!
          </Text>

          <View style={[styles.contactGrid, isSmall && styles.contactGridMobile]}>
            {/* General Inquiries */}
            <View style={[styles.contactCard, isSmall && styles.contactCardMobile]}>
              <Text style={styles.contactIcon}>💬</Text>
              <Text style={styles.contactTitle}>General Inquiries</Text>
              <Text style={styles.contactDescription}>
                Have a question? Reach out to us at:
              </Text>
              <TouchableOpacity onPress={() => handleEmail('hello@crackjobs.com')}>
                <Text style={styles.contactEmail}>hello@crackjobs.com</Text>
              </TouchableOpacity>
            </View>

            {/* Support */}
            <View style={[styles.contactCard, isSmall && styles.contactCardMobile]}>
              <Text style={styles.contactIcon}>🛟</Text>
              <Text style={styles.contactTitle}>Customer Support</Text>
              <Text style={styles.contactDescription}>
                Need help with your account or booking?
              </Text>
              <TouchableOpacity onPress={() => handleEmail('support@crackjobs.com')}>
                <Text style={styles.contactEmail}>support@crackjobs.com</Text>
              </TouchableOpacity>
            </View>

            {/* Partnerships */}
            <View style={[styles.contactCard, isSmall && styles.contactCardMobile]}>
              <Text style={styles.contactIcon}>🤝</Text>
              <Text style={styles.contactTitle}>Partnerships</Text>
              <Text style={styles.contactDescription}>
                Interested in partnering with us?
              </Text>
              <TouchableOpacity onPress={() => handleEmail('partners@crackjobs.com')}>
                <Text style={styles.contactEmail}>partners@crackjobs.com</Text>
              </TouchableOpacity>
            </View>

            {/* Become a Mentor */}
            <View style={[styles.contactCard, isSmall && styles.contactCardMobile]}>
              <Text style={styles.contactIcon}>👨‍🏫</Text>
              <Text style={styles.contactTitle}>Become a Mentor</Text>
              <Text style={styles.contactDescription}>
                Want to help others? Apply to be a mentor:
              </Text>
              <TouchableOpacity onPress={() => handleEmail('mentors@crackjobs.com')}>
                <Text style={styles.contactEmail}>mentors@crackjobs.com</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.faqSection}>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
              Frequently Asked Questions
            </Text>

            <View style={styles.faqList}>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>How do I book a mock interview?</Text>
                <Text style={styles.faqAnswer}>
                  Sign up, browse our mentors, and book a session that fits your schedule. It's that simple!
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>What roles do you support?</Text>
                <Text style={styles.faqAnswer}>
                  We support SDE, Backend, Frontend, Product Manager, Data Scientist, Data Analyst, and HR roles.
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>How long are the sessions?</Text>
                <Text style={styles.faqAnswer}>
                  Sessions typically last 45-60 minutes, including feedback time.
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Can I reschedule a session?</Text>
                <Text style={styles.faqAnswer}>
                  Yes! You can reschedule up to 24 hours before your session.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.footerContent, isSmall && styles.footerContentMobile]}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.footerLink}>Home</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/how-it-works')}>
              <Text style={styles.footerLink}>How It Works</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/about')}>
              <Text style={styles.footerLink}>About</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/blog')}>
              <Text style={styles.footerLink}>Blog</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  
  // Header (same as other pages)
  header: { backgroundColor: '#f8f5f0', paddingVertical: 16 },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1400,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
  },
  headerInnerMobile: { paddingHorizontal: 20 },
  logoMain: {
    fontFamily: 'DancingScript',
    fontSize: 36,
    fontWeight: '900',
    color: '#333',
  },
  logoMainMobile: { fontSize: 28 },
  logoTagline: {
    fontFamily: 'DancingScript',
    fontSize: 22,
    fontWeight: '900',
    color: '#f58742',
    marginTop: -8,
  },
  logoTaglineMobile: { fontSize: 16 },
  navRight: { flexDirection: 'row', gap: 12 },
  navRightMobile: { gap: 8 },
  btn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
  },
  btnPrimary: {
    backgroundColor: CTA_TEAL,
    borderColor: CTA_TEAL,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderColor: '#333',
  },
  btnMobile: { paddingHorizontal: 20, paddingVertical: 8 },
  btnText: {
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  btnTextMobile: { fontSize: 12 },
  
  // Content
  content: {
    maxWidth: 1100,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  pageTitle: {
    fontFamily: 'DancingScript',
    fontSize: 56,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageTitleMobile: { fontSize: 42 },
  pageSubtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  pageSubtitleMobile: { fontSize: 18, paddingHorizontal: 20 },
  
  // Contact Grid
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 60,
  },
  contactGridMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  contactCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactCardMobile: {
    minWidth: '100%',
    padding: 24,
  },
  contactIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  contactEmail: {
    fontSize: 16,
    color: CTA_TEAL,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  
  // FAQ Section
  faqSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  sectionTitleMobile: {
    fontSize: 28,
  },
  faqList: {
    gap: 24,
  },
  faqItem: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  faqAnswer: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  
  // Footer
  footer: {
    backgroundColor: '#333',
    paddingVertical: 32,
    paddingHorizontal: 40,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  footerContentMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  footerLink: {
    color: '#fff',
    fontSize: 14,
  },
  footerDivider: {
    color: '#666',
    fontSize: 14,
  },
});