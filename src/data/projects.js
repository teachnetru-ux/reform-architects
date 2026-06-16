/**
 * Reform Architects — проекты и категории.
 *
 * Единая структура у ВСЕХ проектов (по образцу Luciano 74): эссенция,
 * контекст (Задача / Ограничения / Решение), ключевая идея + герой-приём.
 * Где реального текста ещё нет — единый плейсхолдер PLACEHOLDER, чтобы потом
 * легко найти и заменить.
 *
 *  • Мета (площадь · год · статус · город) — пока не задана (null), не выводится.
 *  • Изображения — слоты (см. resolveImage): кладёте растр с тем же именем в
 *    public/img/ — заглушка заменяется автоматически.
 *  • `featured: true` — проект попадает в избранный грид на главной
 *    (грид главной = только избранные; полный список — в каталоге).
 */

/** @typedef {'apartments'|'houses'|'restaurants'} CategoryKey */

/** Единый плейсхолдер для незаполненного текста (легко найти/заменить). */
export const PLACEHOLDER = '[Текст будет добавлен]';

/**
 * Сборка проекта с единой структурой и плейсхолдерами по умолчанию.
 * `data` перекрывает дефолты; cover / heroMedia / gallery выводятся из slug.
 */
function project(data) {
  const { slug, galleryCount = 3, gallery, ...rest } = data;
  const autoGallery = Array.from({ length: galleryCount }, (_, i) => ({
    name: `${slug}-${String(i + 1).padStart(2, '0')}`,
    caption: null,
  }));
  return {
    slug,
    area: null,
    year: null,
    status: null,
    city: null,
    essence: PLACEHOLDER,
    context: { task: PLACEHOLDER, limits: PLACEHOLDER, solution: PLACEHOLDER },
    idea: PLACEHOLDER,
    hero: PLACEHOLDER,
    featured: false,
    ...rest,
    cover: `${slug}-cover`,
    heroMedia: `${slug}-hero`,
    gallery: gallery ?? autoGallery,
  };
}

export const projects = [
  // Единственный проект с реальным текстом-примером (бывш. Luciano).
  {
    slug: 'luciano-74',
    name: 'Luciano 74',
    type: 'Интерьер',
    category: 'apartments',
    order: 1,
    featured: true,
    area: null,
    year: null,
    status: null,
    city: null,
    essence:
      'Спокойный интерьер для постоянной жизни: архитектурная логика, свет и тактильные материалы вместо декора ради декора.',
    context: {
      task: 'Спокойный современный интерьер для постоянного проживания, без перегруженности формой и цветом.',
      limits: 'Работа в существующей планировке и строгий бюджетный контур.',
      solution:
        'Перепланировка общественной зоны, усиление естественного света, интеграция инженерии в архитектуру пространства.',
    },
    idea:
      'Нейтральная база и тактильные материалы — камень, дерево, текстиль; общественная зона открытая и цельная, приватная — тише; акцент на пропорциях и чистоте линий.',
    hero: 'Поворотная стеклянная перегородка на 360° в мастер-зоне.',
    cover: 'luciano-74-cover',
    heroMedia: 'luciano-74-hero',
    gallery: [
      { name: 'luciano-74-01', caption: 'Общественная зона: открытая и цельная' },
      { name: 'luciano-74-02', caption: 'Тактильные материалы: камень, дерево, текстиль' },
      { name: 'luciano-74-03', caption: 'Приватная зона: тише и собраннее' },
      { name: 'luciano-74-04', caption: 'Мастер-зона: поворотная стеклянная перегородка' },
    ],
  },

  // Остальные текущие проекты — единая структура, текст-плейсхолдеры.
  project({
    slug: 'sheremetyevskaya',
    name: 'Апартаменты Шереметьевская',
    type: 'Интерьер',
    category: 'apartments',
    order: 2,
    featured: true,
  }),
  project({
    slug: 'porto',
    name: 'Porto',
    type: 'Коммерция',
    category: 'restaurants',
    order: 3,
    featured: true,
    city: 'Франция',
  }),
  project({
    slug: 'bereg-terrace',
    name: 'Bereg Terrace',
    type: 'Интерьер',
    category: 'apartments',
    order: 4,
    featured: true,
  }),
  project({
    slug: 'sornaar-house',
    name: 'Sornaar House',
    type: 'Архитектура',
    category: 'houses',
    order: 5,
    featured: true,
  }),
  project({
    slug: 'palandia',
    name: 'Palandia',
    type: 'Архитектура',
    category: 'houses',
    order: 6,
    featured: true,
  }),

  // Новые проекты (Интерьер) — в общий каталог; на главную не выносим.
  project({ slug: 'altyn-yar', name: 'Апартаменты Алтын Яр', type: 'Интерьер', category: 'apartments', order: 7 }),
  project({ slug: 'luciano-54', name: 'Luciano 54', type: 'Интерьер', category: 'apartments', order: 8 }),
  project({ slug: 'luciano-88', name: 'Luciano 88', type: 'Интерьер', category: 'apartments', order: 9 }),
  project({ slug: 'moy-ritm', name: 'Апартаменты Мой Ритм', type: 'Интерьер', category: 'apartments', order: 10 }),
  project({ slug: 'sovushki', name: 'Совушки', type: 'Интерьер', category: 'apartments', order: 11 }),
];

