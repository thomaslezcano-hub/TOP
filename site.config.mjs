/**
 * ════════════════════════════════════════════════════════════════════
 *  site.config.mjs — ÚNICA FUENTE DE VERDAD DEL NEGOCIO
 * ════════════════════════════════════════════════════════════════════
 *  Cambiá precios, links, IDs, políticas, reseñas y fotos ACÁ.
 *  Después corré `npm run build` (o dejá que Netlify lo haga al hacer push).
 *
 *  Convención:  ''  o  null  =  "todavía no definido".
 *  Todo lo que esté sin definir:
 *    · se marca en la página con una etiqueta PLACEHOLDER (si site.markPlaceholders = true)
 *    · o se oculta automáticamente (si site.markPlaceholders = false)
 *    · y aparece listado como advertencia al correr el build.
 * ════════════════════════════════════════════════════════════════════
 */

/* ─────────────────────────── AJUSTES RÁPIDOS ─────────────────────────── */

const BUSINESS_NAME = ''; // ej: 'Sunny Side Rides'
const MAIN_TOUR_PRICE = 225; // USD, precio TOTAL por grupo privado
const SUNSET_PRICE = 275; // USD, precio TOTAL por grupo privado
const TOUR_DURATION_HOURS = 2;
const MAX_PASSENGERS = null; // ej: 6  → activa "From $37.50 per person with a group of 6"
const PHONE = ''; // formato internacional, ej: '+19545550123'
const PHONE_DISPLAY = ''; // cómo se ve, ej: '(954) 555-0123'
const EMAIL = ''; // ej: 'hello@tudominio.com'
const SITE_URL = 'https://www.example.com'; // dominio final, sin barra al final (canonical / OG)
const BOOKING_URL = ''; // link general de reservas (FareHarbor, Peek, Bókun, Rezdy, Xola…)
const GOOGLE_REVIEWS_URL = ''; // link a tu perfil de Google con reseñas
const INSTAGRAM_URL = '';
const META_PIXEL_ID = ''; // ej: '123456789012345'
const GA4_ID = ''; // ej: 'G-XXXXXXXXXX'

/* ─────────────────────────────── CONFIG ─────────────────────────────── */

