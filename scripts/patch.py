import os
import re

# 1. Define the specific SEO data for each page
pages = {
    'data-analytics': {
        'title': "Anonymous Data Analytics Mock Interviews | Expert-Led Prep",
        'desc': "Practice SQL, Python, and product sense safely. 100% anonymous data analytics mock interviews led by senior analysts. Get elite, unbiased feedback.",
        'keywords': "anonymous data analyst mock interview, expert data analytics prep, SQL interview practice, product sense interview, data analyst mock"
    },
    'data-science': {
        'title': "Anonymous Data Science Mock Interviews | Expert-Led ML Prep",
        'desc': "Practice Data Science and ML interviews safely. 100% anonymous mock interviews led by senior data scientists. Master ML algorithms and Python coding today.",
        'keywords': "anonymous data science mock interview, expert ML mock interview, machine learning interview practice, model debugging interview, Python data science interview"
    },
    'product-management': {
        'title': "Anonymous Product Manager Mock Interviews | Expert-Led Prep",
        'desc': "Practice PM interviews safely. 100% anonymous mock interviews led by senior PMs. Master Product Sense, Execution, and Technical rounds with elite feedback.",
        'keywords': "anonymous PM mock interview, expert product manager prep, product sense interview, execution interview practice, PM mock, technical PM interview"
    },
    'hr': {
        'title': "Technical HR Mock Interviews | HRBP & COE Interview Prep | CrackJobs",
        'desc': "Practice technical HR and HRBP interviews with senior leaders. Master org design, compensation strategy, employee relations, and HR analytics. Book an anonymous, expert-led mock interview today.",
        'keywords': "technical HR mock interview, HRBP technical interview, compensation strategy interview, org design interview, HR analytics interview, expert HR mock interview"
    }
}

# 2. Define the shared UI blocks
MENTOR_STATE = """  const [mentors, setMentors] = useState<any[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { data, error } = await supabase
          .from('mentors')
          .select('id, professional_title, avatar_url, total_sessions, years_of_experience, profiles(full_name)')
          .eq('status', 'approved')
          .limit(4);
        if (data && !error) setMentors(data);
      } catch (err) {
        console.error("Failed to fetch mentors", err);
      } finally {
        setLoadingMentors(false);
      }
    };
    fetchMentors();
  }, []);
"""

MENTOR_UI = """
          {/* Featured Mentors Section (Dynamically Loaded) */}
          <View style={[styles.section, { backgroundColor: 'white', paddingTop: 60, paddingBottom: 60 }]} accessibilityRole="region">
            <Text style={styles.sectionLabel}>EXPERT MENTORS</Text>
            <Text style={[styles.sectionTitle, { marginBottom: 36 }]}>Practice with Senior Mentors</Text>
            
            {loadingMentors ? (
              <ActivityIndicator size="large" color="#18a7a7" style={{ marginVertical: 40 }} />
            ) : (
              <View style={styles.mentorsGrid}>
                {mentors.map((mentor) => {
                  const avatarSource = mentor.avatar_url || `https://api.dicebear.com/9.x/micah/png?seed=${encodeURIComponent(mentor.id)}&backgroundColor=e5e7eb,f3f4f6`;
                  const formatName = (name) => name ? name.split(' ')[0] + ' ' + name.split(' ').pop()[0].toUpperCase() + '.' : 'Expert Mentor';
                  return (
                    <TouchableOpacity key={mentor.id} style={styles.mentorCard} onPress={() => router.push(`/mentors/${mentor.id}`)} activeOpacity={0.8}>
                      <Image source={{ uri: avatarSource }} style={styles.mentorAvatar} />
                      <Text style={styles.mentorName} numberOfLines={1}>{formatName(mentor.profiles?.full_name)}</Text>
                      <Text style={styles.mentorTitle} numberOfLines={2}>{mentor.professional_title || "Senior Mentor"}</Text>
                      <View style={styles.mentorStats}>
                        {!!mentor.years_of_experience && <Text style={styles.mentorStatTxt}>🕐 {mentor.years_of_experience}y exp</Text>}
                        {!!mentor.total_sessions && <Text style={styles.mentorStatTxt}>🎯 {mentor.total_sessions} sessions</Text>}
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
            
            <TouchableOpacity style={[styles.ctaBtn, { alignSelf: 'center', marginTop: 40, paddingVertical: 14, paddingHorizontal: 36, backgroundColor: '#f58742' }]} onPress={() => router.push('/mentors')}>
              <Text style={[styles.ctaBtnText, { fontSize: 15 }]}>View All Mentors →</Text>
            </TouchableOpacity>
          </View>
"""

