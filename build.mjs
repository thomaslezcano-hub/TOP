#!/usr/bin/env node
/**
 * Static build — zero dependencies (Node 18+).
 *
 *   node build.mjs            → dist/      (production site: upload this folder or let Netlify build it)
 *   node build.mjs --preview  → preview/   (single-file preview with fonts inlined)
 *
 * What it does:
 *   1. Reads site.config.mjs (the single source of truth)
 *   2. Copies /public (fonts, photos, video, icons) to the output
 *   3. Optionally converts photos to AVIF/WebP (only if `sharp` is installed)
 *   4. Renders the pages, inlining CSS + JS (one HTML request = fastest first paint)
 *   5. Writes robots.txt + sitemap.xml
 *   6. Prints the launch checklist (placeholders still pending, contrast problems)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { money } from './src/lib/format.mjs';
import { hexToRgb } from './src/lib/color.mjs';
import { createImagePipeline } from './src/lib/images.mjs';
import { auditConfig } from './src/lib/audit.mjs';
import { Document, jsonScript } from './src/pages/document.mjs';
import { renderIndex } from './src/pages/index.mjs';
import { renderThanks } from './src/pages/thanks.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const preview = process.argv.includes('--preview');
const quiet = process.argv.includes('--quiet');
const outDir = path.join(root, preview ? 'preview' : 'dist');
const publicDir = path.join(root, 'public');

const config = (await import(`${pathToFileURL(path.join(root, 'site.config.mjs')).href}?t=${Date.now()}`)).default;

const log = {
  warnings: [],
  warn(msg) {
    this.warnings.push(msg);
  },
};

/* ── 1. Output folder (keeps the _img cache between builds) ── */
fs.mkdirSync(outDir, { recursive: true });
for (const entry of fs.readdirSync(outDir)) {
  if (entry !== '_img') fs.rmSync(path.join(outDir, entry), { recursive: true, force: true });
}
if (!preview) fs.cpSync(publicDir, outDir, { recursive: true, filter: (src) => !src.endsWith('.gitkeep') && !src.endsWith('README.md') });

/* ── 2. Images ── */
const pipeline = await createImagePipeline({ publicDir, outDir, log });
const images = new Map();
const { media } = config;
const allMedia = [media.hero, media.final, ...media.gallery, ...Object.values(media.tours)];
for (const item of allMedia) if (item.image) images.set(item.image, await pipeline.processImage(item.image));
for (const [k, v] of images) if (!v) images.delete(k);

/* ── 3. CSS: color tokens from config + stylesheet ── */
const tokenName = (k) => k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const tokens = Object.entries(config.brand.colors)
  .map(([k, v]) => `--c-${tokenName(k)}:${v};--c-${tokenName(k)}-rgb:${hexToRgb(v).join(' ')};`)
  .join('');
const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
const baseCss = minifyCss(`:root{${tokens}}` + fs.readFileSync(path.join(root, 'src/styles/main.css'), 'utf8'));

function cssFor(base) {
  if (preview) {
    // Inline fonts as data URIs so the preview is a single self-contained file.
    return baseCss.replace(/url\('fonts\/([^']+)'\)/g, (_, file) => {
      const b64 = fs.readFileSync(path.join(publicDir, 'fonts', file)).toString('base64');
      return `url(data:font/woff2;base64,${b64})`;
    });
  }
  return baseCss.replace(/url\('fonts\//g, `url('${base}fonts/`);
}

/* ── 4. JS: small modules concatenated into one inline script ── */
const stripJs = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((line) => !/^\s*\/\//.test(line) && line.trim() !== '')
    .join('\n');
const bundle = (files) =>
  `(function(){'use strict';var SITE=JSON.parse(document.getElementById('site-data').textContent);\n${files
    .map((f) => stripJs(fs.readFileSync(path.join(root, 'src/scripts', f), 'utf8')))
    .join('\n')}\n})();`;

const runtime = {
  currency: config.currency,
  tours: Object.fromEntries(config.tours.map((t) => [t.id, { name: t.name, price: t.price ?? null, bookingUrl: t.bookingUrl || '' }])),
  booking: {
    mode: config.booking.mode,
    url: config.booking.url,
    openInNewTab: config.booking.openInNewTab,
    refParam: config.booking.refParam,
    passUtm: config.booking.passUtm,
    providerScript: config.booking.providerScript,
  },
  tracking: config.tracking,
  referral: config.referral,
  waitlist: config.waitlist,
  contactEmail: config.business.email,
  preview,
};

/* ── 5. Render ── */
const tourMap = Object.fromEntries(config.tours.map((t) => [t.id, t]));
function makeCtx(base) {
  return {
    config,
    preview,
    base,
    images,
    mark: config.site.markPlaceholders,
    year: new Date().getFullYear(),
    main: tourMap.classic,
    tour: (id) => tourMap[id] || tourMap.classic,
    money: (n) => money(n, config.currency),
    asset: (p) => (/^(https?:)?\/\//.test(p) ? p : base + p),
    srcset: (s) => s.replace(/(^|, )(_img\/)/g, `$1${base}$2`),
    bookingHref(t) {
      const { mode, url } = config.booking;
      if (mode === 'link') return t.bookingUrl || url || '#tours';
      if (mode === 'embed') return '#book';
      return '#tours';
    },
  };
}

function writePage(rel, base, page, scripts) {
  const body = `${page.body}\n${jsonScript('site-data', runtime)}\n<script>${bundle(scripts)}</script>`;
  const out = Document({ head: page.head, css: cssFor(base), body, preview, lang: config.site.language });
  const file = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  return out.length;
}

const sizes = {};
sizes['index.html'] = writePage('index.html', '', renderIndex(makeCtx('')), ['attribution.js', 'analytics.js', 'booking.js', 'ui.js', 'main.js']);
if (!preview) {
  sizes['thanks/index.html'] = writePage('thanks/index.html', '../', renderThanks(makeCtx('../')), ['attribution.js', 'analytics.js', 'thanks.js']);

  const siteUrl = config.site.url.replace(/\/$/, '');
  fs.writeFileSync(
    path.join(outDir, 'robots.txt'),
    config.site.indexable ? `User-agent: *\nAllow: /\nDisallow: /thanks/\n\nSitemap: ${siteUrl}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n'
  );
  fs.writeFileSync(
    path.join(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`
  );
}

/* ── 6. Report ── */
if (!quiet) {
  const { todo, palette } = auditConfig(config);
  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(`\n✔ Built ${path.relative(root, outDir)}/  ${Object.entries(sizes).map(([f, n]) => `${f} ${kb(n)}`).join(' · ')}`);
  console.log(`  Images: ${pipeline.hasSharp ? 'sharp found → AVIF/WebP generated' : 'sharp not installed → originals used (npm i -D sharp to optimize)'}`);
  for (const w of log.warnings) console.log(`  ⚠ ${w}`);

  const badContrast = palette.filter((p) => !p.ok);
  if (badContrast.length) {
    console.log('\n✖ Contrast problems (WCAG):');
    for (const p of badContrast) console.log(`  · ${p.label}: ${p.ratio}:1 (needs ${p.min}:1) — ${p.fg} on ${p.bg}`);
  }
  if (todo.length) {
    console.log(`\n☐ Launch checklist — ${todo.length} item(s) pending:`);
    for (const t of todo) console.log(`  · ${t.key.padEnd(26)} ${t.why}`);
  }
  console.log('');
}
