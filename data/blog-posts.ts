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
,
  {
  slug: "aarm-framework-product-management-interviews",
  title: "The AARM Framework Explained: How to Answer Metrics Questions in PM Interviews",
  excerpt: "AARM (Acquire, Activate, Retain, Monetize) is the most-tested metrics framework in product manager interviews. Here's exactly how to use it — with worked examples for each stage.",
  thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
  content: `
<h1>The AARM Framework Explained: How to Answer Metrics Questions in PM Interviews</h1>

<h2>Why metrics questions trip up most PM candidates</h2>
<p>
Interviewers ask metrics questions to test one specific thing: can you think about a product as a system, not just a feature factory? Most candidates answer metrics questions by listing KPIs they've heard of — DAU, MAU, retention rate — without any structure. The result sounds like a dashboard readout, not a product strategy.
</p>
<p>
AARM gives your answer a spine. It forces you to think about <em>where in the user journey</em> a metric lives, and why that matters for the decision at hand.
</p>

<h2>What is the AARM framework?</h2>
<p>
AARM stands for <strong>Acquire, Activate, Retain, Monetize</strong>. It maps the four stages of the user lifecycle that every product must optimise:
</p>
<ul>
  <li><strong>Acquire</strong> — How do users discover and sign up for the product?</li>
  <li><strong>Activate</strong> — Do new users reach the "aha moment" that makes the product valuable?</li>
  <li><strong>Retain</strong> — Do activated users come back repeatedly over time?</li>
  <li><strong>Monetize</strong> — Does user engagement convert to revenue?</li>
</ul>
<p>
Each stage has distinct metrics, distinct levers, and distinct failure modes. A PM who conflates retention with activation — or treats all metrics as equally important — signals shallow product thinking.
</p>

<h2>How AARM is tested in PM interviews</h2>
<p>
You will encounter AARM in three types of questions:
</p>
<ul>
  <li><strong>Define success metrics:</strong> "What metrics would you track for [feature]?"</li>
  <li><strong>Diagnose a metric drop:</strong> "DAU dropped 15% last week. Walk me through your investigation."</li>
  <li><strong>Prioritise between metrics:</strong> "We can improve activation rate or retention rate. Which do you focus on?"</li>
</ul>
<p>
In all three, the interviewer is watching whether you structure your thinking or just enumerate. Using AARM explicitly — and saying so — immediately signals that you think in systems.
</p>

<h2>Stage 1: Acquire</h2>
<h3>What it means</h3>
<p>
Acquisition covers everything from a user's first awareness of your product to their first login. It includes paid channels, organic search, referral programmes, app store discovery, and word of mouth.
</p>
<h3>Key metrics</h3>
<ul>
  <li>New user sign-ups (weekly/monthly)</li>
  <li>Cost per acquisition (CPA) by channel</li>
  <li>Organic vs paid split</li>
  <li>Sign-up conversion rate (visitors → registered users)</li>
  <li>Time to first session</li>
</ul>
<h3>Interview example</h3>
<p>
<strong>Question:</strong> "You're PM for a B2C fintech app. What acquisition metrics would you track?"
</p>
<p>
<strong>Strong answer structure:</strong> "For acquisition, I'd focus on two things: volume and quality. Volume metrics tell me whether our top-of-funnel is working — new sign-ups by channel and sign-up conversion rate. Quality metrics tell me whether we're acquiring the right users — I'd look at the percentage of new sign-ups who complete their first transaction within 7 days. A high sign-up rate with a low 7-day activation rate signals we're attracting the wrong users or our onboarding is broken."
</p>

<h2>Stage 2: Activate</h2>
<h3>What it means</h3>
<p>
Activation is the moment a new user first experiences the core value of your product. This "aha moment" varies by product: for a mock interview platform, it might be completing a first session; for a SaaS tool, it might be creating a first project; for a social app, following five accounts.
</p>
<p>
Activation is where most products bleed users. The gap between "signed up" and "experienced value" is typically the largest drop-off in the funnel.
</p>
<h3>Key metrics</h3>
<ul>
  <li>Activation rate (% of sign-ups who reach the aha moment)</li>
  <li>Time to activation (how long it takes to reach the aha moment)</li>
  <li>Onboarding completion rate</li>
  <li>Day-1 retention (users who return the day after sign-up)</li>
</ul>
<h3>Interview example</h3>
<p>
<strong>Question:</strong> "Activation rate dropped from 60% to 45% after last week's release. What do you do?"
</p>
<p>
<strong>Strong answer structure:</strong> "First I'd confirm whether this is a data or product issue — check if our activation event tracking fired correctly. Then I'd segment by: cohort (is it only new users?), platform (iOS, Android, web), and acquisition channel (paid users often have lower intent). Then I'd look at where in the onboarding flow users are dropping — funnel analysis step by step. My hypothesis is the new release introduced friction in the onboarding path. I'd verify by looking at which onboarding step saw the biggest drop-off increase."
</p>

<h2>Stage 3: Retain</h2>
<h3>What it means</h3>
<p>
Retention measures whether activated users return over time. It's the most important long-term health signal for any product. A product with strong retention can grow purely on word of mouth; a product with weak retention requires constant acquisition spend just to stay flat.
</p>
<h3>Key metrics</h3>
<ul>
  <li>Day-7, Day-30, Day-90 retention rates</li>
  <li>Weekly Active Users / Monthly Active Users (WAU/MAU ratio)</li>
  <li>Churn rate</li>
  <li>Session frequency (how often retained users return per week)</li>
  <li>Feature adoption rate (are retained users discovering value beyond the core?)</li>
</ul>
<h3>Interview example</h3>
<p>
<strong>Question:</strong> "How do you measure the health of a subscription product's retention?"
</p>
<p>
<strong>Strong answer structure:</strong> "I'd look at retention in cohort curves rather than a single number. A healthy cohort curve flattens out after initial drop-off — meaning you have a stable core of users who've formed a habit. I'd track Day-30 and Day-90 retention by acquisition cohort to see if newer cohorts are retaining better or worse than older ones. I'd also monitor the WAU/MAU ratio — a ratio above 0.5 means users are returning multiple times a week, which is a strong habit signal."
</p>

<h2>Stage 4: Monetize</h2>
<h3>What it means</h3>
<p>
Monetization tracks how user engagement converts into revenue. For some products (B2C subscription, marketplace, freemium SaaS), this stage is distinct from retention. For others, monetization is tightly coupled to activation (e-commerce, on-demand services).
</p>
<h3>Key metrics</h3>
<ul>
  <li>Revenue per user (ARPU)</li>
  <li>Conversion rate (free → paid)</li>
  <li>Average order value / average transaction value</li>
  <li>Lifetime value (LTV)</li>
  <li>LTV:CAC ratio (the most important unit economics metric)</li>
  <li>Payback period</li>
</ul>
<h3>Interview example</h3>
<p>
<strong>Question:</strong> "We're considering raising prices by 20%. What metrics would guide that decision?"
</p>
<p>
<strong>Strong answer structure:</strong> "Before the change, I'd establish baseline conversion rate, ARPU, and churn rate. Then I'd run a price test on a small cohort and measure: does conversion rate drop, and by how much? Does churn increase in the 30 days post-price-change? Is the net revenue impact positive — i.e., does the ARPU increase outweigh the conversion/churn loss? I'd also check whether the price increase affects different user segments differently — high-intent users acquired organically tend to be less price-sensitive than paid-acquisition users."
</p>

<h2>How to use AARM in a full metrics answer</h2>
<p>
The mistake most candidates make is jumping straight to individual metrics. Instead, open with the framework and then drill down:
</p>
<ol>
  <li><strong>Name the framework:</strong> "I'd approach this using AARM — Acquire, Activate, Retain, Monetize."</li>
  <li><strong>Identify the most important stage for this question:</strong> "Given the context, I think Retention is the most critical right now because..."</li>
  <li><strong>Go deep on that stage:</strong> Name 2-3 specific metrics and explain what they tell you.</li>
  <li><strong>Name your north star metric:</strong> "My single north star would be X, because it best captures whether users are getting the core value."</li>
  <li><strong>Name a guardrail metric:</strong> "I'd also monitor Y as a guardrail, to make sure optimising for X doesn't inadvertently hurt Z."</li>
</ol>

<h2>Common AARM mistakes in interviews</h2>
<ul>
  <li><strong>Listing metrics without stage context:</strong> Saying "I'd track DAU, MAU, and retention" without explaining which stage each belongs to signals shallow thinking.</li>
  <li><strong>Skipping the north star:</strong> Giving five metrics without saying which one matters most looks like you can't prioritise.</li>
  <li><strong>Ignoring guardrails:</strong> Every metric can be gamed. A strong PM names what they're watching to prevent gaming.</li>
  <li><strong>Confusing activation with retention:</strong> Activation is a one-time event (first value experience). Retention is repeated behaviour. Conflating them is a red flag.</li>
</ul>

<h2>Practice this with a real PM</h2>
<p>
Reading about AARM is useful. Applying it live, under time pressure, with follow-up questions is what actually builds the instinct. In a <a href="/interviews/product-management">PM mock interview</a>, a mentor will throw a metrics question at you and watch whether you reach for AARM automatically — or pause, flounder, and list random KPIs.
</p>
<p>
The difference between candidates who get offers and candidates who don't is usually not knowledge — it's fluency. Practice AARM out loud, with a real interviewer pushing back, until it's automatic.
</p>
`,
  author: "CrackJobs Team",
  publishedAt: "2026-02-10",
  tags: ["Product Management", "AARM Framework", "PM Interviews", "Metrics"],
},
  {
  slug: "data-analyst-mock-interview-guide",
  title: "How to Prepare for a Data Analyst Mock Interview: The Complete Guide",
  excerpt: "A step-by-step guide to preparing for data analyst mock interviews. What to expect, how to structure your SQL and case answers, and how to turn mock sessions into real offers.",
  thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  content: `
<h1>How to Prepare for a Data Analyst Mock Interview: The Complete Guide</h1>

<h2>Why mock interviews work differently for data analysts</h2>
<p>
Data analyst interviews test three things at once: technical SQL ability, business reasoning, and communication. The failure mode most candidates hit isn't failing any one of these — it's failing the transition between them. They write a correct query, then can't explain what the result means for the business. Or they give a sharp business recommendation but can't back it with data.
</p>
<p>
A mock interview is the only environment where you practice all three simultaneously, with someone watching the seams between them.
</p>

<h2>What a data analyst interview actually looks like</h2>
<p>
Most DA interviews at mid-to-large companies follow a consistent structure across 3–4 rounds:
</p>
<ul>
  <li><strong>SQL round (45–60 min):</strong> 2–4 progressively harder queries. Window functions, CTEs, joins, aggregations. Sometimes on a live coding platform, sometimes on paper.</li>
  <li><strong>Business/analytics case (45–60 min):</strong> A product or business scenario where you're given a dataset (real or hypothetical) and asked to derive insights and make recommendations.</li>
  <li><strong>Stakeholder/communication round:</strong> Behavioural questions about how you've worked with non-technical stakeholders, presented findings, handled disagreements with data.</li>
  <li><strong>Take-home task (some companies):</strong> 3–6 hour analysis project, usually with a dataset and a vague brief. Evaluated on methodology, clarity, and recommendation quality.</li>
</ul>

<h2>The 4-week mock interview preparation plan</h2>

<h3>Week 1: SQL fluency</h3>
<p>
Your goal this week is to reach a point where syntax is automatic. You should not be thinking about how to write a window function — you should be thinking about what the window function is telling you about the data.
</p>
<ul>
  <li>Practice 2 SQL problems daily (LeetCode Medium difficulty is the right level)</li>
  <li>Focus on: GROUP BY with HAVING, multiple JOINs, window functions (ROW_NUMBER, LAG, LEAD, RANK), CTEs for readability, NULL handling</li>
  <li>For each query, practise explaining out loud what the result set represents</li>
</ul>

<h3>Week 2: Business case frameworks</h3>
<p>
Data analyst cases test whether you can frame a business question, choose the right analysis, and tell a story with results. Practice structuring your answers with:
</p>
<ul>
  <li><strong>Clarify:</strong> What is the business goal? What decisions does this analysis inform?</li>
  <li><strong>Hypothesise:</strong> What do I expect to find, and why?</li>
  <li><strong>Analyse:</strong> What SQL queries, segmentations, or visualisations answer the question?</li>
  <li><strong>Recommend:</strong> Given the data, what should the business do?</li>
  <li><strong>Caveat:</strong> What are the limitations of this analysis? What would change your recommendation?</li>
</ul>

<h3>Week 3: Mock interviews</h3>
<p>
This is when you book your first <a href="/interviews/data-analytics">data analyst mock interview</a> with a real analyst. Don't wait until you feel ready — you never will. The first mock is diagnostic: it shows you the gaps that solo practice can't reveal.
</p>
<p>
After your mock, review the recording (all CrackJobs sessions are recorded) and categorise every moment where you hesitated, went silent, or gave an imprecise answer. These become your Week 4 focus areas.
</p>

<h3>Week 4: Targeted gap closing</h3>
<p>
Use feedback from your mock to drill specific weaknesses. Book a second mock in the final days of this week to measure improvement. Most candidates improve significantly between their first and second mocks — not because they learned new skills, but because they stopped second-guessing instincts they already had.
</p>

<h2>What interviewers are actually watching in SQL rounds</h2>
<p>
Interviewers are not just checking if your query produces the right output. They're watching:
</p>
<ul>
  <li><strong>Do you clarify before writing?</strong> Strong analysts ask about the data model, NULLs, edge cases before writing a single line.</li>
  <li><strong>Do you narrate your thinking?</strong> Writing silently and then pasting a query is a red flag. Strong analysts think aloud.</li>
  <li><strong>Do you validate your result?</strong> After writing a query, do you sanity-check the output? ("This gives 47 rows, which seems right given we have 500 customers across 10 regions...")</li>
  <li><strong>Do you simplify when you can?</strong> A clean 10-line query beats a correct 40-line query. Interviewers know you'll be writing queries other people maintain.</li>
</ul>

<h2>What interviewers are watching in case rounds</h2>
<ul>
  <li><strong>Do you frame the problem before diving in?</strong> Analysts who start writing queries before understanding the business question almost always go down the wrong path.</li>
  <li><strong>Do your insights connect to a decision?</strong> "Active users are down 12%" is an observation. "Active users are down 12%, concentrated in the mobile cohort acquired via paid channels in January — this suggests our Q1 paid campaign attracted low-quality users" is an insight.</li>
  <li><strong>Can you handle uncertainty?</strong> Real data is messy. If you find unexpected results, do you flag them and suggest what they might mean, or do you ignore them because they don't fit your narrative?</li>
</ul>

<h2>The most common DA mock interview mistakes</h2>
<ul>
  <li><strong>Jumping to code without clarifying:</strong> Costs you 10–15 minutes going down the wrong path and signals poor judgement.</li>
  <li><strong>Not narrating:</strong> Interviewers can't give you credit for thinking they can't see.</li>
  <li><strong>Giving observations instead of recommendations:</strong> Every analysis should end with a clear "therefore, we should..." statement.</li>
  <li><strong>Ignoring A/B test validity:</strong> When asked to analyse an experiment, most candidates skip asking about sample size, experiment duration, and whether the experiment was properly randomised.</li>
  <li><strong>Over-engineering visualisations in take-home tasks:</strong> A clean table with clear labels beats a complex dashboard that requires a manual to interpret.</li>
</ul>

<h2>How to evaluate a mock interview mentor</h2>
<p>
Not all mock interview feedback is equal. A good DA mock interviewer should:
</p>
<ul>
  <li>Ask you SQL questions that mirror real interview difficulty (not LeetCode Hard, but not trivially easy either)</li>
  <li>Push back when your business reasoning is vague — not just accept "it depends"</li>
  <li>Give you specific, actionable feedback at the end: not "good job" but "your query was correct but you missed handling NULLs in the customer_id column, which would have returned wrong results in production"</li>
  <li>Tell you where your answer would have been rejected vs. accepted at their specific company</li>
</ul>
<p>
All CrackJobs mentors are active data analysts at companies across India. They give you the feedback that real interviewers give hiring managers after your loop — not the polite version.
</p>
`,
  author: "CrackJobs Team",
  publishedAt: "2026-02-18",
  tags: ["Data Analytics", "Mock Interviews", "SQL", "Interview Preparation"],
},
  {
  slug: "how-to-prepare-for-pm-mock-interview",
  title: "How to Prepare for a Product Manager Mock Interview (And Actually Land the Offer)",
  excerpt: "Most PM candidates practice the wrong way. Here's the exact preparation framework — from framework fluency to mock interview cadence — that gives you the best chance of converting practice into an offer.",
  thumbnailUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
  content: `
<h1>How to Prepare for a Product Manager Mock Interview (And Actually Land the Offer)</h1>

<h2>The problem with how most PM candidates prepare</h2>
<p>
Most PM candidates spend 80% of their preparation reading frameworks and 20% practicing them. The ratio should be the opposite. Reading about CIRCLES doesn't build the instinct to reach for it when an interviewer asks "design a better ATM for the visually impaired." That instinct comes from repetition under pressure — which means mock interviews, not more reading.
</p>
<p>
This guide is about how to structure your preparation so that mock interviews do the most work.
</p>

<h2>What PM interviews are actually testing</h2>
<p>
PM interviews test four things — and interviewers at top companies explicitly score you across all four:
</p>
<ul>
  <li><strong>Product Sense:</strong> Can you deeply understand users, define problems, and design solutions that balance user needs with business constraints?</li>
  <li><strong>Execution:</strong> Can you diagnose metric drops, design A/B tests, define success metrics, and manage a product from 0 to 1?</li>
  <li><strong>Technical Acumen:</strong> Can you have credible conversations with engineers about system trade-offs, APIs, and data architecture?</li>
  <li><strong>Strategy & Leadership:</strong> Can you build roadmaps, influence without authority, and make decisions in ambiguous situations?</li>
</ul>
<p>
The mistake most candidates make is over-indexing on Product Sense (because it's the most discussed) and under-preparing for Execution (because it requires knowing metrics, which feels like data analyst territory). In practice, Execution questions trip up more candidates than any other category.
</p>

<h2>The 8-week PM mock interview preparation framework</h2>

<h3>Weeks 1–2: Framework fluency</h3>
<p>
You need three frameworks so internalised that you can apply them without thinking:
</p>
<ul>
  <li><strong>CIRCLES</strong> for product design questions (Comprehend, Identify, Report, Cut, List, Evaluate, Summarise)</li>
  <li><strong>AARM</strong> for metrics and growth questions (Acquire, Activate, Retain, Monetize)</li>
  <li><strong>RICE</strong> for prioritisation (Reach, Impact, Confidence, Effort)</li>
</ul>
<p>
For each framework: read it once, then practice applying it to 10 different questions out loud, without looking at notes. The goal is not to memorise the acronym but to have the structure become the way you naturally think about product problems.
</p>

<h3>Weeks 3–4: Product Sense depth</h3>
<p>
Practice 15–20 product design questions. For each one, time yourself: 45 minutes total, with explicit time boxing (5 min clarify, 7 min users, 10 min ideation, 8 min prioritise, 5 min metrics, 5 min edge cases, 5 min summarise). Time pressure is not incidental — it is a core part of what's being tested.
</p>
<p>
Focus specifically on the moments where you feel stuck: user segmentation (most candidates pick one vague user type and don't push further) and solution prioritisation (most candidates list solutions but can't articulate crisp trade-offs).
</p>

<h3>Weeks 5–6: Execution and metrics</h3>
<p>
Execution questions are where strong Product Sense candidates get eliminated. Practice:
</p>
<ul>
  <li>Root cause analysis for metric drops: "DAU dropped 20%. Walk me through how you'd diagnose this."</li>
  <li>A/B test design: "We want to test a new onboarding flow. How would you design this experiment?"</li>
  <li>Success metric definition: "You're launching a new feature. Define your north star and guardrail metrics."</li>
  <li>Go-to-market: "How would you launch this feature to 10% of users?"</li>
</ul>

<h3>Weeks 7–8: Mock interviews + gap closing</h3>
<p>
This is when you book your <a href="/interviews/product-management">PM mock interviews</a>. Two sessions minimum: one diagnostic, one to measure improvement after addressing feedback.
</p>
<p>
The value of a mock interview isn't just feedback — it's discovering the gap between how you think you answer and how you actually answer. Almost every candidate discovers in their first mock that they talk too much during clarification, don't commit to a user segment, or give execution answers that are too high-level. These gaps are invisible in solo practice.
</p>

<h2>What separates L4 offers from L5+ offers</h2>
<p>
If you're targeting senior or staff PM roles, the bar shifts in two specific ways:
</p>
<ul>
  <li><strong>Proactive risk articulation:</strong> Junior PM answers define success metrics. Senior PM answers define success metrics AND guardrail metrics AND explicitly name what failure modes they're watching for.</li>
  <li><strong>Influence without authority:</strong> Every senior PM loop includes at least one question about managing stakeholder conflict or getting engineering alignment without having headcount authority. These require specific STAR stories, not generic "I collaborate well" answers.</li>
</ul>

<h2>Common mistakes in PM mock interviews</h2>
<ul>
  <li><strong>Skipping clarification:</strong> Jumping into a product design answer without asking "who are the primary users?" or "what platform?" signals you build features without user research.</li>
  <li><strong>Picking the most interesting user segment instead of the most important one:</strong> Interviewers will ask why you chose the segment you did. "It seemed interesting" fails. "It has the highest unmet need relative to the company's growth vector" lands.</li>
  <li><strong>Vague success metrics:</strong> "Improve engagement" is not a metric. "7-day retention rate for users who complete the onboarding flow" is a metric.</li>
  <li><strong>Not committing to a recommendation:</strong> PMs are decision-makers. If your answer ends with "it depends," you've failed. End with a clear recommendation and acknowledge the trade-offs.</li>
</ul>

<h2>How to choose the right mock interviewer</h2>
<p>
The single most important factor in mock interview quality is whether your interviewer has been on the other side of the table — i.e., they have actually conducted PM interviews and made hiring decisions. This is rarer than you'd think.
</p>
<p>
CrackJobs mentors are active PMs who conduct real interviews at their companies. They know the difference between an answer that "sounds good" and one that actually clears the bar, because they're the ones setting the bar.
</p>
`,
  author: "CrackJobs Team",
  publishedAt: "2026-02-25",
  tags: ["Product Management", "Mock Interviews", "PM Interviews", "Interview Preparation"],
},
  {
  slug: "ml-debugging-interview-guide",
  title: "ML Debugging Interview Questions: How Data Scientists Should Answer Them",
  excerpt: "ML debugging questions are among the hardest in data science interviews because they test practical intuition, not just theory. Here's how to structure your answers — with worked examples for the most common failure modes.",
  thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
  content: `
<h1>ML Debugging Interview Questions: How Data Scientists Should Answer Them</h1>

<h2>Why ML debugging questions are different</h2>
<p>
Most data science interview prep focuses on theory: explain gradient descent, derive the bias-variance trade-off, describe how XGBoost handles missing values. ML debugging questions are different. They're scenario-based, open-ended, and test whether you can reason about a model that's misbehaving in a specific way.
</p>
<p>
The failure mode for most candidates is answering debugging questions with theory. "This could be overfitting, or it could be underfitting, or it could be a data issue" is not a debugging answer — it's a list of possibilities with no structure. Interviewers are looking for someone who would know what to do at 9pm when a production model starts degrading.
</p>

<h2>The four categories of ML debugging questions</h2>

<h3>1. Model performance degradation</h3>
<p>
<strong>Example:</strong> "Your model's AUC was 0.87 in validation, but 0.71 in production. What do you do?"
</p>
<p>
This is a train-serve skew problem. Structure your answer in this order:
</p>
<ul>
  <li><strong>Data:</strong> Is the production data distribution different from training? Check feature distributions in production vs. training set. Focus on: categorical feature value distributions, numerical feature ranges, missing value rates, and class balance.</li>
  <li><strong>Pipeline:</strong> Is the feature engineering applied identically in training and serving? A single preprocessing step that runs in training but not serving (or vice versa) is enough to collapse model performance.</li>
  <li><strong>Label drift:</strong> Has the definition of the target variable changed? This is especially common in fraud detection and content moderation where labelling policies evolve.</li>
  <li><strong>Time:</strong> How long has the model been in production? Models degrade over time as the world changes. If the model is 18 months old, retraining on recent data is the first experiment.</li>
</ul>

<h3>2. Unexpected model behaviour on specific inputs</h3>
<p>
<strong>Example:</strong> "Your recommendation model works well globally, but performs poorly for new users. Why, and what do you do?"
</p>
<p>
This is a cold-start problem. The debugger's approach:
</p>
<ul>
  <li>Confirm the scope: is "new users" defined as 0 interactions, fewer than 5, or something else? The threshold matters for your fix.</li>
  <li>Identify what features the model is relying on for established users (usually interaction history) and what it falls back to for new users (usually demographic or contextual signals).</li>
  <li>The fix is typically a separate model or rule-based fallback for the cold-start segment, not patching the main model.</li>
</ul>

<h3>3. Training instability</h3>
<p>
<strong>Example:</strong> "Your neural network loss is not converging — it oscillates and never stabilises. What do you check?"
</p>
<p>
Go in this order:
</p>
<ul>
  <li><strong>Learning rate:</strong> Too high causes oscillation; too low causes slow convergence or getting stuck. Try reducing by 10x and observe whether the loss curve stabilises.</li>
  <li><strong>Batch size:</strong> Very small batches create noisy gradient estimates. Increase batch size and check if training becomes more stable.</li>
  <li><strong>Data normalisation:</strong> Unnormalised input features with very different scales cause gradient instability. Confirm all inputs are normalised.</li>
  <li><strong>Gradient clipping:</strong> For RNNs and deep networks, exploding gradients are a common cause of oscillation. Check gradient norms during training.</li>
  <li><strong>Loss function:</strong> Is the loss function appropriate for the task? A classification loss applied to a regression problem will cause instability.</li>
</ul>

<h3>4. Overfitting and underfitting</h3>
<p>
<strong>Example:</strong> "Your model achieves 98% training accuracy but 61% validation accuracy. Walk me through your diagnosis and fix."
</p>
<p>
This is classic overfitting. The strong answer goes beyond naming the problem:
</p>
<ul>
  <li><strong>Diagnose severity:</strong> A 37-point train/val gap is severe, not marginal. This suggests either extremely few training samples, a very complex model, or data leakage.</li>
  <li><strong>Check for data leakage first:</strong> Before tuning regularisation, check whether any feature was computed with knowledge of the target variable. Leakage produces 98%+ training accuracy in models that have no real signal.</li>
  <li><strong>If no leakage — regularise:</strong> Add L1/L2 regularisation, dropout (if neural net), or reduce model complexity. For tree-based models, tune max_depth and min_samples_leaf.</li>
  <li><strong>Add data:</strong> If regularisation isn't enough, the model needs more training examples. Collect more data or use data augmentation.</li>
  <li><strong>Cross-validate:</strong> Confirm the gap persists across multiple folds — a single train/val split can produce misleading results.</li>
</ul>

<h2>The debugging framework interviewers want to see</h2>
<p>
For any ML debugging question, structure your answer with this pattern:
</p>
<ol>
  <li><strong>Reproduce:</strong> How do you confirm the problem is real? (Not a logging bug, not a one-off data issue)</li>
  <li><strong>Scope:</strong> Is it affecting all predictions or a specific subset? Specific inputs, time periods, or user segments?</li>
  <li><strong>Hypothesise:</strong> State your top 2–3 hypotheses for root cause, ordered by likelihood.</li>
  <li><strong>Test:</strong> For each hypothesis, describe the specific check you'd run. Be concrete — name the metric, the query, or the experiment.</li>
  <li><strong>Fix and validate:</strong> Once you've identified the cause, describe the fix and how you'd confirm it worked.</li>
</ol>
<p>
The key is step 3 — most candidates skip from "I'd look at the data" straight to "I'd retrain the model." Interviewers want to hear you generate specific, testable hypotheses before running anything.
</p>

<h2>Production ML debugging vs. interview ML debugging</h2>
<p>
In production, you have logs, dashboards, and colleagues. In an interview, you have a scenario and a blank whiteboard. The skill being tested is whether you can reason systematically without any of those tools.
</p>
<p>
The best way to build that reasoning is to practice debugging scenarios out loud, with someone who can interrupt you and say "that hypothesis is right, but how would you actually test it?" That's what a <a href="/interviews/data-science">data science mock interview</a> gives you — a real ML engineer who has debugged real production models, pushing back on your reasoning in real time.
</p>

<h2>ML debugging questions to practice</h2>
<ul>
  <li>Your fraud detection model's precision dropped from 84% to 67% overnight. What happened?</li>
  <li>A feature that was highly predictive in training has near-zero importance in your production model. Why?</li>
  <li>Your model performs well on desktop users but poorly on mobile users. How do you diagnose this?</li>
  <li>Your A/B test shows the new model outperforms the baseline, but revenue is down. What do you investigate?</li>
  <li>Your model's predictions have become systematically biased toward one class over the last month. What's causing this?</li>
</ul>
`,
  author: "CrackJobs Team",
  publishedAt: "2026-03-05",
  tags: ["Data Science", "Machine Learning", "ML Interviews", "Model Debugging"],
},
  {
  slug: "sql-window-functions-interview-guide",
  title: "SQL Window Functions for Data Analyst Interviews: A Practical Guide",
  excerpt: "Window functions appear in nearly every senior data analyst interview. This guide covers the four most-tested patterns — ranking, running totals, lag/lead, and retention — with exact SQL you can use.",
  thumbnailUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3",
  content: `
<h1>SQL Window Functions for Data Analyst Interviews: A Practical Guide</h1>

<h2>Why window functions are interview-critical</h2>
<p>
Window functions separate junior data analyst candidates from mid-to-senior ones. Almost every company that interviews data analysts at the mid-to-senior level will test window functions — not as a trick question, but because window functions reflect how real analytics work is done. Understanding when and how to use them signals that you've written production analytics code, not just LeetCode solutions.
</p>
<p>
The good news: there are four patterns that cover roughly 90% of window function interview questions. Master these four, and you'll handle almost anything an interviewer throws at you.
</p>

<h2>The syntax to know before anything else</h2>
<pre>
SELECT
  column,
  FUNCTION() OVER (
    PARTITION BY partition_column
    ORDER BY order_column
    ROWS/RANGE BETWEEN frame_start AND frame_end
  ) AS alias
FROM table;
</pre>
<p>
The OVER clause is what makes a function a window function. PARTITION BY divides the data into groups (like GROUP BY, but without collapsing rows). ORDER BY determines the sequence within each partition. The ROWS BETWEEN clause defines how large the "window" of rows is.
</p>

<h2>Pattern 1: Ranking</h2>
<p>
<strong>Use case:</strong> "Find the top 3 products by revenue in each category."
</p>
<pre>
SELECT *
FROM (
  SELECT
    category,
    product_name,
    revenue,
    ROW_NUMBER() OVER (
      PARTITION BY category
      ORDER BY revenue DESC
    ) AS rank
  FROM products
) ranked
WHERE rank <= 3;
</pre>
<p>
<strong>When interviewers ask about this, they're also watching:</strong>
</p>
<ul>
  <li>Do you know the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?</li>
  <li>ROW_NUMBER() — unique sequential number, no ties</li>
  <li>RANK() — ties get the same rank, next rank skips (1, 1, 3)</li>
  <li>DENSE_RANK() — ties get the same rank, no gap (1, 1, 2)</li>
</ul>
<p>
The correct choice depends on how you want to handle ties. Always ask the interviewer: "Should tied values share a rank?" If they say yes, use DENSE_RANK(). If you want exactly N results, use ROW_NUMBER().
</p>

<h2>Pattern 2: Running totals and moving averages</h2>
<p>
<strong>Use case:</strong> "Calculate a 7-day rolling average of daily active users."
</p>
<pre>
SELECT
  date,
  dau,
  AVG(dau) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS dau_7day_avg
FROM daily_active_users;
</pre>
<p>
The frame clause ROWS BETWEEN 6 PRECEDING AND CURRENT ROW is what creates the 7-day window (the current row plus the 6 preceding rows). For a simple running total:
</p>
<pre>
SUM(revenue) OVER (
  ORDER BY date
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
) AS cumulative_revenue
</pre>
<p>
<strong>Interviewers often follow up with:</strong> "What's the difference between ROWS and RANGE?" ROWS refers to physical rows. RANGE refers to logical values — if two rows have the same ORDER BY value, RANGE treats them as part of the same window boundary, ROWS does not. For most analytics use cases, ROWS is what you want.
</p>

<h2>Pattern 3: LAG and LEAD for period-over-period comparisons</h2>
<p>
<strong>Use case:</strong> "Calculate week-over-week revenue change for each product."
</p>
<pre>
SELECT
  week,
  product_id,
  revenue,
  LAG(revenue, 1) OVER (
    PARTITION BY product_id
    ORDER BY week
  ) AS prev_week_revenue,
  revenue - LAG(revenue, 1) OVER (
    PARTITION BY product_id
    ORDER BY week
  ) AS wow_change
FROM weekly_revenue;
</pre>
<p>
LAG looks backwards (previous row), LEAD looks forward (next row). Both take an optional offset (default 1) and a default value for when there's no previous/next row.
</p>
<p>
<strong>Common interview extension:</strong> "How would you calculate the percentage change?" Add a CASE statement to handle division by zero:
</p>
<pre>
CASE
  WHEN LAG(revenue) OVER (...) = 0 THEN NULL
  ELSE (revenue - LAG(revenue) OVER (...)) / LAG(revenue) OVER (...) * 100
END AS wow_pct_change
</pre>

<h2>Pattern 4: Cohort retention analysis</h2>
<p>
Retention analysis is the most complex window function pattern — and the most impressive to demonstrate in an interview.
</p>
<p>
<strong>Use case:</strong> "Calculate 30-day retention for each weekly signup cohort."
</p>
<pre>
WITH first_activity AS (
  SELECT
    user_id,
    MIN(DATE_TRUNC('week', activity_date)) AS cohort_week
  FROM user_activity
  GROUP BY user_id
),
cohort_activity AS (
  SELECT
    f.user_id,
    f.cohort_week,
    DATEDIFF(a.activity_date, f.cohort_week) AS days_since_signup
  FROM first_activity f
  JOIN user_activity a ON f.user_id = a.user_id
)
SELECT
  cohort_week,
  COUNT(DISTINCT CASE WHEN days_since_signup = 0 THEN user_id END) AS cohort_size,
  COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 28 AND 35 THEN user_id END) AS retained_30d,
  COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 28 AND 35 THEN user_id END) * 1.0 /
    COUNT(DISTINCT CASE WHEN days_since_signup = 0 THEN user_id END) AS retention_rate_30d
FROM cohort_activity
GROUP BY cohort_week
ORDER BY cohort_week;
</pre>
<p>
This pattern tests CTEs, date manipulation, conditional aggregation, and the ability to think through a business problem (what does "30-day retention" actually mean?) rather than just write syntax.
</p>

<h2>How to approach window function questions in interviews</h2>
<ol>
  <li><strong>Clarify the data model first.</strong> Ask: "Is there one row per user per day, or could there be multiple events per user per day?" The answer changes whether you need to deduplicate before windowing.</li>
  <li><strong>Write the PARTITION BY before the function.</strong> Identifying how to partition the data is the hardest conceptual step. Get it right first.</li>
  <li><strong>Validate your logic out loud.</strong> Walk the interviewer through what a small example would produce. "If user A has activity on days 1, 3, and 7, my LAG would give NULL on day 1, day 1 on day 3, and day 3 on day 7..."</li>
  <li><strong>Check for edge cases.</strong> NULL values in the ORDER BY column, users with only one event (LAG returns NULL), date gaps in rolling average windows.</li>
</ol>

<h2>Practising window functions for real interviews</h2>
<p>
The difference between knowing window function syntax and being fluent with it under interview pressure is significant. In a <a href="/interviews/data-analytics">data analyst mock interview</a>, you'll be asked window function questions with follow-ups — "what if there are ties?", "what if a user has no activity in a given week?", "how would this query scale on a 10TB table?" — that require you to reason about the SQL, not just recall it.
</p>
<p>
The best preparation is writing these queries from scratch, out loud, multiple times, with someone watching for the moments where your logic breaks down.
</p>
`,
  author: "CrackJobs Team",
  publishedAt: "2026-03-12",
  tags: ["Data Analytics", "SQL", "Window Functions", "Interview Preparation"],
},

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