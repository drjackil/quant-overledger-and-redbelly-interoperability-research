// Progressive enhancement only. Every page reads fully without JavaScript.
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  function store(key, value) {
    try { if (value === undefined) return localStorage.getItem(key); localStorage.setItem(key, value); } catch (e) { return null; }
  }

  // Theme: dark by default, remembered per viewer.
  var themeBtn = document.querySelector('[data-theme-toggle]');
  function setTheme(t) {
    doc.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  setTheme(store('theme') === 'light' ? 'light' : 'dark');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next); store('theme', next);
  });

  // Mobile menu
  var menuBtn = document.querySelector('[data-menu]');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  // Reading progress and back-to-top
  var bar = document.querySelector('.progress');
  var top = document.querySelector('.back-top');
  function onScroll() {
    var h = doc.scrollHeight - doc.clientHeight;
    var p = h > 0 ? doc.scrollTop / h : 0;
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    if (top) top.classList.toggle('show', doc.scrollTop > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll, which also starts the diagram animations
  var revealables = document.querySelectorAll('.reveal, figure.diagram, .hero-art');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  window.addEventListener('beforeprint', function () { revealables.forEach(function (el) { el.classList.add('in'); }); });

  // Table of contents scroll spy
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  // Filter panels by label
  var filters = document.querySelectorAll('.filter');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      filters.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      var kinds = on ? btn.getAttribute('data-kinds').split(' ') : null;
      if (on) btn.setAttribute('aria-pressed', 'true');
      document.body.classList.toggle('filtering', !!kinds);
      document.querySelectorAll('.panel').forEach(function (p) {
        var k = p.getAttribute('data-kind');
        p.classList.toggle('dim', !!kinds && kinds.indexOf(k) === -1);
      });
    });
  });

  // Citation popovers: title, what the source supports, a verified quote and the link
  var SOURCES = window.__SOURCES__ || {};
  var pop = document.createElement('div');
  pop.className = 'pop'; pop.setAttribute('role', 'tooltip'); pop.id = 'cite-pop';
  document.body.appendChild(pop);
  var current = null, hideTimer = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function show(chip) {
    var s = SOURCES[chip.getAttribute('data-src')];
    if (!s) return;
    clearTimeout(hideTimer);
    if (current && current !== chip) current.classList.remove('open');
    current = chip; chip.classList.add('open'); chip.setAttribute('aria-describedby', 'cite-pop');
    pop.innerHTML = '<div class="pop-id">' + esc(s.id) + ' &middot; ' + esc(s.publisher) + (s.date ? ' &middot; ' + esc(s.date) : '') + '</div>' +
      '<div class="pop-title">' + esc(s.title) + '</div>' +
      (s.quote ? '<blockquote>' + esc(s.quote) + '</blockquote>' : '<div>' + esc(s.supports) + '</div>') +
      (s.internal ? '<a class="pop-link" href="' + esc(s.url) + '">' + esc(s.url) + '</a>' : '<a class="pop-link" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.url.replace(/^https?:\/\//, '')) + '</a>') +
      (s.checked ? '<div class="pop-check">' + esc(s.checked) + '</div>' : '');
    var r = chip.getBoundingClientRect();
    var w = pop.offsetWidth || 380;
    var left = Math.min(Math.max(16, r.left + window.scrollX - 20), window.scrollX + doc.clientWidth - w - 16);
    var below = r.bottom + 10 + 220 < window.innerHeight;
    pop.style.left = left + 'px';
    pop.style.top = (below ? r.bottom + window.scrollY + 8 : r.top + window.scrollY - pop.offsetHeight - 8) + 'px';
    pop.classList.add('show');
  }
  function hide(delay) {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      pop.classList.remove('show');
      if (current) { current.classList.remove('open'); current.removeAttribute('aria-describedby'); current = null; }
    }, delay || 0);
  }
  var hoverable = window.matchMedia('(hover: hover)').matches;
  document.querySelectorAll('.cite').forEach(function (chip) {
    if (hoverable) {
      chip.addEventListener('mouseenter', function () { show(chip); });
      chip.addEventListener('mouseleave', function () { hide(180); });
    }
    chip.addEventListener('focus', function () { show(chip); });
    chip.addEventListener('blur', function () { hide(180); });
    chip.addEventListener('click', function (e) {
      if (!hoverable && current !== chip) { e.preventDefault(); show(chip); }
    });
  });
  pop.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
  pop.addEventListener('mouseleave', function () { hide(120); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(0); });
  document.addEventListener('click', function (e) { if (current && !pop.contains(e.target) && !e.target.classList.contains('cite')) hide(0); });

  // Source search
  var search = document.getElementById('src-search');
  if (search) {
    var count = document.getElementById('src-count');
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase(), n = 0;
      document.querySelectorAll('.src').forEach(function (el) {
        var hit = !q || el.textContent.toLowerCase().indexOf(q) !== -1;
        el.hidden = !hit; if (hit) n++;
      });
      if (count) count.textContent = n + ' shown';
    });
  }

  // Copy buttons for the thread
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-copy'));
      if (!el || !navigator.clipboard) return;
      navigator.clipboard.writeText(el.innerText.trim()).then(function () {
        var t = btn.textContent; btn.textContent = 'COPIED';
        setTimeout(function () { btn.textContent = t; }, 1400);
      });
    });
  });

  // Count-up for the stat strip
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (reduce || !('IntersectionObserver' in window)) { el.textContent = end; return; }
    el.textContent = '0';
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / 900);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
    o.observe(el);
  });
})();
