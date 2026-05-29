// tailwind.config.mjs
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',

  theme: {
    extend: {
      // ── Fontes ──────────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },

      // ── Paleta Colmeia ───────────────────────────────────────────────────────
      colors: {
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24', // amarelo principal
          500: '#f5c400', // brand primário
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },

      // ── Tipografia (prose dos artigos) ───────────────────────────────────────
      typography: ({ theme }) => ({
        zinc: {
          css: {
            '--tw-prose-body':            theme('colors.zinc[700]'),
            '--tw-prose-headings':        theme('colors.zinc[900]'),
            '--tw-prose-lead':            theme('colors.zinc[600]'),
            '--tw-prose-links':           theme('colors.yellow[600]'),
            '--tw-prose-bold':            theme('colors.zinc[900]'),
            '--tw-prose-counters':        theme('colors.zinc[500]'),
            '--tw-prose-bullets':         theme('colors.zinc[400]'),
            '--tw-prose-hr':              theme('colors.zinc[200]'),
            '--tw-prose-quotes':          theme('colors.zinc[900]'),
            '--tw-prose-quote-borders':   theme('colors.yellow[400]'),
            '--tw-prose-captions':        theme('colors.zinc[500]'),
            '--tw-prose-code':            theme('colors.yellow[700]'),
            '--tw-prose-pre-code':        theme('colors.zinc[200]'),
            '--tw-prose-pre-bg':          theme('colors.zinc[900]'),
            '--tw-prose-th-borders':      theme('colors.zinc[300]'),
            '--tw-prose-td-borders':      theme('colors.zinc[200]'),

            // Dark mode
            '--tw-prose-invert-body':           theme('colors.zinc[300]'),
            '--tw-prose-invert-headings':        theme('colors.white'),
            '--tw-prose-invert-lead':            theme('colors.zinc[400]'),
            '--tw-prose-invert-links':           theme('colors.yellow[400]'),
            '--tw-prose-invert-bold':            theme('colors.white'),
            '--tw-prose-invert-counters':        theme('colors.zinc[400]'),
            '--tw-prose-invert-bullets':         theme('colors.zinc[600]'),
            '--tw-prose-invert-hr':              theme('colors.zinc[700]'),
            '--tw-prose-invert-quotes':          theme('colors.zinc[100]'),
            '--tw-prose-invert-quote-borders':   theme('colors.yellow[500]'),
            '--tw-prose-invert-captions':        theme('colors.zinc[400]'),
            '--tw-prose-invert-code':            theme('colors.yellow[300]'),
            '--tw-prose-invert-pre-code':        theme('colors.zinc[300]'),
            '--tw-prose-invert-pre-bg':          'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders':      theme('colors.zinc[600]'),
            '--tw-prose-invert-td-borders':      theme('colors.zinc[700]'),
          },
        },
      }),

      // ── Animações ────────────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
      },
    },
  },

  plugins: [
    (await import('@tailwindcss/typography')).default,
  ],
};
