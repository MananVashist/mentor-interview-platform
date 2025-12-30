/**
 * Post-build script to copy static files from public/ to dist/
 * This ensures robots.txt, sitemap.xml, and other static assets are accessible
 * in the Cloudflare Pages deployment
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');
const rootDir = path.join(__dirname, '..');

// Files to copy from public to dist
const filesToCopy = [
  'robots.txt',
  'sitemap.xml',
  'hero.webp',
  '_headers', // Cloudflare Pages headers file
  '_routes.json' // Cloudflare Pages routing configuration
];

// Files to copy from root to dist (for Cloudflare Pages configuration)
const rootFilesToCopy = [
  '_redirects' // SPA fallback routing for dynamic routes
];

console.log('📦 Copying public files to dist...\n');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist directory not found!');
  console.error('   Make sure "expo export --platform web" ran successfully before this script.');
  process.exit(1);
}

// Copy files from public/ directory
let successCount = 0;
let skipCount = 0;

filesToCopy.forEach((fileName) => {
  const sourcePath = path.join(publicDir, fileName);
  const destPath = path.join(distDir, fileName);

  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied: ${fileName} (from public/)`);
      successCount++;
    } else {
      console.log(`⏭️  Skipped: ${fileName} (not found in public/)`);
      skipCount++;
    }
  } catch (error) {
    console.error(`❌ Error copying ${fileName}:`, error.message);
    process.exit(1);
  }
});

// Copy files from root directory
rootFilesToCopy.forEach((fileName) => {
  const sourcePath = path.join(rootDir, fileName);
  const destPath = path.join(distDir, fileName);

  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied: ${fileName} (from root)`);
      successCount++;
    } else {
      console.log(`⏭️  Skipped: ${fileName} (not found in root)`);
      skipCount++;
    }
  } catch (error) {
    console.error(`❌ Error copying ${fileName}:`, error.message);
    process.exit(1);
  }
});

console.log(`\n✨ Done! Copied ${successCount} file(s) to dist/`);
if (skipCount > 0) {
  console.log(`   Skipped ${skipCount} file(s) (not found)`);
}
console.log('\n🚀 Ready for deployment!\n');