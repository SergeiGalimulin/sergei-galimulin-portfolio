/* Страница проекта: просмотрщик медиа, полноэкранный режим, соседние работы. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var I = SG.ICON;
    var root = document.getElementById('project');
    var list = SG.publicProjects();
    var idx = list.findIndex(function (p) { return p.id === SG.param('id'); });

    if (idx < 0) {
      root.innerHTML = '<div class="not-found"><p class="eyebrow">Not found</p>' +
        '<p style="margin:0;font-size:20px;color:var(--text)">This project isn’t available.</p>' +
        '<a class="btn btn-ghost btn-sm" href="portfolio.html">Back to portfolio</a></div>';
      return;
    }

    var p = list[idx];
    var media = p.media;
    var n = media.length;
    var cur = 0;
    document.title = p.title + ' — SergeiGalimulin';

    var prev = list[(idx - 1 + list.length) % list.length];
    var next = list[(idx + 1) % list.length];
    var showNav = list.length > 1;

    function mediaEl(m, cls, attrs) {
      var s = SG.esc(SG.src(m.src));
      return m.kind === 'video'
        ? '<video class="' + (cls || '') + '" src="' + s + '" ' + (attrs || 'muted loop playsinline autoplay controls') + '></video>'
        : '<img class="' + (cls || '') + '" src="' + s + '" alt="' + SG.esc(p.title + (m.label ? ' — ' + m.label : '')) + '">';
    }

    function thumbHTML(m, k, cls) {
      var inner = m.kind === 'video'
        ? '<video src="' + SG.esc(SG.src(m.src)) + '#t=0.1" muted preload="metadata"></video><span class="play">' + I.play + '</span>'
        : '<img src="' + SG.esc(SG.src(m.src)) + '" alt="" loading="lazy">';
      return '<button class="' + cls + '" type="button" data-go="' + k + '" aria-label="Show ' + m.kind + ' ' + (k + 1) + ' of ' + n + '">' + inner + '</button>';
    }

    function pnHTML(q, dir) {
      var c = SG.cover(q);
      return '<a class="pn' + (dir === 'next' ? ' next' : '') + '" href="project.html?id=' + encodeURIComponent(q.id) + '">' +
        '<span class="pn-img">' + (c ? '<img src="' + SG.esc(SG.src(c.src)) + '" alt="" loading="lazy">' : '') + '</span>' +
        '<span class="pn-text"><span class="pn-label mono">' + (dir === 'next' ? 'NEXT →' : '← PREVIOUS') + '</span>' +
        '<span class="pn-title">' + SG.esc(q.title) + '</span></span></a>';
    }

    var specs = '<div><dt>Category</dt><dd>' + SG.esc(SG.category(p.category).name) + '</dd></div>' +
      '<div><dt>Media</dt><dd>' + SG.esc(SG.mediaSummary(p)) + '</dd></div>' +
      (p.software ? '<div><dt>Software</dt><dd>' + SG.esc(p.software) + '</dd></div>' : '');

    root.innerHTML =
      '<div class="project-grid">' +
      '<section class="project-media" aria-label="Project media">' +
      (n ? '<div class="viewer ph" id="viewer"></div>' : '<div class="viewer" style="aspect-ratio:4/3;color:#6b6b68">' + I.box + '</div>') +
      (n > 1 ? '<div class="thumbs" id="thumbs">' + media.map(function (m, k) { return thumbHTML(m, k, 'thumb'); }).join('') + '</div>' : '') +
      '</section>' +
      '<aside class="project-aside">' +
      '<p class="eyebrow">No. ' + String(idx + 1).padStart(2, '0') + ' — ' + SG.esc(SG.category(p.category).name) + '</p>' +
      '<h1>' + SG.esc(p.title) + '</h1>' +
      (p.description ? '<p class="project-desc">' + SG.esc(p.description) + '</p>' : '') +
      '<dl class="specs">' + specs + '</dl>' +
      '</aside></div>' +
      (showNav ? '<nav class="pn-grid" aria-label="More projects">' + pnHTML(prev, 'prev') + pnHTML(next, 'next') + '</nav>' : '');

    if (!n) return;

    var viewer = document.getElementById('viewer');
    var thumbs = document.getElementById('thumbs');
    var lb = document.getElementById('lb');
    var lbStage = document.getElementById('lb-stage');
    var lbStrip = document.getElementById('lb-strip');
    document.getElementById('lb-close').innerHTML = I.close;
    document.getElementById('lb-name').textContent = p.title;

    // Пропорции окна берём из картинки, но не уже 4:5 и не шире 1.9:1 — иначе вписываем с полями.
    function ratio(m) {
      var r = m.w / m.h;
      var rc = Math.min(Math.max(r, 0.8), 1.9);
      return { css: rc === r ? m.w + ' / ' + m.h : String(rc), fit: rc === r ? 'cover' : 'contain' };
    }

    function renderViewer(animate) {
      var m = media[cur];
      var r = ratio(m);
      viewer.style.aspectRatio = r.css;
      var counter = String(cur + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
      viewer.innerHTML =
        (m.kind === 'image'
          ? '<button class="zoom" type="button" aria-label="Open image full screen" data-act="open">' + mediaEl(m, 'lz' + (animate ? ' fade-in' : '')) + '</button>'
          : mediaEl(m, animate ? 'fade-in' : '')) +
        '<span class="counter mono">' + counter + '</span>' +
        '<button class="icon-btn viewer-full" type="button" aria-label="Open full screen" data-act="open"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg></button>' +
        (n > 1 ? '<div class="viewer-arrows"><button class="icon-btn" type="button" aria-label="Previous" data-act="prev">' + I.chevronLeft + '</button>' +
          '<button class="icon-btn" type="button" aria-label="Next" data-act="next">' + I.chevronRight + '</button></div>' : '');
      var el = viewer.querySelector('img, video');
      el.style.objectFit = r.fit;
      if (m.kind === 'video') viewer.classList.add('done');
      SG.revealImages(viewer);
      if (thumbs) thumbs.querySelectorAll('.thumb').forEach(function (b, k) {
        b.classList.toggle('is-active', k === cur);
        b.setAttribute('aria-pressed', k === cur);
      });
      if (!lb.hidden) renderLightbox();
    }

    function renderLightbox() {
      var m = media[cur];
      document.getElementById('lb-count').textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
      lbStage.innerHTML = mediaEl(m, 'fade-in') +
        (n > 1 ? '<button class="lb-btn lb-arrow lb-prev" type="button" aria-label="Previous" data-act="prev">' + I.chevronLeft + '</button>' +
          '<button class="lb-btn lb-arrow lb-next" type="button" aria-label="Next" data-act="next">' + I.chevronRight + '</button>' : '');
      lbStrip.innerHTML = n > 1 ? media.map(function (mm, k) { return thumbHTML(mm, k, 'lb-thumb' + (k === cur ? ' is-active' : '')); }).join('') : '';
    }

    function goTo(k) {
      var nk = (k + n) % n;
      if (nk === cur) return;
      cur = nk;
      var v = viewer.querySelector('video');
      if (v) v.pause();
      renderViewer(true);
    }

    var lastFocus = null;
    function openLb() {
      lastFocus = document.activeElement;
      lb.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      var v = viewer.querySelector('video');
      if (v) v.pause();
      renderLightbox();
      document.getElementById('lb-close').focus();
    }
    function closeLb() {
      lb.hidden = true;
      lbStage.innerHTML = '';
      document.documentElement.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-act], [data-go]');
      if (!t) return;
      if (t.hasAttribute('data-go')) { goTo(+t.getAttribute('data-go')); return; }
      var a = t.getAttribute('data-act');
      if (a === 'open') openLb();
      else if (a === 'close') closeLb();
      else if (a === 'prev') goTo(cur - 1);
      else if (a === 'next') goTo(cur + 1);
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(cur + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(cur - 1); }
      else if (e.key === 'Tab') {
        // Удерживаем фокус внутри полноэкранного просмотра.
        var f = Array.prototype.filter.call(lb.querySelectorAll('button:not([tabindex="-1"]), video[controls]'), function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    var tx = null;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (tx == null) return;
      var dx = e.changedTouches[0].clientX - tx;
      tx = null;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? cur + 1 : cur - 1);
    });

    renderViewer(false);
  });
})();
