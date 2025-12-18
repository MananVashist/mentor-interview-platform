// app/cancellation-policy.tsx
import React from 'react';
import {
  StandardPageTemplate,
  StandardSection,
  StandardParagraph,
  StandardBulletList,
  StandardBold,
} from '@/components/StandardPageTemplate';
import { SEO } from '@/components/SEO';
import { SEO_CONFIG } from '@/config/seo';

export default function CancellationPolicy() {
  return (
    <>
      {/* FIX: Added 'canonical' prop explicitly.
        This tells Google this is the master copy of the page.
      */}
      <SEO 
        {...SEO_CONFIG.cancellation} 
        canonical="https://crackjobs.com/cancellation-policy" 
      />

      <StandardPageTemplate
        title="Cancellation & Refund Policy | CrackJobs"
        metaDescription="Understand our refund terms. Fair policies for candidates and mentors."
        pageUrl="https://crackjobs.com/cancellation-policy"
        pageTitle="Cancellation & Refunds"
        lastUpdated="November 25, 2024"
        relatedPages={[
          {
            title: "Terms & Conditions",
            description: "Full user agreement",
            icon: "📋",
            route: "/terms"
          },
          {
            title: "Contact Support",
            description: "Need help? Reach out to us",
            icon: "📞",
            route: "/contact"
          },
          {
            title: "FAQ",
            description: "Common questions answered",
            icon: "❓",
            route: "/faq"
          }
        ]}
      >
        <StandardSection title="1. Candidate Initiated Cancellation">
          <StandardParagraph>
            Refunds are determined based on the notice provided before the session start time:
          </StandardParagraph>
          <StandardBulletList
            items={[
              <>
                <StandardBold>Show up for the meeting within 15 mins of start</StandardBold> No late fee
              </>,
              <>
                <StandardBold>No-Show:</StandardBold> 0% Refund. Full payment retained.
              </>
            ]}
          />
        
        </StandardSection>

        <StandardSection title="2. Mentor Cancellation">
          <StandardParagraph>
            If a mentor does not show up for the session, the candidate receives a <StandardBold>100% automatic refund</StandardBold> regardless of timing. The mentor's reliability score may be impacted.
          </StandardParagraph>
        </StandardSection>

        <StandardSection title="3. No-Show Policy">
          <StandardParagraph>
            If a candidate does not join the session within 15 minutes of the start time without prior notice, it is considered a no-show. No refund will be issued, and the full payment is released to the mentor.
          </StandardParagraph>
          <StandardParagraph>
            If a mentor does not join within 15 minutes, candidates should report it immediately. A full refund will be issued, and the mentor may face account restrictions.
          </StandardParagraph>
        </StandardSection>

        <StandardSection title="4. Rescheduling">
          <StandardParagraph>
            Each booking allows <StandardBold>one free reschedule</StandardBold> Additional reschedule requests are subject to mentor approval.
          </StandardParagraph>
        </StandardSection>

        <StandardSection title="5. Technical Issues">
          <StandardParagraph>
            If a session cannot be completed due to platform technical issues, both parties will be compensated:
          </StandardParagraph>
          <StandardBulletList
            items={[
              "Candidate receives a full refund or free rescheduling.",
              "Mentor receives compensation for their time if they were available."
            ]}
          />
        </StandardSection>

        <StandardSection title="6. Quality Guarantee">
          <StandardParagraph>
            If you are unsatisfied with a session due to mentor conduct or lack of preparation, record the session and report it within 24 hours. Our team will review and may issue a partial or full refund at our discretion.
          </StandardParagraph>
        </StandardSection>

        <StandardSection title="7. Processing Timeline">
          <StandardParagraph>
            Approved refunds are processed to the original payment method within <StandardBold>5-7 business days</StandardBold>. Bank processing times may vary.
          </StandardParagraph>
        </StandardSection>

        <StandardSection title="8. Non-Refundable Items">
          <StandardParagraph>
            The following are non-refundable:
          </StandardParagraph>
          <StandardBulletList
            items={[
              "Completed sessions where feedback was provided.",
              "Sessions marked as no-show by the candidate.",
              "Platform service fees (if applicable)."
            ]}
          />
        </StandardSection>

        <StandardSection title="9. Mentor Cancellation Fees">
          <StandardParagraph>
            Mentors who repeatedly cancel sessions may face:
          </StandardParagraph>
          <StandardBulletList
            items={[
              "Reduced visibility in search results.",
              "Account warnings or suspension.",
              "Temporary or permanent removal from the platform."
            ]}
          />
        </StandardSection>

        <StandardSection title="10. Contact for Disputes">
          <StandardParagraph>
            If you believe a refund decision was incorrect or need to dispute a cancellation, contact our support team with booking details and evidence.
          </StandardParagraph>
        </StandardSection>
      </StandardPageTemplate>
    </>
  );
}