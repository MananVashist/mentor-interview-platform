// app/faq.tsx
import React from 'react';
import { TouchableOpacity, Linking, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
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

export default function FAQ() {
  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the top right corner, choose your role (Candidate or Mentor), and complete the registration form. For mentors, you'll go through our verification process."
        },
        {
          q: "Is CrackJobs free?",
          a: "Creating an account is free. Candidates pay per session based on mentor rates and experience. Mentors earn money by conducting sessions."
        },
        {
          q: "How quickly can I book a session?",
          a: "You can schedule a session one day in advance at the earliest. "
        }
      ]
    },
    {
      category: "For Candidates",
      questions: [
        {
          q: "How do I choose the right mentor?",
          a: "Browse mentors by their expertise area (PM, Data Analytics, Data Science, HR). Check their professional title, no of sessions, rating, years of experience and about the mentor section"
        },
        {
          q: "What happens during a mock interview session?",
          a: "Sessions typically last 55 minutes. You'll join a video call where the mentor conducts a realistic interview based on your target role. Afterward, you'll receive detailed feedback on your performance and a recording of the interview."
        },
        {
          q: "How do I prepare for a session?",
          a: "Treat it like a real interview! Review common questions for your role, have your resume ready, and ensure you have a quiet space with stable internet. This platform tests if you are ready for an interview and provides feedback on the same"
        },
        {
          q: "Can I reschedule or cancel a session?",
          a: "You can reschedule a session but not cancel it. If a mentor no-shows on the agreed time, the full amount will be refunded"
        },
        {
          q: "Will I get feedback after the session?",
          a: "Absolutely! You'll receive a detailed written evaluation within 48 hours, covering all tested aspects in the interview and specific areas for improvement."
        }
      ]
    },
    {
      category: "For Mentors",
      questions: [
        {
          q: "Who can become a mentor?",
          a: "Professionals with 5+ years of experience who regularly interview candidates at their companies. We look for strong communication skills and a passion for helping others succeed."
        },
        {
          q: "How does the approval process work?",
          a: "After registration, our team reviews your profile, work history, and LinkedIn. We will conduct screening rounds as per requirement. If approved (usually within 3-5 days), you can start accepting bookings immediately."
        },
        {
          q: "When do I get paid?",
          a: "Payments are released within 48 hours after you submit feedback for a completed session. Funds are transferred to your linked bank account or UPI."
        }
      ]
    },
    {
      category: "Technical & Platform",
      questions: [
        {
          q: "Is my data secure?",
          a: "Yes. We use industry-standard encryption and secure storage. Your personal details are never shared without consent. See our Privacy Policy for full details."
        },
        {
          q: "Do you record sessions?",
          a: "Yes. We record every session and share it with you as well"
        },
        {
          q: "What if I experience technical issues?",
          a: "Contact support immediately via crackjobshelpdesk@gmail.com. If a session can't be completed due to our platform issues, you'll receive a full refund or free rescheduling."
        }
      ]
    },
    {
      category: "Payments & Refunds",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept credit/debit cards, UPI, net banking, and wallets via Razorpay. All transactions are secure and encrypted."
        },
        {
          q: "How do refunds work?",
          a: "Refundss are only done in case of mentor no-show. Refunds are processed to your original payment method within 5-7 business days."
        },
        {
          q: "What if I'm not satisfied with a session?",
          a: "Report issues within 24 hours to crackjobshelpdesk@gmail.com. Our team will review and may issue a partial or full refund based on the situation."
        }
      ]
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap(category =>
      category.questions.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    )
  };

  if (Platform.OS === 'web') {
    return (
      <>
        <Head>
          <title>FAQ - Frequently Asked Questions | CrackJobs</title>
          <meta name="description" content="Get answers to common questions about CrackJobs mock interviews, booking sessions, payments, refunds, and more." />
          <meta name="keywords" content="faq, frequently asked questions, crackjobs help, interview prep questions, mentor questions, payment faq" />
          <link rel="canonical" href="https://crackjobs.com/faq" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://crackjobs.com/faq" />
          <meta property="og:title" content="FAQ - Frequently Asked Questions | CrackJobs" />
          <meta property="og:description" content="Get answers to common questions about CrackJobs mock interviews, booking sessions, payments, refunds, and more." />
          <meta property="og:image" content="https://crackjobs.com/og-image.png" />
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
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
                Frequently Asked Questions
              </h1>
              <p style={{ fontSize: '17px', color: '#6B7280', marginBottom: '8px' }}>
                Everything you need to know about CrackJobs
              </p>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>
                Last Updated: November 25, 2024
              </p>
            </header>

            {faqCategories.map((category, idx) => (
              <section key={idx} style={{ marginBottom: '48px' }}>
                <h2 style={{ 
                  fontSize: '28px',
                  fontWeight: '700', 
                  color: '#18a7a7', 
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderBottom: '3px solid #18a7a7'
                }}>
                  {category.category}
                </h2>
                
                {category.questions.map((item, qIdx) => (
                  <div key={qIdx} style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '28px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s'
                  }}>
                    <h3 style={{
                      fontSize: '19px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '12px',
                      lineHeight: '1.4'
                    }}>
                      {item.q}
                    </h3>
                    <p style={{
                      fontSize: '17px',
                      color: '#4B5563',
                      lineHeight: '1.7',
                      margin: 0
                    }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </section>
            ))}

            {/* Contact Section */}
            <section style={{
              backgroundColor: '#18a7a7',
              padding: '48px 32px',
              borderRadius: '16px',
              textAlign: 'center',
              marginTop: '60px'
            }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '16px'
              }}>
                Still have questions?
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#fff',
                lineHeight: '1.6',
                marginBottom: '28px',
                maxWidth: '600px',
                margin: '0 auto 28px',
                opacity: 0.95
              }}>
                Our support team is here to help. Reach out and we'll respond within 24-48 hours.
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
        <Text style={styles.title}>Frequently Asked Questions</Text>
        <Text style={styles.subtitle}>Everything you need to know about CrackJobs</Text>
        <Text style={styles.lastUpdated}>Last Updated: November 25, 2024</Text>
        
        {faqCategories.map((category, idx) => (
          <View key={idx} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            {category.questions.map((item, qIdx) => (
              <View key={qIdx} style={styles.faqCard}>
                <Text style={styles.question}>{item.q}</Text>
                <Text style={styles.answer}>{item.a}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still have questions?</Text>
          <Text style={styles.contactText}>
            Our support team is here to help. Reach out and we'll respond within 24-48 hours.
          </Text>
          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}
          >
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  categorySection: {
    marginBottom: 40,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18a7a7',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#18a7a7',
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
    lineHeight: 24,
  },
  answer: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  contactSection: {
    alignItems: 'center',
    marginTop: 40,
    padding: 40,
    backgroundColor: '#18a7a7',
    borderRadius: 16,
  },
  contactTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    opacity: 0.95,
  },
  contactButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#18a7a7',
    fontSize: 18,
    fontWeight: '700',
  },
}); 