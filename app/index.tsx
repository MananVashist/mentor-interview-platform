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
import { SplashScreen } from '../components/SplashScreen';
import { Footer } from '@/components/Footer';
import { BrandHeader } from '@/lib/ui';
import Svg, { Path, Circle, G, Rect, Polygon } from 'react-native-svg';

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

// --- INLINE SVG ICON COMPONENTS ---
const MedalOutlineIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14.94 19.5L12 17.77L9.06 19.5L9.84 16.16L7.25 13.94L10.66 13.65L12 10.5L13.34 13.65L16.75 13.94L14.16 16.16L14.94 19.5M20 2H4V4L7.81 7.81C6.12 9.67 5 12.2 5 15C5 19.42 8.58 23 13 23C17.42 23 21 19.42 21 15C21 12.2 19.88 9.67 18.19 7.81L22 4V2M7.19 5H16.81L15.54 6.27C14.5 5.5 13.28 5 12 5C10.72 5 9.5 5.5 8.46 6.27L7.19 5M12 21C9.68 21 7.73 19.5 7.17 17.41L8.53 16.67L12 15.1L15.47 16.68L16.83 17.41C16.27 19.5 14.32 21 12 21Z" fill={color} />
  </Svg>
);

const MedalIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20,2H4V4L9.81,9.81C9.29,10.79 9,11.87 9,13A6,6 0 0,0 15,19C16.13,19 17.21,18.71 18.19,18.19L22,22V20L18.19,16.19C18.71,15.21 19,14.13 19,13A6,6 0 0,0 13,7C11.87,7 10.79,7.29 9.81,7.81L4,2M14.94,16L12,14.27L9.06,16L9.84,12.66L7.25,10.44L10.66,10.15L12,7L13.34,10.15L16.75,10.44L14.16,12.66L14.94,16Z" fill={color} />
  </Svg>
);

const TrophyIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20,2H4V4L4.34,4.34C3.5,5.16 3,6.29 3,7.5C3,9.45 4.55,11 6.5,11C7.71,11 8.84,10.5 9.66,9.66L10,10C9.39,10 8.84,10.24 8.42,10.66L8.41,10.67C7.84,11.24 7.5,12 7.5,12.83V18H7V20H17V18H16.5V12.83C16.5,12 16.16,11.24 15.59,10.67L15.58,10.66C15.16,10.24 14.61,10 14,10L14.34,9.66C15.16,10.5 16.29,11 17.5,11C19.45,11 21,9.45 21,7.5C21,6.29 20.5,5.16 19.66,4.34L20,4M6.5,9C5.67,9 5,8.33 5,7.5C5,6.67 5.67,6 6.5,6C7.33,6 8,6.67 8,7.5C8,8.33 7.33,9 6.5,9M17.5,9C16.67,9 16,8.33 16,7.5C16,6.67 16.67,6 17.5,6C18.33,6 19,6.67 19,7.5C19,8.33 18.33,9 17.5,9Z" fill={color} />
  </Svg>
);

const CheckCircleOutlineIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill={color} />
  </Svg>
);

const CalendarCheckIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M16.5,16.25L13.5,13.25L14.9,11.84L16.5,13.44L19.6,10.34L21,11.75L16.5,16.25Z" fill={color} />
  </Svg>
);

const AccountTieIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12,3A4,4 0 0,1 16,7A4,4 0 0,1 12,11A4,4 0 0,1 8,7A4,4 0 0,1 12,3M16,13.54C16,14.6 15.72,17.07 13.81,19.83L13,15L13.94,13.12C13.32,13.05 12.67,13 12,13C11.33,13 10.68,13.05 10.06,13.12L11,15L10.19,19.83C8.28,17.07 8,14.6 8,13.54C5.61,14.24 4,15.5 4,17V21H10L11.09,21H12.91L14,21H20V17C20,15.5 18.4,14.24 16,13.54Z" fill={color} />
  </Svg>
);

const StarIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" fill={color} />
  </Svg>
);

const ClipboardFlowIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12,2A2,2 0 0,1 14,4V5C14,5.55 13.55,6 13,6H11C10.45,6 10,5.55 10,5V4A2,2 0 0,1 12,2M19,4C20.11,4 21,4.9 21,6V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V6C3,4.9 3.9,4 5,4H9.18C9.6,2.84 10.7,2 12,2C13.3,2 14.4,2.84 14.82,4H19M18,11V9H6V11H18M18,15V13H6V15H18M18,19V17H6V19H18Z" fill={color} />
  </Svg>
);

const ChartBoxIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z" fill={color} />
  </Svg>
);

const BrainIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21.33,12.91C21.42,14.46 20.71,15.95 19.44,16.86L19.44,17A2,2 0 0,1 17.44,19H11.55C9.64,19 7.47,18.3 5.41,17.07L5.06,16.86C3.79,15.95 3.08,14.46 3.17,12.91C2.74,12.75 2.32,12.5 2,12.15C1.17,11.24 1,9.94 1.61,8.82C2.21,7.7 3.46,7.12 4.7,7.29C4.8,6.36 5.32,5.5 6.12,4.97C6.92,4.44 7.92,4.27 8.85,4.5C9.78,4.73 10.57,5.36 11,6.23C11.4,5.36 12.21,4.73 13.14,4.5C14.07,4.27 15.07,4.44 15.87,4.97C16.67,5.5 17.19,6.36 17.29,7.29C18.53,7.12 19.78,7.7 20.38,8.82C20.99,9.94 20.82,11.24 20,12.15C19.68,12.5 19.26,12.75 18.83,12.91L18.83,12.91C18.83,12.91 18.83,12.91 18.83,12.91L18.83,12.91C18.83,12.91 18.83,12.91 18.83,12.91C18.83,12.91 18.83,12.91 18.83,12.91M18,11.71C18,11.71 18,11.71 18,11.71L18,11.71C18.08,11.36 18.19,11 18.32,10.68C18.91,9.18 19.04,7.77 18.66,6.6C18.12,4.93 16.64,3.79 14.88,3.55C14.06,3.44 13.22,3.62 12.5,4.06C11.78,4.5 11.24,5.17 10.97,5.96L10.97,5.96C10.97,5.96 10.97,5.96 10.97,5.96C10.97,5.96 10.97,5.96 10.97,5.96C10.7,5.17 10.16,4.5 9.44,4.06C8.72,3.62 7.88,3.44 7.06,3.55C5.3,3.79 3.82,4.93 3.28,6.6C2.9,7.77 3.03,9.18 3.62,10.68C3.75,11 3.86,11.36 3.94,11.71L3.94,11.71C3.94,11.71 3.94,11.71 3.94,11.71C3.94,11.71 3.94,11.71 3.94,11.71C3.94,11.71 3.94,11.71 3.94,11.71L3.94,11.71C3.94,11.71 3.94,11.71 3.94,11.71L3.94,11.71C3.42,11.94 2.94,12.27 2.54,12.68C1.86,13.38 1.52,14.32 1.61,15.26C1.7,16.2 2.19,17.05 2.94,17.63L3.94,17.63C4.69,17.63 5.42,17.42 6.06,17C6.7,16.58 7.22,15.98 7.56,15.26C7.9,14.54 8.04,13.74 7.97,12.96C7.9,12.18 7.61,11.44 7.13,10.83L7.13,10.83C7.13,10.83 7.13,10.83 7.13,10.83C7.13,10.83 7.13,10.83 7.13,10.83M11.97,5.96L11.97,5.96L11.97,5.96C11.97,5.96 11.97,5.96 11.97,5.96L11.97,5.96L11.97,5.96C11.97,5.96 11.97,5.96 11.97,5.96L11.97,5.96C11.97,5.96 11.97,5.96 11.97,5.96Z" fill={color} />
  </Svg>
);

const AccountGroupIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12,5A3.5,3.5 0 0,0 8.5,8.5A3.5,3.5 0 0,0 12,12A3.5,3.5 0 0,0 15.5,8.5A3.5,3.5 0 0,0 12,5M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M5.5,8A2.5,2.5 0 0,0 3,10.5C3,11.44 3.53,12.25 4.29,12.68C4.65,12.88 5.06,13 5.5,13C5.94,13 6.35,12.88 6.71,12.68C7.08,12.47 7.39,12.17 7.62,11.81C6.89,10.86 6.5,9.7 6.5,8.5C6.5,8.41 6.5,8.31 6.5,8.22C6.2,8.08 5.86,8 5.5,8M18.5,8C18.14,8 17.8,8.08 17.5,8.22C17.5,8.31 17.5,8.41 17.5,8.5C17.5,9.7 17.11,10.86 16.38,11.81C16.5,12 16.63,12.15 16.78,12.3C16.94,12.45 17.1,12.58 17.29,12.68C17.65,12.88 18.06,13 18.5,13C18.94,13 19.35,12.88 19.71,12.68C20.47,12.25 21,11.44 21,10.5A2.5,2.5 0 0,0 18.5,8M12,14C9.66,14 5,15.17 5,17.5V19H19V17.5C19,15.17 14.34,14 12,14M4.71,14.55C2.78,14.78 0,15.76 0,17.5V19H3V17.07C3,16.06 3.69,15.22 4.71,14.55M19.29,14.55C20.31,15.22 21,16.06 21,17.07V19H24V17.5C24,15.76 21.22,14.78 19.29,14.55M12,16C13.53,16 15.24,16.5 16.23,17H7.77C8.76,16.5 10.47,16 12,16Z" fill={color} />
  </Svg>
);

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

// Icon mapping
const getIconComponent = (iconName: string, size: number, color: string) => {
  switch (iconName) {
    case 'medal-outline':
      return <MedalOutlineIcon size={size} color={color} />;
    case 'medal':
      return <MedalIcon size={size} color={color} />;
    case 'trophy':
      return <TrophyIcon size={size} color={color} />;
    case 'check-circle-outline':
      return <CheckCircleOutlineIcon size={size} color={color} />;
    case 'calendar-check':
      return <CalendarCheckIcon size={size} color={color} />;
    case 'account-tie':
      return <AccountTieIcon size={size} color={color} />;
    case 'star':
      return <StarIcon size={size} color={color} />;
    case 'clipboard-flow':
      return <ClipboardFlowIcon size={size} color={color} />;
    case 'chart-box':
      return <ChartBoxIcon size={size} color={color} />;
    case 'brain':
      return <BrainIcon size={size} color={color} />;
    case 'account-group':
      return <AccountGroupIcon size={size} color={color} />;
    default:
      return null;
  }
};

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(Platform.OS !== 'web');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const timer = setTimeout(() => setShowSplash(false), 4000); 
      return () => clearTimeout(timer);
    }
  }, []);

  if (Platform.OS !== 'web' && showSplash) return <SplashScreen />;
  if (Platform.OS !== 'web') return <Redirect href="/auth/sign-in" />;

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
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
              Practice interviews with{'\n'}<Text style={{ color: CTA_TEAL }}>Real expert mentors</Text>
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
                description={track.description}
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
                    {getIconComponent(tier.icon, 28, '#fff')}
                    <Text style={styles.tierTitle}>{tier.level}</Text>
                  </View>
                  <View style={styles.tierBody}>
                    {tier.perks.map((perk, i) => (
                      <View key={i} style={styles.perkRow}>
                        {getIconComponent('check-circle-outline', 18, tier.color)}
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
const StatItem = ({ number, label, icon }: { number: string, label: string, icon: string }) => (
  <View style={styles.statItem}>
    <View style={{ marginBottom: 8 }}>
      {getIconComponent(icon, 32, CTA_TEAL)}
    </View>
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TrackCard = ({ icon, iconColor, title, description, skills }: { icon: string, iconColor: string, title: string, description: string, skills: string[] }) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }}>
      {getIconComponent(icon, 32, iconColor)}
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardBody}>{description}</Text>
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