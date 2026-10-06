# Integraciones: reservas, tracking, referidos de hoteles, reseñas y waitlist

Todo se configura en **`site.config.mjs`**. Ningún ID ni URL está escrito en otro lugar del código.

---

## 1. Sistema de reservas

`booking.mode` define qué hacen **todos** los botones de reserva (hero, sticky, tarjetas, value card, final):

| Modo | Qué pasa al tocar "Check availability" | Cuándo usarlo |
|------|----------------------------------------|---------------|
| `placeholder` *(actual)* | Abre un panel de prueba con el tour, el precio, el `ref` capturado y la URL exacta que se abriría | Mientras no hay sistema. Sirve para probar QR y eventos |
| `link` | Lleva directo al calendario del proveedor (misma pestaña), con `ref` y UTMs agregados | **Recomendado.** Camino más corto a fecha → hora → pago |
| `embed` | Muestra el calendario del proveedor dentro de la página (`#book`) y desplaza hasta ahí | Si tu proveedor ofrece un widget embebible que se vea bien en mobile |

**Pasos para conectar (modo `link`):**
1. En tu proveedor (FareHarbor, Peek, Bókun, Rezdy, Xola, TripWorks…) creá los dos productos: $225 y $275 **por grupo** (precio por reserva, no por persona).
2. Copiá el link directo de cada uno en `tours[].bookingUrl` (o uno general en `BOOKING_URL`).
3. `booking.mode = 'link'`.
4. Si tu proveedor tiene un script de "popup/lightframe" (ej. FareHarbor), pegá su URL en `booking.providerScript`: los links se abren en un overlay sin salir de la página.
5. `booking.refParam`: el nombre del parámetro que tu proveedor guarda como fuente/afiliado de la reserva. Muchos aceptan `ref`, otros usan `asn`, `affiliate`, `source` o campos personalizados. Revisá su documentación: así cada reserva queda asociada al hotel en el propio panel del proveedor.

**Confirmación:** configurá en el proveedor la redirección post-compra a
`https://TU-DOMINIO.com/thanks/?tour=classic&value=225&booking_id={ID}` (el nombre de las variables depende del proveedor).
La página `/thanks/` dispara `Purchase` **una sola vez por booking_id**. Si tu proveedor ya envía Purchase con su propia integración de Pixel/GA4, usá una sola de las dos para no duplicar.

---

## 2. Tracking (Meta Pixel, GA4, Google Ads, GTM)

Completá en `site.config.mjs`: `META_PIXEL_ID`, `GA4_ID`, opcional `tracking.googleAds` y/o `tracking.gtmId`. Si un ID está vacío, ese script no se carga (cero peso).

### Mapa de eventos

| Evento interno | Cuándo se dispara | Meta Pixel | GA4 | Google Ads |
|----------------|-------------------|------------|-----|------------|
| `PageView` | Carga de página | `PageView` | `page_view` (automático) | — |
| `ViewContent` | La sección de tours/precios entra en pantalla (1 vez) | `ViewContent` | `view_item` | — |
| `CheckAvailability` | Toque en cualquier botón de reserva | custom `CheckAvailability` | `check_availability` | — |
| `BeginCheckout` | Paso al sistema de reservas | `InitiateCheckout` | `begin_checkout` | conversión opcional |
| `Purchase` | Página `/thanks/` (1 vez por reserva) | `Purchase` | `purchase` | conversión opcional |
| `Lead` | Email enviado a cualquier waitlist | `Lead` | `generate_lead` | conversión opcional |
| `FoodTourWaitlist` | Email enviado a la waitlist de Taste | custom `FoodTourWaitlist` | `food_tour_waitlist` | — |
| `SunsetInterest` | Toque en "Book sunset" | custom `SunsetInterest` | `sunset_interest` | — |

Parámetros que viajan en cada evento: `ref` (hotel), `utm_source`, `utm_medium`, `utm_campaign`, `cta` (qué botón: `hero`, `sticky`, `tours`, `value`, `final`…), `tour`, `value`, `currency`.
Cada evento de Meta lleva un `eventID` único, listo para deduplicar si más adelante agregás la Conversions API del lado servidor.

