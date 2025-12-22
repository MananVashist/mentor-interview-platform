const fs = require('fs');
const path = require('path');

// Import your actual SEO config
// For now, I'll inline it - you can import from your config file later
const SEO_CONFIG = {
  home: {
    title: 'CrackJobs | Anonymous Mock Interviews with Real Professionals',
    description: 'Practice interview topics anonymously with fully vetted expert mentors across Product Management, Data Analytics, Data Science and HR. Get structured feedback and ace your next interview.',
    canonical: 'https://crackjobs.com/',
    ogImage: 'https://crackjobs.com/og-image.png'
  },
  howItWorks: {
    title: 'How It Works | Anonymous Mock Interview Platform - CrackJobs',
    description: 'Learn how CrackJobs connects you with expert mentors for anonymous mock interviews. Book a session, practice, and get detailed feedback in 4 simple steps.',
    canonical: 'https://crackjobs.com/how-it-works',
    ogImage: 'https://crackjobs.com/og-image.png'
  },
  about: {
    title: 'About CrackJobs | Mission to Democratize Interview Preparation',
    description: 'Learn about CrackJobs mission to make quality interview preparation accessible to everyone through anonymous, affordable mock interviews with industry professionals.',
    canonical: 'https://crackjobs.com/about',
    ogImage: 'https://crackjobs.com/og-image.png'
  },
  contact: {
    title: 'Contact Us | Get Help with Your Interview Preparation - CrackJobs',
    description: 'Have questions about mock interviews, mentors, or bookings? Contact the CrackJobs team for support.',
    canonical: 'https://crackjobs.com/contact',
    ogImage: 'https://crackjobs.com/og-image.png'
  },
  faq: {
    title: 'Frequently Asked Questions | CrackJobs Mock Interviews',
    description: 'Get answers to common questions about booking mock interviews, mentor qualifications, pricing, anonymity, and feedback on CrackJobs.',
    canonical: 'https://crackjobs.com/faq',
    ogImage: 'https://crackjobs.com/og-image.png'
  },
  privacy: {
    title: 'Privacy Policy | How We Protect Your Data - CrackJobs',
    description: 'Learn how CrackJobs protects your personal information and maintains anonymity during mock interviews.',
    canonical: 'https://crackjobs.com/privacy',
    ogImage: 'https://crackjobs.com/og-image.png'
  },
  terms: {
    title: 'Terms of Service | CrackJobs Platform Agreement',
    description: 'Read the terms and conditions for using the CrackJobs mock interview platform.',
    canonical: 'https://crackjobs.com/terms',
    ogImage: 'https://crackjobs.com/og-image.png'
  },
  cancellation: {
    title: 'Cancellation & Refund Policy | CrackJobs',
    description: 'Understand our cancellation policy, refund terms, and rescheduling options for mock interview sessions.',
    canonical: 'https://crackjobs.com/cancellation-policy',
    ogImage: 'https://crackjobs.com/og-image.png'
  },
  interviews: {
    hr: {
      title: 'HR Interview Preparation | Practice with Real HR Professionals - CrackJobs',
      description: 'Master HR interviews with anonymous 1:1 mock sessions. Get expert feedback on behavioral questions, culture fit, and situational scenarios from experienced HR professionals at Google, Amazon, and Meta.',
      canonical: 'https://crackjobs.com/interviews/hr',
      ogImage: 'https://crackjobs.com/og-images/hr-interview.png'
    },
    'product-management': {
      title: 'Product Management Interview Prep | PM Mock Interviews - CrackJobs',
      description: 'Ace your PM interviews with practice sessions from Product Managers at Google, Meta, Amazon, and Microsoft. Master product sense, execution, strategy, and case studies with personalized feedback.',
      canonical: 'https://crackjobs.com/interviews/product-management',
      ogImage: 'https://crackjobs.com/og-images/pm-interview.png'
    },
    'data-analytics': {
      title: 'Data Analytics Interview Prep | Practice with Expert Analysts - CrackJobs',
      description: 'Master data analytics interviews with mock sessions covering SQL, Excel, Tableau, Python, and case studies. Learn from analysts at top tech companies and get actionable feedback.',
      canonical: 'https://crackjobs.com/interviews/data-analytics',
      ogImage: 'https://crackjobs.com/og-images/data-analytics-interview.png'
    },
    'data-science': {
      title: 'Data Science Interview Prep | ML & Statistics Mock Interviews - CrackJobs',
      description: 'Prepare for data science interviews with practice sessions covering machine learning, statistics, Python, A/B testing, and take-home assignments. Get expert feedback from data scientists at leading companies.',
      canonical: 'https://crackjobs.com/interviews/data-science',
      ogImage: 'https://crackjobs.com/og-images/data-science-interview.png'
    }
  },
  blog: {
    index: {
      title: 'Interview Preparation Blog | Tips & Insights - CrackJobs',
      description: 'Expert advice on interview preparation, mock interview tips, career guidance, and success stories from candidates who landed their dream jobs.',
      canonical: 'https://crackjobs.com/blog',
      ogImage: 'https://crackjobs.com/og-image.png'
    }
  }
};

