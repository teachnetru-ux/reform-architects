/**
 * Reform Architects — сквозные данные сайта.
 * Чистые данные (без base-префикса): префикс подставляется в компонентах
 * через withBase(), чтобы файл можно было импортировать и в node-скриптах.
 */

export const site = {
  name: 'Reform Architects',
  tagline: 'архитектурное бюро полного цикла',
  domain: 'reform-architects.ru',
  email: 'hello@reform-architects.ru',
  phone: '+7 (995) 008-27-27',
  phoneHref: '+79950082727',
  established: 2016,
  copyrightYears: '2016–2026',

  cta: {
    private: 'Обсудить Ваш проект',
    b2b: 'Запросить встречу',
  },

  /**
   * Endpoint форм. Пусто = демо-режим (без реальной отправки, показывает
   * сообщение об успехе). Чтобы подключить приём заявок — впишите URL
   * Formspree / собственного обработчика, форма начнёт POST'ить туда.
   */
  formEndpoint: '',

  nav: [
    { label: 'Проекты', href: '/projects/' },
    { label: 'Девелоперам', href: '/developers/' },
    { label: 'Контакты', href: '#contact' },
  ],

  legal: [
    { label: 'Политика конфиденциальности', href: '/legal/privacy/' },
    { label: 'Согласие на обработку данных', href: '/legal/consent/' },
    { label: 'Политика использования cookie', href: '/legal/cookie/' },
  ],

  /** Мессенджеры и поддержка (внешние ссылки). */
  chats: [
    { label: 'Telegram', href: 'https://t.me/reform_architects' },
    { label: 'МАКС', href: 'https://t.me/reform_architects' },
  ],
  support: {
    label: 'Чат-поддержки',
    href: 'https://t.me/reform_architect',
    hours: 'ежедневно с 9:00 до 21:00',
  },

  /** Реквизиты (мелкий приглушённый блок внизу подвала). */
  legalEntity: ['ИП Закиров Раиль Каримович', 'ОГРНИП: 321169000203676', 'ИНН: 165058083808'],
};

/**
 * Сигнатурные плашки сегментов на главной (порядок и тексты — из копирайта).
 * `note` рендерится курсивом.
 */
export const segments = [
  {
    label: 'Квартиры и апартаменты',
    text: 'Интерьер под ключ: въезжаете в готовое пространство, не управляя подрядчиками сами.',
    href: '/projects/apartments/',
    image: 'seg-apartments',
  },
  {
    label: 'Дома и виллы',
    text: 'Архитектура, инженерия и реализация в одном контуре — от посадки на участок до сдачи.',
    href: '/projects/houses/',
    image: 'seg-houses',
  },
  {
    label: 'Рестораны и бутики',
    text: 'Интерьер как инструмент бизнеса: сценарии гостя, свет, материалы и реальная реализация.',
    href: '/projects/restaurants/',
    image: 'seg-restaurants',
  },
  {
    label: 'Девелоперам',
    text: 'Общественные пространства и архитектурные концепции для жилых комплексов.',
    note: 'Работаем выборочно.',
    href: '/developers/',
    image: 'seg-developers',
  },
];
