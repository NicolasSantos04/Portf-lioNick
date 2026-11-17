/* Nick – Portfolio · interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  /* ---------- 1. Image trail (section "Turning Ideas Into Reality") ---------- */
  (function imageTrail() {
    var root = document.querySelector('.works');
    if (!root) return;

    // Images used by the trail (width keeps each picture's proportion at 260px height)
    var imgs = [
      { src: 'assets/images/culto-de-jovens.png', w: 208 },
      { src: 'assets/images/set-your-focus.png', w: 219 },
      { src: 'assets/images/semana-do-consumidor.png', w: 260 },
      { src: 'assets/images/andar.png', w: 208 },
      { src: 'assets/images/prosperara.png', w: 260 }
    ];
    var LIFE = 1100;      // ms each card stays visible
    var STEP = 90;        // px the pointer must travel to spawn a new card
    var MAX = 12;         // max cards on screen
    var items = [], last = null, n = 0, raf = 0;

    function tick(now) {
      items = items.filter(function (it) {
        var age = now - it.born;
        if (age >= LIFE) { it.el.remove(); return false; }
        var pop = Math.min(1, age / 160);
        var sc = 0.55 + 0.45 * pop - 0.15 * Math.max(0, (age - 160) / (LIFE - 160));
        it.el.style.opacity = Math.max(0, 1 - age / LIFE).toFixed(2);
        it.el.style.transform = 'rotate(' + it.rot + 'deg) scale(' + sc.toFixed(3) + ')';
        return true;
      });
      raf = items.length ? requestAnimationFrame(tick) : 0;
    }

    function move(e) {
      var pt = (e.touches && e.touches[0]) || e;
      var r = root.getBoundingClientRect();
      var x = pt.clientX - r.left, y = pt.clientY - r.top;
      if (last && Math.hypot(x - last.x, y - last.y) < STEP) return;
      last = { x: x, y: y };
      n += 1;
      var k = window.innerWidth <= 700 ? 0.7 : 1;
      var it = imgs[(n - 1) % imgs.length];
      var w = Math.round(it.w * k), h = Math.round(260 * k);
      var el = document.createElement('img');
      el.className = 'trail';
      el.src = it.src; el.alt = ''; el.setAttribute('aria-hidden', 'true');
      el.style.width = w + 'px'; el.style.height = h + 'px';
      el.style.left = Math.round(x - w / 2) + 'px';
      el.style.top = Math.round(y - h / 2) + 'px';
      el.style.opacity = '0';
      root.appendChild(el);
      items.push({ el: el, born: performance.now(), rot: ((n * 37) % 25) - 12 });
      while (items.length > MAX) items.shift().el.remove();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    root.addEventListener('mousemove', move);
    root.addEventListener('touchmove', move, { passive: true });
  })();

  /* ---------- 2. Smooth, mouse-driven horizontal scroll for the card rows ---------- */
  function mouseScroll(rootSel, isBlocked) {
    var root = document.querySelector(rootSel);
    var row = root && root.querySelector('.row');
    if (!row) return;
    var target = 0, pos = 0, raf = 0;
    function tick() {
      var d = target - pos;
      if (Math.abs(d) < 0.3) { raf = 0; return; }
      pos += d * 0.07;
      row.scrollLeft = pos;
      raf = requestAnimationFrame(tick);
    }
    root.addEventListener('mousemove', function (e) {
      if (isBlocked && isBlocked()) return;
      var r = root.getBoundingClientRect();
      var max = row.scrollWidth - row.clientWidth;
      var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      target = p * max;
      if (!raf) { pos = row.scrollLeft; raf = requestAnimationFrame(tick); }
    });
  }

  /* ---------- 3. Videos: scroll-in reveal + full-screen player ---------- */
  (function videos() {
    var root = document.querySelector('.vd');
    if (!root) return;
    var modal = document.getElementById('video-modal');
    var player = document.getElementById('video-player');
    var lastFocus = null;

    // reveal when the section enters the viewport
    function show() { root.classList.add('in'); }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es.some(function (x) { return x.isIntersecting; })) { show(); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(root);
    } else { show(); }

    function open(card) {
      lastFocus = card;
      player.src = card.getAttribute('data-full');
      player.setAttribute('aria-label', card.getAttribute('data-title') || '');
      modal.hidden = false;
      player.play().catch(function () {});
    }
    function close() {
      if (modal.hidden) return;
      player.pause();
      player.removeAttribute('src');
      player.load();
      modal.hidden = true;
      if (lastFocus) lastFocus.focus();
    }
    root.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('click', function () { open(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
      });
    });
    modal.addEventListener('click', close);                       // click outside the video
    player.addEventListener('click', function (e) { e.stopPropagation(); });
    modal.querySelector('.x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    mouseScroll('.vd', function () { return !modal.hidden; });
  })();

  /* ---------- 4. Portfolio: expanded image viewer ---------- */
  (function portfolio() {
    var root = document.querySelector('.pf');
    if (!root) return;
    var modal = document.getElementById('image-modal');
    var viewer = document.getElementById('image-viewer');
    var lastFocus = null;

    function open(card) {
      var img = card.querySelector('img');
      lastFocus = card;
      viewer.src = img.getAttribute('src');
      viewer.alt = img.alt;
      modal.hidden = false;
      modal.querySelector('.x').focus();
    }
    function close() {
      if (modal.hidden) return;
      modal.hidden = true;
      viewer.removeAttribute('src');
      if (lastFocus) lastFocus.focus();
    }
    root.querySelectorAll('.card').forEach(function (card) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Expand ' + card.querySelector('img').alt);
      card.addEventListener('click', function () { open(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
      });
    });
    modal.addEventListener('click', close);                       // click outside the image
    viewer.addEventListener('click', function (e) { e.stopPropagation(); });
    modal.querySelector('.x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    mouseScroll('.pf', function () { return !modal.hidden; });
  })();

  /* ---------- 5. Buttons that scroll to a section ---------- */
  document.querySelectorAll('[data-scroll-to]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.querySelector(b.getAttribute('data-scroll-to'));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
