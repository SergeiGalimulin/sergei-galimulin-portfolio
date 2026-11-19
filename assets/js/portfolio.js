/* Портфолио: фильтр по категориям (хранится в адресе ?category=) и сетка карточек. */
(function () {
  'use strict';
  var ALL = 'all';

  document.addEventListener('DOMContentLoaded', function () {
    var projects = SG.publicProjects();
    var chips = document.getElementById('chips');
    var grid = document.getElementById('grid');
    var count = document.getElementById('count');

    function current() {
      var slug = SG.param('category');
      return SG.CATEGORIES.some(function (c) { return c.slug === slug; }) ? slug : ALL;
    }

    function renderChips(active) {
      var items = [{ slug: ALL, name: 'All Projects' }].concat(SG.CATEGORIES);
      chips.innerHTML = items.map(function (c) {
        var n = c.slug === ALL ? projects.length : projects.filter(function (p) { return p.category === c.slug; }).length;
        var on = c.slug === active;
        return '<button class="chip' + (on ? ' is-active' : '') + '" type="button" data-slug="' + c.slug + '" aria-pressed="' + on + '">' +
          SG.esc(c.name) + '<span class="n">' + n + '</span></button>';
      }).join('');
    }

    function renderGrid(active, animate) {
      var visible = active === ALL ? projects : projects.filter(function (p) { return p.category === active; });
      count.textContent = active === ALL
        ? SG.plural(projects.length, 'project')
        : visible.length + ' of ' + SG.plural(projects.length, 'project');

      if (!visible.length) {
        grid.innerHTML = '<div class="empty' + (animate ? ' fade-in' : '') + '">' +
          '<p class="eyebrow">' + SG.esc(active === ALL ? 'Portfolio' : SG.category(active).name) + '</p>' +
          '<p class="empty-title">New work is on the way</p>' +
          (active === ALL ? '' : '<button class="btn btn-ghost" type="button" data-slug="' + ALL + '">See all projects</button>') +
          '</div>';
        return;
      }
      grid.innerHTML = '<div class="masonry">' + visible.map(function (p, i) {
        return SG.cardHTML(p, { natural: true, cls: animate ? 'fade-in' : '', delay: animate ? Math.min(i, 8) * 0.04 : null });
      }).join('') + '</div>';
      SG.revealImages(grid);
    }

    function go(slug, push) {
      var url = new URL(location.href);
      if (slug === ALL) url.searchParams.delete('category'); else url.searchParams.set('category', slug);
      if (push) history.pushState(null, '', url);
      renderChips(slug);
      renderGrid(slug, true);
    }

    document.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-slug]');
      if (!b) return;
      var slug = b.getAttribute('data-slug');
      if (slug !== current()) go(slug, true);
    });
    window.addEventListener('popstate', function () { go(current(), false); });

    var start = current();
    renderChips(start);
    renderGrid(start, false);
  });
})();
