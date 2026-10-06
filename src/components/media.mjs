/**
 * Media slot: renders the real photo (responsive <picture>) when configured,
 * otherwise an art-directed placeholder that describes the exact shot to capture.
 * Replacing a photo = drop the file in /public/media and set its path in site.config.mjs.
 */
import { html, attrs, cx, raw } from '../lib/html.mjs';

const PALM = raw(
  '<svg class="ph__palm" viewBox="0 0 120 200" aria-hidden="true" focusable="false"><path d="M63 200c-2-40-6-80 2-130" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M65 70C52 52 30 46 6 58c22-6 40-2 59 12zM65 70c4-22 0-42-18-58 14 18 18 36 18 58zM65 70c10-20 28-30 50-28-20 4-34 14-50 28zM65 70c18-6 38 0 50 18-16-10-32-14-50-18zM65 70C48 66 28 72 16 92c14-14 30-20 49-22z" fill="currentColor"/></svg>'
);

export function Media(ctx, item, { sizes = '100vw', priority = false, className = '' } = {}) {
  const img = item.image ? ctx.images.get(item.image) : null;
  if (img) {
    return html`<picture class="${cx('media', className)}">
      ${img.sources.map((s) => html`<source type="${s.type}" srcset="${ctx.srcset(s.srcset)}" sizes="${sizes}">`)}
      <img${attrs({
        src: ctx.asset(img.fallback),
        alt: item.alt || '',
        width: img.width,
        height: img.height,
        loading: priority ? 'eager' : 'lazy',
        decoding: priority ? 'sync' : 'async',
        fetchpriority: priority ? 'high' : null,
      })}>
    </picture>`;
  }
  const palm = ['dusk', 'sunset', 'palm', 'city'].includes(item.tone);
  return html`<div class="${cx('media ph', className)}" data-tone="${item.tone || 'ocean'}" role="img" aria-label="${item.alt || ''}">
    <span class="ph__sun"></span>
    <span class="ph__sea"></span>
    ${palm ? PALM : ''}
    ${ctx.mark ? html`<span class="ph__label"><b>Photo placeholder</b> ${item.shot || ''}</span>` : ''}
  </div>`;
}

/** Optional background video. Sources load only after the page is interactive (see app.js). */
export function Video(ctx, item) {
  const v = item.video || {};
  if (!v.mp4 && !v.webm) return '';
  return html`<video class="media media--video" muted playsinline loop preload="none" aria-hidden="true" tabindex="-1" data-lazy-video>
    ${v.webm ? html`<source data-src="${ctx.asset(v.webm)}" type="video/webm">` : ''}
    ${v.mp4 ? html`<source data-src="${ctx.asset(v.mp4)}" type="video/mp4">` : ''}
  </video>`;
}
