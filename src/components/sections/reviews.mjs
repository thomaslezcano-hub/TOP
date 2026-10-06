/**
 * SOCIAL PROOF — placed right after the booking cards, where the decision happens.
 * Never invented: placeholders are labeled, and the section hides itself in launch mode
 * (markPlaceholders = false) until real reviews exist.
 */
import { html, raw } from '../../lib/html.mjs';
import { isSet } from '../../lib/format.mjs';
import { Icon } from '../icons.mjs';
import { SectionHead, Stars, PlaceholderTag } from '../ui.mjs';

function ReviewCard(ctx, r) {
  return html`<li class="review${r.placeholder ? ' review--ph' : ''}">
  <div class="review__top">${Stars(r.rating || 5)}${r.placeholder ? PlaceholderTag(ctx) : ''}</div>
  <blockquote class="review__text"><p>${r.text}</p></blockquote>
  <div class="review__by">
    <span class="review__avatar" aria-hidden="true">${(r.name || '?').trim().charAt(0)}</span>
    <span><strong>${r.name}</strong>${r.date ? html`<span>${r.date}</span>` : ''}</span>
    ${r.source === 'google' ? html`<span class="review__source">${Icon('google', { size: 18 })}<span class="sr-only">Google review</span></span>` : ''}
  </div>
</li>`;
}

export function Reviews(ctx) {
  const { reviews } = ctx.config;
  const items = reviews.items.filter((r) => ctx.mark || !r.placeholder);
  const hasWidget = isSet(reviews.widget.html);
  if (!items.length && !hasWidget) return '';
  const { rating, count, url } = reviews.summary;
  const hasSummary = isSet(rating) && isSet(count);

  return html`<section class="section section--alt reviews" id="reviews" aria-labelledby="reviews-title">
  <div class="container">
    <div class="reviews__head">
      ${SectionHead({ id: 'reviews-title', eyebrow: 'Guest reviews', title: 'Loved by our guests' })}
      ${
        hasSummary
          ? html`<p class="rating-summary">${Stars(rating, 18)}<span><strong>${rating}</strong> based on ${count} Google reviews</span>${
              url ? html`<a href="${url}" target="_blank" rel="noopener" data-outbound="google-reviews">Read on Google ${Icon('external', { size: 16 })}</a>` : ''
            }</p>`
          : ctx.mark
            ? html`<p class="rating-summary rating-summary--ph">${PlaceholderTag(ctx)} “★★★★★ 4.9 based on XXX Google reviews” appears here once <code>reviews.summary</code> is set.</p>`
            : ''
      }
    </div>
    ${items.length ? html`<ul class="reviews__list" role="list">${items.map((r) => ReviewCard(ctx, r))}</ul>` : ''}
    ${hasWidget ? html`<div class="reviews__widget" data-reviews-widget="${reviews.widget.scriptSrc}">${raw(reviews.widget.html)}</div>` : ''}
  </div>
</section>`;
}
