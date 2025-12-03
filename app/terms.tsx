// app/terms.tsx
import React from 'react';
import { Linking } from 'react-native';
import {
  StandardPageTemplate,
  StandardSection,
  StandardParagraph,
  StandardBulletList,
  StandardLink,
} from '@/components/StandardPageTemplate';

export default function TermsAndConditions() {
  return (
    <StandardPageTemplate
      title="Terms & Conditions | CrackJobs"
      metaDescription="Read the user agreement for CrackJobs. Guidelines for candidates and mentors using our mock interview platform."
      pageUrl="https://crackjobs.com/terms"
      pageTitle="Terms & Conditions"
      lastUpdated="November 25, 2024"
      relatedPages={[
        {
          title: "Privacy Policy",
          description: "How we protect your data",
          icon: "🔒",
          route: "/privacy"
        },
        {
          title: "Cancellation Policy",
          description: "Refund and cancellation terms",
          icon: "↩️",
          route: "/cancellation-policy"
        },
        {
          title: "Contact Support",
          description: "Get help from our team",
          icon: "💬",
          route: "/contact"
        }
      ]}
    >
      <StandardSection title="Acceptance of Terms">
        <StandardParagraph>
          By accessing and using CrackJobs, you accept and agree to be bound by these terms. If you do not agree, please do not use our services.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Use of Service">
        <StandardParagraph>
          Users agree to:
        </StandardParagraph>
        <StandardBulletList
          items={[
            "Provide accurate personal and professional information.",
            "Use the service for lawful educational purposes only.",
            "Treat mentors, candidates, and staff with respect.",
            "Maintain confidentiality of session content.",
            "Not record sessions without explicit consent."
          ]}
        />
      </StandardSection>

      <StandardSection title="Account Registration">
        <StandardParagraph>
          You must be at least 18 years old to use our services. You are responsible for maintaining the security of your account credentials and for all activities under your account.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Booking & Payments">
        <StandardParagraph>
          All session payments are held in escrow. Funds are released to the mentor only upon successful completion of the session and submission of feedback. All fees are clearly displayed before booking.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Session Conduct">
        <StandardParagraph>
          Both candidates and mentors must:
        </StandardParagraph>
        <StandardBulletList
          items={[
            "Join sessions on time and be prepared.",
            "Maintain professional behavior throughout.",
            "Provide honest and constructive feedback.",
            "Report any issues or concerns immediately."
          ]}
        />
      </StandardSection>

      <StandardSection title="Prohibited Activities">
        <StandardParagraph>
          The following activities are strictly prohibited:
        </StandardParagraph>
        <StandardBulletList
          items={[
            "Sharing login credentials with others.",
            "Recording sessions without consent.",
            "Harassment, discrimination, or inappropriate behavior.",
            "Attempting to contact mentors/candidates outside the platform.",
            "Using the platform for commercial purposes without authorization.",
            "Posting false reviews or manipulating ratings."
          ]}
        />
      </StandardSection>

      <StandardSection title="Intellectual Property">
        <StandardParagraph>
          All content on CrackJobs, including logos, designs, and text, is protected by copyright. Session feedback and evaluations belong to the respective parties but may be used anonymously for platform improvement.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Limitation of Liability">
        <StandardParagraph>
          CrackJobs is not responsible for the outcome of job interviews or hiring decisions. Our platform provides practice and feedback only. We do not guarantee employment outcomes or interview success.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Dispute Resolution">
        <StandardParagraph>
          Any disputes between users should first be reported to our support team. We will mediate fairly based on platform rules and evidence provided.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Termination">
        <StandardParagraph>
          We reserve the right to suspend or terminate accounts that violate these terms. Users may also close their accounts at any time through the profile settings.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Changes to Terms">
        <StandardParagraph>
          We reserve the right to modify these terms at any time. Users will be notified of significant changes via email. Continued use of the service constitutes acceptance of updated terms.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Governing Law">
        <StandardParagraph>
          These terms are governed by the laws of India. Any legal disputes will be resolved in the courts of Bangalore, Karnataka.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Contact">
        <StandardParagraph>
          For questions about these terms, contact us at:
        </StandardParagraph>
        <StandardLink onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}>
          crackjobshelpdesk@gmail.com
        </StandardLink>
      </StandardSection>
    </StandardPageTemplate>
  );
}