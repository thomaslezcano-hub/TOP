/**
 * Landing page composition. Section order follows the decision path:
 * understand → want → trust → book, with a booking CTA after every major block.
 */
import { html } from '../lib/html.mjs';
import { SeoHead, Schema } from '../components/head.mjs';
import { Header } from '../components/header.mjs';
import { Footer } from '../components/footer.mjs';
import { StickyCta, WaitlistDialog, BookingTestDialog } from '../components/overlays.mjs';
import { Hero } from '../components/sections/hero.mjs';
import { Route } from '../components/sections/route.mjs';
import { Gallery } from '../components/sections/gallery.mjs';
import { Included } from '../components/sections/included.mjs';
import { Tours } from '../components/sections/tours.mjs';
import { Reviews } from '../components/sections/reviews.mjs';
import { Faq } from '../components/sections/faq.mjs';
import { FinalCta } from '../components/sections/final-cta.mjs';
import { Teaser } from '../components/sections/teaser.mjs';

export function renderIndex(ctx) {
  const head = ctx.preview ? html`<title>${ctx.main.schemaName}</title>` : html`${SeoHead(ctx)}\n${Schema(ctx)}`;

  const body = html`<a class="skip-link" href="#main">Skip to content</a>
${Header(ctx)}
<main id="main">
${Hero(ctx)}
${Route(ctx)}
${Gallery(ctx)}
${Included(ctx)}
${Tours(ctx)}
${Reviews(ctx)}
${Faq(ctx)}
${FinalCta(ctx)}
${Teaser(ctx)}
</main>
${Footer(ctx)}
${StickyCta(ctx)}
${WaitlistDialog(ctx)}
${ctx.config.booking.mode === 'placeholder' ? BookingTestDialog() : ''}`;

  return { head: String(head), body: String(body) };
}
