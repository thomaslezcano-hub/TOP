/** Footer: contact as text, legal links, nothing that pulls the visitor away. */
import { html } from '../lib/html.mjs';
import { isSet } from '../lib/format.mjs';
import { Logo } from './ui.mjs';

export function Footer(ctx) {
  const { business, legal } = ctx.config;
  const name = business.name || 'Business name';
  return html`<footer class="site-footer" data-footer>
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <span class="brand brand--footer">${Logo(ctx)}</span>
      <p>Private golf cart experiences in Fort Lauderdale, Florida.</p>
      <p class="coords">26.1224° N · 80.1373° W</p>
    </div>
    <div class="site-footer__contact">
      ${isSet(business.phone) ? html`<a href="tel:${business.phone}" data-outbound="phone">${business.phoneDisplay || business.phone}</a>` : ''}
      ${isSet(business.email) ? html`<a href="mailto:${business.email}" data-outbound="email">${business.email}</a>` : ''}
      ${isSet(business.instagramUrl) ? html`<a href="${business.instagramUrl}" target="_blank" rel="noopener" data-outbound="instagram">Instagram</a>` : ''}
    </div>
  </div>
  <div class="container">
    <div class="site-footer__legal">
      <p>© ${ctx.year} ${name}</p>
      ${isSet(legal.privacyUrl) ? html`<a href="${legal.privacyUrl}">Privacy</a>` : ''}
      ${isSet(legal.termsUrl) ? html`<a href="${legal.termsUrl}">Terms</a>` : ''}
    </div>
  </div>
</footer>`;
}
