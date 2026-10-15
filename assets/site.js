/* Shmor site kit: menu toggle + on-site search (pages are found via /search-index.json) */
(function () {
  'use strict';
  var btn = document.querySelector('[data-menu]'), nav = document.querySelector('[data-nav]');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  var out = document.getElementById('search-results');
  if (!out) return;
  var q = (new URLSearchParams(location.search).get('q') || '').trim();
  var input = document.querySelector('.search input[name=q]');
  if (input) input.value = q;
  if (!q) return;
  document.getElementById('search-title').textContent = 'Results for “' + q + '”';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var words = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 1; });
  fetch('/search-index.json').then(function (r) { return r.json(); }).then(function (pages) {
    var hits = pages.map(function (p) {
      var score = words.reduce(function (s, w) { return s + (p.terms.indexOf(w) > -1 ? 1 : 0); }, 0);
      return { p: p, score: score };
    }).filter(function (h) { return h.score > 0; }).sort(function (a, b) { return b.score - a.score; });
    out.innerHTML = hits.length
      ? hits.map(function (h) { return '<a class="card' + (h.p.img ? ' has-img' : '') + '" href="' + h.p.path + '">' + (h.p.img ? '<img class="card-img" src="' + esc(h.p.img) + '" alt="" loading="lazy" width="600" height="360">' : '') + '<h3>' + esc(h.p.title) + '</h3><p>' + esc(h.p.text) + '</p><span class="cta">Explore →</span></a>'; }).join('')
      : '<p class="empty">No pages matched. Try a broader search, or browse the guides below.</p>' +
        pages.slice(0, 6).map(function (p) { return '<a class="card" href="' + p.path + '"><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></a>'; }).join('');
  }).catch(function () { out.innerHTML = '<p class="empty">Search is unavailable right now.</p>'; });
})();

/* "specs" blocks with "tabs": filter the cards by data-tag (every card shows without JS) */
(function () {
  'use strict';
  document.querySelectorAll('[data-tabs]').forEach(function (bar) {
    var grid = bar.nextElementSibling;
    bar.hidden = false;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-tab]');
      if (!b) return;
      var id = b.getAttribute('data-tab');
      bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      grid.querySelectorAll('[data-tag]').forEach(function (c) { c.hidden = id !== 'all' && c.getAttribute('data-tag') !== id; });
    });
  });
})();

/* DomCom Insure: cover checker ("checker" block). Shows follow-up questions,
   then filters the cover cards by their data-when rules and sorts them by need.
   Answers are kept in the URL (?region=uk&side=home...) so results can be shared. */
(function () {
  'use strict';
  var root = document.querySelector('[data-checker]');
  if (!root) return;
  var form = root.querySelector('form'), count = root.querySelector('[data-ck-count]');
  var list = root.querySelector('.ck-list');
  var covers = [].slice.call(root.querySelectorAll('.ck-cover'));
  var qs = [].slice.call(root.querySelectorAll('.ck-q'));
  var ORDER = { must: 0, should: 1, consider: 2 };
  var parse = function (s) { try { return JSON.parse(s || '{}'); } catch (e) { return {}; } };

  function answers() {
    var a = {};
    qs.forEach(function (q) {
      if (q.hidden) return;
      var c = q.querySelector('input:checked');
      if (c) a[q.getAttribute('data-q')] = c.value;
    });
    return a;
  }
  function matches(rule, a) {
    return Object.keys(rule).every(function (k) { return a[k] !== undefined && rule[k].indexOf(a[k]) > -1; });
  }
  function update(push) {
    // Show questions whose showIf rule matches (repeat so chains settle)
    for (var i = 0; i < 3; i++) {
      var a0 = answers();
      qs.forEach(function (q) {
        var rule = q.getAttribute('data-show-if');
        if (rule) q.hidden = !matches(parse(rule), a0);
      });
    }
    var n = 0;
    qs.forEach(function (q) { if (!q.hidden) q.querySelector('.ck-n').textContent = String(++n).padStart(2, '0'); });
    var a = answers(), keys = Object.keys(a);
    var shown = covers.filter(function (c) { var ok = keys.length > 1 && matches(parse(c.getAttribute('data-when')), a); c.hidden = !ok; return ok; });
    shown.sort(function (x, y) { return ORDER[x.getAttribute('data-need')] - ORDER[y.getAttribute('data-need')]; }).forEach(function (c) { list.appendChild(c); });
    var open = qs.filter(function (q) { return !q.hidden && !q.querySelector('input:checked'); }).length;
    count.textContent = keys.length < 2 ? 'Answer the questions to build your cover list.'
      : shown.length ? shown.length + ' cover' + (shown.length > 1 ? 's' : '') + ' to look at' + (open ? ' so far (' + open + ' question' + (open > 1 ? 's' : '') + ' left)' : '') + '.'
      : 'Nothing flagged yet. Keep going' + (open ? ' (' + open + ' question' + (open > 1 ? 's' : '') + ' left)' : '') + '.';
    if (push && history.replaceState) {
      var p = new URLSearchParams(); keys.forEach(function (k) { p.set(k, a[k]); });
      history.replaceState(null, '', location.pathname + (keys.length ? '?' + p.toString() : ''));
    }
  }
  // Restore answers from the URL
  var url = new URLSearchParams(location.search);
  url.forEach(function (v, k) { var el = form.querySelector('input[name="' + k + '"][value="' + v.replace(/"/g, '') + '"]'); if (el) el.checked = true; });
  form.addEventListener('change', function () { update(true); });
  form.addEventListener('reset', function () { setTimeout(function () { update(true); }, 0); });
  update(false);
})();

/* Fold the top menu into the menu button whenever it doesn't fit (any screen width) */
(function () {
  'use strict';
  var root = document.documentElement, bar = document.querySelector('.site-header .bar'), nav = document.querySelector('[data-nav]');
  if (!bar || !nav) return;
  function fit() {
    root.classList.remove('nav-compact');
    nav.classList.remove('open');
    if (getComputedStyle(nav).display === 'none') return; // phone layout already uses the menu button
    var over = bar.scrollWidth > bar.clientWidth + 1 || nav.scrollWidth > nav.clientWidth + 1 ||
      nav.getBoundingClientRect().right > bar.getBoundingClientRect().right + 1;
    if (over) root.classList.add('nav-compact');
  }
  fit();
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
