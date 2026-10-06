/**
 * Launch audit: lists every business value that is still a placeholder,
 * so nothing ships half-finished by accident. Printed at the end of each build.
 */
import { isSet } from './format.mjs';
import { auditPalette } from './color.mjs';

export function auditConfig(config) {
  const todo = [];
  const add = (key, why) => todo.push({ key, why });

  const { business, site, booking, tracking, reviews, policies, capacity, media, logo, legal, waitlist } = config;

  if (!isSet(business.name)) add('BUSINESS_NAME', 'Footer, schema.org and page titles');
  if (!isSet(logo.src)) add('logo.src', 'Header shows a "Your logo" placeholder');
  if (/example\.com/.test(site.url)) add('SITE_URL', 'Canonical, Open Graph and sitemap use example.com');
  if (booking.mode === 'placeholder') add('booking.mode', "Booking buttons open the test panel, not a real checkout");
  if (booking.mode === 'link' && !isSet(booking.url) && !config.tours.some((t) => isSet(t.bookingUrl)))
    add('BOOKING_URL', "booking.mode is 'link' but no booking URL is set");
  if (booking.mode === 'embed' && !isSet(booking.embedUrl)) add('booking.embedUrl', "booking.mode is 'embed' but no embed URL is set");
  if (!isSet(capacity.maxGuests)) add('MAX_PASSENGERS', 'Per-person price examples and the capacity FAQ are hidden');
  if (!isSet(business.phone) && !isSet(business.email)) add('PHONE / EMAIL', 'No contact details in FAQ or footer');
  if (!isSet(tracking.metaPixelId)) add('META_PIXEL_ID', 'Meta Pixel is not loaded');
  if (!isSet(tracking.ga4Id)) add('GA4_ID', 'Google Analytics 4 is not loaded');
  if (reviews.items.some((r) => r.placeholder)) add('reviews.items', 'Placeholder reviews are present');
  if (!isSet(reviews.summary.rating) || !isSet(reviews.summary.count)) add('reviews.summary', 'Google rating badge is hidden');
  for (const k of ['cancellation', 'weather', 'drinks', 'pickupArea'])
    if (!isSet(policies[k])) add(`policies.${k}`, 'FAQ answer is a placeholder');
  if (!isSet(policies.cancellationShort)) add('policies.cancellationShort', 'No risk-reversal line next to the booking buttons');
  if (!isSet(legal.privacyUrl)) add('legal.privacyUrl', 'Meta requires a privacy policy when the Pixel is active');
  if (!isSet(waitlist.endpoint)) add('waitlist.endpoint', 'Waitlist uses Netlify Forms (only works when hosted on Netlify)');

  const photos = [media.hero, media.final, ...media.gallery, ...Object.values(media.tours)];
  const missing = photos.filter((m) => !isSet(m.image)).length;
  if (missing) add('media.*.image', `${missing} of ${photos.length} photos are placeholders`);

  return { todo, palette: auditPalette(config.brand.colors) };
}
