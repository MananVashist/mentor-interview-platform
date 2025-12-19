// data/roles.ts

export type RoleData = {
  id: string; 
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  tag: string; 
  salary?: string;
  syllabus: {
    title: string;
    description: string;
    topics: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export const ROLE_DATA: Record<string, RoleData> = {
  // =========================================================
  // 1. PRODUCT MANAGEMENT (Profile ID 8)
  // =========================================================
  'product-management': {
    id: 'product-management',
    title: 'Product Management',
    tag: 'PM', 
    salary: '$180k - $250k',
    metaTitle: 'Mock Product Manager Interviews | Google, Meta, Amazon Mentors',
    metaDescription: 'Ace your PM interview. Practice Product Sense, Execution, and Leadership with top PMs.',
    heroTitle: 'Ace Your Product Management Interview',
    heroSubtitle: 'Master Product Design, Strategy, and Metrics with vetted Senior PMs from top tech companies.',
    syllabus: [
      {
        title: 'Product Sense / Product Design',
        description: 'Assess creativity, user-first thinking & ability to design features.',
        topics: [
          'Design a better alarm clock for blind users',
          'Improve WhatsApp groups',
          'User segmentation & problem framing'
        ],
      },
      {
        title: 'Execution & Analytics',
        description: 'Tests ability to reason about metrics, root causes, and prioritization.',
        topics: [
          'DAU dropped 20% in 1 week. Diagnose.',
          'North Star metrics for YouTube Shorts',
          'Trade-off analysis'
        ],
      },
      {
        title: 'Strategy & Market Understanding',
        description: 'Evaluates business thinking, competitive strategy & long-term planning.',
        topics: [
          'How should Spotify compete with Apple Music?',
          'Should Instagram enter online dating?',
          'Buy vs Build decisions'
        ],
      },
      {
        title: 'Technical & Architecture Basics',
        description: 'Systems thinking + comfort working with engineers (Non-coding).',
        topics: [
          'Explain how a search autosuggest system works',
          'What is an API? Why use microservices?',
          'Database basics for PMs'
        ],
      },
      {
        title: 'Behavioral & Leadership',
        description: 'Standard leadership checks and culture fit assessment.',
        topics: [
          'Tell me a time you disagreed with a stakeholder',
          'Shipped with limited data',
          'Conflict resolution'
        ],
      },
    ],
    faqs: [
      {
        question: 'Do I need a CS degree for PM roles?',
        answer: 'Not necessarily. Most PM interviews focus on product thinking, execution, and communication rather than coding.',
      },
      {
        question: 'How many mock interviews should I do?',
        answer: 'Most successful candidates do between 5–10 mocks before onsite interviews.',
      },
    ],
  },

  // =========================================================
  // 2. DATA ANALYTICS (Profile ID 7)
  // =========================================================
  'data-analytics': {
    id: 'data-analytics',
    title: 'Data Analytics',
    tag: 'Data Analytics',
    salary: '$120k - $180k',
    metaTitle: 'Data Analyst Mock Interviews | SQL, Case Studies, Python',
    metaDescription: 'Practice SQL, Business Case Studies, and Dashboarding with Senior Data Analysts.',
    heroTitle: 'Crack the Data Analyst Interview',
    heroSubtitle: 'Master SQL, Business Case Studies, and Metric Definitions with real industry experts.',
    syllabus: [
      {
        title: 'SQL & Querying',
        description: 'The #1 filter. Covers JOINs, window functions, and complex aggregations.',
        topics: [
          'Find the 2nd highest seller in each region',
          'Self-joins and window functions',
          'Complex filtering & aggregation'
        ],
      },
      {
        title: 'Case Studies (Data → Insight)',
        description: 'Business-scenario based analysis to test problem solving.',
        topics: [
          'Sales dropped in South India—investigate',
          'Which marketing channel should we scale?',
          'Root cause analysis'
        ],
      },
      {
        title: 'Product Metrics & Experimentation',
        description: 'Metrics definition and A/B testing fundamentals.',
        topics: [
          'Good metrics for a checkout funnel',
          'Explain p-value & confidence interval',
          'A/B test setup & interpretation'
        ],
      },
      {
        title: 'Excel / Visualization / Dashboarding',
        description: 'Real-world working skills for day-to-day analytics.',
        topics: [
          'Build a pivot table from a dataset',
          'Interpret a dashboard',
          'Data cleanup & formatting'
        ],
      },
      {
        title: 'Behavioral / Communication',
        description: 'Stakeholder management and communication skills.',
        topics: [
          'When data changed your recommendation',
          'Handling ambiguity',
          'Presenting to non-technical audiences'
        ],
      },
    ],
    faqs: [
      {
        question: 'How hard is the SQL round?',
        answer: 'Expect Medium–Hard SQL with heavy use of window functions and joins.',
      },
      {
        question: 'Is Python required?',
        answer: 'Often yes. Basic Pandas and data manipulation are commonly tested.',
      },
    ],
  },

  // =========================================================
  // 3. DATA SCIENCE / ML (Profile ID 9)
  // =========================================================
  'data-science': {
    id: 'data-science',
    title: 'Data Science',
    tag: 'Data Science',
    salary: '$200k - $300k',
    metaTitle: 'Data Science Mock Interviews | ML System Design, Python, Stats',
    metaDescription: 'Practice Machine Learning system design, SQL coding, and statistics with Senior Data Scientists.',
    heroTitle: 'Crush Your Data Science Interview',
    heroSubtitle: 'From SQL queries to ML System Design. Get feedback from top Data Scientists.',
    syllabus: [
      {
        title: 'ML Theory & Algorithms',
        description: 'Deep conceptual understanding of how models work.',
        topics: [
          'Bias–variance tradeoff',
          'How XGBoost works',
          'Logistic vs Linear regression'
        ],
      },
      {
        title: 'Practical ML / Model Debugging',
        description: 'Real-world application and troubleshooting.',
        topics: [
          'Model overfitting',
          'Feature importance drift',
          'Handling imbalanced data'
        ],
      },
      {
        title: 'Coding (Python / Pandas / Algo)',
        description: 'LeetCode-medium difficulty & data manipulation.',
        topics: [
          'Arrays, strings, hashing',
          'Pandas transforms',
          'Vectorized operations'
        ],
      },
      {
        title: 'Statistics & Experimentation',
        description: 'Core statistical knowledge and probability.',
        topics: [
          'Hypothesis testing',
          'A/B test significance',
          'Confidence intervals'
        ],
      },
      {
        title: 'System Design (ML Systems)',
        description: 'Architecting scalable ML solutions.',
        topics: [
          'Design a recommendation engine',
          'Deploy a fraud model',
          'Monitoring & retraining'
        ],
      },
    ],
    faqs: [
      {
        question: 'Is it a coding-heavy interview?',
        answer: 'Yes. Expect Python/Pandas, SQL, and system design.',
      },
      {
        question: 'Do I need a PhD?',
        answer: 'No. Applied roles focus more on engineering and applied stats.',
      },
    ],
  },

  // =========================================================
  // 4. HR (Profile ID 10) — UPDATED
  // =========================================================
  'hr': {
    id: 'hr',
    title: 'Human Resources',
    tag: 'HR',
    salary: '$90k - $140k',
    metaTitle: 'HR Mock Interviews | Talent Acquisition, HRBP, HR Ops',
    metaDescription: 'Prepare for real-world HR interviews covering hiring, HR operations, HRBP, and COE roles.',
    heroTitle: 'Crack the HR Interview',
    heroSubtitle: 'Practice real HR scenarios with experienced HR leaders and recruiters.',
    syllabus: [
      {
        title: 'Talent Acquisition',
        description: 'End-to-end hiring strategy, funnel optimization, and candidate experience.',
        topics: [
          'Design a hiring plan for 20 roles in 60 days',
          'Diagnose offer-stage drop-offs',
          'Improving time-to-hire and quality-of-hire'
        ],
      },
      {
        title: 'HR Generalist',
        description: 'Employee lifecycle management, performance, and grievance handling.',
        topics: [
          'Handling underperformance',
          'Resolving employee conflicts',
          'Performance improvement plans (PIPs)'
        ],
      },
      {
        title: 'HR Operations',
        description: 'Operational excellence, compliance, payroll, HRIS, and scale readiness.',
        topics: [
          'Handling payroll errors',
          'Designing HR SOPs',
          'Scaling HR operations 3x'
        ],
      },
      {
        title: 'HR Business Partner',
        description: 'Strategic HR partnering with leadership and org design.',
        topics: [
          'Org restructuring decisions',
          'Handling toxic high performers',
          'Manager coaching and leadership alignment'
        ],
      },
      {
        title: 'COE – HR Functions',
        description: 'Deep expertise in Compensation, L&D, Performance, DEI, and Rewards.',
        topics: [
          'Designing a performance management framework',
          'Rolling out L&D or rewards programs',
          'Ensuring fairness and adoption at scale'
        ],
      },
    ],
    faqs: [
      {
        question: 'What type of HR roles is this for?',
        answer: 'This covers Talent Acquisition, HR Generalist, HR Operations, HRBP, and COE roles across startups and large companies.',
      },
      {
        question: 'How are HR interviews evaluated?',
        answer: 'Interviewers look for judgment, empathy, structure, compliance awareness, and the ability to balance people and business outcomes.',
      },
    ],
  },
};