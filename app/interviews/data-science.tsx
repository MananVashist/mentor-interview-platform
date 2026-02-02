// app/interviews/data-science.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Svg, { Path, Circle } from 'react-native-svg';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';
const CODE_BG = '#f8f9fa';
const CODE_TEXT = '#2d3748';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

// SVG Icons
const BrainIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="ML Theory">
    <Path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v15A2.5 2.5 0 0 0 9.5 22h5a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 14.5 2h-5z" stroke={color} strokeWidth="2" />
    <Path d="M7 8h10M7 12h10M7 16h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="4.5" r="1" fill={color} />
    <Circle cx="12" cy="19.5" r="1" fill={color} />
  </Svg>
);

const DebugIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Debug">
    <Path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
    <Path d="M12 9v6M9 12h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CodeIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Code">
    <Path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 18, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Check">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M7 12l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const StarIcon = ({ size = 16, color = "#FFD700" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} accessibilityLabel="Star">
    <Path d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 16.8l-6.3 4.6 2.4-7.4L1.8 9.4h7.8z" />
  </Svg>
);

const AlertIcon = ({ size = 28, color = BRAND_ORANGE }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Alert">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" />
    <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const BookIcon = ({ size = 28, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Book">
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const NetworkIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Network">
    <Circle cx="12" cy="12" r="2" fill={color} />
    <Circle cx="6" cy="6" r="2" fill={color} />
    <Circle cx="18" cy="6" r="2" fill={color} />
    <Circle cx="6" cy="18" r="2" fill={color} />
    <Circle cx="18" cy="18" r="2" fill={color} />
    <Path d="M8 6l4 4M16 6l-4 4M8 18l4-4M16 18l-4-4" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default function DataScienceInterviews() {
  const router = useRouter();

  // 🔥 Structured Data for SEO
  useEffect(() => {
    if (Platform.OS === 'web') {
      const breadcrumbSchema = createBreadcrumbSchema([
        { name: 'Home', url: 'https://crackjobs.com' },
        { name: 'Interview Tracks', url: 'https://crackjobs.com/#interview-tracks' },
        { name: 'Data Science', url: 'https://crackjobs.com/interviews/data-science' }
      ]);

      // ADDED: Website Schema
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "CrackJobs",
        "url": "https://crackjobs.com"
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What machine learning algorithms are tested in interviews?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Common algorithms include Linear/Logistic Regression, Decision Trees, Random Forest, Gradient Boosting (XGBoost/LightGBM), Neural Networks, k-means clustering, and dimensionality reduction (PCA). Focus on understanding bias-variance tradeoff and when to use each."
            }
          },
          {
            "@type": "Question",
            "name": "How do I prepare for data science coding rounds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Practice Python (pandas, numpy, scikit-learn), SQL queries, data manipulation, feature engineering, and model evaluation. Use platforms like LeetCode, HackerRank, and Kaggle competitions for hands-on practice."
            }
          },
          {
            "@type": "Question",
            "name": "How important are statistics for data science interviews?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Statistics is critical. Expect questions on hypothesis testing, p-values, confidence intervals, A/B test design, sampling methods, probability distributions, and experimental design. Strong statistical intuition separates great candidates."
            }
          }
        ]
      };

      // HowTo Schema for Rich Results
      const howtoSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Prepare for Data Science Interviews",
        "description": "Step-by-step guide to mastering ML interviews",
        "totalTime": "PT60H",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Master ML Algorithms",
            "text": "Learn supervised/unsupervised learning, neural networks, ensemble methods"
          },
          {
            "@type": "HowToStep",
            "name": "Practice Model Debugging",
            "text": "Diagnose overfitting, underfitting, data leakage, performance issues"
          },
          {
            "@type": "HowToStep",
            "name": "Python Coding Proficiency",
            "text": "Master pandas, numpy, scikit-learn for data manipulation"
          },
          {
            "@type": "HowToStep",
            "name": "Mock ML Interviews",
            "text": "Practice with senior ML engineers from top companies"
          }
        ]
      };

      // Course Schema for Rich Results
      const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Data Science Interview Preparation",
        "description": "Master ML algorithms, model debugging, and Python coding",
        "provider": {
          "@type": "Organization",
          "name": "CrackJobs",
          "url": "https://crackjobs.com"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "lowPrice": "3000",
          "highPrice": "15000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Bronze Mentor",
              "price": "3000-6000",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "name": "Silver Mentor",
              "price": "6000-9000",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "name": "Gold Mentor",
              "price": "9000-15000",
              "priceCurrency": "INR"
            }
          ]
        }
      };

      // EDITED: Added websiteSchema to the list
      const cleanup = injectMultipleSchemas([breadcrumbSchema, faqSchema, howtoSchema, courseSchema, websiteSchema]);
      return () => cleanup && cleanup();
    }
  }, []);

  const coreSkills = [
    {
      name: "ML Theory & Algorithms",
      icon: <BrainIcon size={44} color={CTA_TEAL} />,
      description: "Master model selection, algorithm fundamentals, and ML system design",
      topics: [
        "Algorithm selection (regression, classification, clustering)",
        "Bias-variance tradeoff and regularization",
        "Feature engineering and selection techniques",
        "Model evaluation metrics (precision, recall, AUC-ROC)",
        "Cross-validation and hyperparameter tuning"
      ],
      weight: "35% of interviews"
    },
    {
      name: "Practical ML & Debugging",
      icon: <DebugIcon size={44} color={CTA_TEAL} />,
      description: "Debug models, fix overfitting, and handle production ML issues",
      topics: [
        "Overfitting vs underfitting diagnosis and fixes",
        "Data leakage detection and prevention",
        "Model drift detection and retraining strategies",
        "Debugging poor model performance systematically",
        "A/B testing ML models in production"
      ],
      weight: "35% of interviews"
    },
    {
      name: "Coding: Python, Pandas, Algorithms",
      icon: <CodeIcon size={44} color={CTA_TEAL} />,
      description: "Write production-quality ML code and implement algorithms from scratch",
      topics: [
        "Pandas data manipulation (groupby, merge, pivot)",
        "NumPy vectorization and performance optimization",
        "Implementing ML algorithms (gradient descent, k-means)",
        "Data structures and algorithms (sorting, searching, trees)",
        "Writing clean, testable, maintainable ML code"
      ],
      weight: "30% of interviews"
    }
  ];

  const algorithmGuide = [
    {
      problem: "Predicting continuous values (prices, sales, temperature)",
      algorithms: [
        { name: "Linear Regression", when: "Linear relationships, interpretability needed", complexity: "Low" },
        { name: "Random Forest Regressor", when: "Non-linear relationships, feature importance", complexity: "Medium" },
        { name: "Gradient Boosting (XGBoost)", when: "Best performance, willing to tune", complexity: "High" },
        { name: "Neural Networks", when: "Complex patterns, large datasets", complexity: "High" }
      ]
    },
    {
      problem: "Binary classification (fraud detection, churn prediction)",
      algorithms: [
        { name: "Logistic Regression", when: "Simple baseline, interpretability required", complexity: "Low" },
        { name: "Random Forest Classifier", when: "Handles non-linearity, feature importance", complexity: "Medium" },
        { name: "XGBoost / LightGBM", when: "Structured data, best performance", complexity: "High" },
        { name: "Neural Networks", when: "Unstructured data (images, text)", complexity: "High" }
      ]
    },
    {
      problem: "Multi-class classification (image recognition, document categorization)",
      algorithms: [
        { name: "Naive Bayes", when: "Text classification, simple baseline", complexity: "Low" },
        { name: "Random Forest", when: "Structured data, interpretable", complexity: "Medium" },
        { name: "Neural Networks (CNN)", when: "Images, complex patterns", complexity: "High" },
        { name: "Transformers", when: "Text, state-of-the-art performance", complexity: "Very High" }
      ]
    }
  ];

  const debugScenarios = [
    {
      problem: "Model shows 98% accuracy in training, 65% in production",
      diagnosis: "Classic overfitting - memorized training data",
      solutions: [
        "Add regularization (L1/L2, dropout)",
        "Collect more training data",
        "Use simpler model architecture",
        "Check for data leakage (future info in features)",
        "Validate on holdout set from production distribution"
      ]
    },
    {
      problem: "Model performs well offline but fails A/B test in production",
      diagnosis: "Online metrics don't match offline metrics or model drift",
      solutions: [
        "Align offline metrics with business KPIs",
        "Train on recent production data",
        "Optimize model latency (quantization, pruning)",
        "Add robust error handling for edge cases",
        "Monitor model predictions in real-time"
      ]
    },
    {
      problem: "Feature importance shows unexpected results",
      diagnosis: "Data leakage or multicollinearity",
      solutions: [
        "Check timestamp logic carefully",
        "Remove highly correlated features (VIF > 10)",
        "Split data first, then preprocess",
        "Use SHAP values for better feature interpretation"
      ]
    }
  ];

  const codeExamples = [
    {
      title: "Feature Engineering: Create time-based features",
      code: `import pandas as pd

# Extract temporal features from datetime
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

# Create rolling features
df['rolling_7d_mean'] = df.groupby('user_id')['purchases']\\
    .transform(lambda x: x.rolling(7, min_periods=1).mean())

# Days since last event
df['days_since_last_purchase'] = (
    df.groupby('user_id')['timestamp'].diff().dt.days.fillna(999)
)`,
      explanation: "Time-based features often have high predictive power. Extract hour, day, rolling aggregates, and recency."
    },
    {
      title: "Cohort Analysis: Calculate 7-day retention by signup cohort",
      code: `import pandas as pd

# Group users by signup week
signups = df.groupby('user_id')['signup_date'].min().reset_index()
signups['cohort'] = signups['signup_date'].dt.to_period('W')

# Calculate retention
events = df.merge(signups[['user_id', 'cohort', 'signup_date']], on='user_id')
events['days_since_signup'] = (events['event_date'] - events['signup_date']).dt.days

retention = events[events['days_since_signup'] == 7]\\
    .groupby('cohort')['user_id'].nunique()
cohort_size = signups.groupby('cohort')['user_id'].nunique()

retention_rate = (retention / cohort_size * 100).round(2)`,
      explanation: "Cohort analysis reveals user behavior patterns. Key for churn prediction and product analytics."
    },
    {
      title: "Handle Imbalanced Classification (fraud detection)",
      code: `from sklearn.utils import resample
from imblearn.over_sampling import SMOTE

# Option 1: Undersample majority class
majority = df[df['fraud'] == 0]
minority = df[df['fraud'] == 1]
majority_downsampled = resample(
    majority, n_samples=len(minority), random_state=42
)
balanced = pd.concat([majority_downsampled, minority])

# Option 2: SMOTE (Synthetic Minority Oversampling)
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

# Option 3: Class weights in model
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(class_weight='balanced')`,
      explanation: "Imbalanced classes (1% fraud) require special handling. Use resampling, SMOTE, or class weights."
    }
  ];

  const successStories = [
    {
      name: "Vikram P.",
      company: "Google",
      role: "ML Engineer",
      outcome: "₹48L Package",
      specialty: "Recommendation Systems",
      quote: "Google asked me to debug a model that was overfitting. I walked through my systematic approach: check training curves, look for data leakage, add regularization, validate on holdout set. Mentioned cross-validation and early stopping. They said my debugging process was 'exactly what we do here.'",
      rating: 5,
      sessions: 9
    },
    {
      name: "Ananya K.",
      company: "Amazon",
      role: "Applied Scientist",
      outcome: "₹52L Package",
      specialty: "NLP & Search",
      quote: "The case study was brutal: 'Build a churn prediction model.' I structured it like CrackJobs taught me—EDA, feature engineering, algorithm selection, evaluation metrics, production considerations. Explained precision-recall tradeoff for imbalanced data",
      rating: 5,
      sessions: 11
    },
    {
      name: "Rahul M.",
      company: "Meta",
      role: "Data Scientist",
      outcome: "₹44L Package",
      specialty: "Growth & Experimentation",
      quote: "Meta's coding round was intense—implement gradient descent from scratch in 30 minutes. Thanks to CrackJobs, I'd practiced this 20+ times. Wrote clean, vectorized code with NumPy, handled edge cases, explained the math. Cleared in 22 minutes.",
      rating: 5,
      sessions: 8
    }
  ];

  const commonMistakes = [
    {
      mistake: "Not starting with exploratory data analysis (EDA) before modeling",
      why: "Leads to wrong feature choices and missed data quality issues",
      fix: "Always start interviews with: 'Let me first explore the data—check distributions, missing values, correlations, outliers.' Shows you understand data before jumping to models. Mention specific checks: df.describe(), df.isnull().sum(), correlation matrix."
    },
    {
      mistake: "Choosing algorithms without justifying the choice",
      why: "Shows lack of understanding of algorithm trade-offs",
      fix: "Always explain: 'I'd start with XGBoost because it handles non-linearity well, gives feature importance, and is robust to outliers. For comparison, I'd try Logistic Regression as a simple baseline to see if we need complexity.' Justify every choice."
    },
    {
      mistake: "Not discussing model evaluation beyond accuracy",
      why: "Accuracy is often misleading, especially with imbalanced data",
      fix: "For fraud detection (1% fraud), 99% accuracy is useless if model predicts 'no fraud' always. Discuss: precision, recall, F1-score, AUC-ROC. Say: 'For this problem, I'd optimize for recall because missing fraud is costly. I'd use F2-score to weight recall 2x more than precision.'"
    },
    {
      mistake: "Implementing ML algorithms without explaining the math",
      why: "Interviewers want to see you understand what's under the hood",
      fix: "When coding gradient descent, say: 'We're minimizing loss by iterating: theta = theta - learning_rate * gradient. Learning rate controls step size—too high causes oscillation, too low is slow. I'll add momentum for faster convergence.' Math + code = strong signal."
    },
    {
      mistake: "Not mentioning production considerations and monitoring",
      why: "Shows you've never deployed ML models to production",
      fix: "Always end with production concerns: 'In production, I'd monitor prediction distribution, feature drift, latency, and business metrics. Set up alerts for model performance degradation. Plan for retraining cadence—weekly for fast-changing data, monthly for stable data.'"
    }
  ];

  const mlTools = [
    { category: "Core Libraries", tools: ["scikit-learn", "XGBoost", "LightGBM", "CatBoost", "TensorFlow", "PyTorch"] },
    { category: "Data Processing", tools: ["Pandas", "NumPy", "Polars", "Dask", "PySpark"] },
    { category: "Visualization", tools: ["Matplotlib", "Seaborn", "Plotly", "SHAP (explainability)"] },
    { category: "MLOps & Production", tools: ["MLflow", "Weights & Biases", "Docker", "Kubernetes", "Airflow"] },
    { category: "Cloud Platforms", tools: ["AWS SageMaker", "GCP Vertex AI", "Azure ML", "Databricks"] }
  ];

  const prepTimeline = [
    {
      phase: "Weeks 1-3",
      title: "ML Fundamentals",
      icon: <BrainIcon size={26} color={CTA_TEAL} />,
      focus: [
        "Master core algorithms (regression, trees, ensemble methods)",
        "Understand bias-variance tradeoff deeply",
        "Learn feature engineering techniques",
        "Practice explaining algorithms to non-technical audience",
        "Study evaluation metrics for different problem types"
      ]
    },
    {
      phase: "Weeks 4-6",
      title: "Practical ML & Debugging",
      icon: <DebugIcon size={26} color={CTA_TEAL} />,
      focus: [
        "Practice debugging overfitting and underfitting",
        "Learn to detect and fix data leakage",
        "Master cross-validation and hyperparameter tuning",
        "Study production ML challenges (drift, latency)",
        "Practice A/B testing ML models"
      ]
    },
    {
      phase: "Weeks 7-9",
      title: "Coding & Implementation",
      icon: <CodeIcon size={26} color={CTA_TEAL} />,
      focus: [
        "Implement algorithms from scratch (gradient descent, k-means)",
        "Master Pandas data manipulation",
        "Practice LeetCode medium problems (150+ problems)",
        "Write clean, vectorized NumPy code",
        "Build portfolio of ML projects"
      ]
    },
    {
      phase: "Weeks 10-12",
      title: "Case Studies & Systems",
      icon: <NetworkIcon size={26} color={CTA_TEAL} />,
      focus: [
        "Practice end-to-end ML case studies (10+ cases)",
        "Learn ML system design (recommendation, search, ranking)",
        "Master behavioral STAR storytelling",
        "Practice whiteboard model debugging",
        "Mock interviews with feedback"
      ]
    }
  ];

  const evaluationMetrics = [
    {
      metric: "Precision & Recall",
      formula: "Precision = TP/(TP+FP), Recall = TP/(TP+FN)",
      useCase: "Imbalanced classification (fraud, disease detection)",
      tradeoff: "Precision ↑ = fewer false alarms. Recall ↑ = catch more positives. Can't optimize both."
    },
    {
      metric: "F1-Score / F-Beta",
      formula: "F1 = 2 * (Precision * Recall)/(Precision + Recall)",
      useCase: "When you need balance between precision and recall",
      tradeoff: "F2-score weights recall 2x more (use when false negatives costly)"
    },
    {
      metric: "AUC-ROC",
      formula: "Area under ROC curve (TPR vs FPR)",
      useCase: "When you need threshold-independent evaluation",
      tradeoff: "Good for comparing models, but doesn't tell you optimal threshold"
    },
    {
      metric: "Mean Absolute Error (MAE)",
      formula: "MAE = (1/n) * Σ|y_true - y_pred|",
      useCase: "Regression when you care about average error magnitude",
      tradeoff: "Treats all errors equally, doesn't penalize large errors more"
    }
  ];

  return (
    <>
      <Head>
        <title>Data Science Interview Prep | Master ML Algorithms, Model Debugging & Python</title>
        <meta name="description" content="Ace Data Science interviews at Google, Amazon, Meta with expert ML engineers. Master machine learning algorithms, model debugging, feature engineering, and Python coding. Practice real DS interview questions." />
        <meta name="keywords" content="data science interview, machine learning interview, ML algorithms, model debugging, feature engineering, Python pandas, scikit-learn, XGBoost, neural networks, overfitting, data science preparation" />
        <link rel="canonical" href="https://crackjobs.com/interviews/data-science" />
      
        <meta property="og:title" content="Data Science Interview Preparation | CrackJobs" />
        <meta property="og:description" content="Master ML algorithms, model debugging, and Python coding." />
        <meta property="og:type" content="website" />
        
        {/* ADDED: Proper site name meta tag */}
        <meta property="og:site_name" content="CrackJobs" />
        
        <meta property="og:url" content="https://crackjobs.com/interviews/data-science" />
        
        <style>{`
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f5f0; }
  
  /* ⚡️ RESPONSIVE BRAND HEADER */
  @media (max-width: 768px) {
    #brand-eyes { display: none !important; }
    #brand-header { margin-bottom: 16px !important; }
  }
  
  /* ⚡️ RESPONSIVE SECTIONS */
  @media (max-width: 768px) {
    .section-title { font-size: 32px !important; }
    #question-types-grid,
    #stories-grid,
    #tools-grid,
    #articles-grid,
    #steps-grid { 
      flex-direction: column !important; 
    }
  }
`}</style>
      </Head>

      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          
          {/* Header */}
          <View>
          <Header />
          </View>

          {/* Hero */}
          <View style={[styles.hero]}>
            <View style={styles.badge}><Text style={styles.badgeText}>🤖 DATA SCIENCE INTERVIEWS</Text></View>
            <Text style={[styles.heroTitle]} accessibilityRole="header" accessibilityLevel={1}>
              Mock interviews with accomplished ML engineers
            </Text>
            <Text style={[styles.heroSubtitle]}>
              Master machine learning algorithms, model debugging, feature engineering, and production ML systems with data scientists from top companies. Practice real interview questions with expert feedback.
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.stat}><Text style={styles.statValue}>₹20-55L</Text><Text style={styles.statLabel}>Salary Range</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>Python</Text><Text style={styles.statLabel}>Primary Language</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>4-6</Text><Text style={styles.statLabel}>Interview Rounds</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>10-12 weeks</Text><Text style={styles.statLabel}>Prep Timeline</Text></View>
            </View>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.ctaBtnText}>Find ML Mentors →</Text>
            </TouchableOpacity>
          </View>

          {/* Core Skills */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>3 CORE SKILL AREAS</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">What Companies Test in Data Science Interviews</Text>
            <Text style={styles.sectionDesc}>Based on 600+ ML interviews at FAANG. These 3 areas cover every DS interview question.</Text>
            {coreSkills.map((skill, i) => (
              <View key={i} style={styles.skillCard}>
                <View style={styles.skillHeader}>
                  {skill.icon}
                  <View style={styles.skillHeaderText}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillDesc}>{skill.description}</Text>
                    <Text style={styles.skillWeight}>Interview Weight: {skill.weight}</Text>
                  </View>
                </View>
                <View style={styles.skillTopics}>
                  {skill.topics.map((topic, j) => (
                    <View key={j} style={styles.topicItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Algorithm Guide */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>ALGORITHM SELECTION GUIDE</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Choose the Right ML Algorithm</Text>
            <Text style={styles.sectionDesc}>Interviewers test if you can select appropriate algorithms. Here's your decision framework.</Text>
            {algorithmGuide.map((guide, i) => (
              <View key={i} style={styles.algoCard}>
                <Text style={styles.algoProblem}>Problem Type: {guide.problem}</Text>
                {guide.algorithms.map((algo, j) => (
                  <View key={j} style={styles.algoOption}>
                    <View style={styles.algoHeader}>
                      <Text style={styles.algoName}>{algo.name}</Text>
                      <Text style={[styles.algoComplexity, 
                        algo.complexity === 'High' || algo.complexity === 'Very High' ? { backgroundColor: BRAND_ORANGE } : 
                        algo.complexity === 'Medium' ? { backgroundColor: '#f0ad4e' } : 
                        { backgroundColor: CTA_TEAL }]}>
                        {algo.complexity}
                      </Text>
                    </View>
                    <Text style={styles.algoWhen}>When to use: {algo.when}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Debug Scenarios */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>MODEL DEBUGGING SCENARIOS</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Real Production ML Problems</Text>
            <Text style={styles.sectionDesc}>70% of ML interviews test debugging. Master these patterns to ace the practical round.</Text>
            {debugScenarios.map((scenario, i) => (
              <View key={i} style={styles.debugCard}>
                <View style={styles.debugHeader}>
                  <DebugIcon size={32} color={BRAND_ORANGE} />
                  <Text style={styles.debugProblem}>{scenario.problem}</Text>
                </View>
                <View style={styles.debugDiagnosis}>
                  <Text style={styles.debugDiagnosisLabel}>🔍 Diagnosis:</Text>
                  <Text style={styles.debugDiagnosisText}>{scenario.diagnosis}</Text>
                </View>
                <View style={styles.debugSection}>
                  <Text style={styles.debugSectionLabel}>✅ Solutions:</Text>
                  {scenario.solutions.map((solution, j) => (
                    <Text key={j} style={styles.debugSolution}>→ {solution}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Code Examples */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]}>
            <Text style={styles.sectionLabel}>PYTHON ML CODE LIBRARY</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Common ML Coding Patterns</Text>
            <Text style={styles.sectionDesc}>These patterns appear in 80% of ML coding rounds. Master them for technical interviews.</Text>
            {codeExamples.map((example, i) => (
              <View key={i} style={styles.codeCard}>
                <Text style={styles.codeTitle}>{example.title}</Text>
                <View style={styles.codeBlock}>
                  <Text style={styles.codeText}>{example.code}</Text>
                </View>
                <View style={styles.codeExplanation}>
                  <Text style={styles.codeExplanationLabel}>💡 Why this matters:</Text>
                  <Text style={styles.codeExplanationText}>{example.explanation}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Metrics */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>MODEL EVALUATION DEEP DIVE</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Beyond Accuracy: Choose the Right Metric</Text>
            <Text style={styles.sectionDesc}>Accuracy is often meaningless. Understand which metric matches your business problem.</Text>
            <View style={styles.metricsGrid}>
              {evaluationMetrics.map((metric, i) => (
                <View key={i} style={styles.metricCard}>
                  <Text style={styles.metricName}>{metric.metric}</Text>
                  <View style={styles.metricFormula}>
                    <Text style={styles.metricFormulaText}>{metric.formula}</Text>
                  </View>
                  <Text style={styles.metricUseCase}><Text style={styles.bold}>Use case:</Text> {metric.useCase}</Text>
                  <Text style={styles.metricTradeoff}><Text style={styles.bold}>Tradeoff:</Text> {metric.tradeoff}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Timeline */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>12-WEEK PREP ROADMAP</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Complete Data Science Interview Prep Plan</Text>
            <Text style={styles.sectionDesc}>Structured timeline to master ML theory, debugging, coding, and system design.</Text>
            <View style={styles.timeline}>
              {prepTimeline.map((phase, i) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={styles.timelineMarker}>
                    <View style={styles.timelineDot} />
                    {i < prepTimeline.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      {phase.icon}
                      <View>
                        <Text style={styles.timelinePhase}>{phase.phase}</Text>
                        <Text style={styles.timelineTitle}>{phase.title}</Text>
                      </View>
                    </View>
                    <View style={styles.timelineFocus}>
                      {phase.focus.map((item, j) => (
                        <View key={j} style={styles.focusItem}>
                          <CheckIcon size={14} color={CTA_TEAL} />
                          <Text style={styles.focusText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Tools */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]}>
            <Text style={styles.sectionLabel}>ML TOOLS ECOSYSTEM</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Technologies Data Scientists Must Know</Text>
            <Text style={styles.sectionDesc}>Core stack for production ML. Focus depth on 2-3 tools per category.</Text>
            <View style={[styles.toolsGrid]} nativeID="tools-grid">
              {mlTools.map((category, i) => (
                <View key={i} style={styles.toolCategory}>
                  <Text style={styles.toolCategoryName}>{category.category}</Text>
                  <View style={styles.toolList}>
                    {category.tools.map((tool, j) => (
                      <View key={j} style={styles.toolItem}>
                        <Text style={styles.toolItemText}>{tool}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Success Stories */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>SUCCESS STORIES</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">From Practice to FAANG ML Offers</Text>
            <Text style={styles.sectionDesc}>These data scientists mastered ML interviews with CrackJobs and landed dream roles.</Text>
            <View style={[styles.storiesGrid]} nativeID="stories-grid">
              {successStories.map((story, i) => (
                <View key={i} style={styles.storyCard}>
                  <View style={styles.storyHeader}>
                    <View>
                      <Text style={styles.storyName}>{story.name}</Text>
                      <Text style={styles.storyRole}>{story.role}</Text>
                    </View>
                    <View style={styles.storyRating}>
                      {[...Array(story.rating)].map((_, j) => <StarIcon key={j} size={14} />)}
                    </View>
                  </View>
                  
                  <Text style={styles.storyQuote}>"{story.quote}"</Text>
                 
                </View>
              ))}
            </View>
          </View>

          {/* Mistakes */}
          <View style={[styles.section, { backgroundColor: '#fff8f0' }]}>
            <Text style={styles.sectionLabel}>AVOID THESE MISTAKES</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">5 ML Interview Mistakes That Fail Candidates</Text>
            <Text style={styles.sectionDesc}>Based on 700+ ML interview evaluations. Fix these to dramatically improve your performance.</Text>
            {commonMistakes.map((mistake, i) => (
              <View key={i} style={styles.mistakeCard}>
                <View style={styles.mistakeHeader}>
                  <AlertIcon size={26} color={BRAND_ORANGE} />
                  <Text style={styles.mistakeNum}>Mistake #{i + 1}</Text>
                </View>
                <Text style={styles.mistakeText}>{mistake.mistake}</Text>
                <View style={styles.mistakeWhy}>
                  <Text style={styles.mistakeWhyLabel}>Why it fails:</Text>
                  <Text style={styles.mistakeWhyText}>{mistake.why}</Text>
                </View>
                <View style={styles.mistakeFix}>
                  <Text style={styles.mistakeFixLabel}>✅ How to fix it:</Text>
                  <Text style={styles.mistakeFixText}>{mistake.fix}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Articles */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>DEEP DIVE GUIDES</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Master Specific ML Topics</Text>
            <View style={[styles.articlesGrid]} nativeID="articles-grid">
              <TouchableOpacity style={styles.articleCard} onPress={() => router.push('/blog/ml-interview-mistakes')}>
                <BookIcon size={32} color={CTA_TEAL} />
                <Text style={styles.articleTitle}>Common ML Interview Mistakes to Avoid</Text>
                <Text style={styles.articleDesc}>Learn the most common pitfalls in ML interviews—from algorithm selection to model debugging and production ML.</Text>
                <Text style={styles.articleCta}>Read Complete Guide →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* How It Works */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
            <Text style={[styles.sectionTitle]} nativeID="section-title">Practice ML Interviews in 3 Steps</Text>
            <View style={[styles.stepsGrid]} nativeID="steps-grid">
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
                <Text style={styles.stepTitle}>Choose ML Focus</Text>
                <Text style={styles.stepDesc}>Select ML theory, model debugging, or Python coding. Browse data scientists from top companies.</Text>
              </View>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
                <Text style={styles.stepTitle}>Practice 55-Min Session</Text>
                <Text style={styles.stepDesc}>Work through real ML problems—algorithm selection, debugging overfitting, coding challenges. Get live feedback.</Text>
              </View>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
                <Text style={styles.stepTitle}>Get Expert Evaluation</Text>
                <Text style={styles.stepDesc}>Detailed feedback on ML theory, problem-solving approach, code quality, and communication.</Text>
              </View>
            </View>
          </View>

          {/* Final CTA */}
          <View style={styles.finalCta}>
            <Text style={styles.finalCtaTitle}>Ready to Master ML Interviews?</Text>
            <Text style={styles.finalCtaSubtitle}>Join 350+ data scientists who mastered ML algorithms, model debugging, and Python coding. Start practicing today.</Text>
            <TouchableOpacity style={styles.finalCtaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.finalCtaBtnText}>Start ML Practice Today →</Text>
            </TouchableOpacity>
            <View style={styles.finalCtaFeatures}>
              <Text style={styles.finalCtaFeature}>🤖 Real ML problems</Text>
              <Text style={styles.finalCtaFeature}>🐛 Debug production models</Text>
              <Text style={styles.finalCtaFeature}>💳 Pay per session</Text>
            </View>
          </View>

          <Footer />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },
  hero: { maxWidth: 950, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 70, alignItems: 'center' },
  heroMobile: { paddingVertical: 45 },
  badge: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d8eded', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, marginBottom: 28 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, letterSpacing: 0.6 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '900', fontSize: 42, color: BRAND_ORANGE, lineHeight: 64, textAlign: 'center', marginBottom: 24 },
  heroTitleMobile: { fontSize: 38, lineHeight: 46 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 32, textAlign: 'center', marginBottom: 42, maxWidth: 800 },
  heroSubtitleMobile: { fontSize: 18, lineHeight: 28 },
  heroStats: { flexDirection: 'row', gap: 36, marginBottom: 42, flexWrap: 'wrap', justifyContent: 'center' },
  stat: { alignItems: 'center', minWidth: 85 },
  statValue: { fontFamily: SYSTEM_FONT, fontSize: 32, fontWeight: '800', color: CTA_TEAL, marginBottom: 6 },
  statLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, textAlign: 'center' },
  ctaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 44, paddingVertical: 20, borderRadius: 100 },
  ctaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  section: { paddingVertical: 80, paddingHorizontal: 24 },
  sectionLabel: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: CTA_TEAL, letterSpacing: 1.8, textAlign: 'center', marginBottom: 14, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontSize: 42, fontWeight: '800', color: TEXT_DARK, textAlign: 'center', marginBottom: 18, maxWidth: 850, alignSelf: 'center' },
  sectionTitleMobile: { fontSize: 32 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, textAlign: 'center', marginBottom: 52, maxWidth: 750, alignSelf: 'center', lineHeight: 29 },
  skillCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: BG_CREAM, borderRadius: 18, padding: 32, marginBottom: 24, borderWidth: 1, borderColor: '#e5e5e5' },
  skillHeader: { flexDirection: 'row', gap: 20, marginBottom: 24, alignItems: 'flex-start' },
  skillHeaderText: { flex: 1 },
  skillName: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '700', color: TEXT_DARK, marginBottom: 8 },
  skillDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 25, marginBottom: 8 },
  skillWeight: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '600', color: BRAND_ORANGE },
  skillTopics: { gap: 10 },
  topicItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  topicText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1, lineHeight: 23 },
  algoCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: 'white', borderRadius: 18, padding: 32, marginBottom: 28 },
  algoProblem: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 20 },
  algoOption: { backgroundColor: BG_CREAM, padding: 20, borderRadius: 12, marginBottom: 14 },
  algoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  algoName: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: TEXT_DARK },
  algoComplexity: { fontFamily: SYSTEM_FONT, fontSize: 11, fontWeight: '700', color: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  algoWhen: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22 },
  debugCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: BG_CREAM, borderRadius: 18, padding: 32, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: BRAND_ORANGE },
  debugHeader: { flexDirection: 'row', gap: 16, marginBottom: 20, alignItems: 'flex-start' },
  debugProblem: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, flex: 1, lineHeight: 27 },
  debugDiagnosis: { backgroundColor: '#fff8f0', padding: 16, borderRadius: 12, marginBottom: 16 },
  debugDiagnosisLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: BRAND_ORANGE, marginBottom: 8 },
  debugDiagnosisText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 24 },
  debugSection: { marginBottom: 16 },
  debugSectionLabel: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700', color: TEXT_DARK, marginBottom: 10 },
  debugSolution: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 23, marginBottom: 6 },
  codeCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: 'white', borderRadius: 18, padding: 32, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: CTA_TEAL },
  codeTitle: { fontFamily: SYSTEM_FONT, fontSize: 19, fontWeight: '700', color: TEXT_DARK, marginBottom: 18 },
  codeBlock: { backgroundColor: CODE_BG, padding: 20, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  codeText: { fontFamily: Platform.OS === 'web' ? 'Menlo, Monaco, monospace' : 'monospace', fontSize: 13, color: CODE_TEXT, lineHeight: 22 },
  codeExplanation: { backgroundColor: '#e8f5f5', padding: 16, borderRadius: 12 },
  codeExplanationLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 8 },
  codeExplanationText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  metricsGrid: { maxWidth: 1000, alignSelf: 'center', width: '100%', gap: 24 },
  metricCard: { backgroundColor: 'white', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  metricName: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 14 },
  metricFormula: { backgroundColor: CODE_BG, padding: 14, borderRadius: 10, marginBottom: 14 },
  metricFormulaText: { fontFamily: Platform.OS === 'web' ? 'Menlo, Monaco, monospace' : 'monospace', fontSize: 13, color: CODE_TEXT },
  metricUseCase: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22, marginBottom: 8 },
  metricTradeoff: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22 },
  bold: { fontWeight: '700', color: TEXT_DARK },
  timeline: { maxWidth: 950, alignSelf: 'center', width: '100%' },
  timelineItem: { flexDirection: 'row', gap: 24, marginBottom: 36 },
  timelineMarker: { width: 40, alignItems: 'center' },
  timelineDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: CTA_TEAL, borderWidth: 4, borderColor: 'white', shadowColor: CTA_TEAL, shadowOpacity: 0.3, shadowRadius: 6 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#d0d0d0', marginTop: 8 },
  timelineContent: { flex: 1 },
  timelineHeader: { flexDirection: 'row', gap: 14, marginBottom: 16, alignItems: 'center' },
  timelinePhase: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 4 },
  timelineTitle: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK },
  timelineFocus: { gap: 10 },
  focusItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  focusText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1, lineHeight: 23 },
  toolsGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  toolsGridMobile: { flexDirection: 'column' },
  toolCategory: { flex: 1, minWidth: 240, backgroundColor: 'white', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  toolCategoryName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 16 },
  toolList: { gap: 8 },
  toolItem: { backgroundColor: BG_CREAM, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  toolItemText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK },
  storiesGrid: { flexDirection: 'row', gap: 26, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1150, alignSelf: 'center' },
  storiesGridMobile: { flexDirection: 'column' },
  storyCard: { flex: 1, minWidth: 320, maxWidth: 360, backgroundColor: 'white', padding: 32, borderRadius: 18, borderWidth: 1, borderColor: '#e5e5e5' },
  storyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  storyName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  storyRole: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY },
  storyRating: { flexDirection: 'row', gap: 3 },
  storyOutcomeBox: { backgroundColor: BG_CREAM, padding: 16, borderRadius: 12, marginBottom: 18 },
  storyOutcome: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: CTA_TEAL, marginBottom: 4 },
  storySpecialty: { fontFamily: SYSTEM_FONT, fontSize: 13, color: BRAND_ORANGE, fontWeight: '600' },
  storyQuote: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 25, marginBottom: 18, fontStyle: 'italic' },
  storyFooter: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 14 },
  storySessions: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '600', color: TEXT_GRAY },
  mistakeCard: { maxWidth: 900, alignSelf: 'center', width: '100%', backgroundColor: 'white', padding: 30, borderRadius: 18, marginBottom: 24, borderLeftWidth: 5, borderLeftColor: BRAND_ORANGE },
  mistakeHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  mistakeNum: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '800', color: BRAND_ORANGE },
  mistakeText: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, lineHeight: 28, marginBottom: 16 },
  mistakeWhy: { backgroundColor: '#fff5f0', padding: 16, borderRadius: 12, marginBottom: 14 },
  mistakeWhyLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: BRAND_ORANGE, marginBottom: 6 },
  mistakeWhyText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  mistakeFix: { backgroundColor: '#f0f8f0', padding: 16, borderRadius: 12 },
  mistakeFixLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 6 },
  mistakeFixText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  articlesGrid: { maxWidth: 900, alignSelf: 'center', width: '100%' },
  articlesGridMobile: { flexDirection: 'column' },
  articleCard: { backgroundColor: BG_CREAM, padding: 34, borderRadius: 18, borderWidth: 1, borderColor: '#e5e5e5' },
  articleTitle: { fontFamily: SYSTEM_FONT, fontSize: 21, fontWeight: '700', color: TEXT_DARK, marginTop: 18, marginBottom: 14, lineHeight: 30 },
  articleDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 25, marginBottom: 18 },
  articleCta: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: '600', color: CTA_TEAL },
  stepsGrid: { flexDirection: 'row', gap: 32, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  stepsGridMobile: { flexDirection: 'column' },
  stepCard: { flex: 1, minWidth: 290, maxWidth: 330, alignItems: 'center', backgroundColor: 'white', padding: 32, borderRadius: 18, borderWidth: 1, borderColor: '#e8e8e8' },
  stepNum: { width: 64, height: 64, borderRadius: 32, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  stepNumText: { fontFamily: SYSTEM_FONT, fontSize: 30, fontWeight: '800', color: 'white' },
  stepTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 14, textAlign: 'center' },
  stepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, textAlign: 'center', lineHeight: 25 },
  finalCta: { backgroundColor: '#0f0f0f', paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontFamily: SYSTEM_FONT, fontSize: 46, fontWeight: '900', color: 'white', marginBottom: 22, textAlign: 'center', maxWidth: 750 },
  finalCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 42, textAlign: 'center', maxWidth: 650, lineHeight: 29 },
  finalCtaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 50, paddingVertical: 22, borderRadius: 100, marginBottom: 28 },
  finalCtaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  finalCtaFeatures: { flexDirection: 'row', gap: 28, flexWrap: 'wrap', justifyContent: 'center' },
  finalCtaFeature: { fontFamily: SYSTEM_FONT, fontSize: 14, color: 'rgba(255,255,255,0.75)' },
});