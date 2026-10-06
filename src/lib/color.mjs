/** WCAG contrast helpers used by the build to audit the brand palette. */

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Pairs that must stay readable. [foreground, background, minimum ratio, label] */
export const CONTRAST_PAIRS = [
  ['text', 'background', 4.5, 'Body text on background'],
  ['text', 'backgroundAlt', 4.5, 'Body text on alt sections'],
  ['textMuted', 'background', 4.5, 'Muted text on background'],
  ['textMuted', 'backgroundAlt', 4.5, 'Muted text on alt sections'],
  ['primaryInk', 'primary', 4.5, 'Text on primary (dark sections)'],
  ['ctaInk', 'cta', 4.5, 'CTA label on CTA button'],
  ['ctaInk', 'ctaHover', 4.5, 'CTA label on hovered CTA'],
  ['success', 'background', 3, 'Success icons on background'],
  ['accent', 'primary', 3, 'Accent details on primary'],
];

export function auditPalette(colors) {
  return CONTRAST_PAIRS.map(([fg, bg, min, label]) => {
    const ratio = contrast(colors[fg], colors[bg]);
    return { label, fg, bg, ratio: Math.round(ratio * 100) / 100, min, ok: ratio >= min };
  });
}
