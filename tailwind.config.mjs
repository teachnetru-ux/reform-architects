/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      // ── Палитра (чистый монохром; цвет дают только фото) ──────────────
      colors: {
        ink: '#141414',
        surface: {
          dark: '#161616',
          light: '#F2F1EC',
        },
        ondark: '#F4F2EC',
        muted: {
          dark: 'rgba(244,242,236,0.55)',
          light: '#6a6a66',
        },
        line: {
          dark: 'rgba(244,242,236,0.12)',
          light: 'rgba(20,20,20,0.14)',
        },
      },

      // ── Шрифт: одно семейство на весь сайт (Montserrat), задано в fonts.css ──
      fontFamily: {
        sans: ['var(--font-sans)'],
        // алиас на случай старых ссылок; серифа в макете нет
        serif: ['var(--font-sans)'],
      },

      // ── Радиусы ───────────────────────────────────────────────────────
      borderRadius: {
        pill: '30px',
        glass: '22px',
        photo: '4px',
      },

      // ── Трекинг лейблов/меты ─────────────────────────────────────────
      letterSpacing: {
        label: '0.2em',
        meta: '0.16em',
      },

      // ── Тип-шкала (fluid, clamp) ─────────────────────────────────────
      fontSize: {
        display: ['clamp(2.6rem, 1.5rem + 4.6vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.875rem, 1.1rem + 2.8vw, 2.75rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.5rem, 1.1rem + 1.5vw, 2rem)', { lineHeight: '1.16', letterSpacing: '-0.01em' }],
        project: ['clamp(1.75rem, 1.2rem + 1.9vw, 2rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        lead: ['clamp(1.0625rem, 1rem + 0.35vw, 1.1875rem)', { lineHeight: '1.55' }],
        meta: ['0.6875rem', { lineHeight: '1.45', letterSpacing: '0.16em' }],
        label: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.2em' }],
      },

      maxWidth: {
        content: '1320px',
        prose: '62ch',
      },

      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
