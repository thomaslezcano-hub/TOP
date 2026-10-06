/**
 * Shared UI primitives. Every price, booking button and placeholder marker on the page
 * goes through these, so behavior and tracking stay consistent everywhere.
 */
import { html, attrs, cx } from '../lib/html.mjs';
import { isSet } from '../lib/format.mjs';
import { Icon } from './icons.mjs';

/**
 * Primary conversion element. Renders a real <a href> (works without JS, and with provider
 * popups like FareHarbor's lightframe). The runtime adds ref/UTM params and fires events.
 */
export function BookButton(ctx, { tour = 'classic', location, label, variant = 'cta', size = 'lg', full = false, arrow = true }) {
  const t = ctx.tour(tour);
  const newTab = ctx.config.booking.mode === 'link' && ctx.config.booking.openInNewTab;
  return html`<a${attrs({
    class: cx('btn', `btn--${variant}`, `btn--${size}`, full && 'btn--full'),
    href: ctx.bookingHref(t),
    'data-book': t.id,
    'data-cta': location,
    target: newTab ? '_blank' : null,
    rel: newTab ? 'noopener' : null,
  })}><span>${label}</span>${arrow ? Icon('arrow', { size: 18 }) : ''}</a>`;
}

/** Opens the waitlist dialog. `interest` is sent with the signup ("taste" | "celebrations"). */
export function WaitlistButton({ interest = 'taste', location, label, variant = 'outline', size = 'lg', full = false }) {
  return html`<button type="button"${attrs({
    class: cx('btn', `btn--${variant}`, `btn--${size}`, full && 'btn--full'),
    'data-waitlist': interest,
    'data-cta': location,
  })}><span>${label}</span></button>`;
}

export const Eyebrow = (text, className = '') => html`<p class="${cx('eyebrow', className)}">${text}</p>`;

/** Section heading block: eyebrow + h2 + optional lede. */
export function SectionHead({ id, eyebrow, title, lede, className = '' }) {
  return html`<header class="${cx('section-head', className)}">
    ${eyebrow ? Eyebrow(eyebrow) : ''}
    <h2 id="${id}" class="h2">${title}</h2>
    ${lede ? html`<p class="lede">${lede}</p>` : ''}
  </header>`;
}

/**
 * Price with its unit spelled out. "Per group" is the single most important detail on the page.
 * sizes: 'hero' | 'xl' | 'card' | 'inline'
 */
export function Price(ctx, amount, { size = 'card', unit = 'per group', note = 'not per person', prefix = '' } = {}) {
  return html`<p class="${cx('price', `price--${size}`)}">
    ${prefix ? html`<span class="price__prefix">${prefix}</span>` : ''}
    <span class="price__amount">${ctx.money(amount)}</span>
    <span class="price__unit"><strong>${unit}</strong>${note ? html`<span>${note}</span>` : ''}</span>
  </p>`;
}

export function Stars(rating = 5, size = 16) {
  const full = Math.round(rating);
  return html`<span class="stars" role="img" aria-label="${`Rated ${rating} out of 5`}">${Array.from({ length: 5 }, (_, i) =>
    Icon('star', { size, filled: i < full })
  )}</span>`;
}

/** Visible "PLACEHOLDER" marker. Renders nothing when site.markPlaceholders is false. */
export function PlaceholderTag(ctx, text = 'Placeholder') {
  return ctx.mark ? html`<span class="ph-tag">${text}</span>` : '';
}

/** Logo: real files if configured, else the business name, else a clearly marked placeholder. */
export function Logo(ctx) {
  const { logo, business } = ctx.config;
  if (isSet(logo.src)) {
    const dark = isSet(logo.srcOnDark) ? logo.srcOnDark : logo.src;
    return html`<img class="logo logo--on-light" src="${ctx.asset(logo.src)}" alt="${logo.alt}" width="${logo.width}" height="${logo.height}" decoding="async">
      <img class="logo logo--on-dark" src="${ctx.asset(dark)}" alt="" aria-hidden="true" width="${logo.width}" height="${logo.height}" decoding="async">`;
  }
  if (isSet(business.name)) return html`<span class="logo-text">${Icon('cart', { size: 22 })}<span>${business.name}</span></span>`;
  return html`<span class="logo-ph" title="Logo placeholder: set logo.src in site.config.mjs">${Icon('cart', { size: 22 })}<span>Your logo</span></span>`;
}
