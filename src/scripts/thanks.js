/* ──────────────────────────────────────────────────────────────────────────
 * CONFIRMATION PAGE — fires Purchase once per booking.
 * Point your booking system's "redirect after purchase" to:
 *   https://yourdomain.com/thanks/?tour=classic&value=225&booking_id={BOOKING_ID}
 * (param names are flexible: booking_id | order_id | transaction_id)
 * If your provider tracks purchases with its own Pixel/GA4 integration, use that instead
 * and remove this page from the flow to avoid double counting.
 * ────────────────────────────────────────────────────────────────────────── */
Attribution.init();
Analytics.init();
(function () {
  var p = new URLSearchParams(location.search);
  var intent = {};
  try { intent = JSON.parse(localStorage.getItem('fll_booking_intent') || '{}'); } catch (e) {}
  var tourId = p.get('tour') || intent.tour || 'classic';
  var t = SITE.tours[tourId] || SITE.tours.classic;
  var id = p.get('booking_id') || p.get('order_id') || p.get('transaction_id') || '';
  var value = parseFloat(p.get('value'));
  if (!(value > 0)) value = t.price;

  var key = 'fll_purchase_' + (id || 'session');
  var store = id ? localStorage : sessionStorage;
  try { if (store.getItem(key)) return; store.setItem(key, '1'); } catch (e) {}

  Analytics.track(
    'Purchase',
    { tour: tourId, tour_name: t.name, value: value, currency: SITE.currency, transaction_id: id || undefined, ref: Attribution.ref() || intent.ref || undefined },
    { eventId: id ? 'purchase.' + id : undefined }
  );
})();
