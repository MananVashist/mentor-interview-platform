// app/about.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  StandardPageTemplate,
  StandardSection,
  StandardParagraph,
  StandardBold,
} from '@/components/StandardPageTemplate';

export default function About() {
  const router = useRouter();

  // SEO: Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CrackJobs",
    "description": "Democratizing interview preparation through expert mentorship.",
    "url": "https://crackjobs.com",
    "logo": "https://crackjobs.com/logo.png",
    "foundingDate": "2024",
    "slogan": "Practice makes perfect"
  };

  return (
    <StandardPageTemplate
      title="About Us | CrackJobs Mission"
      metaDescription="We connect job seekers with experienced mentors from top companies to democratize interview preparation. Learn about our mission and values."
      pageUrl="https://crackjobs.com/about"
      pageTitle="About CrackJobs"
      lastUpdated="November 25, 2024"
      additionalSchema={orgSchema}
      relatedPages={[
        {
          title: "How It Works",
          description: "See our 5-step process",
          icon: "📖",
          route: "/how-it-works"
        },
        {
          title: "Contact Us",
          description: "Get in touch with our team",
          icon: "📧",
          route: "/contact"
        },
        {
          title: "Become a Mentor",
          description: "Join our mentor community",
          icon: "🎓",
          route: "/auth/sign-up"
        }
      ]}
    >
      <StandardSection title="Our Mission">
        <StandardParagraph>
          At CrackJobs, we believe that <StandardBold>practice makes perfect</StandardBold>. Landing your dream job shouldn't be a matter of luck—it should be a result of preparation and confidence built through real practice with industry professionals.
        </StandardParagraph>
        <StandardParagraph>
          We're on a mission to democratize interview preparation by connecting ambitious job seekers with experienced mentors from top companies like Google, Amazon, Microsoft, and Meta.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Why We Exist">
        <StandardParagraph>
          Traditional interview preparation methods fall short:
        </StandardParagraph>
        <StandardParagraph>
          • <StandardBold>Books and courses</StandardBold> teach theory but lack real-world practice{'\n'}
          • <StandardBold>Friends and peers</StandardBold> may not have the expertise or time{'\n'}
          • <StandardBold>Expensive coaching</StandardBold> is inaccessible to most candidates{'\n'}
          • <StandardBold>No feedback loop</StandardBold> means repeating the same mistakes
        </StandardParagraph>
        <StandardParagraph>
          CrackJobs bridges this gap by providing affordable, on-demand access to professionals who've been on the other side of the table—conducting real interviews at top companies.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="What Makes Us Different">
        <StandardParagraph>
          <StandardBold>1. Real Industry Experience</StandardBold>{'\n'}
          Our mentors aren't professional coaches—they're active professionals who interview candidates regularly at their companies. They know exactly what hiring managers look for.
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>2. Anonymous & Unbiased</StandardBold>{'\n'}
          No names, no judgments. Practice in a safe environment where you can make mistakes and learn without fear of real-world consequences.
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>3. Structured Feedback</StandardBold>{'\n'}
          Every session includes detailed, actionable feedback across multiple dimensions—technical skills, communication, problem-solving, and more.
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>4. Flexible & Affordable</StandardBold>{'\n'}
          Book sessions on your schedule, pay only for what you need, and get started within 24 hours.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Who We Serve">
        <StandardParagraph>
          <StandardBold>Job Seekers & Career Switchers</StandardBold>{'\n'}
          Whether you're a fresh graduate, experienced professional, or transitioning careers, we help you prepare for interviews at your target companies.
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>Product Managers, HRs, Analysts</StandardBold>{'\n'}
          We specialize in technical and product roles across Product Management, Data Science, HR, and more.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Our Values">
        <StandardParagraph>
          <StandardBold>🎯 Excellence</StandardBold>{'\n'}
          We vet every mentor rigorously to ensure they meet our quality standards.
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>🤝 Empathy</StandardBold>{'\n'}
          We understand the anxiety of job hunting and create a supportive, judgment-free environment.
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>🔒 Privacy</StandardBold>{'\n'}
          Your practice sessions are completely anonymous. No personal details are shared between candidates and mentors.
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>💡 Continuous Improvement</StandardBold>{'\n'}
          We constantly evolve our platform based on user feedback to deliver the best experience.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Our Impact">
        <StandardParagraph>
          Since our launch, we've helped hundreds of candidates land offers at their dream companies. Our average candidate sees improvement in confidence, communication, and technical performance after just 2-3 practice sessions.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Join Our Community">
        <StandardParagraph>
          Whether you're preparing for your next big interview or looking to give back by mentoring others, we'd love to have you on board.
        </StandardParagraph>
        <TouchableOpacity 
          onPress={() => router.push('/auth/sign-up')}
          style={{ 
            backgroundColor: '#0E9384', 
            paddingVertical: 12, 
            paddingHorizontal: 24, 
            borderRadius: 8, 
            alignSelf: 'flex-start',
            marginTop: 16
          }}
        >
          <StandardBold style={{ color: '#fff' }}>Get Started Today</StandardBold>
        </TouchableOpacity>
      </StandardSection>
    </StandardPageTemplate>
  );
}