// src/pages/sitemap.xml.ts
// Sitemap manual como fallback / complemento ao @astrojs/sitemap
// Garante controle total de prioridade e changefreq por tipo de página.
// O @astrojs/sitemap no astro.config.mjs já gera o /sitemap-index.xml;
// este arquivo expõe um /sitemap.xml tradicional para ferramentas legadas.

import type { APIRoute } from 'astro';
// import { getCollection } from 'astro:content';

const SITE = 'https://colmeiapublic.com.br';

type SitemapEntry = {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

function xmlEntry({ url, lastmod, changefreq = 'weekly', priority = 0.7 }: SitemapEntry): string {
  return `
  <url>
    <loc>${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`.trim();
}

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().split('T')[0];

  // ── Páginas estáticas ───────────────────────────────────────────────────────
  const staticPages: SitemapEntry[] = [
    { url: SITE,                    changefreq: 'daily',  priority: 1.0,  lastmod: today },
    { url: `${SITE}/blog`,          changefreq: 'daily',  priority: 0.9,  lastmod: today },
    { url: `${SITE}/design`,        changefreq: 'weekly', priority: 0.85, lastmod: today },
    { url: `${SITE}/dev`,           changefreq: 'weekly', priority: 0.85, lastmod: today },
    { url: `${SITE}/marketing`,     changefreq: 'weekly', priority: 0.85, lastmod: today },
    { url: `${SITE}/ia`,            changefreq: 'weekly', priority: 0.85, lastmod: today },
    { url: `${SITE}/sobre`,         changefreq: 'monthly', priority: 0.5, lastmod: today },
    { url: `${SITE}/contato`,       changefreq: 'monthly', priority: 0.4, lastmod: today },
    { url: `${SITE}/privacidade`,   changefreq: 'yearly',  priority: 0.3, lastmod: today },
    { url: `${SITE}/termos`,        changefreq: 'yearly',  priority: 0.3, lastmod: today },
  ];

  // ── Artigos dinâmicos ───────────────────────────────────────────────────────
  // Descomente quando tiver artigos publicados:
  //
  // type ValidCollection = 'design' | 'dev' | 'marketing' | 'ia';
  // const COLS: ValidCollection[] = ['design', 'dev', 'marketing', 'ia'];
  // const allPosts = (
  //   await Promise.all(COLS.map(col =>
  //     getCollection(col, ({ data }) => !data.draft)
  //       .then(posts => posts.map(p => ({ ...p, col })))
  //   ))
  // ).flat();
  //
  // const postEntries: SitemapEntry[] = allPosts.map(post => ({
  //   url:        `${SITE}/${post.col}/${post.slug}`,
  //   lastmod:    (post.data.updatedAt ?? post.data.publishedAt).toISOString().split('T')[0],
  //   changefreq: 'monthly',
  //   priority:   post.data.featured ? 0.9 : 0.75,
  // }));
  //
  // const allEntries = [...staticPages, ...postEntries];

  const allEntries = staticPages; // remover quando ativar bloco acima

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${allEntries.map(xmlEntry).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
