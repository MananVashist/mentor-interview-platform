import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Head from 'expo-router/head';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font'; 
import { SplashScreen } from '../components/SplashScreen';
import { injectMultipleSchemas } from '@/lib/structured-data';
import { Footer } from '@/components/Footer';
import { BrandHeader } from '@/lib/ui';

// --- COLORS ---
const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';

// System font stack
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

// --- DATA ARRAYS ---
const MENTOR_TIERS = [
  { level: 'Bronze', icon: 'medal-outline', color: '#CD7F32', perks: ['Access to Bronze Badge', 'Community Recognition'] },
  { level: 'Silver', icon: 'medal', color: '#C0C0C0', perks: ['LinkedIn Appreciation Post', 'Access to Silver Badge', 'Priority Support'] },
  { level: 'Gold', icon: 'trophy', color: '#FFD700', perks: ['LinkedIn Appreciation Post', 'Access to Gold Badge', 'Exclusive Community Group'] },
];

const COMPANIES = [
  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png', width: 100 },
  { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/640px-Meta_Platforms_Inc._logo.svg.png', width: 110 },
  { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png', width: 90 },
  { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/640px-Microsoft_logo_%282012%29.svg.png', width: 110 },
  { name: 'Capgemini', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Capgemini_201x_logo.svg/640px-Capgemini_201x_logo.svg.png', width: 120 },
  { name: 'Adobe', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Adobe_Corporate_logo.svg/1200px-Adobe_Corporate_logo.svg.png', width: 120 },
];

const TRACKS = [
  { id: 'pm', title: 'Product Management', description: 'Master product sense, execution, metrics, and strategy interviews.', icon: 'clipboard-flow', iconColor: '#2196F3', skills: ['Product Sense / Design', 'Execution & Analytics', 'Strategy & Market', 'Technical Basics', 'Behavioral & Leadership'] },
  { id: 'data-analytics', title: 'Data & Business Analysis', description: 'Solve business cases with SQL, metrics, and data-driven insights.', icon: 'chart-box', iconColor: '#4CAF50', skills: ['SQL & Querying', 'Case Studies (Data → Insight)', 'Product Metrics', 'Excel / Visualization', 'Stakeholder Comm.'] },
  { id: 'data-science', title: 'Data Science / ML', description: 'Build robust models, scalable ML systems, and debug real-world issues.', icon: 'brain', iconColor: '#FF9800', skills: ['ML Theory & Algos', 'Practical ML Debugging', 'Coding (Python/Pandas)', 'Stats & Experimentation', 'System Design (ML)'] },
  { id: 'hr', title: 'HR & Behavioral', description: 'Ace culture fit, recruitment operations, and situational questions.', icon: 'account-group', iconColor: '#9C27B0', skills: ['Behavioral / Scenarios', 'Recruitment Ops', 'Stakeholder Mgmt', 'Cultural Fit', 'Legal & Compliance'] },
];

// ✨ SEO UPDATE: Updated Title & Description Constants
const SITE_URL = 'https://crackjobs.com';
const SITE_TITLE = 'CrackJobs | Anonymous mock interviews with real experts'; 
const SITE_DESCRIPTION = 'Practice interview topics anonymously with fully vetted expert mentors across Product Management, Data Analytics, Data Science and HR. Get structured feedback and ace your next interview.';

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(Platform.OS !== 'web');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  
  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
  });
  
  // --- ✨ SEO UPDATE: Full Rich Results Schema ---
  useEffect(() => {
    if (Platform.OS === 'web') {
      const schemas = [
        // 1. ORGANIZATION (Brand Identity + Socials)
        { 
          '@context': 'https://schema.org', 
          '@type': 'Organization', 
          name: 'CrackJobs', 
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.png`,
          sameAs: [
            "https://www.linkedin.com/company/crackjobs", 
            "https://twitter.com/crackjobs" 
          ]
        },
        
        // 2. WEBSITE (Fixes the "crackjobs.com" name issue)
        {
          '@context': 'https://schema.org', 
          '@type': 'WebSite', 
          name: 'CrackJobs', 
          alternateName: 'CrackJobs Platform',
          url: SITE_URL
        },

        // 3. PRODUCT & REVIEWS (Get the Star Rating ★★★★★)
        {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Mock Interview Session",
          "image": `${SITE_URL}/favicon.png`,
          "description": "Anonymous 1:1 mock interviews with vetted experts from Google, Amazon, and Meta.",
          "brand": { "@type": "Brand", "name": "CrackJobs" },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "500" 
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": "30.00", 
            "availability": "https://schema.org/InStock"
          }
        },

        // 4. FAQ PAGE (Get the Dropdown Questions in Search)
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How does CrackJobs work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "1. Select a mentor profile based on skills. 2. Secure payment (held in escrow). 3. Complete the interview and get a detailed scorecard within 24 hours."
              }
            },
            {
              "@type": "Question",
              "name": "Is my identity anonymous?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. We protect your identity. Your camera stays off if you want, and your name is hidden from the mentor during the session."
              }
            }
          ]
        },

        // 5. KEY SITE LINKS (Guides Google to create "Related Page" shortcuts)
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "SiteNavigationElement",
              "position": 1,
              "name": "Get Started",
              "description": "Create an account and start practicing interviews.",
              "url": `${SITE_URL}/auth/sign-up`
            },
            {
              "@type": "SiteNavigationElement",
              "position": 2,
              "name": "Log In",
              "description": "Access your candidate or mentor dashboard.",
              "url": `${SITE_URL}/auth/sign-in`
            }
          ]
        }
      ];
      injectMultipleSchemas(schemas);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const timer = setTimeout(() => setShowSplash(false), 4000); 
      return () => clearTimeout(timer);
    }
  }, []);

  if (!fontsLoaded) {
    return <SplashScreen />; 
  }

  if (Platform.OS !== 'web' && showSplash) return <SplashScreen />;
  if (Platform.OS !== 'web') return <Redirect href="/auth/sign-in" />;

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        {/* ✨ SEO UPDATE: Added Favicon Link */}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />
            <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
              <TouchableOpacity style={styles.navLink} onPress={() => router.push('/auth/sign-in')}>
                <Text style={styles.navLinkText}>Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSmall} onPress={() => router.push('/auth/sign-up')}>
                <Text style={styles.btnSmallText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- HERO SECTION --- */}
        <View style={styles.sectionContainer}>
          <View style={[styles.heroCentered, isSmall && styles.heroCenteredMobile]}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>🚀 NEW: ML System Design Track</Text>
            </View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
              Practice your interviews with{'\n'}<Text style={{ color: CTA_TEAL }}>Real Professionals</Text>
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              Anonymous 1:1 mock interviews. Practice with vetted mentors from top companies.
            </Text>
            
            <View style={[styles.heroButtons, isSmall && styles.heroButtonsMobile]}>
              <TouchableOpacity 
                style={[styles.btnBig, styles.btnPrimary, isSmall && { width: '100%' }]} 
                onPress={() => router.push('/auth/sign-up')}
              >
                <Text style={[styles.btnTextBig, styles.btnTextWhite]}>Start Practicing</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.btnBig, styles.btnSecondary, isSmall && { width: '100%' }]} 
                onPress={() => router.push('/auth/sign-in')}
              >
                <Text style={styles.btnTextBig}>Browse Mentors</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* --- LOGO WALL --- */}
        <View style={styles.logoSection}>
          <Text style={styles.logoTitle}>OUR MENTORS HAVE WORKED IN</Text>
          <View style={[styles.logoWall, isSmall && styles.logoWallMobile]}>
            {COMPANIES.map((company) => (
              <View key={company.name} style={styles.logoWrapper}>
                <Image 
                  source={{ uri: company.url }} 
                  style={[styles.logoImage, { width: company.width }]} 
                  resizeMode="contain"
                  alt={`${company.name} logo`}
                />
              </View>
            ))}
          </View>
        </View>

        {/* --- ROLE TRACKS --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>Specialized Tracks</Text>
          <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile, { marginBottom: 16 }]}>
            Choose your domain and interview type
          </Text>
       
          
          <View style={[styles.grid, isSmall && styles.gridMobile]}>
            {TRACKS.map((track) => (
              <TrackCard 
                key={track.id}
                icon={track.icon}
                iconColor={track.iconColor}
                title={track.title} 
                skills={track.skills}
              />
            ))}
          </View>
        </View>

        {/* --- VETTING PROCESS --- */}
        <View style={styles.sectionContainer}>
          <View style={[styles.infoBox, { backgroundColor: CTA_TEAL }, isSmall && styles.infoBoxMobile]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoBoxKicker, { color: 'rgba(255,255,255,0.7)' }]}>TOP 3% ONLY</Text>
              <Text style={styles.infoBoxTitle}>Rigorous Quality Control</Text>
              <Text style={styles.infoBoxText}>
                We don't let just anyone on the platform. Every mentor goes through a strict 3-step verification process.
              </Text>
            </View>
            <View style={styles.stepsContainer}>
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Identity Check</Text>
                  <Text style={styles.stepDesc}>Work profile verification.</Text>
                </View>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Experience</Text>
                  <Text style={styles.stepDesc}>Significant interview conduction experience.</Text>
                </View>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Test Run</Text>
                  <Text style={styles.stepDesc}>We test the interviewing skills of the mentor</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* --- HOW IT WORKS --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>Process</Text>
          <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>How it works</Text>
          <View style={[styles.howItWorksGrid, isSmall && styles.gridMobile]}>
            <WorkStep icon="🔍" title="1. Select Profile" desc="Filter by skills and choose the exact mentor profile." />
            {!isSmall && <Text style={styles.arrow}>→</Text>}
            <WorkStep icon="🔒" title="2. Secure Payment" desc="Your money is held in escrow until the session is done." />
            {!isSmall && <Text style={styles.arrow}>→</Text>}
            <WorkStep icon="📈" title="3. Get Feedback" desc="Receive a detailed performance scorecard within 24 hours." />
          </View>
        </View>

        {/* --- REVIEWS --- */}
        <View style={[styles.sectionContainer, styles.reviewsBg]}>
          <Text style={styles.sectionKicker}>Testimonials</Text>
          <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Success Stories</Text>
          <View style={[styles.grid, isSmall && styles.gridMobile]}>
            <ReviewCard 
              text="I failed my first Google PM interview miserably. After 3 sessions on CrackJobs, I realized my product sense structure was off. Cleared the L4 loop last week!" 
              title="Senior Product Manager"
              subtitle="Recently hired at Google"
            />
            <ReviewCard 
              text="The feedback is brutal but necessary. My mentor pointed out SQL edge cases and business logic flaws I never considered." 
              title="Data Analyst II"
              subtitle="Candidate for FAANG"
            />
            <ReviewCard 
              text="The ML System Design feedback was spot on. My mentor from Amazon helped me structure my model deployment strategy perfectly." 
              title="Machine Learning Engineer"
              subtitle="Transitioning from Research"
            />
          </View>
        </View>

        {/* --- STATS SECTION --- */}
        <View style={styles.statsSection}>
          <View style={[styles.statsContent, isSmall && styles.statsContentMobile]}>
            <StatItem number="500+" label="Interviews Scheduled" icon="calendar-check" />
            {!isSmall && <View style={styles.statDivider} />}
            <StatItem number="15+" label="Expert Mentors" icon="account-tie" />
            {!isSmall && <View style={styles.statDivider} />}
            <StatItem number="4.9" label="Average Rating" icon="star" />
          </View>
        </View>

        {/* --- MENTOR GAMIFICATION --- */}
        <View style={styles.sectionContainer}>
          <View style={[styles.infoBox, { backgroundColor: CTA_TEAL, flexDirection: 'column', gap: 40, paddingVertical: 60 }]}>
            
            {/* Header */}
            <View style={{ alignItems: 'center', maxWidth: 600, alignSelf: 'center' }}>
               <Text style={[styles.sectionKicker, { color: '#fff' }]}>Join the Community</Text>
               <Text style={[styles.sectionTitle, { color: '#fff', fontSize: 32 }]}>Why Become a Mentor?</Text>
               <Text style={[styles.sectionDesc, { color: 'rgba(255,255,255,0.7)', marginBottom: 0 }]}>
                  Earn recognition, build your personal brand, and access exclusive networks.
               </Text>
            </View>

            {/* Cards Grid */}
            <View style={[styles.grid, isSmall && styles.gridMobile, { justifyContent: 'center' }]}>
              {MENTOR_TIERS.map((tier) => (
                <View key={tier.level} style={[styles.tierCard, { borderColor: tier.color }]}>
                  <View style={[styles.tierHeader, { backgroundColor: tier.color }]}>
                    <MaterialCommunityIcons name={tier.icon as any} size={28} color="#fff" />
                    <Text style={styles.tierTitle}>{tier.level}</Text>
                  </View>
                  <View style={styles.tierBody}>
                    {tier.perks.map((perk, i) => (
                      <View key={i} style={styles.perkRow}>
                        <MaterialCommunityIcons name="check-circle-outline" size={18} color={tier.color} />
                        <Text style={styles.perkText}>{perk}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
            
            {/* Button */}
            <View style={{ alignItems: 'center', width: '100%' }}>
               <TouchableOpacity style={styles.btnWhite} onPress={() => router.push('/auth/sign-up')}>
                  <Text style={styles.btnTextDark}>Apply to be a Mentor</Text>
               </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* --- SAFETY --- */}
        <View style={[styles.sectionContainer, { marginBottom: 60 }]}>
          <View style={[styles.infoBox, { backgroundColor: BRAND_ORANGE }, isSmall && styles.infoBoxMobile]}>
            <View style={{ flex: 1, alignItems: isSmall ? 'center' : 'flex-start' }}>
              <Text style={styles.infoBoxTitle}>Safe & Anonymous</Text>
              <Text style={[styles.infoBoxText, isSmall && { textAlign: 'center' }]}>We protect your identity. Your camera stays off if you want. Your name is hidden.</Text>
            </View>
            <View style={{ flex: 1, gap: 15, alignItems: isSmall ? 'center' : 'flex-start' }}>
              <View style={styles.checkRow}><Text>✅</Text><Text style={styles.checkText}>Identity Blind</Text></View>
              <View style={styles.checkRow}><Text>✅</Text><Text style={styles.checkText}>Money Back Guarantee</Text></View>
            </View>
          </View>
        </View>

        {/* --- CTA FOOTER --- */}
        <View style={styles.bottomCtaSection}>
          <Text style={styles.bottomCtaTitle}>Ready to get hired?</Text>
          <Text style={styles.bottomCtaSubtitle}>Join thousands of candidates preparing today.</Text>
          <TouchableOpacity style={styles.bottomCtaButton} onPress={() => router.push('/auth/sign-up')}>
            <Text style={styles.bottomCtaButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        
        <Footer />
      </ScrollView>
    </>
  );
}

// --- COMPONENTS ---
const StatItem = ({ number, label, icon }: { number: string, label: string, icon: any }) => (
  <View style={styles.statItem}>
    <MaterialCommunityIcons name={icon} size={32} color={CTA_TEAL} style={{ marginBottom: 8 }} />
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TrackCard = ({ icon, iconColor, title, desc, skills }: { icon: any, iconColor: string, title: string, desc: string, skills: string[] }) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }}>
      <MaterialCommunityIcons name={icon} size={32} color={iconColor} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardBody}>{desc}</Text>
    <View style={styles.skillsContainer}>
      {skills.map((skill, index) => (
        <View key={index} style={styles.skillChip}><Text style={styles.skillText}>{skill}</Text></View>
      ))}
    </View>
  </View>
);

const WorkStep = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <View style={styles.workStepCard}>
    <Text style={styles.workStepIcon}>{icon}</Text>
    <Text style={styles.workStepTitle}>{title}</Text>
    <Text style={styles.workStepDesc}>{desc}</Text>
  </View>
);

const ReviewCard = ({ text, title, subtitle }: { text: string, title: string, subtitle: string }) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
    <Text style={styles.reviewText}>"{text}"</Text>
    <View style={styles.reviewAuthor}>
      <View style={styles.avatarPlaceholder}><Text style={{fontSize: 12}}>💼</Text></View>
      <View>
        <Text style={styles.authorName}>{title}</Text>
        <Text style={styles.authorRole}>{subtitle}</Text>
      </View>
    </View>
  </View>
);

// --- STYLES ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },

  // Header & Nav
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLink: {},
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },

  // Buttons & Badges
  btnBig: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 100, borderWidth: 1, minWidth: 160, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: CTA_TEAL, borderColor: CTA_TEAL },
  btnSecondary: { backgroundColor: 'transparent', borderColor: '#ccc' },
  btnTextBig: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: TEXT_DARK, textAlign: 'center' },
  btnTextWhite: { color: '#FFFFFF' },
  badgeContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0f5f5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, marginBottom: 24 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, fontFamily: SYSTEM_FONT, letterSpacing: 0.5, textTransform: 'uppercase' },

  // Hero
  heroCentered: { alignItems: 'center', paddingVertical: 40, maxWidth: 800, alignSelf: 'center' },
  heroCenteredMobile: { paddingVertical: 20 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 52, color: BRAND_ORANGE, lineHeight: 60, marginBottom: 24, textAlign: 'center' },
  heroTitleMobile: { fontSize: 36, lineHeight: 44 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 30, marginBottom: 40, textAlign: 'center', maxWidth: 600 },
  heroSubtitleMobile: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  
  heroButtons: { flexDirection: 'row', gap: 16 },
  heroButtonsMobile: { flexDirection: 'column', width: '100%', paddingHorizontal: 20 },

  // Logo Wall
  logoSection: { backgroundColor: '#fff', paddingVertical: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  logoTitle: { textAlign: 'center', fontSize: 15, fontWeight: '500', color: '#bbb', marginBottom: 30, letterSpacing: 1.5, textTransform: 'uppercase' },
  logoWall: { flexDirection: 'row', justifyContent: 'center', gap: 60, flexWrap: 'wrap', alignItems: 'center' },
  logoWallMobile: { gap: 30, paddingHorizontal: 20 },
  logoWrapper: { height: 50, justifyContent: 'center', alignItems: 'center' },
  logoImage: { height: 35 }, 

  // General Layout
  sectionContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  grid: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
  gridMobile: { flexDirection: 'column' },
  reviewsBg: { marginTop: 0, paddingVertical: 60 },
  sectionKicker: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, color: CTA_TEAL, marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 36, color: TEXT_DARK, marginBottom: 16, textAlign: 'center' },
  sectionTitleMobile: { fontSize: 28 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, textAlign: 'center', maxWidth: 700, marginBottom: 40, lineHeight: 24, alignSelf: 'center' },
  sectionDescMobile: { fontSize: 14 },
  
  // Stats
  statsSection: { backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 32, marginTop: 40 },
  statsContent: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', maxWidth: 1000, alignSelf: 'center', width: '100%', gap: 40 },
  statsContentMobile: { flexDirection: 'column', gap: 24 },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 32, fontWeight: '800', color: TEXT_DARK, fontFamily: SYSTEM_FONT },
  statLabel: { fontSize: 14, color: TEXT_GRAY, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: '#eee' },

  // Mentor Cards & Buttons
  tierCard: { flex: 1, minWidth: 280, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 2 },
  tierHeader: { padding: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  tierTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textTransform: 'uppercase' },
  tierBody: { padding: 24, gap: 12 },
  perkRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  perkText: { fontSize: 15, color: '#444', lineHeight: 22, flex: 1 },
  
  btnWhite: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  btnTextDark: { color: '#222', fontWeight: '800', fontSize: 16, textAlign: 'center' },

  // Cards & Utils
  card: { flex: 1, minWidth: 280, backgroundColor: '#fff', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  cardTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: TEXT_DARK },
  cardBody: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, marginBottom: 20 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 'auto' },
  skillChip: { backgroundColor: '#f0f5f5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  skillText: { fontSize: 12, fontWeight: '600', color: '#444', fontFamily: SYSTEM_FONT },

  howItWorksGrid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 },
  workStepCard: { flex: 1, alignItems: 'center', padding: 20 },
  workStepIcon: { fontSize: 48, marginBottom: 16 },
  workStepTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: TEXT_DARK, marginBottom: 8, textAlign: 'center' },
  workStepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, textAlign: 'center', lineHeight: 22 },
  arrow: { fontSize: 30, color: '#ddd', marginHorizontal: 10, marginTop: -40 },
  
  // Info Box (Vetting, Safety, Mentor)
  infoBox: { borderRadius: 24, padding: 50, flexDirection: 'row', gap: 60, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: {width: 0, height: 10} },
  infoBoxMobile: { flexDirection: 'column', padding: 30, gap: 30 },
  infoBoxKicker: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  infoBoxTitle: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 16 },
  infoBoxText: { color: 'rgba(255,255,255,0.95)', fontSize: 18, lineHeight: 28 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  stepsContainer: { flex: 1, gap: 24 },
  stepRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  stepBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  stepTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  stepDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 20 },

  reviewCard: { flex: 1, minWidth: 280, backgroundColor: '#fff', padding: 32, borderRadius: 12, borderWidth: 1, borderColor: '#eaeaea' },
  reviewStars: { marginBottom: 16, fontSize: 12, letterSpacing: 2 },
  reviewText: { fontFamily: SYSTEM_FONT, fontSize: 16, color: '#333', lineHeight: 26, fontStyle: 'italic', marginBottom: 24 },
  reviewAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e0f5f5', alignItems: 'center', justifyContent: 'center' },
  authorName: { fontWeight: '700', fontSize: 14, color: TEXT_DARK },
  authorRole: { fontSize: 12, color: TEXT_GRAY, marginTop: 2 },

  bottomCtaSection: { paddingVertical: 100, paddingHorizontal: 24, alignItems: 'center', backgroundColor: 'transparent' },
  bottomCtaTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 40, color: TEXT_DARK, marginBottom: 16, textAlign: 'center' },
  bottomCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, marginBottom: 40, textAlign: 'center' },
  bottomCtaButton: { backgroundColor: CTA_TEAL, paddingHorizontal: 48, paddingVertical: 18, borderRadius: 100 },
  bottomCtaButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', color: '#fff', fontSize: 18 },
});