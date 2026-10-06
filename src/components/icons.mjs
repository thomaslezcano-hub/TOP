/**
 * Inline SVG icon set (24×24, 1.75 stroke, currentColor). Inline = zero extra requests.
 * Usage: Icon('clock') · Icon('star', { filled: true, size: 16 })
 */
import { raw } from '../lib/html.mjs';

const PATHS = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  route: '<circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="5.5" r="2"/><path d="M8 18.5h8a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h8"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  pin: '<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  camera: '<path d="M4 8.5h3l1.8-2.5h6.4L17 8.5h3v10H4z"/><circle cx="12" cy="13.2" r="3.2"/>',
  music: '<path d="M9 17.5V5.5l10-2v12"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>',
  guide: '<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20.5a7 7 0 0 1 14 0"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M15.5 4.9a3.2 3.2 0 0 1 0 6.2M17.5 13.9a6 6 0 0 1 3.5 5.6"/>',
  waves: '<path d="M2 7.5c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 12.5c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 17.5c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>',
  gem: '<path d="M6.5 4h11L21 9l-9 11L3 9z"/><path d="M3 9h18M10 4 8.5 9 12 20l3.5-11L14 4"/>',
  sliders: '<path d="M4 6.5h9M17 6.5h3M4 12h3M11 12h9M4 17.5h11M19 17.5h1"/><circle cx="15" cy="6.5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  sunset: '<path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0M12 4v3M4.9 9.4l2 1.6M19.1 9.4l-2 1.6M8 21.5h8"/>',
  utensils: '<path d="M7 3v7.5a2 2 0 0 0 2 2V21M5 3v6M9 3v6M17 21V3c-2 1-3.5 3.5-3.5 7v3H17"/>',
  sparkle: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M19 17v4M17 19h4"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.3-4.4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external: '<path d="M8 16 16 8M9 8h7v7"/>',
  plus: '<path d="M12 5.5v13M5.5 12h13"/>',
  close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  phone: '<path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  cart:
    '<path d="M3 5.5h16.5"/><path d="M5.5 5.5V13M17.5 5.5V13"/><path d="M2.8 17.6v-3a1.6 1.6 0 0 1 1.6-1.6h15.2a1.6 1.6 0 0 1 1.6 1.6v3"/><path d="M8.5 13V10h4.5"/><circle cx="6.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/><path d="M8.5 18h7"/>',
};

const STAR = '<path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/>';

const GOOGLE =
  '<path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.3 2.6C7.2 7.7 9.4 6 12 6z"/>';

export function Icon(name, { size = 20, filled = false, label = '', className = 'icon' } = {}) {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  if (name === 'google') return raw(`<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" ${a11y}>${GOOGLE}</svg>`);
  if (name === 'star')
    return raw(
      `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" ${a11y}>${STAR}</svg>`
    );
  return raw(
    `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${PATHS[name] || ''}</svg>`
  );
}

/** The signature motif: the wavy line of Fort Lauderdale's A1A beach wall. Decorative only. */
export const Wave = (className = 'wave') =>
  raw(
    `<svg class="${className}" viewBox="0 0 240 12" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M1 7.5C11 7.5 11 2.5 21 2.5S31 7.5 41 7.5 51 2.5 61 2.5 71 7.5 81 7.5 91 2.5 101 2.5 111 7.5 121 7.5 131 2.5 141 2.5 151 7.5 161 7.5 171 2.5 181 2.5 191 7.5 201 7.5 211 2.5 221 2.5 231 7.5 239 7.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" pathLength="1"/></svg>`
  );
