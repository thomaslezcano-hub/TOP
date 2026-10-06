/**
 * PREMIUM TEASER — deliberately small and placed after the final CTA so it never competes
 * with the $225 booking. Collects early demand for celebrations / romantic packages.
 */
import { html } from '../../lib/html.mjs';
import { Icon } from '../icons.mjs';
import { WaitlistButton } from '../ui.mjs';

export function Teaser() {
  return html`<section class="teaser" aria-labelledby="teaser-title">
  <div class="container teaser__inner">
    <span class="teaser__icon">${Icon('sparkle', { size: 22 })}</span>
    <div>
      <h2 id="teaser-title" class="teaser__title">Looking for something unforgettable?</h2>
      <p>Private celebrations and romantic experiences are coming soon.</p>
    </div>
    ${WaitlistButton({ interest: 'celebrations', location: 'teaser', label: 'Get early access', variant: 'link', size: 'md' })}
  </div>
</section>`;
}
