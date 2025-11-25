// lib/structured-data.ts
// Utility for adding Schema.org structured data (JSON-LD) to pages

import { Platform } from 'react-native';

/**
 * Organization Schema - Use on homepage
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'CrackJobs',
  alternateName: 'CrackJobs Interview Platform',
  url: 'https://crackjobs.com',
  logo: 'https://crackjobs.com/assets/logo.png',
  description: 'Master your interview skills with expert mentors. Practice mock interviews and land your dream job.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'crackjobshelpdesk@gmail.com',
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://twitter.com/crackjobs',
    'https://linkedin.com/company/crackjobs',
    'https://facebook.com/crackjobs',
    'https://instagram.com/crackjobs',
  ],
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
};

/**
 * Service Schema - Use on role-specific pages
 */
export const createServiceSchema = (roleName: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: `${roleName} Interview Preparation`,
  provider: {
    '@type': 'Organization',
    name: 'CrackJobs',
    url: 'https://crackjobs.com',
  },
  description: description,
  serviceType: 'Career Coaching',
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'Job Seekers',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    price: '1500',
    priceValidUntil: '2025-12-31',
    availability: 'https://schema.org/InStock',
  },
});

/**
 * FAQ Schema - Use on FAQ page
 */
export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/**
 * Article Schema - Use on blog posts
 */
export const createArticleSchema = (
  title: string,
  description: string,
  datePublished: string,
  dateModified: string,
  imageUrl: string,
  authorName: string = 'CrackJobs Team'
) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description: description,
  image: imageUrl,
  datePublished: datePublished,
  dateModified: dateModified,
  author: {
    '@type': 'Organization',
    name: authorName,
  },
  publisher: {
    '@type': 'Organization',
    name: 'CrackJobs',
    logo: {
      '@type': 'ImageObject',
      url: 'https://crackjobs.com/assets/logo.png',
    },
  },
});

/**
 * BreadcrumbList Schema - Use on all pages for navigation
 */
export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Product Schema - Use on service/pricing pages
 */
export const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Mock Interview Session',
  description: 'Professional mock interview with industry expert including detailed feedback and session recording',
  brand: {
    '@type': 'Brand',
    name: 'CrackJobs',
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '1500',
    highPrice: '3000',
    offerCount: '100',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '500',
  },
};

/**
 * WebSite Schema - Use on homepage for search
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CrackJobs',
  url: 'https://crackjobs.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://crackjobs.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

/**
 * Helper function to inject structured data into page head
 * Use this in useEffect on web pages
 */
export const injectStructuredData = (schemaData: object): (() => void) | undefined => {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return undefined;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  script.setAttribute('data-structured-data', 'true');
  document.head.appendChild(script);

  // Return cleanup function
  return () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
};

/**
 * Helper to inject multiple schemas at once
 */
export const injectMultipleSchemas = (schemas: object[]): (() => void) | undefined => {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return undefined;
  }

  const cleanupFunctions: Array<() => void> = [];

  schemas.forEach((schemaData) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    script.setAttribute('data-structured-data', 'true');
    document.head.appendChild(script);

    cleanupFunctions.push(() => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
  });

  // Return combined cleanup function
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
};