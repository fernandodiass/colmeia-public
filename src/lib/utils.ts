// src/lib/utils.ts
// Funções utilitárias compartilhadas no projeto

// ── Tipografia / texto ───────────────────────────────────────────────────────

/** Remove tags HTML e retorna texto puro */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/** Trunca texto no limite de caracteres sem cortar palavras */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(' ', maxLength)) + '…';
}

/** Converte slug para texto legível: "astro-vs-nextjs" → "Astro Vs Nextjs" */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Gera slug a partir de texto: "Título do Artigo" → "titulo-do-artigo" */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ── Leitura ─────────────────────────────────────────────────────────────────

/** Calcula tempo de leitura estimado em minutos (200 palavras/min padrão técnico) */
export function calcReadingTime(text: string, wpm = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wpm));
}

// ── Datas ────────────────────────────────────────────────────────────────────

const LOCALE = 'pt-BR';

/** Formata data para exibição: "20 de maio de 2025" */
export function formatDate(date: Date, style: 'long' | 'short' | 'numeric' = 'long'): string {
  const options: Intl.DateTimeFormatOptions =
    style === 'long'    ? { day: 'numeric', month: 'long', year: 'numeric' } :
    style === 'short'   ? { day: '2-digit', month: 'short', year: 'numeric' } :
                          { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString(LOCALE, options);
}

/** Retorna tempo relativo: "há 3 dias", "há 2 meses" */
export function timeAgo(date: Date): string {
  const rtf  = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
  const diff = (date.getTime() - Date.now()) / 1000;

  const thresholds: [number, Intl.RelativeTimeFormatUnit][] = [
    [60,       'second'],
    [3600,     'minute'],
    [86400,    'hour'],
    [2592000,  'day'],
    [31536000, 'month'],
  ];

  for (const [seconds, unit] of thresholds) {
    if (Math.abs(diff) < seconds) {
      const divisor = unit === 'second' ? 1 :
                      unit === 'minute' ? 60 :
                      unit === 'hour'   ? 3600 :
                      unit === 'day'    ? 86400 : 2592000;
      return rtf.format(Math.round(diff / divisor), unit);
    }
  }
  return rtf.format(Math.round(diff / 31536000), 'year');
}

// ── URLs / OG ────────────────────────────────────────────────────────────────

const SITE = 'https://colmeiapublic.com.br';

/** Garante URL absoluta a partir de um path relativo ou URL já absoluta */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** Monta URL da OG image gerada dinamicamente (futuro: Cloudflare Image Resizing) */
export function ogImageUrl(opts: {
  title?: string;
  category?: string;
  slug?: string;
}): string {
  // Quando implementar geração dinâmica de OG:
  // return `${SITE}/api/og?title=${encodeURIComponent(opts.title ?? '')}&category=${opts.category ?? ''}`;
  return `${SITE}/og-default.jpg`;
}

// ── Arrays / coleções ────────────────────────────────────────────────────────

/** Embaralha array (Fisher-Yates) — útil para related posts aleatórios */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Agrupa array por chave */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key]);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/** Remove duplicatas de array de objetos por chave */
export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}
