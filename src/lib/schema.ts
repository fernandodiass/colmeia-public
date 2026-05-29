// src/lib/schema.ts
// Helpers de JSON-LD para Schema.org — sem dependências externas

const SITE_URL = 'https://colmeiapublic.com.br';
const SITE_NAME = 'Colmeia Public';

interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;    // ISO 8601
  updatedAt?: string;     // ISO 8601
  authorName: string;
  authorUrl?: string;
  schemaType?: 'Article' | 'HowTo' | 'FAQPage' | 'TechArticle';
}

interface HowToStep {
  name: string;
  text: string;
  imageUrl?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ── Artigo genérico ──────────────────────────────────────────────────────────
export function generateArticleSchema(input: ArticleSchemaInput): object {
  const {
    title,
    description,
    url,
    imageUrl,
    publishedAt,
    updatedAt,
    authorName,
    authorUrl,
    schemaType = 'Article',
  } = input;

  const base = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return base;
}

// ── HowTo (tutoriais passo a passo) ─────────────────────────────────────────
export function generateHowToSchema(opts: {
  name: string;
  description: string;
  url: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration, ex: "PT30M"
  estimatedCost?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.totalTime && { totalTime: opts.totalTime }),
    ...(opts.estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'BRL',
        value: opts.estimatedCost,
      },
    }),
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.imageUrl && { image: { '@type': 'ImageObject', url: s.imageUrl } }),
    })),
  };
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export function generateFAQSchema(items: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

// ── Breadcrumb ───────────────────────────────────────────────────────────────
export function generateBreadcrumbSchema(crumbs: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(({ name, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: url,
    })),
  };
}

// ── WebSite (homepage apenas) ────────────────────────────────────────────────
export function generateWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/busca?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
