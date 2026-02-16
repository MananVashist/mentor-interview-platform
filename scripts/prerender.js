// scripts/prerender.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');

// --- SUPABASE CONFIG (Taken from mentors.tsx) ---
const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

console.log('🚀 Starting pre-rendering with Puppeteer...\n');

const distPath = path.join(__dirname, '..', 'dist');

// Sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if dist exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found. Run expo export first.');
  process.exit(1);
}

// 1. Static Routes
const staticRoutes = [
  '/',
  '/how-it-works',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/cancellation-policy',
  '/auth/sign-up',
  '/auth/sign-in',
  '/mentors', // The main list page
  '/interviews/hr',
  '/interviews/product-management',
  '/interviews/data-analytics',
  '/interviews/data-science',
  '/blog',
  '/blog/sql-interview-mistakes-data-analysts',
  '/blog/machine-learning-interview-mistakes-data-scientists',
  '/blog/hr-interview-mistakes-talent-acquisition',
  '/blog/product-manager-interview-execution-mistakes',
  '/blog/product-manager-interview-product-sense-mistakes',
];

function isRecoverablePuppeteerError(err) {
  const msg = err?.message || String(err);
  return (
    msg.includes('Target.createTarget') ||
    msg.includes('Session with given id not found') ||
    msg.includes('Target closed') ||
    msg.includes('Protocol error') ||
    msg.includes('browser has disconnected') ||
    msg.includes('Browser has disconnected')
  );
}

async function launchBrowser() {
  return puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
      '--disable-features=site-per-process',
      '--js-flags=--max-old-space-size=2048',
    ],
  });
}

// --- HELPER: Fetch Mentor IDs ---
async function fetchMentorRoutes() {
  try {
    console.log('⏳ Fetching mentor IDs from Supabase...');
    // Note: Fetch is available natively in Node 18+. If on older Node, use node-fetch.
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/mentors?select=id&status=eq.approved`,
      { 
        headers: { 
          apikey: SUPABASE_ANON_KEY, 
          Authorization: `Bearer ${SUPABASE_ANON_KEY}` 
        } 
      }
    );
    
    if (!response.ok) {
        throw new Error(`Supabase error: ${response.statusText}`);
    }

    const data = await response.json();
    const mentorRoutes = data.map(m => `/mentors/${m.id}`);
    console.log(`✅ Found ${mentorRoutes.length} approved mentors.`);
    return mentorRoutes;
  } catch (error) {
    console.error('⚠️ Failed to fetch mentors:', error.message);
    return []; // Return empty if fetch fails so build doesn't crash completely
  }
}

(async () => {
  // 2. Fetch Dynamic Routes before starting server
  const mentorRoutes = await fetchMentorRoutes();
  const routes = [...staticRoutes, ...mentorRoutes];

  // Start local server
  const server = http.createServer((request, response) =>
    handler(request, response, {
      public: distPath,
      cleanUrls: true,
      trailingSlash: false,
    })
  );

  const PORT = 45678;
  server.listen(PORT);
  console.log(`✅ Local server started on http://localhost:${PORT}\n`);

  let browser = await launchBrowser();

  console.log(`📄 Pre-rendering ${routes.length} pages.\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    const url = `http://localhost:${PORT}${route}`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      let page = null;

      try {
        page = await browser.newPage();

        await page.setViewport({ width: 1366, height: 768 });

        // Block heavy assets
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const type = req.resourceType();
          if (type === 'image' || type === 'media' || type === 'font') {
            return req.abort();
          }
          req.continue();
        });

        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 120000,
        });

        // Small delay to ensure data loading completes
        await sleep(4000);

        const html = await page.content();

        let outputPath;
        if (route === '/') {
          outputPath = path.join(distPath, 'index.html');
        } else {
          // Remove leading slash for path.join
          const relativeRoute = route.startsWith('/') ? route.slice(1) : route;
          const routePath = path.join(distPath, relativeRoute);
          
          if (!fs.existsSync(routePath)) {
            fs.mkdirSync(routePath, { recursive: true });
          }
          outputPath = path.join(routePath, 'index.html');
        }

        fs.writeFileSync(outputPath, html);
        console.log(`✅ ${route}`);
        successCount++;
        break;

      } catch (err) {
        if (attempt === 1 && isRecoverablePuppeteerError(err)) {
          try { await browser.close(); } catch {}
          browser = await launchBrowser();
          continue;
        }

        console.error(`❌ ${route}: ${err.message}`);
        errorCount++;
        break;

      } finally {
        if (page) {
          await page.close().catch(() => {});
        }
      }
    }
  }

  try { await browser.close(); } catch {}
  server.close();

  console.log(`\n✨ Pre-rendering complete!`);
  console.log(`   ✅ ${successCount} pages rendered successfully`);
  if (errorCount > 0) {
    console.log(`   ❌ ${errorCount} pages failed`);
  }
  console.log('');

  process.exit(errorCount > 0 ? 1 : 0);
})();