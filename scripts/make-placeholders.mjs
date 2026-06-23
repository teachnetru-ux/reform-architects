/**
 * Reform Architects — генератор именованных SVG-заглушек.
 *
 * Для каждого слота создаётся осмысленно названный .svg (hero.svg,
 * luciano-01.svg, …) в public/img/. Это превью «не ломается».
 * Авто-замена на реальные фото — на этапе сборки (см. src/lib/img.js):
 * положите рядом растровый файл с тем же именем (.jpg/.webp/.png) — ссылка
 * подставится автоматически, SVG-заглушка останется как fallback.
 *
 * Запуск: `npm run placeholders` (входит в `npm run build`).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { projects } from '../src/data/projects.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'img');
mkdirSync(OUT, { recursive: true });

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function svg(label) {
  const text = esc(label);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${text}">
  <defs>
    <radialGradient id="g" cx="50%" cy="38%" r="82%">
      <stop offset="0" stop-color="#242422"/>
      <stop offset="1" stop-color="#111110"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <rect x="36" y="36" width="1128" height="728" fill="none" stroke="rgba(244,242,236,0.14)"/>
  <g stroke="rgba(244,242,236,0.30)" stroke-width="1.25">
    <line x1="600" y1="352" x2="600" y2="402"/>
    <line x1="575" y1="377" x2="625" y2="377"/>
  </g>
  <text x="600" y="452" text-anchor="middle" font-family="Jost, 'Century Gothic', system-ui, sans-serif" font-size="21" letter-spacing="5" fill="rgba(244,242,236,0.46)">REFORM ARCHITECTS</text>
  <text x="600" y="487" text-anchor="middle" font-family="Jost, 'Century Gothic', system-ui, sans-serif" font-size="15" letter-spacing="2.5" fill="rgba(244,242,236,0.30)">${text}</text>
</svg>
`;
}

// Статичные слоты (главная, команда, девелоперы, OG)
const slots = [
  ['hero', 'Главный экран'],
  ['seg-apartments', 'Квартиры и апартаменты'],
  ['seg-houses', 'Дома и виллы'],
  ['seg-restaurants', 'Рестораны и бутики'],
  ['seg-developers', 'Девелоперам'],
  ['garaev', 'Гараев Булат'],
  ['zakirov', 'Закиров Раиль'],
  ['developers-hero', 'Общественные пространства'],
  ['og-default', 'Reform Architects'],
];

// Слоты проектов (обложка + hero + галерея) — из data/projects.js
for (const p of projects) {
  if (p.cover) slots.push([p.cover, `${p.name} · обложка`]);
  if (p.heroMedia) slots.push([p.heroMedia, `${p.name} · hero`]);
  for (const g of [...(p.leadMedia || []), ...(p.gallery || [])]) {
    slots.push([g.name, g.caption ? `${p.name} · ${g.caption}` : `${p.name} · кадр`]);
  }
}

let count = 0;
for (const [name, label] of slots) {
  writeFileSync(join(OUT, `${name}.svg`), svg(label));
  count++;
}

console.log(`✓ Сгенерировано ${count} SVG-заглушек → public/img/`);
