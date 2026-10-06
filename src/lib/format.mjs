/** Formatting helpers shared by the build (components) and documented for the runtime. */

export const isSet = (v) => v !== null && v !== undefined && !(typeof v === 'string' && v.trim() === '');

/** $225 · $56.25 — cents only when needed. */
export function money(amount, currency = 'USD') {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const perPerson = (price, guests) => Math.round((price / guests) * 100) / 100;

export const hoursLabel = (h) => `${h} hour${h === 1 ? '' : 's'}`;
export const hoursShort = (h) => `${h} hr${h === 1 ? '' : 's'}`;

/** Group sizes for the "split it your way" table: configured examples ≤ max, always including max. */
export function splitExamples(examples, maxGuests) {
  if (!maxGuests) return [];
  const list = examples.filter((n) => n >= 2 && n <= maxGuests);
  if (!list.includes(maxGuests)) list.push(maxGuests);
  return [...new Set(list)].sort((a, b) => a - b).slice(-3);
}

/** Replace {{key}} tokens with values from a map. */
export const fill = (template, map) => template.replace(/\{\{(\w+)\}\}/g, (_, k) => map[k] ?? '');