MENTOR_STYLES = """  mentorsGrid: { flexDirection: 'row', gap: 20, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  mentorCard: { width: 250, backgroundColor: '#f8f5f0', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8', alignItems: 'center' },
  mentorAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e5e5e5', marginBottom: 16, borderWidth: 1, borderColor: '#d1d5db' },
  mentorName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 6, textAlign: 'center' },
  mentorTitle: { fontFamily: SYSTEM_FONT, fontSize: 13, color: '#555', textAlign: 'center', marginBottom: 16, height: 36, lineHeight: 18 },
  mentorStats: { flexDirection: 'row', gap: 10, justifyContent: 'center', flexWrap: 'wrap' },
  mentorStatTxt: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '600', color: '#18a7a7', backgroundColor: '#e8f5f5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
"""

# 3. Patching Execution
for page, seo in pages.items():
    # Target the files one folder up in the app/interviews directory
    file_path = os.path.join("..", "app", "interviews", f"{page}.tsx")
    
    if not os.path.exists(file_path):
        print(f"❌ Skipped {page}.tsx (File not found at {file_path})")
        continue

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # A. Fix Imports
    if "useState" not in content:
        content = content.replace("import React, { useEffect } from 'react';", "import React, { useEffect, useState } from 'react';")
    
    if "ActivityIndicator" not in content:
        content = re.sub(r"Platform, ScrollView([ ,}])", r"Platform, ScrollView, Image, ActivityIndicator\1", content)
    
    if "@/lib/supabase/client" not in content:
        content = content.replace("import { Header } from '@/components/Header';", "import { Header } from '@/components/Header';\nimport { supabase } from '@/lib/supabase/client';")

    # B. Inject State Logic
    if "const [mentors, setMentors]" not in content:
        content = content.replace("const router = useRouter();", f"const router = useRouter();\n\n{MENTOR_STATE}")

    # C. Inject UI Block (Hooks directly after the Hero section ends)
    if "EXPERT MENTORS" not in content:
        content = re.sub(r"(</View>\s*\{/\*(?:\s*\d*\s*Core.*|.*CORE.*)\*/\})", fr"</View>\n{MENTOR_UI}\n\n          \1", content, flags=re.IGNORECASE)

    # D. Inject Styles
    if "mentorsGrid:" not in content:
        content = content.replace("const styles = StyleSheet.create({", f"const styles = StyleSheet.create({{\n{MENTOR_STYLES}")

    # E. Rewrite SEO <Head> Block
    new_head = f"""<Head>
        <title>{seo['title']}</title>
        <meta name="description" content="{seo['desc']}" />
        <meta name="keywords" content="{seo['keywords']}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://crackjobs.com/interviews/{page}" />
        <meta property="og:title" content="{seo['title']}" />
        <meta property="og:description" content="{seo['desc']}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CrackJobs" />
        <meta property="og:url" content="https://crackjobs.com/interviews/{page}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{seo['title']}" />
        <meta name="twitter:description" content="{seo['desc']}" />
      </Head>"""
      
    content = re.sub(r"<Head>[\s\S]*?</Head>", new_head, content)

    # Write changes
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"✅ Successfully patched {page}.tsx")