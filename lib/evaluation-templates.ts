// lib/evaluation-templates.ts

export const MASTER_TEMPLATES: Record<string, any> = {
  "Product Manager": {
    round_1: [
      {
        title: "Q1 – RCA",
        example: "DAU for search feature fell 22% WoW. Investigate.",
        questions: [
          { id: "pm_r1_q1_c1", text: "Did the candidate follow a structured approach?", type: "rating" },
          { id: "pm_r1_q1_c2", text: "Was the candidate able to identify the root cause?", type: "rating" },
          { id: "pm_r1_q1_c3", text: "Did the candidate look at the right metrics to clarify their hypotheses?", type: "rating" },
          { id: "pm_r1_q1_c4", text: "Additional comments", type: "text" },
        ],
      },
      {
        title: "Q2 – Product Thinking",
        example: "Design a phone-free morning routine system for screen-addicted users.",
        questions: [
          { id: "pm_r1_q2_c1", text: "Did the candidate think deeply about user problems and segments?", type: "rating" },
          { id: "pm_r1_q2_c2", text: "Did the candidate prioritise features clearly for an MVP?", type: "rating" },
          { id: "pm_r1_q2_c3", text: "Was the proposed solution consistent with the user problems identified?", type: "rating" },
          { id: "pm_r1_q2_c4", text: "Additional comments", type: "text" },
        ],
      },
    ],
    round_2: [
      {
        title: "Q1 – Prioritisation & Stakeholders",
        example: "You inherit 15 urgent asks from 6 stakeholders with very low engineering bandwidth.",
        questions: [
          { id: "pm_r2_q1_c1", text: "Did the candidate use a clear prioritisation framework (e.g. impact/effort, RICE etc.)?", type: "rating" },
          { id: "pm_r2_q1_c2", text: "Did the candidate articulate trade-offs and reasoning behind what gets cut or delayed?", type: "rating" },
          { id: "pm_r2_q1_c3", text: "Did the candidate give acceptable answers on stakeholder communication and alignment?", type: "rating" },
          { id: "pm_r2_q1_c4", text: "Additional comments", type: "text" },
        ],
      },
      {
        title: "Q2 – Resume Deep-dive & Technical",
        example: "Pick one product from their resume and go deep on why and how they built it.",
        questions: [
          { id: "pm_r2_q2_c1", text: "Was the candidate able to explain why this product or feature was built (problem, goals, success metrics)?", type: "rating" },
          { id: "pm_r2_q2_c2", text: "Was the candidate able to explain the high-level technical / system architecture?", type: "rating" },
          { id: "pm_r2_q2_c3", text: "Was the candidate comfortable with cross-questions and detailed probing on their resume?", type: "rating" },
          { id: "pm_r2_q2_c4", text: "Additional comments", type: "text" },
        ],
      },
    ],
  },

  "Data Analyst / Business Analyst": {
    round_1: [
      {
        title: "Q1 – SQL & Data Handling",
        example: "Compute ‘time to first purchase’ by acquisition channel across 100M rows.",
        questions: [
          { id: "da_r1_q1_c1", text: "Did the candidate take a structured approach to understand the schema and requirements?", type: "rating" },
          { id: "da_r1_q1_c2", text: "Was the query logically correct and did it handle edge cases?", type: "rating" },
          { id: "da_r1_q1_c3", text: "Was the query efficient and scalable for large data volumes?", type: "rating" },
          { id: "da_r1_q1_c4", text: "Additional comments", type: "text" },
        ],
      },
      {
        title: "Q2 – Insights & Storytelling",
        example: "Repeat users are rising but revenue/user is dropping — you have 30 mins before a CEO review.",
        questions: [
          { id: "da_r1_q2_c1", text: "Did the candidate break down the metric into clear components (e.g. mix, price, volume)?", type: "rating" },
          { id: "da_r1_q2_c2", text: "Did the candidate generate reasonable hypotheses and discuss how to validate them with data?", type: "rating" },
          { id: "da_r1_q2_c3", text: "Did the candidate connect the analysis to business impact and potential actions?", type: "rating" },
          { id: "da_r1_q2_c4", text: "Additional comments", type: "text" },
        ],
      },
    ],
    round_2: [
      {
        title: "Q1 – Business Case & Decision Support",
        example: "A competitor launches a cheaper version. Analyse impact and recommend pricing/feature actions.",
        questions: [
          { id: "da_r2_q1_c1", text: "Did the candidate take a structured approach to the business case (market, customers, unit economics)?", type: "rating" },
          { id: "da_r2_q1_c2", text: "Did the candidate identify the right metrics and analyses required to make a decision?", type: "rating" },
          { id: "da_r2_q1_c3", text: "Did the candidate weigh trade-offs and arrive at a clear recommendation?", type: "rating" },
          { id: "da_r2_q1_c4", text: "Additional comments", type: "text" },
        ],
      },
      {
        title: "Q2 – Data Quality & Debugging",
        example: "Conversion spikes 40% overnight — determine whether this is real or a data issue.",
        questions: [
          { id: "da_r2_q2_c1", text: "Did the candidate propose systematic checks across tracking, ETL, and reporting layers?", type: "rating" },
          { id: "da_r2_q2_c2", text: "Did the candidate follow an efficient debugging path instead of random trial and error?", type: "rating" },
          { id: "da_r2_q2_c3", text: "Did the candidate think about communication of risk/uncertainty to stakeholders?", type: "rating" },
          { id: "da_r2_q2_c4", text: "Additional comments", type: "text" },
        ],
      },
    ],
  },

  "Data Scientist / ML Engineer (applied)": {
    round_1: [
      {
        title: "Q1 – Problem Formulation",
        example: "Translate a vague goal like ‘reduce churn with ML’ into a concrete ML problem.",
        questions: [
          { id: "ds_r1_q1_c1", text: "Was the candidate able to reframe the business goal into a clear ML task (e.g. classification, ranking, forecasting)?", type: "rating" },
          { id: "ds_r1_q1_c2", text: "Did the candidate discuss data requirements, key features and assumptions explicitly?", type: "rating" },
          { id: "ds_r1_q1_c3", text: "Did the candidate define success metrics and constraints (e.g. latency, interpretability)?", type: "rating" },
          { id: "ds_r1_q1_c4", text: "Additional comments", type: "text" },
        ],
      },
      {
        title: "Q2 – Metrics & Trade-offs",
        example: "A fraud model catches 80% of fraud, but total fraud losses have increased.",
        questions: [
          { id: "ds_r1_q2_c1", text: "Did the candidate correctly interpret the given metrics (precision, recall, thresholds etc.)?", type: "rating" },
          { id: "ds_r1_q2_c2", text: "Did the candidate reason through trade-offs (e.g. false positives vs false negatives, cost-sensitive decisions)?", type: "rating" },
          { id: "ds_r1_q2_c3", text: "Did the candidate connect metric behaviour to real-world business impact and user experience?", type: "rating" },
          { id: "ds_r1_q2_c4", text: "Additional comments", type: "text" },
        ],
      },
    ],
    round_2: [
      {
        title: "Q1 – ML System Design",
        example: "Design instant personalised recommendations for 50M DAU, refreshing within seconds.",
        questions: [
          { id: "ds_r2_q1_c1", text: "Was the overall system architecture coherent (online/offline components, data flow, model serving)?", type: "rating" },
          { id: "ds_r2_q1_c2", text: "Did the candidate consider scalability, latency, and reliability constraints?", type: "rating" },
          { id: "ds_r2_q1_c3", text: "Did the candidate address feature store / data freshness and experimentation?", type: "rating" },
          { id: "ds_r2_q1_c4", text: "Additional comments", type: "text" },
        ],
      },
      {
        title: "Q2 – Production Debugging & Monitoring",
        example: "A model works well in staging but performance drifts badly after two months in production.",
        questions: [
          { id: "ds_r2_q2_c1", text: "Did the candidate think about data and concept drift detection (input, label, environment changes)?", type: "rating" },
          { id: "ds_r2_q2_c2", text: "Did the candidate propose a structured debugging plan across pipeline, features, labels, and infra?", type: "rating" },
          { id: "ds_r2_q2_c3", text: "Did the candidate discuss monitoring, alerting and rollback/mitigation strategies?", type: "rating" },
          { id: "ds_r2_q2_c4", text: "Additional comments", type: "text" },
        ],
      },
    ],
  },

  "HR / Talent Acquisition": {
    round_1: [
      {
        title: "Q1 – Org Diagnosis & Problem Finding",
        example: "Sales team says they lack coaching but training hours have increased significantly.",
        questions: [
          { id: "hr_r1_q1_c1", text: "Did the candidate take a structured approach to understand the root problem (beyond symptoms)?", type: "rating" },
          { id: "hr_r1_q1_c2", text: "Did the candidate consider multiple data sources (surveys, performance data, interviews, attrition etc.)?", type: "rating" },
          { id: "hr_r1_q1_c3", text: "Did the candidate show empathy and insight into different stakeholder perspectives?", type: "rating" },
          { id: "hr_r1_q1_c4", text: "Additional comments", type: "text" },
        ],
      },
      {
        title: "Q2 – Program / Process Design",
        example: "Design a program for first-time managers who struggle with feedback and people management.",
        questions: [
          { id: "hr_r1_q2_c1", text: "Did the candidate clarify target audience, objectives and success criteria for the program?", type: "rating" },
          { id: "hr_r1_q2_c2", text: "Was the program structure (modules, formats, cadence) coherent and practical?", type: "rating" },
          { id: "hr_r1_q2_c3", text: "Did the candidate address behavioural change, reinforcement and manager/leadership buy-in?", type: "rating" },
          { id: "hr_r1_q2_c4", text: "Additional comments", type: "text" },
        ],
      },
    ],
    round_2: [
      {
        title: "Q1 – ROI & Impact Measurement",
        example: "Leadership wants proof that training spends are driving measurable ROI.",
        questions: [
          { id: "hr_r2_q1_c1", text: "Did the candidate identify the right metrics to measure impact (e.g. performance, retention, NPS, promotion rates)?", type: "rating" },
          { id: "hr_r2_q1_c2", text: "Did the candidate address attribution challenges and propose a reasonable evaluation design (control groups, before/after etc.)?", type: "rating" },
          { id: "hr_r2_q1_c3", text: "Did the candidate come up with a realistic, business-friendly measurement plan?", type: "rating" },
          { id: "hr_r2_q1_c4", text: "Additional comments", type: "text" },
        ],
      },
      {
        title: "Q2 – Stakeholder & Conflict Management",
        example: "Two VPs disagree whether a new training program should be mandatory.",
        questions: [
          { id: "hr_r2_q2_c1", text: "Did the candidate show good listening and discovery of each stakeholder’s underlying concerns?", type: "rating" },
          { id: "hr_r2_q2_c2", text: "Did the candidate propose a fair path to alignment and trade-offs (pilots, opt-outs, phased rollout etc.)?", type: "rating" },
          { id: "hr_r2_q2_c3", text: "Did the candidate communicate a clear recommendation and rationale?", type: "rating" },
          { id: "hr_r2_q2_c4", text: "Additional comments", type: "text" },
        ],
      },
    ],
  },
};
