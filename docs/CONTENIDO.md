# Guía de contenido: fotos, video, logo y reseñas

Cada placeholder de la página describe la toma exacta que va en ese lugar. Esta es la lista completa para una sola sesión de fotos (idealmente dos bloques: mediodía y golden hour).

## Reglas generales
- **Gente real disfrutando, no el carrito vacío.** Sonrisas, movimiento, interacción con el guía.
- Siempre que se pueda: agua, palmeras o arquitectura reconocible de Fort Lauderdale en cuadro.
- Horizontal 3:2 o 4:3 para todo excepto lo indicado; mínimo 2000 px de ancho.
- Dejá "aire" en el tercio inferior-izquierdo del hero y del cierre: ahí va el texto.
- Exportá en JPG calidad 80–85. Si instalás `sharp` (`npm i -D sharp`), el build genera AVIF/WebP en 5 tamaños automáticamente.

## Lista de tomas

| Slot (`site.config.mjs → media`) | Toma | Formato |
|---|---|---|
| `hero.image` (**la más importante**) | Gran angular en golden hour: el carrito sobre A1A con el océano detrás, el grupo riéndose | Horizontal, sujeto a la derecha. Que pese < 250 KB optimizada |
| `hero.video` (opcional) | Loop de 8–15 s: el carrito avanzando, pelo al viento, el guía señalando algo. Sin cortes bruscos | MP4 H.264 + WebM, 1280–1920 px, sin audio, ≤ 2.5 MB |
| `gallery[0]` "Ride." | Carrito en movimiento por la costanera, océano en cuadro | Horizontal |
| `gallery[1]` "Stop." | Las Olas: el grupo bajando del carrito, vidrieras y palmeras | **Vertical** |
| `gallery[2]` "Discover." | El guía mostrando algo en una calle tranquila con canal | Cuadrada |
| `gallery[3]` "Take the picture." | Foto grupal en el carrito con el waterfront detrás | Cuadrada |
| `gallery[4]` "Find your favorite place." | Pareja en el Riverwalk o un muelle en golden hour | Horizontal |
| `tours.classic` | De día: carrito lleno, playa o Las Olas, luminoso y alegre | 4:3 |
| `tours.sunset` | Golden hour: pareja o amigos, luz cálida, agua detrás | 4:3 |
| `tours.taste` | Parada gastronómica: tacos, key lime pie o un café local | 4:3 |
| `final.image` | Atardecer en el waterfront: carrito en silueta, cielo encendido | Horizontal, texto a la izquierda |
| `seo.ogImage` | La mejor foto del hero recortada a 1200×630 (se ve al compartir el link) | 1200×630 JPG |

Hay una OG image provisional en `public/og-image.jpg` generada con la paleta. Si cambiás el precio, reemplazala (tiene "$225" escrito).

## Cómo reemplazar
1. Copiá el archivo a `public/media/` (ej. `public/media/hero.jpg`).
2. En `site.config.mjs` → `media.hero.image: 'media/hero.jpg'`.
3. Revisá el texto `alt` de esa foto (describe lo que se ve, para accesibilidad y SEO).
4. `npm run build`.

## Logo
1. `public/media/logo.svg` (versión para fondos claros) y `public/media/logo-white.svg` (para el hero y el footer, que son oscuros).
2. `logo.src` y `logo.srcOnDark` en la config. Ajustá `width`/`height` a la proporción real.
3. Si los colores del logo cambian la paleta, editá `brand.colors`: el build avisa si algún par de colores no cumple contraste WCAG.

## Reseñas
- Solo reseñas verificadas. Pedí permiso al cliente o usá el nombre tal como aparece públicamente en Google.
- Formato en la config: `{ rating: 5, text: '…', name: 'Sarah M.', date: 'March 2026', source: 'google' }` (sin `placeholder: true`).
