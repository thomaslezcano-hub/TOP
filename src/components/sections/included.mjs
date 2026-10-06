/**
 * WHAT'S INCLUDED + VALUE — removes "what do I actually get?" and reframes $225 as a group price.
 * The ValueCard is its own component so it can be moved or A/B tested independently.
 */
import { html } from '../../lib/html.mjs';
import { isSet, money, perPerson, splitExamples } from '../../lib/format.mjs';
import { Icon } from '../icons.mjs';
import { SectionHead, BookButton, Price, PlaceholderTag } from '../ui.mjs';

export function Included(ctx) {
  const { main } = ctx;
  const items = [
    'Private golf cart for your group',
    `${main.durationHours}-hour private experience`,
    'Local driver-guide',
    'Flexible itinerary',
    'Photo stops',
    'Local recommendations',
    'Music onboard',
    'No strangers in your group',
    'Pickup options within our operating area',
  ];
  return html`<section class="section section--alt included" id="included" aria-labelledby="included-title">
  <div class="container included__grid">
    <div class="included__list">
      ${SectionHead({ id: 'included-title', eyebrow: "What's included", title: 'Everything you need. Nothing you don’t.' })}
      <ul class="checklist" role="list">
        ${items.map((t) => html`<li>${Icon('check', { size: 20 })}<span>${t}</span></li>`)}
      </ul>
    </div>
    ${ValueCard(ctx)}
  </div>
</section>`;
}

export function ValueCard(ctx) {
  const { main, config } = ctx;
  const groups = splitExamples(config.capacity.examples, config.capacity.maxGuests);
  return html`<aside class="value-card reveal" aria-labelledby="value-title">
  <p class="eyebrow" id="value-title">Private experience</p>
  ${Price(ctx, main.price, { size: 'xl', unit: 'total per group', note: 'not per person' })}
  <p class="value-card__copy">Instead of paying per person for a shared tour, reserve the whole cart for your people.</p>
  ${
    groups.length
      ? html`<div class="split">
      <p class="split__title">Split it your way</p>
      <dl class="split__rows">
        ${groups.map((n) => html`<div><dt>${n} guests</dt><dd>${money(perPerson(main.price, n), config.currency)} <span>each</span></dd></div>`)}
      </dl>
    </div>`
      : ctx.mark
        ? html`<div class="split split--ph">${PlaceholderTag(ctx)} <span>Per-person examples (e.g. “4 guests = $56.25 each”) appear here once <code>MAX_PASSENGERS</code> is set.</span></div>`
        : ''
  }
  ${BookButton(ctx, { location: 'value', label: 'Book your private experience', full: true, arrow: false })}
  ${isSet(config.policies.cancellationShort) ? html`<p class="fineprint">${Icon('shield', { size: 16 })}${config.policies.cancellationShort}</p>` : ''}
</aside>`;
}
