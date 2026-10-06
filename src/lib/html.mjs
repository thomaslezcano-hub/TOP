/**
 * Tiny, dependency-free HTML templating.
 * `html` is a tagged template: interpolated values are escaped unless wrapped in `raw()`
 * (or produced by another `html` call). Arrays are joined; null/false/true render nothing.
 */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

export const raw = (value) => new SafeHtml(String(value ?? ''));

function render(value) {
  if (value === null || value === undefined || value === false || value === true) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return escape(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

/** Render an attribute map. `true` → boolean attribute, null/false/undefined → omitted. */
export function attrs(map) {
  return raw(
    Object.entries(map)
      .filter(([, v]) => v !== null && v !== undefined && v !== false && v !== '')
      .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${escape(v)}"`))
      .join('')
  );
}

/** Join class names, skipping falsy ones. */
export const cx = (...names) => names.flat().filter(Boolean).join(' ');
