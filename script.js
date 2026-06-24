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
