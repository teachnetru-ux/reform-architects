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
})();
