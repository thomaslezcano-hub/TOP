/**
 * FAQ — only the questions that block a booking. Native <details> = accessible, zero JS.
 * Policy answers come from site.config.mjs → policies; unset ones show as labeled placeholders
 * (or are hidden in launch mode).
 */
import { html } from '../../lib/html.mjs';
import { isSet, fill } from '../../lib/format.mjs';
import { Icon } from '../icons.mjs';
import { SectionHead, PlaceholderTag } from '../ui.mjs';

/** Resolve each FAQ entry to { q, a, placeholder }. Shared with the schema.org builder. */
export function resolveFaq(config) {
  return config.faq.map((item) => {
    let a = item.answer || '';
    if (item.policy) {
      const value = config.policies[item.policy];
      a = isSet(value) ? (item.template ? fill(item.template, { [item.policy]: value }) : value) : '';
    }
    return { q: item.q, a, placeholder: !isSet(a), hint: item.placeholderHint };
  });
}

export function Faq(ctx) {
  const { business } = ctx.config;
  const items = resolveFaq(ctx.config).filter((f) => ctx.mark || !f.placeholder);
  const phone = isSet(business.phone);
  const email = isSet(business.email);

  return html`<section class="section faq" id="faq" aria-labelledby="faq-title">
  <div class="container faq__grid">
    <div class="faq__intro">
      ${SectionHead({ id: 'faq-title', eyebrow: 'Good to know', title: 'Questions, answered.' })}
      ${
        phone || email
          ? html`<p class="faq__contact">Still deciding? ${
              phone ? html`Call or text <a href="tel:${business.phone}" data-outbound="phone">${business.phoneDisplay || business.phone}</a>` : ''
            }${phone && email ? ' or email ' : email ? 'Email ' : ''}${email ? html`<a href="mailto:${business.email}" data-outbound="email">${business.email}</a>` : ''}.</p>`
          : ''
      }
    </div>
    <div class="faq__list">
      ${items.map(
        (f) => html`<details class="faq-item" name="faq">
        <summary><span>${f.q}</span>${Icon('plus', { size: 20, className: 'icon faq-item__icon' })}</summary>
        <div class="faq-item__body">${
          f.placeholder ? html`<p class="faq-item__ph">${PlaceholderTag(ctx)} ${f.hint || 'Answer pending.'}</p>` : html`<p>${f.a}</p>`
        }</div>
      </details>`
      )}
    </div>
  </div>
</section>`;
}
