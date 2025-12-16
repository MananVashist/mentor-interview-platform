// app/privacy.tsx
import React from 'react';
import { Linking } from 'react-native';
import {
  StandardPageTemplate,
  StandardSection,
  StandardParagraph,
  StandardBulletList,
  StandardLink,
} from '@/components/StandardPageTemplate';
import { SEO } from '@/components/SEO';
import { SEO_CONFIG } from '@/config/seo';


export default function PrivacyPolicy() {
  return (
        <>    <SEO {...SEO_CONFIG.privacy} />

    <StandardPageTemplate
      title="Privacy Policy | CrackJobs"
      metaDescription="We value your privacy. Learn how CrackJobs handles your data, resumes, and interview recordings."
      pageUrl="https://crackjobs.com/privacy"
      pageTitle="Privacy Policy"
      lastUpdated="November 25, 2024"
      relatedPages={[
        {
          title: "Terms & Conditions",
          description: "Read our user agreement and guidelines",
          icon: "📋",
          route: "/terms"
        },
        {
          title: "Cancellation Policy",
          description: "Learn about our refund and cancellation terms",
          icon: "↩️",
          route: "/cancellation-policy"
        },
        {
          title: "Contact Us",
          description: "Get in touch with our support team",
          icon: "📧",
          route: "/contact"
        }
      ]}
    >
      <StandardSection title="Introduction">
        <StandardParagraph>
          At CrackJobs, we take your privacy seriously. This Privacy Policy explains how we collect, use, and safeguard your information.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Information We Collect">
        <StandardParagraph>
          We collect information provided directly by you, including:
        </StandardParagraph>
        <StandardBulletList
          items={[
            "Personal Identifiers: Name, email, phone number.",
            "Professional Info: Resume, job role, experience.",
            "Session Content: Interview recordings and written feedback."
          ]}
        />
      </StandardSection>

      <StandardSection title="How We Use Your Information">
        <StandardParagraph>
          Your information is used to:
        </StandardParagraph>
        <StandardBulletList
          items={[
            "Match you with appropriate mentors.",
            "Facilitate mock interview sessions.",
            "Provide personalized feedback and reports.",
            "Process payments and manage bookings.",
            "Improve our platform and services."
          ]}
        />
      </StandardSection>

      <StandardSection title="Data Security">
        <StandardParagraph>
          We utilize Supabase Row Level Security (RLS) and encrypted storage to protect your data. Payment data is handled securely via Razorpay and never stored on our servers.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Data Sharing">
        <StandardParagraph>
          We do not sell your personal data. Your information is shared only with:
        </StandardParagraph>
        <StandardBulletList
          items={[
            "Mentors (limited to professional details needed for sessions).",
            "Payment processors (Razorpay) for transaction processing.",
            "Service providers who assist in platform operations."
          ]}
        />
      </StandardSection>

      <StandardSection title="Your Rights">
        <StandardParagraph>
          You have the right to access, modify, or delete your personal data at any time. You can also request a copy of all data we hold about you. Contact us to exercise these rights.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Cookies & Tracking">
        <StandardParagraph>
          We use cookies and similar technologies to improve user experience, analyze platform usage, and personalize content. You can control cookie preferences through your browser settings.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Changes to This Policy">
        <StandardParagraph>
          We may update this Privacy Policy from time to time. Significant changes will be communicated via email or platform notification.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Contact">
        <StandardParagraph>
          For privacy-related questions or concerns, contact us at:
        </StandardParagraph>
        <StandardLink onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}>
          crackjobshelpdesk@gmail.com
        </StandardLink>
      </StandardSection>
    </StandardPageTemplate>
    </>
  );
}