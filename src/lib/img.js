/**
 * Reform Architects — base-префикс и авто-подстановка изображений.
 *
 * Этот модуль импортируется ТОЛЬКО во frontmatter .astro-компонентов,
 * то есть выполняется на этапе сборки (Node), а не в браузере.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = import.meta.env.BASE_URL || '/';

/**
 * Подставляет base-префикс GitHub Pages к внутренним путям.
 * Внешние ссылки, mailto:, tel:, и якоря #... пропускаются как есть.
 * @param {string} p
 * @returns {string}
 */
export function withBase(p = '') {
  const s = String(p);
  if (
    s === '' ||
    /^(https?:)?\/\//i.test(s) ||
    s.startsWith('mailto:') ||
    s.startsWith('tel:') ||
    s.startsWith('#') ||
    s.startsWith('data:')
  ) {
    return s;
  }
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rest = s.startsWith('/') ? s : `/${s}`;
  return `${base}${rest}`;
}

// Папка со слотами/реальными изображениями (копируется в вывод как есть).
const IMG_DIR = path.join(process.cwd(), 'public', 'img');
// Приоритет растровых форматов поверх SVG-заглушки.
const RASTER_EXT = ['.webp', '.avif', '.jpg', '.jpeg', '.png'];

/**
 * Авто-подстановка: если рядом с заглушкой `name.svg` лежит растровый
 * `name.jpg|.webp|.avif|.png` — берём его; иначе остаётся SVG-заглушка.
 * Менять код под каждое фото не нужно: достаточно положить файл с тем же именем.
 *
 * @param {string} name базовое имя без расширения, напр. 'luciano-01'
 * @returns {{ src: string, isPlaceholder: boolean, format: string }}
 */
export function resolveImage(name) {
  const clean = String(name).replace(/\.(svg|png|jpe?g|webp|avif)$/i, '');
  for (const ext of RASTER_EXT) {
    const candidate = path.join(IMG_DIR, clean + ext);
    if (fs.existsSync(candidate)) {
      return { src: withBase(`/img/${clean}${ext}`), isPlaceholder: false, format: ext.slice(1) };
    }
  }
  return { src: withBase(`/img/${clean}.svg`), isPlaceholder: true, format: 'svg' };
}
