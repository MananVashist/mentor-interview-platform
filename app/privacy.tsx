import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Linking } from 'react-native';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

export default function PrivacyPolicy() {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const breadcrumb = createBreadcrumbSchema([
        { name: 'Home', url: 'https://crackjobs.com' },
        { name: 'Privacy Policy', url: 'https://crackjobs.com/privacy' },
      ]);
      const cleanup = injectMultipleSchemas([breadcrumb]);
      return () => cleanup && cleanup();
    }
  }, []);

  return (
    <PageLayout>
      <Head>
        <title>Privacy Policy | CrackJobs</title>
        <meta
          name="description"
          content="Read how CrackJobs collects, uses, stores, and protects your data as a candidate or mentor on our mock interview and mentorship platform."
        />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text
          style={[styles.pageTitle, isSmall && styles.pageTitleMobile]}
          accessibilityRole="header"
          aria-level={1}
        >
          Privacy Policy
        </Text>
        <Text style={styles.lastUpdated}>Last Updated: November 27, 2025</Text>

        {/* Intro */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            This Privacy Policy explains how <Text style={styles.bold}>CrackJobs</Text> (&quot;CrackJobs&quot;,
            &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, discloses, and protects your information
            when you use our website, mobile applications, and related services that enable mock interviews, mentorship,
            scheduling, feedback, and other career preparation tools (the &quot;Services&quot;).
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            By accessing or using the Services, you agree to the collection and use of information in accordance with
            this Privacy Policy. If you do not agree, you must not use the Services.
          </Text>
        </View>

        {/* 1. Scope & Acceptance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Scope &amp; Acceptance</Text>
          <Text style={styles.paragraph}>
            This Policy applies to all users of the Services, including Candidates and Mentors. It covers information
            we collect through:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Account registration and profile creation.</Bullet>
            <Bullet>Booking, attending, and reviewing Sessions.</Bullet>
            <Bullet>Communication through our Platform (chat, email, notifications).</Bullet>
            <Bullet>Our website, apps, and integrated tools such as analytics, payments, and video.</Bullet>
          </View>
        </View>

        {/* 2. Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2.1 Personal Identification Information.</Text> We may collect:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Name (if provided).</Bullet>
            <Bullet>Email address.</Bullet>
            <Bullet>Phone number (optional).</Bullet>
            <Bullet>Location or time zone (if shared or inferred for scheduling).</Bullet>
          </View>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>2.2 Professional &amp; Profile Data.</Text> For Candidates and Mentors, we may
            collect:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Education, work experience, and skills.</Bullet>
            <Bullet>Job role preferences, seniority, and industries of interest.</Bullet>
            <Bullet>Profile photo or avatar (if you upload one).</Bullet>
            <Bullet>LinkedIn or other professional profile links, if you choose to connect them.</Bullet>
          </View>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>2.3 Session &amp; Interaction Data.</Text> When you use our Services, we may
            collect:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Session bookings, timings, and attendance.</Bullet>
            <Bullet>Feedback, evaluations, and ratings given or received.</Bullet>
            <Bullet>Messages and communication through the Platform (chat or in-app messaging).</Bullet>
            <Bullet>Optional recordings or notes from Sessions, where legally allowed and consented to.</Bullet>
          </View>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>2.4 Uploaded Content.</Text> You may upload:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>CVs, resumes, portfolios, or other documents.</Bullet>
            <Bullet>Preparation notes or assignments related to your interview practice.</Bullet>
          </View>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>2.5 Technical &amp; Usage Data.</Text> We may automatically collect:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>IP address and approximate location.</Bullet>
            <Bullet>Device type, operating system, and browser type.</Bullet>
            <Bullet>Log data such as pages visited, features used, and timestamps.</Bullet>
            <Bullet>Crash reports, performance metrics, and diagnostic information.</Bullet>
          </View>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>2.6 Payment &amp; Transaction Data.</Text> When you make a payment, we may
            collect:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Payment transaction IDs and reference numbers from payment gateways.</Bullet>
            <Bullet>Billing amount, currency, and limited billing details.</Bullet>
          </View>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            We do <Text style={styles.bold}>not</Text> store your full card number, CVV, UPI PIN, or net-banking
            passwords. These are handled directly by our payment partners.
          </Text>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>2.7 Cookies &amp; Similar Technologies.</Text> We use cookies and similar
            technologies to remember your preferences, keep you logged in, and analyze how the Services are used. See
            Section 7 below for more details.
          </Text>
        </View>

        {/* 3. How We Use Your Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>We use the information we collect for purposes including:</Text>
          <View style={styles.bulletList}>
            <Bullet>Creating and managing your account and profile.</Bullet>
            <Bullet>Matching Candidates with relevant Mentors and Sessions.</Bullet>
            <Bullet>Scheduling, managing, and delivering Sessions.</Bullet>
            <Bullet>Processing payments, refunds, and Mentor payouts.</Bullet>
            <Bullet>Providing customer support and answering your queries.</Bullet>
            <Bullet>Sending important notifications such as booking confirmations, reminders, and policy updates.</Bullet>
            <Bullet>Improving, personalizing, and optimizing the Platform and user experience.</Bullet>
            <Bullet>Monitoring usage, detecting fraud, and enhancing security.</Bullet>
            <Bullet>Complying with legal obligations and enforcing our terms and policies.</Bullet>
          </View>
        </View>

        {/* 4. Legal Bases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Legal Bases for Processing (Where Applicable)</Text>
          <Text style={styles.paragraph}>Depending on your location, our legal bases for processing your data may include:</Text>
          <View style={styles.bulletList}>
            <Bullet>
              <Text style={styles.bold}>Consent</Text> – for example, when you opt in to certain communications or
              recordings.
            </Bullet>
            <Bullet>
              <Text style={styles.bold}>Contractual necessity</Text> – when we process data to provide the Services you
              have requested (e.g., booking Sessions).
            </Bullet>
            <Bullet>
              <Text style={styles.bold}>Legitimate interests</Text> – such as improving services, preventing fraud, and
              ensuring security.
            </Bullet>
            <Bullet>
              <Text style={styles.bold}>Legal obligations</Text> – where we must retain or disclose information to
              comply with applicable laws.
            </Bullet>
          </View>
        </View>

        {/* 5. Sharing & Disclosure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Sharing &amp; Disclosure of Information</Text>
          <Text style={styles.paragraph}>
            We do <Text style={styles.bold}>not</Text> sell your personal data. We may share your information in the
            following limited circumstances:
          </Text>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>5.1 With Other Users.</Text>
          </Text>
          <View style={styles.bulletList}>
            <Bullet>
              Candidate details (such as your role, experience level, and goals) may be shared with Mentors you book or
              interact with, so they can prepare and conduct Sessions meaningfully.
            </Bullet>
            <Bullet>
              Mentor public profile details (such as experience, skills, and ratings) are visible to Candidates on the
              Platform.
            </Bullet>
          </View>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>5.2 Service Providers.</Text> We may share information with trusted third-party
            service providers who help us operate the Services, such as:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Cloud hosting and storage providers.</Bullet>
            <Bullet>Payment gateways and payout partners.</Bullet>
            <Bullet>Analytics and error-monitoring tools.</Bullet>
            <Bullet>Email, SMS, and notification service providers.</Bullet>
          </View>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            These providers are authorized to use your information only as necessary to perform services on our behalf.
          </Text>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>5.3 Legal Compliance &amp; Protection.</Text> We may disclose information if we
            believe in good faith that it is reasonably necessary to:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Comply with any applicable law, regulation, or legal process.</Bullet>
            <Bullet>Respond to lawful requests from law enforcement or government authorities.</Bullet>
            <Bullet>Protect the rights, property, or safety of CrackJobs, our users, or the public.</Bullet>
          </View>

          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            <Text style={styles.bold}>5.4 Business Transfers.</Text> In connection with a merger, acquisition, asset
            sale, or similar transaction, your information may be transferred as part of the business assets. We will
            take reasonable steps to ensure appropriate safeguards are in place.
          </Text>
        </View>

        {/* 6. Data Retention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your information for as long as necessary to provide the Services and for other legitimate
            purposes, such as complying with legal obligations, resolving disputes, and enforcing our agreements.
          </Text>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            In general:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Account data is kept while your account is active.</Bullet>
            <Bullet>Session history and feedback may be retained for a reasonable period for reference and quality.</Bullet>
            <Bullet>
              Transaction records may be kept for periods required by tax, accounting, or financial regulations.
            </Bullet>
          </View>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            When data is no longer needed, we will delete or anonymize it in a manner designed to protect it from
            unauthorized access.
          </Text>
        </View>

        {/* 7. Cookies & Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Cookies &amp; Tracking Technologies</Text>
          <Text style={styles.paragraph}>
            We use cookies and similar tracking technologies to operate and improve the Services. These may include:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Session cookies that keep you logged in and maintain your preferences.</Bullet>
            <Bullet>Analytics cookies that help us understand usage patterns and improve features.</Bullet>
            <Bullet>Performance and security cookies used to detect and prevent abuse.</Bullet>
          </View>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            You can control cookies through your browser settings. However, disabling certain cookies may affect the
            functionality of the Services.
          </Text>
        </View>

        {/* 8. Data Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement reasonable technical and organizational measures to protect your information, including:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Encrypted connections (HTTPS) for data in transit.</Bullet>
            <Bullet>Token-based authentication and session management.</Bullet>
            <Bullet>Restricted access to production systems on a need-to-know basis.</Bullet>
            <Bullet>Monitoring for suspicious or abusive activity where feasible.</Bullet>
          </View>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            However, no method of transmission over the internet or electronic storage is completely secure. We cannot
            guarantee absolute security of your information.
          </Text>
        </View>

        {/* 9. International Transfers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Our servers, service providers, or partners may be located in countries other than your own. By using the
            Services, you consent to the transfer of your information to such countries, which may have different data
            protection laws. Where required, we take steps to ensure appropriate safeguards for these transfers.
          </Text>
        </View>

        {/* 10. Your Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Your Rights &amp; Choices</Text>
          <Text style={styles.paragraph}>
            Depending on your jurisdiction, you may have certain rights regarding your personal data. These can include
            the right to:
          </Text>
          <View style={styles.bulletList}>
            <Bullet>Access the personal data we hold about you.</Bullet>
            <Bullet>Request correction of inaccurate or incomplete data.</Bullet>
            <Bullet>Request deletion of certain data, subject to legal exceptions.</Bullet>
            <Bullet>Object to or restrict certain types of processing.</Bullet>
            <Bullet>Withdraw consent where processing is based on your consent.</Bullet>
            <Bullet>Request a copy of your data in a portable format where technically feasible.</Bullet>
          </View>
          <Text style={[styles.paragraph, styles.marginTopSmall]}>
            To exercise these rights, you can contact us at:{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}>
              crackjobshelpdesk@gmail.com
            </Text>
            . We may need to verify your identity before responding.
          </Text>
        </View>

        {/* 11. Children’s Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Children&apos;s Privacy</Text>
          <Text style={styles.paragraph}>
            The Services are not intended for individuals under the age of 18. We do not knowingly collect personal
            information from children under 18. If you believe that a child has provided us with personal information,
            please contact us so we can take appropriate action.
          </Text>
        </View>

        {/* 12. Third-Party Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Third-Party Links &amp; Services</Text>
          <Text style={styles.paragraph}>
            The Platform may contain links to third-party websites or services (such as LinkedIn or external learning
            resources). We are not responsible for the privacy practices or content of those third parties. We encourage
            you to review their privacy policies before providing any personal data.
          </Text>
        </View>

        {/* 13. Changes to this Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Changes to this Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. When we do, we will revise the &quot;Last Updated&quot;
            date at the top of this page. Your continued use of the Services after any changes become effective
            constitutes your acceptance of the updated Policy.
          </Text>
        </View>

        {/* 14. Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions, concerns, or requests related to this Privacy Policy or our data practices,
            please contact us at:
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
