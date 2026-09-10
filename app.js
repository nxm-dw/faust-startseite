/* Faust GmbH — Startseiten-Entwurf | NEXAS Media 2026 */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Ladefolge ─────────────────────────────────────────── */
  requestAnimationFrame(function () { document.body.classList.add('ready'); });
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ── Header ────────────────────────────────────────────── */
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

  /* ── Reveal beim Scrollen ──────────────────────────────── */
  $$('.shead, .card, .proj, .fleet__list li, .fleet__pics figure, .rail, .azubi__list, .azubi__img, .kform, .kdl, .calc__form, .calc__out, .aufbau__note')
    .forEach(function (el) { el.setAttribute('data-reveal', ''); });

  if ('IntersectionObserver' in window && !reduce) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    $$('[data-reveal]').forEach(function (el) { revObs.observe(el); });
  } else {
    $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Zähler ────────────────────────────────────────────── */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduce || el.hasAttribute('data-plain')) { el.textContent = target; return; }
    var dur = 1100, t0 = null;
    function tick(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); cObs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { cObs.observe(el); });
  } else {
    $$('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ── Signature: Schichtaufbau ──────────────────────────── */
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
  } else {
    setLayer(4);
  }

  /* ── Flächen-Rechner ───────────────────────────────────── */
  var AUFBAU = {
    terrasse: { cm: 25, txt: '15 cm Schotter · 4 cm Bettung · 6 cm Belag', tag: 35,  p: [45, 65] },
    einfahrt: { cm: 42, txt: '30 cm Frostschutz · 4 cm Bettung · 8 cm Belag', tag: 55, p: [62, 88] },
    gewerbe:  { cm: 64, txt: '40 cm Frostschutz · 12 cm Tragschicht · 4 cm Bettung · 8 cm Belag', tag: 70, p: [85, 120] },
    strasse:  { cm: 67, txt: '40 cm Frostschutz · 15 cm Tragschicht · 4 cm Bettung · 8 cm Decke', tag: 90, p: [80, 115] }
  };
  var BELAG = {
    beton:       { name: 'Betonpflaster',      p: [62, 92],   masch: true,  tag: 1 },
    grossformat: { name: 'Großformatplatten',  p: [105, 165], masch: true,  tag: 0.75 },
    naturstein:  { name: 'Naturstein',         p: [118, 190], masch: false, tag: 0.6 },
    asphalt:     { name: 'Asphalt',            p: [28, 48],   masch: false, tag: 4.5 }
  };

  var form = $('#calcForm');
  var nf = new Intl.NumberFormat('de-DE');
  function euro(n) { return nf.format(Math.round(n / 10) * 10) + ' €'; }

  function rechne() {
    if (!form) return;
    var nutzung = form.querySelector('input[name=nutzung]:checked').value;
    var belag   = form.querySelector('input[name=belag]:checked').value;
    var qm      = parseInt($('#qm').value, 10);
    var a = AUFBAU[nutzung], b = BELAG[belag];

    $('#qmOut').innerHTML = '<b>' + nf.format(qm) + '</b> m²';

    /* Preisspanne je m² */
    var lo = a.p[0] + b.p[0], hi = a.p[1] + b.p[1];

    /* Klein- und Großflächen */
    var note = '';
    if (qm < 25)       { lo *= 1.30; hi *= 1.30; note = 'Kleine Flächen sind pro Quadratmeter teurer: An- und Abtransport, Rüstzeit und Verdichtungsgerät fallen genauso an wie bei 200 m².'; }
    else if (qm < 60)  { lo *= 1.15; hi *= 1.15; note = 'Unter 60 m² schlagen Anfahrt und Gerätevorhaltung stärker durch. Wenn ohnehin etwas ansteht, lohnt es sich, beides in einem Zug zu bauen.'; }
    else if (qm > 1000){ lo *= 0.88; hi *= 0.88; }
    else if (qm > 600) { lo *= 0.92; hi *= 0.92; }

    /* Maschinelle Verlegung */
    var tagesleistung = a.tag * b.tag;
    var maschinell = b.masch && qm >= 400;
    if (maschinell) {
      tagesleistung *= 2.2; lo *= 0.94; hi *= 0.94;
      note = 'Ab etwa 400 m² setzen wir unsere Pflasterverlegemaschine ein. Das verkürzt die Bauzeit spürbar und macht das Fugenbild gleichmäßiger — beides ist in dieser Schätzung schon berücksichtigt.';
    }
    if (belag === 'asphalt') {
      note = note || 'Asphalt bauen wir mit eigenem Fertiger ein. Die Fläche ist in der Regel am Folgetag wieder befahrbar.';
    }
    if (!note) {
      note = nutzung === 'strasse'
        ? 'Bei öffentlichen Flächen kommen Verkehrssicherung, Absperrung und Beweissicherung dazu. Den Aufwand stimmen wir mit der Gemeinde ab.'
        : 'Der Rahmen setzt eine normal zugängliche Baustelle und unbelasteten Aushub voraus. Beides klären wir beim Ortstermin.';
    }

    /* Aushub und Abtransport */
    var m3 = qm * (a.cm / 100) * 1.25;
    var fuhren = Math.max(1, Math.ceil(m3 / 9));

    /* Bauzeit */
    var d = Math.max(1, Math.ceil(qm / tagesleistung));
    if (qm > 80) d += 1;
    var d2 = d + Math.max(1, Math.round(d * 0.4));

    $('#oPreis').textContent   = euro(qm * lo) + ' – ' + euro(qm * hi);
    $('#oAufbau').textContent  = a.cm + ' cm gesamt';
    $('#oAushub').textContent  = nf.format(Math.round(m3)) + ' m³';
    $('#oFuhren').textContent  = fuhren + (fuhren === 1 ? ' LKW-Fuhre' : ' LKW-Fuhren');
    $('#oZeit').textContent    = d + '–' + d2 + ' Arbeitstage';
    $('#oHinweis').textContent = note;

    $('#oAufbau').title = a.txt;
    form.dataset.summary =
      'Fläche: ' + nf.format(qm) + ' m² · ' + b.name + '\n' +
      'Nutzung: ' + form.querySelector('input[name=nutzung]:checked').closest('.choice').querySelector('b').textContent + '\n' +
      'Empfohlener Aufbau: ' + a.cm + ' cm (' + a.txt + ')\n' +
      'Aushub ca. ' + nf.format(Math.round(m3)) + ' m³, ' + fuhren + ' Fuhren\n' +
      'Bauzeit ca. ' + d + '–' + d2 + ' Arbeitstage\n' +
      'Richtwert laut Rechner: ' + euro(qm * lo) + ' – ' + euro(qm * hi) + ' netto';
  }
  if (form) {
    form.addEventListener('input', rechne);
    form.addEventListener('change', rechne);
    rechne();
  }

  var toForm = $('#toForm');
  if (toForm) {
    toForm.addEventListener('click', function () {
      var msg = $('#kmsg');
      msg.value = 'Anfrage über den Flächen-Rechner\n\n' + form.dataset.summary + '\n\nMeine Situation: ';
      document.getElementById('kontakt').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { msg.focus(); msg.setSelectionRange(msg.value.length, msg.value.length); }, reduce ? 0 : 700);
    });
  }

  /* ── Projektfilter ─────────────────────────────────────── */
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

  /* ── Zeitstrahl ────────────────────────────────────────── */
  var rail = $('#rail');
  $$('.rbtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = rail.querySelector('li');
      var step = card ? card.getBoundingClientRect().width + 18 : 300;
      rail.scrollBy({ left: step * parseInt(btn.getAttribute('data-dir'), 10), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ── Formular: Bestätigung statt stiller mailto-Weiterleitung ── */
  var kform = $('#kform');
  if (kform) {
    kform.addEventListener('submit', function () {
      var btn = kform.querySelector('button[type=submit]');
      btn.textContent = 'E-Mail-Programm wird geöffnet …';
    });
  }
})();
