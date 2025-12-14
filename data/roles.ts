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
        topics: ['Design a better alarm clock for blind users', 'Improve WhatsApp groups', 'User segmentation & Problem framing'],
      },
      {
        title: 'Execution & Analytics',
        description: 'Tests ability to reason about metrics, root causes, and prioritization.',
        topics: ['DAU dropped 20% in 1 week. Diagnose.', 'North Star metrics for YouTube Shorts', 'Trade-off analysis'],
      },
      {
        title: 'Strategy & Market Understanding',
        description: 'Evaluates business thinking, competitive strategy & long-term planning.',
        topics: ['How should Spotify compete with Apple Music?', 'Should Instagram enter online dating?', 'Buy vs Build decisions'],
      },
      {
        title: 'Technical & Architecture Basics',
        description: 'Systems thinking + comfort working with engineers (Non-coding).',
        topics: ['Explain how a search autosuggest system works', 'What is an API? Why use microservices?', 'Database basics for PMs'],
      },
      {
        title: 'Behavioral & Leadership',
        description: 'Standard leadership checks and culture fit assessment.',
        topics: ['Tell me a time you disagreed with a stakeholder', 'Explain a time you shipped something with limited data', 'Conflict resolution'],
      },
    ],
    faqs: [
      {
        question: 'Do I need a CS degree for PM roles?',
        answer: 'Not necessarily. While some technical PM roles require it, most "Generalist" PM roles at FAANG focus on Product Sense and Logic rather than coding.',
      },
      {
        question: 'How many mock interviews should I do?',
        answer: 'Most successful candidates do between 5 to 10 mock interviews before their onsite loop.',
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
        topics: ['Find the 2nd highest seller in each region', 'Self-joins and Window Functions', 'Complex Filtering & Aggregation'],
      },
      {
        title: 'Case Studies (Data → Insight)',
        description: 'Business-scenario based analysis to test problem solving.',
        topics: ['Sales dropped in South India—investigate', 'Which marketing channel should we scale?', 'Root cause analysis'],
      },
      {
        title: 'Product Metrics & Experimentation',
        description: 'Metrics definition and A/B testing fundamentals.',
        topics: ['Good metrics for a checkout funnel?', 'Explain p-value & confidence interval', 'A/B test setup & interpretation'],
      },
      {
        title: 'Excel / Visualization / Dashboarding',
        description: 'Real-world working skills for day-to-day analytics.',
        topics: ['Build a pivot table from a given dataset', 'Interpret a dashboard and provide insights', 'Data cleanup & formatting'],
      },
      {
        title: 'Behavioral / Communication',
        description: 'Stakeholder management and communication skills.',
        topics: ['Tell me about a time data changed your recommendation', 'How do you handle ambiguity?', 'Presenting to non-technical audiences'],
      },
    ],
    faqs: [
      {
        question: 'How hard is the SQL round?',
        answer: 'Expect Medium to Hard LeetCode SQL questions. You must be comfortable with Window Functions (RANK, LEAD/LAG) and Self Joins.',
      },
      {
        question: 'Is Python required for Data Analyst roles?',
        answer: 'It depends on the company. Many top-tier tech companies now require basic Python/Pandas manipulation skills alongside SQL.',
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
    heroSubtitle: 'From SQL queries to ML System Design. Get feedback from Data Scientists at Uber, Netflix, and Google.',

    syllabus: [
      {
        title: 'ML Theory & Algorithms',
        description: 'Deep conceptual understanding of how models work.',
        topics: ['Bias–variance tradeoff', 'How does XGBoost work?', 'When to use Logistic vs Linear regression?'],
      },
      {
        title: 'Practical ML / Model Debugging',
        description: 'Real-world application and troubleshooting.',
        topics: ['Your model overfits—what is the next step?', 'Feature importance changed after deployment—why?', 'Handling imbalanced datasets'],
      },
      {
        title: 'Coding (Python / Pandas / Algo)',
        description: 'LeetCode-medium difficulty & Data manipulation.',
        topics: ['Arrays, strings, hashing', 'Pandas transforms + feature engineering', 'Vectorized operations'],
      },
      {
        title: 'Statistics & Experimentation',
        description: 'Core statistical knowledge and probability.',
        topics: ['Hypothesis testing & P-Values', 'Probability puzzles', 'A/B test significance calculation'],
      },
      {
        title: 'System Design (ML Systems)',
        description: 'Architecting scalable ML solutions (Mid-Senior roles).',
        topics: ['Design a real-time recommendations engine', 'How would you deploy a fraud model at scale?', 'Model retraining strategies'],
      },
    ],
    faqs: [
      {
        question: 'Is it a coding interview?',
        answer: 'Yes. Expect a LeetCode style round (usually Python/Pandas) and often a dedicated SQL round.',
      },
      {
        question: 'Do I need a PhD?',
        answer: 'No. While research roles might require it, Applied Scientist and Data Scientist roles focus more on practical engineering and stats knowledge.',
      },
    ],
  },

  // =========================================================
  // 4. HR & BEHAVIORAL (Profile ID 10)
  // =========================================================
  'hr': {
    id: 'hr',
    title: 'HR & Recruiting',
    tag: 'HR',
    salary: '$90k - $140k',

    metaTitle: 'HR Mock Interviews | Behavioral, Recruitment Ops, Culture',
    metaDescription: 'Practice HR scenarios, recruitment operations, and conflict resolution with seasoned HR leaders.',
    heroTitle: 'Master the HR & Recruiter Interview',
    heroSubtitle: 'Prepare for situational questions, recruitment ops, and cultural fit assessments.',

    syllabus: [
      {
        title: 'Behavioral / Scenario-Based',
        description: 'Core HR scenarios and conflict management.',
        topics: ['Tell me a time you resolved a team conflict', 'What would you do if a candidate ghosts after accepting?', 'Managing underperformance'],
      },
      {
        title: 'Recruitment Ops & Pipeline',
        description: 'Process management and funnel optimization.',
        topics: ['Walk me through your sourcing → screening → closing process', 'How do you measure recruiter productivity?', 'Pipeline metrics'],
      },
      {
        title: 'Stakeholder Management',
        description: 'Cross-functional alignment with hiring managers.',
        topics: ['How do you handle disagreements with hiring managers?', 'Managing expectations on salary/timeline', 'Influencing leadership'],
      },
      {
        title: 'Cultural Fit & Sensitivity',
        description: 'Ethics, diversity, and employee relations.',
        topics: ['How do you handle a harassment complaint?', 'What is your philosophy on diversity hiring?', 'Ensuring inclusive practices'],
      },
      {
        title: 'Industry Knowledge / Legal',
        description: 'Compliance, compensation, and labor laws.',
        topics: ['Explain the difference between CTC and in-hand', 'How do you ensure unbiased hiring?', 'Labor law basics'],
      },
    ],
    faqs: [
      {
        question: 'What are the most common HR interview questions?',
        answer: 'They usually revolve around conflict resolution ("Tell me about a time..."), prioritization, and handling difficult stakeholders.',
      },
      {
        question: 'How do I prepare for the "Culture Fit" round?',
        answer: 'Research the company values deeply. Prepare stories that demonstrate those specific values in action using the STAR method.',
      },
    ],
  },
};