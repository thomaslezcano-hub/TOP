# Estrategia de la landing — Private Fort Lauderdale Golf Cart Experience

> Objetivo único: convertir tráfico frío de Meta Ads (mobile) en reservas pagadas del tour de **$225 por grupo**.
> Todo lo que no ayuda a **entender, confiar, desear o reservar** quedó afuera.

---

## 1. Estructura completa

| # | Sección | Ancla | Trabajo que hace | CTA |
|---|---------|-------|------------------|-----|
| 0 | Header mínimo | — | Marca + 2 anclas internas (Tours, FAQ). Sin links externos. | Book now |
| 1 | **Hero** | `#top` | Qué es · privado · 2 h · $225 POR GRUPO · personalizable · cómo reservar | **Check availability** |
| 2 | No fixed route | `#experience` | El diferencial: "You choose the vibe. We build the ride." | Check availability (link) |
| 3 | Visual story (mosaico) | `#moments` | Deseo: el visitante se imagina en el carrito | — |
| 4 | What's included + Value card | `#included` | Qué recibo exactamente + por qué $225 por grupo es buen valor | Book your private experience |
| 5 | **Choose your vibe** (sección de reserva) | `#tours` / `#book` | Elegir producto. $225 lidera, Sunset es upgrade, Taste es waitlist | Book now · Book sunset · Join the waitlist |
| 6 | Reviews | `#reviews` | Prueba social justo después de la decisión de compra | — |
| 7 | FAQ | `#faq` | Elimina las 7 objeciones que bloquean la reserva | — |
| 8 | Final CTA | `#final` | Cierre emocional después de resolver objeciones | Check availability |
| 9 | Teaser premium | — | Mide demanda de celebraciones sin competir con el $225 | Get early access |
| 10 | Footer | — | Contacto como texto, legales. Sin fugas. | — |
| ∞ | **Sticky CTA mobile** | — | `2 hrs · Private · $225 per group [Book now]` | Book now |

Flujo de conversión: **Anuncio → Landing → Check availability → calendario del proveedor (fecha/hora) → pago → confirmación (`/thanks/`)**.

---

## 2. Lógica CRO por sección

**Header.** Tráfico pago = cero fugas. Solo dos anclas internas y un botón de reserva. En mobile desaparecen las anclas (el sticky inferior toma el rol de navegación); en desktop el header queda fijo con "Book now".

**Hero.** Todo lo necesario para decidir está antes del scroll en un iPhone dentro del navegador de Instagram (~390×700 útiles):
- Eyebrow de lugar (relevancia para quien viene del anuncio).
- H1 con el producto exacto (coincide con el anuncio = "message match").
- Tagline/diferencial en itálica con el subrayado-ola.
- Tres "facts" en una grilla: 2 hours · Private experience · Flexible route.
- Precio grande + **"PER GROUP / not per person"** separado por una línea vertical: el dato que más reduce la fricción es imposible de malinterpretar.
- CTA de ancho completo (zona del pulgar), color coral reservado *solo* para reservar.
- Fila de confianza: rating de Google **solo si existe** (si no, placeholder marcado), Local guide, Customizable, y la política de cancelación cuando esté definida.
- Si llega desde un QR de hotel socio, saludo discreto "Welcome, {Hotel} guests" (sin mover el layout).

**No fixed route.** Convierte "golf cart tour" en "nuestro paseo privado". Tres tarjetas: íconos (lo que vine a ver), hidden gems (lo que no encontraría solo) y *Make it yours* (destacada en color de marca) con chips de intereses concretos. Cierra con la frase de marca + CTA de texto (para quien ya está convencido).

**Visual story.** Fotos dominantes con verbos ("Ride. Stop. Discover. Take the picture. Find your favorite place.") → el visitante se proyecta en la experiencia. Fondo oscuro de marca para un look editorial.

**What's included + Value.** Responde "¿qué recibo?" con un checklist escaneable y, al lado (sticky en desktop), la **Value card**: $225 *total per group*, el reencuadre "en vez de pagar por persona en un tour compartido, reservá el carrito entero", y el cálculo "Split it your way" (2/4/6 guests = $X each) que se activa solo al definir `MAX_PASSENGERS`. Unifiqué "Included" y "Comparación de valor" en una sola sección para no repetir precio dos veces seguidas; la `ValueCard` es un componente independiente si querés testearla en otra posición.

