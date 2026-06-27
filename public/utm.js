(function () {
  // Сохраняем UTM из URL в sessionStorage при заходе
  var params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var search = window.location.search;
  if (search) {
    params.forEach(function (key) {
      var match = search.match(new RegExp('[?&]' + key + '=([^&]*)'));
      if (match) sessionStorage.setItem(key, decodeURIComponent(match[1]));
    });
    sessionStorage.setItem('utm_referrer', document.referrer || '');
    sessionStorage.setItem('utm_page', window.location.pathname);
  }

  // Подставляем UTM в скрытые поля формы перед отправкой
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-lead]').forEach(function (form) {
      params.forEach(function (key) {
        var input = form.querySelector('input[name="' + key + '"]');
        if (input) input.value = sessionStorage.getItem(key) || '';
      });
      var refInput = form.querySelector('input[name="utm_referrer"]');
      if (refInput) refInput.value = sessionStorage.getItem('utm_referrer') || '';
      var pageInput = form.querySelector('input[name="utm_page"]');
      if (pageInput) pageInput.value = sessionStorage.getItem('utm_page') || window.location.pathname;
    });
  });

  // Аналитика: клики по элементам с data-goal → reachGoal (Метрика 98224185)
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-goal]');
    if (!el) return;
    var goal = el.getAttribute('data-goal');
    if (goal && typeof ym !== 'undefined') {
      ym(98224185, 'reachGoal', goal);
    }
  });
})();

// Scroll-depth аналитика: фиксируем долистывание до блоков (один раз за визит).
// Порог 50% (или прокрутка через середину высокого блока) + выдержка DWELL_MS:
// цель засчитывается, только если секция провисела видимой непрерывно ~600 мс.
// Так отсекаются ложные срабатывания, когда страница пролетает через промежуточные
// секции при быстром скролле или плавной прокрутке по якорю.
(function () {
  function initScrollGoals() {
    var els = document.querySelectorAll('[data-scroll-goal]');
    if (!els.length || !('IntersectionObserver' in window)) return;

    var DWELL_MS = 600;        // сколько мс секция должна быть видимой непрерывно
    var VISIBLE_RATIO = 0.5;   // порог видимости (либо прокрутка через середину высокого блока)

    var fired = {};
    var timers = new Map();

    function isVisible(entry) {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var r = entry.boundingClientRect;
      // Случай 1: блок ниже высоты экрана — видно >=50% его площади
      var ratioOk = entry.intersectionRatio >= VISIBLE_RATIO;
      // Случай 2: высокий блок (выше экрана) — середина блока прошла середину экрана
      var midReached = r.height > vh && r.top <= vh / 2 && r.bottom >= vh / 2;
      return entry.isIntersecting && (ratioOk || midReached);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        var goal = el.getAttribute('data-scroll-goal') || '';
        if (!goal || fired[goal]) { observer.unobserve(el); return; }

        if (isVisible(entry)) {
          // Запускаем выдержку: засчитываем, только если секция провисела
          // видимой непрерывно DWELL_MS (пролёт через секцию её не накопит).
          if (!timers.has(el)) {
            var id = window.setTimeout(function () {
              timers.delete(el);
              if (!fired[goal]) {
                fired[goal] = true;
                if (typeof ym !== 'undefined') ym(98224185, 'reachGoal', goal);
                observer.unobserve(el);
              }
            }, DWELL_MS);
            timers.set(el, id);
          }
        } else {
          var id2 = timers.get(el);   // ушла из кадра раньше — отменяем таймер
          if (id2) { clearTimeout(id2); timers.delete(el); }
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    els.forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollGoals);
  } else {
    initScrollGoals();
  }
})();
