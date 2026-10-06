/**
 * FINAL CTA — the emotional close after objections are handled by the FAQ.
 */
import { html } from '../../lib/html.mjs';
import { Wave } from '../icons.mjs';
import { Media, Video } from '../media.mjs';
import { BookButton, Price } from '../ui.mjs';

export function FinalCta(ctx) {
  const { config, main } = ctx;
  return html`<section class="final" id="final" aria-labelledby="final-title" data-final-cta>
  <div class="final__media">
    ${Media(ctx, config.media.final, { sizes: '100vw' })}
    ${Video(ctx, config.media.final)}
    <div class="final__scrim"></div>
  </div>
  <div class="container final__inner">
    <h2 id="final-title" class="final__title reveal"><span>Two hours.</span> <span>Your people.</span> <span>Your Fort Lauderdale.</span></h2>
    <p class="final__tagline reveal"><span>You choose the vibe. We build the ride.</span>${Wave('wave')}</p>
    <div class="final__book reveal">
      ${Price(ctx, main.price, { size: 'hero', prefix: 'Private experience from', unit: 'per group', note: 'not per person' })}
      ${BookButton(ctx, { location: 'final', label: 'Check availability' })}
    </div>
  </div>
</section>`;
}
