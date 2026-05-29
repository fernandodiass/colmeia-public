// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// ─────────────────────────────────────────────
// Schema base compartilhado por todas as coleções
// ─────────────────────────────────────────────
const baseArticleSchema = z.object({
  // Identidade
  title: z.string().min(10).max(80),
  description: z.string().min(50).max(160), // ideal para meta description
  excerpt: z.string().max(280).optional(),  // usado em cards de listagem

  // Datas
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),

  // Autoria
  author: z.object({
    name: z.string(),
    avatar: z.string().optional(), // path relativo a /public
    bio: z.string().max(200).optional(),
    twitter: z.string().optional(),
  }).default({ name: 'Colmeia Public' }),

  // Imagens
  cover: z.object({
    src: z.string(),           // path relativo a /src/assets ou URL
    alt: z.string(),
    caption: z.string().optional(),
  }).optional(),
  ogImage: z.string().optional(), // URL absoluta ou path, sobrescreve cover para OG

  // Taxonomia
  category: z.enum(['design', 'dev', 'marketing', 'ia']),
  tags: z.array(z.string()).default([]),

  // SEO avançado
  seo: z.object({
    title: z.string().max(60).optional(),        // sobrescreve title no <head>
    noindex: z.boolean().default(false),
    canonical: z.string().url().optional(),       // canonical externo, se necessário
    schemaType: z.enum(['Article', 'HowTo', 'FAQPage', 'TechArticle'])
                 .default('Article'),
  }).optional(),

  // Monetização / Conversão
  cta: z.object({
    type: z.enum(['newsletter', 'product', 'none']).default('newsletter'),
    productId: z.string().optional(),  // referência ao produto para CTA inline
    position: z.enum(['top', 'mid', 'bottom', 'all']).default('bottom'),
  }).optional(),

  // Controle de publicação
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),

  // Metadados editoriais
  readingTime: z.number().optional(),    // minutos — calculado automaticamente se omitido
  difficulty: z.enum(['iniciante', 'intermediário', 'avançado']).optional(),
  tools: z.array(z.string()).default([]), // ferramentas mencionadas no artigo
});

// ─────────────────────────────────────────────
// Coleções por categoria (schema idêntico, rotas separadas)
// ─────────────────────────────────────────────
const designCollection = defineCollection({
  type: 'content',
  schema: baseArticleSchema,
});

const devCollection = defineCollection({
  type: 'content',
  schema: baseArticleSchema,
});

const marketingCollection = defineCollection({
  type: 'content',
  schema: baseArticleSchema,
});

const iaCollection = defineCollection({
  type: 'content',
  schema: baseArticleSchema,
});

export const collections = {
  design: designCollection,
  dev: devCollection,
  marketing: marketingCollection,
  ia: iaCollection,
};

// ─────────────────────────────────────────────
// Tipos utilitários exportados
// ─────────────────────────────────────────────
export type ArticleFrontmatter = z.infer<typeof baseArticleSchema>;
export type Category = ArticleFrontmatter['category'];
export type Difficulty = NonNullable<ArticleFrontmatter['difficulty']>;