export default {
  business: {
    name: BUSINESS_NAME,
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY,
    email: EMAIL,
    instagramUrl: INSTAGRAM_URL,
    city: 'Fort Lauderdale',
    region: 'FL',
    country: 'US',
    // Dirección física (opcional). Si no hay local a la calle, dejar vacío: se usa "areaServed".
    address: { street: '', postalCode: '' },
    geo: { lat: 26.1224, lng: -80.1373 },
  },

  site: {
    url: SITE_URL,
    language: 'en-US',
    // true  = etiquetas PLACEHOLDER visibles (ideal mientras armás el contenido)
    // false = lo no definido se oculta (reseñas vacías, políticas, etc.). Usar al lanzar.
    markPlaceholders: true,
    indexable: true, // false = agrega noindex (útil para un dominio de staging)
  },

  seo: {
    title: 'Private Fort Lauderdale Golf Cart Tours | $225 Per Group',
    description:
      'Private 2-hour golf cart tours in Fort Lauderdale. See the beach, Las Olas, waterfront mansions and hidden gems on a route built around your group. $225 per group.',
    ogTitle: 'Private Fort Lauderdale Golf Cart Tours',
    ogDescription: 'Two hours. Your people. Your Fort Lauderdale. $225 per private group, not per person.',
    ogImage: 'og-image.jpg', // 1200×630, dentro de /public
    ogImageAlt: 'Private golf cart experience in Fort Lauderdale',
  },

  /**
   * LOGO — cuando tengas el archivo, copialo a /public/media/ y completá:
   *   src: versión para fondos claros · srcOnDark: versión para fondos oscuros (hero / footer)
   * Si queda vacío se muestra un placeholder "Your logo".
   */
  logo: {
    src: '',
    srcOnDark: '',
    alt: BUSINESS_NAME || 'Logo',
    width: 148,
    height: 40,
  },

  /**
   * PALETA — provisional hasta recibir el logo.
   * El build verifica el contraste WCAG de los pares críticos y avisa si alguno falla.
   */
  brand: {
    colors: {
      primary: '#0C4F5A', // Lagoon · Intracoastal profundo (marca, secciones oscuras)
      primaryInk: '#FFFFFF', // texto sobre primary
      secondary: '#D5ECE7', // Shallow water · tintes y fondos suaves
      background: '#FFFFFF',
      backgroundAlt: '#F0F6F4', // Sea foam · secciones alternadas
      text: '#0F2027', // Ink
      textMuted: '#4A5B62',
      accent: '#FFC24B', // Golden hour · estrellas, subrayados, detalles
      cta: '#FF6B3D', // Sunset coral · SOLO para botones de reserva
      ctaHover: '#FF8257',
      ctaInk: '#0F2027', // texto sobre CTA
      success: '#1D7A4E', // Palm · checks
      line: '#D9E4E1',
    },
  },

  currency: 'USD',

  /** Capacidad del carrito. null = no definida (se ocultan los cálculos por persona). */
  capacity: {
    maxGuests: MAX_PASSENGERS,
    // Tamaños de grupo a mostrar en "Split it your way". Se filtran a <= maxGuests.
    examples: [2, 4, 6],
  },

  /**
   * PRODUCTOS
   * status: 'available' | 'coming_soon'
   * bookingUrl: link directo a ese tour en tu sistema de reservas (si queda vacío usa BOOKING_URL).
   */
  tours: [
    {
      id: 'classic',
      name: 'The Fort Lauderdale Experience',
      schemaName: 'Private Fort Lauderdale Golf Cart Experience',
      status: 'available',
      price: MAIN_TOUR_PRICE,
      durationHours: TOUR_DURATION_HOURS,
      badge: 'Best for first-time visitors',
      summary: 'The beach, Las Olas, Downtown and the waterfront, plus the local spots most visitors miss.',
      highlights: ['Beach & Las Olas', 'Waterfront & mansions', 'Hidden gems'],
      ctaLabel: 'Book now',
      bookingUrl: '',
    },
    {
      id: 'sunset',
      name: 'Sunset Experience',
      schemaName: 'Private Fort Lauderdale Sunset Golf Cart Experience',
      status: 'available',
      price: SUNSET_PRICE,
      durationHours: TOUR_DURATION_HOURS,
      badge: 'Golden hour upgrade',
      summary: 'Golden hour, waterfront views and photo stops timed to the best light of the day.',
      highlights: ['Timed to sunset', 'Waterfront views', 'Date night & friends'],
      ctaLabel: 'Book sunset',
      bookingUrl: '',
    },
    {
      id: 'taste',
      name: 'Taste of Fort Lauderdale',
      schemaName: 'Private Fort Lauderdale Golf Cart Food Experience',
      status: 'coming_soon',
      badge: 'Coming soon',
      summary: 'A private food ride through local favorites. Join the waitlist to hear first.',
      ctaLabel: 'Join the waitlist',
    },
  ],

  /**
   * RESERVAS
   * mode:
   *   'placeholder' → aún no hay sistema. Los botones abren un panel de prueba que muestra
   *                   el tour, la atribución (ref) y la URL que se abriría. Ideal para testear.
   *   'link'        → los botones llevan directo al sistema de reservas (recomendado).
   *                   Funciona con los "popups" de FareHarbor/Peek si agregás su script.
   *   'embed'       → el calendario del proveedor se muestra dentro de la página (#book).
   */
  booking: {
    mode: 'placeholder',
    url: BOOKING_URL,
    embedUrl: '', // solo para mode 'embed' (URL del iframe del proveedor)
    openInNewTab: false, // misma pestaña convierte mejor en mobile
    refParam: 'ref', // nombre del parámetro que tu proveedor guarda como "fuente" (ver docs/INTEGRACIONES.md)
    passUtm: true, // reenviar utm_* al sistema de reservas
    providerScript: '', // opcional: script del proveedor (p. ej. lightframe de FareHarbor)
    // Notas de confianza bajo las tarjetas. Solo afirmaciones verdaderas para tu proveedor.
    trustNotes: ['Private, no strangers', 'Secure online checkout'],
  },

  /** POLÍTICAS — vacías hasta que estén aprobadas. Nunca se inventan. */
  policies: {
    // Frase corta para mostrar junto a los botones, ej: 'Free cancellation up to 24 hours before'
    cancellationShort: '',
    cancellation: '',
    weather: '',
    drinks: '',
    capacityNote: '', // ej: 'Kids count as guests. Car seats available on request.'
    pickupArea: '', // ej: 'Fort Lauderdale Beach, Las Olas and Downtown'
  },

  /**
   * RESEÑAS — nunca inventar.
   * summary: completá rating + count cuando tengas suficientes reseñas reales en Google.
   * items:   copiá reseñas reales (idealmente con permiso del cliente). Borrá los placeholders.
   * widget:  alternativa para mostrarlas automáticamente (Elfsight, Trustindex, EmbedSocial…).
   *          Se carga recién cuando el usuario se acerca a la sección (no afecta la velocidad).
   */
  reviews: {
    summary: { rating: null, count: null, url: GOOGLE_REVIEWS_URL },
    items: [
      { placeholder: true, rating: 5, text: 'PLACEHOLDER REVIEW – replace with verified customer review.', name: 'Customer name', date: '', source: 'google' },
      { placeholder: true, rating: 5, text: 'PLACEHOLDER REVIEW – replace with verified customer review.', name: 'Customer name', date: '', source: 'google' },
      { placeholder: true, rating: 5, text: 'PLACEHOLDER REVIEW – replace with verified customer review.', name: 'Customer name', date: '', source: 'google' },
    ],
    widget: { html: '', scriptSrc: '' },
  },

  /**
   * FAQ — `answer` vacío = placeholder. `{{maxGuests}}`, `{{pickupArea}}`, etc. se reemplazan solos.
   * Respuestas definidas por política se toman de `policies` (policy: 'cancellation' …).
   */
  faq: [
    {
      q: 'Is this a private tour?',
      answer: 'Yes. Your cart is reserved exclusively for your group. No strangers, no shared seats.',
    },
    {
      q: 'Is there a fixed route?',
      answer:
        'No. We have recommended highlights, but your guide can adapt the experience around what your group wants to see.',
    },
    {
      q: 'How many guests can join?',
      answer: MAX_PASSENGERS ? `Up to ${MAX_PASSENGERS} guests per cart. The price is the same for your whole group.` : '',
      placeholderHint: 'Insert approved vehicle capacity (MAX_PASSENGERS).',
    },
    {
      q: 'Where can you pick us up?',
      policy: 'pickupArea',
      template:
        'We can pick you up at your hotel or another spot within our operating area ({{pickupArea}}). Add your pickup address when you book.',
      placeholderHint: 'Describe the pickup / operating area (policies.pickupArea).',
    },
    { q: 'What is the cancellation policy?', policy: 'cancellation', placeholderHint: 'Add the approved cancellation policy.' },
    { q: 'What happens if it rains?', policy: 'weather', placeholderHint: 'Add the weather / rain policy.' },
    { q: 'Can we bring drinks?', policy: 'drinks', placeholderHint: 'Add the drinks policy based on local regulations and company policy.' },
  ],

  /**
   * TRACKING — dejá vacío lo que no uses. Ver docs/INTEGRACIONES.md para el mapa de eventos.
   */
  tracking: {
    metaPixelId: META_PIXEL_ID,
    ga4Id: GA4_ID,
    gtmId: '', // opcional, si preferís manejar todo desde Google Tag Manager
    googleAds: {
      id: '', // 'AW-XXXXXXXXX'
      // Etiquetas de conversión: 'AW-XXXXXXXXX/abcDEF123'
      conversions: { BeginCheckout: '', Purchase: '', Lead: '' },
    },
  },

  /**
   * REFERIDOS DE HOTELES (QR) — ej: https://tudominio.com/?ref=HiltonBeach
   * El ref se guarda en el navegador, viaja en cada evento de analytics y se agrega al link de reserva.
   */
  referral: {
    param: 'ref',
    model: 'last', // 'last' = un ref nuevo reemplaza al anterior · 'first' = gana el primero
    ttlDays: 30, // cuántos días se recuerda el hotel que refirió
    // Opcional: personaliza un saludo en el hero para cada hotel socio.
    // partners: { HiltonBeach: 'Hilton Fort Lauderdale Beach' },
    partners: {},
  },

  /**
   * WAITLIST (Taste of Fort Lauderdale + celebraciones)
   * endpoint vacío → usa Netlify Forms (cero configuración si el sitio está en Netlify).
   * O pegá un endpoint de Formspree / Getform / Zapier / Make / Google Apps Script.
   */
  waitlist: { endpoint: '' },

  legal: { privacyUrl: '', termsUrl: '' },

  /**
   * FOTOS Y VIDEO — copiá los archivos a /public/media/ y poné la ruta acá (ej: 'media/hero.jpg').
   * Mientras `image` esté vacío se muestra un placeholder con la descripción de la toma ideal.
   * Si instalás `sharp` (npm i -D sharp) el build genera AVIF/WebP en varios tamaños automáticamente.
   */
  media: {
    hero: {
      image: '', // poster / imagen principal (es el LCP: que pese poco)
      video: { mp4: '', webm: '' }, // opcional: loop 8–15 s, sin audio, ≤ 2.5 MB
      alt: 'Friends laughing on a private golf cart along Fort Lauderdale Beach',
      tone: 'dusk',
      shot: 'Wide, golden hour: your cart on A1A with the ocean behind, guests laughing.',
    },
    final: {
      image: '',
      video: { mp4: '', webm: '' },
      alt: 'Golf cart on the Fort Lauderdale waterfront at sunset',
      tone: 'sunset',
      shot: 'Sunset on the waterfront: cart in silhouette, sky on fire.',
    },
    gallery: [
      { image: '', caption: 'Ride.', alt: 'Golf cart cruising along the beach road', tone: 'ocean', shot: 'Cart rolling along A1A, ocean in frame, hair in the wind.' },
      { image: '', caption: 'Stop.', alt: 'Guests stepping off the cart on Las Olas Boulevard', tone: 'city', shot: 'Las Olas: guests stepping off, storefronts and palms.' },
      { image: '', caption: 'Discover.', alt: 'Guide pointing out a hidden spot to guests', tone: 'palm', shot: 'Guide pointing something out down a quiet canal street.' },
      { image: '', caption: 'Take the picture.', alt: 'Group photo on the golf cart by the water', tone: 'sky', shot: 'Group photo on the cart, waterfront behind, real smiles.' },
      { image: '', caption: 'Find your favorite place.', alt: 'Couple watching the sunset on the waterfront', tone: 'sunset', shot: 'Couple on the Riverwalk or a dock at golden hour.' },
    ],
    tours: {
      classic: { image: '', alt: 'Private golf cart tour on Las Olas', tone: 'ocean', shot: 'Daytime: full cart, beach or Las Olas, bright and happy.' },
      sunset: { image: '', alt: 'Couple on a golf cart at sunset by the water', tone: 'sunset', shot: 'Golden hour: couple or friends, warm light, water behind.' },
      taste: { image: '', alt: 'Local food stop during a golf cart tour', tone: 'city', shot: 'Food stop: tacos, key lime pie or a local café table.' },
    },
  },
};
