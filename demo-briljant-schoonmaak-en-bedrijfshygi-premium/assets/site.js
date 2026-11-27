(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.rv, .fx-facet, .lit, .meter');

  function show(el) { el.classList.add('is-in'); }

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(show);
  } else {
    // Geslepen beelden starten als smalle reep (niet nul), zodat de observer ze ziet.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    targets.forEach(function (el) { io.observe(el); });
    // Vangnet: niets mag ooit verborgen blijven.
    setTimeout(function () { targets.forEach(show); }, 6000);
  }

  // Header-schaduw en rustige parallax op grote beelden.
  var header = document.querySelector('.site-header');
  var par = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 10);
    if (!reduce) {
      par.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        var off = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
        var lim = r.height * 0.07; off = Math.max(-lim, Math.min(lim, off));
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0) scale(1.12)';
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Soepel scrollen naar ankers op dezelfde pagina.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', a.getAttribute('href'));
  });

  // Mobiel menu sluiten na klik.
  var mm = document.querySelector('.menu-mobile');
  if (mm) mm.addEventListener('click', function (e) { if (e.target.closest('a')) mm.removeAttribute('open'); });

  // Contactformulier (demo, zonder backend).
  var form = document.querySelector('#offerteform');
  if (form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var wrap = f.closest('.field');
        var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        wrap.classList.toggle('has-err', bad);
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) return;
      form.style.display = 'none';
      var msg = document.querySelector('.form-ok');
      msg.classList.add('show');
      msg.focus();
    });
  }
})();