/** Категории каталога (H1 + лид + нижний CTA). Тексты — из копирайта. */
export const categories = {
  all: {
    key: 'all',
    slug: 'all',
    href: '/projects/',
    nav: 'Все проекты',
    title: 'Проекты',
    lead: 'Эстетика и реализация — единый процесс. Проекты, где видна система.',
    ctaNote: 'Расскажите, что планируете — предложим следующий шаг.',
  },
  apartments: {
    key: 'apartments',
    slug: 'apartments',
    href: '/projects/apartments/',
    nav: 'Квартиры и апартаменты',
    title: 'Квартиры и апартаменты',
    lead: 'Интерьеры для постоянной жизни — спокойные, тактильные, собранные на архитектурной логике, а не на трендах. Ведём проект под ключ: планировка, концепция, рабочая документация, комплектация и авторский надзор. Вы въезжаете в готовое пространство, не управляя подрядчиками сами.',
    ctaNote: 'Не нашли похожий проект? Расскажите задачу — предложим следующий шаг.',
  },
  houses: {
    key: 'houses',
    slug: 'houses',
    href: '/projects/houses/',
    nav: 'Дома и виллы',
    title: 'Дома и виллы',
    lead: 'Дома и виллы, собранные под участок, образ жизни и реальный бюджет реализации. Ведём от посадки на участок и объёмного решения до рабочей документации, инженерии и авторского надзора на стройке. Архитектура, интерьер и реализация — в одном контуре ответственности.',
    ctaNote: 'Планируете дом или резиденцию? Расскажите про участок и задачу — предложим следующий шаг.',
  },
  restaurants: {
    key: 'restaurants',
    slug: 'restaurants',
    href: '/projects/restaurants/',
    nav: 'Рестораны и бутики',
    title: 'Рестораны и бутики',
    lead: 'Интерьер как инструмент бизнеса. Проектируем рестораны и бутики, где сценарий движения гостя, свет и материалы работают на выручку, а не только на картинку. Ведём от концепции до реализации — с расчётом на эксплуатацию и реальный бюджет.',
    ctaNote: 'Открываете точку или обновляете пространство? Расскажите про формат и локацию — предложим следующий шаг.',
  },
};

/** Порядок табов каталога (Девелоперам ведёт на /developers/). */
export const projectTabs = [
  { key: 'apartments', label: 'Квартиры и апартаменты', href: '/projects/apartments/' },
  { key: 'houses', label: 'Дома и виллы', href: '/projects/houses/' },
  { key: 'restaurants', label: 'Рестораны и бутики', href: '/projects/restaurants/' },
  { key: 'developers', label: 'Девелоперам', href: '/developers/', external: true },
  { key: 'all', label: 'Все проекты', href: '/projects/' },
];

/** Избранное для главной (грид главной = только избранные проекты). */
export const showcase = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);

/** Полный каталог — все проекты по порядку. */
export const allProjects = [...projects].sort((a, b) => a.order - b.order);

export const getByCategory = (key) =>
  key === 'all' ? allProjects : allProjects.filter((p) => p.category === key);

export const getProject = (slug) => projects.find((p) => p.slug === slug);

/** Состав работ карточки проекта (Блок 6 шаблона 2.5). */
export const projectScope = [
  'Проектирование',
  'Рабочая документация',
  'BIM-координация',
  'Спецификации и комплектация',
  'Авторский надзор',
  'Реализация',
];
