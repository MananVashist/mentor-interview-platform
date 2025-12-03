// app/contact.tsx
import React from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import {
  StandardPageTemplate,
  StandardSection,
  StandardParagraph,
  StandardBold,
  StandardContactEmail,
} from '@/components/StandardPageTemplate';

export default function Contact() {
  // SEO: ContactPage Schema
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "CrackJobs",
      "email": "crackjobshelpdesk@gmail.com",
      "url": "https://crackjobs.com"
    }
  };

  return (
    <StandardPageTemplate
      title="Contact Us | CrackJobs Support"
      metaDescription="Get in touch with the CrackJobs team for support. We're here to help."
      pageUrl="https://crackjobs.com/contact"
      pageTitle="Contact Us"
      lastUpdated="November 25, 2024"
      additionalSchema={contactSchema}
      relatedPages={[
        {
          title: "FAQ",
          description: "Find answers to common questions",
          icon: "❓",
          route: "/faq"
        },
        {
          title: "How It Works",
          description: "Learn about our platform",
          icon: "📖",
          route: "/how-it-works"
        },
        {
          title: "About Us",
          description: "Our mission and team",
          icon: "👥",
          route: "/about"
        }
      ]}
    >
      <StandardSection title="Get in Touch">
        <StandardParagraph>
          We're here to help! Whether you have questions, need support, or want to explore partnership opportunities, feel free to reach out.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="General Inquiries">
        <StandardParagraph>
          For general questions about CrackJobs, our services, or how to get started:
        </StandardParagraph>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}>
          <StandardContactEmail>crackjobshelpdesk@gmail.com</StandardContactEmail>
        </TouchableOpacity>
      </StandardSection>

      <StandardSection title="Candidate Support">
        <StandardParagraph>
          Need help with:
        </StandardParagraph>
        <StandardParagraph>
          • Booking sessions{'\n'}
          • Payment issues{'\n'}
          • Session feedback{'\n'}
          • Account management
        </StandardParagraph>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com?subject=Candidate Support')}>
          <StandardContactEmail>crackjobshelpdesk@gmail.com</StandardContactEmail>
        </TouchableOpacity>
      </StandardSection>


      <StandardSection title="Business & Partnerships">
        <StandardParagraph>
          Interested in corporate training packages, bulk bookings, or strategic partnerships?
        </StandardParagraph>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com?subject=Business Inquiry')}>
          <StandardContactEmail>crackjobshelpdesk@gmail.com</StandardContactEmail>
        </TouchableOpacity>
      </StandardSection>

      <StandardSection title="Technical Support">
        <StandardParagraph>
          Experiencing technical issues with the platform? Report bugs, connectivity problems, or feature requests:
        </StandardParagraph>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com?subject=Technical Issue')}>
          <StandardContactEmail>crackjobshelpdesk@gmail.com</StandardContactEmail>
        </TouchableOpacity>
      </StandardSection>

      <StandardSection title="Response Time">
        <StandardParagraph>
          We aim to respond to all inquiries within <StandardBold>24-48 hours</StandardBold> during business days. Urgent issues may receive faster attention.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Office Hours">
        <StandardParagraph>
          <StandardBold>Monday - Friday:</StandardBold> 9:00 AM - 6:00 PM IST{'\n'}
          <StandardBold>Saturday:</StandardBold> 10:00 AM - 4:00 PM IST{'\n'}
          <StandardBold>Sunday:</StandardBold> Closed
        </StandardParagraph>
      </StandardSection>
    </StandardPageTemplate>
  );
}