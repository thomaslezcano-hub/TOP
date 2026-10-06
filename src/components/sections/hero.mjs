/**
 * HERO — before any scroll the visitor must know: what it is, that it's private,
 * 2 hours, $225 PER GROUP, customizable, and how to book.
 */
import { html } from '../../lib/html.mjs';
import { isSet, money, perPerson, hoursLabel } from '../../lib/format.mjs';
import { Icon, Wave } from '../icons.mjs';
import { Media, Video } from '../media.mjs';
import { BookButton, Price, Stars, PlaceholderTag } from '../ui.mjs';

export function Hero(ctx) {
  const { config, main } = ctx;
  const { reviews, capacity, policies } = config;
  const hasRating = isSet(reviews.summary.rating) && isSet(reviews.summary.count);
  const max = capacity.maxGuests;

  return html`<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__media">
    ${Media(ctx, config.media.hero, { priority: true, sizes: '100vw' })}
    ${Video(ctx, config.media.hero)}
    <div class="hero__scrim"></div>
  </div>

  <div class="container hero__inner">
    <p class="hero__partner" data-partner-greeting hidden></p>
    <p class="eyebrow eyebrow--on-dark">Fort Lauderdale, your way.</p>
    <h1 id="hero-title" class="hero__title">Private Fort Lauderdale <span>Golf Cart Experience</span></h1>
    <p class="hero__tagline"><span>You choose the vibe. We build the ride.</span>${Wave('wave wave--draw')}</p>
    <p class="hero__lede">Beach, Las Olas, waterfront views, local favorites and hidden gems on a private ride built around your group.</p>

    <ul class="facts" aria-label="Experience details">
      <li>${Icon('clock')}<span>${hoursLabel(main.durationHours)}</span></li>
      <li>${Icon('lock')}<span>Private experience</span></li>
      <li>${Icon('route')}<span>Flexible route</span></li>
    </ul>

    <div class="hero__book">
      ${Price(ctx, main.price, { size: 'hero' })}
      ${BookButton(ctx, { location: 'hero', label: 'Check availability', full: true })}
      ${
        max
          ? html`<p class="hero__split">From only <strong>${money(perPerson(main.price, max), config.currency)} per person</strong> with a group of ${max}.</p>`
          : ''
      }
    </div>

    <ul class="trust" aria-label="Why guests book with us">
      ${
        hasRating
          ? html`<li class="trust__rating">${Stars(reviews.summary.rating, 15)}<span><strong>${reviews.summary.rating}</strong> · ${reviews.summary.count} Google reviews</span></li>`
          : ctx.mark
            ? html`<li class="trust__rating">${Stars(5, 15)}<span>Google Reviews ${PlaceholderTag(ctx, 'Placeholder')}</span></li>`
            : ''
      }
      <li>${Icon('guide', { size: 16 })}Local guide</li>
      <li>${Icon('sliders', { size: 16 })}Customizable</li>
      ${isSet(policies.cancellationShort) ? html`<li>${Icon('shield', { size: 16 })}${policies.cancellationShort}</li>` : ''}
    </ul>
  </div>
</section>`;
}
