// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

/**
 * Деплой-цель — GitHub Pages (project site):
 *   https://teachnetru-ux.github.io/reform-architects/
 * Поэтому base = '/reform-architects'. Все ссылки на ассеты и страницы
 * проходят через helper withBase() (src/lib/img.js), который подставляет base.
 *
 * Кастомный домен (например reform-architects.ru):
 *   — поставьте base: '/' и site: 'https://reform-architects.ru'
 *   — положите файл public/CNAME с доменом
 *   — обновите --font-serif/--font-sans пути в fonts.css при self-host шрифтов.
 */
export default defineConfig({
  site: 'https://teachnetru-ux.github.io',
  base: '/reform-architects',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
});
