/* Редактор проекта: поля, категория, видимость, медиа (загрузка, порядок, метки), сохранение и удаление. */
(function () {
  'use strict';

  var MAX_SIDE = 1600;     // длинная сторона загружаемой картинки после уменьшения
  var JPEG_QUALITY = 0.85;

  function slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'project';
  }

  // Картинка уменьшается в браузере и хранится как data URL, чтобы пережить перезагрузку.
  function readImage(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file);
      var im = new Image();
      im.onload = function () {
        var k = Math.min(1, MAX_SIDE / Math.max(im.naturalWidth, im.naturalHeight));
        var c = document.createElement('canvas');
        c.width = Math.round(im.naturalWidth * k);
        c.height = Math.round(im.naturalHeight * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve({ kind: 'image', src: c.toDataURL('image/jpeg', JPEG_QUALITY), w: c.width, h: c.height, label: '' });
      };
      im.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
      im.src = url;
    });
  }

  // Видео не помещается в хранилище браузера: в демо без сервера оно видно только в редакторе
  // и отбрасывается при сохранении (см. submit).
  function readVideo(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file);
      var v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = function () { resolve({ kind: 'video', src: url, w: v.videoWidth || 16, h: v.videoHeight || 9, label: 'Turntable', temp: true }); };
      v.onerror = function () { resolve(null); };
      v.src = url;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var $ = function (id) { return document.getElementById(id); };
    var list = SG.load();
    var editId = SG.param('id');
    var found = list.find(function (p) { return p.id === editId; });
    var isNew = !found;
    var d = found ? JSON.parse(JSON.stringify(found)) : { id: '', title: '', category: SG.CATEGORIES[0].slug, description: '', software: '', published: true, media: [] };
    var tried = false;
    var busy = false;

    $('eyebrow').textContent = isNew ? 'New project' : 'Edit project';
    $('save').textContent = isNew ? 'Create Project' : 'Save Project';
    $('delete').hidden = isNew;
    $('title').value = d.title;
    $('desc').value = d.description;
    $('software').value = d.software;
    document.title = (isNew ? 'New project' : 'Edit project') + ' — SergeiGalimulin';

    function heading() { $('heading').textContent = d.title.trim() || (isNew ? 'New project' : 'Untitled project'); }

    function titleError() {
      var bad = tried && !d.title.trim();
      $('title').classList.toggle('is-error', bad);
      $('title').setAttribute('aria-invalid', bad);
      $('title-err').hidden = !bad;
      return bad;
    }

    function renderCats() {
      $('cats').innerHTML = SG.CATEGORIES.map(function (c) {
        var on = d.category === c.slug;
        return '<button class="cat-chip' + (on ? ' is-active' : '') + '" type="button" data-cat="' + c.slug + '" aria-pressed="' + on + '">' + SG.esc(c.name) + '</button>';
      }).join('');
    }

    function renderSwitch() {
      $('published').setAttribute('aria-checked', d.published);
      $('vis-hint').textContent = d.published ? 'Visible on the Portfolio page' : 'Hidden — only you can see it';
    }

    function renderMedia() {
      var n = d.media.length;
      var coverIdx = d.media.findIndex(function (m) { return m.kind === 'image'; });
      $('no-media').hidden = n > 0;
      $('tiles').innerHTML = d.media.map(function (m, i) {
        var name = m.kind + ' ' + (i + 1);
        var preview = m.kind === 'video'
          ? '<video src="' + SG.esc(SG.src(m.src)) + '" muted loop playsinline autoplay></video>'
          : '<img src="' + SG.esc(SG.src(m.src)) + '" alt="Render ' + (i + 1) + '">';
        return '<li class="tile">' +
          '<div class="tile-img">' + preview +
          (i === coverIdx ? '<span class="tile-badge cover mono">COVER</span>' : '') +
          (m.kind === 'video' ? '<span class="tile-badge video mono">VIDEO</span>' : '') +
          '<div class="tile-tools">' +
          '<button class="tool" type="button" data-move="-1" data-i="' + i + '" aria-label="Move ' + name + ' earlier"' + (i === 0 ? ' disabled' : '') + '>' + SG.ICON.chevronLeft + '</button>' +
          '<button class="tool" type="button" data-move="1" data-i="' + i + '" aria-label="Move ' + name + ' later"' + (i === n - 1 ? ' disabled' : '') + '>' + SG.ICON.chevronRight + '</button>' +
          '<button class="tool" type="button" data-remove data-i="' + i + '" aria-label="Remove ' + name + '">' + SG.ICON.close + '</button>' +
          '</div></div>' +
          '<div class="tile-foot"><label class="sr-only" for="lbl-' + i + '">Label for ' + name + '</label>' +
          '<select class="select" id="lbl-' + i + '" data-label data-i="' + i + '"><option value="">No label</option>' +
          SG.LABELS.map(function (l) { return '<option' + (m.label === l ? ' selected' : '') + '>' + SG.esc(l) + '</option>'; }).join('') +
          '</select></div></li>';
      }).join('');
    }

    function setDropText(text) { $('drop-text').textContent = text || 'Drop files here, or'; }

    async function addFiles(files) {
      files = Array.prototype.filter.call(files || [], function (f) { return /^(image|video)\//.test(f.type); });
      if (!files.length || busy) return;
      busy = true;
      for (var k = 0; k < files.length; k++) {
        setDropText('Uploading ' + (k + 1) + ' of ' + files.length + '…');
        var f = files[k];
        var item = f.type.indexOf('video/') === 0 ? await readVideo(f) : await readImage(f);
        if (item) { d.media.push(item); renderMedia(); }
      }
      busy = false;
      setDropText();
    }

    // ---------- события ----------
    $('title').addEventListener('input', function (e) { d.title = e.target.value; heading(); titleError(); });
    $('desc').addEventListener('input', function (e) { d.description = e.target.value; });
    $('software').addEventListener('input', function (e) { d.software = e.target.value; });
    $('published').addEventListener('click', function () { d.published = !d.published; renderSwitch(); });

    $('cats').addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (b) { d.category = b.getAttribute('data-cat'); renderCats(); }
    });

    $('tiles').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (!b) return;
      var i = +b.getAttribute('data-i');
      if (b.hasAttribute('data-remove')) {
        var gone = d.media.splice(i, 1)[0];
        if (gone && gone.temp) URL.revokeObjectURL(gone.src);
      } else {
        var j = i + +b.getAttribute('data-move');
        if (j < 0 || j >= d.media.length) return;
        var t = d.media[i]; d.media[i] = d.media[j]; d.media[j] = t;
      }
      renderMedia();
    });
    $('tiles').addEventListener('change', function (e) {
      var s = e.target.closest('select[data-label]');
      if (s) d.media[+s.getAttribute('data-i')].label = s.value;
    });

    document.querySelectorAll('.upload input[type=file]').forEach(function (input) {
      input.addEventListener('change', function () { addFiles(input.files).then(function () { input.value = ''; }); });
    });

    var drop = $('drop');
    ['dragenter', 'dragover'].forEach(function (t) {
      drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('is-drag'); if (!busy) setDropText('Release to upload'); });
    });
    drop.addEventListener('dragleave', function (e) {
      if (!drop.contains(e.relatedTarget)) { drop.classList.remove('is-drag'); if (!busy) setDropText(); }
    });
    drop.addEventListener('drop', function (e) {
      e.preventDefault();
      drop.classList.remove('is-drag');
      setDropText();
      addFiles(e.dataTransfer && e.dataTransfer.files);
    });

    $('form').addEventListener('submit', function (e) {
      e.preventDefault();
      tried = true;
      if (titleError()) { $('title').focus(); return; }
      if (busy) { setDropText('Wait for the upload to finish…'); return; }
      d.title = d.title.trim();
      var dropped = d.media.filter(function (m) { return m.temp; }).length;
      d.media = d.media.filter(function (m) { return !m.temp; });
      var fresh = SG.load();
      if (isNew) {
        var base = slugify(d.title), id = base, n = 2;
        while (fresh.some(function (p) { return p.id === id; })) id = base + '-' + n++;
        d.id = id;
        fresh.unshift(d);
      } else {
        var at = fresh.findIndex(function (p) { return p.id === d.id; });
        if (at >= 0) fresh[at] = d; else fresh.unshift(d);
      }
      try {
        SG.save(fresh);
      } catch (err) {
        setDropText('Not enough browser storage — remove a few large images and try again.');
        return;
      }
      var msg = isNew ? 'Project created' : 'Project saved';
      if (dropped) msg += ' · ' + SG.plural(dropped, 'new video') + ' not stored in this demo';
      try { sessionStorage.setItem('sg.flash', msg); } catch (err) {}
      location.href = 'index.html';
    });

    // ---------- удаление ----------
    var modal = $('modal');
    function closeModal() { modal.hidden = true; $('delete').focus(); }
    $('delete').addEventListener('click', function () { modal.hidden = false; $('cancel').focus(); });
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(); });
    document.addEventListener('keydown', function (e) { if (!modal.hidden && e.key === 'Escape') closeModal(); });
    $('confirm').addEventListener('click', function () {
      var fresh = SG.load().filter(function (p) { return p.id !== d.id; });
      try { SG.save(fresh); } catch (err) {}
      try { sessionStorage.setItem('sg.flash', 'Project deleted'); } catch (err) {}
      location.href = 'index.html';
    });

    heading();
    renderCats();
    renderSwitch();
    renderMedia();
  });
})();
