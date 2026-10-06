/* ──────────────────────────────────────────────────────────────────────────
 * UI — sticky mobile CTA, header state, scroll reveals, dialogs, waitlist form,
 * lazy video, hotel greeting, reviews widget, ViewContent.
 * Everything is progressive: without JS the page still reads and every link works.
 * ────────────────────────────────────────────────────────────────────────── */

var UI = (function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  var hasIO = 'IntersectionObserver' in window;

  /* Header: transparent over the hero, solid once the page scrolls (desktop keeps it fixed). */
  function header() {
    var el = $('[data-header]');
    if (!el) return;
    var ticking = false;
    function update() {
      el.classList.toggle('is-solid', window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* Sticky mobile CTA: visible once the hero CTA is out of view, hidden while any other
     booking area (tour cards, final CTA, footer) is on screen so there is never a duplicate. */
  function stickyCta() {
    var bar = $('[data-sticky-cta]');
    var heroCta = $('.hero [data-book]');
    if (!bar || !heroCta || !hasIO) return;
    var zones = [heroCta, $('[data-booking-section]'), $('[data-final-cta]'), $('[data-footer]')].filter(Boolean);
    var onScreen = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) onScreen.add(en.target);
        else onScreen.delete(en.target);
      });
      var show = onScreen.size === 0;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) bar.removeAttribute('inert');
      else bar.setAttribute('inert', '');
    });
    zones.forEach(function (z) { io.observe(z); });
  }

  /* Subtle fade-up for content below the fold. Elements already on screen are never hidden. */
  function reveals() {
    if (reduced || !hasIO) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('reveal--armed');
        io.observe(el);
      }
    });
  }

  /* ViewContent = the visitor actually reached the experiences/pricing. */
  function viewContent() {
    var section = $('[data-booking-section]');
    if (!section) return;
    var fire = function () { Analytics.trackOnce('ViewContent', Booking.payload('classic', 'tours-section')); };
    if (!hasIO) return fire();
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        fire();
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(section);
  }

  /* Dialogs (native <dialog>). */
  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.documentElement.classList.add('has-dialog');
  }
  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }
  function dialogs() {
    $$('dialog').forEach(function (d) {
      d.addEventListener('click', function (e) {
        if (e.target === d || e.target.closest('[data-close]')) closeDialog(d);
      });
      d.addEventListener('close', function () { document.documentElement.classList.remove('has-dialog'); });
    });
  }

  function openBookingTest(rows) {
    var d = $('[data-booking-test]');
    var dl = $('[data-test-data]', d);
    if (!d || !dl) return;
    dl.innerHTML = '';
    Object.keys(rows).forEach(function (k) {
      var row = document.createElement('div');
      var dt = document.createElement('dt');
      var dd = document.createElement('dd');
      dt.textContent = k;
      dd.textContent = rows[k];
      row.appendChild(dt);
      row.appendChild(dd);
      dl.appendChild(row);
    });
    openDialog(d);
  }

  /* Waitlist: Taste of Fort Lauderdale + celebrations. */
  function waitlist() {
    var d = $('[data-waitlist-dialog]');
    if (!d) return;
    var form = $('form', d);
    var error = $('[data-error]', d);
    var copy = {};
    try { copy = JSON.parse($('#waitlist-copy').textContent); } catch (e) {}

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-waitlist]');
      if (!btn) return;
      var interest = btn.getAttribute('data-waitlist');
      var c = copy[interest] || copy.taste || {};
      $$('[data-copy]', d).forEach(function (el) { el.textContent = c[el.getAttribute('data-copy')] || el.textContent; });
      form.elements.interest.value = interest;
      showView('form');
      openDialog(d);
    });

    function showView(name) {
      $$('[data-view]', d).forEach(function (v) { v.hidden = v.getAttribute('data-view') !== name; });
      error.hidden = true;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.company.value) return; // honeypot
      var email = form.elements.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        error.textContent = 'Please enter a valid email so we can let you know.';
        error.hidden = false;
        form.elements.email.focus();
        return;
      }
      var interest = form.elements.interest.value;
      form.elements.ref.value = Attribution.ref();
      form.elements.utm.value = JSON.stringify(Attribution.get().utm || {});
      var button = $('button[type="submit"]', form);
      button.disabled = true;

      var done = function () {
        Analytics.track('Lead', { interest: interest, cta: 'waitlist' });
        if (interest === 'taste') Analytics.track('FoodTourWaitlist', { interest: interest });
        form.reset();
        showView('success');
        button.disabled = false;
      };
      var fail = function () {
        error.textContent = 'We couldn’t save your email. Please try again' + (SITE.contactEmail ? ' or write to ' + SITE.contactEmail + '.' : '.');
        error.hidden = false;
        button.disabled = false;
      };

      if (SITE.preview) return done(); // static preview: nothing to post to

      var endpoint = SITE.waitlist.endpoint;
      var request = endpoint
        ? fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        : fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString(),
          });
      request.then(function (res) { if (!res.ok) throw new Error(res.status); done(); }).catch(fail);
    });
  }

  /* Background videos load after the page is interactive and only when motion/data allow. */
  function lazyVideos() {
    var videos = $$('[data-lazy-video]');
    if (!videos.length || reduced) return;
    var conn = navigator.connection || {};
    if (conn.saveData || /2g/.test(conn.effectiveType || '')) return;
    var start = function (v) {
      $$('source[data-src]', v).forEach(function (s) { s.src = s.getAttribute('data-src'); });
      v.load();
      v.addEventListener('playing', function () { v.classList.add('is-playing'); }, { once: true });
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    };
    var go = function () {
      videos.forEach(function (v) {
        if (!hasIO) return start(v);
        var io = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) {
            start(v);
            io.disconnect();
          }
        }, { rootMargin: '200px 0px' });
        io.observe(v);
      });
    };
    if (document.readyState === 'complete') setTimeout(go, 300);
    else window.addEventListener('load', function () { setTimeout(go, 300); });
  }

  /* Hotel QR visitors get a quiet welcome (only for refs listed in referral.partners). */
  function partnerGreeting() {
    var el = $('[data-partner-greeting]');
    var name = SITE.referral.partners && SITE.referral.partners[Attribution.ref()];
    if (!el || !name) return;
    el.textContent = 'Welcome, ' + name + ' guests';
    el.hidden = false;
  }

  /* Third-party reviews widget: load its script only when the section gets close. */
  function reviewsWidget() {
    var el = $('[data-reviews-widget]');
    var src = el && el.getAttribute('data-reviews-widget');
    if (!src) return;
    var load = function () {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      document.body.appendChild(s);
    };
    if (!hasIO) return load();
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        load();
        io.disconnect();
      }
    }, { rootMargin: '800px 0px' });
    io.observe(el);
  }

  function init() {
    header();
    stickyCta();
    reveals();
    viewContent();
    dialogs();
    waitlist();
    lazyVideos();
    partnerGreeting();
    reviewsWidget();
  }

  return {
    init: init,
    openBookingTest: openBookingTest,
    prefersReducedMotion: function () { return reduced; },
  };
})();
