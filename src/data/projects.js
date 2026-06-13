/**
 * Reform Architects — проекты и категории.
 *
 * ВАЖНО (по брифу — ничего не выдумываем):
 *  • Эталонная мета (площадь · год · статус · город) в копирайте НЕ задана —
 *    это «открытая задача» (эталонный список проектов). Поля ниже = null и
 *    рендерятся с graceful-деградацией (пустые просто не показываются).
 *    Когда придёт таблица — заполняем здесь, код менять не нужно.
 *  • Строка-идея/эссенция/контекст есть только у Luciano (пример в брифе).
 *    У остальных не сочиняем — поля null, ряд остаётся в стиле Lines.
 *  • Изображения — слоты (см. resolveImage): кладёте растр с тем же именем —
 *    заглушка заменяется автоматически.
 */

/** @typedef {'apartments'|'houses'|'restaurants'} CategoryKey */

export const projects = [
  {
    slug: 'luciano',
    name: 'Luciano',
    type: 'Интерьер',
    category: 'apartments',
    order: 1,
    // мета (источник истины — эталонный список; пока не задано)
    area: null,
    year: null,
    status: null,
    city: null,
    // строка-идея для редакционного ряда (есть только здесь)
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
    cover: 'luciano-cover',
    heroMedia: 'luciano-hero',
    gallery: [
      { name: 'luciano-01', caption: 'Общественная зона: открытая и цельная' },
      { name: 'luciano-02', caption: 'Тактильные материалы: камень, дерево, текстиль' },
      { name: 'luciano-03', caption: 'Приватная зона: тише и собраннее' },
      { name: 'luciano-04', caption: 'Мастер-зона: поворотная стеклянная перегородка' },
    ],
  },
  {
    slug: 'podluzhnaya',
    name: 'Апартаменты Подлужная',
    type: 'Интерьер',
    category: 'apartments',
    order: 2,
    area: null,
    year: null,
    status: null,
    city: null,
    essence: null,
    context: null,
    idea: null,
    hero: null,
    cover: 'podluzhnaya-cover',
    heroMedia: 'podluzhnaya-hero',
    gallery: [
      { name: 'podluzhnaya-01', caption: null },
      { name: 'podluzhnaya-02', caption: null },
      { name: 'podluzhnaya-03', caption: null },
    ],
  },
  {
    slug: 'porto',
    name: 'Porto',
    type: 'Коммерция',
    category: 'restaurants',
    order: 3,
    area: null,
    year: null,
    status: null,
    city: 'Франция',
    essence: null,
    context: null,
    idea: null,
    hero: null,
    cover: 'porto-cover',
    heroMedia: 'porto-hero',
    feature: true, // «показать крупно и солидно»
    gallery: [
      { name: 'porto-01', caption: null },
      { name: 'porto-02', caption: null },
      { name: 'porto-03', caption: null },
    ],
  },
  {
    slug: 'bereg-terrace',
    name: 'Bereg Terrace',
    type: 'Интерьер',
    category: 'apartments',
    order: 4,
    area: null,
    year: null,
    status: null,
    city: null,
    essence: null,
    context: null,
    idea: null,
    hero: null,
    cover: 'bereg-terrace-cover',
    heroMedia: 'bereg-terrace-hero',
    gallery: [
      { name: 'bereg-terrace-01', caption: null },
      { name: 'bereg-terrace-02', caption: null },
      { name: 'bereg-terrace-03', caption: null },
    ],
  },
  {
    slug: 'sornaar-house',
    name: 'Sornaar House',
    type: 'Архитектура',
    category: 'houses',
    order: 5,
    area: null,
    year: null,
    status: null,
    city: null,
    essence: null,
    context: null,
    idea: null,
    hero: null,
    cover: 'sornaar-house-cover',
    heroMedia: 'sornaar-house-hero',
    gallery: [
      { name: 'sornaar-house-01', caption: null },
      { name: 'sornaar-house-02', caption: null },
      { name: 'sornaar-house-03', caption: null },
    ],
  },
  {
    slug: 'palandia',
    name: 'Palandia',
    type: 'Архитектура',
    category: 'houses',
    order: 6,
    area: null,
    year: null,
    status: null,
    city: null,
    essence: null,
    context: null,
    idea: null,
    hero: null,
    cover: 'palandia-cover',
    heroMedia: 'palandia-hero',
    gallery: [
      { name: 'palandia-01', caption: null },
      { name: 'palandia-02', caption: null },
      { name: 'palandia-03', caption: null },
    ],
  },
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

/** Витрина главной — строго по порядку из копирайта (order 1…6). */
export const showcase = [...projects].sort((a, b) => a.order - b.order);

export const getByCategory = (key) =>
  key === 'all' ? showcase : showcase.filter((p) => p.category === key);

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
