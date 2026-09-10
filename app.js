/* Faust GmbH – Startseiten-Entwurf | NEXAS Media 2026 */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  requestAnimationFrame(function () { document.body.classList.add('ready'); });
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* Header */
  var head = $('#head');
  var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var burger = $('.burger'), mnav = $('#mnav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    mnav.hidden = open;
    head.classList.add('is-stuck');
  });
  $$('#mnav a').forEach(function (a) {
    a.addEventListener('click', function () {
      burger.setAttribute('aria-expanded', 'false');
      mnav.hidden = true;
    });
  });

  /* Sanfte Einblendung */
  $$('.shead, .lrow, .proj, .fleet__intro, .fleet__list, .rail, .azubi__list, .azubi__img, .kform, .kdl, .note')
    .forEach(function (el) { el.setAttribute('data-reveal', ''); });

  if ('IntersectionObserver' in window && !reduce) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    $$('[data-reveal]').forEach(function (el) { revObs.observe(el); });
  } else {
    $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  }

  /* Schichtaufbau */
  var steps = $$('.step'), viz = $('.viz');
  function setLayer(active) {
    steps.forEach(function (s, i) { s.classList.toggle('on', i <= active); });
    $$('.lyr').forEach(function (l) {
      l.classList.toggle('on', parseInt(l.getAttribute('data-lyr'), 10) <= active);
    });
    viz.classList.toggle('done', active >= 4);
  }
  if (steps.length && 'IntersectionObserver' in window && !reduce) {
    setLayer(0);
    var sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setLayer(parseInt(e.target.getAttribute('data-step'), 10));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { sObs.observe(s); });
  } else if (steps.length) {
    setLayer(4);
  }

  /* Projektfilter */
  $$('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-f');
      $$('.chip').forEach(function (c) { c.classList.toggle('is-on', c === chip); });
      $$('.proj').forEach(function (p) {
        var on = f === 'alle' || p.getAttribute('data-c').split(' ').indexOf(f) > -1;
        p.classList.toggle('is-off', !on);
      });
    });
  });

  /* Zeitstrahl */
  var rail = $('#rail');
  $$('.rbtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = rail.querySelector('li');
      var step = card ? card.getBoundingClientRect().width + 16 : 300;
      rail.scrollBy({ left: step * parseInt(btn.getAttribute('data-dir'), 10), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* Formular */
  var kform = $('#kform');
  if (kform) {
    kform.addEventListener('submit', function () {
      kform.querySelector('button[type=submit]').textContent = 'E-Mail-Programm wird geöffnet …';
    });
  }
})();
