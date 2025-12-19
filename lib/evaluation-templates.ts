// lib/evaluation-templates.ts

// Type definitions
export interface TemplateQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | string; // 'boolean' supported via string
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
              { id: "pm_ps_q4", text: "Did they define a clear goal / JTBD before jumping to features?", type: "rating" },
              { id: "pm_ps_q5", text: "Did they explicitly call out key assumptions and what they'd validate first?", type: "rating" }
            ]
          },
          {
            title: "Solutioning, Trade-offs & Success",
            example: "Improve WhatsApp groups for large communities.",
            questions: [
              { id: "pm_ps_q6", text: "Did the candidate propose at least one non-obvious / differentiated solution?", type: "rating" },
              { id: "pm_ps_q7", text: "Did they prioritize features using a clear framework (impact/effort, RICE, etc.)?", type: "rating" },
              { id: "pm_ps_q8", text: "Did they discuss UX risks, abuse vectors, or edge cases (spam, privacy, accessibility)?", type: "rating" },
              { id: "pm_ps_q9", text: "Did they define success metrics + guardrails (e.g., retention vs toxicity)?", type: "rating" },
              { id: "pm_ps_q10", text: "Would you ship this v1 with confidence?", type: "boolean" },
              { id: "pm_ps_rem", text: "Overall Product Sense Feedback (what was strong/weak, key gaps, hire/no-hire rationale)", type: "text" }
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
            example: "DAU dropped 20% in the last week. Diagnose.",
            questions: [
              { id: "pm_exec_q1", text: "Did the candidate clarify metric definition, timeframe, and severity (real vs logging issue)?", type: "rating" },
              { id: "pm_exec_q2", text: "Did they segment to isolate (region/platform/cohort/channel)?", type: "rating" },
              { id: "pm_exec_q3", text: "Did they propose hypotheses across internal + external causes?", type: "rating" },
              { id: "pm_exec_q4", text: "Did they prioritize hypotheses by likelihood x impact (not a laundry list)?", type: "rating" },
              { id: "pm_exec_q5", text: "Did they tie investigation to funnel decomposition (acquisition → activation → retention)?", type: "rating" }
            ]
          },
          {
            title: "Decisioning, Metrics & Next Steps",
            example: "North Star metrics for YouTube Shorts (and what you'd monitor daily).",
            questions: [
              { id: "pm_exec_q6", text: "Did they propose a North Star metric aligned to value creation (not vanity)?", type: "rating" },
              { id: "pm_exec_q7", text: "Did they propose input metrics that drive the North Star (leading indicators)?", type: "rating" },
              { id: "pm_exec_q8", text: "Did they include guardrails/counter-metrics to prevent harm (quality, churn, creator health)?", type: "rating" },
              { id: "pm_exec_q9", text: "Did they propose an actionable next-step plan (what data, what dashboards, what owners)?", type: "rating" },
              { id: "pm_exec_q10", text: "Did they communicate uncertainty clearly (what they'd need to confirm)?", type: "boolean" },
              { id: "pm_exec_rem", text: "Overall Execution Feedback (structured? decisive? pragmatic?)", type: "text" }
            ]
          }
        ]
      },

      // Strategy & Market Understanding
      "eec759c9-ed0e-4305-9dd9-a36556e93ff0": {
        skill_name: "Strategy & Market Understanding",
        templates: [
          {
            title: "Market, Competition & Positioning",
            example: "How should Spotify compete with Apple Music?",
            questions: [
              { id: "pm_strat_q1", text: "Did the candidate structure analysis using a framework (5 Forces, SWOT, Jobs-to-be-done, etc.)?", type: "rating" },
              { id: "pm_strat_q2", text: "Did they identify customer segments + distinct needs (not one-size-fits-all)?", type: "rating" },
              { id: "pm_strat_q3", text: "Did they analyze competitive differentiation and moats (distribution, ecosystem, network effects)?", type: "rating" },
              { id: "pm_strat_q4", text: "Did they consider pricing/monetization realities and constraints?", type: "rating" },
              { id: "pm_strat_q5", text: "Did they evaluate risks (regulatory, partnerships, supply-side creators/artists)?", type: "rating" }
            ]
          },
          {
            title: "Go/No-Go, GTM & Long-Term Thinking",
            example: "Should Instagram enter online dating? What would your strategy be?",
            questions: [
              { id: "pm_strat_q6", text: "Did they size the opportunity (rough TAM/SAM/SOM or directional sizing)?", type: "rating" },
              { id: "pm_strat_q7", text: "Did they propose a clear wedge/beachhead + phased rollout?", type: "rating" },
              { id: "pm_strat_q8", text: "Did they connect strategy to product bets (features, partnerships, distribution)?", type: "rating" },
              { id: "pm_strat_q9", text: "Was the final recommendation decisive and well-supported?", type: "rating" },
              { id: "pm_strat_q10", text: "Would you trust this person to own a quarterly strategy narrative?", type: "boolean" },
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
            title: "System Concepts & Data Flow",
            example: "Explain how search autosuggest works end-to-end.",
            questions: [
              { id: "pm_tech_q1", text: "Did they clarify requirements (latency, accuracy, scale, languages, abuse/spam)?", type: "rating" },
              { id: "pm_tech_q2", text: "Did they explain components (client, API, service, cache, DB/index, analytics)?", type: "rating" },
              { id: "pm_tech_q3", text: "Did they describe the request/response cycle and where caching fits?", type: "rating" },
              { id: "pm_tech_q4", text: "Did they mention ranking signals (popularity, personalization, recency) at a high level?", type: "rating" },
              { id: "pm_tech_q5", text: "Did they discuss failure modes (fallbacks, partial outages, stale cache)?", type: "rating" }
            ]
          },
          {
            title: "Trade-offs & Working with Engineering",
            example: "SQL vs NoSQL trade-offs for a feed system. Monolith vs microservices.",
            questions: [
              { id: "pm_tech_q6", text: "Did they explain trade-offs with user impact (latency, reliability, consistency)?", type: "rating" },
              { id: "pm_tech_q7", text: "Did they talk about observability (logs/metrics/traces) and debugging?", type: "rating" },
              { id: "pm_tech_q8", text: "Did they show good API literacy (contracts, versioning, pagination, idempotency)?", type: "rating" },
              { id: "pm_tech_q9", text: "Did they avoid unnecessary jargon and stay at the right depth?", type: "rating" },
              { id: "pm_tech_q10", text: "Would engineers enjoy working with this PM?", type: "boolean" },
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
            title: "Conflict, Influence & Ownership",
            example: "Tell me about a time you disagreed with a stakeholder.",
            questions: [
              { id: "pm_beh_q1", text: "Did the candidate use a clear structure (STAR/CARE/What-SoWhat-NowWhat)?", type: "rating" },
              { id: "pm_beh_q2", text: "Did they demonstrate ownership (specific actions they took)?", type: "rating" },
              { id: "pm_beh_q3", text: "Did they show empathy for the stakeholder’s incentives and constraints?", type: "rating" },
              { id: "pm_beh_q4", text: "Did they use data / customer evidence to influence (not just opinions)?", type: "rating" },
              { id: "pm_beh_q5", text: "Was the outcome constructive and did it protect the relationship?", type: "rating" }
            ]
          },
          {
            title: "Resilience, Growth & Judgment",
            example: "Tell me about a failure and what you learned.",
            questions: [
              { id: "pm_beh_q6", text: "Did they take accountability without blaming others?", type: "rating" },
              { id: "pm_beh_q7", text: "Was the learning specific and applied later (behavior change)?", type: "rating" },
              { id: "pm_beh_q8", text: "Did they demonstrate good judgment under uncertainty?", type: "rating" },
              { id: "pm_beh_q9", text: "Would you trust them to lead cross-functional alignment in a tough quarter?", type: "boolean" },
              { id: "pm_beh_q10", text: "Any red flags (ego, blame, vagueness, lack of impact)?", type: "text" },
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
            title: "Core Query Skills (Top-N, Joins, Aggregations)",
            example: "Write a query to find the top 3 items per category.",
            questions: [
              { id: "da_sql_q1", text: "Did the candidate clarify the schema and expected output shape before writing SQL?", type: "rating" },
              { id: "da_sql_q2", text: "Did they choose the correct window function / approach (ROW_NUMBER vs RANK vs DENSE_RANK)?", type: "rating" },
              { id: "da_sql_q3", text: "Were joins correct (inner vs left) and did they avoid duplicate explosions?", type: "rating" },
              { id: "da_sql_q4", text: "Did they handle NULLs and edge cases (ties, missing categories) correctly?", type: "rating" },
              { id: "da_sql_q5", text: "Was the query readable (CTEs, naming, logical steps)?", type: "rating" }
            ]
          },
          {
            title: "Accuracy, Validation & Performance",
            example: "Optimize a slow query on a large dataset.",
            questions: [
              { id: "da_sql_q6", text: "Did they validate output correctness (spot checks, counts, duplicates)?", type: "rating" },
              { id: "da_sql_q7", text: "Did they demonstrate correct understanding of WHERE vs HAVING and GROUP BY behavior?", type: "rating" },
              { id: "da_sql_q8", text: "Did they mention performance levers (indexes/partition pruning/limiting scans) appropriately?", type: "rating" },
              { id: "da_sql_q9", text: "Would you trust this query in production for decision-making?", type: "boolean" },
              { id: "da_sql_rem", text: "Overall SQL Feedback (strengths, gaps, common pitfalls observed)", type: "text" }
            ]
          }
        ]
      },

      // Case Studies (Data → Insight)
      "1d072282-c794-4d7b-8aa4-27989bd5602a": {
        skill_name: "Case Studies (Data → Insight)",
        templates: [
          {
            title: "Diagnosis & Root Cause",
            example: "Sales dropped in South India—investigate.",
            questions: [
              { id: "da_case_q1", text: "Did the candidate clarify the metric definition and timeframe (real vs data issue)?", type: "rating" },
              { id: "da_case_q2", text: "Did they segment properly (channel, city, category, cohort, supply constraints)?", type: "rating" },
              { id: "da_case_q3", text: "Did they propose hypotheses across business + product + ops causes?", type: "rating" },
              { id: "da_case_q4", text: "Did they distinguish mix-shift vs within-segment decline?", type: "rating" },
              { id: "da_case_q5", text: "Did they avoid correlation traps and seek causal evidence?", type: "rating" }
            ]
          },
          {
            title: "Insight Storytelling & Actionability",
            example: "Present your recommendation to the CEO in 2 minutes.",
            questions: [
              { id: "da_case_q6", text: "Did they quantify impact / prioritize the biggest driver?", type: "rating" },
              { id: "da_case_q7", text: "Did they propose pragmatic next steps (data pulls, experiments, ops changes)?", type: "rating" },
              { id: "da_case_q8", text: "Was the narrative clear (what happened → why → what to do)?", type: "rating" },
              { id: "da_case_q9", text: "Would you trust them to lead the analysis end-to-end?", type: "boolean" },
              { id: "da_case_rem", text: "Overall Case Study Feedback", type: "text" }
            ]
          }
        ]
      },

      // Product Metrics & Experimentation
      "b800c6dc-2306-431c-9b72-ef4c6b2896e3": {
        skill_name: "Product Metrics & Experimentation",
        templates: [
          {
            title: "Metric Design & Experiment Setup",
            example: "Design an A/B test for a new checkout button.",
            questions: [
              { id: "da_exp_q1", text: "Did the candidate define a clear primary metric aligned to the goal?", type: "rating" },
              { id: "da_exp_q2", text: "Did they define guardrails (refunds, cancellations, latency, complaints)?", type: "rating" },
              { id: "da_exp_q3", text: "Did they state randomization unit (user/session) and why?", type: "rating" },
              { id: "da_exp_q4", text: "Did they discuss sample size / power / duration considerations?", type: "rating" },
              { id: "da_exp_q5", text: "Did they anticipate biases (novelty, seasonality, SRM)?", type: "rating" }
            ]
          },
          {
            title: "Result Interpretation & Decision",
            example: "P-value is 0.04 but guardrail metric worsened. Launch?",
            questions: [
              { id: "da_exp_q6", text: "Did they interpret statistical significance correctly and discuss confidence intervals?", type: "rating" },
              { id: "da_exp_q7", text: "Did they look beyond p-value to practical significance (effect size)?", type: "rating" },
              { id: "da_exp_q8", text: "Did they recommend a decision balancing business + risk?", type: "rating" },
              { id: "da_exp_q9", text: "Would you trust them to sign off an experiment readout?", type: "boolean" },
              { id: "da_exp_rem", text: "Overall Experimentation Feedback", type: "text" }
            ]
          }
        ]
      },

      // Excel / Visualization / Dashboarding
      "d2dd2979-5117-41e1-b32b-5804b717661b": {
        skill_name: "Excel / Visualization / Dashboarding",
        templates: [
          {
            title: "Visualization Choices & Clarity",
            example: "Build a dashboard to track weekly retention for 5 cohorts.",
            questions: [
              { id: "da_viz_q1", text: "Did the candidate choose appropriate chart types for the question (trend vs composition)?", type: "rating" },
              { id: "da_viz_q2", text: "Did they avoid misleading visuals (axes, truncation, too many colors)?", type: "rating" },
              { id: "da_viz_q3", text: "Did they label clearly and provide context (WoW/YoY, benchmarks)?", type: "rating" },
              { id: "da_viz_q4", text: "Did they surface the 'so what' (key insights) rather than just charts?", type: "rating" },
              { id: "da_viz_q5", text: "Did they consider audience/persona (VP vs IC) for level of detail?", type: "rating" }
            ]
          },
          {
            title: "Dashboard Logic & Operational Use",
            example: "Interpret this dashboard: traffic up, conversions down—what now?",
            questions: [
              { id: "da_viz_q6", text: "Did they propose drill-downs and segmentation to debug changes?", type: "rating" },
              { id: "da_viz_q7", text: "Did they identify missing metrics that would be needed to act?", type: "rating" },
              { id: "da_viz_q8", text: "Did they propose alerting thresholds or anomaly detection basics?", type: "rating" },
              { id: "da_viz_q9", text: "Would you trust them to build dashboards that leadership uses weekly?", type: "boolean" },
              { id: "da_viz_rem", text: "Overall Visualization/Dashboarding Feedback", type: "text" }
            ]
          }
        ]
      },

      // Behavioral / Communication
      "19b309a5-3860-41d4-8c5e-80fdc9300174": {
        skill_name: "Behavioral / Communication",
        templates: [
          {
            title: "Communication & Stakeholder Handling",
            example: "Present a complex finding to a non-technical audience.",
            questions: [
              { id: "da_beh_q1", text: "Did the candidate lead with the conclusion ('so what')?", type: "rating" },
              { id: "da_beh_q2", text: "Did they avoid jargon and explain trade-offs clearly?", type: "rating" },
              { id: "da_beh_q3", text: "Was the narrative structured and easy to follow?", type: "rating" },
              { id: "da_beh_q4", text: "Did they check understanding and handle questions calmly?", type: "rating" },
              { id: "da_beh_q5", text: "Did they communicate uncertainty appropriately (confidence, assumptions)?", type: "rating" }
            ]
          },
          {
            title: "Collaboration & Practical Judgment",
            example: "Stakeholder keeps changing requirements—what do you do?",
            questions: [
              { id: "da_beh_q6", text: "Did the candidate propose a process to manage scope creep (spec, sign-off, milestones)?", type: "rating" },
              { id: "da_beh_q7", text: "Did they push back constructively while staying collaborative?", type: "rating" },
              { id: "da_beh_q8", text: "Did they show ownership to drive decisions and unblock?", type: "rating" },
              { id: "da_beh_q9", text: "Would you put them in front of senior stakeholders?", type: "boolean" },
              { id: "da_beh_rem", text: "Overall Behavioral/Communication Feedback", type: "text" }
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
            title: "Core Theory & Intuition",
            example: "Explain bias–variance tradeoff and how it shows up in practice.",
            questions: [
              { id: "ds_th_q1", text: "Did the candidate explain the concept correctly (not memorized buzzwords)?", type: "rating" },
              { id: "ds_th_q2", text: "Did they connect it to overfitting/underfitting and model complexity?", type: "rating" },
              { id: "ds_th_q3", text: "Did they explain evaluation metrics appropriate to the task (AUC, F1, RMSE)?", type: "rating" },
              { id: "ds_th_q4", text: "Did they discuss assumptions/limitations of common models?", type: "rating" },
              { id: "ds_th_q5", text: "Did they show strong intuition for regularization and generalization?", type: "rating" }
            ]
          },
          {
            title: "Algorithm Choice & Trade-offs",
            example: "When would you use Logistic Regression vs XGBoost?",
            questions: [
              { id: "ds_th_q6", text: "Did they choose models based on data size, non-linearity, interpretability, latency?", type: "rating" },
              { id: "ds_th_q7", text: "Did they discuss feature interactions and handling of missing/categorical data?", type: "rating" },
              { id: "ds_th_q8", text: "Did they mention calibration, thresholds, and business constraints?", type: "rating" },
              { id: "ds_th_q9", text: "Would you trust their model selection judgment in production?", type: "boolean" },
              { id: "ds_th_rem", text: "Overall ML Theory Feedback", type: "text" }
            ]
          }
        ]
      },

      // Practical ML / Model Debugging
      "a7b9a03b-724d-409a-b80a-5a986bf6a187": {
        skill_name: "Practical ML / Model Debugging",
        templates: [
          {
            title: "Debugging Performance Issues",
            example: "Model overfits and offline gains don’t replicate online.",
            questions: [
              { id: "ds_pra_q1", text: "Did they check for data leakage and train/serve skew first?", type: "rating" },
              { id: "ds_pra_q2", text: "Did they propose correct validation (time split, stratification, CV) for the problem?", type: "rating" },
              { id: "ds_pra_q3", text: "Did they analyze error slices (segments where model fails)?", type: "rating" },
              { id: "ds_pra_q4", text: "Did they suggest regularization/early stopping/feature selection appropriately?", type: "rating" },
              { id: "ds_pra_q5", text: "Did they consider class imbalance and threshold tuning?", type: "rating" }
            ]
          },
          {
            title: "Production & Monitoring Mindset",
            example: "Feature importance changed after deployment. Why?",
            questions: [
              { id: "ds_pra_q6", text: "Did they identify drift (data/concept) and propose monitoring metrics?", type: "rating" },
              { id: "ds_pra_q7", text: "Did they propose retraining triggers or cadence logically?", type: "rating" },
              { id: "ds_pra_q8", text: "Did they consider feedback loops and labeling delays?", type: "rating" },
              { id: "ds_pra_q9", text: "Would you trust them to own a model in production?", type: "boolean" },
              { id: "ds_pra_rem", text: "Overall Practical ML Feedback", type: "text" }
            ]
          }
        ]
      },

      // Coding (Python / Pandas / Algo)
      "98bfbcf0-73d7-4605-adaa-6cf08a3c605e": {
        skill_name: "Coding (Python / Pandas / Algo)",
        templates: [
          {
            title: "Python + Pandas (Data Manipulation)",
            example: "Given events data, compute 7-day retention by cohort.",
            questions: [
              { id: "ds_code_q1", text: "Did the candidate write correct logic and produce correct output?", type: "rating" },
              { id: "ds_code_q2", text: "Was the code readable and idiomatic (naming, structure)?", type: "rating" },
              { id: "ds_code_q3", text: "Did they handle edge cases (empty dataframes, NaNs, duplicates)?", type: "rating" },
              { id: "ds_code_q4", text: "Did they use vectorized operations and avoid slow loops where possible?", type: "rating" },
              { id: "ds_code_q5", text: "Did they validate results (sanity checks) rather than blindly trusting code?", type: "rating" }
            ]
          },
          {
            title: "Algorithmic Thinking",
            example: "Solve a medium-level arrays/strings problem.",
            questions: [
              { id: "ds_code_q6", text: "Did they choose an efficient approach (time/space complexity)?", type: "rating" },
              { id: "ds_code_q7", text: "Did they explain their approach clearly while coding?", type: "rating" },
              { id: "ds_code_q8", text: "Did they test with custom cases and handle corner cases?", type: "rating" },
              { id: "ds_code_q9", text: "Would you trust this person to ship data code in a shared repo?", type: "boolean" },
              { id: "ds_code_rem", text: "Overall Coding Feedback", type: "text" }
            ]
          }
        ]
      },

      // Statistics & Experimentation (ADDED)
      "e48689a2-6fb8-4134-8ad9-2bea95c09f64": {
        skill_name: "Statistics & Experimentation",
        templates: [
          {
            title: "Core Statistical Concepts",
            example: "Explain p-value vs confidence interval, and what each tells you.",
            questions: [
              { id: "ds_stat_q1", text: "Did the candidate correctly define p-value and avoid common misconceptions?", type: "rating" },
              { id: "ds_stat_q2", text: "Did they correctly interpret confidence intervals (range + uncertainty)?", type: "rating" },
              { id: "ds_stat_q3", text: "Did they discuss Type I/II errors and statistical power?", type: "rating" },
              { id: "ds_stat_q4", text: "Did they choose the right test based on metric type and assumptions (t-test, chi-square, non-parametric)?", type: "rating" },
              { id: "ds_stat_q5", text: "Did they show awareness of multiple comparisons / peeking / p-hacking?", type: "rating" }
            ]
          },
          {
            title: "Applied Experimentation Judgment",
            example: "A/B test shows small lift but increased latency. What do you do?",
            questions: [
              { id: "ds_stat_q6", text: "Did they separate statistical vs practical significance (effect size, business impact)?", type: "rating" },
              { id: "ds_stat_q7", text: "Did they discuss randomization unit and independence assumptions (user vs session)?", type: "rating" },
              { id: "ds_stat_q8", text: "Did they consider SRM, novelty, seasonality, and instrumentation changes?", type: "rating" },
              { id: "ds_stat_q9", text: "Would you trust them to review and sign off experiment readouts?", type: "boolean" },
              { id: "ds_stat_rem", text: "Overall Statistics/Experimentation Feedback", type: "text" }
            ]
          }
        ]
      },

      // System Design (ML Systems)
      "54c23a69-ab56-42f8-8340-cb63bc1171d9": {
        skill_name: "System Design (ML Systems)",
        templates: [
          {
            title: "End-to-End ML Architecture",
            example: "Design a real-time recommendations engine.",
            questions: [
              { id: "ds_sys_q1", text: "Did the candidate clarify functional + non-functional requirements (latency, scale, freshness)?", type: "rating" },
              { id: "ds_sys_q2", text: "Did they define a clear data flow (events → features → training → serving)?", type: "rating" },
              { id: "ds_sys_q3", text: "Did they discuss feature store and training-serving parity / skew risks?", type: "rating" },
              { id: "ds_sys_q4", text: "Did they address retrieval vs ranking and why the split matters?", type: "rating" },
              { id: "ds_sys_q5", text: "Did they handle reliability concerns (fallbacks, retries, rate limits)?", type: "rating" }
            ]
          },
          {
            title: "Deployment, Monitoring & Iteration",
            example: "How would you deploy and monitor a fraud model at scale?",
            questions: [
              { id: "ds_sys_q6", text: "Did they propose safe rollout strategies (canary, shadow, rollback)?", type: "rating" },
              { id: "ds_sys_q7", text: "Did they propose drift/quality monitoring and alerting?", type: "rating" },
              { id: "ds_sys_q8", text: "Did they plan retraining triggers/cadence and model registry/versioning?", type: "rating" },
              { id: "ds_sys_q9", text: "Would you trust them to own system design discussions with infra teams?", type: "boolean" },
              { id: "ds_sys_rem", text: "Overall ML System Design Feedback", type: "text" }
            ]
          }
        ]
      }
    }
  },

  // =========================================================
  // 4. HR -> ID: 10
  // =========================================================
  10: {
    profile_name: "HR",
    skills: {
      // Talent Acquisition
      "559be4aa-9932-4de1-bd75-dd709db3cea2": {
        skill_name: "Talent Acquisition",
        templates: [
          {
            title: "Hiring Strategy & Funnel Design",
            example: "You need to hire 20 people in 60 days for a new business line. How do you plan?",
            questions: [
              { id: "hr_ta_q1", text: "Did the candidate clarify role requirements, success profile, and prioritization (must-have vs good-to-have)?", type: "rating" },
              { id: "hr_ta_q2", text: "Did they design a funnel (sources → screen → interviews → offer) with realistic throughput?", type: "rating" },
              { id: "hr_ta_q3", text: "Did they consider interviewer capacity, SLAs, and scheduling constraints?", type: "rating" },
              { id: "hr_ta_q4", text: "Did they define TA metrics (time-to-hire, pass-through, offer acceptance, quality-of-hire signals)?", type: "rating" },
              { id: "hr_ta_q5", text: "Did they identify bottlenecks and propose levers (JD rewrite, sourcing mix, interview loop redesign)?", type: "rating" }
            ]
          },
          {
            title: "Candidate Experience, Closing & Integrity",
            example: "A top candidate declines at offer stage. Diagnose and fix the process.",
            questions: [
              { id: "hr_ta_q6", text: "Did they diagnose likely causes (comp, role clarity, speed, manager, brand, competing offers)?", type: "rating" },
              { id: "hr_ta_q7", text: "Did they propose specific experience improvements (updates, feedback, transparency, prep, scheduling)?", type: "rating" },
              { id: "hr_ta_q8", text: "Did they show fairness/compliance awareness (bias reduction, structured interviews)?", type: "rating" },
              { id: "hr_ta_q9", text: "Would you trust this person to run hiring independently and ethically?", type: "boolean" },
              { id: "hr_ta_rem", text: "Overall Talent Acquisition Feedback", type: "text" }
            ]
          }
        ]
      },

      // HR Generalist
      "714da49f-f20f-490a-ac24-935c9a4c5faa": {
        skill_name: "HR Generalist",
        templates: [
          {
            title: "Employee Lifecycle & Performance",
            example: "An employee’s performance drops sharply after 6 months. What do you do?",
            questions: [
              { id: "hr_gen_q1", text: "Did the candidate diagnose root causes (role fit, manager issues, clarity, personal factors) without jumping to conclusions?", type: "rating" },
              { id: "hr_gen_q2", text: "Did they propose a structured performance process (expectations, feedback, coaching, PIP if needed)?", type: "rating" },
              { id: "hr_gen_q3", text: "Did they balance empathy with accountability and fairness?", type: "rating" },
              { id: "hr_gen_q4", text: "Did they emphasize documentation and consistent policy application?", type: "rating" },
              { id: "hr_gen_q5", text: "Did they consider broader engagement/retention implications for the team?", type: "rating" }
            ]
          },
          {
            title: "Grievances, Conflict & Sensitive Handling",
            example: "Two employees report ongoing conflict affecting the team.",
            questions: [
              { id: "hr_gen_q6", text: "Did they listen to both sides and avoid bias?", type: "rating" },
              { id: "hr_gen_q7", text: "Did they propose mediation steps and clear behavioral expectations?", type: "rating" },
              { id: "hr_gen_q8", text: "Did they manage confidentiality appropriately?", type: "rating" },
              { id: "hr_gen_q9", text: "Would you trust them with sensitive employee issues end-to-end?", type: "boolean" },
              { id: "hr_gen_rem", text: "Overall HR Generalist Feedback", type: "text" }
            ]
          }
        ]
      },

      // HR Operations
      "30816e42-6cb8-41c9-a0c6-751eb178536b": {
        skill_name: "HR Operations",
        templates: [
          {
            title: "Process, Compliance & Accuracy",
            example: "Payroll errors are reported across teams. How do you respond and prevent repeats?",
            questions: [
              { id: "hr_ops_q1", text: "Did the candidate triage with urgency and define immediate containment steps?", type: "rating" },
              { id: "hr_ops_q2", text: "Did they identify likely failure points (inputs, approvals, HRIS, vendor, cutoffs)?", type: "rating" },
              { id: "hr_ops_q3", text: "Did they prioritize statutory compliance and auditability?", type: "rating" },
              { id: "hr_ops_q4", text: "Did they propose root-cause fixes (SOPs, checks, automation) rather than patches?", type: "rating" },
              { id: "hr_ops_q5", text: "Did they propose measurable operational KPIs (accuracy, TAT, ticket backlog, SLA adherence)?", type: "rating" }
            ]
          },
          {
            title: "Scale Readiness & HRIS Thinking",
            example: "Company is scaling 3x—how do HR ops scale without breaking?",
            questions: [
              { id: "hr_ops_q6", text: "Did they propose standardization (SOPs, templates, self-serve, ticketing)?", type: "rating" },
              { id: "hr_ops_q7", text: "Did they show HRIS literacy (workflows, data hygiene, access controls)?", type: "rating" },
              { id: "hr_ops_q8", text: "Did they anticipate risks (data privacy, access, compliance, vendor failures)?", type: "rating" },
              { id: "hr_ops_q9", text: "Would you trust them to run HR ops with minimal supervision?", type: "boolean" },
              { id: "hr_ops_rem", text: "Overall HR Operations Feedback", type: "text" }
            ]
          }
        ]
      },

      // HR Business Partner
      "b639e924-04ce-4eb0-b3f5-d04ec02e262d": {
        skill_name: "HR Business Partner",
        templates: [
          {
            title: "Org Design, Change & Business Alignment",
            example: "Leadership wants to restructure a function. How do you approach it?",
            questions: [
              { id: "hr_bp_q1", text: "Did the candidate clarify business goals and constraints (growth, cost, speed, quality)?", type: "rating" },
              { id: "hr_bp_q2", text: "Did they diagnose org design issues (ownership, interfaces, spans/layers, incentives)?", type: "rating" },
              { id: "hr_bp_q3", text: "Did they consider people impact (morale, retention, role clarity, manager load)?", type: "rating" },
              { id: "hr_bp_q4", text: "Did they propose a change plan (communication, timeline, enablement, feedback loops)?", type: "rating" },
              { id: "hr_bp_q5", text: "Did they balance business outcomes with employee trust and fairness?", type: "rating" }
            ]
          },
          {
            title: "Influence, Performance & Conflict Mediation",
            example: "A manager is toxic but delivers results. What do you do?",
            questions: [
              { id: "hr_bp_q6", text: "Did they handle the scenario with strong ethics and policy grounding?", type: "rating" },
              { id: "hr_bp_q7", text: "Did they propose evidence gathering and documentation (not hearsay decisions)?", type: "rating" },
              { id: "hr_bp_q8", text: "Did they show ability to influence senior leaders with data and structured reasoning?", type: "rating" },
              { id: "hr_bp_q9", text: "Would leadership trust this HRBP as a true partner?", type: "boolean" },
              { id: "hr_bp_rem", text: "Overall HRBP Feedback", type: "text" }
            ]
          }
        ]
      },

      // COE – HR Functions
      "f42714f9-1ecb-4943-a62f-0ce1b58052f7": {
        skill_name: "COE – HR Functions",
        templates: [
          {
            title: "Specialist Depth (C&B / L&D / TM / DEI / Performance)",
            example: "Design a new performance management framework that managers actually use.",
            questions: [
              { id: "hr_coe_q1", text: "Did the candidate demonstrate deep functional expertise (not generic HR talk)?", type: "rating" },
              { id: "hr_coe_q2", text: "Did they use principles/benchmarks (calibration, fairness, simplicity, manager load)?", type: "rating" },
              { id: "hr_coe_q3", text: "Did they anticipate failure modes (gaming, bias, manager inconsistency)?", type: "rating" },
              { id: "hr_coe_q4", text: "Did they propose measurement (adoption, quality, outcomes like attrition/engagement)?", type: "rating" },
              { id: "hr_coe_q5", text: "Did they balance employee experience with business goals?", type: "rating" }
            ]
          },
          {
            title: "Rollout, Governance & Change Management",
            example: "Roll out a new rewards or L&D program across 500+ employees.",
            questions: [
              { id: "hr_coe_q6", text: "Did they propose a rollout plan (pilot, phased expansion, training, comms)?", type: "rating" },
              { id: "hr_coe_q7", text: "Did they define governance and decision rights (COE vs HRBP vs leaders)?", type: "rating" },
              { id: "hr_coe_q8", text: "Did they include feedback loops and iteration plan?", type: "rating" },
              { id: "hr_coe_q9", text: "Would you trust them to own a COE program end-to-end?", type: "boolean" },
              { id: "hr_coe_rem", text: "Overall COE Feedback", type: "text" }
            ]
          }
        ]
      }
    }
  }
};
