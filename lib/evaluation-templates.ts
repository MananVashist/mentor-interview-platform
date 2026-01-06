// lib/evaluation-templates.ts

// Type definitions
export interface TemplateQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | string; // 'boolean' supported via string
  title?: string[]; // ✅ UPDATED: Array support for tooltips
}

export interface EvaluationTemplate {
  title: string;
  example: string[]; // ✅ UPDATED: Array support for multiple scenarios
  questions: TemplateQuestion[];
}

export interface SkillCategory {
  skill_name: string; 
  templates: EvaluationTemplate[];
}

export interface InterviewProfile {
  profile_name: string; 
  skills: Record<string, SkillCategory>; 
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
            example: [
              "Design a better alarm clock for the blind.",
              "Design a smart vending machine for a gym.",
              "Design a travel kiosk for a train station in a foreign country.",
              "Design an ATM for children aged 8-12.",
              "Design a bookshelf for a micro-apartment."
            ],
            questions: [
              { 
                id: "pm_ps_q1", 
                text: "Did the candidate identify distinct, specific user segments rather than generic ones?", 
                type: "rating",
                title: [ "Who exactly are we building this for?", "Can you break down the potential user base into distinct groups?", "Who is the 'power user' vs. the 'casual user'?", "Are there any niche segments that face this problem differently?", "Who are we explicitly choosing NOT to serve?"]
              },
              { 
                id: "pm_ps_q2", 
                text: "Did they articulate the specific pain points of the chosen segment with empathy?", 
                type: "rating",
                title: [ "Walk me through a 'day in the life' of this user.", "What specific frustrations does this user face right now?", "How does the current solution fail them?", "What is the emotional state of the user when this problem occurs?", "Why is this problem urgent for them?"]
              },
              { 
                id: "pm_ps_q3", 
                text: "Did they prioritize one segment/problem clearly with logical reasoning?", 
                type: "rating",
                title: [ "If we can only solve for one group, who should it be?", "Why did you choose this segment over the others?", "What criteria are you using to prioritize (size, urgency, value)?", "Why is this specific problem the most critical to solve first?", "What is the strategic value of targeting this group?"]
              },
              { 
                id: "pm_ps_q4", 
                text: "Did they define a clear goal / JTBD before jumping to features?", 
                type: "rating",
                title: [ "What is the core 'Job to be Done' for this user?", "In one sentence, what is the goal of this product?", "What does success look like for the user?", "Before we discuss solutions, what is the objective?", "How will we know if we've actually solved the problem?"]
              },
              { 
                id: "pm_ps_q5", 
                text: "Did they explicitly call out key assumptions and what they'd validate first?", 
                type: "rating",
                title: [ "What is the biggest risk in your understanding so far?", "What assumptions are we making about user behavior?", "How would you verify that this is actually a problem?", "What is the 'leap of faith' in this hypothesis?", "How could we validate this without building anything?"]
              }
            ]
          },
          {
            title: "Solutioning, Trade-offs & Success",
            example: [
              "Improve WhatsApp groups for large communities.",
              "Improve the post-purchase experience on Amazon.",
              "Improve Google Maps for pedestrians in a rush.",
              "Improve Spotify for podcast listeners.",
              "Improve the checkout process at a grocery store."
            ],
            questions: [
              { 
                id: "pm_ps_q6", 
                text: "Did the candidate propose at least one non-obvious / differentiated solution?", 
                type: "rating",
                title: [ "What is a 'blue sky' or wild idea for this?", "How would we solve this if technology wasn't a constraint?", "Is there a solution that doesn't involve a screen?", "How would a competitor explicitly NOT solve this?", "What is the 10x solution, not just the 10% improvement?"]
              },
              { 
                id: "pm_ps_q7", 
                text: "Did they prioritize features using a clear framework (impact/effort, RICE, etc.)?", 
                type: "rating",
                title: [ "How would you rank these solutions?", "Which feature delivers the highest impact for the lowest cost?", "Walk me through your prioritization logic.", "What is the MVP (Minimum Viable Product) cut?", "If we had half the budget, what would you cut?"]
              },
              { 
                id: "pm_ps_q8", 
                text: "Did they discuss UX risks, abuse vectors, or edge cases?", 
                type: "rating",
                title: [ "How could a bad actor misuse this feature?", "What are the privacy implications of this data?", "How does this work for a user with low bandwidth?", "What happens if a user gets spammed?", "Does this comply with GDPR/privacy standards?"]
              },
              { 
                id: "pm_ps_q9", 
                text: "Did they define success metrics + guardrails?", 
                type: "rating",
                title: [ "What is the North Star metric for this feature?", "How do we measure if users actually like it?", "What is the counter-metric (what might go wrong)?", "How would this impact our existing revenue?", "What signals would make us roll this back?"]
              },
              { 
                id: "pm_ps_q10", 
                text: "Would you ship this v1 with confidence?", 
                type: "boolean",
                title: [ "Does this feel like a complete MVP?", "Are there any glaring holes left?", "Is the value proposition clear enough to launch?", "Would you use this product yourself?", "Is the risk profile acceptable?"]
              },
              { 
                id: "pm_ps_rem", 
                text: "Overall Product Sense Feedback", 
                type: "text",
                title: [ "What was the strongest part of their answer?", "Where did their logic break down?", "Did they show true user empathy?", "Was the solution creative or derivative?", "How structured was their thinking?"]
              }
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
            example: [
              "DAU dropped 20% in the last week. Diagnose.",
              "Uber ride cancellations increased by 10% yesterday. Investigate.",
              "Netflix streaming latency spiked by 500ms in Brazil. Why?",
              "Instagram Stories views are flat, but feed posts are down. Why?",
              "Shopping cart abandonment rate jumped 15% on mobile. Diagnose."
            ],
            questions: [
              { 
                id: "pm_exec_q1", 
                text: "Did the candidate clarify metric definition, timeframe, and severity?", 
                type: "rating",
                title: [ "How specifically is DAU defined here?", "Is this a sudden drop or a gradual decline?", "Could this be a data logging error?", "Is the data source reliable?", "Does this align with other metrics?"]
              },
              { 
                id: "pm_exec_q2", 
                text: "Did they segment to isolate (region/platform/cohort/channel)?", 
                type: "rating",
                title: [ "Is this happening on iOS, Android, or Web?", "Is it affecting a specific country or region?", "Is it new users or existing users?", "Does it correlate with a specific app version?", "Is it affecting specific acquisition channels?"]
              },
              { 
                id: "pm_exec_q3", 
                text: "Did they propose hypotheses across internal + external causes?", 
                type: "rating",
                title: [ "Did we ship a bug recently?", "Did a competitor launch something new?", "Are there any holidays or cultural events?", "Was there a server outage?", "Did marketing stop a campaign?"]
              },
              { 
                id: "pm_exec_q4", 
                text: "Did they prioritize hypotheses by likelihood x impact?", 
                type: "rating",
                title: [ "Which of these causes is most likely?", "What should we check first?", "How do we rule out technical issues quickly?", "What has the highest impact if true?", "Can we binary search the problem?"]
              },
              { 
                id: "pm_exec_q5", 
                text: "Did they tie investigation to funnel decomposition?", 
                type: "rating",
                title: [ "Is the drop at the top of the funnel (visits)?", "Are users failing to log in?", "Is retention dropping for older cohorts?", "Is conversion rate down?", "Where exactly is the leakage?"]
              }
            ]
          },
          {
            title: "Decisioning, Metrics & Next Steps",
            example: [
              "North Star metrics for YouTube Shorts.",
              "Success metrics for Facebook Dating launch.",
              "Counter-metrics for TikTok's algorithm.",
              "Metrics to track the health of the Amazon Marketplace.",
              "Daily dashboard metrics for Uber Eats."
            ],
            questions: [
              { 
                id: "pm_exec_q6", 
                text: "Did they propose a North Star metric aligned to value creation?", 
                type: "rating",
                title: [ "Does this metric reflect user value?", "Why not just track 'total views' or revenue?", "How does this align with long-term retention?", "Is this metric gameable?", "Does this metric capture the ecosystem's health?"]
              },
              { 
                id: "pm_exec_q7", 
                text: "Did they propose input metrics that drive the North Star?", 
                type: "rating",
                title: [ "What actions drive the North Star?", "What are the levers we can pull?", "How does 'videos uploaded' affect this?", "Are these metrics actionable for the team?", "Can we influence these input metrics directly?"]
              },
              { 
                id: "pm_exec_q8", 
                text: "Did they include guardrails to prevent harm?", 
                type: "rating",
                title: [ "What happens if we optimize too much for views?", "Are we burning out the creators?", "Is the content quality degrading (clickbait)?", "Are we increasing ad load too much?", "Is user sentiment dropping?"]
              },
              { 
                id: "pm_exec_q9", 
                text: "Did they propose an actionable next-step plan?", 
                type: "rating",
                title: [ "Who needs to see this data?", "What dashboard would you build tomorrow?", "How often should we review this?", "Who owns the fix if a metric drops?", "What is the SLA for reporting?"]
              },
              { 
                id: "pm_exec_q10", 
                text: "Did they communicate uncertainty clearly?", 
                type: "boolean",
                title: [ "Did they admit what they don't know?", "Did they ask for more data context?", "Are they confident or guessing?", "Did they qualify their assumptions?", "Are they open to being wrong?"]
              },
              { 
                id: "pm_exec_rem", 
                text: "Overall Execution Feedback", 
                type: "text",
                title: [ "Was the RCA logical?", "Did they jump to conclusions?", "Was the metric selection sound?", "Did they show business acumen?", "Was the plan actionable?"]
              }
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
            example: [
              "How should Spotify compete with Apple Music?",
              "How should Netflix respond to Disney+ bundled pricing?",
              "How should Uber compete with Waymo (autonomous vehicles)?",
              "Assess the threat of TikTok to YouTube's dominance.",
              "How should Slack differentiate itself from Microsoft Teams?"
            ],
            questions: [
              { 
                id: "pm_strat_q1", 
                text: "Did the candidate structure analysis using a framework?", 
                type: "rating",
                title: [ "What framework are you using (SWOT, 5 Forces)?", "Can you do a SWOT analysis?", "What is the value chain?", "How does the 3C (Company, Customer, Competitor) model fit?", "Is the structure logical?"]
              },
              { 
                id: "pm_strat_q2", 
                text: "Did they identify customer segments + distinct needs?", 
                type: "rating",
                title: [ "Does everyone use this product the same way?", "Who are the switchers vs loyalists?", "What is the price sensitivity of each segment?", "Which segment is most at risk?", "Who is the underserved niche?"]
              },
              { 
                id: "pm_strat_q3", 
                text: "Did they analyze competitive differentiation and moats?", 
                type: "rating",
                title: [ "What is Apple's unfair advantage?", "What is Spotify's moat?", "How strong are the network effects?", "What about switching costs?", "Can they compete on price?"]
              },
              { 
                id: "pm_strat_q4", 
                text: "Did they consider pricing/monetization realities?", 
                type: "rating",
                title: [ "Can we afford to lower prices?", "What is the unit economics implication?", "Is the LTV (Lifetime Value) high enough?", "Are we subsidizing growth?", "What is the willingness to pay?"]
              },
              { 
                id: "pm_strat_q5", 
                text: "Did they evaluate risks (regulatory, partnerships, etc.)?", 
                type: "rating",
                title: [ "Will regulators block this?", "Are we dependent on a single supplier?", "What if the economy crashes?", "Is there a PR risk?", "Are we alienating partners?"]
              }
            ]
          },
          {
            title: "Go/No-Go, GTM & Long-Term Thinking",
            example: [
              "Should Instagram enter the online dating market?",
              "Should Spotify launch hardware (e.g., headphones)?",
              "Should Uber launch a 'Moving Service'?",
              "Should Netflix offer a free ad-supported tier?",
              "Should Amazon launch a bank?"
            ],
            questions: [
              { 
                id: "pm_strat_q6", 
                text: "Did they size the opportunity (rough TAM/SAM/SOM)?", 
                type: "rating",
                title: [ "How big is this market realistically?", "What % of the market can we capture?", "Is this a billion-dollar opportunity?", "How did you estimate the user base?", "Is the market growing or shrinking?"]
              },
              { 
                id: "pm_strat_q7", 
                text: "Did they propose a clear wedge/beachhead + phased rollout?", 
                type: "rating",
                title: [ "Where do we start?", "Which city/segment gets it first?", "What is Phase 1 vs Phase 2?", "How do we validate before scaling?", "What is the 'Minimum Lovable Product'?"]
              },
              { 
                id: "pm_strat_q8", 
                text: "Did they connect strategy to product bets?", 
                type: "rating",
                title: [ "What features do we need to build to win?", "Do we need to acquire a company?", "What partnerships are essential?", "How does distribution work?", "Is the product vision aligned with the strategy?"]
              },
              { 
                id: "pm_strat_q9", 
                text: "Was the final recommendation decisive and well-supported?", 
                type: "rating",
                title: [ "So, is it a Go or No-Go?", "Are you wavering or confident?", "What is the strongest argument against your decision?", "Did you synthesize the data well?", "Is the story coherent?"]
              },
              { 
                id: "pm_strat_q10", 
                text: "Would you trust this person to own a quarterly strategy narrative?", 
                type: "boolean",
                title: [ "Could they present this to the Board?", "Is the narrative compelling?", "Did they handle the complexity well?", "Do they think like a business owner?", "Is the strategic vision clear?"]
              },
              { 
                id: "pm_strat_rem", 
                text: "Overall Strategy Feedback", 
                type: "text",
                title: [ "Did they see the big picture?", "Was the financial reasoning sound?", "Did they identify the correct leverage points?", "Was the GTM plan realistic?", "Did they show creativity in strategy?"]
              }
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
            example: [
              "Explain how search autosuggest works end-to-end.",
              "Explain what happens when you type a URL in the browser.",
              "Explain how WhatsApp delivers a message from User A to User B.",
              "Explain how a ride-matching algorithm (like Uber) works.",
              "Explain how Google Docs real-time collaboration works."
            ],
            questions: [
              { 
                id: "pm_tech_q1", 
                text: "Did they clarify requirements (latency, accuracy, scale)?", 
                type: "rating",
                title: [ "How fast does it need to be?", "How many users are we supporting?", "What is the acceptable error rate?", "Do we need real-time updates?", "What languages do we support?"]
              },
              { 
                id: "pm_tech_q2", 
                text: "Did they explain components (client, API, service, cache, DB)?", 
                type: "rating",
                title: [ "What does the client do?", "What is the role of the load balancer?", "Where do we store the data?", "Why do we need a cache here?", "How do the services communicate?"]
              },
              { 
                id: "pm_tech_q3", 
                text: "Did they describe the request/response cycle?", 
                type: "rating",
                title: [ "Walk me through the data path.", "What happens if the server is busy?", "How does the client know the data is ready?", "Where does caching fit in the flow?", "Is it synchronous or asynchronous?"]
              },
              { 
                id: "pm_tech_q4", 
                text: "Did they mention ranking signals at a high level?", 
                type: "rating",
                title: [ "How do we decide which result is first?", "What data feeds the algorithm?", "Is it personalized or global?", "How do we handle cold start?", "What signals indicate relevance?"]
              },
              { 
                id: "pm_tech_q5", 
                text: "Did they discuss failure modes (fallbacks, outages)?", 
                type: "rating",
                title: [ "What happens if the DB goes down?", "Do we have a backup plan?", "What does the user see if it fails?", "How do we handle stale data?", "Is there a retry mechanism?"]
              }
            ]
          },
          {
            title: "Trade-offs & Working with Engineering",
            example: [
              "SQL vs NoSQL trade-offs for a social media feed.",
              "Monolith vs Microservices: When should we switch?",
              "Real-time data vs Batch processing for analytics.",
              "Native App vs React Native vs PWA trade-offs.",
              "How do you handle technical debt vs new features?"
            ],
            questions: [
              { 
                id: "pm_tech_q6", 
                text: "Did they explain trade-offs with user impact?", 
                type: "rating",
                title: [ "How does this choice affect load time?", "Will this make the app crash more?", "Does this slow down development speed?", "Is the data consistency worth the latency?", "How does this affect offline usage?"]
              },
              { 
                id: "pm_tech_q7", 
                text: "Did they talk about observability and debugging?", 
                type: "rating",
                title: [ "How will we know if it breaks?", "What logs do we need?", "How do we trace a request?", "What metrics alert the on-call engineer?", "Is the system easy to debug?"]
              },
              { 
                id: "pm_tech_q8", 
                text: "Did they show good API literacy?", 
                type: "rating",
                title: [ "Is the API idempotent?", "How do we handle versioning?", "What is the pagination strategy?", "Is the payload optimized?", "How do we handle rate limiting?"]
              },
              { 
                id: "pm_tech_q9", 
                text: "Did they avoid unnecessary jargon?", 
                type: "rating",
                title: [ "Did they explain concepts simply?", "Did they use buzzwords correctly?", "Could a non-technical person understand?", "Was the explanation efficient?", "Did they focus on the 'why'?"]
              },
              { 
                id: "pm_tech_q10", 
                text: "Would engineers enjoy working with this PM?", 
                type: "boolean",
                title: [ "Do they respect engineering constraints?", "Are they collaborative or prescriptive?", "Do they ask the right questions?", "Are they willing to learn?", "Do they enable the team?"]
              },
              { 
                id: "pm_tech_rem", 
                text: "Overall Technical Feedback", 
                type: "text",
                title: [ "Was the system design sound?", "Did they understand the trade-offs?", "Was the communication clear?", "Did they identify risks?", "practical application vs theory?"]
              }
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
            example: [
              "Tell me about a time you disagreed with a stakeholder.",
              "Tell me about a time you had to influence without authority.",
              "Tell me about a time you had a conflict with an engineer.",
              "Tell me about a time you managed a toxic team member.",
              "Tell me about a time you successfully managed scope creep."
            ],
            questions: [
              { 
                id: "pm_beh_q1", 
                text: "Did the candidate use a clear structure (STAR)?", 
                type: "rating",
                title: [ "Did they set the Context?", "Did they explain the Action taken?", "What was the Result?", "Was the story easy to follow?", "Did they ramble?"]
              },
              { 
                id: "pm_beh_q2", 
                text: "Did they demonstrate ownership?", 
                type: "rating",
                title: [ "Did they say 'I' or 'We' appropriately?", "Did they take initiative?", "Did they wait for permission?", "Did they go above and beyond?", "Was the action decisive?"]
              },
              { 
                id: "pm_beh_q3", 
                text: "Did they show empathy for the stakeholder?", 
                type: "rating",
                title: [ "Did they understand the other person's view?", "Did they validate the other's concerns?", "Was the approach collaborative?", "Did they build trust?", "Did they listen?"]
              },
              { 
                id: "pm_beh_q4", 
                text: "Did they use data / evidence to influence?", 
                type: "rating",
                title: [ "Did they bring numbers to the argument?", "Did they quote user feedback?", "Was the argument logical?", "Did they avoid being emotional?", "Did they frame it in business terms?"]
              },
              { 
                id: "pm_beh_q5", 
                text: "Was the outcome constructive?", 
                type: "rating",
                title: [ "Did the relationship survive?", "Was the project successful?", "Did they learn from the conflict?", "Was it a win-win?", "Would they work together again?"]
              }
            ]
          },
          {
            title: "Resilience, Growth & Judgment",
            example: [
              "Tell me about a failure and what you learned.",
              "Tell me about a time you launched a feature that flopped.",
              "Tell me about a time you had to make a decision with incomplete data.",
              "Tell me about a time you received tough feedback.",
              "Tell me about a time you prioritized the company over your team."
            ],
            questions: [
              { 
                id: "pm_beh_q6", 
                text: "Did they take accountability without blaming others?", 
                type: "rating",
                title: [ "Did they own the mistake?", "Did they throw anyone under the bus?", "Was the apology sincere?", "Did they focus on the solution?", "Did they admit fault quickly?"]
              },
              { 
                id: "pm_beh_q7", 
                text: "Was the learning specific and applied later?", 
                type: "rating",
                title: [ "What did they change in their process?", "Did the mistake happen again?", "Was the lesson actionable?", "Did they share the learning?", "Did they grow from it?"]
              },
              { 
                id: "pm_beh_q8", 
                text: "Did they demonstrate good judgment under uncertainty?", 
                type: "rating",
                title: [ "How did they weigh the risks?", "Was the decision rational at the time?", "Did they seek advice?", "Did they stay calm?", "Did they mitigate downside?"]
              },
              { 
                id: "pm_beh_q9", 
                text: "Would you trust them to lead alignment in a tough quarter?", 
                type: "boolean",
                title: [ "Do they have gravitas?", "Can they rally the team?", "Are they resilient?", "Do they communicate clearly in crisis?", "Do they inspire confidence?"]
              },
              { 
                id: "pm_beh_q10", 
                text: "Any red flags?", 
                type: "text",
                title: [ "Signs of arrogance?", "Lack of self-awareness?", "Victimized mindset?", "Inconsistency in stories?", "Poor listening skills?"]
              },
              { 
                id: "pm_beh_rem", 
                text: "Overall Behavioral Feedback", 
                type: "text",
                title: [ "Cultural fit?", "Leadership potential?", "Maturity level?", "Emotional intelligence?", "Communication style?"]
              }
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
            example: [
              "Write a query to find the top 3 items per category.",
              "Find users who made a purchase in Jan but not Feb.",
              "Calculate the rolling 7-day average of sales.",
              "Find the 2nd highest salary in each department.",
              "Count the number of active streaks (consecutive days) per user."
            ],
            questions: [
              { 
                id: "da_sql_q1", 
                text: "Did the candidate clarify the schema and expected output shape?", 
                type: "rating",
                title: [ "Did they ask for table definitions?", "Did they ask about data types?", "Did they confirm the granularity (one row per user)?", "Did they check for foreign keys?", "Did they understand the relationship between tables?"]
              },
              { 
                id: "da_sql_q2", 
                text: "Did they choose the correct window function / approach?", 
                type: "rating",
                title: [ "Why ROW_NUMBER vs RANK vs DENSE_RANK?", "Did they handle ties correctly?", "Is the partition clause correct?", "Is the order by clause correct?", "Did they use a subquery where needed?"]
              },
              { 
                id: "da_sql_q3", 
                text: "Were joins correct (inner vs left) and did they avoid duplicates?", 
                type: "rating",
                title: [ "Why Left Join vs Inner Join?", "Did they check for 1:many relationships?", "Did the row count explode?", "Did they filter before joining?", "Did they handle mismatched keys?"]
              },
              { 
                id: "da_sql_q4", 
                text: "Did they handle NULLs and edge cases correctly?", 
                type: "rating",
                title: [ "How does count(*) vs count(col) differ?", "Did they coalesce NULLs?", "Did they handle division by zero?", "What if the category is missing?", "Did they handle empty strings?"]
              },
              { 
                id: "da_sql_q5", 
                text: "Was the query readable (CTEs, naming)?", 
                type: "rating",
                title: [ "Did they use CTEs or nested subqueries?", "Are the aliases meaningful?", "Is the indentation clear?", "Did they comment complex logic?", "Is it easy to maintain?"]
              }
            ]
          },
          {
            title: "Accuracy, Validation & Performance",
            example: [
              "Optimize a slow query on a large transaction table.",
              "Debug a query that returns fewer rows than expected.",
              "Write a query to find duplicate records in a primary key column.",
              "How would you validate a revenue report against raw logs?",
              "Rewrite a query using 'NOT IN' to use 'NOT EXISTS'."
            ],
            questions: [
              { 
                id: "da_sql_q6", 
                text: "Did they validate output correctness?", 
                type: "rating",
                title: [ "Did they run a spot check?", "Did they check row counts?", "Did they verify unique keys?", "Did they check for impossible values?", "Did they sum to the total?"]
              },
              { 
                id: "da_sql_q7", 
                text: "Did they demonstrate correct understanding of WHERE vs HAVING?", 
                type: "rating",
                title: [ "Did they filter aggregated data correctly?", "Did they filter before grouping?", "Did they understand execution order?", "Did they mix up the clauses?", "Was the logic efficient?"]
              },
              { 
                id: "da_sql_q8", 
                text: "Did they mention performance levers (indexes/partitions)?", 
                type: "rating",
                title: [ "Did they mention partition pruning?", "Did they suggest an index?", "Did they avoid 'SELECT *'?", "Did they limit the scan?", "Did they avoid functions on indexed columns?"]
              },
              { 
                id: "da_sql_q9", 
                text: "Would you trust this query in production?", 
                type: "boolean",
                title: [ "Is it safe to run?", "Will it lock the table?", "Is it accurate?", "Is it scalable?", "Does it follow best practices?"]
              },
              { 
                id: "da_sql_rem", 
                text: "Overall SQL Feedback", 
                type: "text",
                title: [ "Proficiency level?", "Speed of coding?", "attention to detail?", "Debugging skills?", "Optimization knowledge?"]
              }
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
            example: [
              "Sales dropped in South India—investigate.",
              "Food delivery late orders increased by 15%. Why?",
              "Customer support tickets spiked after the last release.",
              "Website bounce rate increased on mobile devices.",
              "Ad click-through rate (CTR) dropped suddenly."
            ],
            questions: [
              { 
                id: "da_case_q1", 
                text: "Did the candidate clarify the metric definition and timeframe?", 
                type: "rating",
                title: [ "Is the data fresh?", "Is the metric calculated correctly?", "Is this a trend or a spike?", "What is the comparison period?", "Is the seasonality factor considered?"]
              },
              { 
                id: "da_case_q2", 
                text: "Did they segment properly?", 
                type: "rating",
                title: [ "Did they check by city/region?", "Did they check by platform (iOS/Android)?", "Did they check by user segment?", "Did they check by product category?", "Did they isolate the problem area?"]
              },
              { 
                id: "da_case_q3", 
                text: "Did they propose hypotheses across business + product + ops causes?", 
                type: "rating",
                title: [ "Operational failure (delivery boys)?", "Product bug (app crash)?", "Business decision (price hike)?", "External factor (rain/strike)?", "Marketing change?"]
              },
              { 
                id: "da_case_q4", 
                text: "Did they distinguish mix-shift vs within-segment decline?", 
                type: "rating",
                title: [ "Simpson's paradox?", "Did the user mix change?", "Is it a low-value user influx?", "Is the core segment declining?", "Is it a composition effect?"]
              },
              { 
                id: "da_case_q5", 
                text: "Did they avoid correlation traps and seek causal evidence?", 
                type: "rating",
                title: [ "Did they confuse correlation with causation?", "Did they look for a mechanism?", "Did they verify the timeline?", "Did they consider confounding variables?", "Was the logic sound?"]
              }
            ]
          },
          {
            title: "Insight Storytelling & Actionability",
            example: [
              "Present your recommendation to the CEO in 2 minutes.",
              "Summarize the findings of a churn analysis for the Product VP.",
              "Convince the Ops Head to change the delivery radius.",
              "Explain why a marketing campaign failed to the CMO.",
              "Propose a new pricing tier based on usage data."
            ],
            questions: [
              { 
                id: "da_case_q6", 
                text: "Did they quantify impact / prioritize the biggest driver?", 
                type: "rating",
                title: [ "How much money did we lose?", "What is the % impact?", "Is this the biggest fire?", "Did they focus on the 80/20?", "Was the sizing accurate?"]
              },
              { 
                id: "da_case_q7", 
                text: "Did they propose pragmatic next steps?", 
                type: "rating",
                title: [ "What do we do tomorrow?", "Is the fix feasible?", "Do we need more data?", "Who needs to act?", "Is it a quick win or long term?"]
              },
              { 
                id: "da_case_q8", 
                text: "Was the narrative clear (what happened → why → what to do)?", 
                type: "rating",
                title: [ "Was the story structured?", "Did they start with the answer?", "Was it easy to follow?", "Did they use visual language?", "Did they summarize well?"]
              },
              { 
                id: "da_case_q9", 
                text: "Would you trust them to lead the analysis end-to-end?", 
                type: "boolean",
                title: [ "Can they work independently?", "is the analysis rigorous?", "Are the insights valuable?", "Is the communication executive-ready?", "Do they own the outcome?"]
              },
              { 
                id: "da_case_rem", 
                text: "Overall Case Study Feedback", 
                type: "text",
                title: [ "Problem solving skills?", "Business intuition?", "Structured thinking?", "Communication clarity?", "Action orientation?"]
              }
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
            example: [
              "Design an A/B test for a new checkout button.",
              "Design an experiment to test a new subscription pricing.",
              "How would you test a new search ranking algorithm?",
              "Design a test for push notification timing.",
              "Validate a new 'Recommended for You' widget."
            ],
            questions: [
              { 
                id: "da_exp_q1", 
                text: "Did the candidate define a clear primary metric aligned to the goal?", 
                type: "rating",
                title: [ "Is the metric sensitive enough?", "Does it measure success directly?", "Is it the right OEC (Overall Evaluation Criterion)?", "Is it a conversion or retention metric?", "Does it align with the hypothesis?"]
              },
              { 
                id: "da_exp_q2", 
                text: "Did they define guardrails (refunds, latency)?", 
                type: "rating",
                title: [ "What shouldn't go down?", "Is latency protected?", "Are we monitoring support tickets?", "Is revenue protected?", "Are we checking for crashes?"]
              },
              { 
                id: "da_exp_q3", 
                text: "Did they state randomization unit (user/session) and why?", 
                type: "rating",
                title: [ "Why user level vs session level?", "How to handle cross-device users?", "Is the randomization stable?", "Does it prevent interference?", "Is it technically feasible?"]
              },
              { 
                id: "da_exp_q4", 
                text: "Did they discuss sample size / power / duration?", 
                type: "rating",
                title: [ "How long do we run it?", "Do we have enough traffic?", "What is the Minimum Detectable Effect (MDE)?", "Is the power analysis done?", "Is the duration covering weekly cycles?"]
              },
              { 
                id: "da_exp_q5", 
                text: "Did they anticipate biases (novelty, seasonality, SRM)?", 
                type: "rating",
                title: [ "Is there a Sample Ratio Mismatch?", "Is it a novelty effect?", "Is it a primacy effect?", "Is it a seasonal peak?", "Is there network interference?"]
              }
            ]
          },
          {
            title: "Result Interpretation & Decision",
            example: [
              "P-value is 0.04 but guardrail metric worsened. Launch?",
              "Conversion up 1%, but page load time up 200ms.",
              "Test significant for new users but flat for old users.",
              "Revenue is flat, but engagement is up significanty.",
              "SRM (Sample Ratio Mismatch) detected. What now?"
            ],
            questions: [
              { 
                id: "da_exp_q6", 
                text: "Did they interpret statistical significance correctly?", 
                type: "rating",
                title: [ "What does p-value < 0.05 mean?", "Is the confidence interval crossing zero?", "Is it a false positive?", "Did they understand the stats?", "Did they explain it simply?"]
              },
              { 
                id: "da_exp_q7", 
                text: "Did they look beyond p-value to practical significance?", 
                type: "rating",
                title: [ "Is the lift worth the cost?", "Is the absolute impact meaningful?", "Is it just noise?", "Is the effect size small?", "Does it matter to the business?"]
              },
              { 
                id: "da_exp_q8", 
                text: "Did they recommend a decision balancing business + risk?", 
                type: "rating",
                title: [ "Launch or Rollback?", "Is the trade-off acceptable?", "Can we optimize the bad metric?", "Should we iterate?", "Is the risk managed?"]
              },
              { 
                id: "da_exp_q9", 
                text: "Would you trust them to sign off an experiment readout?", 
                type: "boolean",
                title: [ "Are they rigorous?", "Do they understand the pitfalls?", "Are they objective?", "Do they communicate clearly?", "Is the decision sound?"]
              },
              { 
                id: "da_exp_rem", 
                text: "Overall Experimentation Feedback", 
                type: "text",
                title: [ "Stats knowledge?", "Experiment design skills?", "Interpretation skills?", "Business judgement?", "Technical understanding?"]
              }
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
            example: [
              "Build a dashboard to track weekly retention for 5 cohorts.",
              "Visualize the sales funnel performance by region.",
              "Create a chart to compare budget vs actual spend.",
              "Show the distribution of user ages on the platform.",
              "Visualize the correlation between time spent and money spent."
            ],
            questions: [
              { 
                id: "da_viz_q1", 
                text: "Did the candidate choose appropriate chart types?", 
                type: "rating",
                title: [ "Bar chart vs Pie chart?", "Line chart for trends?", "Scatter plot for correlation?", "Heatmap for cohorts?", "Is the choice intuitive?"]
              },
              { 
                id: "da_viz_q2", 
                text: "Did they avoid misleading visuals?", 
                type: "rating",
                title: [ "Did they truncate the Y-axis?", "Are the scales comparable?", "Is the 3D effect distracting?", "Are the colors accessible?", "Is the data misrepresented?"]
              },
              { 
                id: "da_viz_q3", 
                text: "Did they label clearly and provide context?", 
                type: "rating",
                title: [ "Are the axes labeled?", "Is the title descriptive?", "Is the legend clear?", "Are benchmarks provided?", "Is the timeframe clear?"]
              },
              { 
                id: "da_viz_q4", 
                text: "Did they surface the 'so what'?", 
                type: "rating",
                title: [ "Is the insight obvious?", "Do I have to hunt for the message?", "Is the key takeaway highlighted?", "Is it actionable?", "Does it answer the question?"]
              },
              { 
                id: "da_viz_q5", 
                text: "Did they consider audience/persona?", 
                type: "rating",
                title: [ "Is it too detailed for an Exec?", "Is it too high-level for an Ops Mgr?", "Is the tone appropriate?", "Is the format correct?", "Is it easy to consume?"]
              }
            ]
          },
          {
            title: "Dashboard Logic & Operational Use",
            example: [
              "Interpret this dashboard: traffic up, conversions down—what now?",
              "Redesign this cluttered executive summary dashboard.",
              "Define the alert thresholds for a server health dashboard.",
              "Create a wireframe for a real-time logistics dashboard.",
              "Audit this marketing dashboard for missing metrics."
            ],
            questions: [
              { 
                id: "da_viz_q6", 
                text: "Did they propose drill-downs and segmentation?", 
                type: "rating",
                title: [ "Can I click to see more?", "Is the hierarchy clear?", "Can I filter by region?", "Can I see the raw data?", "Is the navigation logical?"]
              },
              { 
                id: "da_viz_q7", 
                text: "Did they identify missing metrics?", 
                type: "rating",
                title: [ "What is missing to tell the story?", "Is context missing?", "Are there comparative metrics?", "Is the denominator missing?", "Is the data complete?"]
              },
              { 
                id: "da_viz_q8", 
                text: "Did they propose alerting thresholds?", 
                type: "rating",
                title: [ "When should I be worried?", "Is the threshold static or dynamic?", "How to avoid false alarms?", "Is the alert actionable?", "Who gets the alert?"]
              },
              { 
                id: "da_viz_q9", 
                text: "Would you trust them to build dashboards for leadership?", 
                type: "boolean",
                title: [ "Is the quality high?", "Is the design professional?", "Is the data accurate?", "Is the layout clean?", "Is it user-friendly?"]
              },
              { 
                id: "da_viz_rem", 
                text: "Overall Visualization/Dashboarding Feedback", 
                type: "text",
                title: [ "Design sense?", "Tool proficiency (Tableau/Looker)?", "Storytelling with data?", "Attention to detail?", "User empathy?"]
              }
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
            example: [
              "Present a complex finding to a non-technical audience.",
              "Explain 'Statistical Significance' to a Sales VP.",
              "Explain why the numbers in your report differ from the Finance report.",
              " convince a PM that their favorite feature is failing.",
              "Present a project update where the deadline will be missed."
            ],
            questions: [
              { 
                id: "da_beh_q1", 
                text: "Did the candidate lead with the conclusion?", 
                type: "rating",
                title: [ "Did they use BLUF (Bottom Line Up Front)?", "Did they answer the question directly?", "Did they save the details for later?", "Was the headline clear?", "Did they respect time?"]
              },
              { 
                id: "da_beh_q2", 
                text: "Did they avoid jargon?", 
                type: "rating",
                title: [ "Did they explain p-values simply?", "Did they avoid acronyms?", "Was the language accessible?", "Did they use analogies?", "Did they check for understanding?"]
              },
              { 
                id: "da_beh_q3", 
                text: "Was the narrative structured?", 
                type: "rating",
                title: [ "Was there a logical flow?", "Did they connect the dots?", "Was the argument coherent?", "Did they use signposting?", "Was it easy to follow?"]
              },
              { 
                id: "da_beh_q4", 
                text: "Did they handle questions calmly?", 
                type: "rating",
                title: [ "Did they listen to the question?", "Did they get defensive?", "Did they clarify before answering?", "Were they patient?", "Did they admit if they didn't know?"]
              },
              { 
                id: "da_beh_q5", 
                text: "Did they communicate uncertainty appropriately?", 
                type: "rating",
                title: [ "Did they state assumptions?", "Did they give confidence intervals?", "Did they mention caveats?", "Were they honest about data quality?", "Did they manage expectations?"]
              }
            ]
          },
          {
            title: "Collaboration & Practical Judgment",
            example: [
              "Stakeholder keeps changing requirements—what do you do?",
              "You found a data error in a report sent to the CEO. What now?",
              "Prioritize 5 urgent data requests from different teams.",
              "A stakeholder insists on a specific result. How do you handle it?",
              "Work with an engineer who is blocking your data pipeline."
            ],
            questions: [
              { 
                id: "da_beh_q6", 
                text: "Did the candidate propose a process to manage scope creep?", 
                type: "rating",
                title: [ "Do they ask for written specs?", "Do they freeze requirements?", "Do they communicate trade-offs?", "Do they involve the manager?", "Is the process realistic?"]
              },
              { 
                id: "da_beh_q7", 
                text: "Did they push back constructively?", 
                type: "rating",
                title: [ "Can they say no?", "Do they offer alternatives?", "Are they polite but firm?", "Do they protect their time?", "Do they focus on impact?"]
              },
              { 
                id: "da_beh_q8", 
                text: "Did they show ownership to drive decisions?", 
                type: "rating",
                title: [ "Do they unblock themselves?", "Do they follow up?", "Do they take responsibility?", "Do they drive to closure?", "Are they proactive?"]
              },
              { 
                id: "da_beh_q9", 
                text: "Would you put them in front of senior stakeholders?", 
                type: "boolean",
                title: [ "Are they professional?", "Can they handle pressure?", "Is their presence executive?", "Do they represent the team well?", "Are they trustworthy?"]
              },
              { 
                id: "da_beh_rem", 
                text: "Overall Behavioral/Communication Feedback", 
                type: "text",
                title: [ "Soft skills?", "Team player?", "Conflict resolution?", "Integrity?", "Adaptability?"]
              }
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
            example: [
              "Explain bias–variance tradeoff using a real-world example.",
              "Explain how Random Forest works to a non-technical person.",
              "Derive the loss function for Logistic Regression.",
              "Explain the difference between Bagging and Boosting.",
              "Explain the vanishing gradient problem in Neural Networks."
            ],
            questions: [
              { 
                id: "ds_th_q1", 
                text: "Did the candidate explain the concept correctly?", 
                type: "rating",
                title: [ "Is the math correct?", "Is the intuition sound?", "Did they avoid memorized definitions?", "Can they explain it simply?", "Did they use an example?"]
              },
              { 
                id: "ds_th_q2", 
                text: "Did they connect it to overfitting/underfitting?", 
                type: "rating",
                title: [ "Do they understand model complexity?", "Do they know how error behaves?", "Can they diagnose the issue?", "Do they know the remedies?", "Is the connection logical?"]
              },
              { 
                id: "ds_th_q3", 
                text: "Did they explain evaluation metrics appropriate to the task?", 
                type: "rating",
                title: [ "Why AUC over Accuracy?", "When to use F1 score?", "How to handle imbalanced classes?", "What is LogLoss?", "Does the metric match the business goal?"]
              },
              { 
                id: "ds_th_q4", 
                text: "Did they discuss assumptions/limitations of common models?", 
                type: "rating",
                title: [ "Does it assume linearity?", "Does it handle interactions?", "Does it need scaling?", "Is it robust to outliers?", "Is it interpretable?"]
              },
              { 
                id: "ds_th_q5", 
                text: "Did they show strong intuition for regularization?", 
                type: "rating",
                title: [ "L1 vs L2 regularization?", "How does dropout work?", "Why do we need it?", "How does it affect the weights?", "When to apply it?"]
              }
            ]
          },
          {
            title: "Algorithm Choice & Trade-offs",
            example: [
              "When would you use Logistic Regression vs XGBoost?",
              "When would you use a Neural Network vs a Decision Tree?",
              "Choose an algorithm for a real-time fraud detection system.",
              "Choose an algorithm for a small dataset with high dimensionality.",
              "Compare K-Means vs DBSCAN for clustering."
            ],
            questions: [
              { 
                id: "ds_th_q6", 
                text: "Did they choose models based on constraints?", 
                type: "rating",
                title: [ "Is latency a factor?", "Is data size a factor?", "Is interpretability needed?", "Is training time a constraint?", "Is the choice practical?"]
              },
              { 
                id: "ds_th_q7", 
                text: "Did they discuss feature interactions and missing data?", 
                type: "rating",
                title: [ "Does the model handle NaNs?", "Do we need to impute?", "Can it capture non-linearities?", "Do we need feature engineering?", "How to handle categorical vars?"]
              },
              { 
                id: "ds_th_q8", 
                text: "Did they mention calibration and thresholds?", 
                type: "rating",
                title: [ "Do we need probability calibration?", "How to pick the threshold?", "What is the cost of False Positives?", "Is the score distribution stable?", "How does it affect the business?"]
              },
              { 
                id: "ds_th_q9", 
                text: "Would you trust their model selection?", 
                type: "boolean",
                title: [ "Is it a safe bet?", "Is it overly complex?", "Is it defensible?", "Did they consider the baseline?", "Is it production-ready?"]
              },
              { 
                id: "ds_th_rem", 
                text: "Overall ML Theory Feedback", 
                type: "text",
                title: [ "Depth of knowledge?", "Breadth of knowledge?", "Mathematical rigour?", "Practical application?", "Conceptual clarity?"]
              }
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
            example: [
              "Model overfits and offline gains don’t replicate online.",
              "Training loss decreases but validation loss increases.",
              "The model performs poorly on a specific user segment.",
              "Accuracy is 99% but the model is useless (fraud case).",
              "The model predictions oscillate wildly."
            ],
            questions: [
              { 
                id: "ds_pra_q1", 
                text: "Did they check for data leakage and skew?", 
                type: "rating",
                title: [ "Is the target in the features?", "Is there time travel?", "Is train/serve distribution different?", "Is the validation set clean?", "Is there label leakage?"]
              },
              { 
                id: "ds_pra_q2", 
                text: "Did they propose correct validation strategy?", 
                type: "rating",
                title: [ "Time-based split?", "Stratified K-Fold?", "Group K-Fold (by user)?", "Is the holdout set representative?", "Is the evaluation metric correct?"]
              },
              { 
                id: "ds_pra_q3", 
                text: "Did they analyze error slices?", 
                type: "rating",
                title: [ "Where is the model failing?", "Is there a pattern in errors?", "Did they look at confusion matrix?", "Did they check worst predictions?", "Is it a specific sub-population?"]
              },
              { 
                id: "ds_pra_q4", 
                text: "Did they suggest regularization/feature selection?", 
                type: "rating",
                title: [ "Are there too many features?", "Is the model too complex?", "Should we drop noisy features?", "Should we increase L2?", "Should we get more data?"]
              },
              { 
                id: "ds_pra_q5", 
                text: "Did they consider class imbalance?", 
                type: "rating",
                title: [ "SMOTE/Oversampling?", "Undersampling?", "Class weights?", "Changing the metric?", "Threshold tuning?"]
              }
            ]
          },
          {
            title: "Production & Monitoring Mindset",
            example: [
              "Feature importance changed after deployment. Why?",
              "Design a monitoring plan for a credit scoring model.",
              "A model in production is degrading slowly. Diagnose.",
              "How do you handle 'Feedback Loops' in recommendation systems?",
              "Labeling data arrives 30 days late. How do you monitor?"
            ],
            questions: [
              { 
                id: "ds_pra_q6", 
                text: "Did they identify drift (data/concept)?", 
                type: "rating",
                title: [ "Is P(X) changing (Covariate Shift)?", "Is P(Y|X) changing (Concept Drift)?", "How to measure drift (PSI/KL)?", "Is the world changing?", "Is the data pipeline broken?"]
              },
              { 
                id: "ds_pra_q7", 
                text: "Did they propose retraining triggers?", 
                type: "rating",
                title: [ "Scheduled vs Triggered?", "How often to retrain?", "Automating the pipeline?", "Is there a fallback model?", "Is there a human in the loop?"]
              },
              { 
                id: "ds_pra_q8", 
                text: "Did they consider feedback loops?", 
                type: "rating",
                title: [ "Is the model biasing the data?", "Exploration vs Exploitation?", "Correcting for position bias?", "How to get unbiased labels?", "Long-term impact?"]
              },
              { 
                id: "ds_pra_q9", 
                text: "Would you trust them to own a model in production?", 
                type: "boolean",
                title: [ "Do they understand ops?", "Do they write safe code?", "Are they paranoid about failure?", "Do they monitor correctly?", "Can they debug live issues?"]
              },
              { 
                id: "ds_pra_rem", 
                text: "Overall Practical ML Feedback", 
                type: "text",
                title: [ "Debugging intuition?", "Operational maturity?", "Experience level?", "Systematic approach?", "Real-world scars?"]
              }
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
            example: [
              "Given events data, compute 7-day retention by cohort.",
              "Resample time-series data to 1-hour intervals and fill missing values.",
              "Normalize JSON data nested in a column into a flat table.",
              "Merge two datasets with fuzzy matching on names.",
              "Calculate the rolling average of a user's transaction value."
            ],
            questions: [
              { 
                id: "ds_code_q1", 
                text: "Did the candidate write correct logic?", 
                type: "rating",
                title: [ "Does the code run?", "Is the output correct?", "Did they solve the problem?", "Is the syntax valid?", "Did they understand the API?"]
              },
              { 
                id: "ds_code_q2", 
                text: "Was the code readable and idiomatic?", 
                type: "rating",
                title: [ "PEP8 standards?", "Meaningful variable names?", "List comprehensions?", "Clean structure?", "Comments where needed?"]
              },
              { 
                id: "ds_code_q3", 
                text: "Did they handle edge cases (NaNs, empty)?", 
                type: "rating",
                title: [ "Empty dataframe?", "Missing values?", "Duplicate indexes?", "Type mismatch?", "Zero division?"]
              },
              { 
                id: "ds_code_q4", 
                text: "Did they use vectorized operations?", 
                type: "rating",
                title: [ "Avoided for-loops?", "Used .apply() judiciously?", "Used numpy broadcasting?", "Is it efficient?", "Does it scale?"]
              },
              { 
                id: "ds_code_q5", 
                text: "Did they validate results?", 
                type: "rating",
                title: [ "Did they check the shape?", "Did they print head()?", "Did they verify the logic?", "Did they test on small data?", "Did they debug?"]
              }
            ]
          },
          {
            title: "Algorithmic Thinking",
            example: [
              "Find the K closest points to the origin.",
              "Detect a cycle in a linked list / graph.",
              "Merge K sorted arrays.",
              "Find the longest substring without repeating characters.",
              "Implement a moving average from a data stream."
            ],
            questions: [
              { 
                id: "ds_code_q6", 
                text: "Did they choose an efficient approach?", 
                type: "rating",
                title: [ "Big O complexity?", "Space complexity?", "Is Brute Force avoided?", "Did they optimize?", "Did they know the data structure?"]
              },
              { 
                id: "ds_code_q7", 
                text: "Did they explain their approach clearly?", 
                type: "rating",
                title: [ "Did they talk through the code?", "Did they plan before typing?", "Was the logic clear?", "Did they handle hints well?", "Did they communicate trade-offs?"]
              },
              { 
                id: "ds_code_q8", 
                text: "Did they test with custom cases?", 
                type: "rating",
                title: [ "Did they walkthrough a test case?", "Did they check boundaries?", "Did they catch their own bugs?", "Did they consider null inputs?", "Was the testing thorough?"]
              },
              { 
                id: "ds_code_q9", 
                text: "Would you trust them to ship code?", 
                type: "boolean",
                title: [ "Is the code production quality?", "Is it maintainable?", "Is it robust?", "Is it clean?", "Does it follow standards?"]
              },
              { 
                id: "ds_code_rem", 
                text: "Overall Coding Feedback", 
                type: "text",
                title: [ "Coding speed?", "Language proficiency?", "Problem solving?", "Code quality?", "Debugging skills?"]
              }
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
            example: [
              "Explain p-value vs confidence interval.",
              "Explain the Central Limit Theorem.",
              "Explain Type I vs Type II error.",
              "What is statistical power and how to calculate it?",
              "Explain Bayesian vs Frequentist approach."
            ],
            questions: [
              { 
                id: "ds_stat_q1", 
                text: "Did the candidate correctly define p-value?", 
                type: "rating",
                title: [ "Is it the probability of the null hypothesis?", "Is it the probability of the data given null?", "Did they avoid common misconceptions?", "Can they explain it simply?", "Is the definition precise?"]
              },
              { 
                id: "ds_stat_q2", 
                text: "Did they interpret confidence intervals correctly?", 
                type: "rating",
                title: [ "Is it a range of plausible values?", "Does it capture uncertainty?", "What does 95% mean?", "Is it about the parameter or the data?", "Can they explain the width?"]
              },
              { 
                id: "ds_stat_q3", 
                text: "Did they discuss Type I/II errors and power?", 
                type: "rating",
                title: [ "False Positive vs False Negative?", "Which is worse?", "How does sample size affect power?", "How does effect size affect power?", "How to balance the errors?"]
              },
              { 
                id: "ds_stat_q4", 
                text: "Did they choose the right test?", 
                type: "rating",
                title: [ "T-test vs Z-test?", "Chi-square for categorical?", "Mann-Whitney for non-normal?", "Paired vs Unpaired?", "Are assumptions met (normality)?"]
              },
              { 
                id: "ds_stat_q5", 
                text: "Did they show awareness of multiple comparisons?", 
                type: "rating",
                title: [ "Bonferroni correction?", "False Discovery Rate?", "P-hacking risk?", "Peeking problem?", "How to control family-wise error?"]
              }
            ]
          },
          {
            title: "Applied Experimentation Judgment",
            example: [
              "A/B test shows small lift but increased latency.",
              "Experiment results contradict offline model results.",
              "Designing a test for a network effect product (social).",
              "Testing a long-term metric (e.g., retention) quickly.",
              "Interpreting results with heavy outliers."
            ],
            questions: [
              { 
                id: "ds_stat_q6", 
                text: "Did they separate statistical vs practical significance?", 
                type: "rating",
                title: [ "Is the effect size large enough?", "Is the ROI positive?", "Is the cost justified?", "Is it just noise?", "Does it move the needle?"]
              },
              { 
                id: "ds_stat_q7", 
                text: "Did they discuss randomization and independence?", 
                type: "rating",
                title: [ "SUTVA violation?", "Interference between groups?", "User vs Session level?", "Cluster randomization?", "Is the split valid?"]
              },
              { 
                id: "ds_stat_q8", 
                text: "Did they consider SRM and novelty effects?", 
                type: "rating",
                title: [ "Is the sample ratio correct?", "Is it just curiosity clicks?", "Is it seasonality?", "Is there instrumentation error?", "Is the effect sustainable?"]
              },
              { 
                id: "ds_stat_q9", 
                text: "Would you trust them to sign off readouts?", 
                type: "boolean",
                title: [ "Are they careful?", "Do they verify assumptions?", "Are they objective?", "Do they communicate risks?", "Is the conclusion sound?"]
              },
              { 
                id: "ds_stat_rem", 
                text: "Overall Statistics Feedback", 
                type: "text",
                title: [ "Theoretical depth?", "Applied intuition?", "Common sense?", "Rigour?", "Communication?"]
              }
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
            example: [
              "Design a real-time recommendations engine.",
              "Design a fraud detection system for payments.",
              "Design a search ranking system for e-commerce.",
              "Design a feed ranking system for social media.",
              "Design a pricing engine for ride-sharing."
            ],
            questions: [
              { 
                id: "ds_sys_q1", 
                text: "Did they clarify functional + non-functional requirements?", 
                type: "rating",
                title: [ "Latency constraint (ms)?", "Throughput (QPS)?", "Freshness of data?", "Accuracy goal?", "Budget/Cost?"]
              },
              { 
                id: "ds_sys_q2", 
                text: "Did they define a clear data flow?", 
                type: "rating",
                title: [ "Collection -> Processing -> Training -> Serving?", "Batch vs Real-time?", "Where is the state stored?", "How does the model get data?", "Is the loop closed?"]
              },
              { 
                id: "ds_sys_q3", 
                text: "Did they discuss feature store and skew risks?", 
                type: "rating",
                title: [ "Training-Serving skew?", "Online feature store (Redis)?", "Feature consistency?", "Time travel in training?", "Point-in-time correctness?"]
              },
              { 
                id: "ds_sys_q4", 
                text: "Did they address retrieval vs ranking?", 
                type: "rating",
                title: [ "Candidate generation step?", "Heavy ranking step?", "Funnel architecture?", "Annoy/Faiss usage?", "Complexity reduction?"]
              },
              { 
                id: "ds_sys_q5", 
                text: "Did they handle reliability concerns?", 
                type: "rating",
                title: [ "Fallback heuristic?", "Circuit breakers?", "Retries/Timeouts?", "Degradation strategy?", "Monitoring?"]
              }
            ]
          },
          {
            title: "Deployment, Monitoring & Iteration",
            example: [
              "How to deploy a new model with zero downtime?",
              "Design a retraining pipeline for a daily model.",
              "How to handle model versioning and rollback?",
              "Design the logging system for model debugging.",
              "How to scale the inference service to 10x traffic?"
            ],
            questions: [
              { 
                id: "ds_sys_q6", 
                text: "Did they propose safe rollout strategies?", 
                type: "rating",
                title: [ "Canary deployment?", "Shadow mode?", "Blue/Green deployment?", "A/B test ramp up?", "Rollback plan?"]
              },
              { 
                id: "ds_sys_q7", 
                text: "Did they propose drift/quality monitoring?", 
                type: "rating",
                title: [ "Data drift alerts?", "Prediction distribution check?", "Latency monitoring?", "Error rate tracking?", "Ground truth lag?"]
              },
              { 
                id: "ds_sys_q8", 
                text: "Did they plan retraining triggers/cadence?", 
                type: "rating",
                title: [ "Daily/Weekly?", "Performance trigger?", "Freshness requirement?", "Incremental learning?", "Model registry?"]
              },
              { 
                id: "ds_sys_q9", 
                text: "Would you trust them to own system design?", 
                type: "boolean",
                title: [ "Is it scalable?", "Is it maintainable?", "Is it robust?", "Is it cost-effective?", "Is it simple?"]
              },
              { 
                id: "ds_sys_rem", 
                text: "Overall ML System Design Feedback", 
                type: "text",
                title: [ "Architecture skills?", "Breadth of tools?", "Practicality?", "Scalability thinking?", "Clarity?"]
              }
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
            example: [
              "Hire 20 engineers in 60 days for a new startup.",
              "Hire a VP of Sales for a new territory.",
              "Improve the diversity of the engineering pipeline.",
              "Set up a campus hiring program from scratch.",
              "Hire niche AI researchers in a competitive market."
            ],
            questions: [
              { 
                id: "hr_ta_q1", 
                text: "Did the candidate clarify role requirements?", 
                type: "rating",
                title: [ "Must-have vs Nice-to-have?", "Culture fit definition?", "Selling points of the role?", "Compensation band?", "Ideal candidate profile?"]
              },
              { 
                id: "hr_ta_q2", 
                text: "Did they design a realistic funnel?", 
                type: "rating",
                title: [ "Conversion rates?", "Throughput calculation?", "Sourcing channels?", "Interview stages?", "Timeline estimation?"]
              },
              { 
                id: "hr_ta_q3", 
                text: "Did they consider interviewer capacity?", 
                type: "rating",
                title: [ "Do we have enough interviewers?", "Training for interviewers?", "Scheduling bottlenecks?", "Load balancing?", "Shadowing plan?"]
              },
              { 
                id: "hr_ta_q4", 
                text: "Did they define TA metrics?", 
                type: "rating",
                title: [ "Time to hire?", "Cost per hire?", "Offer acceptance rate?", "Quality of hire?", "Pipeline diversity?"]
              },
              { 
                id: "hr_ta_q5", 
                text: "Did they identify bottlenecks?", 
                type: "rating",
                title: [ "Where do people drop off?", "Is the JD the problem?", "Is the bar too high/low?", "Is speed the issue?", "How to unblock?"]
              }
            ]
          },
          {
            title: "Candidate Experience, Closing & Integrity",
            example: [
              "A top candidate declines at offer stage. Diagnose.",
              "Candidates complain about 'ghosting'. Fix the process.",
              "A hiring manager is rejecting everyone. What do you do?",
              "You suspect a candidate is lying about their current salary.",
              "Close a candidate who has a higher counter-offer."
            ],
            questions: [
              { 
                id: "hr_ta_q6", 
                text: "Did they diagnose likely causes for decline?", 
                type: "rating",
                title: [ "Comp issue?", "Role clarity?", "Speed of process?", "Interviewer behavior?", "Brand reputation?"]
              },
              { 
                id: "hr_ta_q7", 
                text: "Did they propose experience improvements?", 
                type: "rating",
                title: [ "Better communication?", "Feedback loop?", "Transparency?", "Scheduling ease?", "Pre-boarding engagement?"]
              },
              { 
                id: "hr_ta_q8", 
                text: "Did they show fairness/compliance awareness?", 
                type: "rating",
                title: [ "Bias reduction?", "Structured interviews?", "Legal compliance?", "Salary history bans?", "Diversity goals?"]
              },
              { 
                id: "hr_ta_q9", 
                text: "Would you trust this person to run hiring?", 
                type: "boolean",
                title: [ "Are they ethical?", "Are they organized?", "Do they represent the brand?", "Can they close?", "Do they care about candidates?"]
              },
              { 
                id: "hr_ta_rem", 
                text: "Overall Talent Acquisition Feedback", 
                type: "text",
                title: [ "Sourcing strategy?", "Process design?", "Closing skills?", "Stakeholder management?", "Metrics focus?"]
              }
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
            example: [
              "An employee’s performance drops sharply. Diagnose.",
              "Manage a PIP (Performance Improvement Plan) process.",
              "Onboard a new remote employee successfully.",
              "Handle an exit interview for a regrettable attrition.",
              "Design a probation confirmation process."
            ],
            questions: [
              { 
                id: "hr_gen_q1", 
                text: "Did the candidate diagnose root causes?", 
                type: "rating",
                title: [ "Is it skill vs will?", "Personal issues?", "Manager conflict?", "Role clarity?", "Burnout?"]
              },
              { 
                id: "hr_gen_q2", 
                text: "Did they propose a structured process?", 
                type: "rating",
                title: [ "Clear expectations?", "Regular check-ins?", "Documentation?", "Defined timeline?", "Objective criteria?"]
              },
              { 
                id: "hr_gen_q3", 
                text: "Did they balance empathy with accountability?", 
                type: "rating",
                title: [ "Are they supportive?", "Are they firm?", "Is it fair?", "Do they listen?", "Is the business protected?"]
              },
              { 
                id: "hr_gen_q4", 
                text: "Did they emphasize documentation?", 
                type: "rating",
                title: [ "Paper trail?", "Legal protection?", "Clarity of feedback?", "Acknowledgement?", "Policy adherence?"]
              },
              { 
                id: "hr_gen_q5", 
                text: "Did they consider broader team impact?", 
                type: "rating",
                title: [ "Morale of the team?", "Workload distribution?", "Perception of fairness?", "Precedent setting?", "Culture impact?"]
              }
            ]
          },
          {
            title: "Grievances, Conflict & Sensitive Handling",
            example: [
              "Two employees report ongoing conflict.",
              "Harassment allegation reported anonymously.",
              "Employee complains about manager's favoritism.",
              "Layoff conversation with a long-tenured employee.",
              "Hygiene/Behavioral issue with an employee."
            ],
            questions: [
              { 
                id: "hr_gen_q6", 
                text: "Did they listen to both sides and avoid bias?", 
                type: "rating",
                title: [ "Objectivity?", "Fact-finding?", "Suspending judgment?", "Active listening?", "Avoiding assumptions?"]
              },
              { 
                id: "hr_gen_q7", 
                text: "Did they propose mediation steps?", 
                type: "rating",
                title: [ "Facilitated dialogue?", "Behavioral agreements?", "Coaching?", "Separation if needed?", "Monitoring?"]
              },
              { 
                id: "hr_gen_q8", 
                text: "Did they manage confidentiality?", 
                type: "rating",
                title: [ "Need to know basis?", "Protecting privacy?", "Handling rumors?", "Secure records?", "Discretion?"]
              },
              { 
                id: "hr_gen_q9", 
                text: "Would you trust them with sensitive issues?", 
                type: "boolean",
                title: [ "Maturity?", "Discretion?", "Empathy?", "Legal awareness?", "Judgment?"]
              },
              { 
                id: "hr_gen_rem", 
                text: "Overall HR Generalist Feedback", 
                type: "text",
                title: [ "Employee relations?", "Process adherence?", "Empathy?", "Fairness?", "Conflict resolution?"]
              }
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
            example: [
              "Payroll errors reported across teams. Fix it.",
              "Audit HR compliance for a new branch office.",
              "Streamline the background verification process.",
              "Handle a data breach in employee records.",
              "Ensure statutory compliance (PF/ESI/Tax)."
            ],
            questions: [
              { 
                id: "hr_ops_q1", 
                text: "Did the candidate triage with urgency?", 
                type: "rating",
                title: [ "Immediate containment?", "Communication plan?", "Assessing impact?", "Prioritization?", "calm under pressure?"]
              },
              { 
                id: "hr_ops_q2", 
                text: "Did they identify failure points?", 
                type: "rating",
                title: [ "Manual entry?", "System bug?", "Vendor failure?", "Approval gap?", "Process flaw?"]
              },
              { 
                id: "hr_ops_q3", 
                text: "Did they prioritize compliance?", 
                type: "rating",
                title: [ "Legal risk?", "Financial penalty?", "Reputation risk?", "Audit trail?", "Regulatory adherence?"]
              },
              { 
                id: "hr_ops_q4", 
                text: "Did they propose root-cause fixes?", 
                type: "rating",
                title: [ "Automation?", "Validation checks?", "Vendor change?", "New SOP?", "Training?"]
              },
              { 
                id: "hr_ops_q5", 
                text: "Did they propose measurable KPIs?", 
                type: "rating",
                title: [ "Accuracy rate?", "Turn Around Time (TAT)?", "SLA adherence?", "Ticket volume?", "Employee satisfaction?"]
              }
            ]
          },
          {
            title: "Scale Readiness & HRIS Thinking",
            example: [
              "Scale HR ops for 3x headcount growth.",
              "Select and implement a new HRIS.",
              "Design a self-serve portal for employees.",
              "Automate the onboarding documentation.",
              "Centralize HR ops for multiple geographies."
            ],
            questions: [
              { 
                id: "hr_ops_q6", 
                text: "Did they propose standardization?", 
                type: "rating",
                title: [ "Templates?", "SOPs?", "Checklists?", "FAQ?", "Knowledge base?"]
              },
              { 
                id: "hr_ops_q7", 
                text: "Did they show HRIS literacy?", 
                type: "rating",
                title: [ "Workflow design?", "Access control?", "Integration?", "User experience?", "Data migration?"]
              },
              { 
                id: "hr_ops_q8", 
                text: "Did they anticipate risks?", 
                type: "rating",
                title: [ "Data privacy?", "System downtime?", "Adoption curve?", "Training needs?", "Budget overrun?"]
              },
              { 
                id: "hr_ops_q9", 
                text: "Would you trust them to run HR ops?", 
                type: "boolean",
                title: [ "Attention to detail?", "Process orientation?", "Tech savvy?", "Reliability?", "Service mindset?"]
              },
              { 
                id: "hr_ops_rem", 
                text: "Overall HR Operations Feedback", 
                type: "text",
                title: [ "Efficiency focus?", "Compliance knowledge?", "Systems thinking?", "Problem solving?", "Scalability?"]
              }
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
            example: [
              "Restructure a sales team for new market strategy.",
              "Integrate a newly acquired startup team.",
              "Manage a reduction in force (layoff).",
              "Design a matrix reporting structure.",
              "Transition a team from onsite to remote."
            ],
            questions: [
              { 
                id: "hr_bp_q1", 
                text: "Did the candidate clarify business goals?", 
                type: "rating",
                title: [ "Why are we doing this?", "What is the success metric?", "What is the timeline?", "What is the budget?", "What is the strategic intent?"]
              },
              { 
                id: "hr_bp_q2", 
                text: "Did they diagnose org design issues?", 
                type: "rating",
                title: [ "Spans and layers?", "Decision rights?", "Role overlap?", "Skill gaps?", "Workflow blocks?"]
              },
              { 
                id: "hr_bp_q3", 
                text: "Did they consider people impact?", 
                type: "rating",
                title: [ "Retention risk?", "Motivation?", "Communication needs?", "Culture shock?", "Key talent protection?"]
              },
              { 
                id: "hr_bp_q4", 
                text: "Did they propose a change plan?", 
                type: "rating",
                title: [ "Communication cascade?", "Training/Enablement?", "Feedback channels?", "Transition period?", "Leadership alignment?"]
              },
              { 
                id: "hr_bp_q5", 
                text: "Did they balance business with fairness?", 
                type: "rating",
                title: [ "Ethical treatment?", "Legal compliance?", "Consistent application?", "Empathy in execution?", "Long-term trust?"]
              }
            ]
          },
          {
            title: "Influence, Performance & Conflict Mediation",
            example: [
              "A manager is toxic but delivers results.",
              "A leader refuses to follow HR policy.",
              "Mediating a conflict between two VP-level leaders.",
              "Coaching a first-time manager on delegation.",
              "Convincing leadership to invest in L&D."
            ],
            questions: [
              { 
                id: "hr_bp_q6", 
                text: "Did they handle with ethics and policy grounding?", 
                type: "rating",
                title: [ "Zero tolerance on harassment?", "Consistent standards?", "Courage to speak up?", "Integrity?", "Protecting the company?"]
              },
              { 
                id: "hr_bp_q7", 
                text: "Did they propose evidence gathering?", 
                type: "rating",
                title: [ "360 feedback?", "Exit data?", "Engagement scores?", "Specific incidents?", "Avoiding hearsay?"]
              },
              { 
                id: "hr_bp_q8", 
                text: "Did they show ability to influence?", 
                type: "rating",
                title: [ "Data-driven argument?", "Business case?", "Relationship capital?", "Persuasion skills?", "Managing up?"]
              },
              { 
                id: "hr_bp_q9", 
                text: "Would leadership trust this HRBP?", 
                type: "boolean",
                title: [ "Credibility?", "Business acumen?", "Confidentiality?", "Strategic thinking?", "Reliability?"]
              },
              { 
                id: "hr_bp_rem", 
                text: "Overall HRBP Feedback", 
                type: "text",
                title: [ "Strategic partner?", "Coach?", "Change agent?", "Employee champion?", "Business savvy?"]
              }
            ]
          }
        ]
      },

      // COE – HR Functions
      "f42714f9-1ecb-4943-a62f-0ce1b58052f7": {
        skill_name: "COE – HR Functions",
        templates: [
          {
            title: "Specialist Depth (C&B / L&D / TM / DEI)",
            example: [
              "Design a performance management framework.",
              "Create a compensation band structure.",
              "Design a leadership development program.",
              "Launch a DEI (Diversity Equity Inclusion) strategy.",
              "Revamp the employee benefits package."
            ],
            questions: [
              { 
                id: "hr_coe_q1", 
                text: "Did the candidate demonstrate deep expertise?", 
                type: "rating",
                title: [ "Market benchmarks?", "Best practices?", "Theoretical foundation?", "Nuance in design?", "Not generic?"]
              },
              { 
                id: "hr_coe_q2", 
                text: "Did they use principles/benchmarks?", 
                type: "rating",
                title: [ "P50/P75/P90 pay?", "70-20-10 learning model?", "Industry standards?", "Internal equity?", "Competency frameworks?"]
              },
              { 
                id: "hr_coe_q3", 
                text: "Did they anticipate failure modes?", 
                type: "rating",
                title: [ "Gaming the system?", "Bias in ratings?", "Low adoption?", "Budget constraints?", "Manager capability?"]
              },
              { 
                id: "hr_coe_q4", 
                text: "Did they propose measurement?", 
                type: "rating",
                title: [ "Usage stats?", "Outcome metrics?", "Satisfaction score?", "Retention impact?", "ROI?"]
              },
              { 
                id: "hr_coe_q5", 
                text: "Did they balance employee experience w/ business?", 
                type: "rating",
                title: [ "Is it user friendly?", "Is it affordable?", "Is it sustainable?", "Is it fair?", "Does it drive performance?"]
              }
            ]
          },
          {
            title: "Rollout, Governance & Change Management",
            example: [
              "Roll out a new rewards program globally.",
              "Implement a new LMS (Learning Management System).",
              "Standardize job titles across the org.",
              "Roll out a new remote work policy.",
              "Conduct an org-wide engagement survey."
            ],
            questions: [
              { 
                id: "hr_coe_q6", 
                text: "Did they propose a rollout plan?", 
                type: "rating",
                title: [ "Pilot phase?", "Communication plan?", "Training stakeholders?", "Phased approach?", "Go-live support?"]
              },
              { 
                id: "hr_coe_q7", 
                text: "Did they define governance?", 
                type: "rating",
                title: [ "Who decides exceptions?", "Who owns the policy?", "How to update it?", "Audit mechanism?", "Compliance check?"]
              },
              { 
                id: "hr_coe_q8", 
                text: "Did they include feedback loops?", 
                type: "rating",
                title: [ "Pulse check?", "Focus groups?", "Iteration plan?", "Continuous improvement?", "Listening posts?"]
              },
              { 
                id: "hr_coe_q9", 
                text: "Would you trust them to own a COE program?", 
                type: "boolean",
                title: [ "Program management?", "Stakeholder alignment?", "Domain authority?", "Execution capability?", "Vision?"]
              },
              { 
                id: "hr_coe_rem", 
                text: "Overall COE Feedback", 
                type: "text",
                title: [ "Specialist knowledge?", "Implementation skills?", "Strategic alignment?", "Innovation?", "Impact?"]
              }
            ]
          }
        ]
      }
    }
  }
};