### Configuración recomendada
- **Meta:** optimizá las campañas por `InitiateCheckout` al principio (más volumen) y pasá a `Purchase` cuando tengas ~50 compras/semana. Agregá `CheckAvailability` como conversión personalizada.
- **GA4:** en *Admin → Custom definitions* creá las dimensiones `ref`, `cta`, `tour` (scope: event) y `hotel_ref` (scope: user). Marcá `purchase` y `generate_lead` como eventos clave.
- **Google Ads:** pegá el `AW-…` y las etiquetas de conversión en `tracking.googleAds.conversions`.
- **GTM (opcional):** todo evento también se publica en `dataLayer` con `event: 'CheckAvailability'`, etc.
- **Privacidad:** Meta exige una política de privacidad visible cuando el Pixel está activo → `legal.privacyUrl`.

### Probar sin IDs reales
Abrí cualquier URL con **`?debug=1`**: cada evento aparece en pantalla y en la consola con todos sus parámetros. `?debug=0` lo apaga.

---

## 3. Referidos de hoteles (QR)

Cada hotel recibe su propio QR con una URL como:

```
https://TU-DOMINIO.com/?ref=HiltonBeach&utm_source=hotel&utm_medium=qr&utm_campaign=HiltonBeach
https://TU-DOMINIO.com/?ref=WHotel&utm_source=hotel&utm_medium=qr&utm_campaign=WHotel
https://TU-DOMINIO.com/?ref=HotelDello&utm_source=hotel&utm_medium=qr&utm_campaign=HotelDello
```

Qué hace la landing con el `ref`:
1. **Lo limpia** (solo letras, números, `-`, `_`, `.`; máx. 64 caracteres).
2. **Lo guarda** en `localStorage` + `sessionStorage` durante `referral.ttlDays` (30 días por defecto). Si el huésped escanea hoy y reserva en 3 días, se atribuye igual.
3. **Lo envía en cada evento** de analytics (`ref`) y como propiedad de usuario GA4 (`hotel_ref`).
4. **Lo agrega al link de reserva** (`?ref=HiltonBeach`, nombre configurable) → queda registrado en el proveedor junto a la reserva y el monto pagado.
5. **Lo incluye** en los envíos de la waitlist y en el `Purchase` de `/thanks/`.

Modelo de atribución (`referral.model`): `'last'` = un QR de otro hotel reemplaza al anterior; `'first'` = gana el primero hasta que expire. Las visitas posteriores por anuncios **no** borran el hotel (las UTMs se guardan aparte).

**Para pagar comisiones:** el reporte más confiable es el del proveedor de reservas filtrado por `ref` (tiene el pago real). GA4 (dimensión `ref`) sirve para cruzar y ver conversión por hotel.

Opcional: en `referral.partners` podés mapear `ref → nombre del hotel` para mostrar "Welcome, {Hotel} guests" en el hero.

---

## 4. Reseñas de Google

Nunca se inventan. Tres caminos:
1. **Manual (recomendado al inicio):** copiá reseñas reales a `reviews.items` (nombre como lo publicó el cliente, fecha, texto). Borrá los placeholders.
2. **Resumen:** cuando tengas suficientes, completá `reviews.summary.rating` y `count` → aparece "★★★★★ 4.9 based on XXX Google reviews" en el hero y en la sección.
3. **Widget automático** (Elfsight, Trustindex, EmbedSocial…): pegá su HTML en `reviews.widget.html` y su script en `reviews.widget.scriptSrc`. Se carga recién cuando el usuario se acerca a la sección, sin afectar la velocidad.

El schema.org no incluye `AggregateRating` a propósito: Google no muestra estrellas para reseñas auto-publicadas por negocios locales y podría considerarse marcado engañoso.

---

## 5. Waitlist (Taste of Fort Lauderdale + celebraciones)

- **En Netlify:** funciona sin configurar nada (Netlify Forms). Los emails aparecen en *Netlify → Forms → waitlist*, con `interest`, `ref` y `utm`.
- **Otro hosting:** pegá un endpoint de Formspree, Getform, Basin, Zapier/Make o Google Apps Script en `waitlist.endpoint`.
- Incluye honeypot anti-spam. Tras el envío, el modal ofrece reservar el tour de $225 para no perder la venta principal.

---

## 6. Publicar

**Netlify (recomendado):** conectá el repositorio → detecta `netlify.toml` → cada push publica. Dominio propio en *Domain settings*.
**Cualquier hosting estático** (Vercel, Cloudflare Pages, GitHub Pages, S3): comando `node build.mjs`, carpeta `dist`.

Antes de lanzar anuncios, corré `npm run build` y revisá el **Launch checklist** que imprime: lista todo lo que sigue siendo placeholder. Luego poné `site.markPlaceholders = false`.
