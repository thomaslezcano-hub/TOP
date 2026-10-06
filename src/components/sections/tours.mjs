/**
 * CHOOSE YOUR VIBE — the booking section (#tours). Main $225 product leads; Sunset reads as
 * an upgrade; Taste is a waitlist to measure demand. In 'embed' mode the provider calendar lives here.
 */
import { html, raw } from '../../lib/html.mjs';
import { hoursLabel } from '../../lib/format.mjs';
import { Icon } from '../icons.mjs';
import { Media } from '../media.mjs';
import { SectionHead, BookButton, WaitlistButton, Price } from '../ui.mjs';

function TourCard(ctx, tour) {
  const media = ctx.config.media.tours[tour.id] || {};
  const soon = tour.status === 'coming_soon';
  const variant = { classic: 'cta', sunset: 'dark' }[tour.id] || 'cta';
  return html`<li class="tour-card tour-card--${tour.id}${soon ? ' tour-card--soon' : ''} reveal">
  <div class="tour-card__media">
    ${Media(ctx, media, { sizes: '(min-width: 900px) 33vw, 100vw' })}
    ${tour.badge ? html`<span class="badge${soon ? ' badge--soon' : ''}">${tour.badge}</span>` : ''}
  </div>
  <div class="tour-card__body">
    <h3 class="tour-card__title">${tour.name}</h3>
    ${
      soon
        ? html`<p class="tour-card__meta">${Icon('utensils', { size: 16 })}Private food experience</p>`
        : html`<p class="tour-card__meta">${Icon('clock', { size: 16 })}${hoursLabel(tour.durationHours)}<span aria-hidden="true">·</span>${Icon('users', { size: 16 })}Private group</p>`
    }
    <p class="tour-card__summary">${tour.summary}</p>
    ${tour.highlights ? html`<ul class="tour-card__tags" aria-label="Highlights">${tour.highlights.map((h) => html`<li>${h}</li>`)}</ul>` : ''}
    <div class="tour-card__foot">
      ${
        soon
          ? WaitlistButton({ interest: 'taste', location: 'tours', label: tour.ctaLabel, variant: 'outline', full: true })
          : html`${Price(ctx, tour.price, { size: 'card', unit: 'per private group', note: '' })}
             ${BookButton(ctx, { tour: tour.id, location: 'tours', label: tour.ctaLabel, variant, full: true })}`
      }
    </div>
  </div>
</li>`;
}

export function Tours(ctx) {
  const { config } = ctx;
  const embed = config.booking.mode === 'embed';
  return html`<section class="section tours" id="tours" aria-labelledby="tours-title" data-booking-section>
  <div class="container">
    ${SectionHead({
      id: 'tours-title',
      eyebrow: 'Choose your vibe',
      title: 'Pick your ride.',
      lede: 'Every experience is private, two hours long and priced per group.',
    })}
    <ul class="tours__grid" role="list">
      ${config.tours.map((t) => TourCard(ctx, t))}
    </ul>
    ${
      config.booking.trustNotes.length
        ? html`<ul class="tours__trust" role="list">${config.booking.trustNotes.map((n) => html`<li>${Icon('check', { size: 16 })}${n}</li>`)}${
            config.policies.cancellationShort ? html`<li>${Icon('shield', { size: 16 })}${config.policies.cancellationShort}</li>` : ''
          }</ul>`
        : ''
    }
    ${
      embed
        ? html`<div class="booking-embed" id="book" tabindex="-1">
        <iframe title="Book your private experience" data-embed-src="${config.booking.embedUrl}" loading="lazy"></iframe>
      </div>`
        : raw('<span id="book" class="anchor" aria-hidden="true"></span>')
    }
  </div>
</section>`;
}
