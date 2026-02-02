// app/terms.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
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

export default function TermsAndConditions() {
  if (Platform.OS === 'web') {
    return (
      <>
        <Head>
          <title>Terms & Conditions | CrackJobs</title>
          <meta name="description" content="Read the user agreement for CrackJobs. Guidelines for candidates and mentors using our mock interview platform." />
          <meta name="keywords" content="terms of service, user agreement, crackjobs terms, legal, mock interview platform rules" />
          <link rel="canonical" href="https://crackjobs.com/terms" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://crackjobs.com/terms" />
          <meta property="og:title" content="Terms & Conditions | CrackJobs" />
          <meta property="og:description" content="Read the user agreement for CrackJobs. Guidelines for candidates and mentors using our mock interview platform." />
          <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        </Head>

        <div style={{ minHeight: '100vh', backgroundColor: BG_CREAM , overflowY: 'auto' }}>
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
                Terms & Conditions
              </h1>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>
                Last Updated: January 31, 2026
              </p>
            </header>

            {/* Introduction */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                Acceptance of Terms
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                Welcome to CrackJobs! By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
              </p>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                If you do not agree with any part of these terms, you must not use CrackJobs. These terms constitute a legally binding agreement between you and CrackJobs.
              </p>
            </section>

            {/* Definitions */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Definitions
              </h2>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>"Platform"</strong> refers to the CrackJobs website, mobile application, and all associated services</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>"User"</strong> means any person who accesses or uses the Platform, including Candidates and Mentors</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>"Candidate"</strong> refers to users seeking mock interview practice</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>"Mentor"</strong> refers to verified professionals conducting mock interviews</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>"Session"</strong> means a scheduled mock interview between a Candidate and Mentor</li>
              </ul>
            </section>

            {/* Eligibility */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Eligibility and Account Registration
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                To use CrackJobs, you must:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Be at least 18 years of age</li>
                <li style={{ marginBottom: '8px' }}>Have the legal capacity to enter into binding contracts</li>
                <li style={{ marginBottom: '8px' }}>Provide accurate, current, and complete information during registration</li>
                <li style={{ marginBottom: '8px' }}>Maintain the confidentiality of your account credentials</li>
                <li style={{ marginBottom: '8px' }}>Be responsible for all activities that occur under your account</li>
              </ul>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', padding: '16px', backgroundColor: '#FEE2E2', borderLeft: '4px solid #DC2626', borderRadius: '4px' }}>
                <strong style={{ color: '#991B1B' }}>Important:</strong> You may not share your account credentials or allow others to use your account. Any violation may result in immediate account termination.
              </p>
            </section>

            {/* Use of Service */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Acceptable Use Policy
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                Users agree to use CrackJobs only for lawful purposes. You must:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Be Truthful:</strong> Provide accurate information about your professional background, experience, and qualifications</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Be Respectful:</strong> Treat all users, including Candidates, Mentors, and staff with courtesy and professionalism</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Maintain Confidentiality:</strong> Keep session content, feedback, and discussions private unless agreed otherwise</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Follow Guidelines:</strong> Adhere to platform policies, session protocols, and community standards</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Use Lawfully:</strong> Use the platform only for educational mock interview purposes</li>
              </ul>
            </section>

            {/* Mentor Specific Terms */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Mentor-Specific Terms
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                Verification Process
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                All Mentors must complete a verification process including:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>LinkedIn profile verification</li>
                <li style={{ marginBottom: '8px' }}>Professional background check</li>
                <li style={{ marginBottom: '8px' }}>Sample interview evaluation (may be required)</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Mentor Obligations
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                As a Mentor, you agree to:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Conduct professional, high-quality mock interviews</li>
                <li style={{ marginBottom: '8px' }}>Provide detailed, constructive feedback within 48 hours of each session</li>
                <li style={{ marginBottom: '8px' }}>Honor your scheduled sessions and reschedule if required</li>
                <li style={{ marginBottom: '8px' }}>Maintain up-to-date availability on your calendar</li>
                <li style={{ marginBottom: '8px' }}>Not solicit candidates for services outside the platform</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Payment Terms for Mentors
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                Mentor payments are processed as follows:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '8px' }}>Payments held in escrow until session completion and feedback submission</li>
                <li style={{ marginBottom: '8px' }}>Funds released within 48 hours of feedback submission</li>
                <li style={{ marginBottom: '8px' }}>Mentors responsible for applicable taxes on their earnings</li>
              </ul>
            </section>

            {/* Booking and Payments */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Booking and Payment Terms
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                All session bookings are subject to the following terms:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Pricing:</strong> All session fees are clearly displayed before booking. Prices may vary based on mentor experience and session type</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Payment Processing:</strong> Payments are processed securely through Razorpay. We accept credit/debit cards, UPI, net banking, and digital wallets</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Escrow System:</strong> Candidate payments are held in escrow and only released to mentors upon successful session completion</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Booking Confirmation:</strong> You'll receive email confirmation with session details, meeting link, and calendar invite</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Session Duration:</strong> Standard sessions last 55 minutes unless otherwise specified</li>
              </ul>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                For cancellation and refund policies, please see our <a href="/cancellation-policy" style={{ color: '#18a7a7', fontWeight: '600', textDecoration: 'underline' }}>Cancellation Policy</a>.
              </p>
            </section>

            {/* Session Conduct */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Session Conduct and Expectations
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                Before the Session
              </h3>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Ensure stable internet connection and working camera/microphone</li>
                <li style={{ marginBottom: '8px' }}>Choose a quiet, professional environment</li>
                <li style={{ marginBottom: '8px' }}>Review session materials if provided by mentor</li>
                <li style={{ marginBottom: '8px' }}>Join the meeting on time (within 15 minutes of scheduled start)</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                During the Session
              </h3>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Maintain professional behavior and appearance</li>
                <li style={{ marginBottom: '8px' }}>Give your full attention to the session</li>
                <li style={{ marginBottom: '8px' }}>Participate actively and honestly</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                After the Session
              </h3>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '8px' }}>Mentors must provide detailed feedback within 48 hours</li>
                <li style={{ marginBottom: '8px' }}>Candidates may rate and review their experience</li>
                <li style={{ marginBottom: '8px' }}>Report any issues to support within 24 hours</li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Strictly Prohibited Activities
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                The following activities will result in immediate account suspension or termination:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Impersonation:</strong> Misrepresenting your identity, credentials, or professional background</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Harassment:</strong> Engaging in any form of harassment, discrimination, or inappropriate behavior</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Off-Platform Solicitation:</strong> Attempting to contact or transact with users outside the platform to avoid fees</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>False Reviews:</strong> Posting fake reviews, manipulating ratings, or incentivizing positive feedback</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Multiple Accounts:</strong> Creating multiple accounts to circumvent restrictions or manipulate the system</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Platform Abuse:</strong> Attempting to hack, scrape, or misuse the platform in any way</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Commercial Misuse:</strong> Using the platform for unauthorized commercial purposes or advertising</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Intellectual Property Rights
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                Platform Content
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '20px' }}>
                All content on CrackJobs, including but not limited to logos, designs, text, graphics, software, and other materials, is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our explicit written permission.
              </p>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                User Content
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                You retain ownership of content you create or upload (feedback and reviews). By using CrackJobs, you grant us a limited license to:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '8px' }}>Display your content on the platform to facilitate services</li>
                <li style={{ marginBottom: '8px' }}>Use anonymized feedback and session data for quality improvement</li>
                <li style={{ marginBottom: '8px' }}>Create aggregated, anonymized statistics for analysis and marketing</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Disclaimers and Limitation of Liability
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                Service Disclaimer
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '20px' }}>
                CrackJobs is an educational platform providing mock interview practice. We do not:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Guarantee employment outcomes or interview success</li>
                <li style={{ marginBottom: '8px' }}>Endorse or verify the accuracy of mentor feedback</li>
                <li style={{ marginBottom: '8px' }}>Take responsibility for interactions between users</li>
                <li style={{ marginBottom: '8px' }}>Guarantee platform availability or error-free operation</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Limitation of Liability
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                To the maximum extent permitted by law, CrackJobs and its affiliates shall not be liable for:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Indirect, incidental, or consequential damages</li>
                <li style={{ marginBottom: '8px' }}>Loss of profits, data, or opportunities</li>
                <li style={{ marginBottom: '8px' }}>Damages arising from user interactions or mentor feedback</li>
                <li style={{ marginBottom: '8px' }}>Technical failures, interruptions, or data loss</li>
              </ul>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                Our total liability for any claim shall not exceed the amount paid by you for the specific service in question, or ₹5,000, whichever is less.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Dispute Resolution
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                In case of disputes between users or with the platform:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Internal Resolution:</strong> First report the issue to our support team at crackjobshelpdesk@gmail.com with relevant details and evidence</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Investigation:</strong> We will investigate within 5-7 business days and attempt to mediate a fair resolution</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#111827' }}>Final Decision:</strong> CrackJobs reserves the right to make final decisions on disputes based on platform policies and available evidence</li>
              </ul>
            </section>

            {/* Termination */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Account Termination
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                By You
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '20px' }}>
                You may request to close your account at any time by dropping a mail at crackjobshelpdesk@gmail. Upon account closure, you will lose access to all platform features, historical session data, and feedback.
              </p>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                By CrackJobs
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                We reserve the right to suspend or terminate accounts that:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '8px' }}>Violate these Terms and Conditions</li>
                <li style={{ marginBottom: '8px' }}>Engage in fraudulent or abusive behavior</li>
                <li style={{ marginBottom: '8px' }}>Receive multiple complaints or negative reports</li>
                <li style={{ marginBottom: '8px' }}>Remain inactive for extended periods</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Modifications to Terms
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                CrackJobs reserves the right to modify these Terms and Conditions at any time. Changes will be communicated through:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Email notification to registered users</li>
                <li style={{ marginBottom: '8px' }}>Prominent notice on the platform</li>
                <li style={{ marginBottom: '8px' }}>Updated "Last Modified" date at the top of this page</li>
              </ul>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                Significant changes will be notified at least 30 days before taking effect. Your continued use of CrackJobs after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Governing Law */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Governing Law and Jurisdiction
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                These Terms and Conditions are governed by the laws of India. Any legal disputes arising from these terms or your use of CrackJobs will be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
              </p>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                You consent to personal jurisdiction and venue in these courts and waive any objection based on forum non conveniens.
              </p>
            </section>

            {/* Contact */}
            <section style={{ backgroundColor: '#18a7a7', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                Questions About These Terms?
              </h2>
              <p style={{ fontSize: '17px', color: '#fff', lineHeight: '1.7', marginBottom: '24px', opacity: 0.95 }}>
                For questions, concerns, or clarifications regarding these Terms and Conditions:
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
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.lastUpdated}>Last Updated: November 25, 2024</Text>
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
}); 