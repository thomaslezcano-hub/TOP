/* ──────────────────────────────────────────────────────────────────────────
 * BOOKING — every [data-book] button goes through here.
 *   CheckAvailability  → any booking button tap
 *   SunsetInterest     → booking button for the Sunset experience
 *   BeginCheckout      → hand-off to the booking system (link / embed / test panel)
 * Modes (site.config.mjs → booking.mode): 'link' | 'embed' | 'placeholder'
 * ────────────────────────────────────────────────────────────────────────── */

var Booking = (function () {
  var B = SITE.booking;
  var INTENT_KEY = 'fll_booking_intent';

  function tour(id) {
    return SITE.tours[id] || SITE.tours.classic;
  }

  function urlFor(id) {
    return tour(id).bookingUrl || B.url || '';
  }

  function payload(id, cta) {
    var t = tour(id);
    return { tour: id, tour_name: t.name, value: t.price, currency: SITE.currency, cta: cta || '' };
  }

  /** Remember what was booked + the referral, so the confirmation page can report it. */
  function rememberIntent(id) {
    try {
      localStorage.setItem(INTENT_KEY, JSON.stringify({ tour: id, ref: Attribution.ref(), ts: Date.now() }));
    } catch (e) {}
  }

  function init() {
    if (B.mode === 'link') {
      document.querySelectorAll('a[data-book]').forEach(function (a) {
        var url = urlFor(a.getAttribute('data-book'));
        if (url) a.href = Attribution.decorate(url);
      });
    }
    if (B.providerScript) {
      // Provider popup scripts (e.g. FareHarbor lightframe) intercept the decorated links.
      var s = document.createElement('script');
      s.src = B.providerScript;
      s.async = true;
      document.body.appendChild(s);
    }
    if (B.mode === 'embed') watchEmbed();
    document.addEventListener('click', onClick);
  }

  function onClick(e) {
    var el = e.target.closest('[data-book]');
    if (!el) return;
    var id = el.getAttribute('data-book');
    var p = payload(id, el.getAttribute('data-cta'));

    Analytics.track('CheckAvailability', p);
    if (id === 'sunset') Analytics.track('SunsetInterest', p);

    if (B.mode === 'link') {
      if (!urlFor(id)) return; // no URL yet: the link just scrolls to #tours
      Analytics.track('BeginCheckout', p);
      rememberIntent(id);
      // Same-tab navigation without a provider popup: give pixels ~200ms to send.
      if (!B.openInNewTab && !B.providerScript && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        var href = el.href;
        setTimeout(function () {
          location.href = href;
        }, 200);
      }
      return;
    }

    if (B.mode === 'embed') {
      e.preventDefault();
      loadEmbed();
      Analytics.track('BeginCheckout', p);
      rememberIntent(id);
      var target = document.getElementById('book');
      if (target) {
        target.scrollIntoView({ behavior: UI.prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
      return;
    }

    // Placeholder mode: show the test panel with exactly what would happen.
    e.preventDefault();
    Analytics.track('BeginCheckout', p);
    rememberIntent(id);
    UI.openBookingTest({
      Experience: tour(id).name,
      Price: '$' + tour(id).price + ' per group',
      'Hotel referral (ref)': Attribution.ref() || '— (try adding ?ref=HiltonBeach to the URL)',
      Campaign: (Attribution.get().utm || {}).utm_campaign || '—',
      'Would open': Attribution.decorate(urlFor(id) || 'https://your-booking-system.com/fort-lauderdale-' + id),
    });
  }

  var embedLoaded = false;
  function loadEmbed() {
    if (embedLoaded) return;
    var frame = document.querySelector('[data-embed-src]');
    if (!frame) return;
    frame.src = Attribution.decorate(frame.getAttribute('data-embed-src'));
    embedLoaded = true;
  }

  function watchEmbed() {
    var section = document.querySelector('[data-booking-section]');
    if (!section || !('IntersectionObserver' in window)) return loadEmbed();
    var io = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          loadEmbed();
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(section);
  }

  return { init: init, payload: payload };
})();
