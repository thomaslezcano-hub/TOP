/**
 * VISUAL STORY — editorial mosaic. Verbs, not adjectives: the visitor pictures themselves on the ride.
 */
import { html } from '../../lib/html.mjs';
import { Media } from '../media.mjs';
import { SectionHead } from '../ui.mjs';

const SIZES = ['(min-width: 900px) 50vw, 100vw', '(min-width: 900px) 25vw, 50vw', '(min-width: 900px) 25vw, 50vw', '(min-width: 900px) 25vw, 50vw', '(min-width: 900px) 25vw, 100vw'];

export function Gallery(ctx) {
  const items = ctx.config.media.gallery.slice(0, 5);
  return html`<section class="section section--dark gallery" id="moments" aria-labelledby="gallery-title">
  <div class="container">
    ${SectionHead({
      id: 'gallery-title',
      eyebrow: 'Two hours, open air',
      title: 'The city feels different from a golf cart.',
      lede: 'Ocean breeze, no windows, and a local who knows exactly where to stop.',
      className: 'section-head--on-dark',
    })}
    <ul class="mosaic" role="list">
      ${items.map(
        (item, i) => html`<li class="mosaic__tile mosaic__tile--${i + 1} reveal">
        ${Media(ctx, item, { sizes: SIZES[i] })}
        <p class="mosaic__caption">${item.caption}</p>
      </li>`
      )}
    </ul>
  </div>
</section>`;
}