// Routes to pre-render - matches sitemap.xml exactly
const routes = [
  { path: '', seo: SEO_CONFIG.home },
  { path: 'how-it-works', seo: SEO_CONFIG.howItWorks },
  { path: 'about', seo: SEO_CONFIG.about },
  { path: 'contact', seo: SEO_CONFIG.contact },
  { path: 'faq', seo: SEO_CONFIG.faq },
  { path: 'privacy', seo: SEO_CONFIG.privacy },
  { path: 'terms', seo: SEO_CONFIG.terms },
  { path: 'cancellation-policy', seo: SEO_CONFIG.cancellation },
  { path: 'interviews/hr', seo: SEO_CONFIG.interviews.hr },
  { path: 'interviews/product-management', seo: SEO_CONFIG.interviews['product-management'] },
  { path: 'interviews/data-analytics', seo: SEO_CONFIG.interviews['data-analytics'] },
  { path: 'interviews/data-science', seo: SEO_CONFIG.interviews['data-science'] },
  { path: 'blog', seo: SEO_CONFIG.blog.index },
];

console.log('\n🚀 Starting static SEO generation...\n');

// Read base HTML
const baseHTMLPath = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(baseHTMLPath)) {
  console.error('❌ Error: dist/index.html not found. Run "npm run build:web" first.');
  process.exit(1);
}

const baseHTML = fs.readFileSync(baseHTMLPath, 'utf-8');

let successCount = 0;
let errorCount = 0;

// Generate static HTML for each route
routes.forEach(route => {
  try {
    const { seo } = route;
    
    // Create directory
    const dirPath = route.path 
      ? path.join(__dirname, '..', 'dist', route.path)
      : path.join(__dirname, '..', 'dist');
    
    if (route.path && !fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Clone HTML
    let html = baseHTML;
    
    // Replace title
    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${seo.title}</title>`
    );
    
    // Remove ALL existing description tags (to avoid duplicates)
    html = html.replace(/<meta name="description" content=".*?">\s*/g, '');
    
    // Remove ALL existing canonical tags (to avoid duplicates)
    html = html.replace(/<link rel="canonical" href=".*?"( \/)?>(\s*)/g, '');
    
    // Remove ALL existing theme-color tags (keep only one from base HTML)
    const themeColorMatches = html.match(/<meta name="theme-color" content=".*?">/g);
    if (themeColorMatches && themeColorMatches.length > 1) {
      // Remove all but first
      html = html.replace(/<meta name="theme-color" content=".*?">/g, function(match) {
        if (this.first) return '';
        this.first = true;
        return match;
      }.bind({}));
    }
    
    // Remove existing OG/Twitter tags to avoid duplicates
    html = html.replace(/<meta property="og:.*?">\s*/g, '');
    html = html.replace(/<meta property="twitter:.*?">\s*/g, '');
    html = html.replace(/<meta name="twitter:.*?">\s*/g, '');
    
    // Google Analytics - inject GA script (always include)
    const gaScript = `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-CWRLH08BSK"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-CWRLH08BSK', {
        page_path: window.location.pathname,
      });
    </script>
    `;
    
    // Add new SEO tags + GA before </head>
    const metaTags = `${gaScript}
    <link rel="canonical" href="${seo.canonical}">
    <meta name="description" content="${seo.description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${seo.canonical}">
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    <meta property="og:image" content="${seo.ogImage}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${seo.canonical}">
    <meta property="twitter:title" content="${seo.title}">
    <meta property="twitter:description" content="${seo.description}">
    <meta property="twitter:image" content="${seo.ogImage}">
  `;
    
    // Insert new meta tags before </head>
    html = html.replace('</head>', `${metaTags}</head>`);
    
    // Write file
    const filePath = route.path 
      ? path.join(dirPath, 'index.html')
      : path.join(__dirname, '..', 'dist', 'index.html');
    
    fs.writeFileSync(filePath, html);
    console.log(`✅ Generated: /${route.path || 'home'}`);
    successCount++;
    
  } catch (error) {
    console.error(`❌ Error generating ${route.path}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Success: ${successCount} pages`);
if (errorCount > 0) {
  console.log(`   ❌ Errors: ${errorCount} pages`);
}
console.log(`\n🎉 Static SEO generation complete!\n`);
console.log(`Next steps:`);
console.log(`1. Test locally: npx http-server dist -p 3000`);
console.log(`2. Check /about/index.html for meta tags`);
console.log(`3. Deploy to Cloudflare Pages\n`);