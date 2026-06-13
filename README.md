# Reform Architects

Премиальный сайт архитектурного бюро полного цикла. Тихий люкс / редакционный
минимализм, чистый монохром — цвет дают только фотографии проектов.

**Стек:** [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com)
→ статический вывод в `dist/`, хостинг на **GitHub Pages**.

---

## Быстрый старт

```bash
npm install
npm run dev        # локальный сервер → http://localhost:4321/reform-architects/
npm run build      # генерирует SVG-заглушки + статическую сборку в dist/
npm run preview    # предпросмотр собранного сайта
```

> Node 18+ (разрабатывалось на Node 22). `npm run build` сам запускает
> генерацию заглушек (`npm run placeholders`).

---

## Источники истины

| Что | Где |
|---|---|
| Контент, тексты, структура страниц | `reform_copy_final.md` |
| Дизайн-система (палитра, типографика, сетка, интеракции) | `reform_design_tz.md` |
| Лого (вордмарк) | `full-logo.png` (в шапке/подвале отрисован живым текстом Baskervville) |
| Данные проектов / категорий | `src/data/projects.js` |
| Сквозной копирайт (философия, процесс, девелоперы) | `src/data/content.js` |
| Навигация, контакты, словарь CTA, endpoint форм | `src/data/site.js` |

Копирайт берётся строго из `reform_copy_final.md`. Кейсы, отзывы, награды и
числовая мета проектов **не выдуманы** (см. «Открытые задачи» ниже).

---

## 🖼 Автоподстановка изображений (главное)

Каждый слот под фото/видео — это **именованная SVG-заглушка** в `public/img/`
(`hero.svg`, `luciano-cover.svg`, `luciano-01.svg`, …). Превью никогда не
ломается.

**Чтобы поставить реальное фото — просто положите растровый файл с тем же именем**
рядом с заглушкой в `public/img/`:

```
public/img/luciano-cover.svg   ← заглушка (остаётся как fallback)
public/img/luciano-cover.jpg   ← положите это → сборка подставит его автоматически
```

- Приоритет форматов: `.webp` → `.avif` → `.jpg` → `.jpeg` → `.png`.
- Если растра нет — остаётся SVG-заглушка.
- Менять код под каждое фото **не нужно**. Логика — в `src/lib/img.js`
  (`resolveImage`), отрабатывает на этапе сборки.
- Base-префикс GitHub Pages подставляется автоматически (`withBase`).

Заглушки перегенерируются из списка проектов: `npm run placeholders`
(`scripts/make-placeholders.mjs`). Добавили проект в `projects.js` — заглушки
для его слотов создадутся сами.

---

## 🔤 Шрифты

Дев-режим использует лицензионно чистые Google-аналоги (подключены `<link>` в
`src/components/Layout.astro`):

- **Baskervville** — бренд-сериф (близок к Baskerville Old Face): заголовки, лого.
- **Jost** — UI-гротеск (вместо Century Gothic): навигация, мета, body.

**Своп на лицензионные файлы** (Baskerville Old Face + Century Gothic): см.
подробную инструкцию в `src/styles/fonts.css` — кладёте `.woff2` в
`public/fonts/`, раскомментируете `@font-face` и второй блок `:root`. Структура
CSS-переменных (`--font-serif` / `--font-sans`) не меняется.

---

## 📨 Формы

Две конфигурации: частная (`LeadForm` — Имя · Телефон · Тип объекта) и B2B
(`B2BForm` — Компания · Проект/ЖК · Роль · Контакт).

По умолчанию — **демо-режим** (без бэкенда): форма валидируется и показывает
подтверждение, ничего не отправляя. Чтобы принимать заявки, впишите URL
обработчика (Formspree, Getform, свой endpoint) в `src/data/site.js`:

```js
formEndpoint: 'https://formspree.io/f/xxxxxxx',
```

Тогда формы начнут `POST`-ить туда нативно.

---

## 🎨 Дизайн-токены

