/* ──────────────────────────────────────────────────────────────────────────
 * ATTRIBUTION — hotel referrals (?ref=HiltonBeach) + UTM + click IDs.
 *
 * - ref is sanitized, stored in localStorage (survives tabs/days) and sessionStorage,
 *   kept for referral.ttlDays, and resolved with the configured model:
 *     'last'  → a new, different ref replaces the stored one
 *     'first' → the first ref wins until it expires
 * - UTMs are last-touch for the session; fbclid/gclid are kept for ad platforms.
 * - Everything is attached to analytics events and appended to booking URLs.
 * ────────────────────────────────────────────────────────────────────────── */

var Attribution = (function () {
  var STORE_KEY = 'fll_attribution_v1';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var CLICK_KEYS = ['fbclid', 'gclid', 'gbraid', 'wbraid'];
  var cfg = SITE.referral;
  var state = null;

  function read(storage) {
    try {
      var raw = window[storage].getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function write(data) {
    var json = JSON.stringify(data);
    try { localStorage.setItem(STORE_KEY, json); } catch (e) {}
    try { sessionStorage.setItem(STORE_KEY, json); } catch (e) {}
  }

  /** Letters, numbers, dash, underscore and dot only; max 64 chars. */
  function clean(value) {
    if (!value) return '';
    return String(value).replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 64);
  }

  function init() {
    var params = new URLSearchParams(location.search);
    var now = Date.now();
    var ttl = (cfg.ttlDays || 30) * 864e5;
    var stored = read('localStorage') || read('sessionStorage') || {};

    if (stored.refExpires && stored.refExpires < now) {
      stored.ref = '';
      stored.refExpires = 0;
    }

    var incomingRef = clean(params.get(cfg.param || 'ref'));
    var data = {
      ref: stored.ref || '',
      refFirstSeen: stored.refFirstSeen || 0,
      refExpires: stored.refExpires || 0,
      utm: stored.utm || {},
      click: stored.click || {},
      landing: stored.landing || location.pathname + location.search,
      firstSeen: stored.firstSeen || now,
      lastSeen: now,
    };

    if (incomingRef) {
      var replace = !data.ref || (cfg.model !== 'first' && incomingRef !== data.ref);
      if (replace) {
        data.ref = incomingRef;
        data.refFirstSeen = now;
      }
      if (data.ref === incomingRef) data.refExpires = now + ttl;
    }

    var utm = {};
    var hasUtm = false;
    UTM_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) {
        utm[k] = v.slice(0, 100);
        hasUtm = true;
      }
    });
    if (hasUtm) data.utm = utm;

    CLICK_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) data.click[k] = v.slice(0, 200);
    });

    state = data;
    write(data);
    return data;
  }

  /** Flat params for analytics events. */
  function eventParams() {
    var s = state || {};
    var out = {};
    if (s.ref) out.ref = s.ref;
    var u = s.utm || {};
    if (u.utm_source) out.utm_source = u.utm_source;
    if (u.utm_medium) out.utm_medium = u.utm_medium;
    if (u.utm_campaign) out.utm_campaign = u.utm_campaign;
    return out;
  }

  /** Append ref (+ UTMs) to an outbound booking URL, keeping existing params. */
  function decorate(url) {
    if (!url || url.charAt(0) === '#') return url;
    try {
      var u = new URL(url, location.href);
      var s = state || {};
      if (s.ref && SITE.booking.refParam && !u.searchParams.has(SITE.booking.refParam)) u.searchParams.set(SITE.booking.refParam, s.ref);
      if (SITE.booking.passUtm) {
        Object.keys(s.utm || {}).forEach(function (k) {
          if (!u.searchParams.has(k)) u.searchParams.set(k, s.utm[k]);
        });
      }
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  return {
    init: init,
    get: function () { return state || {}; },
    ref: function () { return (state && state.ref) || ''; },
    eventParams: eventParams,
    decorate: decorate,
  };
})();
