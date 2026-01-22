// app/interviews/hr.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Svg, { Path, Circle } from 'react-native-svg';
import { BrandHeader } from '@/lib/BrandHeader';
import { Footer } from '@/components/Footer';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

// SVG Icons
const UsersIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="HRBP">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SettingsIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="COE">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    <Path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M18.36 5.64l-4.24 4.24m-4.24 4.24L5.64 18.36M18.36 18.36l-4.24-4.24m-4.24-4.24L5.64 5.64" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MessageIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Communication">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 18, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Check">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M7 12l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const StarIcon = ({ size = 16, color = "#FFD700" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} accessibilityLabel="Star">
    <Path d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 16.8l-6.3 4.6 2.4-7.4L1.8 9.4h7.8z" />
  </Svg>
);

const AlertIcon = ({ size = 28, color = BRAND_ORANGE }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Alert">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" />
    <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const BookIcon = ({ size = 28, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Book">
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const TrendIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Growth">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 6h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HeartIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Culture">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TargetIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Target">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

export default function HRInterviews() {
  const router = useRouter();

  // 🔥 Structured Data for SEO
  useEffect(() => {
    if (Platform.OS === 'web') {
      const breadcrumbSchema = createBreadcrumbSchema([
        { name: 'Home', url: 'https://crackjobs.com' },
        { name: 'Interview Tracks', url: 'https://crackjobs.com/#interview-tracks' },
        { name: 'HR & Behavioral', url: 'https://crackjobs.com/interviews/hr' }
      ]);

      // ADDED: Website Schema
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "CrackJobs",
        "url": "https://crackjobs.com"
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the STAR method for HR interviews?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "STAR stands for Situation, Task, Action, Result. Structure behavioral answers by describing the context, your responsibilities, specific actions you took, and quantifiable outcomes. Every answer should include metrics and impact."
            }
          },
          {
            "@type": "Question",
            "name": "How do I answer conflict resolution questions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use real examples showing active listening, empathy, data-driven decision-making, and courage to address issues directly. Avoid vague answers. Quantify impact: 'Resolved conflict that improved team productivity by 15%' is better than 'Helped team get along better'."
            }
          },
          {
            "@type": "Question",
            "name": "How do I prepare for HRBP interviews at Google or Amazon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Practice STAR stories covering conflict, data-driven decisions, change management, and leadership. Study HR systems (Workday, Greenhouse, Lattice), compensation frameworks, DEI strategies, and org design principles. Expect scenario-based questions."
            }
          }
        ]
      };

      // HowTo Schema for Rich Results
      const howtoSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Prepare for HR Interviews",
        "description": "Step-by-step guide to mastering HR and HRBP interviews",
        "totalTime": "PT30H",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Master STAR Method",
            "text": "Practice structured behavioral responses with Situation, Task, Action, Result"
          },
          {
            "@type": "HowToStep",
            "name": "Learn Conflict Resolution",
            "text": "Master mediation techniques and difficult conversations"
          },
          {
            "@type": "HowToStep",
            "name": "Practice HRBP Scenarios",
            "text": "Handle performance management and organizational change"
          },
          {
            "@type": "HowToStep",
            "name": "Mock HR Interviews",
            "text": "Practice with senior HR leaders from top companies"
          }
        ]
      };

      // Course Schema for Rich Results
      const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "HR Interview Preparation",
        "description": "Master HRBP scenarios, conflict resolution, and behavioral interviews",
        "provider": {
          "@type": "Organization",
          "name": "CrackJobs",
          "url": "https://crackjobs.com"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "lowPrice": "3000",
          "highPrice": "15000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Bronze Mentor",
              "price": "3000-6000",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "name": "Silver Mentor",
              "price": "6000-9000",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "name": "Gold Mentor",
              "price": "9000-15000",
              "priceCurrency": "INR"
            }
          ]
        }
      };

      // EDITED: Added websiteSchema to the list
      const cleanup = injectMultipleSchemas([breadcrumbSchema, faqSchema, howtoSchema, courseSchema, websiteSchema]);
      return () => cleanup && cleanup();
    }
  }, []);

  const coreSkills = [
    {
      name: "HR Business Partner (HRBP)",
      icon: <UsersIcon size={44} color={CTA_TEAL} />,
      description: "Navigate complex people issues, org design, and strategic workforce planning",
      topics: [
        "Organizational design and restructuring",
        "Change management and transformation",
        "Conflict resolution and mediation",
        "Performance management and coaching",
        "Employee relations and investigations",
        "Succession planning and talent strategy"
      ],
      scenarios: [
        "Manager is toxic but delivers 150% of targets",
        "Two senior leaders refuse to collaborate",
        "Team morale crashed after restructuring",
        "Star performer threatens to quit over promotion"
      ],
      weight: "50% of interviews"
    },
    {
      name: "COE – HR Functions (Compensation, L&D, DEI)",
      icon: <SettingsIcon size={44} color={CTA_TEAL} />,
      description: "Design systems, programs, and policies that scale across the organization",
      topics: [
        "Compensation strategy and benchmarking",
        "Learning & Development program design",
        "Diversity, Equity & Inclusion initiatives",
        "Performance management frameworks",
        "Employee engagement and retention",
        "HR analytics and metrics"
      ],
      scenarios: [
        "Design compensation framework for 500-person company",
        "Build L&D program with $500K budget",
        "Improve gender diversity in leadership (30% → 50%)",
        "Reduce voluntary attrition from 25% to 15%"
      ],
      weight: "50% of interviews"
    }
  ];

  // ... (Rest of the component code: realHRScenarios, starMethod, hrMetrics, conflictResolution, successStories, commonMistakes, hrTechStack, prepTimeline) ...
  // Note: For brevity, keeping the unchanged parts hidden, but they are included in the final file logic.
  
  // Re-including the omitted constants for context in the final render if needed, but assuming user just wants the updated file structure.
  // I will include the full render part below with the new SEO tags.

  const realHRScenarios = [
    {
      scenario: "Your top sales manager consistently hits 150% of targets but has received 3 harassment complaints from team members in the past 6 months.",
      challenge: "Balancing business impact with employee safety and company values",
      approaches: [
        {
          approach: "Investigation First",
          steps: [
            "Launch formal investigation immediately (HR + Legal)",
            "Place manager on temporary leave during investigation",
            "Interview complainants and witnesses confidentially",
            "Document everything meticulously",
            "Decide based on evidence, not performance"
          ],
          outcome: "If substantiated: Termination regardless of performance. Company values > short-term revenue."
        },
        {
          approach: "Coaching & Monitoring",
          steps: [
            "Only if complaints are minor behavioral issues, not harassment",
            "Mandatory leadership coaching + anger management",
            "30/60/90 day improvement plan with clear metrics",
            "Assign HR shadow for all team interactions",
            "Zero tolerance for any future complaints"
          ],
          outcome: "Sets precedent that high performers aren't above company policy."
        }
      ],
      wrongAnswer: "Saying: 'Let's give them one more chance because they're valuable.' This shows you prioritize revenue over people safety.",
      rightAnswer: "Investigate thoroughly, document everything, make decisions based on evidence and values. State: 'No employee, regardless of performance, is worth compromising our values or creating a toxic environment.'"
    },
    {
      scenario: "You need to lay off 20% of the workforce (150 people). How do you approach this while maintaining morale and employer brand?",
      challenge: "Executing difficult decisions with empathy and strategic thinking",
      approaches: [
        {
          approach: "Strategic Communication Plan",
          steps: [
            "Determine criteria (performance, business fit, not tenure/age to avoid legal issues)",
            "Inform managers 1 week before, train them on conversations",
            "Conduct layoffs in single day (avoid death by 1000 cuts)",
            "Generous severance (2-4 months based on tenure)",
            "Outplacement services, extended benefits, LinkedIn recommendations"
          ],
          outcome: "Maintains dignity for exiting employees, shows survivors you care"
        },
        {
          approach: "Survivor Support",
          steps: [
            "Town hall same day explaining 'why' and 'how' decisions were made",
            "1-on-1s with remaining employees to address concerns",
            "Transparent communication about future (no more layoffs expected)",
            "Increased support: mental health resources, manager check-ins",
            "Recognize higher workload, redistribute work fairly"
          ],
          outcome: "Prevents survivor guilt, maintains productivity and retention"
        }
      ],
      wrongAnswer: "Dragging layoffs over weeks/months, or not being transparent about criteria.",
      rightAnswer: "Clear criteria, single-day execution, generous packages, transparent communication, robust survivor support. Show empathy while being decisive."
    },
    {
      scenario: "Two senior VPs (Sales & Product) refuse to collaborate. Product says Sales promises features that don't exist. Sales says Product is too slow. Teams are taking sides.",
      challenge: "Mediating senior leadership conflict before it cascades",
      approaches: [
        {
          approach: "Structured Mediation",
          steps: [
            "Individual 1-on-1s first: understand root causes, what success looks like",
            "Joint facilitated session with clear rules (no interrupting, focus on solutions)",
            "Use data: what's the actual impact of conflict? (deals lost, morale, etc.)",
            "Co-create operating agreement: how they'll collaborate going forward",
            "Check-ins every 2 weeks for 3 months to ensure adherence"
          ],
          outcome: "80% of senior conflicts can be resolved through structured facilitation"
        },
        {
          approach: "Escalate to CEO",
          steps: [
            "If mediation fails after 2-3 attempts",
            "Present data on business impact",
            "CEO sets expectations: collaborate or consequence (PIP, role change)",
            "Monthly check-ins with CEO on collaboration metrics",
            "Ultimate: one or both need to leave if unresolved"
          ],
          outcome: "Shows organization that toxic leadership won't be tolerated"
        }
      ],
      wrongAnswer: "Ignoring it and hoping they'll work it out. Senior conflicts never self-resolve.",
      rightAnswer: "Proactive intervention, structured mediation, data-driven conversations, clear accountability. If unresolved, escalate to CEO with business impact framing."
    }
  ];

  const starMethod = [
    {
      letter: "S",
      word: "Situation",
      description: "Set the context - where, when, what was happening",
      tips: [
        "Be specific: company size, team size, your role",
        "Include relevant constraints (budget, timeline, resources)",
        "Don't spend more than 20% of answer here"
      ],
      example: "At Company X (500 employees), we had 35% voluntary attrition in Engineering—3x industry average. This was costing us $2.5M annually in recruiting and lost productivity."
    },
    {
      letter: "T",
      word: "Task",
      description: "What was your specific responsibility or goal?",
      tips: [
        "Focus on YOUR role, not team's role",
        "State the challenge or goal clearly",
        "Include measurable target if applicable"
      ],
      example: "As HRBP for Engineering, I was tasked with reducing attrition to 12% (industry average) within 12 months while maintaining hiring velocity."
    },
    {
      letter: "A",
      word: "Action",
      description: "What specific actions did YOU take? (50% of answer)",
      tips: [
        "Use 'I' not 'we' - take credit for your work",
        "Be detailed: what tools, frameworks, methods",
        "Show your thinking: why did you choose this approach?",
        "Include obstacles you overcame"
      ],
      example: "I conducted 30 exit interviews to identify root causes: 65% cited lack of growth opportunities, 45% compensation, 30% manager quality. I then: (1) Designed career ladder framework with clear L3→L4→L5 progression, (2) Partnered with Compensation to adjust salary bands using market data from Radford, (3) Implemented quarterly manager effectiveness surveys, (4) Created mentorship program pairing junior engineers with senior architects."
    },
    {
      letter: "R",
      word: "Result",
      description: "What was the measurable outcome? (30% of answer)",
      tips: [
        "Always quantify: percentages, dollars, time saved",
        "Include both hard metrics and soft impacts",
        "Mention what you learned or what happened after",
        "Don't be modest - own your success"
      ],
      example: "Within 12 months: attrition dropped from 35% to 13% (exceeding target), saving $2.1M annually. Employee engagement scores increased from 6.2→7.8/10. 85% of engineers now on defined career paths. Leadership extended program to Product and Data teams. I learned that systematic problem diagnosis through exit interviews is more effective than assumptions."
    }
  ];

  const hrMetrics = [
    {
      category: "Recruitment & Hiring",
      icon: <UsersIcon size={28} color={CTA_TEAL} />,
      metrics: [
        { metric: "Time to Fill", target: "< 30 days", why: "Measures recruiting efficiency" },
        { metric: "Cost per Hire", target: "$3-5K", why: "Recruiting ROI" },
        { metric: "Quality of Hire", target: "> 4.0/5", why: "Performance in first year" },
        { metric: "Offer Acceptance Rate", target: "> 85%", why: "Employer brand strength" }
      ]
    },
    {
      category: "Retention & Engagement",
      icon: <HeartIcon size={28} color={CTA_TEAL} />,
      metrics: [
        { metric: "Voluntary Attrition", target: "< 12%", why: "Employee satisfaction" },
        { metric: "Regrettable Attrition", target: "< 5%", why: "Losing top talent" },
        { metric: "Employee Engagement Score", target: "> 7.5/10", why: "Culture health" },
        { metric: "eNPS (Employee Net Promoter)", target: "> 30", why: "Would employees recommend?" }
      ]
    },
    {
      category: "Performance & Development",
      icon: <TrendIcon size={28} color={CTA_TEAL} />,
      metrics: [
        { metric: "Performance Rating Distribution", target: "Bell curve", why: "Avoid rating inflation" },
        { metric: "Internal Mobility Rate", target: "15-20%", why: "Career growth" },
        { metric: "Learning Hours per Employee", target: "> 40 hrs/year", why: "Upskilling investment" },
        { metric: "Manager Effectiveness Score", target: "> 4.0/5", why: "#1 retention driver" }
      ]
    },
    {
      category: "DEI & Culture",
      icon: <TargetIcon size={28} color={CTA_TEAL} />,
      metrics: [
        { metric: "Gender Diversity (Leadership)", target: "> 40%", why: "Representation equity" },
        { metric: "Pay Equity Ratio", target: "0.95-1.05", why: "Fair compensation" },
        { metric: "Inclusion Score", target: "> 7.0/10", why: "Belonging" },
        { metric: "Promotion Rate Parity", target: "< 5% gap", why: "Equal opportunity" }
      ]
    }
  ];

  const conflictResolution = [
    {
      step: 1,
      title: "Separate Conversations First",
      icon: <MessageIcon size={28} color={CTA_TEAL} />,
      actions: [
        "Meet each party individually before joint session",
        "Active listening: 'Tell me your perspective on what happened'",
        "Identify underlying needs vs stated positions",
        "Assess emotional temperature and readiness to resolve"
      ]
    },
    {
      step: 2,
      title: "Establish Ground Rules",
      icon: <CheckIcon size={28} color={CTA_TEAL} />,
      actions: [
        "No interrupting - use 'I' statements, not 'you' accusations",
        "Focus on behaviors, not character ('You missed the deadline' not 'You're lazy')",
        "Goal is resolution, not winning",
        "Confidentiality - what's discussed stays here"
      ]
    },
    {
      step: 3,
      title: "Facilitate Joint Discussion",
      icon: <UsersIcon size={28} color={CTA_TEAL} />,
      actions: [
        "Each party shares perspective uninterrupted (5 min each)",
        "Reflect back to ensure understanding",
        "Identify common ground and shared goals",
        "Ask: 'What would resolution look like for you?'"
      ]
    },
    {
      step: 4,
      title: "Co-Create Solutions",
      icon: <TargetIcon size={28} color={CTA_TEAL} />,
      actions: [
        "Brainstorm options together (no evaluation yet)",
        "Evaluate each option: feasibility, fairness, sustainability",
        "Select solution both parties can commit to",
        "Document agreement: who does what by when"
      ]
    },
    {
      step: 5,
      title: "Follow-Up & Accountability",
      icon: <TrendIcon size={28} color={CTA_TEAL} />,
      actions: [
        "Check-in 1 week, 1 month, 3 months later",
        "Acknowledge progress and improvements",
        "Address any lingering issues quickly",
        "Update agreement if needed"
      ]
    }
  ];

  const successStories = [
    {
      name: "Meera S.",
      company: "Amazon",
      role: "Sr. HR Business Partner",
      outcome: "₹32L Package",
      impact: "Reduced attrition 28% → 14%",
      quote: "Developed a data-driven, values-first approach to my answers through mocks. 10/10 would recommend",
      rating: 5,
      sessions: 6
    },
    {
      name: "Rajesh K.",
      company: "Flipkart",
      role: "Compensation & Benefits Manager",
      outcome: "₹28L Package",
      impact: "Saved ₹12Cr in comp budget",
      quote: "'Design compensation framework for a 300-person org.' I structured it: market benchmarking (Radford), salary bands by level, equity allocation, performance linkage, communication plan. Showed trade-offs and cost modeling. Interviewer said it was production-ready.",
      rating: 5,
      sessions: 7
    },
    {
      name: "Priya T.",
      company: "Google",
      role: "People Operations Lead",
      outcome: "₹45L Package",
      impact: "Built L&D program from scratch",
      quote: "Behavioral round tested everything—conflict, stakeholder management, data-driven decisions. CrackJobs taught me to structure every answer with STAR. I had 8 strong stories ready, quantified all impacts. Cleared 6 rounds with 'Strong Hire' ratings.",
      rating: 5,
      sessions: 8
    }
  ];

  const commonMistakes = [
    {
      mistake: "Not using STAR method structure in behavioral answers",
      why: "Makes answers rambling, hard to follow, and doesn't showcase impact",
      fix: "Every behavioral answer must follow STAR. Practice 10-15 stories covering: conflict, leadership, data-driven decision, failure, stakeholder management, change management. Write them out, time yourself (2-3 min each), get feedback. Say: 'Let me structure my answer: Situation, Task, Action, Result.'"
    },
    {
      mistake: "Giving 'team' credit instead of taking ownership of your work",
      why: "Interviewer can't assess YOUR capability if you say 'we' constantly",
      fix: "Use 'I' for your actions, 'we' only for team outcomes. Wrong: 'We reduced attrition.' Right: 'I led the attrition reduction initiative by analyzing exit data, designing retention programs, and coaching 15 managers. The team collectively reduced attrition 22%.' Show YOUR role clearly."
    },
    {
      mistake: "Not quantifying impact with specific metrics and numbers",
      why: "Vague claims like 'improved morale' aren't credible without data",
      fix: "Every STAR story needs numbers. Wrong: 'I improved engagement.' Right: 'I increased employee engagement from 6.2 to 7.9/10 (27% improvement) by implementing quarterly pulse surveys, manager training, and career development frameworks. This resulted in 15% attrition reduction and 20% productivity increase per manager feedback.'"
    },
    {
      mistake: "Avoiding difficult HR scenarios or giving politically correct answers",
      why: "Shows lack of real experience with hard people decisions",
      fix: "HR interviews test your spine. Don't avoid tough scenarios. When asked about toxic high-performer, don't say 'I'd coach them.' Say: 'I'd investigate immediately. If harassment substantiated, I'd terminate regardless of performance. Company values and employee safety are non-negotiable. I've done this before—here's the story...' Show courage and principle."
    },
    {
      mistake: "Not demonstrating data-driven decision making with HR analytics",
      why: "Modern HR is data-driven; gut feel isn't enough",
      fix: "Show you use data. Examples: 'I analyzed 50 exit interviews and found 65% cited manager quality,' 'I benchmarked our salaries against Radford data and found we were at 15th percentile,' 'I calculated cost of attrition: $2.5M annually = 150 people × $15K recruiting cost + 3 months productivity loss.' Use real numbers in your stories."
    }
  ];

  const hrTechStack = [
    { category: "HRIS (Core Systems)", tools: ["Workday", "SAP SuccessFactors", "Oracle HCM", "BambooHR", "Rippling"] },
    { category: "Recruiting (ATS)", tools: ["Greenhouse", "Lever", "SmartRecruiters", "Workable", "iCIMS"] },
    { category: "Performance Management", tools: ["Lattice", "Culture Amp", "15Five", "Betterworks", "Reflektive"] },
    { category: "Learning & Development", tools: ["Udemy Business", "LinkedIn Learning", "Degreed", "Coursera", "EdCast"] },
    { category: "Employee Engagement", tools: ["Culture Amp", "Glint", "Officevibe", "TINYpulse", "Peakon"] },
    { category: "Compensation & Analytics", tools: ["Radford", "Payscale", "Pave", "Option Impact", "Visier"] }
  ];

  const prepTimeline = [
    {
      phase: "Weeks 1-2",
      title: "Build Your STAR Story Bank",
      icon: <BookIcon size={26} color={CTA_TEAL} />,
      focus: [
        "Write 10-15 STAR stories covering key themes",
        "Quantify impact in every story (%, $, time)",
        "Themes: conflict, leadership, data-driven decision, failure, change",
        "Practice telling each story in 2-3 minutes",
        "Get feedback from mentor or record yourself"
      ]
    },
    {
      phase: "Weeks 3-4",
      title: "Master HR Scenarios & Frameworks",
      icon: <UsersIcon size={26} color={CTA_TEAL} />,
      focus: [
        "Practice 20+ real HR scenarios (toxic manager, layoffs, conflict)",
        "Learn conflict resolution, change management frameworks",
        "Study HRBP case studies from top companies",
        "Understand org design principles",
        "Practice thinking out loud through ambiguous problems"
      ]
    },
    {
      phase: "Weeks 5-6",
      title: "HR Analytics & Metrics Fluency",
      icon: <TrendIcon size={26} color={CTA_TEAL} />,
      focus: [
        "Memorize key HR metrics and benchmarks",
        "Learn to calculate: attrition cost, cost per hire, time to fill",
        "Understand compensation structures and equity",
        "Study DEI metrics and pay equity analysis",
        "Practice presenting data-driven recommendations"
      ]
    },
    {
      phase: "Weeks 7-8",
      title: "COE Deep Dives & Mock Interviews",
      icon: <TargetIcon size={26} color={CTA_TEAL} />,
      focus: [
        "Study compensation philosophy and benchmarking",
        "Learn L&D program design and ROI calculation",
        "Understand DEI strategy beyond surface level",
        "Practice HR systems/tech questions",
        "Conduct 5+ mock interviews with feedback"
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>HR Interview Preparation | Master HRBP, Conflict Resolution & People Analytics</title>
        <meta name="description" content="Ace HR interviews at Amazon, Google, Flipkart with expert HR leaders. Master HRBP scenarios, conflict resolution, STAR method, compensation strategy, and DEI initiatives. Practice real HR interview questions." />
        <meta name="keywords" content="HR interview, HRBP interview, human resources interview, behavioral interview, STAR method, conflict resolution, compensation strategy, DEI, employee relations, HR business partner, talent acquisition" />
        <link rel="canonical" href="https://crackjobs.com/interviews/hr" />
        
        {/* ADDED: Missing Open Graph & Twitter Tags */}
        <meta property="og:title" content="HR Interview Preparation | CrackJobs" />
        <meta property="og:description" content="Master HRBP scenarios, conflict resolution, and behavioral interviews with expert HR leaders." />
        <meta property="og:type" content="website" />
        
        {/* ADDED: Proper site name meta tag */}
        <meta property="og:site_name" content="CrackJobs" />
        
        <meta property="og:url" content="https://crackjobs.com/interviews/hr" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HR Interview Preparation | CrackJobs" />
        <meta name="twitter:description" content="Master HRBP scenarios, conflict resolution, and behavioral interviews." />
        
        <style>{`
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f5f0; }
  
  /* ⚡️ RESPONSIVE BRAND HEADER */
  @media (max-width: 768px) {
    #brand-eyes { display: none !important; }
    #brand-header { margin-bottom: 16px !important; }
  }
  
  /* ⚡️ RESPONSIVE SECTIONS */
  @media (max-width: 768px) {
    .section-title { font-size: 32px !important; }
    #question-types-grid,
    #stories-grid,
    #tools-grid,
    #articles-grid,
    #steps-grid { 
      flex-direction: column !important; 
    }
  }
`}</style>
      </Head>

      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.headerInner]}>
              <BrandHeader style={{ marginBottom: 0 }} small={false} />
              <View style={[styles.navRight]}>
                <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
                  <Text style={styles.navLinkText}>Log in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSmall} onPress={() => router.push('/auth/sign-up')}>
                  <Text style={styles.btnSmallText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Hero */}
          <View style={[styles.hero]}>
            <View style={styles.badge}><Text style={styles.badgeText}>👥 HR & BEHAVIORAL INTERVIEWS</Text></View>
            <Text style={[styles.heroTitle]} accessibilityRole="header" accessibilityLevel={1}>
              Navigate Complex People Issues With Confidence
            </Text>
            <Text style={[styles.heroSubtitle]}>
              Master HRBP scenarios, conflict resolution, STAR method storytelling, and people analytics with HR leaders. Practice real behavioral questions with expert feedback.
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.stat}><Text style={styles.statValue}>₹15-45L</Text><Text style={styles.statLabel}>Salary Range</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>STAR</Text><Text style={styles.statLabel}>Method</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>3-5</Text><Text style={styles.statLabel}>Interview Rounds</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>6-8 weeks</Text><Text style={styles.statLabel}>Prep Timeline</Text></View>
            </View>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.ctaBtnText}>Find HR Mentors →</Text>
            </TouchableOpacity>
          </View>

          {/* Core Skills */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>2 CORE FOCUS AREAS</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">What Companies Test in HR Interviews</Text>
            <Text style={styles.sectionDesc}>HR interviews test your ability to handle complex people scenarios and design scalable systems.</Text>
            {coreSkills.map((skill, i) => (
              <View key={i} style={styles.skillCard}>
                <View style={styles.skillHeader}>
                  {skill.icon}
                  <View style={styles.skillHeaderText}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillDesc}>{skill.description}</Text>
                    <Text style={styles.skillWeight}>Interview Weight: {skill.weight}</Text>
                  </View>
                </View>
                <View style={styles.skillTopics}>
                  <Text style={styles.topicsLabel}>Core Topics:</Text>
                  {skill.topics.map((topic, j) => (
                    <View key={j} style={styles.topicItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.skillScenarios}>
                  <Text style={styles.scenariosLabel}>Example Scenarios:</Text>
                  {skill.scenarios.map((scenario, j) => (
                    <Text key={j} style={styles.scenarioBullet}>• {scenario}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Real HR Scenarios */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>REAL HR SCENARIOS</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">How to Handle the Toughest People Problems</Text>
            <Text style={styles.sectionDesc}>These scenarios test your judgment, values, and ability to balance competing priorities.</Text>
            {realHRScenarios.map((item, i) => (
              <View key={i} style={styles.scenarioCard}>
                <Text style={styles.scenarioTitle}>Scenario {i + 1}</Text>
                <Text style={styles.scenarioText}>{item.scenario}</Text>
                <View style={styles.scenarioChallenge}>
                  <Text style={styles.scenarioChallengeLabel}>🎯 Core Challenge:</Text>
                  <Text style={styles.scenarioChallengeText}>{item.challenge}</Text>
                </View>
                {item.approaches.map((approach, j) => (
                  <View key={j} style={styles.approachCard}>
                    <Text style={styles.approachTitle}>{approach.approach}</Text>
                    <View style={styles.approachSteps}>
                      {approach.steps.map((step, k) => (
                        <Text key={k} style={styles.approachStep}>→ {step}</Text>
                      ))}
                    </View>
                    <View style={styles.approachOutcome}>
                      <Text style={styles.approachOutcomeLabel}>Outcome:</Text>
                      <Text style={styles.approachOutcomeText}>{approach.outcome}</Text>
                    </View>
                  </View>
                ))}
                <View style={styles.scenarioAnswers}>
                  <View style={styles.wrongAnswer}>
                    <Text style={styles.wrongAnswerLabel}>❌ Wrong Answer:</Text>
                    <Text style={styles.wrongAnswerText}>{item.wrongAnswer}</Text>
                  </View>
                  <View style={styles.rightAnswer}>
                    <Text style={styles.rightAnswerLabel}>✅ Right Answer:</Text>
                    <Text style={styles.rightAnswerText}>{item.rightAnswer}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* STAR Method */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>STAR METHOD MASTERY</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Structure Every Behavioral Answer Perfectly</Text>
            <Text style={styles.sectionDesc}>STAR method is non-negotiable for HR interviews. Master it to stand out from 90% of candidates.</Text>
            {starMethod.map((item, i) => (
              <View key={i} style={styles.starCard}>
                <View style={styles.starHeader}>
                  <View style={styles.starLetter}>
                    <Text style={styles.starLetterText}>{item.letter}</Text>
                  </View>
                  <View style={styles.starInfo}>
                    <Text style={styles.starWord}>{item.word}</Text>
                    <Text style={styles.starDesc}>{item.description}</Text>
                  </View>
                </View>
                <View style={styles.starTips}>
                  <Text style={styles.starTipsLabel}>💡 Pro Tips:</Text>
                  {item.tips.map((tip, j) => (
                    <Text key={j} style={styles.starTip}>• {tip}</Text>
                  ))}
                </View>
                <View style={styles.starExample}>
                  <Text style={styles.starExampleLabel}>Example:</Text>
                  <Text style={styles.starExampleText}>"{item.example}"</Text>
                </View>
              </View>
            ))}
          </View>

          {/* HR Metrics */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]}>
            <Text style={styles.sectionLabel}>HR METRICS DASHBOARD</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">What Every HR Professional Should Track</Text>
            <Text style={styles.sectionDesc}>Modern HR is data-driven. Know these metrics and their benchmarks cold.</Text>
            {hrMetrics.map((category, i) => (
              <View key={i} style={styles.metricsCategory}>
                <View style={styles.metricsCategoryHeader}>
                  {category.icon}
                  <Text style={styles.metricsCategoryName}>{category.category}</Text>
                </View>
                {category.metrics.map((metric, j) => (
                  <View key={j} style={styles.metricRow}>
                    <View style={styles.metricInfo}>
                      <Text style={styles.metricName}>{metric.metric}</Text>
                      <Text style={styles.metricWhy}>{metric.why}</Text>
                    </View>
                    <View style={styles.metricTarget}>
                      <Text style={styles.metricTargetText}>{metric.target}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Conflict Resolution */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>CONFLICT RESOLUTION PLAYBOOK</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">5-Step Framework for Resolving Workplace Conflict</Text>
            <Text style={styles.sectionDesc}>Master this systematic approach to mediate conflicts at any level of the organization.</Text>
            <View style={styles.conflictPlaybook}>
              {conflictResolution.map((step, i) => (
                <View key={i} style={styles.conflictStep}>
                  <View style={styles.conflictStepHeader}>
                    <View style={styles.conflictStepNum}>
                      <Text style={styles.conflictStepNumText}>{step.step}</Text>
                    </View>
                    {step.icon}
                    <Text style={styles.conflictStepTitle}>{step.title}</Text>
                  </View>
                  <View style={styles.conflictActions}>
                    {step.actions.map((action, j) => (
                      <View key={j} style={styles.conflictAction}>
                        <CheckIcon size={14} color={CTA_TEAL} />
                        <Text style={styles.conflictActionText}>{action}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Prep Timeline */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>8-WEEK PREP ROADMAP</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Complete HR Interview Preparation Plan</Text>
            <Text style={styles.sectionDesc}>Structured timeline to master behavioral storytelling, HR scenarios, and analytics.</Text>
            <View style={styles.timeline}>
              {prepTimeline.map((phase, i) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={styles.timelineMarker}>
                    <View style={styles.timelineDot} />
                    {i < prepTimeline.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      {phase.icon}
                      <View>
                        <Text style={styles.timelinePhase}>{phase.phase}</Text>
                        <Text style={styles.timelineTitle}>{phase.title}</Text>
                      </View>
                    </View>
                    <View style={styles.timelineFocus}>
                      {phase.focus.map((item, j) => (
                        <View key={j} style={styles.focusItem}>
                          <CheckIcon size={14} color={CTA_TEAL} />
                          <Text style={styles.focusText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* HR Tech Stack */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]}>
            <Text style={styles.sectionLabel}>HR TECH STACK</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Essential HR Systems & Tools</Text>
            <Text style={styles.sectionDesc}>Familiarity with HR tech demonstrates you understand modern HR operations.</Text>
            <View style={[styles.toolsGrid]} nativeID="tools-grid">
              {hrTechStack.map((category, i) => (
                <View key={i} style={styles.toolCategory}>
                  <Text style={styles.toolCategoryName}>{category.category}</Text>
                  <View style={styles.toolList}>
                    {category.tools.map((tool, j) => (
                      <View key={j} style={styles.toolItem}>
                        <Text style={styles.toolItemText}>{tool}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Success Stories */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>SUCCESS STORIES</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">From Practice to HR Leadership Offers</Text>
            <Text style={styles.sectionDesc}>These HR professionals mastered behavioral interviews and landed roles at top companies.</Text>
            <View style={[styles.storiesGrid]} nativeID="stories-grid">
              {successStories.map((story, i) => (
                <View key={i} style={styles.storyCard}>
                  <View style={styles.storyHeader}>
                    <View>
                      <Text style={styles.storyName}>{story.name}</Text>
                      <Text style={styles.storyRole}>{story.role}</Text>
                    </View>
                    <View style={styles.storyRating}>
                      {[...Array(story.rating)].map((_, j) => <StarIcon key={j} size={14} />)}
                    </View>
                  </View>
                  <Text style={styles.storyQuote}>"{story.quote}"</Text>
                    
                </View>
              ))}
            </View>
          </View>

          {/* Common Mistakes */}
          <View style={[styles.section, { backgroundColor: '#fff8f0' }]}>
            <Text style={styles.sectionLabel}>AVOID THESE MISTAKES</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">5 HR Interview Mistakes That Fail Candidates</Text>
            <Text style={styles.sectionDesc}>Based on 600+ HR interview evaluations. These mistakes appear in 80% of failed interviews.</Text>
            {commonMistakes.map((mistake, i) => (
              <View key={i} style={styles.mistakeCard}>
                <View style={styles.mistakeHeader}>
                  <AlertIcon size={26} color={BRAND_ORANGE} />
                  <Text style={styles.mistakeNum}>Mistake #{i + 1}</Text>
                </View>
                <Text style={styles.mistakeText}>{mistake.mistake}</Text>
                <View style={styles.mistakeWhy}>
                  <Text style={styles.mistakeWhyLabel}>Why it fails:</Text>
                  <Text style={styles.mistakeWhyText}>{mistake.why}</Text>
                </View>
                <View style={styles.mistakeFix}>
                  <Text style={styles.mistakeFixLabel}>✅ How to fix it:</Text>
                  <Text style={styles.mistakeFixText}>{mistake.fix}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Related Articles */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>DEEP DIVE GUIDES</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Master Specific HR Topics</Text>
            <View style={[styles.articlesGrid]} nativeID="articles-grid">
              <TouchableOpacity style={styles.articleCard} onPress={() => router.push('/blog/hr-interview-mistakes')}>
                <BookIcon size={32} color={CTA_TEAL} />
                <Text style={styles.articleTitle}>Common HR Interview Mistakes to Avoid</Text>
                <Text style={styles.articleDesc}>Learn the most common pitfalls in HR behavioral interviews—from weak STAR stories to avoiding tough scenarios.</Text>
                <Text style={styles.articleCta}>Read Complete Guide →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* How It Works */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Practice HR Interviews in 3 Steps</Text>
            <View style={[styles.stepsGrid]} nativeID="steps-grid">
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
                <Text style={styles.stepTitle}>Choose HR Focus</Text>
                <Text style={styles.stepDesc}>Select HRBP scenarios, behavioral questions, or COE case studies. Browse HR leaders from Amazon, Google, Flipkart.</Text>
              </View>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
                <Text style={styles.stepTitle}>Practice 55-Min Session</Text>
                <Text style={styles.stepDesc}>Work through real HR scenarios—conflict resolution, layoffs, compensation design. Practice STAR storytelling with feedback.</Text>
              </View>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
                <Text style={styles.stepTitle}>Get Expert Evaluation</Text>
                <Text style={styles.stepDesc}>Detailed feedback on judgment, communication, stakeholder management, and cultural fit.</Text>
              </View>
            </View>
          </View>

          {/* Final CTA */}
          <View style={styles.finalCta}>
            <Text style={styles.finalCtaTitle}>Ready to Master HR Interviews?</Text>
            <Text style={styles.finalCtaSubtitle}>Join 300+ HR professionals who mastered behavioral interviews, conflict resolution, and people analytics. Start practicing today.</Text>
            <TouchableOpacity style={styles.finalCtaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.finalCtaBtnText}>Start HR Practice Today →</Text>
            </TouchableOpacity>
            <View style={styles.finalCtaFeatures}>
              <Text style={styles.finalCtaFeature}>👥 Real HR scenarios</Text>
              <Text style={styles.finalCtaFeature}>⭐ STAR method mastery</Text>
              <Text style={styles.finalCtaFeature}>💳 Pay per session (₹999-2499)</Text>
            </View>
          </View>

          <Footer />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },
  hero: { maxWidth: 950, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 70, alignItems: 'center' },
  heroMobile: { paddingVertical: 45 },
  badge: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d8eded', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, marginBottom: 28 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, letterSpacing: 0.6 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '900', fontSize: 42, color: BRAND_ORANGE, lineHeight: 64, textAlign: 'center', marginBottom: 24 },
  heroTitleMobile: { fontSize: 38, lineHeight: 46 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 32, textAlign: 'center', marginBottom: 42, maxWidth: 800 },
  heroSubtitleMobile: { fontSize: 18, lineHeight: 28 },
  heroStats: { flexDirection: 'row', gap: 36, marginBottom: 42, flexWrap: 'wrap', justifyContent: 'center' },
  stat: { alignItems: 'center', minWidth: 85 },
  statValue: { fontFamily: SYSTEM_FONT, fontSize: 32, fontWeight: '800', color: CTA_TEAL, marginBottom: 6 },
  statLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, textAlign: 'center' },
  ctaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 44, paddingVertical: 20, borderRadius: 100 },
  ctaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  section: { paddingVertical: 80, paddingHorizontal: 24 },
  sectionLabel: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: CTA_TEAL, letterSpacing: 1.8, textAlign: 'center', marginBottom: 14, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontSize: 42, fontWeight: '800', color: TEXT_DARK, textAlign: 'center', marginBottom: 18, maxWidth: 850, alignSelf: 'center' },
  sectionTitleMobile: { fontSize: 32 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, textAlign: 'center', marginBottom: 52, maxWidth: 750, alignSelf: 'center', lineHeight: 29 },
  skillCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: BG_CREAM, borderRadius: 18, padding: 32, marginBottom: 24, borderWidth: 1, borderColor: '#e5e5e5' },
  skillHeader: { flexDirection: 'row', gap: 20, marginBottom: 24, alignItems: 'flex-start' },
  skillHeaderText: { flex: 1 },
  skillName: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '700', color: TEXT_DARK, marginBottom: 8 },
  skillDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 25, marginBottom: 8 },
  skillWeight: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '600', color: BRAND_ORANGE },
  skillTopics: { marginBottom: 20 },
  topicsLabel: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700', color: TEXT_DARK, marginBottom: 12 },
  topicItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 8 },
  topicText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1, lineHeight: 23 },
  skillScenarios: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 20 },
  scenariosLabel: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700', color: TEXT_DARK, marginBottom: 12 },
  scenarioBullet: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 23, marginBottom: 6 },
  scenarioCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: 'white', borderRadius: 18, padding: 32, marginBottom: 32, borderLeftWidth: 4, borderLeftColor: BRAND_ORANGE },
  scenarioTitle: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700', color: BRAND_ORANGE, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  scenarioText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '600', color: TEXT_DARK, lineHeight: 27, marginBottom: 16 },
  scenarioChallenge: { backgroundColor: '#fff8f0', padding: 16, borderRadius: 12, marginBottom: 20 },
  scenarioChallengeLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: BRAND_ORANGE, marginBottom: 8 },
  scenarioChallengeText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 24, fontStyle: 'italic' },
  approachCard: { backgroundColor: BG_CREAM, padding: 24, borderRadius: 14, marginBottom: 16 },
  approachTitle: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 14 },
  approachSteps: { marginBottom: 14 },
  approachStep: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 23, marginBottom: 6 },
  approachOutcome: { backgroundColor: '#e8f5f5', padding: 14, borderRadius: 10 },
  approachOutcomeLabel: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: CTA_TEAL, marginBottom: 6 },
  approachOutcomeText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  scenarioAnswers: { marginTop: 20, gap: 12 },
  wrongAnswer: { backgroundColor: '#fff5f0', padding: 16, borderRadius: 12 },
  wrongAnswerLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: BRAND_ORANGE, marginBottom: 8 },
  wrongAnswerText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  rightAnswer: { backgroundColor: '#f0f8f0', padding: 16, borderRadius: 12 },
  rightAnswerLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 8 },
  rightAnswerText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  starCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: BG_CREAM, borderRadius: 18, padding: 32, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: CTA_TEAL },
  starHeader: { flexDirection: 'row', gap: 18, marginBottom: 20, alignItems: 'center' },
  starLetter: { width: 56, height: 56, borderRadius: 28, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center' },
  starLetterText: { fontFamily: SYSTEM_FONT, fontSize: 28, fontWeight: '900', color: 'white' },
  starInfo: { flex: 1 },
  starWord: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK, marginBottom: 6 },
  starDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24 },
  starTips: { backgroundColor: '#e8f5f5', padding: 16, borderRadius: 12, marginBottom: 16 },
  starTipsLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 10 },
  starTip: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22, marginBottom: 6 },
  starExample: { backgroundColor: 'white', padding: 18, borderRadius: 12 },
  starExampleLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: TEXT_DARK, marginBottom: 10 },
  starExampleText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 24, fontStyle: 'italic' },
  metricsCategory: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: 'white', borderRadius: 18, padding: 28, marginBottom: 24 },
  metricsCategoryHeader: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 20 },
  metricsCategoryName: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  metricInfo: { flex: 1 },
  metricName: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: '600', color: TEXT_DARK, marginBottom: 4 },
  metricWhy: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY },
  metricTarget: { backgroundColor: BG_CREAM, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  metricTargetText: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700', color: CTA_TEAL },
  conflictPlaybook: { maxWidth: 950, width: '100%', alignSelf: 'center' },
  conflictStep: { backgroundColor: 'white', borderRadius: 18, padding: 28, marginBottom: 20 },
  conflictStepHeader: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 18 },
  conflictStepNum: { width: 48, height: 48, borderRadius: 24, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center' },
  conflictStepNumText: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '900', color: 'white' },
  conflictStepTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, flex: 1 },
  conflictActions: { gap: 10 },
  conflictAction: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  conflictActionText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1, lineHeight: 23 },
  timeline: { maxWidth: 950, alignSelf: 'center', width: '100%' },
  timelineItem: { flexDirection: 'row', gap: 24, marginBottom: 36 },
  timelineMarker: { width: 40, alignItems: 'center' },
  timelineDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: CTA_TEAL, borderWidth: 4, borderColor: 'white', shadowColor: CTA_TEAL, shadowOpacity: 0.3, shadowRadius: 6 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#d0d0d0', marginTop: 8 },
  timelineContent: { flex: 1 },
  timelineHeader: { flexDirection: 'row', gap: 14, marginBottom: 16, alignItems: 'center' },
  timelinePhase: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 4 },
  timelineTitle: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK },
  timelineFocus: { gap: 10 },
  focusItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  focusText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1, lineHeight: 23 },
  toolsGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  toolsGridMobile: { flexDirection: 'column' },
  toolCategory: { flex: 1, minWidth: 240, backgroundColor: 'white', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  toolCategoryName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 16 },
  toolList: { gap: 8 },
  toolItem: { backgroundColor: BG_CREAM, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  toolItemText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK },
  storiesGrid: { flexDirection: 'row', gap: 26, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1150, alignSelf: 'center' },
  storiesGridMobile: { flexDirection: 'column' },
  storyCard: { flex: 1, minWidth: 320, maxWidth: 360, backgroundColor: 'white', padding: 32, borderRadius: 18, borderWidth: 1, borderColor: '#e5e5e5' },
  storyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  storyName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  storyRole: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY },
  storyRating: { flexDirection: 'row', gap: 3 },
  storyOutcomeBox: { backgroundColor: BG_CREAM, padding: 16, borderRadius: 12, marginBottom: 18 },
  storyOutcome: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: CTA_TEAL, marginBottom: 4 },
  storyImpact: { fontFamily: SYSTEM_FONT, fontSize: 13, color: BRAND_ORANGE, fontWeight: '600' },
  storyQuote: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 25, marginBottom: 18, fontStyle: 'italic' },
  storyFooter: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 14 },
  storySessions: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '600', color: TEXT_GRAY },
  mistakeCard: { maxWidth: 900, alignSelf: 'center', width: '100%', backgroundColor: 'white', padding: 30, borderRadius: 18, marginBottom: 24, borderLeftWidth: 5, borderLeftColor: BRAND_ORANGE },
  mistakeHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  mistakeNum: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '800', color: BRAND_ORANGE },
  mistakeText: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, lineHeight: 28, marginBottom: 16 },
  mistakeWhy: { backgroundColor: '#fff5f0', padding: 16, borderRadius: 12, marginBottom: 14 },
  mistakeWhyLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: BRAND_ORANGE, marginBottom: 6 },
  mistakeWhyText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  mistakeFix: { backgroundColor: '#f0f8f0', padding: 16, borderRadius: 12 },
  mistakeFixLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 6 },
  mistakeFixText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  articlesGrid: { maxWidth: 900, alignSelf: 'center', width: '100%' },
  articlesGridMobile: { flexDirection: 'column' },
  articleCard: { backgroundColor: BG_CREAM, padding: 34, borderRadius: 18, borderWidth: 1, borderColor: '#e5e5e5' },
  articleTitle: { fontFamily: SYSTEM_FONT, fontSize: 21, fontWeight: '700', color: TEXT_DARK, marginTop: 18, marginBottom: 14, lineHeight: 30 },
  articleDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 25, marginBottom: 18 },
  articleCta: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: '600', color: CTA_TEAL },
  stepsGrid: { flexDirection: 'row', gap: 32, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  stepsGridMobile: { flexDirection: 'column' },
  stepCard: { flex: 1, minWidth: 290, maxWidth: 330, alignItems: 'center', backgroundColor: 'white', padding: 32, borderRadius: 18, borderWidth: 1, borderColor: '#e8e8e8' },
  stepNum: { width: 64, height: 64, borderRadius: 32, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  stepNumText: { fontFamily: SYSTEM_FONT, fontSize: 30, fontWeight: '800', color: 'white' },
  stepTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 14, textAlign: 'center' },
  stepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, textAlign: 'center', lineHeight: 25 },
  finalCta: { backgroundColor: '#0f0f0f', paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontFamily: SYSTEM_FONT, fontSize: 46, fontWeight: '900', color: 'white', marginBottom: 22, textAlign: 'center', maxWidth: 750 },
  finalCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 42, textAlign: 'center', maxWidth: 650, lineHeight: 29 },
  finalCtaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 50, paddingVertical: 22, borderRadius: 100, marginBottom: 28 },
  finalCtaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  finalCtaFeatures: { flexDirection: 'row', gap: 28, flexWrap: 'wrap', justifyContent: 'center' },
  finalCtaFeature: { fontFamily: SYSTEM_FONT, fontSize: 14, color: 'rgba(255,255,255,0.75)' },
});