**Choose your vibe (booking section).** Tres tarjetas con foto (estilo Airbnb/GetYourGuide):
- *The Fort Lauderdale Experience* — badge "Best for first-time visitors", CTA coral (el más fuerte de la página).
- *Sunset Experience* — tarjeta con calidez dorada + CTA oscuro: se lee como upgrade sin robarle protagonismo al $225.
- *Taste of Fort Lauderdale* — COMING SOON, botón outline "Join the waitlist" (mide demanda real).
Debajo: notas de confianza (solo afirmaciones verdaderas) y, en modo `embed`, el calendario del proveedor.

**Reviews.** Ubicadas inmediatamente después de la decisión ("reviews near booking decisions"). Nunca inventadas: los placeholders dicen literalmente *"PLACEHOLDER REVIEW – replace with verified customer review."* y en modo lanzamiento la sección se oculta sola si no hay reseñas reales. Resumen "★★★★★ 4.9 based on XXX Google reviews" se activa al completar `reviews.summary`.

**FAQ.** Siete preguntas, todas comerciales, en acordeones nativos (`<details>`, accesibles, sin JS). La cancelación sube al 5º lugar porque es reducción de riesgo. Las respuestas de política salen de `policies` en la config: sin datos aprobados → placeholder visible (o se ocultan en modo lanzamiento). Debajo: contacto como alternativa secundaria (no WhatsApp como CTA principal).

**Final CTA.** FAQ antes del cierre: primero se resuelven dudas, después se pide la reserva con la imagen más emotiva (sunset/waterfront). "Private experience **from** $225" porque Sunset cuesta más.

**Teaser premium.** Una línea, al final, después del último CTA. Captura emails de interés en celebraciones (evento `Lead` con `interest=celebrations`).

**Sticky mobile CTA.** Aparece cuando el CTA del hero sale de pantalla y se oculta automáticamente cuando hay otro CTA visible (sección de tours, final CTA, footer) para no duplicar. Pastilla flotante oscura, 60 px, respeta el safe-area del iPhone.

**Principios aplicados en toda la página:** un solo color para reservar · precio y "per group" repetidos en cada punto de decisión · CTA después de cada bloque mayor · cero formularios en el camino de reserva · sin escasez falsa ni timers · placeholders imposibles de confundir con contenido real · carga en una sola petición HTML (~22 KB gzip).

---

## 3. Copy final (inglés)

**Header:** Tours · FAQ · `Book now`

**Hero**
- Eyebrow: FORT LAUDERDALE, YOUR WAY.
- H1: Private Fort Lauderdale / Golf Cart Experience
- Tagline: *You choose the vibe. We build the ride.*
- Lede: Beach, Las Olas, waterfront views, local favorites and hidden gems on a private ride built around your group.
- Facts: 2 hours · Private experience · Flexible route
- Precio: **$225** | PER GROUP / not per person
- CTA: `Check availability →`
- (con capacidad definida) From only **$37.50 per person** with a group of 6.
- Confianza: ★★★★★ 4.9 · 127 Google reviews *(cuando exista)* · Local guide · Customizable · *(política de cancelación cuando exista)*

**No fixed route**
- Eyebrow: NO FIXED ROUTE
- H2: No boring tour script. This is your Fort Lauderdale.
- Lede: We bring the local knowledge and the best stops. Your group decides where the two hours go.
- SEE THE ICONS — The beach, Las Olas, Downtown and the waterfront. The places you came to Fort Lauderdale for.
- DISCOVER THE HIDDEN GEMS — Local spots, stories and corners most visitors drive right past.
- MAKE IT YOURS — More mansions? More photos? More history? Somewhere great to eat? Tell your guide what your group is into. *(chips: Mansions · Photo stops · Local history · Restaurants · Beach time · Waterfront)*
- Cierre: *You choose the vibe. We build the ride.* → Check availability

**Visual story**
- Eyebrow: TWO HOURS, OPEN AIR
- H2: The city feels different from a golf cart.
- Lede: Ocean breeze, no windows, and a local who knows exactly where to stop.
- Captions: Ride. · Stop. · Discover. · Take the picture. · Find your favorite place.

