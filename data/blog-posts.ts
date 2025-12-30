// data/blog-posts.ts
// =============================================
// BLOG POST DATA
// =============================================
// Edit this file to add/edit blog posts
// No database needed - just edit and deploy!

export type BlogPost = {
  slug: string;              // URL slug (e.g., "how-to-ace-interviews")
  title: string;             // Post title
  excerpt: string;           // Short description for listing
  content: string;           // Full HTML content
  author: string;            // Author name
  publishedAt: string;       // Date string (e.g., "2024-12-02")
  thumbnailUrl?: string;     // Optional image URL
  tags?: string[];           // Optional tags
};

// =============================================
// ADD YOUR BLOG POSTS HERE
// =============================================

export const blogPosts: BlogPost[] = [
  {
  slug: "sql-interview-mistakes-data-analysts",
  title: "7 SQL Interview Mistakes That Cost Data Analysts the Job (And How to Fix Them)",
  excerpt:
    "Most data analysts don’t fail interviews because they don’t know SQL—they fail because of how they think, explain, and apply it. These 7 real SQL interview mistakes explain why.",
  thumbnailUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
  content: `
<h1>7 SQL Interview Mistakes That Cost Data Analysts the Job (And How to Fix Them)</h1>

<h2>Who this article is for</h2>
<p>
This article is for data analysts and business analysts who:
</p>
<ul>
  <li>Clear SQL screenings but fail final rounds</li>
  <li>Know joins, aggregations, and window functions—but still get rejected</li>
  <li>Hear feedback like “good SQL, but lacked depth”</li>
  <li>Feel confident practicing alone, but freeze in live interviews</li>
</ul>

<p>
If you’ve ever thought, <em>“I solved the query… why didn’t it land?”</em> — this article is for you.
</p>

<h2>What SQL interviews are actually testing (context most candidates miss)</h2>
<p>
SQL interviews are not about writing syntactically correct queries.
</p>

<p>
They are about whether interviewers can trust you to:
</p>
<ul>
  <li>Reason through messy, ambiguous data</li>
  <li>Choose the simplest correct solution</li>
  <li>Explain your thinking clearly</li>
  <li>Anticipate edge cases and scale</li>
</ul>

<p>
Most rejections happen not because the final query was wrong—but because the <strong>thinking process was invisible, brittle, or shallow</strong>.
</p>

<p>
That’s why many candidates fail real <a href="/interviews/data-analytics">data analytics interviews</a> despite knowing SQL well.
</p>

<hr />

<h2>Mistake #1: Overcomplicating SQL When a Simple Join Works</h2>

<h3>Why candidates do this</h3>
<ul>
  <li>They want to “impress” the interviewer</li>
  <li>They’ve learned advanced SQL and want to show it</li>
  <li>They confuse complexity with competence</li>
</ul>

<h3>What the interviewer sees</h3>
<p>
Unnecessary complexity signals poor judgement.
</p>

<p>
Interviewers ask themselves:
</p>
<ul>
  <li>Can this person maintain production queries?</li>
  <li>Do they know when <em>not</em> to be fancy?</li>
</ul>

<h3>Example</h3>
<p><strong>Question:</strong> Find total orders per customer.</p>

<p><strong>Overcomplicated answer:</strong></p>
<pre>
SELECT customer_id, COUNT(*)
FROM (
  SELECT DISTINCT o.id, o.customer_id
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
) t
GROUP BY customer_id;
</pre>

<p><strong>Better answer:</strong></p>
<pre>
SELECT customer_id, COUNT(*)
FROM orders
GROUP BY customer_id;
</pre>

<h3>Strong interview signal</h3>
<p>
“I’m keeping this simple for readability. If we later need deduplication, we can add it deliberately.”
</p>

<h3>Seniority expectations</h3>
<ul>
  <li><strong>Junior:</strong> Correct logic</li>
  <li><strong>Mid-level:</strong> Clear, minimal queries</li>
  <li><strong>Senior:</strong> Actively removes unnecessary complexity</li>
</ul>

<hr />

<h2>Mistake #2: Staying Silent While Writing SQL</h2>

<h3>Why candidates do this</h3>
<ul>
  <li>They’re concentrating</li>
  <li>They fear saying something wrong</li>
  <li>They assume the code speaks for itself</li>
</ul>

<h3>Why this fails</h3>
<p>
Interviewers cannot evaluate invisible thinking.
</p>

<p>
Silence is often interpreted as:
</p>
<ul>
  <li>Uncertainty</li>
  <li>Trial-and-error coding</li>
  <li>Lack of structure</li>
</ul>

<h3>Weak behavior</h3>
<p>
Typing quietly for 5 minutes, then saying “done”.
</p>

<h3>Strong behavior</h3>
<p>
“I’ll first confirm the grain of the table. Since this is one row per order, I can safely aggregate by customer_id.”
</p>

<p>
This habit alone dramatically improves outcomes in live <a href="/interviews/data-analytics">analytics interviews</a>.
</p>

<hr />

<h2>Mistake #3: Ignoring Edge Cases (NULLs, Duplicates, Empty Tables)</h2>

<h3>Why this matters</h3>
<p>
Real data is messy. Interviewers expect you to assume that by default.
</p>

<p>
Ignoring edge cases signals:
</p>
<ul>
  <li>No production exposure</li>
  <li>Over-reliance on toy datasets</li>
</ul>

<h3>Example</h3>
<p><strong>Question:</strong> Average order value per customer.</p>

<p><strong>Naive answer:</strong></p>
<pre>
SELECT customer_id, AVG(order_value)
FROM orders
GROUP BY customer_id;
</pre>

<p><strong>Stronger answer:</strong></p>
<pre>
SELECT customer_id, AVG(order_value)
FROM orders
WHERE order_value IS NOT NULL
GROUP BY customer_id;
</pre>

<p><strong>Even stronger (spoken):</strong></p>
<p>
“I’m excluding NULLs. If zero-value orders exist, I’d confirm whether they represent refunds or free orders.”
</p>

<hr />

<h2>Mistake #4: Memorizing Syntax Instead of Understanding Logic</h2>

<h3>The common failure</h3>
<p>
Candidates freeze trying to recall exact syntax for:
</p>
<ul>
  <li>Window functions</li>
  <li>HAVING vs WHERE</li>
  <li>RANK vs DENSE_RANK</li>
</ul>

<h3>What interviewers actually care about</h3>
<p>
Logical intent.
</p>

<p>
Strong candidates say:
</p>
<p>
“Conceptually, I want to rank users by revenue within each month. The exact syntax may vary slightly.”
</p>

<p>
This mindset also overlaps with how reasoning is evaluated in <a href="/interviews/product-management">product management interviews</a>.
</p>

<hr />

<h2>Mistake #5: Not Discussing Query Performance</h2>

<h3>Why this separates candidates</h3>
<p>
Anyone can write SQL that works on small data.
</p>

<p>
Fewer candidates consider:
</p>
<ul>
  <li>Indexes</li>
  <li>Joins on large tables</li>
  <li>GROUP BY cost</li>
</ul>

<h3>Strong signal</h3>
<p>
“If this table is large, I’d ensure indexes on customer_id. Otherwise, this aggregation could be expensive.”
</p>

<p>
This single sentence often separates strong mid-level analysts from juniors.
</p>

<hr />

<h2>Mistake #6: Poor Communication of Results</h2>

<h3>The hidden problem</h3>
<p>
Not every interviewer is technical.
</p>

<p>
Explaining SQL output using raw jargon loses:
</p>
<ul>
  <li>Product managers</li>
  <li>Business stakeholders</li>
</ul>

<h3>Weak explanation</h3>
<p>
“This query aggregates revenue grouped by cohort.”
</p>

<h3>Strong explanation</h3>
<p>
“This shows which customer groups generate the most revenue over time, helping us prioritise retention.”
</p>

<hr />

<h2>Mistake #7: Not Practicing Real Business Scenarios</h2>

<h3>Why practice often fails</h3>
<p>
Most candidates practice:
</p>
<ul>
  <li>Isolated SQL problems</li>
  <li>LeetCode-style prompts</li>
</ul>

<p>
Real interviews ask:
</p>
<ul>
  <li>Why did revenue drop?</li>
  <li>Which users should we target?</li>
  <li>How would you validate this metric?</li>
</ul>

<p>
SQL is the tool. Business reasoning is the test.
</p>

<p>
This is exactly what differentiates strong candidates in real <a href="/interviews/data-analytics">data analytics interviews</a>.
</p>

<hr />

<h2>Final thoughts: SQL isn’t failing you—execution is</h2>

<p>
Most SQL interview failures are execution failures:
</p>
<ul>
  <li>Thinking isn’t visible</li>
  <li>Edge cases aren’t considered</li>
  <li>Business context is missing</li>
</ul>

<p>
These issues are hard to catch practicing alone.
</p>

<p>
That’s why structured mock interviews help—not to teach SQL, but to expose blind spots before real interviews do.
</p>
`,
  author: "CrackJobs Team",
  publishedAt: "2025-01-10",
  tags: ["SQL", "Data Analytics", "Interviews", "Careers"],
},

  {
  slug: "machine-learning-interview-mistakes-data-scientists",
  title: "8 Machine Learning Interview Mistakes That Make Data Scientists Fail (Even With Strong Models)",
  excerpt:
    "Many data scientists fail interviews not because their models are weak, but because their judgement, framing, and communication fall short. These 8 machine learning interview mistakes explain why.",
  thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  content: `
<h1>8 Machine Learning Interview Mistakes That Make Data Scientists Fail (Even With Strong Models)</h1>

<h2>Who this article is for</h2>
<p>
This article is for data scientists and ML engineers who:
</p>
<ul>
  <li>Know the algorithms but struggle in live interviews</li>
  <li>Perform well on Kaggle or projects but fail onsite rounds</li>
  <li>Receive feedback like “strong technically, but lacked depth or ownership”</li>
  <li>Feel interviews test something <em>different</em> from what they prepared for</li>
</ul>

<p>
If you’ve ever thought, <em>“My model was correct… why wasn’t that enough?”</em> — this article is your answer.
</p>

<h2>What machine learning interviews are actually testing</h2>
<p>
Machine learning interviews are not exams on algorithms.
</p>

<p>
They are simulations of how you would operate as a data scientist inside a real company.
</p>

<p>
Interviewers are evaluating whether they can trust you to:
</p>
<ul>
  <li>Frame ambiguous business problems</li>
  <li>Make principled trade-offs</li>
  <li>Work with imperfect data</li>
  <li>Explain decisions to non-ML stakeholders</li>
  <li>Own a model beyond training accuracy</li>
</ul>

<p>
Most candidates optimise for correctness. Strong candidates demonstrate judgement.
</p>

<p>
This distinction is central to real <a href="/interviews/data-science">data science interviews</a>.
</p>

<hr />

<h2>Mistake #1: Jumping to Models Without Defining the Problem</h2>

<h3>Why candidates fall into this trap</h3>
<ul>
  <li>They associate ML skill with algorithm choice</li>
  <li>They fear silence in interviews</li>
  <li>They want to demonstrate competence early</li>
</ul>

<h3>What interviewers see</h3>
<p>
Solution-first thinking without understanding the problem.
</p>

<h3>Example</h3>
<p><strong>Question:</strong> “We want to predict customer churn.”</p>

<p><strong>Weak response:</strong></p>
<p>
“I’d train a logistic regression or XGBoost model.”
</p>

<p><strong>Strong response:</strong></p>
<p>
“First, I’d clarify how churn is defined—cancellation, inactivity, or non-renewal—and what action the business will take based on the prediction.”
</p>

<p>
This framing signals ownership and maturity.
</p>

<h3>Seniority expectations</h3>
<ul>
  <li><strong>Junior:</strong> Ask clarifying questions</li>
  <li><strong>Mid-level:</strong> Tie framing to downstream decisions</li>
  <li><strong>Senior:</strong> Question whether ML is even needed</li>
</ul>

<hr />

<h2>Mistake #2: Optimising for Accuracy Instead of Business Metrics</h2>

<h3>The common misconception</h3>
<p>
Accuracy feels objective and safe.
</p>

<p>
In real problems, it’s often meaningless.
</p>

<h3>Example</h3>
<p>
In fraud detection or medical diagnosis, false negatives are far more costly than false positives.
</p>

<p>
Strong candidates say:
</p>
<p>
“Accuracy isn’t the right metric here. I’d prioritise recall to minimise missed fraud, even if that increases false positives.”
</p>

<p>
Metric reasoning is also heavily tested in <a href="/interviews/data-analytics">data analytics interviews</a>.
</p>

<hr />

<h2>Mistake #3: Treating the Data as Clean and Complete</h2>

<h3>Why this signals inexperience</h3>
<p>
Real-world data is messy by default.
</p>

<p>
Ignoring this suggests:
</p>
<ul>
  <li>No production exposure</li>
  <li>Over-reliance on curated datasets</li>
</ul>

<h3>Strong candidates proactively discuss</h3>
<ul>
  <li>Missing values</li>
  <li>Label leakage</li>
  <li>Feature availability at inference time</li>
  <li>Bias and imbalance</li>
</ul>

<p>
For example:
</p>
<p>
“I’d verify that none of these features leak future information and that labels aren’t delayed.”
</p>

<hr />

<h2>Mistake #4: Knowing Algorithms but Not Their Trade-offs</h2>

<h3>The failure pattern</h3>
<p>
Candidates can explain how models work but struggle to explain why one is appropriate.
</p>

<h3>What interviewers care about</h3>
<ul>
  <li>Interpretability</li>
  <li>Latency</li>
  <li>Cost</li>
  <li>Maintenance</li>
</ul>

<p>
Strong candidates say:
</p>
<p>
“I’d use logistic regression if explainability is critical, even if performance is slightly lower.”
</p>

<p>
This mirrors the trade-off thinking expected in <a href="/interviews/product-management">product management interviews</a>.
</p>

<hr />

<h2>Mistake #5: Weak Explanation of Model Decisions</h2>

<h3>The hidden rejection reason</h3>
<p>
If stakeholders don’t trust your model, it won’t be used.
</p>

<h3>Weak explanation</h3>
<p>
“The model learned complex non-linear interactions.”
</p>

<h3>Strong explanation</h3>
<p>
“Users with declining engagement and unresolved support tickets are more likely to churn, which aligns with how dissatisfaction builds.”
</p>

<p>
Clear explanations build confidence—even with non-technical interviewers.
</p>

<hr />

<h2>Mistake #6: Ignoring Deployment, Monitoring, and Model Decay</h2>

<h3>Where candidates usually stop</h3>
<p>
Training and evaluation.
</p>

<h3>Where interviews continue</h3>
<ul>
  <li>Deployment strategy</li>
  <li>Monitoring</li>
  <li>Data drift</li>
  <li>Retraining cadence</li>
</ul>

<p>
Even a high-level answer signals real-world readiness:
</p>
<p>
“I’d monitor feature drift and retrain periodically when performance degrades.”
</p>

<hr />

<h2>Mistake #7: Overengineering Simple Problems</h2>

<h3>Why this backfires</h3>
<p>
Complex models increase:
</p>
<ul>
  <li>Risk</li>
  <li>Maintenance cost</li>
  <li>Debugging difficulty</li>
</ul>

<p>
Strong candidates say:
</p>
<p>
“I’d start with a simple baseline and only add complexity if it meaningfully improves outcomes.”
</p>

<p>
This signals maturity and judgement.
</p>

<hr />

<h2>Mistake #8: Not Practicing Real ML Interviews</h2>

<h3>The uncomfortable truth</h3>
<p>
Kaggle trains modeling. Courses teach theory.
</p>

<p>
Neither trains:
</p>
<ul>
  <li>Live reasoning</li>
  <li>Handling follow-ups</li>
  <li>Explaining trade-offs under pressure</li>
</ul>

<p>
That’s why strong candidates still fail.
</p>

<p>
Structured mock interviews help surface blind spots before real interviews do—not by teaching ML, but by improving execution.
</p>

<hr />

<h2>Final thoughts: Strong models don’t guarantee offers</h2>

<p>
Machine learning interviews reward:
</p>
<ul>
  <li>Judgement</li>
  <li>Clarity</li>
  <li>Trade-offs</li>
  <li>Communication</li>
</ul>

<p>
If you keep failing despite knowing ML, it’s likely an execution gap—not a knowledge gap.
</p>
`,
  author: "CrackJobs Team",
  publishedAt: "2025-01-15",
  tags: ["Machine Learning", "Data Science", "ML Interviews", "Careers"],
},

  {
  slug: "hr-interview-mistakes-talent-acquisition",
  title: "7 HR Interview Mistakes That Cost Talent Acquisition Professionals the Job (And How to Fix Them)",
  excerpt:
    "Most HR and Talent Acquisition professionals don’t fail interviews due to lack of HR knowledge—they fail because they don’t demonstrate judgement, stakeholder thinking, and real-world ownership. These 7 interview mistakes explain why.",
  thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
  content: `
<h1>7 HR Interview Mistakes That Cost Talent Acquisition Professionals the Job (And How to Fix Them)</h1>

<h2>Who this article is for</h2>
<p>
This article is for:
</p>
<ul>
  <li>HR Generalists and Talent Acquisition professionals</li>
  <li>HRBPs preparing for mid-level and senior roles</li>
  <li>Recruiters who clear screenings but fail final rounds</li>
  <li>Candidates who hear feedback like “good HR knowledge, but limited business depth”</li>
</ul>

<p>
If you’ve ever walked out of an HR interview feeling like you “answered everything correctly” but still didn’t convert, this article explains why.
</p>

<h2>What HR interviews are actually testing (and rarely stated clearly)</h2>
<p>
HR interviews are not primarily testing whether you know policies, frameworks, or definitions.
</p>

<p>
They are testing whether leaders can trust you to:
</p>
<ul>
  <li>Handle ambiguity and people problems</li>
  <li>Balance empathy with business outcomes</li>
  <li>Influence stakeholders without authority</li>
  <li>Make judgement calls when there is no “right” answer</li>
</ul>

<p>
Most HR interview rejections happen not because the answer was wrong—but because the candidate didn’t demonstrate <strong>ownership, judgement, or stakeholder awareness</strong>.
</p>

<p>
This is exactly how modern <a href="/interviews/hr">HR interviews</a> are evaluated.
</p>

<hr />

<h2>Mistake #1: Giving Textbook HR Answers Instead of Real Decisions</h2>

<h3>Why candidates do this</h3>
<ul>
  <li>HR education emphasizes frameworks and theory</li>
  <li>Candidates want “safe” answers</li>
  <li>They fear saying something controversial</li>
</ul>

<h3>What interviewers hear</h3>
<p>
Generic answers that sound correct but reveal nothing about judgement.
</p>

<h3>Example</h3>
<p><strong>Question:</strong> How do you handle conflict between a manager and employee?</p>

<p><strong>Weak response:</strong></p>
<p>
“I’d listen to both sides, follow policy, and ensure fairness.”
</p>

<p><strong>Strong response:</strong></p>
<p>
“I’d first understand whether this is a performance issue, a communication breakdown, or a role misalignment. My approach would differ in each case.”
</p>

<h3>Why this matters</h3>
<p>
Interviewers want to see how you <em>diagnose</em> people problems, not just how you describe them.
</p>

<hr />

<h2>Mistake #2: Avoiding Business Trade-offs</h2>

<h3>The common HR trap</h3>
<p>
Candidates over-index on employee empathy and avoid discussing business impact.
</p>

<h3>Why this fails</h3>
<p>
Modern HR roles are business roles.
</p>

<p>
Interviewers expect you to balance:
</p>
<ul>
  <li>Employee experience</li>
  <li>Manager effectiveness</li>
  <li>Company outcomes</li>
</ul>

<h3>Strong signal</h3>
<p>
“I care deeply about employee well-being, but I also need to ensure the business can execute. My role is to balance both.”
</p>

<p>
This same trade-off thinking is expected in <a href="/interviews/product-management">product management interviews</a> as well.
</p>

<hr />

<h2>Mistake #3: Not Demonstrating Stakeholder Management</h2>

<h3>Why this is a major rejection reason</h3>
<p>
HR professionals rarely work in isolation.
</p>

<p>
They constantly navigate:
</p>
<ul>
  <li>Founders and leadership</li>
  <li>Line managers</li>
  <li>Employees</li>
</ul>

<h3>Weak answers</h3>
<p>
“I escalated to leadership.”
</p>

<h3>Strong answers</h3>
<p>
“I aligned stakeholders early, clarified trade-offs, and ensured everyone understood the decision—even if they disagreed.”
</p>

<p>
This skill is often what separates senior HRBPs from junior generalists.
</p>

<hr />

<h2>Mistake #4: Treating Hiring as a Transaction</h2>

<h3>Common misconception</h3>
<p>
Hiring is just sourcing, interviewing, and closing.
</p>

<h3>What interviewers want to hear</h3>
<ul>
  <li>How you define hiring success</li>
  <li>How you partner with hiring managers</li>
  <li>How you improve signal quality</li>
</ul>

<h3>Strong signal</h3>
<p>
“I focus on improving hiring quality by aligning on role expectations upfront, not just filling positions quickly.”
</p>

<p>
This mindset overlaps heavily with how success is evaluated in <a href="/interviews/data-analytics">data analytics interviews</a>, where signal quality matters more than volume.
</p>

<hr />

<h2>Mistake #5: Weak Handling of Difficult Conversations</h2>

<h3>Why interviewers probe here</h3>
<p>
HR professionals are often responsible for delivering uncomfortable messages.
</p>

<h3>Weak framing</h3>
<p>
“I’d explain the policy and move on.”
</p>

<h3>Strong framing</h3>
<p>
“I’d ensure the employee understands the rationale, feels heard, and knows what support is available—even if the outcome is non-negotiable.”
</p>

<p>
This demonstrates emotional intelligence <em>and</em> ownership.
</p>

<hr />

<h2>Mistake #6: Not Using Data to Support HR Decisions</h2>

<h3>The modern expectation</h3>
<p>
HR is no longer intuition-only.
</p>

<p>
Interviewers expect comfort with:
</p>
<ul>
  <li>Attrition metrics</li>
  <li>Hiring funnel data</li>
  <li>Engagement surveys</li>
</ul>

<h3>Strong signal</h3>
<p>
“I’d use attrition trends and exit feedback to identify patterns, not just anecdotes.”
</p>

<p>
This analytical thinking mirrors expectations in <a href="/interviews/data-analytics">analytics interviews</a>.
</p>

<hr />

<h2>Mistake #7: Not Practicing Real HR Interview Scenarios</h2>

<h3>Why preparation often fails</h3>
<p>
Most HR candidates prepare by:
</p>
<ul>
  <li>Reading HR theory</li>
  <li>Memorising frameworks</li>
</ul>

<p>
Real interviews test:
</p>
<ul>
  <li>Judgement under pressure</li>
  <li>Stakeholder pushback</li>
  <li>Ambiguous people problems</li>
</ul>

<p>
These are hard to simulate alone.
</p>

<hr />

<h2>Final thoughts: HR interviews reward judgement, not perfection</h2>

<p>
HR interviews don’t reward “perfect” answers.
</p>

<p>
They reward:
</p>
<ul>
  <li>Judgement</li>
  <li>Empathy with boundaries</li>
  <li>Business alignment</li>
  <li>Stakeholder awareness</li>
</ul>

<p>
If you keep failing HR interviews despite strong experience, the issue is usually execution—not knowledge.
</p>
`,
  author: "CrackJobs Team",
  publishedAt: "2025-01-18",
  tags: ["HR", "Talent Acquisition", "HR Interviews", "Careers"],
},

  {
  slug: "product-manager-interview-execution-mistakes",
  title: "7 Product Manager Interview Execution Mistakes That Get Strong Candidates Rejected",
  excerpt:
    "Many product managers fail interviews not because they lack ideas, but because their execution thinking, structure, and trade-offs fall apart under pressure. These 7 execution mistakes explain why.",
  thumbnailUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0",
  content: `
<h1>7 Product Manager Interview Execution Mistakes That Get Strong Candidates Rejected</h1>

<h2>Who this article is for</h2>
<p>
This article is for product managers who:
</p>
<ul>
  <li>Clear product sense rounds but fail execution interviews</li>
  <li>Receive feedback like “good ideas, but not structured enough”</li>
  <li>Struggle with technical or data-heavy follow-ups</li>
  <li>Feel interviews expect something more than frameworks</li>
</ul>

<h2>What execution interviews are actually testing</h2>
<p>
Execution interviews test whether interviewers can trust you to ship under constraints.
</p>

<p>
They evaluate:
</p>
<ul>
  <li>How you reason with incomplete data</li>
  <li>How you make trade-offs</li>
  <li>How you work with engineering and analytics</li>
  <li>How you decide <em>what not to do</em></li>
</ul>

<p>
This is central to real <a href="/interviews/product-management">product management interviews</a>.
</p>

<hr />

<h2>Mistake #1: Treating Execution as Feature Brainstorming</h2>

<p>
Many candidates jump straight to solutions without clarifying constraints.
</p>

<p><strong>Weak signal:</strong></p>
<p>
“I’d add more features to increase engagement.”
</p>

<p><strong>Strong signal:</strong></p>
<p>
“I’d first understand the bottleneck—discovery, activation, or retention—before proposing solutions.”
</p>

<hr />

<h2>Mistake #2: Weak Metrics Thinking</h2>

<p>
Execution interviews probe metric ownership.
</p>

<p>
Candidates fail when they:
</p>
<ul>
  <li>Choose vanity metrics</li>
  <li>Can’t define success clearly</li>
  <li>Don’t anticipate trade-offs</li>
</ul>

<p>
Strong PMs align metrics with business outcomes—similar to expectations in <a href="/interviews/data-analytics">data analytics interviews</a>.
</p>

<hr />

<h2>Mistake #3: Avoiding Technical Depth Entirely</h2>

<p>
You don’t need to code—but you must reason technically.
</p>

<p>
Interviewers look for:
</p>
<ul>
  <li>API-level thinking</li>
  <li>System constraints</li>
  <li>Data flow awareness</li>
</ul>

<p>
This overlap with data and ML expectations is why PMs increasingly fail execution rounds.
</p>

<hr />

<h2>Mistake #4: Not Considering Edge Cases</h2>

<p>
Edge cases reveal ownership.
</p>

<p>
Strong candidates proactively discuss:
</p>
<ul>
  <li>Abuse scenarios</li>
  <li>Failure states</li>
  <li>Scale constraints</li>
</ul>

<hr />

<h2>Mistake #5: Poor Stakeholder Trade-offs</h2>

<p>
Execution is multi-stakeholder by nature.
</p>

<p>
Interviewers expect you to balance:
</p>
<ul>
  <li>User value</li>
  <li>Engineering cost</li>
  <li>Business priorities</li>
</ul>

<hr />

<h2>Mistake #6: Treating Data as Validation Only</h2>

<p>
Strong PMs use data to:
</p>
<ul>
  <li>Discover problems</li>
  <li>Prioritise work</li>
  <li>Kill bad ideas early</li>
</ul>

<p>
This mirrors analytical depth expected in <a href="/interviews/data-science">data science interviews</a>.
</p>

<hr />

<h2>Mistake #7: Not Practicing Real Execution Interviews</h2>

<p>
Execution interviews test live reasoning.
</p>

<p>
Framework memorisation doesn’t survive follow-ups.
</p>

<hr />

<h2>Final thoughts</h2>
<p>
Execution interviews reward judgement, not feature lists.
</p>

<p>
If you keep failing despite strong experience, the gap is often execution clarity—not capability.
</p>
`,
  author: "CrackJobs Team",
  publishedAt: "2025-01-20",
  tags: ["Product Management", "PM Interviews", "Execution", "Careers"],
},

  {
  slug: "product-manager-interview-product-sense-mistakes",
  title: "6 Product Sense Interview Mistakes That Cost Product Managers the Offer",
  excerpt:
    "Product sense interviews reject candidates not for lack of ideas, but for weak prioritisation, shallow user thinking, and poor trade-offs. These 6 mistakes explain why.",
  thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
  content: `
<h1>6 Product Sense Interview Mistakes That Cost Product Managers the Offer</h1>

<h2>Who this article is for</h2>
<p>
This article is for PMs who:
</p>
<ul>
  <li>Struggle with open-ended design questions</li>
  <li>Get feedback like “interesting ideas, but lacked depth”</li>
  <li>Over-index on frameworks</li>
  <li>Feel unsure how to prioritise under ambiguity</li>
</ul>

<h2>What product sense interviews are really testing</h2>
<p>
Product sense interviews test how you think when there is no correct answer.
</p>

<p>
Interviewers evaluate:
</p>
<ul>
  <li>User empathy</li>
  <li>Problem selection</li>
  <li>Prioritisation logic</li>
  <li>Strategic trade-offs</li>
</ul>

<p>
This is foundational to <a href="/interviews/product-management">product management interviews</a>.
</p>

<hr />

<h2>Mistake #1: Designing Without a Clear User</h2>

<p>
Candidates often say “users” instead of <em>a specific user</em>.
</p>

<p>
Strong PMs anchor decisions in:
</p>
<ul>
  <li>Context</li>
  <li>Motivation</li>
  <li>Constraints</li>
</ul>

<hr />

<h2>Mistake #2: Treating Frameworks as Answers</h2>

<p>
Frameworks are tools, not solutions.
</p>

<p>
Interviewers reject candidates who:
</p>
<ul>
  <li>List steps without insight</li>
  <li>Can’t adapt frameworks</li>
</ul>

<hr />

<h2>Mistake #3: Weak Prioritisation Logic</h2>

<p>
Saying “I’d prioritise impact vs effort” is not enough.
</p>

<p>
Strong candidates explain:
</p>
<ul>
  <li>Why this problem matters now</li>
  <li>What they are explicitly deprioritising</li>
</ul>

<hr />

<h2>Mistake #4: Ignoring Business Constraints</h2>

<p>
Product sense without business reality is fantasy.
</p>

<p>
Interviewers expect awareness of:
</p>
<ul>
  <li>Revenue models</li>
  <li>Cost structures</li>
  <li>Strategic goals</li>
</ul>

<hr />

<h2>Mistake #5: Not Connecting to Metrics</h2>

<p>
Every product decision implies a metric.
</p>

<p>
This is why PM product sense overlaps heavily with <a href="/interviews/data-analytics">analytics interviews</a>.
</p>

<hr />

<h2>Mistake #6: Not Practicing Real Product Sense Interviews</h2>

<p>
Product sense interviews test live thinking, not memorised answers.
</p>

<hr />

<h2>Final thoughts</h2>
<p>
Product sense interviews reward clarity, judgement, and prioritisation—not creativity alone.
</p>
`,
  author: "CrackJobs Team",
  publishedAt: "2025-01-22",
  tags: ["Product Management", "Product Sense", "PM Interviews", "Careers"],
}
];

// =============================================
// HELPER FUNCTIONS
// =============================================

// Get all blog posts (sorted by date, newest first)
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Get a single post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => 
    post.tags?.includes(tag)
  ).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}