/**
 * NO FIXED ROUTE — the differentiator. Turns "golf cart tour" into "our own private ride".
 */
import { html } from '../../lib/html.mjs';
import { Icon, Wave } from '../icons.mjs';
import { SectionHead, BookButton } from '../ui.mjs';

const CARDS = [
  {
    icon: 'waves',
    title: 'See the icons',
    text: 'The beach, Las Olas, Downtown and the waterfront. The places you came to Fort Lauderdale for.',
  },
  {
    icon: 'gem',
    title: 'Discover the hidden gems',
    text: 'Local spots, stories and corners most visitors drive right past.',
  },
  {
    icon: 'sliders',
    title: 'Make it yours',
    text: 'More mansions? More photos? More history? Somewhere great to eat? Tell your guide what your group is into.',
    chips: ['Mansions', 'Photo stops', 'Local history', 'Restaurants', 'Beach time', 'Waterfront'],
    highlight: true,
  },
];

export function Route(ctx) {
  return html`<section class="section route" id="experience" aria-labelledby="route-title">
  <div class="container">
    ${SectionHead({
      id: 'route-title',
      eyebrow: 'No fixed route',
      title: 'No boring tour script. This is your Fort Lauderdale.',
      lede: 'We bring the local knowledge and the best stops. Your group decides where the two hours go.',
    })}
    <ul class="route__cards" role="list">
      ${CARDS.map(
        (c) => html`<li class="route-card${c.highlight ? ' route-card--highlight' : ''} reveal">
        <span class="route-card__icon">${Icon(c.icon, { size: 24 })}</span>
        <h3 class="h3">${c.title}</h3>
        <p>${c.text}</p>
        ${c.chips ? html`<ul class="chips" aria-label="Popular requests">${c.chips.map((chip) => html`<li>${chip}</li>`)}</ul>` : ''}
      </li>`
      )}
    </ul>
    <div class="route__close reveal">
      <p class="statement"><span>You choose the vibe. We build the ride.</span>${Wave('wave')}</p>
      ${BookButton(ctx, { location: 'route', label: 'Check availability', variant: 'link', size: 'md' })}
    </div>
  </div>
</section>`;
}
