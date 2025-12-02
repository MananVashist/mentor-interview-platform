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