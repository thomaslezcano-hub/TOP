/**
 * <head> content: SEO meta, Open Graph / Twitter, schema.org JSON-LD, font preloads.
 */
import { html, raw } from '../lib/html.mjs';
import { isSet } from '../lib/format.mjs';
import { resolveFaq } from './sections/faq.mjs';

const abs = (base, p) => `${base.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;

export function SeoHead(ctx, { title, description, path = '/', noindex = false } = {}) {
  const { config } = ctx;
  const { seo, site } = config;
  const url = abs(site.url, path);
  const pageTitle = title || seo.title;
  const pageDesc = description || seo.description;
  const ogImage = abs(site.url, seo.ogImage);
  const robots = noindex || !site.indexable ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';

  return html`<title>${pageTitle}</title>
<meta name="description" content="${pageDesc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="${config.brand.colors.primary}">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:locale" content="${site.language.replace('-', '_')}">
${isSet(config.business.name) ? html`<meta property="og:site_name" content="${config.business.name}">` : ''}
<meta property="og:title" content="${seo.ogTitle}">
<meta property="og:description" content="${seo.ogDescription}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${seo.ogImageAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${seo.ogTitle}">
<meta name="twitter:description" content="${seo.ogDescription}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="${ctx.asset('favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${ctx.asset('apple-touch-icon.png')}">
<link rel="preload" href="${ctx.asset('fonts/fraunces-600.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${ctx.asset('fonts/fraunces-500-italic.woff2')}" as="font" type="font/woff2" crossorigin>`;
}

/**
 * schema.org graph: LocalBusiness (the operator) + one TouristTrip per bookable experience.
 * No AggregateRating on purpose: Google ignores self-served review markup for local businesses,
 * and ratings must never be invented. FAQPage includes only approved (non-placeholder) answers.
 */
export function Schema(ctx) {
  const { config } = ctx;
  const { business, site, currency } = config;
  const base = site.url.replace(/\/$/, '');
  const bizId = `${base}/#business`;

  const businessNode = {
    '@type': 'LocalBusiness',
    '@id': bizId,
    name: business.name || config.tours[0].schemaName,
    description: config.seo.description,
    url: `${base}/`,
    image: abs(base, config.seo.ogImage),
    priceRange: '$$',
    areaServed: { '@type': 'City', name: `${business.city}, ${business.region}` },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
  };
  if (isSet(business.phone)) businessNode.telephone = business.phone;
  if (isSet(business.email)) businessNode.email = business.email;
  if (isSet(business.address.street))
    businessNode.address = {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.city,
      addressRegion: business.region,
      postalCode: business.address.postalCode,
      addressCountry: business.country,
    };
  const sameAs = [business.instagramUrl, config.reviews.summary.url].filter(isSet);
  if (sameAs.length) businessNode.sameAs = sameAs;

  const stops = ['Fort Lauderdale Beach', 'Las Olas Boulevard', 'Riverwalk Fort Lauderdale', 'Downtown Fort Lauderdale'];
  const trips = config.tours
    .filter((t) => t.status === 'available')
    .map((t) => ({
      '@type': 'TouristTrip',
      '@id': `${base}/#${t.id}`,
      name: t.schemaName,
      description: `${t.summary} Private ${t.durationHours}-hour golf cart experience. ${ctx.money(t.price)} per private group.`,
      touristType: ['Couples', 'Families', 'Groups of friends', 'Cruise passengers'],
      itinerary: {
        '@type': 'ItemList',
        itemListElement: stops.map((name, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristAttraction', name } })),
      },
      provider: { '@id': bizId },
      offers: {
        '@type': 'Offer',
        url: `${base}/#tours`,
        price: t.price,
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: t.price,
          priceCurrency: currency,
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'private group' },
        },
      },
    }));

  const faq = resolveFaq(config).filter((f) => !f.placeholder);
  const graph = [businessNode, ...trips];
  if (faq.length)
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });

  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return raw(`<script type="application/ld+json">${json}</script>`);
}
