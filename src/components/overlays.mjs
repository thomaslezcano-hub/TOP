/**
 * Sticky mobile CTA + dialogs (waitlist, booking test panel).
 * Dialogs use native <dialog>: focus trapping, Esc to close and a11y for free.
 */
import { html } from '../lib/html.mjs';
import { hoursShort } from '../lib/format.mjs';
import { Icon } from './icons.mjs';
import { BookButton } from './ui.mjs';

export function StickyCta(ctx) {
  const { main } = ctx;
  return html`<div class="sticky-cta" data-sticky-cta aria-hidden="true" inert>
  <p class="sticky-cta__info"><span>${hoursShort(main.durationHours)} · Private</span><strong>${ctx.money(main.price)} <small>per group</small></strong></p>
  ${BookButton(ctx, { location: 'sticky', label: 'Book now', size: 'md', arrow: false })}
</div>`;
}

const WAITLIST_COPY = {
  taste: {
    badge: 'Coming soon',
    title: 'Taste of Fort Lauderdale',
    text: 'A private golf cart food ride through local favorites. Join the waitlist and we’ll email you when it launches.',
  },
  celebrations: {
    badge: 'Coming soon',
    title: 'Private celebrations',
    text: 'Beach picnics, live music, boat rides and custom celebration packages are on the way. Leave your email to hear first.',
  },
};

export function WaitlistDialog(ctx) {
  const { main } = ctx;
  return html`<dialog class="dialog" id="waitlist-dialog" aria-labelledby="waitlist-title" data-waitlist-dialog>
  <button class="dialog__close" type="button" data-close aria-label="Close">${Icon('close')}</button>
  <div class="dialog__view" data-view="form">
    <span class="badge badge--soon" data-copy="badge">${WAITLIST_COPY.taste.badge}</span>
    <h2 class="dialog__title" id="waitlist-title" data-copy="title">${WAITLIST_COPY.taste.title}</h2>
    <p data-copy="text">${WAITLIST_COPY.taste.text}</p>
    <form class="waitlist-form" name="waitlist" method="POST" data-netlify="true" netlify-honeypot="company" novalidate>
      <input type="hidden" name="form-name" value="waitlist">
      <input type="hidden" name="interest" value="taste">
      <input type="hidden" name="ref" value="">
      <input type="hidden" name="utm" value="">
      <p class="hp" aria-hidden="true"><label>Company <input name="company" tabindex="-1" autocomplete="off"></label></p>
      <label class="field">
        <span>Email</span>
        <input id="waitlist-email" type="email" name="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required>
      </label>
      <p class="field__error" data-error hidden></p>
      <button class="btn btn--dark btn--lg btn--full" type="submit"><span>Join the waitlist</span></button>
      <p class="fineprint fineprint--center">We’ll only email you about this launch.</p>
    </form>
  </div>
  <div class="dialog__view" data-view="success" hidden>
    <span class="success-mark">${Icon('check', { size: 28 })}</span>
    <h2 class="dialog__title">You’re on the list.</h2>
    <p>We’ll email you as soon as it’s ready. In the meantime, the original ride is ready when you are.</p>
    ${BookButton(ctx, { location: 'waitlist-success', label: `Check availability · ${ctx.money(main.price)}`, full: true, arrow: false })}
  </div>
</dialog>
<script type="application/json" id="waitlist-copy">${JSON.stringify(WAITLIST_COPY)}</script>`;
}

/** Shown only in booking.mode 'placeholder': lets you test the flow and referral capture. */
export function BookingTestDialog() {
  return html`<dialog class="dialog" id="booking-test" aria-labelledby="booking-test-title" data-booking-test>
  <button class="dialog__close" type="button" data-close aria-label="Close">${Icon('close')}</button>
  <span class="ph-tag">Booking placeholder</span>
  <h2 class="dialog__title" id="booking-test-title">Your booking calendar opens here</h2>
  <p>Once a booking system is connected, this button takes guests straight to <strong>date → time → payment → confirmation</strong>. Connect it in <code>site.config.mjs → booking</code>.</p>
  <dl class="test-data" data-test-data></dl>
  <button class="btn btn--dark btn--lg btn--full" type="button" data-close><span>Got it</span></button>
</dialog>`;
}
