// app/privacy.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Platform } from 'react-native';
import Head from 'expo-router/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';


const BG_CREAM = '#f8f5f0';
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

export default function PrivacyPolicy() {
  if (Platform.OS === 'web') {
    return (
      <>
        <Head>
          <title>Privacy Policy | CrackJobs</title>
          <meta name="description" content="We value your privacy. Learn how CrackJobs handles your data, resumes, and interview recordings." />
          <meta name="keywords" content="privacy policy, data security, gdpr, data protection, crackjobs privacy, interview recording privacy" />
          <link rel="canonical" href="https://crackjobs.com/privacy" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://crackjobs.com/privacy" />
          <meta property="og:title" content="Privacy Policy | CrackJobs" />
          <meta property="og:description" content="We value your privacy. Learn how CrackJobs handles your data, resumes, and interview recordings." />
          <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        </Head>

        <div style={{ minHeight: '100vh', backgroundColor: BG_CREAM,overflowY: 'auto' }}>
          <Header />
          
          <main style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '60px 24px 80px',
            fontFamily: SYSTEM_FONT,
          }}>
            <header style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '12px',
                lineHeight: '1.2'
              }}>
                Privacy Policy
              </h1>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>
                Last Updated: January 31, 2026
              </p>
            </header>

            {/* Introduction */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                Introduction
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                At CrackJobs, protecting your privacy is fundamental to everything we do. This Privacy Policy explains in detail how we collect, use, store, and safeguard your personal information when you use our mock interview platform.
              </p>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                We are committed to transparency and compliance with applicable data protection laws, including the Information Technology Act, 2000 and the General Data Protection Regulation (GDPR) where applicable.
              </p>
            </section>

            {/* Information We Collect */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Information We Collect
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Personal Information
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                When you register on CrackJobs as a mentor, we collect:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Name and Contact Information:</strong> Full name, email address, phone number</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Professional Information:</strong> Current job title, company, years of experience, LinkedIn profile</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Resume/CV:</strong> Your uploaded resume containing work history, education, and skills</li>
              </ul>

              
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                When you register on CrackJobs as a candidate, we collect:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Name and Contact Information:</strong> Full name, email address</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Resume/CV:</strong> Your uploaded resume containing work history, education, and skills</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Payment Information:</strong> Billing details processed securely through Razorpay (we never store complete card numbers)</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Session Data
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                During mock interview sessions, we collect:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Written feedback and evaluations from mentors</li>
                <li style={{ marginBottom: '8px' }}>Session notes and performance assessments</li>
                <li style={{ marginBottom: '8px' }}>Booking history and session preferences</li>
                <li style={{ marginBottom: '8px' }}>Recording of the communication between candidates and mentors through our platform</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Automatically Collected Information
              </h3>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Device Information:</strong> Browser type, operating system, device identifiers</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Location Data:</strong> Approximate geographic location based on IP address</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Cookies:</strong> Session cookies, preference cookies, and analytics cookies</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                How We Use Your Information
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                We use your information to provide and improve our services:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Communication:</strong> Send booking confirmations, session reminders, feedback notifications, and important platform updates</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Payment Processing:</strong> Handle transactions securely through our payment partner Razorpay, manage refunds and payouts</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Platform Improvement:</strong> Analyze usage patterns to enhance features, fix bugs, and optimize user experience</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Quality Assurance:</strong> Monitor mentor performance, review feedback quality, and maintain service standards</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Legal Compliance:</strong> Meet regulatory requirements, prevent fraud, and enforce our terms of service</li>
              </ul>
            </section>

            {/* Data Security */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Data Security
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                We implement industry-leading security measures to protect your data:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Encryption:</strong> All data transmitted between your device and our servers uses TLS/SSL encryption. Sensitive data at rest is encrypted using AES-256 encryption</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Access Controls:</strong> We implement Supabase Row Level Security (RLS) ensuring users can only access their own data and authorized information</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Payment Security:</strong> All payment information is processed through PCI-DSS compliant Razorpay. We never store complete credit card numbers</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Infrastructure:</strong> Our servers are hosted on secure cloud infrastructure with regular security updates and monitoring</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Staff Access:</strong> Only authorized personnel have access to personal data, and they are bound by strict confidentiality agreements</li>
              </ul>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', padding: '16px', backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '4px' }}>
                <strong style={{ color: '#92400E' }}>Important:</strong> While we implement robust security measures, no system is 100% secure. Please use strong passwords and never share your account credentials.
              </p>
            </section>

            {/* Data Sharing */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Data Sharing and Third Parties
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                <strong style={{ color: '#111827' }}>We never sell your personal data.</strong> We only share information in the following limited circumstances:
              </p>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                With Mentors and Candidates
              </h3>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Mentors see your professional title only</li>
                <li style={{ marginBottom: '8px' }}>Candidates see mentor's professional title, years of experience, no of sessions, ratings and expertise areas</li>
                <li style={{ marginBottom: '8px' }}>Contact information is never directly shared; all communication happens through our platform</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Service Providers
              </h3>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Razorpay:</strong> Payment processing and transaction management</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Supabase:</strong> Database hosting and authentication services</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>100ms:</strong> Video conferencing infrastructure for interview sessions</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Email Services:</strong> Transactional emails for bookings and notifications</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Legal Requirements
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                We may disclose information if required by law, court order, or government regulation, or to protect the rights, property, or safety of CrackJobs, our users, or others.
              </p>
            </section>

            {/* Your Rights */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Your Privacy Rights
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                You have the following rights regarding your personal data:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Access:</strong> Request a copy of all personal data we hold about you</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Correction:</strong> Update or correct inaccurate information in your profile</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Deletion:</strong> Request deletion of your account and associated data (some information may be retained for legal compliance)</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Objection:</strong> Object to certain processing activities or marketing communications</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Withdrawal:</strong> Withdraw consent for data processing at any time</li>
              </ul>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginTop: '20px' }}>
                To exercise any of these rights, contact us at <a href="mailto:crackjobshelpdesk@gmail.com" style={{ color: '#18a7a7', fontWeight: '600', textDecoration: 'underline' }}>crackjobshelpdesk@gmail.com</a>
              </p>
            </section>

            {/* Data Retention */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Data Retention
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '8px' }}>Active account data: Retained while your account is active</li>
                <li style={{ marginBottom: '8px' }}>Session records and feedback: Retained for 3 years for quality assurance</li>
                <li style={{ marginBottom: '8px' }}>Transaction records: Retained for 7 years for tax and accounting purposes</li>
                <li style={{ marginBottom: '8px' }}>After account deletion: Most data deleted within 30 days, except where legal retention is required</li>
              </ul>
            </section>

            {/* Cookies */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Cookies and Tracking
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                We use cookies and similar technologies to:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Essential Cookies:</strong> Necessary for login, security, and core platform functionality</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Preference Cookies:</strong> Remember your settings and choices</li>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#111827' }}>Analytics Cookies:</strong> Understand how users interact with our platform to improve experience</li>
              </ul>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                You can control cookies through your browser settings. Note that disabling essential cookies may affect platform functionality.
              </p>
            </section>

            {/* Children's Privacy */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Children's Privacy
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                CrackJobs is intended for users aged 18 and above. We do not knowingly collect information from children under 18. If you believe a child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Changes to This Policy
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Significant changes will be communicated via email or prominent platform notification at least 30 days before taking effect. Your continued use after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section style={{ backgroundColor: '#18a7a7', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                Questions About Privacy?
              </h2>
              <p style={{ fontSize: '17px', color: '#fff', lineHeight: '1.7', marginBottom: '24px', opacity: 0.95 }}>
                For any privacy-related questions, concerns, or to exercise your data rights, please contact us:
              </p>
               <a
  href="/contact" // Update this to your actual contact route
  style={{ 
    display: 'inline-block',
    fontSize: '18px', 
    color: '#000', 
    backgroundColor: '#fff',
    fontWeight: '700', 
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}
>
  Contact Us
</a>
            </section>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // Mobile/Native view
  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: January 31, 2026</Text>
        <Text style={styles.paragraph}>
          Full content optimized for mobile...
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_CREAM,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  paragraph: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
});