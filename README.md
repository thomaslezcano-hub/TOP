# Private Fort Lauderdale Golf Cart Experience — Landing page

Landing de alta conversión para tráfico de Meta Ads (mobile-first). HTML/CSS/JS sin frameworks ni dependencias:
la página completa (HTML + CSS + JS) pesa **~22 KB gzip** y carga en una sola petición.

**You choose the vibe. We build the ride.**

## Empezar

```bash
npm run dev        # build + servidor local en http://localhost:4321 que se recarga al editar
npm run build      # genera dist/ (lo que se publica)
```

Requiere Node 18+. No hay que instalar nada más (`npm install` no es necesario).

## Dónde se cambia cada cosa

| Quiero cambiar… | Archivo |
|-----------------|---------|
| Precios, duración, capacidad, teléfono, email, links, IDs de Pixel/GA4, políticas, reseñas, FAQ, fotos | **`site.config.mjs`** (única fuente de verdad) |
| Colores de marca | `site.config.mjs → brand.colors` |
| Textos de cada sección | `src/components/sections/*.mjs` |
| Estilos | `src/styles/main.css` |
| Comportamiento (sticky, modales, tracking, referidos) | `src/scripts/*.js` |

Cambiar `MAIN_TOUR_PRICE = 225` actualiza el hero, la value card, las tarjetas, el sticky, el cálculo por persona, el schema.org y los eventos de analytics a la vez.

## Launch checklist

Cada `npm run build` imprime lo que sigue siendo placeholder (logo, fotos, booking URL, IDs, políticas, reseñas…) y si algún color no cumple contraste. Con todo resuelto, poné `site.markPlaceholders = false` y lanzá los anuncios.

Para probar reservas, eventos y referidos sin IDs reales: `http://localhost:4321/?ref=HiltonBeach&debug=1`.

## Documentación

- [`docs/ESTRATEGIA.md`](docs/ESTRATEGIA.md) — estructura, lógica CRO de cada sección, copy final, dirección visual y componentes
- [`docs/INTEGRACIONES.md`](docs/INTEGRACIONES.md) — sistema de reservas, mapa de eventos (Pixel/GA4/Ads), QR de hoteles, reseñas, waitlist, deploy
- [`docs/CONTENIDO.md`](docs/CONTENIDO.md) — lista de fotos/video a producir y cómo reemplazar logo, fotos y reseñas

## Estructura

```
site.config.mjs          ← todo lo editable del negocio
build.mjs                ← build estático sin dependencias (inline CSS/JS, SEO, sitemap, checklist)
scripts/dev.mjs          ← servidor local + watch (simula Netlify Forms)
netlify.toml             ← deploy en Netlify
public/                  ← fuentes, favicon, OG image, /media (fotos, video, logo)
src/
  components/            ← componentes reutilizables (ui, media, icons, header, footer, overlays, head)
    sections/            ← una sección de la landing por archivo
  pages/                 ← index (landing) y thanks (confirmación + Purchase)
  scripts/               ← runtime: attribution, analytics, booking, ui
  styles/main.css        ← estilos mobile-first
  lib/                   ← templating, formato, contraste, imágenes, auditoría
```
