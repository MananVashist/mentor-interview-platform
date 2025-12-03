// app/faq.tsx
import React from 'react';
import { TouchableOpacity, Linking, View, Text, StyleSheet } from 'react-native';
import {
  StandardPageTemplate,
  StandardBold,
} from '@/components/StandardPageTemplate';
import { theme } from '@/lib/theme';

export default function FAQ() {
  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the top right corner, choose your role (Candidate or Mentor), and complete the registration form. For candidates, you'll need to upload your resume. For mentors, you'll go through our verification process."
        },
        {
          q: "Is CrackJobs free?",
          a: "Creating an account is free. Candidates pay per session based on mentor rates (typically ₹500-2000 per session). Mentors earn money by conducting sessions."
        },
        {
          q: "How quickly can I book a session?",
          a: "Most mentors respond within 24 hours. You can typically have your first session scheduled within 2-3 days."
        }
      ]
    },
    {
      category: "For Candidates",
      questions: [
        {
          q: "How do I choose the right mentor?",
          a: "Browse mentors by their expertise area (PM, Data Science, etc.). Check their professional title and years of experience. Since we cannot provide personal information, we recommend booking an initial session to see if it's a good fit."
        },
        {
          q: "What happens during a mock interview session?",
          a: "Sessions typically last 60-90 minutes. You'll join a video call where the mentor conducts a realistic interview based on your target role. Afterward, you'll receive detailed feedback on your performance."
        },
        {
          q: "How do I prepare for a session?",
          a: "Treat it like a real interview! Review common questions for your role, have your resume ready, and ensure you have a quiet space with stable internet. Mentors may share specific prep materials beforehand."
        },
        {
          q: "Can I reschedule or cancel a session?",
          a: "No you cannot. See our Cancellation Policy for full details."
        },
        {
          q: "Will I get feedback after the session?",
          a: "Absolutely! You'll receive a detailed written evaluation within 48 hours, covering technical skills, communication, problem-solving, and specific areas for improvement."
        }
      ]
    },
    {
      category: "For Mentors",
      questions: [
        {
          q: "Who can become a mentor?",
          a: "Professionals with 3+ years of experience who regularly interview candidates at their companies. We look for strong communication skills and a passion for helping others succeed."
        },
        {
          q: "How much can I earn?",
          a: "Mentors set their own rates, typically ₹500-2000 per session. Top mentors conducting 5-10 sessions per week can earn ₹10,000-40,000 monthly."
        },
        {
          q: "How does the approval process work?",
          a: "After registration, our team reviews your profile, work history, and LinkedIn. If approved (usually within 3-5 days), you can start accepting bookings immediately."
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
          q: "What video platform do you use?",
          a: "Sessions are conducted via Jitsi. You'll receive a meeting link in your confirmation email and calendar invite."
        },
        {
          q: "Is my data secure?",
          a: "Yes. We use industry-standard encryption and secure storage. Your personal details are never shared without consent. See our Privacy Policy for full details."
        },
        {
          q: "Do you record sessions?",
          a: "No. Sessions are live and private. Only the candidate and mentor are present. If you'd like to record for personal review, ask your mentor first."
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
          a: "Refund amount depends on cancellation timing: 48+ hours (100%), 24-48 hours (80%), less than 24 hours (50%). Refunds are processed to your original payment method within 5-7 business days."
        },
        {
          q: "What if I'm not satisfied with a session?",
          a: "Report issues within 24 hours to crackjobshelpdesk@gmail.com. Our team will review and may issue a partial or full refund based on the situation."
        }
      ]
    }
  ];

  // SEO: FAQPage Schema
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

  return (
    <StandardPageTemplate
      title="FAQ - Frequently Asked Questions | CrackJobs"
      metaDescription="Get answers to common questions about CrackJobs mock interviews, booking sessions, payments, refunds, and more."
      pageUrl="https://crackjobs.com/faq"
      pageTitle="Frequently Asked Questions"
      lastUpdated="November 25, 2024"
      additionalSchema={faqSchema}
      relatedPages={[
        {
          title: "How It Works",
          description: "See our 5-step process",
          icon: "📖",
          route: "/how-it-works"
        },
        {
          title: "Contact Support",
          description: "Still have questions?",
          icon: "📧",
          route: "/contact"
        },
        {
          title: "Pricing",
          description: "View mentor rates",
          icon: "💰",
          route: "/auth/sign-up"
        }
      ]}
    >
      {faqCategories.map((category, idx) => (
        <View key={idx} style={styles.categorySection}>
          <Text style={styles.categoryTitle} accessibilityRole="header" aria-level={2}>
            {category.category}
          </Text>
          {category.questions.map((item, qIdx) => (
            <View key={qIdx} style={styles.faqCard}>
              <Text style={styles.question} accessibilityRole="header" aria-level={3}>
                {item.q}
              </Text>
              <Text style={styles.answer}>{item.a}</Text>
            </View>
          ))}
        </View>
      ))}

      {/* Contact Section */}
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
    </StandardPageTemplate>
  );
}

const styles = StyleSheet.create({
  categorySection: {
    marginBottom: 40,
  },
  categoryTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 24,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  faqCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    ...theme.shadows.card,
  },
  question: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
    color: theme.colors.text.main,
    marginBottom: 8,
  },
  answer: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.body,
    lineHeight: 24,
  },
  contactSection: {
    alignItems: 'center',
    marginTop: 40,
    padding: 32,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    ...theme.shadows.card,
  },
  contactTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 24,
    color: theme.colors.text.main,
    marginBottom: 12,
  },
  contactText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.body,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 500,
  },
  contactButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: theme.colors.surface,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
  },
});