**What's included**
- Eyebrow: WHAT'S INCLUDED
- H2: Everything you need. Nothing you don't.
- ✓ Private golf cart for your group ✓ 2-hour private experience ✓ Local driver-guide ✓ Flexible itinerary ✓ Photo stops ✓ Local recommendations ✓ Music onboard ✓ No strangers in your group ✓ Pickup options within our operating area
- Value card: PRIVATE EXPERIENCE · **$225** TOTAL PER GROUP / not per person · Instead of paying per person for a shared tour, reserve the whole cart for your people. · *Split it your way:* 2 guests $112.50 each · 4 guests $56.25 each · 6 guests $37.50 each *(solo con capacidad definida)* · `Book your private experience`

**Choose your vibe**
- Eyebrow: CHOOSE YOUR VIBE · H2: Pick your ride. · Lede: Every experience is private, two hours long and priced per group.
- THE FORT LAUDERDALE EXPERIENCE — *Best for first-time visitors* · 2 hours · Private group · The beach, Las Olas, Downtown and the waterfront, plus the local spots most visitors miss. · **$225** per private group · `Book now`
- SUNSET EXPERIENCE — *Golden hour upgrade* · 2 hours · Private group · Golden hour, waterfront views and photo stops timed to the best light of the day. · **$275** per private group · `Book sunset`
- TASTE OF FORT LAUDERDALE — *Coming soon* · Private food experience · A private food ride through local favorites. Join the waitlist to hear first. · `Join the waitlist`
- Confianza: ✓ Private, no strangers ✓ Secure online checkout *(editable; solo afirmaciones verdaderas)*

**Reviews:** GUEST REVIEWS · Loved by our guests · ★★★★★ 4.9 based on XXX Google reviews · Read on Google

**FAQ:** GOOD TO KNOW · Questions, answered.
1. Is this a private tour? — Yes. Your cart is reserved exclusively for your group. No strangers, no shared seats.
2. Is there a fixed route? — No. We have recommended highlights, but your guide can adapt the experience around what your group wants to see.
3. How many guests can join? — *PLACEHOLDER: capacidad aprobada.* (Con `MAX_PASSENGERS`: "Up to X guests per cart. The price is the same for your whole group.")
4. Where can you pick us up? — We can pick you up at your hotel or another spot within our operating area ({pickupArea}). Add your pickup address when you book.
5. What is the cancellation policy? — *PLACEHOLDER*
6. What happens if it rains? — *PLACEHOLDER*
7. Can we bring drinks? — *PLACEHOLDER (regulación local + política de la empresa)*
- Debajo: Still deciding? Call or text {phone} or email {email}.

**Final CTA:** Two hours. / Your people. / *Your Fort Lauderdale.* · *You choose the vibe. We build the ride.* · Private experience from **$225** PER GROUP · `Check availability`

**Teaser:** Looking for something unforgettable? Private celebrations and romantic experiences are coming soon. → Get early access

**Sticky mobile:** 2 hrs · Private / **$225** PER GROUP · `Book now`

**Waitlist (modal):** COMING SOON · Taste of Fort Lauderdale · A private golf cart food ride through local favorites. Join the waitlist and we'll email you when it launches. · `Join the waitlist` · We'll only email you about this launch. → Éxito: You're on the list. We'll email you as soon as it's ready. In the meantime, the original ride is ready when you are. `Check availability · $225` *(no se pierde la venta principal)*

**Confirmación (/thanks/):** You're booked. · Thanks for booking your private Fort Lauderdale ride. Your confirmation and details are on their way to your inbox. · Start thinking about the vibe: beach, mansions, history, food, photos. Your guide will build the ride around it.

**SEO**
- `<title>` Private Fort Lauderdale Golf Cart Tours | $225 Per Group
- Meta description: Private 2-hour golf cart tours in Fort Lauderdale. See the beach, Las Olas, waterfront mansions and hidden gems on a route built around your group. $225 per group.
- OG/Twitter: Private Fort Lauderdale Golf Cart Tours — Two hours. Your people. Your Fort Lauderdale. $225 per private group, not per person.

---

## 4. Dirección visual

**Concepto: "Intracoastal golden hour".** Una empresa de experiencias moderna, con la luz de Fort Lauderdale a las 6 pm. Lujo sin pretensión: mucho aire, fotos grandes, tipografía con personalidad, un solo acento cálido.

