// scripts/prerender.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');

console.log('🚀 Starting pre-rendering with Puppeteer...\n');

const distPath = path.join(__dirname, '..', 'dist');

// Check if dist exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found. Run expo export first.');
  process.exit(1);
}

// All routes to pre-render
const routes = [
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
  '/interviews/hr',
  '/interviews/product-management',
  '/interviews/data-analytics',
  '/interviews/data-science',
  '/blog',
  '/blog/sql-interview-mistakes-data-analysts',
  '/blog/machine-learning-interview-mistakes-data-scientists',
  '/blog/hr-interview-mistakes-talent-acquisition',
  '/blog/product-manager-interview-execution-mistakes',
  '/blog/product-manager-interview-product-sense-mistakes'
];

(async () => {
  // Start local server
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: distPath,
      cleanUrls: true,
      trailingSlash: false
    });
  });

  const PORT = 45678;
  server.listen(PORT);
  console.log(`✅ Local server started on http://localhost:${PORT}\n`);

  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  console.log(`📄 Pre-rendering ${routes.length} pages...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    try {
      const page = await browser.newPage();
      
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Navigate to page
      const url = `http://localhost:${PORT}${route}`;
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // Wait for content to render (modern way)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get rendered HTML
      const html = await page.content();
      
      // Determine output path
      let outputPath;
      if (route === '/') {
        outputPath = path.join(distPath, 'index.html');
      } else {
        const routePath = path.join(distPath, route);
        if (!fs.existsSync(routePath)) {
          fs.mkdirSync(routePath, { recursive: true });
        }
        outputPath = path.join(routePath, 'index.html');
      }
      
      // Write the rendered HTML
      fs.writeFileSync(outputPath, html);
      console.log(`✅ ${route}`);
      successCount++;
      
      await page.close();
      
    } catch (err) {
      console.error(`❌ ${route}: ${err.message}`);
      errorCount++;
    }
  }

  // Clean up
  await browser.close();
  server.close();

  // Summary
  console.log(`\n✨ Pre-rendering complete!`);
  console.log(`   ✅ ${successCount} pages rendered successfully`);
  if (errorCount > 0) {
    console.log(`   ❌ ${errorCount} pages failed`);
  }
  console.log('');
  
  process.exit(errorCount > 0 ? 1 : 0);
})();