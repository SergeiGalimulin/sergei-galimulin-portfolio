/* Общие данные и поведение для всех страниц. Список работ — SEED ниже. */
(function () {
  'use strict';

  var CATEGORIES = [
    { slug: 'realism', name: '3D Characters Realism' },
    { slug: 'stylized', name: '3D Characters Stylized' },
    { slug: 'creatures', name: '3D Creatures Realism' },
    { slug: 'creatures-stylized', name: '3D Creatures Stylized' },
    { slug: 'grooming-xgen', name: 'Grooming — XGen' },
    { slug: 'grooming-hair-cards', name: 'Grooming — Hair Cards' },
    { slug: 'hard-surface', name: 'Hard Surface Design' },
    { slug: 'motion-graphics', name: 'Motion Graphics' }
  ];
  var LABELS = ['Front', 'Back', 'Side', 'Detail', 'Turntable', 'Process', 'Before / After'];

  var ANIME = 'This project focuses on creating high-quality 3D anime character models with unique designs, detailed features, and appealing proportions. Each character is carefully modeled to achieve a clean, polished 3D appearance while maintaining the distinctive anime art style.\n\nThe project includes character modeling, facial details, hairstyle design, clothing, and overall 3D presentation, resulting in a visually attractive model suitable for animation, rendering, games, or digital showcases.';

  function img(file, w, h) { return { kind: 'image', src: 'assets/img/' + file, w: w, h: h, label: '' }; }
  function tile(file, w, h, label) { return { kind: 'image', src: 'assets/img/' + file, w: w, h: h, label: label }; }
  function vid(file, w, h, label) { return { kind: 'video', src: 'assets/video/' + file, w: w, h: h, label: label == null ? 'Turntable' : label }; }

  var SEED = [
    { id: 'flame-boss-nowa-online-world', title: 'Flame Boss — Nowa Online World', category: 'stylized', software: 'ZBrush, Maya, RizomUV, Substance 3D Painter', links: [{ label: 'Nowa Online World', url: 'https://www.nowaonlineworld.com/en/' }], description: 'Flame Boss is a stylized boss character created for Nowa Online World, a mobile game.\n\nThe character was made while working at RocketBrush Studio, which produced the 3D models for the game as an outsourcing partner. It was built as a game-ready asset for mobile: 4K textures and a standard PBR workflow, with albedo and emissive maps. The character comes in four colour variants: Volcano, Green, Sand and Winter. The presentation shows the final renders, the texture maps, the wireframe and the ZBrush sculpt.\n\nSoftware: ZBrush, Maya, RizomUV, Substance 3D Painter.', media: [img('p12_1.jpg', 1920, 1200), img('p12_2.jpg', 1920, 1200), img('p12_3.jpg', 2120, 1200), img('p12_4.jpg', 2120, 1200), img('p12_5.jpg', 2120, 1200), img('p12_6.jpg', 2120, 1200)], breakdown: [tile('p12_7.jpg', 2120, 1200, 'Volcano Render'), tile('p12_8.jpg', 2120, 1200, 'Volcano Albedo'), tile('p12_9.jpg', 2120, 1200, 'Volcano Emissive'), tile('p12_10.jpg', 1920, 1200, 'Green Albedo'), tile('p12_11.jpg', 1920, 1200, 'Green Emissive'), tile('p12_12.jpg', 1920, 1200, 'Sand Albedo'), tile('p12_13.jpg', 1920, 1200, 'Sand Emissive'), tile('p12_14.jpg', 1920, 1200, 'Winter Albedo'), tile('p12_15.jpg', 1920, 1200, 'Winter Emissive'), tile('p12_16.jpg', 1920, 2200, 'Wireframe Front'), tile('p12_17.jpg', 1920, 2200, 'Wireframe Back'), tile('p12_18.jpg', 1540, 862, 'ZBrush Sculpt')] },
    { id: 'rock-boss-nowa-online-world', title: 'Rock Boss — Nowa Online World', category: 'creatures-stylized', software: 'ZBrush, Maya, RizomUV, Substance 3D Painter', links: [{ label: 'Nowa Online World', url: 'https://www.nowaonlineworld.com/en/' }], description: 'Rock Boss is a stylized boss character created for Nowa Online World, a mobile game.\n\nThe character was made while working at RocketBrush Studio, which produced the 3D models for the game as an outsourcing partner. It was built as a game-ready asset for mobile: 4K textures and a standard PBR workflow, with albedo and emissive maps. The presentation shows the final renders, the texture maps, the wireframe and the ZBrush sculpt.\n\nSoftware: ZBrush, Maya, RizomUV, Substance 3D Painter.', media: [img('p11_1.jpg', 2120, 1200), img('p11_2.jpg', 1920, 1200), img('p11_3.jpg', 1920, 1200)], breakdown: [tile('p11_4.jpg', 2120, 1200, 'Albedo'), tile('p11_5.jpg', 2120, 1200, 'Emissive'), tile('p11_6.jpg', 2120, 1200, 'Wireframe'), tile('p11_7.jpg', 2120, 1200, 'ZBrush Sculpt')] },
    { id: 'cat-model', title: '3D Cat Model', category: 'creatures', description: 'A detailed 3D cat sculpture featuring a smooth, rounded body, defined pointed ears, a gently curved tail, and refined facial and body contours. Designed with clean geometry and a polished finish, suitable for 3D printing.', media: [img('p7_1.jpg', 1400, 913), img('p7_2.jpg', 1400, 803), img('p7_3.jpg', 1400, 886)] },
    { id: 'fantasy-dragon', title: 'Fantasy Dragon — 3D Sculpting & Character Modeling', category: 'creatures', description: 'A highly detailed fantasy dragon sculpture featuring an impressive creature design with enormous wings, layered scales, sharp horns, powerful claws, and intricate anatomical details. The dragon is posed on a beautifully sculpted rocky base with decorative ornamental elements, creating a premium collectible statue.\n\nThe project focuses on detailed organic sculpting, realistic textures, complex creature anatomy, and fine surface detailing. Designed for fantasy collectibles, tabletop displays, character art, and high-quality 3D printing.', media: [img('p8_1.jpg', 1400, 839), img('p8_2.jpg', 1400, 933), img('p8_3.jpg', 1400, 933)] },
    { id: 'adam-scott-likeness', title: 'Adam Scott — Realistic Likeness Character', category: 'realism', description: 'A realistic character portrait of Adam Scott, built as a full likeness study: a detailed head and facial sculpt, hand-built skin texturing, and a fully groomed hairstyle and beard.\n\nThe presentation covers final lit renders from several angles, the clay sculpt from five views, the diffuse, specular, coat and roughness texture maps, and two videos showing the groom and the final result.', media: [img('p10_1.jpg', 1920, 2248), img('p10_2.jpg', 1920, 2248), img('p10_3.jpg', 1920, 2248), img('p10_4.jpg', 2400, 1786), img('p10_5.jpg', 2050, 2400), img('p10_6.jpg', 2400, 866), vid('p10_1.mp4', 1920, 1080, ''), vid('p10_2.mp4', 1920, 1080, '')] }
  ].map(function (p) { return Object.assign({ software: '', published: true }, p); });

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  // Работы берутся только из списка SEED выше — одинаково для всех посетителей.
  function load() { return clone(SEED); }

  function publicProjects() { return load().filter(function (p) { return p.published; }); }

  function category(slug) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].slug === slug) return CATEGORIES[i];
    return { slug: slug, name: slug };
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Пути к файлам хранятся от корня сайта; админка лежит в /admin/ и подставляет '../'.
  function src(path) {
    if (/^(data:|blob:|https?:)/.test(path)) return path;
    return (document.body.getAttribute('data-base') || '') + path;
  }

  function cover(p) {
    for (var i = 0; i < p.media.length; i++) if (p.media[i].kind === 'image') return p.media[i];
    return null;
  }

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function mediaSummary(p) {
    var imgs = (p.breakdown || []).length + p.media.filter(function (m) { return m.kind === 'image'; }).length;
    var vids = p.media.filter(function (m) { return m.kind === 'video'; }).length;
    if (!p.media.length) return 'No media yet';
    return plural(imgs, 'image') + (vids ? ' · ' + plural(vids, 'video') : '');
  }

  // Картинка с заглушкой: уже скачанные показываются сразу, новые мягко проявляются.
  function revealImages(root) {
    (root || document).querySelectorAll('img.lz:not(.on)').forEach(function (im) {
      var box = im.closest('.ph');
      function show() { im.classList.add('on'); if (box) box.classList.add('done'); }
      if (im.complete && im.naturalWidth) { show(); return; }
      im.addEventListener('load', show, { once: true });
      im.addEventListener('error', show, { once: true });
    });
  }

  // Шапка прячется при прокрутке вниз и сразу возвращается при прокрутке вверх.
  function smartHeader() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var last = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var dy = y - last;
      if (Math.abs(dy) < 6) return;
      nav.classList.toggle('is-hidden', dy > 0 && y > 120);
      last = y;
    }, { passive: true });
  }

  function param(name) { return new URLSearchParams(location.search).get(name); }

  var ICON = {
    arrowUpRight: '<svg class="arr" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>',
    chevronLeft: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    chevronRight: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    play: '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>',
    close: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    box: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>'
  };

  // Карточка работы для главной и портфолио.
  function cardHTML(p, opts) {
    opts = opts || {};
    var c = cover(p);
    var hasVideo = p.media.some(function (m) { return m.kind === 'video'; });
    var ratio = opts.natural && c ? 'aspect-ratio:' + c.w + ' / ' + c.h + ';' : '';
    return '<a class="card' + (opts.cls ? ' ' + opts.cls : '') + '" href="project.html?id=' + encodeURIComponent(p.id) + '"' +
      (opts.delay != null ? ' style="animation-delay:' + opts.delay + 's"' : '') + '>' +
      '<div class="card-media ph" style="' + ratio + '">' +
      (c ? '<img class="lz" src="' + esc(src(c.src)) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async">' : '') +
      (hasVideo ? '<span class="card-video">' + ICON.play + 'Video</span>' : '') +
      '<span class="card-shade" aria-hidden="true"></span>' +
      '<span class="card-info"><span class="card-cat">' + esc(category(p.category).name) + '</span>' +
      '<span class="card-name">' + esc(p.title) + '</span></span>' +
      '</div></a>';
  }

  window.SG = {
    CATEGORIES: CATEGORIES, LABELS: LABELS, SEED: SEED,
    load: load, publicProjects: publicProjects,
    category: category, esc: esc, src: src, cover: cover, plural: plural, mediaSummary: mediaSummary,
    revealImages: revealImages, param: param, ICON: ICON, cardHTML: cardHTML
  };

  document.addEventListener('DOMContentLoaded', function () {
    smartHeader();
    revealImages();
  });
})();
