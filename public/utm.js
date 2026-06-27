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
// Порог 50%: блок засчитывается, когда >=50% его площади в окне,
// ИЛИ (для блоков выше высоты экрана) когда пользователь проскроллил через его середину.
(function () {
  function initScrollGoals() {
    var els = document.querySelectorAll('[data-scroll-goal]');
    if (!els.length || !('IntersectionObserver' in window)) return;

    var fired = {};

    function fire(el) {
      var goal = el.getAttribute('data-scroll-goal');
      if (goal && !fired[goal]) {
        fired[goal] = true;
        if (typeof ym !== 'undefined') ym(98224185, 'reachGoal', goal);
        return true;
      }
      return false;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var rect = entry.boundingClientRect;
        // Случай 1: блок ниже высоты экрана — видно >=50% его площади
        var ratioOk = entry.intersectionRatio >= 0.5;
        // Случай 2: высокий блок (выше экрана) — середина блока прошла середину экрана
        var midReached = rect.height > vh &&
          rect.top <= vh / 2 && rect.bottom >= vh / 2;
        if (entry.isIntersecting && (ratioOk || midReached)) {
          if (fire(el)) observer.unobserve(el);
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
