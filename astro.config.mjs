// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

/**
 * Деплой-цель — reg.ru (ISPmanager), сайт в КОРНЕ домена reform-architects.ru
 * (автодеплой по FTP, см. .github/workflows/deploy.yml).
 *
 * `base` не задаём → сайт обслуживается из корня, все ссылки/ассеты/картинки
 * root-relative (`/projects/`, `/img/…`, `/_astro/…`). helper withBase()
 * (src/lib/img.js) при base='/' просто отдаёт путь от корня.
 */
export default defineConfig({
  site: 'https://reform-architects.ru',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
});
