/**
 * Booking confirmation page (/thanks/). Fires Purchase once per booking ID.
 * noindex: it should never appear in search results.
 */
import { html, raw } from '../lib/html.mjs';
import { isSet } from '../lib/format.mjs';
import { SeoHead } from '../components/head.mjs';
import { Icon } from '../components/icons.mjs';
import { Logo } from '../components/ui.mjs';

export function renderThanks(ctx) {
  const { business } = ctx.config;
  const head = SeoHead(ctx, { title: 'You’re booked!', description: 'Booking confirmed.', path: '/thanks/', noindex: true });
  const contact = [
    isSet(business.phone) ? html`call or text <a href="tel:${business.phone}">${business.phoneDisplay || business.phone}</a>` : '',
    isSet(business.email) ? html`email <a href="mailto:${business.email}">${business.email}</a>` : '',
  ].filter(Boolean);
  const cap = (s) => html`${String(s).charAt(0).toUpperCase()}${raw(String(s).slice(1))}`;

  const body = html`<main class="thanks">
  <div class="container thanks__inner">
    <a class="brand" href="../">${Logo(ctx)}</a>
    <span class="success-mark">${Icon('check', { size: 30 })}</span>
    <h1 class="thanks__title">You’re booked.</h1>
    <p class="thanks__lede">Thanks for booking your private Fort Lauderdale ride. Your confirmation and details are on their way to your inbox.</p>
    <p class="thanks__tip">Start thinking about the vibe: beach, mansions, history, food, photos. Your guide will build the ride around it.</p>
    ${contact.length ? html`<p class="thanks__contact">Questions before your ride? ${contact.map((c, i) => (i ? html` or ${c}` : cap(c)))}.</p>` : ''}
    <a class="btn btn--outline btn--md thanks__back" href="../"><span>Back to the homepage</span></a>
  </div>
</main>`;
  return { head: String(head), body: String(body) };
}
