/* Дашборд: список проектов, публикация, удаление с отменой. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var listBox = document.getElementById('list');
    var modal = document.getElementById('modal');
    var toast = document.getElementById('toast');
    var list = SG.load();
    var pending = null;   // индекс проекта, ожидающего подтверждения удаления
    var undo = null;      // { i, item } для кнопки Undo
    var toastTimer = null;
    var lastFocus = null;

    function persist() {
      try { SG.save(list); return true; } catch (e) { flash('Could not save — browser storage is full.'); return false; }
    }

    function flash(text, withUndo) {
      clearTimeout(toastTimer);
      undo = withUndo || null;
      toast.innerHTML = '<span>' + SG.esc(text) + '</span>' + (undo ? '<button type="button" data-act="undo">Undo</button>' : '');
      toast.hidden = false;
      toastTimer = setTimeout(function () { toast.hidden = true; undo = null; }, 6000);
    }

    function render() {
      var shown = list.filter(function (p) { return p.published; }).length;
      document.getElementById('summary').textContent = SG.plural(list.length, 'project') + ' · ' + shown + ' published';
      if (!list.length) {
        listBox.innerHTML = '<div class="admin-empty"><p style="margin:0;font-weight:600;font-size:28px;letter-spacing:-.04em">No projects yet</p>' +
          '<p style="margin:0;color:var(--muted);font-size:15px">Create your first project to show it on the portfolio.</p>' +
          '<a class="btn btn-primary btn-md" href="edit.html" style="margin-top:8px">Create your first project</a></div>';
        return;
      }
      listBox.innerHTML = '<ul class="list">' + list.map(function (p, i) {
        var c = SG.cover(p);
        var title = p.title || 'Untitled project';
        var edit = 'edit.html?id=' + encodeURIComponent(p.id);
        return '<li class="row">' +
          '<div class="row-thumb">' + (c ? '<img src="' + SG.esc(SG.src(c.src)) + '" alt="" loading="lazy">' : SG.ICON.box) + '</div>' +
          '<div class="row-text"><a class="row-title" href="' + edit + '">' + SG.esc(title) + '</a>' +
          '<span class="row-meta">' + SG.esc(SG.category(p.category).name + ' · ' + SG.mediaSummary(p)) + '</span></div>' +
          '<div class="row-actions">' +
          '<button class="pill status' + (p.published ? ' is-on' : '') + '" type="button" data-act="toggle" data-i="' + i + '" aria-pressed="' + p.published + '" aria-label="' +
          SG.esc((p.published ? 'Published — click to hide ' : 'Hidden — click to publish ') + title) + '"><span class="dot" aria-hidden="true"></span>' + (p.published ? 'Published' : 'Hidden') + '</button>' +
          (p.published ? '<a class="pill" href="../project.html?id=' + encodeURIComponent(p.id) + '">View</a>' : '<span class="pill" aria-disabled="true" title="Publish to view on the site" style="opacity:.4;cursor:default">View</span>') +
          '<a class="pill" href="' + edit + '">Edit</a>' +
          '<button class="round-btn danger" type="button" data-act="ask" data-i="' + i + '" aria-label="' + SG.esc('Delete ' + title) + '">' +
          '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg></button>' +
          '</div></li>';
      }).join('') + '</ul>';
    }

    function openModal(i) {
      pending = i;
      lastFocus = document.activeElement;
      document.getElementById('del-title').textContent = 'Delete “' + (list[i].title || 'Untitled project') + '”?';
      modal.hidden = false;
      document.getElementById('cancel').focus();
    }
    function closeModal() {
      modal.hidden = true;
      pending = null;
      if (lastFocus && lastFocus.isConnected) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-act]');
      if (!t) return;
      var act = t.getAttribute('data-act');
      var i = +t.getAttribute('data-i');
      if (act === 'toggle') {
        list[i].published = !list[i].published;
        if (persist()) { render(); flash(list[i].published ? 'Published to portfolio' : 'Hidden from portfolio'); }
      } else if (act === 'ask') {
        openModal(i);
      } else if (act === 'cancel') {
        closeModal();
      } else if (act === 'confirm' && pending != null) {
        var item = list.splice(pending, 1)[0];
        var at = pending;
        closeModal();
        if (persist()) { render(); flash('Project deleted', { i: at, item: item }); }
      } else if (act === 'undo' && undo) {
        list.splice(Math.min(undo.i, list.length), 0, undo.item);
        if (persist()) { render(); flash('Project restored'); }
      } else if (act === 'reset') {
        SG.reset();
        list = SG.load();
        render();
        flash('Demo data restored');
      } else if (act === 'signout') {
        try { localStorage.removeItem('sg.session'); } catch (err) {}
        location.href = 'login.html';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!modal.hidden && e.key === 'Escape') closeModal();
    });

    render();
    try {
      var msg = sessionStorage.getItem('sg.flash');
      if (msg) { sessionStorage.removeItem('sg.flash'); flash(msg); }
    } catch (e) {}
  });
})();
