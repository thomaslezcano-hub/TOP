/* ──────────────────────────────────────────────────────────────────────────
 * ANALYTICS — one `track(name, params)` call fans out to:
 *   · dataLayer (Google Tag Manager, always)
 *   · Meta Pixel (standard or custom event, with eventID for future Conversions API dedup)
 *   · GA4 (recommended event names)
 *   · Google Ads conversions (when a label is configured)
 * IDs live in site.config.mjs → tracking. Empty IDs = that platform is simply not loaded.
 * Add ?debug=1 to any URL to see every event on screen and in the console.
 * ────────────────────────────────────────────────────────────────────────── */

var Analytics = (function () {
  var T = SITE.tracking;
  var debug = false;
  var once = {};

  // Internal name → platform names. Meta: [method, event]. GA4: event name. ads: conversion key.
  var EVENTS = {
    PageView: { meta: ['track', 'PageView'] }, // GA4 sends page_view automatically
    ViewContent: { meta: ['track', 'ViewContent'], ga: 'view_item' },
    CheckAvailability: { meta: ['trackCustom', 'CheckAvailability'], ga: 'check_availability' },
    BeginCheckout: { meta: ['track', 'InitiateCheckout'], ga: 'begin_checkout', ads: 'BeginCheckout' },
    Purchase: { meta: ['track', 'Purchase'], ga: 'purchase', ads: 'Purchase' },
    Lead: { meta: ['track', 'Lead'], ga: 'generate_lead', ads: 'Lead' },
    FoodTourWaitlist: { meta: ['trackCustom', 'FoodTourWaitlist'], ga: 'food_tour_waitlist' },
    SunsetInterest: { meta: ['trackCustom', 'SunsetInterest'], ga: 'sunset_interest' },
  };

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function initDebug() {
    try {
      var m = location.search.match(/[?&]debug=([01])/);
      if (m) sessionStorage.setItem('fll_debug', m[1]);
      debug = sessionStorage.getItem('fll_debug') === '1';
    } catch (e) {
      debug = /[?&]debug=1/.test(location.search);
    }
  }

  function init() {
    initDebug();
    window.dataLayer = window.dataLayer || [];
    var ref = Attribution.ref();

    if (T.gtmId) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js', hotel_ref: ref || undefined });
      loadScript('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(T.gtmId));
    }

    if (T.metaPixelId) {
      // Meta Pixel base code (official snippet, unminified)
      var n = (window.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      loadScript('https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', T.metaPixelId);
    }

    var gtagId = T.ga4Id || (T.googleAds && T.googleAds.id);
    if (gtagId) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gtagId));
      if (ref) window.gtag('set', 'user_properties', { hotel_ref: ref });
      if (T.ga4Id) window.gtag('config', T.ga4Id);
      if (T.googleAds && T.googleAds.id) window.gtag('config', T.googleAds.id);
    }

    track('PageView');
  }

  function eventId(name) {
    return name + '.' + Date.now().toString(36) + '.' + Math.random().toString(36).slice(2, 8);
  }

  /** Split our flat params into each platform's expected shape. */
  function shape(d) {
    var base = {};
    Object.keys(d).forEach(function (k) {
      if (['tour', 'tour_name', 'value', 'currency', 'transaction_id'].indexOf(k) === -1 && d[k] !== undefined && d[k] !== '') base[k] = d[k];
    });
    var meta = Object.assign({}, base);
    var ga = Object.assign({}, base);
    if (d.tour) {
      meta.content_ids = [d.tour];
      meta.content_type = 'product';
      if (d.tour_name) meta.content_name = d.tour_name;
      ga.items = [{ item_id: d.tour, item_name: d.tour_name || d.tour, price: d.value, quantity: 1 }];
    }
    if (d.value !== undefined) {
      meta.value = ga.value = d.value;
      meta.currency = ga.currency = d.currency || SITE.currency;
    }
    if (d.transaction_id) ga.transaction_id = d.transaction_id;
    return { meta: meta, ga: ga };
  }

  function track(name, params, opts) {
    var map = EVENTS[name] || { meta: ['trackCustom', name], ga: name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() };
    var data = Object.assign({}, Attribution.eventParams(), params || {});
    var id = (opts && opts.eventId) || eventId(name);
    var shaped = shape(data);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name, event_id: id }, data));

    if (window.fbq && map.meta) window.fbq(map.meta[0], map.meta[1], shaped.meta, { eventID: id });
    if (window.gtag && T.ga4Id && map.ga) window.gtag('event', map.ga, Object.assign({ send_to: T.ga4Id }, shaped.ga));

    var label = map.ads && T.googleAds && T.googleAds.conversions && T.googleAds.conversions[map.ads];
    if (window.gtag && label) {
      window.gtag('event', 'conversion', {
        send_to: label,
        value: data.value,
        currency: data.value !== undefined ? data.currency || SITE.currency : undefined,
        transaction_id: data.transaction_id,
      });
    }

    if (debug) log(name, data, id);
  }

  /** Fire an event only once per page view (e.g. ViewContent). */
  function trackOnce(name, params) {
    if (once[name]) return;
    once[name] = true;
    track(name, params);
  }

  var panel;
  function log(name, data, id) {
    try {
      console.info('[track]', name, data, id);
      if (!panel) {
        panel = document.createElement('div');
        panel.className = 'debug-panel';
        panel.setAttribute('aria-live', 'polite');
        document.body.appendChild(panel);
      }
      var row = document.createElement('p');
      row.textContent = name + '  ' + JSON.stringify(data);
      panel.prepend(row);
      while (panel.children.length > 6) panel.lastChild.remove();
    } catch (e) {}
  }

  return { init: init, track: track, trackOnce: trackOnce, isDebug: function () { return debug; } };
})();
