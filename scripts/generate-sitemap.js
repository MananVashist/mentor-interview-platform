// scripts/generate-sitemap.js
// Runs automatically as part of the build via postbuild:web.
// Writes sitemap.xml to the project root, where copy-static-files.js
// picks it up and copies it into dist/.
//
// Requires SUPABASE_SERVICE_ROLE_KEY to include mentor profile pages.
// If the env var is missing, the build still succeeds — mentor pages
// are just omitted from the sitemap for that build.

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env from project root if present (local builds)
// Falls back to manual parsing if dotenv is not installed
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  try {
    require('dotenv').config({ path: envPath });
  } catch {
    // dotenv not installed — parse .env manually
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    });
  }
}

const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TODAY = new Date().toISOString().split('T')[0];

// Write sitemap.xml to project root (one level up from scripts/)
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

// ── Static pages ──────────────────────────────────────────────────────────────
const STATIC_PAGES = [
  { loc: 'https://crackjobs.com/',                                                          lastmod: TODAY,        changefreq: 'weekly',  priority: '1.0'  },
  { loc: 'https://crackjobs.com/auth/sign-up',                                             lastmod: '2026-02-16', changefreq: 'monthly', priority: '0.9'  },
  { loc: 'https://crackjobs.com/auth/sign-in',                                             lastmod: '2026-02-16', changefreq: 'monthly', priority: '0.8'  },
  { loc: 'https://crackjobs.com/interviews/product-management',                            lastmod: TODAY,        changefreq: 'weekly',  priority: '0.95' },
  { loc: 'https://crackjobs.com/interviews/data-analytics',                                lastmod: TODAY,        changefreq: 'weekly',  priority: '0.95' },
  { loc: 'https://crackjobs.com/interviews/data-science',                                  lastmod: TODAY,        changefreq: 'weekly',  priority: '0.95' },
  { loc: 'https://crackjobs.com/interviews/hr',                                            lastmod: TODAY,        changefreq: 'weekly',  priority: '0.95' },
  { loc: 'https://crackjobs.com/mentors',                                                  lastmod: TODAY,        changefreq: 'daily',   priority: '0.9'  },
  { loc: 'https://crackjobs.com/blog',                                                     lastmod: TODAY,        changefreq: 'weekly',  priority: '0.8'  },
  { loc: 'https://crackjobs.com/blog/sql-interview-mistakes-data-analysts',                lastmod: '2025-01-10', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/blog/machine-learning-interview-mistakes-data-scientists', lastmod: '2025-01-15', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/blog/hr-interview-mistakes-talent-acquisition',            lastmod: '2025-01-18', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/blog/product-manager-interview-execution-mistakes',        lastmod: '2025-01-20', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/blog/product-manager-interview-product-sense-mistakes',    lastmod: '2025-01-22', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/blog/aarm-framework-product-management-interviews',        lastmod: '2026-02-10', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/blog/data-analyst-mock-interview-guide',                   lastmod: '2026-02-18', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/blog/how-to-prepare-for-pm-mock-interview',                lastmod: '2026-02-25', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/blog/ml-debugging-interview-guide',                        lastmod: '2026-03-05', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/blog/sql-window-functions-interview-guide',                lastmod: '2026-03-12', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/how-it-works',                                             lastmod: '2026-02-16', changefreq: 'monthly', priority: '0.7'  },
  { loc: 'https://crackjobs.com/about',                                                    lastmod: '2026-02-16', changefreq: 'monthly', priority: '0.6'  },
  { loc: 'https://crackjobs.com/contact',                                                  lastmod: '2026-02-16', changefreq: 'monthly', priority: '0.5'  },
  { loc: 'https://crackjobs.com/faq',                                                      lastmod: '2026-02-16', changefreq: 'monthly', priority: '0.6'  },
  { loc: 'https://crackjobs.com/cancellation-policy',                                      lastmod: '2026-02-16', changefreq: 'monthly', priority: '0.5'  },
  { loc: 'https://crackjobs.com/privacy',                                                  lastmod: '2026-02-16', changefreq: 'yearly',  priority: '0.4'  },
  { loc: 'https://crackjobs.com/terms',                                                    lastmod: '2026-02-16', changefreq: 'yearly',  priority: '0.4'  },
];

// ── Fetch active mentors from Supabase ────────────────────────────────────────
function fetchMentors() {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/rest/v1/mentors?select=id,updated_at&status=eq.approved&order=id`;
    const options = {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse Supabase response: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

// ── Build XML ─────────────────────────────────────────────────────────────────
function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `\t<url>\n\t\t<loc>${loc}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t\t<changefreq>${changefreq}</changefreq>\n\t\t<priority>${priority}</priority>\n\t</url>`;
}

function writeXml(pages) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '',
    ...pages.map(urlEntry),
    '',
    '</urlset>',
  ].join('\n');

  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function generate() {
  if (!SERVICE_ROLE_KEY) {
    console.warn('[generate-sitemap] SUPABASE_SERVICE_ROLE_KEY not set — writing sitemap without mentor pages.');
    writeXml(STATIC_PAGES);
    console.log(`[generate-sitemap] sitemap.xml written — ${STATIC_PAGES.length} URLs (static only)`);
    return;
  }

  console.log('[generate-sitemap] Fetching active mentors from Supabase...');
  const mentors = await fetchMentors();
  console.log(`[generate-sitemap] Found ${mentors.length} active mentors`);

  const mentorEntries = mentors.map(m => ({
    loc: `https://crackjobs.com/mentors/${m.id}`,
    lastmod: m.updated_at ? m.updated_at.split('T')[0] : TODAY,
    changefreq: 'weekly',
    priority: '0.75',
  }));

  const allPages = [...STATIC_PAGES, ...mentorEntries];
  writeXml(allPages);
  console.log(`[generate-sitemap] sitemap.xml written — ${allPages.length} URLs total (${mentorEntries.length} mentor pages)`);
}

generate().catch(err => {
  // Log the error but don't fail the build — a missing sitemap is better
  // than a broken deployment.
  console.error('[generate-sitemap] Error:', err.message);
  console.warn('[generate-sitemap] Writing static-only sitemap as fallback.');
  writeXml(STATIC_PAGES);
});