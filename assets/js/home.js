/* Главная: большая работа на первом экране и блок «Selected work». */
(function () {
  'use strict';
  var HERO_ID = 'fantasy-dragon';
  var FEATURED = ['flame-boss-nowa-online-world', 'adam-scott-likeness', 'rock-boss-nowa-online-world'];

  document.addEventListener('DOMContentLoaded', function () {
    var list = SG.publicProjects().filter(function (p) { return SG.cover(p); });
    var heroBox = document.getElementById('hero-card');
    var bento = document.getElementById('bento');

    var hero = list.find(function (p) { return p.id === HERO_ID; }) || list[0];
    if (hero) {
      var c = SG.cover(hero);
      heroBox.innerHTML =
        '<a class="card hero-card" href="project.html?id=' + encodeURIComponent(hero.id) + '" aria-label="' + SG.esc(hero.title) + '">' +
        '<div class="card-media ph" style="aspect-ratio:' + c.w + ' / ' + c.h + '">' +
        '<img class="lz" src="' + SG.esc(SG.src(c.src)) + '" alt="' + SG.esc(hero.title) + '" fetchpriority="high">' +
        '<span class="hero-tag"><span><b style="font-weight:500">' + SG.esc(hero.title.split(' — ')[0]) + '</b>' +
        '&nbsp;&nbsp;<span style="color:var(--muted)">' + SG.esc(SG.category(hero.category).name) + '</span></span>' +
        '<span class="go" aria-hidden="true">' + SG.ICON.arrowUpRight + '</span></span>' +
        '</div></a>';
    }

    var rest = list.filter(function (p) { return !hero || p.id !== hero.id; });
    var picked = FEATURED.map(function (id) { return rest.find(function (p) { return p.id === id; }); }).filter(Boolean);
    rest.forEach(function (p) { if (picked.length < 3 && picked.indexOf(p) < 0) picked.push(p); });

    if (!picked.length) {
      document.getElementById('featured').hidden = true;
    } else {
      bento.innerHTML = picked.map(function (p, i) {
        return SG.cardHTML(p, { cls: i === 0 && picked.length > 1 ? 'big' : '' });
      }).join('');
    }
    SG.revealImages();
  });
})();
