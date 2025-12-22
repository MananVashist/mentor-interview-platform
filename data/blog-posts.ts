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
    slug: "talent-acquisition-guide",
    title: "Talent Acquisition Explained: A Technical Guide to Modern TA Functions (2025)",
    excerpt: "Beyond generic definitions: Learn the strategic TA framework that interviewers actually test. Covers workforce planning, metrics, and stakeholder management for senior HR interviews.",
    author: "CrackJobs Team",
    publishedAt: "2024-12-22",
    thumbnailUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800", // HR/recruitment teamwork
    tags: ["HR", "Talent Acquisition", "Interview Prep"],
    content: `
    <h1>Talent Acquisition Explained: A Technical Guide to Modern TA Functions (2025)</h1>
    
    <p><em>By CrackJobs Team | 12 min read</em></p>
    
    <p>When people search for "Talent Acquisition roles and responsibilities" or "what does a Talent Acquisition professional do", they usually find generic definitions.</p>
    
    <p>But in real interviews—and real organisations—Talent Acquisition (TA) is a technical HR function, not just hiring coordination.</p>
    
    <p>This guide breaks down Talent Acquisition as a system, covering:</p>
    
    <ul>
      <li>Core Talent Acquisition responsibilities</li>
      <li>Key TA processes and frameworks</li>
      <li>Metrics interviewers actually care about</li>
      <li>How TA is evaluated in senior HR interviews</li>
    </ul>
    
    <p>If you're preparing for Talent Acquisition interviews, this is the depth interviewers expect.</p>
    
    <h2>What Is Talent Acquisition? (Beyond Recruitment)</h2>
    
    <p>Talent Acquisition is a long-term, strategic HR function focused on building sustainable talent pipelines aligned with business goals.</p>
    
    <p>Unlike recruitment, which is transactional, TA involves:</p>
    
    <ul>
      <li>Workforce planning</li>
      <li>Capability forecasting</li>
      <li>Hiring manager calibration</li>
      <li>Interview design</li>
      <li>Quality-of-hire optimization</li>
    </ul>
    
    <h3>Talent Acquisition vs Recruitment</h3>
    
    <table>
      <thead>
        <tr>
          <th>Recruitment</th>
          <th>Talent Acquisition</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Short-term hiring</td>
          <td>Long-term workforce strategy</td>
        </tr>
        <tr>
          <td>Role-based</td>
          <td>Capability-based</td>
        </tr>
        <tr>
          <td>Speed-focused</td>
          <td>Quality and retention focused</td>
        </tr>
        <tr>
          <td>Reactive</td>
          <td>Proactive</td>
        </tr>
      </tbody>
    </table>
    
    <p><strong>Interview insight:</strong> Candidates who fail TA interviews usually treat Talent Acquisition as execution, not strategy.</p>
    
    <h2>Core Talent Acquisition Functions</h2>
    
    <h3>1. Workforce Planning & Demand Forecasting</h3>
    
    <p>Workforce planning is the foundation of any strong Talent Acquisition strategy.</p>
    
    <p>TA teams work with:</p>
    
    <ul>
      <li>Business growth forecasts</li>
      <li>Attrition and backfill data</li>
      <li>Skill gap analysis</li>
      <li>Time-to-productivity benchmarks</li>
    </ul>
    
    <p><strong>Common interview question:</strong> "How do you plan hiring when headcount visibility is unclear?"</p>
    
    <p><strong>What interviewers expect:</strong></p>
    
    <ul>
      <li>Hiring against capabilities, not just open requisitions</li>
      <li>Scenario-based planning (best / worst case)</li>
      <li>Prioritization under uncertainty</li>
    </ul>
    
    <h3>2. Job Description & Role Design</h3>
    
    <p>A poorly designed role leads to:</p>
    
    <ul>
      <li>Low-quality applicants</li>
      <li>Interview confusion</li>
      <li>High early attrition</li>
    </ul>
    
    <p>A technical Talent Acquisition professional:</p>
    
    <ul>
      <li>Separates must-have skills from trainable skills</li>
      <li>Defines success metrics upfront</li>
      <li>Avoids inflated or generic job descriptions</li>
    </ul>
    
    <p><strong>Example:</strong> Instead of "strong communication skills," define: "Ability to deliver decision-ready insights to stakeholders"</p>
    
    <h3>3. Sourcing Strategy & Talent Pipelines</h3>
    
    <p>Sourcing is not about channels—it's about signal quality.</p>
    
    <p>Strong TA sourcing strategies include:</p>
    
    <ul>
      <li>Passive vs active candidate mapping</li>
      <li>Skill adjacency hiring</li>
      <li>Community and referral pipelines</li>
      <li>Source-to-quality tracking</li>
    </ul>
    
    <p><strong>Advanced TA metric:</strong> Source-to-quality-of-hire ratio</p>
    
    <p>Interviewers look for candidates who understand why certain sources produce better hires, not just where candidates came from.</p>
    
    <h3>4. Interview Process Design & Evaluation Frameworks</h3>
    
    <p>One of the most technical Talent Acquisition responsibilities is interview design.</p>
    
    <p>Common hiring failures occur due to:</p>
    
    <ul>
      <li>Too many interview rounds</li>
      <li>Overlapping evaluation criteria</li>
      <li>Lack of interviewer calibration</li>
    </ul>
    
    <p>A strong TA framework:</p>
    
    <ul>
      <li>Maps each interview round to a specific signal</li>
      <li>Uses structured evaluation rubrics</li>
      <li>Eliminates redundancy</li>
    </ul>
    
    <p><strong>Example interview structure:</strong></p>
    
    <table>
      <thead>
        <tr>
          <th>Round</th>
          <th>Signal Evaluated</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Round 1</td>
          <td>Problem-solving approach</td>
        </tr>
        <tr>
          <td>Round 2</td>
          <td>Role depth & execution</td>
        </tr>
        <tr>
          <td>Round 3</td>
          <td>Stakeholder judgment</td>
        </tr>
      </tbody>
    </table>
    
    <h3>5. Hiring Manager Alignment & Stakeholder Management</h3>
    
    <p>Hiring manager calibration is one of the most critical Talent Acquisition skills.</p>
    
    <p>TA professionals must:</p>
    
    <ul>
      <li>Push back on vague feedback</li>
      <li>Identify rejection patterns</li>
      <li>Reset expectations using data</li>
    </ul>
    
    <p><strong>Typical TA interview question:</strong> "How do you handle a hiring manager who keeps rejecting candidates?"</p>
    
    <p><strong>Strong answer includes:</strong></p>
    
    <ul>
      <li>Pattern recognition</li>
      <li>Evidence-based feedback</li>
      <li>Escalation using hiring data, not opinions</li>
    </ul>
    
    <h3>6. Offer Management & Candidate Closure</h3>
    
    <p>Offer management is risk mitigation, not persuasion.</p>
    
    <p>TA teams evaluate:</p>
    
    <ul>
      <li>Compensation band flexibility</li>
      <li>Internal parity vs urgency</li>
      <li>Counter-offer likelihood</li>
      <li>Candidate motivation drivers</li>
    </ul>
    
    <p>Well-designed closure strategies reduce:</p>
    
    <ul>
      <li>Offer drop-offs</li>
      <li>Renegotiations</li>
      <li>Early exits post-joining</li>
    </ul>
    
    <h2>Key Talent Acquisition Metrics That Matter</h2>
    
    <p>Vanity metrics don't impress interviewers.</p>
    
    <p>Real Talent Acquisition KPIs include:</p>
    
    <ul>
      <li>Time to productivity</li>
      <li>Quality of hire (6–12 months)</li>
      <li>Interview-to-offer ratio</li>
      <li>Early attrition rate</li>
      <li>Hiring manager satisfaction (with data)</li>
    </ul>
    
    <p><strong>Interview tip:</strong> Always explain why a metric matters—not just what it measures.</p>
    
    <h2>Why Talent Acquisition Interviews Are Hard</h2>
    
    <p>TA interviews test:</p>
    
    <ul>
      <li>Judgment under ambiguity</li>
      <li>Stakeholder conflict handling</li>
      <li>Trade-off decision-making</li>
    </ul>
    
    <p>These skills cannot be memorised or scripted.</p>
    
    <p>This is why candidates who rely only on:</p>
    
    <ul>
      <li>HR theory</li>
      <li>Online courses</li>
      <li>Generic interview answers</li>
    </ul>
    
    <p>often struggle in real interviews.</p>
    
    <h2>Final Thoughts: Talent Acquisition as a Strategic HR Function</h2>
    
    <p>Talent Acquisition plays a defining role in how organisations grow, execute, and sustain performance over time. When Talent Acquisition is treated as a transactional support function, the result is often misaligned hires, early attrition, and constant firefighting. When it is treated as a strategic HR function, it becomes a competitive advantage.</p>
    
    <p>Senior Talent Acquisition professionals are expected to think in systems, not requisitions. They must balance speed with quality, advocate for long-term capability building, and make judgment calls under ambiguity. Being able to clearly explain Talent Acquisition as a structured, end-to-end system is often what separates strong candidates from average ones in senior HR interviews.</p>
    
    <h2>Preparing for Talent Acquisition Interviews?</h2>
    
    <p>At CrackJobs, candidates practice real Talent Acquisition interview scenarios with experienced HR leaders—under real interview pressure, with structured feedback.</p>
    
    <p>Because Talent Acquisition interviews are less about recalling frameworks and more about demonstrating judgment developed through experience.</p>
    
    <p><strong><a href="https://crackjobs.com/">Book a Talent Acquisition Mock Interview on CrackJobs</a></strong></p>
    `
  },
  {
    slug: "pm-technical-interviews-guide",
    title: "The PM's Guide to Technical Interviews: Think Like a Partner, Not a Pseudo-Engineer",
    excerpt: "Master PM technical interviews with this 5-step framework. Learn why depth matters less than trade-offs, and why over-answering kills your chances.",
    author: "CrackJobs Team",
    publishedAt: "2024-12-18",
    thumbnailUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800", // Technical teamwork image
    tags: ["PM", "Technical Interviews", "Interview Prep"],
    content: `
    <h1>The PM's Guide to Technical Interviews: Think Like a Partner, Not a Pseudo-Engineer</h1>
    
    <p><em>By CrackJobs Team | 8 Min Read</em></p>
    
    <p>Getting nervous before you give technical interviews as a PM? Let us break it down for you.</p>
    
    <p>Technical interviews for Product Managers are not about writing code or explaining how threads are scheduled. They're about showing you can <strong>collaborate with engineers</strong>, <strong>make smart trade-offs</strong>, and <strong>communicate clearly</strong> without pretending to be a backend engineer.</p>
    
    <p>Here's the 5-step framework that works.</p>
    
    <h2>First, Clarify the Intent of the Question</h2>
    
    <p>Before answering, ask yourself (or out loud):</p>
    
    <ul>
      <li>"Is the interviewer testing depth, trade-offs, or collaboration?"</li>
    </ul>
    
    <p>Most PM technical questions are not about correctness. They're about:</p>
    
    <ul>
      <li>Can you reason with engineers?</li>
      <li>Can you make trade-offs under constraints?</li>
      <li>Can you communicate clearly with engineers without pretending to be one?</li>
    </ul>
    
    <p>Understanding the intent helps you calibrate your answer. Don't go deep if they're testing breadth. Don't stay surface-level if they want trade-offs.</p>
    
    <h2>Secondly, Frame the System Before Diving In</h2>
    
    <p>Always start with a high-level system view:</p>
    
    <blockquote>
      <p>"At a high level, this system has 4 parts…"</p>
    </blockquote>
    
    <p><strong>Example:</strong></p>
    
    <ol>
      <li>Client (mobile/web)</li>
      <li>API layer</li>
      <li>Core services</li>
      <li>Data stores</li>
    </ol>
    
    <p>This instantly shows <strong>structured thinking</strong> and prevents rambling. It also gives the interviewer a roadmap of where you're going.</p>
    
    <p>Without framing, you'll jump between components randomly, and the interviewer will lose track of your thought process.</p>
    
    <h2>Thirdly, Go One Layer Deep — Not Five</h2>
    
    <p>A good rule of thumb:</p>
    
    <p><strong>👉 Depth = 1 layer deeper than a non-PM</strong><br>
    <strong>👉 Shallower than a backend engineer</strong></p>
    
    <p><strong>Example:</strong></p>
    
    <ul>
      <li>✅ Say <em>why</em> you'd use async processing</li>
      <li>❌ Don't explain <em>how</em> threads are scheduled</li>
    </ul>
    
    <p>You're not here to prove you can code. You're here to prove you can:</p>
    
    <ul>
      <li>Identify the right technical approach</li>
      <li>Understand implications for the product</li>
      <li>Communicate with engineers respectfully</li>
    </ul>
    
    <p>Going too deep makes you look like you're overcompensating. Going too shallow makes you look unprepared.</p>
    
    <h2>Fourthly, Call Out Trade-Offs Explicitly (This Is the Cheat Code)</h2>
    
    <p>Every strong PM answer includes trade-offs:</p>
    
    <ul>
      <li>Latency vs consistency</li>
      <li>Speed vs reliability</li>
      <li>Cost vs scalability</li>
    </ul>
    
    <p>Even if your design isn't perfect, <strong>explicit trade-offs save you</strong>.</p>
    
    <p><strong>Interviewers care more about how you choose than what you choose.</strong></p>
    
    <p><strong>Example:</strong></p>
    
    <blockquote>
      <p>"We could cache this data for faster response times, but that introduces eventual consistency issues. Given that our users prioritize speed over real-time accuracy in this context, I'd opt for caching with a 5-minute TTL."</p>
    </blockquote>
    
    <p>See what happened there? You:</p>
    
    <ol>
      <li>Named the trade-off</li>
      <li>Explained the constraint</li>
      <li>Made a decision</li>
      <li>Justified it with user needs</li>
    </ol>
    
    <p>This is <strong>PM thinking</strong>, not engineering thinking.</p>
    
    <h2>And Lastly, Know When to Stop</h2>
    
    <p>The best ending line in a PM technical answer:</p>
    
    <blockquote>
      <p>"At this stage, I'd validate this with engineering before going deeper."</p>
    </blockquote>
    
    <p>This shows:</p>
    
    <ul>
      <li>Collaboration</li>
      <li>Self-awareness</li>
      <li>Real-world PM behavior</li>
    </ul>
    
    <p>You're not expected to have all the answers. You're expected to know <em>who</em> to ask and <em>when</em> to ask them.</p>
    
    <h2>TL;DR for PM Technical Interviews</h2>
    
    <ul>
      <li><strong>Structure first</strong> — Frame the system before diving in</li>
      <li><strong>One-layer depth</strong> — Deeper than a non-PM, shallower than an engineer</li>
      <li><strong>Trade-offs > details</strong> — Explicit trade-offs are your cheat code</li>
      <li><strong>Think like a partner, not a pseudo-engineer</strong> — Know when to collaborate</li>
    </ul>
    
    <h2>The Real Problem: Over-Answering</h2>
    
    <p>If you're a PM preparing for interviews, <strong>practice saying less — but better</strong>.</p>
    
    <p>We've seen great PMs fail interviews because they over-answered. And average PMs clear them because they <strong>framed the problem right</strong>.</p>
    
    <p>The technical interview is not a test of how much you know. It's a test of how you <strong>think</strong>, how you <strong>prioritize</strong>, and how you <strong>communicate</strong>.</p>
    
    <p>Don't let nerves push you into rambling mode. Structure your answer, go one layer deep, call out trade-offs, and know when to stop.</p>
    
    <p><strong>Ready to practice with real PMs who've been on both sides of the table? <a href="https://crackjobs.com/">Book a Technical Mock Interview on Crackjobs</a></strong></p>
    `
  },
  {
    slug: "cracking-pm-case-study",
  title: "Cracking the PM Case Study: How to \"Design X\" Without Getting Lost",
  excerpt: "Learn the proven framework for acing product design interviews. Avoid the #1 mistake candidates make and discover why practicing alone is dangerous.",
  author: "CrackJobs Team",
  publishedAt: "2024-12-02",
  thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800", // PM interview image
  tags: ["PM", "Interview Prep", "Case Study"],
  content: `
    <h1>Cracking the PM Case Study: How to "Design X" Without Getting Lost</h1>
    
    <p><em>By CrackJobs Team | 12 Min Read</em></p>
    
    <p>"Design a vending machine for astronauts." "How would you improve Spotify's retention?" "Should Google enter the ride-sharing market?"</p>
    
    <p>If you are applying for a Product Manager (PM) role, you know these questions. Unlike coding interviews, where the code either runs or it doesn't, PM interviews are ambiguous. There is no single right answer, but there are definitely wrong ways to get there.</p>
    
    <p>The <strong>Product Sense</strong> (or Product Design) round is the "make or break" moment for aspiring PMs. It tests your product thinking, your user empathy, and your ability to structure chaos.</p>
    
    <p>Here is how to approach the dreaded Case Study interview and why practicing alone is dangerous.</p>
    
    <h2>The Trap: Jumping to Solutions</h2>
    
    <p>The #1 mistake candidates make in mock interviews on <strong>Crackjobs</strong> is the "Feature Vomit."</p>
    
    <p><strong>Interviewer:</strong> "Design a better experience for finding a roommate."</p>
    <p><strong>Candidate:</strong> "Okay! So, we build an app with a Tinder-like swipe feature, and then we add AI to match personalities, and maybe a video intro feature..."</p>
    
    <p><strong>The Verdict:</strong> Fail.</p>
    
    <p>Senior PMs don't hire idea generators; they hire problem solvers. By jumping straight to features, you proved you don't care about <em>who</em> the user is or <em>what</em> their actual problem is.</p>
    
    <h2>The Framework: Structure Is Your Safety Net</h2>
    
    <p>To survive the ambiguity, you need a framework. The most popular is <strong>CIRCLES</strong>, but you can adapt it. The key is moving step-by-step.</p>
    
    <h3>1. Clarify the Goal</h3>
    
    <p>Never start without asking questions.</p>
    
    <ul>
      <li><em>"Is our goal to increase revenue, engagement, or user acquisition?"</em></li>
      <li><em>"Are we constrained by budget or technology?"</em></li>
    </ul>
    
    <h3>2. Define the User (The "Who")</h3>
    
    <p>You cannot build for everyone. Pick a specific segment.</p>
    
    <ul>
      <li><em>Example:</em> If designing an alarm clock for the blind, are we targeting the elderly (who need simplicity) or tech-savvy professionals (who want integrations)?</li>
    </ul>
    
    <h3>3. Identify Pain Points (The "Why")</h3>
    
    <p>This is where you show empathy. What sucks about the current experience for that specific user?</p>
    
    <ul>
      <li><em>Pain Point:</em> "It's hard for blind users to know if they set the alarm for AM or PM."</li>
    </ul>
    
    <h3>4. Brainstorm Solutions (The "What")</h3>
    
    <p>Now—and only now—can you suggest features. Go wide. Be creative. Then, prioritize <em>one</em> solution based on impact vs. effort.</p>
    
    <h3>5. Define Success Metrics</h3>
    
    <p>How will you know if it worked?</p>
    
    <ul>
      <li><em>North Star Metric:</em> "Percentage of users who successfully wake up on time."</li>
      <li><em>Counter Metric:</em> "Battery usage" (Did our cool feature drain the battery?)</li>
    </ul>
    
    <h2>The "Rambling" Problem</h2>
    
    <p>In a 45-minute interview, time management is a skill. Many candidates get stuck on the "User Persona" section for 15 minutes and have 2 minutes left for the actual solution.</p>
    
    <p>This is a communication red flag. A Product Manager must lead meetings efficiently. If you can't manage the time in your interview, how can you manage a roadmap?</p>
    
    <h2>Why You Can't Practice Case Studies Alone</h2>
    
    <p>You can practice SQL queries alone. You can practice Excel formulas alone. <strong>You cannot practice Product Sense alone.</strong></p>
    
    <p>When you practice in front of a mirror, you always agree with your own ideas. You don't hear:</p>
    
    <ul>
      <li><em>"Your user segment was too broad."</em></li>
      <li><em>"You didn't tie your solution back to the business goal."</em></li>
      <li><em>"You sounded defensive when I questioned your prioritization."</em></li>
    </ul>
    
    <h2>The Value of a Verified PM Mentor</h2>
    
    <p>On <strong>Crackjobs</strong>, you can roleplay these scenarios with mentors who are actual PMs at companies like Uber, Airbnb, and Microsoft.</p>
    
    <p>They act as the "skeptical stakeholder." They will interrupt you. They will throw curveballs (e.g., <em>"Oh wait, the CEO just cut the budget by half. Now what?"</em>).</p>
    
    <p>This pressure tests your <strong>Product Execution</strong> skills—your ability to stay calm and pivot when requirements change.</p>
    
    <h2>Conclusion: It's Not About the Idea, It's About the Journey</h2>
    
    <p>Recruiters don't care if your "Vending Machine for Astronauts" idea is actually feasible. They care about:</p>
    
    <ol>
      <li>Did you structure your thoughts?</li>
      <li>Did you show empathy for the user?</li>
      <li>Did you communicate clearly?</li>
    </ol>
    
    <p>Don't let your first attempt at a case study be in front of a hiring manager.</p>
    
    <p><strong>Sharpen your product sense before the big day. <a href="https://crackjobs.com/">Book a PM Mock Interview on Crackjobs</a></strong></p>
    `
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