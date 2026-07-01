/* THSM — shared interactions */

/* graceful image fallback: a missing photo becomes a labeled placeholder,
   so dropping a correctly-named file into /images/ makes it appear automatically. */
function imgFail(img) {
  var label = img.getAttribute('data-ph') || 'photo coming';
  var ph = document.createElement('div');
  ph.className = 'shot-ph';
  ph.textContent = label;
  img.parentNode.replaceChild(ph, img);
}

(function () {
  var reveals = document.querySelectorAll('.reveal');
  var weights = document.querySelectorAll('.weight');

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (e) { e.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });
  reveals.forEach(function (e) { io.observe(e); });

  if (weights.length) {
    var wio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add('lit');
      });
    }, { threshold: 0.6 });
    weights.forEach(function (e) { wio.observe(e); });
  }
})();

/* waitlist — subscribe inline via Buttondown, no redirect */
(function () {
  var forms = document.querySelectorAll('form.waitlist');
  if (!forms.length) return;

  function showDone(form) {
    var done = document.createElement('div');
    done.className = 'waitlist-done';
    done.innerHTML =
      '<p class="waitlist-done-title">You’re on the list.</p>' +
      '<p class="waitlist-done-sub">Check your inbox to confirm — one click and you’re in.</p>';
    var fine = form.parentNode.querySelector('.waitlist-fine');
    if (fine) fine.style.display = 'none';
    form.parentNode.replaceChild(done, form);
  }

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (!input || !input.value || !input.checkValidity()) {
        if (input) input.reportValidity();
        return;
      }
      var btn = form.querySelector('button');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var body = new URLSearchParams();
      body.append('email', input.value);

      // opaque cross-origin POST: the subscribe still registers; we confirm optimistically
      fetch(form.action, { method: 'POST', mode: 'no-cors', body: body })
        .then(function () { showDone(form); })
        .catch(function () { showDone(form); });
    });
  });
})();