`tailwind.config.mjs` — единственный источник токенов:

- **Цвет:** `ink #141414`, `surface.dark #161616`, `surface.light #F2F1EC`,
  `ondark #F4F2EC`, `muted.*`, `line.*`. Акцентного цвета нет.
- **Шрифты:** `font-serif` / `font-sans` (через CSS-переменные).
- **Радиусы:** `pill 30px`, `glass 22px`, `photo 4px`.
- **Стекло** (`.glass-dark` / `.glass-light`) — только шапка, капсула CTA в hero,
  cookie-плашка.

> Один осознанный отход от ТЗ: вторичный серый на светлом затемнён
> `#8E8E8A → #6A6A66` ради контраста WCAG AA для мелкого текста (доступность —
> тоже требование ТЗ). Монохромный характер сохранён.

---

## 🚀 Деплой на GitHub Pages

Уже настроен GitHub Actions: `.github/workflows/deploy.yml` (сборка через
`withastro/action` + `actions/deploy-pages`).

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Пуш в `main` → workflow собирает и публикует сайт на
   `https://teachnetru-ux.github.io/reform-architects/`.

**Кастомный домен** (например `reform-architects.ru`):
- в `astro.config.mjs` поставьте `base: '/'` и `site: 'https://reform-architects.ru'`;
- добавьте файл `public/CNAME` с доменом;
- (опц.) обновите пути шрифтов в `fonts.css` при self-host.

Альтернативно (Vercel/Netlify): команда сборки `npm run build`, каталог вывода
`dist`. Для корневого домена так же поставьте `base: '/'`.

---

## ♿ Качество и доступность

- Семантическая разметка, один `<h1>` на страницу, корректный порядок заголовков.
- Видимый фокус с клавиатуры (контрастный и на инвертированных кнопках/пилюлях).
- `prefers-reduced-motion` отключает плашки-перехват и reveal-анимации.
- Все изображения с осмысленным `alt`; декоративные — скрыты от скринридеров.
- Ленивая загрузка изображений, `fetchpriority` на hero.
- SEO: `title`/`description`/canonical, OpenGraph + Twitter, JSON-LD Organization,
  человекочитаемые URL, `sitemap-index.xml`, `robots.txt`.
- Сигнатурная интеракция (плашки сегментов) работает мышью, клавиатурой и тачем.

---

## 📋 Открытые задачи (по брифу — данные, которые нельзя выдумывать)

Заполняются без правок кода:

1. **Эталонная мета проектов** (площадь · год · статус · город) — в
   `src/data/projects.js` поля `area/year/status/city` сейчас `null` и не
   отображаются. Впишите значения — появятся в карточках/мете.
2. **Реальные фото/видео** — кладите растры в `public/img/` (см. автоподстановку).
3. **Портреты основателей** — слоты `garaev`, `zakirov`.
4. **OG-превью** — положите `public/img/og-default.jpg` (1200×630) поверх
   SVG-заглушки.
5. **Юридические тексты** — страницы `/legal/*` сейчас со стаб-текстом
   («готовится»), помечены `noindex`.
6. **Строки-идеи проектов** — есть только у Luciano (пример из брифа); у
   остальных не выдуманы.

---

## 🗂 Структура

```
src/
├─ components/   Layout, Header, Footer, CookieBanner, Figure, SegmentCards,
│               ProjectCard, ProjectRow, ProjectsCatalog, FilterPills,
│               ProcessSteps, NumbersRow, SectionHeading, LeadForm, B2BForm, LegalPage
├─ data/         site.js · projects.js · content.js
├─ lib/          img.js  (withBase + resolveImage)
├─ styles/       global.css (токены/база/интеракции) · fonts.css
└─ pages/        index · developers · bureau · projects/[index|category|slug] · legal/*
public/
├─ img/          SVG-заглушки + ваши растры
├─ full-logo.png · favicon.svg · robots.txt
scripts/         make-placeholders.mjs
```
