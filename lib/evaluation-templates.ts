// lib/evaluation-templates.ts

// Type definitions
export interface TemplateQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | string;
}

export interface EvaluationTemplate {
  title: string;
  example: string;
  questions: TemplateQuestion[];
}

export interface SkillCategory {
  skill_name: string; // Display Name for the Skill (kept for UI ref)
  templates: EvaluationTemplate[];
}

export interface InterviewProfile {
  profile_name: string; // Display Name for the Profile (kept for UI ref)
  skills: Record<string, SkillCategory>; // Keyed by skill_id (UUID)
}

// Mapped by interview_profile_id (number) -> skill_id (UUID)
export const MASTER_TEMPLATES: Record<number, InterviewProfile> = {
  
  // =========================================================
  // 1. PRODUCT MANAGEMENT (PM) -> ID: 8
  // =========================================================
  8: { 
    profile_name: "Product Manager",
    skills: {
      // Product Sense / Product Design
      "f270c11a-02c7-48c5-8af2-c2ab8dfc7cee": {
        skill_name: "Product Sense / Product Design",
        templates: [
          {
            title: "User Empathy & Problem Definition",
            example: "Design a better alarm clock for the blind.",
            questions: [
              { id: "pm_ps_q1", text: "Did the candidate identify distinct, specific user segments rather than generic ones?", type: "rating" },
              { id: "pm_ps_q2", text: "Did they articulate the specific pain points of the chosen segment with empathy?", type: "rating" },
              { id: "pm_ps_q3", text: "Did they prioritize one segment/problem clearly with logical reasoning?", type: "rating" },
              { id: "pm_ps_q4", text: "Did they define a clear goal for the product before jumping to features?", type: "rating" }
            ]
          },
          {
            title: "Solutioning & Creativity",
            example: "Brainstorm solutions for the identified pain points.",
            questions: [
              { id: "pm_ps_q5", text: "Did the candidate propose at least one novel/creative solution beyond the obvious?", type: "rating" },
              { id: "pm_ps_q6", text: "Did they prioritize features based on impact vs effort (or a similar framework)?", type: "rating" },
              { id: "pm_ps_q7", text: "Did they critique their own solution (identify pitfalls or risks)?", type: "rating" },
              { id: "pm_ps_rem", text: "Overall Product Sense Feedback", type: "text" }
            ]
          }
        ]
      },
      // Execution & Analytics
      "10f8c61c-fa5e-4208-b36f-571ee64cc8fa": {
        skill_name: "Execution & Analytics",
        templates: [
          {
            title: "Root Cause Analysis (RCA)",
            example: "Uber bookings dropped 10% yesterday. Investigate.",
            questions: [
              { id: "pm_exec_q1", text: "Did the candidate first clarify the metric definition and time frame?", type: "rating" },
              { id: "pm_exec_q2", text: "Did they systematically check external factors (seasonality, competitors) vs internal factors (bugs, releases)?", type: "rating" },
              { id: "pm_exec_q3", text: "Did they segment the data (by region, platform, device) to isolate the issue?", type: "rating" },
              { id: "pm_exec_q4", text: "Did they summarize the likely root cause clearly?", type: "rating" }
            ]
          },
          {
            title: "Metric Definition & Trade-offs",
            example: "Define success for Facebook Marketplace.",
            questions: [
              { id: "pm_exec_q5", text: "Did the candidate identify a North Star metric that captures true value?", type: "rating" },
              { id: "pm_exec_q6", text: "Did they include counter-metrics (guardrails) to prevent negative side effects?", type: "rating" },
              { id: "pm_exec_q7", text: "Did they explain trade-offs (e.g., revenue vs user experience) effectively?", type: "rating" },
              { id: "pm_exec_rem", text: "Overall Execution Feedback", type: "text" }
            ]
          }
        ]
      },
      // Strategy & Market Understanding
      "eec759c9-ed0e-4305-9dd9-a36556e93ff0": {
        skill_name: "Strategy & Market Understanding",
        templates: [
          {
            title: "Market Analysis",
            example: "Should Spotify enter the hardware market?",
            questions: [
              { id: "pm_strat_q1", text: "Did the candidate use a framework (SWOT, 5 Forces, etc.) to structure their thoughts?", type: "rating" },
              { id: "pm_strat_q2", text: "Did they correctly identify the competitive landscape and key players?", type: "rating" },
              { id: "pm_strat_q3", text: "Did they analyze the barriers to entry and potential unfair advantages?", type: "rating" },
              { id: "pm_strat_q4", text: "Did they consider the alignment with the company's mission/vision?", type: "rating" }
            ]
          },
          {
            title: "Strategic Decision Making",
            example: "Go-to-Market strategy for the new product.",
            questions: [
              { id: "pm_strat_q5", text: "Did the candidate identify a clear beachhead market or launch strategy?", type: "rating" },
              { id: "pm_strat_q6", text: "Did they discuss monetization or business model sustainability?", type: "rating" },
              { id: "pm_strat_q7", text: "Was their final recommendation ('Go' or 'No-Go') definitive and well-supported?", type: "rating" },
              { id: "pm_strat_rem", text: "Overall Strategy Feedback", type: "text" }
            ]
          }
        ]
      },
      // Technical & Architecture Basics
      "f699c3dc-d048-4c61-ac5c-6abb4b2dcdc3": {
        skill_name: "Technical & Architecture Basics",
        templates: [
          {
            title: "System Concepts",
            example: "What happens when you type a URL in the browser?",
            questions: [
              { id: "pm_tech_q1", text: "Did the candidate explain the request/response cycle clearly?", type: "rating" },
              { id: "pm_tech_q2", text: "Did they mention key components like DNS, Server, Database, and APIs?", type: "rating" },
              { id: "pm_tech_q3", text: "Was the level of detail appropriate (not too deep, not too shallow)?", type: "rating" },
              { id: "pm_tech_q4", text: "Did they use correct terminology (latency, throughput, cache)?", type: "rating" }
            ]
          },
          {
            title: "Working with Engineering",
            example: "Trade-offs between SQL vs NoSQL or Native vs Web.",
            questions: [
              { id: "pm_tech_q5", text: "Did the candidate understand the pros/cons of the technology choices?", type: "rating" },
              { id: "pm_tech_q6", text: "Could they explain the impact on the user experience (speed vs reliability)?", type: "rating" },
              { id: "pm_tech_q7", text: "Did they demonstrate empathy for engineering constraints?", type: "rating" },
              { id: "pm_tech_rem", text: "Overall Technical Feedback", type: "text" }
            ]
          }
        ]
      },
      // Behavioral & Leadership
      "2be8c466-fdab-4fc3-86e9-f1302ba001b5": {
        skill_name: "Behavioral & Leadership",
        templates: [
          {
            title: "Conflict & Communication",
            example: "Tell me about a time you managed a difficult stakeholder.",
            questions: [
              { id: "pm_beh_q1", text: "Did the candidate use the STAR method (Situation, Task, Action, Result)?", type: "rating" },
              { id: "pm_beh_q2", text: "Did they focus on their specific contribution ('I' vs 'We')?", type: "rating" },
              { id: "pm_beh_q3", text: "Did they show empathy for the other party's perspective?", type: "rating" },
              { id: "pm_beh_q4", text: "Was the resolution constructive and positive?", type: "rating" }
            ]
          },
          {
            title: "Leadership & Growth",
            example: "Tell me about a failure and what you learned.",
            questions: [
              { id: "pm_beh_q5", text: "Did the candidate take ownership of the failure without blaming others?", type: "rating" },
              { id: "pm_beh_q6", text: "Was the 'learning' specific and actionable for the future?", type: "rating" },
              { id: "pm_beh_q7", text: "Did they demonstrate resilience and a growth mindset?", type: "rating" },
              { id: "pm_beh_rem", text: "Overall Behavioral Feedback", type: "text" }
            ]
          }
        ]
      }
    }
  },

  // =========================================================
  // 2. DATA ANALYST / BUSINESS ANALYST -> ID: 7
  // =========================================================
  7: {
    profile_name: "Data Analyst/ Business Analyst",
    skills: {
      // SQL & Querying
      "d8561b3e-53c9-4032-b8ca-d303da315504": {
        skill_name: "SQL & Querying",
        templates: [
          {
            title: "Query Construction",
            example: "Write a query to find the top 3 items per category.",
            questions: [
              { id: "da_sql_q1", text: "Did the candidate choose the correct Window Function (RANK vs DENSE_RANK)?", type: "rating" },
              { id: "da_sql_q2", text: "Did they structure the CTEs or subqueries logically for readability?", type: "rating" },
              { id: "da_sql_q3", text: "Did they handle NULL values or data type conversions correctly?", type: "rating" },
              { id: "da_sql_q4", text: "Did they correctly join tables (Inner vs Left Join usage)?", type: "rating" }
            ]
          },
          {
            title: "Optimization & Accuracy",
            example: "Optimize a slow query on a large dataset.",
            questions: [
              { id: "da_sql_q5", text: "Did the candidate verify the output logic (e.g., checking for duplicates)?", type: "rating" },
              { id: "da_sql_q6", text: "Did they mention indexing, partition pruning, or limiting data scans?", type: "rating" },
              { id: "da_sql_q7", text: "Can they explain the order of execution (WHERE vs HAVING)?", type: "rating" }
            ]
          }
        ]
      },
      // Case Studies (Data → Insight)
      "1d072282-c794-4d7b-8aa4-27989bd5602a": {
        skill_name: "Case Studies (Data → Insight)",
        templates: [
          {
            title: "Diagnostic Capability",
            example: "Average order value is down. Why?",
            questions: [
              { id: "da_case_q1", text: "Did the candidate segment data to isolate the driver (Mix shift vs Pure decline)?", type: "rating" },
              { id: "da_case_q2", text: "Did they clarify the metric definition first?", type: "rating" },
              { id: "da_case_q3", text: "Did they check for data quality issues or logging errors?", type: "rating" },
              { id: "da_case_q4", text: "Did they hypothesize logical business reasons (e.g., discounts, seasonality)?", type: "rating" }
            ]
          },
          {
            title: "Actionability",
            example: "What recommendation would you give the CEO based on this?",
            questions: [
              { id: "da_case_q5", text: "Did the candidate translate the data insight into a business recommendation?", type: "rating" },
              { id: "da_case_q6", text: "Did they quantify the impact of the problem?", type: "rating" },
              { id: "da_case_q7", text: "Was the recommendation practical and feasible?", type: "rating" }
            ]
          }
        ]
      },
      // Product Metrics & Experimentation
      "b800c6dc-2306-431c-9b72-ef4c6b2896e3": {
        skill_name: "Product Metrics & Experimentation",
        templates: [
          {
            title: "Experiment Design",
            example: "Design an A/B test for a new checkout button.",
            questions: [
              { id: "da_exp_q1", text: "Did the candidate define a clear Primary Metric (e.g., Conversion Rate)?", type: "rating" },
              { id: "da_exp_q2", text: "Did they define Guardrail Metrics (e.g., Latency, Cancellation Rate)?", type: "rating" },
              { id: "da_exp_q3", text: "Did they understand how to select the target population and sample size?", type: "rating" },
              { id: "da_exp_q4", text: "Did they mention randomization units (User vs Session)?", type: "rating" }
            ]
          },
          {
            title: "Result Interpretation",
            example: "P-value is 0.04. Do we launch?",
            questions: [
              { id: "da_exp_q5", text: "Did the candidate correctly interpret statistical significance?", type: "rating" },
              { id: "da_exp_q6", text: "Did they check for novelty effects or seasonality?", type: "rating" },
              { id: "da_exp_q7", text: "Did they recommend a decision based on both stats and business sense?", type: "rating" }
            ]
          }
        ]
      },
      // Excel / Visualization / Dashboarding
      "d2dd2979-5117-41e1-b32b-5804b717661b": {
        skill_name: "Excel / Visualization / Dashboarding",
        templates: [
          {
            title: "Visual Design",
            example: "Visualize monthly sales trends for 5 regions.",
            questions: [
              { id: "da_viz_q1", text: "Did the candidate choose the correct chart type (Line vs Bar)?", type: "rating" },
              { id: "da_viz_q2", text: "Did they avoid clutter and confusing axes?", type: "rating" },
              { id: "da_viz_q3", text: "Did they use color effectively to highlight key insights?", type: "rating" },
              { id: "da_viz_q4", text: "Did they label axes and provide a clear legend?", type: "rating" }
            ]
          },
          {
            title: "Dashboard Logic",
            example: "Build a tracking dashboard for the Marketing VP.",
            questions: [
              { id: "da_viz_q5", text: "Did the candidate structure the dashboard from high-level to granular?", type: "rating" },
              { id: "da_viz_q6", text: "Did they select metrics relevant to the specific persona (VP vs Manager)?", type: "rating" },
              { id: "da_viz_q7", text: "Did they include comparisons (WoW, YoY) for context?", type: "rating" }
            ]
          }
        ]
      },
      // Behavioral / Communication
      "19b309a5-3860-41d4-8c5e-80fdc9300174": {
        skill_name: "Behavioral / Communication",
        templates: [
          {
            title: "Communication",
            example: "Present a complex finding to a non-technical audience.",
            questions: [
              { id: "da_beh_q1", text: "Did the candidate avoid unnecessary jargon?", type: "rating" },
              { id: "da_beh_q2", text: "Did they start with the 'So What' (Conclusion first)?", type: "rating" },
              { id: "da_beh_q3", text: "Was the narrative structure logical and easy to follow?", type: "rating" },
              { id: "da_beh_q4", text: "Did they check for understanding along the way?", type: "rating" }
            ]
          },
          {
            title: "Collaboration",
            example: "Stakeholder keeps changing requirements.",
            questions: [
              { id: "da_beh_q5", text: "Did the candidate show ability to push back constructively?", type: "rating" },
              { id: "da_beh_q6", text: "Did they propose a process to manage scope creep?", type: "rating" },
              { id: "da_beh_q7", text: "Did they maintain a collaborative tone?", type: "rating" }
            ]
          }
        ]
      }
    }
  },

  // =========================================================
  // 3. DATA SCIENCE / ML -> ID: 9
  // =========================================================
  9: {
    profile_name: "Data Scientist / ML Engineer (applied)",
    skills: {
      // ML Theory & Algorithms
      "c401bfe4-cf4b-4f3d-bee7-08d3afc041b8": {
        skill_name: "ML Theory & Algorithms",
        templates: [
          {
            title: "Theoretical Depth",
            example: "Derive the loss function for Logistic Regression.",
            questions: [
              { id: "ds_th_q1", text: "Did the candidate understand the mathematical derivation correctly?", type: "rating" },
              { id: "ds_th_q2", text: "Could they explain the intuition behind the math (e.g., Maximum Likelihood)?", type: "rating" },
              { id: "ds_th_q3", text: "Did they understand the assumptions of the model?", type: "rating" },
              { id: "ds_th_q4", text: "Could they explain convergence properties?", type: "rating" }
            ]
          },
          {
            title: "Model Selection",
            example: "Random Forest vs Gradient Boosting.",
            questions: [
              { id: "ds_th_q5", text: "Did the candidate compare them based on bias/variance?", type: "rating" },
              { id: "ds_th_q6", text: "Did they discuss training speed and interpretability?", type: "rating" },
              { id: "ds_th_q7", text: "Did they know when one fails vs the other?", type: "rating" }
            ]
          }
        ]
      },
      // Practical ML / Model Debugging
      "a7b9a03b-724d-409a-b80a-5a986bf6a187": {
        skill_name: "Practical ML / Model Debugging",
        templates: [
          {
            title: "Data Engineering & Prep",
            example: "Handling missing data and categorical variables.",
            questions: [
              { id: "ds_pra_q1", text: "Did the candidate propose valid imputation strategies (Mean vs KNN)?", type: "rating" },
              { id: "ds_pra_q2", text: "Did they handle high-cardinality features correctly?", type: "rating" },
              { id: "ds_pra_q3", text: "Did they discuss data leakage prevention?", type: "rating" },
              { id: "ds_pra_q4", text: "Did they check for class imbalance?", type: "rating" }
            ]
          },
          {
            title: "Debugging & Improvement",
            example: "Model is overfitting.",
            questions: [
              { id: "ds_pra_q5", text: "Did the candidate suggest regularization (L1/L2)?", type: "rating" },
              { id: "ds_pra_q6", text: "Did they discuss feature selection or dimensionality reduction?", type: "rating" },
              { id: "ds_pra_q7", text: "Did they mention collecting more data or augmentation?", type: "rating" }
            ]
          }
        ]
      },
      // Coding (Python / Pandas / Algo)
      "98bfbcf0-73d7-4605-adaa-6cf08a3c605e": {
        skill_name: "Coding (Python / Pandas / Algo)",
        templates: [
          {
            title: "Data Manipulation",
            example: "Pandas dataframe aggregation task.",
            questions: [
              { id: "ds_code_q1", text: "Did the candidate use vectorized operations properly?", type: "rating" },
              { id: "ds_code_q2", text: "Was the code readable and idiomatic Python?", type: "rating" },
              { id: "ds_code_q3", text: "Did they handle edge cases (empty DFs, NaNs)?", type: "rating" },
              { id: "ds_code_q4", text: "Was the memory usage considered?", type: "rating" }
            ]
          },
          {
            title: "Algorithmic Thinking",
            example: "Implement K-Means from scratch.",
            questions: [
              { id: "ds_code_q5", text: "Did the candidate structure the algorithm logic correctly?", type: "rating" },
              { id: "ds_code_q6", text: "Did they write clean functions/classes?", type: "rating" },
              { id: "ds_code_q7", text: "Did they optimize the distance calculation?", type: "rating" }
            ]
          }
        ]
      },
      // System Design (ML Systems)
      "54c23a69-ab56-42f8-8340-cb63bc1171d9": {
        skill_name: "System Design (ML Systems)",
        templates: [
          {
            title: "Architecture & Scale",
            example: "Design a recommendation system for Netflix.",
            questions: [
              { id: "ds_sys_q1", text: "Did the candidate split the system into Retrieval and Ranking?", type: "rating" },
              { id: "ds_sys_q2", text: "Did they discuss online vs offline serving?", type: "rating" },
              { id: "ds_sys_q3", text: "Did they handle latency constraints?", type: "rating" },
              { id: "ds_sys_q4", text: "Did they mention feature stores?", type: "rating" }
            ]
          },
          {
            title: "Productionization",
            example: "Monitoring and retraining strategy.",
            questions: [
              { id: "ds_sys_q5", text: "Did the candidate discuss drift detection (Data/Concept drift)?", type: "rating" },
              { id: "ds_sys_q6", text: "Did they propose a valid retraining frequency/trigger?", type: "rating" },
              { id: "ds_sys_q7", text: "Did they consider A/B testing infrastructure?", type: "rating" }
            ]
          }
        ]
      }
    }
  },

  // =========================================================
  // 4. HR / TALENT ACQUISITION -> ID: 10
  // =========================================================
  10: {
    profile_name: "HR / Talent Acquisition",
    skills: {
      // Behavioral / Scenario-Based
      "714da49f-f20f-490a-ac24-935c9a4c5faa": {
        skill_name: "Behavioral / Scenario-Based",
        templates: [
          {
            title: "Ethics & Integrity",
            example: "Handling a harassment complaint against a top performer.",
            questions: [
              { id: "hr_beh_q1", text: "Did the candidate prioritize safety and policy over performance?", type: "rating" },
              { id: "hr_beh_q2", text: "Did they outline a compliant investigation process?", type: "rating" },
              { id: "hr_beh_q3", text: "Did they show confidentiality and discretion?", type: "rating" },
              { id: "hr_beh_q4", text: "Did they manage the communication plan effectively?", type: "rating" }
            ]
          },
          {
            title: "Empathy & Culture",
            example: "Managing a layoff or restructuring.",
            questions: [
              { id: "hr_beh_q5", text: "Did the candidate demonstrate high empathy for affected employees?", type: "rating" },
              { id: "hr_beh_q6", text: "Did they consider the impact on the remaining survivors?", type: "rating" },
              { id: "hr_beh_q7", text: "Did they propose clear, transparent communication?", type: "rating" }
            ]
          }
        ]
      },
      // Recruitment Ops & Pipeline
      "559be4aa-9932-4de1-bd75-dd709db3cea2": {
        skill_name: "Recruitment Ops & Pipeline",
        templates: [
          {
            title: "Funnel Optimization",
            example: "Candidate drop-off is high at the offer stage.",
            questions: [
              { id: "hr_ops_q1", text: "Did the candidate analyze compensation competitiveness?", type: "rating" },
              { id: "hr_ops_q2", text: "Did they check the speed of the interview process?", type: "rating" },
              { id: "hr_ops_q3", text: "Did they review the candidate experience/employer brand?", type: "rating" },
              { id: "hr_ops_q4", text: "Did they propose data-backed interventions?", type: "rating" }
            ]
          },
          {
            title: "Sourcing Strategy",
            example: "Hiring for a niche role with few applicants.",
            questions: [
              { id: "hr_ops_q5", text: "Did the candidate suggest multi-channel sourcing (Outbound, Referrals)?", type: "rating" },
              { id: "hr_ops_q6", text: "Did they propose reviewing the JD for realistic requirements?", type: "rating" },
              { id: "hr_ops_q7", text: "Did they mention talent mapping competitors?", type: "rating" }
            ]
          }
        ]
      },
      // Stakeholder Management
      "b639e924-04ce-4eb0-b3f5-d04ec02e262d": {
        skill_name: "Stakeholder Management",
        templates: [
          {
            title: "Influencing Leaders",
            example: "Hiring Manager wants to hire a 'culture misfit'.",
            questions: [
              { id: "hr_stake_q1", text: "Did the candidate use data/examples to support their pushback?", type: "rating" },
              { id: "hr_stake_q2", text: "Did they explain the long-term risk to the team dynamics?", type: "rating" },
              { id: "hr_stake_q3", text: "Did they maintain a constructive relationship with the manager?", type: "rating" },
              { id: "hr_stake_q4", text: "Did they escalate appropriately if needed?", type: "rating" }
            ]
          },
          {
            title: "Expectation Management",
            example: "Closing a candidate with a lower-than-expected budget.",
            questions: [
              { id: "hr_stake_q5", text: "Did the candidate leverage non-monetary benefits (Growth, Culture)?", type: "rating" },
              { id: "hr_stake_q6", text: "Did they manage the candidate's expectations early in the process?", type: "rating" },
              { id: "hr_stake_q7", text: "Did they frame the offer holistically (Total Rewards)?", type: "rating" }
            ]
          }
        ]
      }
    }
  }
};