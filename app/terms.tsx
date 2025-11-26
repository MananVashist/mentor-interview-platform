import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Linking } from 'react-native';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

export default function TermsAndConditions() {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const breadcrumb = createBreadcrumbSchema([
        { name: 'Home', url: 'https://crackjobs.com' },
        { name: 'Terms & Conditions', url: 'https://crackjobs.com/terms' },
      ]);
      const cleanup = injectMultipleSchemas([breadcrumb]);
      return () => cleanup && cleanup();
    }
  }, []);

  return (
    <PageLayout>
      <Head>
        <title>Terms & Conditions | CrackJobs</title>
        <meta
          name="description"
          content="Read the complete Terms & Conditions for CrackJobs, governing the use of our mock interview and mentorship platform for candidates and mentors."
        />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text
          style={[styles.pageTitle, isSmall && styles.pageTitleMobile]}
          accessibilityRole="header"
          aria-level={1}
        >
          Terms & Conditions
        </Text>
        <Text style={styles.lastUpdated}>Last Updated: November 27, 2025</Text>

        {/* Intro */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Welcome to <Text style={styles.bold}>CrackJobs</Text> (&quot;CrackJobs&quot;, &quot;we&quot;,
            &quot;us&quot;, &quot;our&quot;). These Terms &amp; Conditions (&quot;Terms&quot;) govern your access
            to and use of the CrackJobs website, mobile applications, products, and services that facilitate mock
            interviews, mentorship sessions, feedback, scheduling, and related features (collectively, the
            &quot;Services&quot;).
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            By accessing or using the Services, you (&quot;User&quot;, &quot;you&quot;, which may be a
            &quot;Candidate&quot; or &quot;Mentor&quot;) agree to be bound by these Terms. If you do not agree, you
            must not use the Services.
          </Text>
        </View>

        {/* 1. Definitions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Definitions</Text>
          <View style={styles.bulletList}>
            <Bullet>“Candidate” means a user who uses CrackJobs to book mock interviews, mentorship, feedback, or similar services.</Bullet>
            <Bullet>“Mentor” means a user who provides mock interviews, mentorship, feedback, reviews, or similar services through CrackJobs.</Bullet>
            <Bullet>“Session” means any mock interview, mentoring interaction, consultation, or other engagement between a Mentor and a Candidate facilitated through CrackJobs.</Bullet>
            <Bullet>“Content” means any information, text, images, audio, video, documents (including CVs and resumes), evaluations, feedback, or other material uploaded, transmitted, or otherwise made available through the Services.</Bullet>
            <Bullet>“Platform” means the CrackJobs website, mobile apps, backend systems, and all related technology.</Bullet>
          </View>
        </View>

        {/* 2. Eligibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Eligibility</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2.1 Age and Capacity.</Text> You must be at least 18 years old and have legal
            capacity to enter into a binding contract under applicable law to use the Services.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>2.2 Compliance.</Text> You may use the Services only in compliance with these
            Terms and all applicable laws, rules, and regulations.
          </Text>
        </View>

        {/* 3. Account Registration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Account Registration &amp; Security</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>3.1 Account Creation.</Text> To access certain features, you must create an
            account and provide accurate, current, and complete information. You agree to update such information as
            needed to keep it accurate and complete.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>3.2 Security.</Text> You are responsible for maintaining the confidentiality of
            your login credentials and for all activities that occur under your account. You agree to notify us
            immediately at{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}>
              crackjobshelpdesk@gmail.com
            </Text>{' '}
            of any unauthorized use or security breach.
          </Text>
        </View>

        {/* 4. Nature of Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Nature of the Services</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4.1 Platform Role.</Text> CrackJobs is a platform that connects Candidates with
            Mentors for mock interviews, feedback, and career guidance. Mentors are independent professionals and are
            not employees, agents, or representatives of CrackJobs.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>4.2 No Employment Guarantee.</Text> CrackJobs does not guarantee internships,
            interviews, job offers, promotions, or any particular employment outcome. Any decisions made by third-party
            employers are outside our control.
          </Text>
        </View>

        {/* 5. User Responsibilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. User Responsibilities</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5.1 Candidate Responsibilities.</Text> As a Candidate, you agree to:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Provide accurate information about your experience, skills, and goals.</Bullet>
            <Bullet>Use Sessions solely for learning, preparation, and skill development.</Bullet>
            <Bullet>Not request Mentors to perform real job tasks or unpaid work assignments.</Bullet>
            <Bullet>Not share confidential employer data or trade secrets without proper authorization.</Bullet>
            <Bullet>Treat Mentors with respect and maintain professional conduct at all times.</Bullet>
          </View>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>5.2 Mentor Responsibilities.</Text> As a Mentor, you agree to:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Provide honest, constructive, and respectful feedback.</Bullet>
            <Bullet>Not disclose Candidate information outside the Platform except where legally required.</Bullet>
            <Bullet>Not guarantee any specific outcome, job placement, or employer decision.</Bullet>
            <Bullet>Not engage in harassment, discrimination, or abusive behavior.</Bullet>
          </View>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>5.3 General Conduct.</Text> All Users agree not to:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Use the Services for unlawful or fraudulent purposes.</Bullet>
            <Bullet>Impersonate another person or misrepresent affiliation.</Bullet>
            <Bullet>Upload, transmit, or distribute viruses or malicious code.</Bullet>
            <Bullet>Interfere with or disrupt the integrity or performance of the Platform.</Bullet>
          </View>
        </View>

        {/* 6. Bookings, Payments, Refunds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Bookings, Payments &amp; Refunds</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.1 Fees.</Text> Session fees are displayed at the time of booking. By
            confirming a booking, you authorize CrackJobs and its payment partners to charge the applicable amount.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>6.2 Escrow / Payouts.</Text> In some cases, payments may be held in escrow and
            released to the Mentor after successful completion of the Session, subject to our internal checks and these
            Terms.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>6.3 Refunds.</Text> Refunds may be granted at our sole discretion in limited
            circumstances, such as:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Mentor no-show without prior notice.</Bullet>
            <Bullet>Technical issues attributable to the Platform that prevent the Session from taking place.</Bullet>
            <Bullet>Duplicate or clearly erroneous charges verified by us.</Bullet>
          </View>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            Dissatisfaction with feedback or performance alone generally does not qualify for a refund.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>6.4 Cancellations.</Text> Our detailed cancellation and rescheduling rules may be
            posted on the Platform and form part of these Terms. Late cancellations or no-shows by Candidates may
            result in forfeiture of fees.
          </Text>
        </View>

        {/* 7. Content & IP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Content &amp; Intellectual Property</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>7.1 Platform IP.</Text> All rights, title, and interest in and to the Platform,
            including software, UI, branding, evaluation frameworks, and other proprietary materials, are owned by
            CrackJobs or its licensors and are protected by applicable intellectual property laws.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>7.2 User Content.</Text> You retain ownership of Content you upload or provide,
            subject to the rights you grant us below. You grant CrackJobs a non-exclusive, worldwide, royalty-free
            license to use, store, reproduce, and display such Content solely for the purpose of operating and
            improving the Services.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>7.3 Mentor Feedback &amp; Evaluations.</Text> Written evaluations, feedback, and
            similar materials created by Mentors for Candidates may be used by the Candidate for personal learning and
            reference. CrackJobs may also use anonymized or aggregated forms of such materials to improve the Platform.
          </Text>
        </View>

        {/* 8. Recording Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Recording Policy</Text>
          <Text style={styles.paragraph}>
            Sessions may be recorded only where permitted by law and with appropriate consent from all relevant
            parties. Unauthorized recording, distribution, or publication of Sessions (including screenshots, audio, or
            video) outside the Platform is strictly prohibited.
          </Text>
        </View>

        {/* 9. Ratings & Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Ratings &amp; Reviews</Text>
          <Text style={styles.paragraph}>
            Candidates may rate and review Mentors after Sessions. You agree that your reviews will be fair, truthful,
            and respectful. CrackJobs may display, moderate, remove, or aggregate reviews at its discretion, especially
            where they are abusive, misleading, or violate these Terms.
          </Text>
        </View>

        {/* 10. Prohibited Conduct */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Prohibited Conduct</Text>
          <Text style={styles.paragraph}>You agree not to:</Text>
          <View style={styles.bulletList}>
            <Bullet>Use the Platform for harassment, hate speech, or discriminatory behavior.</Bullet>
            <Bullet>Solicit or offer bribes, kickbacks, or other improper payments.</Bullet>
            <Bullet>Use AI-generated or fabricated identities, profiles, or resumes without clear disclosure.</Bullet>
            <Bullet>Attempt to circumvent payment flows or conduct Sessions outside the Platform to avoid fees.</Bullet>
          </View>
        </View>

        {/* 11. Suspension & Termination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Suspension &amp; Termination</Text>
          <Text style={styles.paragraph}>
            We may suspend or terminate your account, with or without notice, if we reasonably believe that you have
            violated these Terms, engaged in fraudulent or harmful conduct, or created risk or possible legal exposure
            for us, other Users, or third parties.
          </Text>
        </View>

        {/* 12. Third-Party Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Third-Party Services &amp; Integrations</Text>
          <Text style={styles.paragraph}>
            The Platform may integrate or interact with third-party services such as payment gateways, video
            conferencing tools, analytics providers, or platforms like LinkedIn. CrackJobs does not control and is not
            responsible for such third-party services. Your use of them may be subject to their own terms and privacy
            policies.
          </Text>
        </View>

        {/* 13. Disclaimers & Limitation of Liability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Disclaimers &amp; Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>13.1 &quot;As Is&quot; Services.</Text> The Services are provided on an
            &quot;as is&quot; and &quot;as available&quot; basis, without warranties of any kind, whether express or
            implied, including any implied warranties of merchantability, fitness for a particular purpose, or
            non-infringement.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>13.2 No Guarantee of Outcomes.</Text> CrackJobs does not guarantee that use of
            the Services will result in job offers, promotions, higher compensation, or any particular outcome.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>13.3 Limitation of Liability.</Text> To the maximum extent permitted by law,
            CrackJobs shall not be liable for any indirect, incidental, consequential, special, or punitive damages, or
            any loss of profits, revenue, data, or goodwill, arising out of or related to your use of the Services.
            Where liability cannot be excluded, our total aggregate liability to you for all claims arising under these
            Terms shall not exceed the total amount you have paid to CrackJobs for the Services in the six (6) months
            preceding the event giving rise to the claim.
          </Text>
        </View>

        {/* 14. Indemnification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to indemnify, defend, and hold harmless CrackJobs, its directors, employees, and partners from and
            against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising
            out of or related to: (a) your use or misuse of the Services; (b) your violation of these Terms; or (c) your
            infringement of any rights of another person or entity.
          </Text>
        </View>

        {/* 15. Governing Law */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Governing Law &amp; Jurisdiction</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its
            conflict of law principles. Any disputes arising out of or relating to these Terms or the Services shall be
            subject to the exclusive jurisdiction of the courts located in [Insert City, India], and you consent to the
            personal jurisdiction of such courts.
          </Text>
        </View>

        {/* 16. Changes to Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Changes to These Terms</Text>
          <Text style={styles.paragraph}>
            We may modify these Terms from time to time. When we do, we will update the &quot;Last Updated&quot; date
            at the top of this page. Your continued use of the Services after changes have been posted will constitute
            your acceptance of the revised Terms.
          </Text>
        </View>

        {/* 17. Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>17. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms &amp; Conditions, please contact us at:
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}>
            <Text style={styles.link}>crackjobshelpdesk@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageLayout>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletItem}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    maxWidth: 1000,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  contentMobile: { paddingHorizontal: 20 },
  pageTitle: {
    fontFamily: theme.typography.fontFamily.extrabold,
    fontSize: 42,
    color: theme.colors.text.main,
    textAlign: 'center',
    marginBottom: 16,
  },
  pageTitleMobile: { fontSize: 32 },
  lastUpdated: {
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginBottom: 40,
  },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 24,
    color: theme.colors.text.main,
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.body,
    lineHeight: 26,
  },
  marginTopSmall: { marginTop: 8 },
  bulletList: { paddingLeft: 12, marginTop: 8 },
  bulletItem: { flexDirection: 'row', marginBottom: 8 },
  bullet: { color: theme.colors.primary, marginRight: 8, fontSize: 16 },
  bulletText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.body,
    flex: 1,
  },
  bold: {
    fontFamily: theme.typography.fontFamily.bold,
  },
  link: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 16,
    marginTop: 8,
  },
});
