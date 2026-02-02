// app/cancellation-policy.tsx
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

export default function CancellationPolicy() {
  if (Platform.OS === 'web') {
    return (
      <>
        <Head>
          <title>Cancellation & Refund Policy | CrackJobs</title>
          <meta name="description" content="Understand our refund terms. Fair policies for candidates and mentors regarding cancellations, no-shows, and rescheduling." />
          <meta name="keywords" content="cancellation policy, refund policy, crackjobs refunds, mentor cancellation, candidate cancellation, no-show policy" />
          <link rel="canonical" href="https://crackjobs.com/cancellation-policy" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://crackjobs.com/cancellation-policy" />
          <meta property="og:title" content="Cancellation & Refund Policy | CrackJobs" />
          <meta property="og:description" content="Understand our refund terms. Fair policies for candidates and mentors regarding cancellations, no-shows, and rescheduling." />
          <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        </Head>

        <div style={{ minHeight: '100vh', backgroundColor: BG_CREAM, overflowY: 'auto' }}>
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
                Cancellation & Refund Policy
              </h1>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>
                Last Updated: November 25, 2024
              </p>
            </header>

            {/* Overview */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                Policy Overview
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                At CrackJobs, we strive to maintain fairness for both candidates and mentors. This policy outlines our approach to cancellations, refunds, no-shows, and rescheduling to ensure a smooth experience for everyone.
              </p>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                Please review this policy carefully before booking sessions.
              </p>
            </section>

            {/* Candidate Cancellation */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Candidate-Initiated Cancellation
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                Refund Policy
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                Refund is only done for the candidate when the mentor is a no-show or in some cases when the session is not satisfactory:
              </p>

              <div style={{ padding: '16px', backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '4px', marginTop: '20px' }}>
                <p style={{ fontSize: '17px', color: '#92400E', lineHeight: '1.7', margin: 0 }}>
                  <strong>Important:</strong> Late arrivals (joining 15+ minutes after start time) are treated as no-shows.
                </p>
              </div>
            </section>

            {/* Mentor Cancellation */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Mentor-Initiated Cancellation
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                We hold mentors to high reliability standards to respect candidates' time and preparation:
              </p>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Late Cancellation or No-Show
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                If a mentor does not join within 15 minutes of the scheduled start time without prior notice:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Candidate receives immediate 100% automatic refund</li>
                <li style={{ marginBottom: '8px' }}>Mentor's reliability score is significantly impacted</li>
                <li style={{ marginBottom: '8px' }}>Mentor may face account review and restrictions</li>
                <li style={{ marginBottom: '8px' }}>Repeated offenses result in temporary or permanent suspension</li>
              </ul>

              <div style={{ padding: '16px', backgroundColor: '#DBEAFE', borderLeft: '4px solid #3B82F6', borderRadius: '4px', marginTop: '20px' }}>
                <p style={{ fontSize: '17px', color: '#1E40AF', lineHeight: '1.7', margin: 0 }}>
                  <strong>For Candidates:</strong> If your mentor doesn't show up, you don't need to do anything. The refund is automatic. However, please report it to support so we can take appropriate action.
                </p>
              </div>
            </section>

            {/* No-Show Policy */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                No-Show Policy in Detail
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                What Qualifies as a No-Show?
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                A no-show occurs when either party does not join the video session within <strong style={{ color: '#111827' }}>15 minutes</strong> of the scheduled start time. This 15-minute grace period accounts for minor delays.
              </p>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Consequences
              </h3>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#111827' }}>Candidate No-Show:</strong> No refund issued. Payment goes to mentor for reserved time. Multiple no-shows may result in booking restrictions.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#111827' }}>Mentor No-Show:</strong> Immediate full refund to candidate. Mentor faces account penalties and potential suspension.
                </li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Disputed No-Shows
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                If you believe a no-show was incorrectly recorded:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '8px' }}>Contact support immediately at crackjobshelpdesk@gmail.com</li>
                <li style={{ marginBottom: '8px' }}>Provide screenshots or evidence of your attendance attempt</li>
                <li style={{ marginBottom: '8px' }}>Our team will review meeting logs and connection data</li>
                <li style={{ marginBottom: '8px' }}>Resolution provided within 2-3 business days</li>
              </ul>
            </section>

            {/* Rescheduling */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Rescheduling Sessions
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                Rescheduling
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                The mentor can either accept the time of the meeting or choose to reschedule
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Candidate will be given the option to accept/reschedule the proposed time</li>
                <li style={{ marginBottom: '8px' }}>Subject to mentor availability</li>
              </ul>

             
            </section>

            {/* Technical Issues */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Technical Issues and Interruptions
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                If a session cannot be completed due to technical problems:
              </p>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                Platform Issues
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                If our platform (video, chat, etc.) fails:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Both parties receive compensation</li>
                <li style={{ marginBottom: '8px' }}>Candidate gets full refund or free rescheduling</li>
                <li style={{ marginBottom: '8px' }}>Mentor receives full payment if they were available</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                User Internet Issues
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '12px' }}>
                Internet connectivity problems on either party's end:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>If session starts but is interrupted: Mentor and candidate should attempt to reconnect for 15 minutes</li>
                <li style={{ marginBottom: '8px' }}>If more than 50% of session completed: No refund, full payment to mentor</li>
                <li style={{ marginBottom: '8px' }}>If less than 50% completed: Partial refund (50%) and mentor receives 50%</li>
                <li style={{ marginBottom: '8px' }}>Both parties should contact support to document the issue</li>
              </ul>

              <div style={{ padding: '16px', backgroundColor: '#F3F4F6', borderLeft: '4px solid #6B7280', borderRadius: '4px', marginTop: '20px' }}>
                <p style={{ fontSize: '17px', color: '#374151', lineHeight: '1.7', margin: 0 }}>
                  <strong>Best Practice:</strong> Test your internet connection and equipment before sessions. Have a backup plan (mobile hotspot, phone call option) ready for critical interviews.
                </p>
              </div>
            </section>

            {/* Quality Guarantee */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Quality Guarantee
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                We're committed to high-quality experiences. If you're unsatisfied with a session due to any of the following, reach out to crackjobshelpdesk@gmail.com:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Unprofessional mentor conduct or behavior</li>
                <li style={{ marginBottom: '8px' }}>Lack of preparation or expertise from mentor</li>
                <li style={{ marginBottom: '8px' }}>Session significantly shorter than advertised</li>
                <li style={{ marginBottom: '8px' }}>Failure to provide promised feedback</li>
              </ul>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                How to Request a Quality Review
              </h3>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '8px' }}>Report the issue within 24 hours of session completion</li>
                <li style={{ marginBottom: '8px' }}>Provide detailed explanation of the concerns</li>
                <li style={{ marginBottom: '8px' }}>Include session recording if available (with consent)</li>
                <li style={{ marginBottom: '8px' }}>Our team reviews within 3-5 business days</li>
                <li style={{ marginBottom: '8px' }}>May result in partial or full refund at our discretion</li>
              </ul>
            </section>

            {/* Refund Processing */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Refund Processing Timeline
              </h2>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                Automatic Refunds
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                For approved refunds (cancellations, mentor no-shows):
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Refund initiated within 24 hours of cancellation/no-show</li>
                <li style={{ marginBottom: '8px' }}>Funds returned to original payment method</li>
                <li style={{ marginBottom: '8px' }}>Processing time: 5-7 business days</li>
                <li style={{ marginBottom: '8px' }}>Bank processing times may vary (additional 2-3 days)</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Disputed Refunds
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                For quality guarantee or technical issue refunds:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '8px' }}>Review period: 3-5 business days</li>
                <li style={{ marginBottom: '8px' }}>Decision communicated via email</li>
                <li style={{ marginBottom: '8px' }}>If approved, refund processed within 24 hours</li>
                <li style={{ marginBottom: '8px' }}>Total timeline: 7-14 business days from report to refund</li>
              </ul>
            </section>

            {/* Non-Refundable */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Non-Refundable Items
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                The following are not eligible for refunds:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px' }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#111827' }}>Completed Sessions:</strong> Sessions where mentor provided feedback and no quality issues were reported within 24 hours
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#111827' }}>Candidate No-Shows:</strong> Sessions marked as no-show due to candidate not attending
                </li>
                
                <li style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#111827' }}>Payment Processing Fees:</strong> Transaction fees charged by payment processors (typically ₹20 or 2%)
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#111827' }}>Platform Service Fees:</strong> If applicable and disclosed at time of booking
                </li>
              </ul>
            </section>

            {/* Disputes */}
            <section style={{ marginBottom: '48px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                Dispute Resolution Process
              </h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                If you believe a refund decision was incorrect or need to dispute a cancellation:
              </p>
              
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginBottom: '12px' }}>
                Step 1: Contact Support
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                Email crackjobshelpdesk@gmail.com with:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Booking ID and session details</li>
                <li style={{ marginBottom: '8px' }}>Clear explanation of the dispute</li>
                <li style={{ marginBottom: '8px' }}>Supporting evidence (screenshots, recordings, etc.)</li>
                <li style={{ marginBottom: '8px' }}>Your desired resolution</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Step 2: Investigation
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '16px' }}>
                Our team will:
              </p>
              <ul style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.8', paddingLeft: '28px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Review all submitted evidence</li>
                <li style={{ marginBottom: '8px' }}>Check platform logs and session data</li>
                <li style={{ marginBottom: '8px' }}>Contact both parties if needed</li>
                <li style={{ marginBottom: '8px' }}>Make a fair decision based on our policies</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#18a7a7', marginTop: '24px', marginBottom: '12px' }}>
                Step 3: Resolution
              </h3>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7' }}>
                Final decision communicated within 5-7 business days. Our decisions are final and binding. In rare cases of continued disagreement, matters may be escalated to our management team for final review.
              </p>
            </section>

            {/* Contact */}
            <section style={{ backgroundColor: '#18a7a7', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                Questions About Cancellations or Refunds?
              </h2>
              <p style={{ fontSize: '17px', color: '#fff', lineHeight: '1.7', marginBottom: '24px', opacity: 0.95 }}>
                Our support team is here to help with any questions or concerns:
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
        <Text style={styles.title}>Cancellation & Refunds</Text>
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