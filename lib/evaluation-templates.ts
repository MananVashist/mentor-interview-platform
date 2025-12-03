// lib/evaluation-templates.ts

export const MASTER_TEMPLATES: Record<string, any> = {
  "Product Manager": {
    "round_1": [
      {
        title: "Q1 – RCA",
        example: "DAU for search feature fell 22% WoW. Investigate.",
        questions: [
          { id: "pm_r1_q1_c1", text: "Structured approach", type: "rating" },
          { id: "pm_r1_q1_c2", text: "Root-cause depth", type: "rating" },
          { id: "pm_r1_q1_c3", text: "Data thinking", type: "rating" },
          { id: "pm_r1_q1_c4", text: "Hypothesis quality", type: "rating" },
        ]
      },
      {
        title: "Q2 – Product Thinking",
        example: "Design a phone‑free morning routine system for screen‑addicted users.",
        questions: [
          { id: "pm_r1_q2_c1", text: "User understanding", type: "rating" },
          { id: "pm_r1_q2_c2", text: "Prioritisation", type: "boolean" },
          { id: "pm_r1_q2_c3", text: "Creativity", type: "rating" },
          { id: "pm_r1_q2_c4", text: "Problem framing", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – Prioritisation",
        example: "You inherit 15 urgent asks from 6 stakeholders with low engg bandwidth.",
        questions: [
          { id: "pm_r2_q1_c1", text: "Prioritisation framework", type: "rating" },
          { id: "pm_r2_q1_c2", text: "Constraint handling", type: "rating" },
          { id: "pm_r2_q1_c3", text: "Stakeholder mgmt", type: "rating" },
          { id: "pm_r2_q1_c4", text: "Tradeoff clarity", type: "rating" },
        ]
      },
      {
        title: "Q2 – Metrics & Experiments",
        example: "Feature increased engagement but worsened 2‑week retention.",
        questions: [
          { id: "pm_r2_q2_c1", text: "Metric selection", type: "rating" },
          { id: "pm_r2_q2_c2", text: "Experiment design", type: "rating" },
          { id: "pm_r2_q2_c3", text: "Guardrails", type: "rating" },
          { id: "pm_r2_q2_c4", text: "Systems thinking", type: "rating" },
        ]
      }
    ]
  },
  "Data Analyst / Business Analyst": {
    "round_1": [
      {
        title: "Q1 – SQL & Logic",
        example: "Compute ‘time to first purchase’ by acquisition channel across 100M rows.",
        questions: [
          { id: "da_r1_q1_c1", text: "Query efficiency", type: "rating" },
          { id: "da_r1_q1_c2", text: "Correctness", type: "rating" },
          { id: "da_r1_q1_c3", text: "Scalability awareness", type: "rating" },
        ]
      },
      {
        title: "Q2 – Insights",
        example: "Repeat users rising but revenue/user dropping — advise CEO in 30 mins.",
        questions: [
          { id: "da_r1_q2_c1", text: "Hypothesis clarity", type: "rating" },
          { id: "da_r1_q2_c2", text: "Analytical structure", type: "rating" },
          { id: "da_r1_q2_c3", text: "Business reasoning", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – Business Case",
        example: "Competitor launched cheaper version — analyse + recommend pricing action.",
        questions: [
          { id: "da_r2_q1_c1", text: "Strategic thinking", type: "rating" },
          { id: "da_r2_q1_c2", text: "Data framing", type: "rating" },
          { id: "da_r2_q1_c3", text: "Impact estimation", type: "rating" },
        ]
      },
      {
        title: "Q2 – Data Quality",
        example: "Conversion spikes 40% overnight — determine real or data issue.",
        questions: [
          { id: "da_r2_q2_c1", text: "Data validation depth", type: "rating" },
          { id: "da_r2_q2_c2", text: "Debugging approach", type: "rating" },
          { id: "da_r2_q2_c3", text: "Risk assessment", type: "rating" },
        ]
      }
    ]
  },
  "Data Scientist / ML Engineer (applied)": {
    "round_1": [
      {
        title: "Q1 – Problem Formulation",
        example: "Translate vague goal ‘reduce churn with ML’ into a real ML problem.",
        questions: [
          { id: "ds_r1_q1_c1", text: "Problem reframing", type: "rating" },
          { id: "ds_r1_q1_c2", text: "Feature reasoning", type: "rating" },
          { id: "ds_r1_q1_c3", text: "Feasibility", type: "rating" },
        ]
      },
      {
        title: "Q2 – Metrics",
        example: "Fraud model catches 80% fraud but losses increased.",
        questions: [
          { id: "ds_r1_q2_c1", text: "Metric interpretation", type: "rating" },
          { id: "ds_r1_q2_c2", text: "Edge-case reasoning", type: "rating" },
          { id: "ds_r1_q2_c3", text: "Real-world ML intuition", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – System Design",
        example: "Design instant personalised recos for 50M DAU, refreshing within seconds.",
        questions: [
          { id: "ds_r2_q1_c1", text: "Architecture quality", type: "rating" },
          { id: "ds_r2_q1_c2", text: "Latency/infra reasoning", type: "rating" },
          { id: "ds_r2_q1_c3", text: "Feature store logic", type: "rating" },
        ]
      },
      {
        title: "Q2 – Production Debug",
        example: "Model works in staging but fails after 2 months in prod.",
        questions: [
          { id: "ds_r2_q2_c1", text: "Drift detection", type: "rating" },
          { id: "ds_r2_q2_c2", text: "Pipeline debugging", type: "rating" },
          { id: "ds_r2_q2_c3", text: "Monitoring depth", type: "rating" },
        ]
      }
    ]
  },
  "HR / Talent Acquisition": {
    "round_1": [
      {
        title: "Q1 – Org Diagnosis",
        example: "Sales team says they lack coaching but training hours increased.",
        questions: [
          { id: "ld_r1_q1_c1", text: "Diagnosis depth", type: "rating" },
          { id: "ld_r1_q1_c2", text: "Stakeholder insight", type: "rating" },
          { id: "ld_r1_q1_c3", text: "Data triangulation", type: "rating" },
        ]
      },
      {
        title: "Q2 – Program Design",
        example: "Design leadership program for first‑time managers who struggle with people skills.",
        questions: [
          { id: "ld_r1_q2_c1", text: "Program structure", type: "rating" },
          { id: "ld_r1_q2_c2", text: "Relevance", type: "rating" },
          { id: "ld_r1_q2_c3", text: "Behavioural insight", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – ROI Measurement",
        example: "Management wants proof training dollars create ROI — define framework.",
        questions: [
          { id: "ld_r2_q1_c1", text: "Metric selection", type: "rating" },
          { id: "ld_r2_q1_c2", text: "Attribution logic", type: "rating" },
          { id: "ld_r2_q1_c3", text: "Practicality", type: "rating" },
        ]
      },
      {
        title: "Q2 – Stakeholder Mgmt",
        example: "Two VPs disagree whether training should be mandatory.",
        questions: [
          { id: "ld_r2_q2_c1", text: "Communication", type: "rating" },
          { id: "ld_r2_q2_c2", text: "Alignment ability", type: "rating" },
          { id: "ld_r2_q2_c3", text: "Decision justification", type: "rating" },
        ]
      }
    ]
  },
  "HR – Talent Mgmt": {
    "round_1": [
      {
        title: "Q1 – Performance System",
        example: "Design performance system for hybrid org where remote workers feel undervalued.",
        questions: [
          { id: "tm_r1_q1_c1", text: "Fairness logic", type: "rating" },
          { id: "tm_r1_q1_c2", text: "Scalability", type: "rating" },
          { id: "tm_r1_q1_c3", text: "Measurement clarity", type: "rating" },
        ]
      },
      {
        title: "Q2 – Succession",
        example: "Define HiPo rubric that works across engg, sales, ops.",
        questions: [
          { id: "tm_r1_q2_c1", text: "Criteria clarity", type: "rating" },
          { id: "tm_r1_q2_c2", text: "Cross-role fairness", type: "rating" },
          { id: "tm_r1_q2_c3", text: "Development fit", type: "rating" },
        ]
      }
    ],
    "round_2": [
      {
        title: "Q1 – Attrition Diagnosis",
        example: "High performers attriting faster than low performers — diagnose.",
        questions: [
          { id: "tm_r2_q1_c1", text: "Segmentation depth", type: "rating" },
          { id: "tm_r2_q1_c2", text: "Root-cause clarity", type: "rating" },
          { id: "tm_r2_q1_c3", text: "Solution quality", type: "rating" },
        ]
      },
      {
        title: "Q2 – Culture",
        example: "Design 12‑month plan to improve psychological safety measurably.",
        questions: [
          { id: "tm_r2_q2_c1", text: "Intervention depth", type: "rating" },
          { id: "tm_r2_q2_c2", text: "Strategic relevance", type: "rating" },
          { id: "tm_r2_q2_c3", text: "Measurement quality", type: "rating" },
        ]
      }
    ]
  }
};