- **Tipografía.** *Fraunces* (serif suave, "soft" al máximo) para titulares: editorial de revista de viajes pero amable, nunca corporativa. Itálica para la frase de marca. Texto en la fuente nativa del sistema (SF Pro en iPhone): rápida y legible. Fuentes self-hosted, 42 KB en total, con fallback métrico para evitar saltos de layout.
- **Motivo de firma.** La línea ondulada del muro de la playa sobre A1A (el "wave wall" de Fort Lauderdale), dibujada en dorado bajo la frase de marca. Se anima una sola vez en el hero. Detalle local: coordenadas 26.1224° N · 80.1373° W en el footer.
- **Paleta provisional** (el logo no llegó adjunto; se reemplaza desde `site.config.mjs → brand.colors` y el build verifica contraste WCAG automáticamente):

| Rol | Token | Color | Uso | Contraste |
|-----|-------|-------|-----|-----------|
| Primary | Lagoon | `#0C4F5A` | Marca, secciones oscuras, footer | Blanco sobre él 9.2:1 |
| Secondary | Shallow water | `#D5ECE7` | Tintes, avatares | — |
| Background | White | `#FFFFFF` | Fondo principal | — |
| Background alt | Sea foam | `#F0F6F4` | Secciones alternadas | — |
| Text | Ink | `#0F2027` | Texto | 16.7:1 |
| Text muted | Slate | `#4A5B62` | Texto secundario | 7.1:1 |
| Accent | Golden hour | `#FFC24B` | Estrellas, ola, detalles sobre oscuro | 5.7:1 sobre Lagoon |
| CTA | Sunset coral | `#FF6B3D` | **Solo** botones de reserva | Ink sobre coral 5.9:1 |
| Success | Palm | `#1D7A4E` | Checks | 5.3:1 |

- **Fotografía.** Dominante, real, nada de stock genérico. Cada espacio tiene un placeholder ilustrado que describe la toma exacta (ver `docs/CONTENIDO.md`).
- **Microanimaciones.** Ola dibujándose en el hero, fade-up sutil al entrar secciones, zoom leve de fotos en hover (desktop), sticky que entra deslizando. Todo desactivado con `prefers-reduced-motion`.
- **Formas.** Radios generosos (18–28 px), sombras suaves solo en elementos accionables (tarjetas de tour, value card, sticky).

---

## 5. Componentes

| Componente | Archivo | Qué hace |
|------------|---------|----------|
| `BookButton` | `src/components/ui.mjs` | Todo botón de reserva. `<a href>` real (funciona sin JS y con popups de FareHarbor/Peek), `data-book` + `data-cta` para tracking |
| `WaitlistButton` | `ui.mjs` | Abre el modal de waitlist con `interest` (taste / celebrations) |
| `Price` | `ui.mjs` | Monto + unidad ("per group / not per person") en 4 tamaños |
| `Stars`, `Eyebrow`, `SectionHead`, `PlaceholderTag`, `Logo` | `ui.mjs` | Primitivas compartidas |
| `Media` / `Video` | `src/components/media.mjs` | Foto responsive (AVIF/WebP si hay `sharp`) o placeholder ilustrado con la descripción de la toma; video lazy |
| `Icon`, `Wave` | `src/components/icons.mjs` | Íconos SVG inline + motivo de la ola |
| `Header`, `Footer` | `src/components/` | Navegación mínima / contacto y legales |
| `Hero`, `Route`, `Gallery`, `Included` (+`ValueCard`), `Tours` (+`TourCard`), `Reviews` (+`ReviewCard`), `Faq`, `FinalCta`, `Teaser` | `src/components/sections/` | Una sección por archivo |
| `StickyCta`, `WaitlistDialog`, `BookingTestDialog` | `src/components/overlays.mjs` | Barra fija mobile y modales nativos `<dialog>` |
| `SeoHead`, `Schema` | `src/components/head.mjs` | Meta, OG, Twitter, JSON-LD |
| Runtime JS | `src/scripts/` | `attribution.js` (ref de hoteles + UTM), `analytics.js` (Pixel/GA4/Ads/GTM), `booking.js` (modos de reserva), `ui.js` (sticky, reveals, modales, waitlist, video) |
