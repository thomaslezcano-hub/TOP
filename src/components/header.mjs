/**
 * Minimal header for paid traffic: logo, two in-page anchors, one booking button.
 * No outbound links. On mobile only logo + Book (the sticky bottom bar takes over on scroll).
 */
import { html } from '../lib/html.mjs';
import { BookButton, Logo } from './ui.mjs';

export function Header(ctx) {
  return html`<header class="site-header" data-header>
  <div class="container site-header__bar">
    <a class="brand" href="#top" aria-label="${ctx.config.business.name || 'Home'}">${Logo(ctx)}</a>
    <nav class="site-nav" aria-label="On this page">
      <a href="#tours">Tours</a>
      <a href="#faq">FAQ</a>
    </nav>
    ${BookButton(ctx, { location: 'header', label: 'Book now', size: 'sm', arrow: false })}
  </div>
</header>`;
}
