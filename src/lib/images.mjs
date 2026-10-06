/**
 * Optional responsive-image pipeline.
 *
 * If `sharp` is installed (npm i -D sharp), every configured photo is converted to
 * AVIF + WebP at several widths plus a JPEG fallback, and components get a full
 * <picture> with srcset. Without sharp, the original file is used as-is.
 * Either way, layout boxes have fixed aspect ratios in CSS, so swapping photos never causes CLS.
 */
import fs from 'node:fs';
import path from 'node:path';

const WIDTHS = [480, 800, 1200, 1600, 2000];
const RASTER = /\.(jpe?g|png|webp|avif|tiff?)$/i;

export async function createImagePipeline({ publicDir, outDir, log }) {
  let sharp = null;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    /* sharp is optional */
  }
  const cache = new Map();

  async function processImage(src) {
    if (!src) return null;
    if (cache.has(src)) return cache.get(src);

    const abs = path.join(publicDir, src);
    if (!fs.existsSync(abs)) {
      log.warn(`Media file not found: public/${src}`);
      cache.set(src, null);
      return null;
    }

    let result = { fallback: src, sources: [], width: null, height: null };

    if (sharp && RASTER.test(src)) {
      const meta = await sharp(abs).metadata();
      const widths = WIDTHS.filter((w) => w <= meta.width);
      if (!widths.length) widths.push(meta.width);
      const base = path.parse(src).name;
      const dir = path.join(outDir, '_img');
      fs.mkdirSync(dir, { recursive: true });
      const srcMtime = fs.statSync(abs).mtimeMs;

      const make = async (w, ext, opts) => {
        const file = `${base}-${w}.${ext}`;
        const dest = path.join(dir, file);
        if (!fs.existsSync(dest) || fs.statSync(dest).mtimeMs < srcMtime) {
          await sharp(abs).rotate().resize({ width: w, withoutEnlargement: true })[ext === 'jpg' ? 'jpeg' : ext](opts).toFile(dest);
        }
        return `_img/${file} ${w}w`;
      };

      const avif = [];
      const webp = [];
      for (const w of widths) {
        avif.push(await make(w, 'avif', { quality: 50 }));
        webp.push(await make(w, 'webp', { quality: 72 }));
      }
      const fbWidth = widths.filter((w) => w <= 1600).pop() || widths[0];
      const fallback = (await make(fbWidth, 'jpg', { quality: 78, mozjpeg: true })).split(' ')[0];

      result = {
        fallback,
        sources: [
          { type: 'image/avif', srcset: avif.join(', ') },
          { type: 'image/webp', srcset: webp.join(', ') },
        ],
        width: meta.width,
        height: meta.height,
      };
    }

    cache.set(src, result);
    return result;
  }

  return { processImage, hasSharp: Boolean(sharp) };
}
