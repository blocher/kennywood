import type { RideType } from "./catalog";
import { ALL_RIDE_TYPES, type FilterState } from "./filters";

const TYPE_ICONS: Partial<Record<RideType, string>> = {
  "roller coaster": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 17h2l1-3 2 5 2-8 2 6 2-4 1 4h2l-2-7-2 4-2-6-2 8-2-5-1 3H3v3zm0 2h18v2H3v-2z"/></svg>`,
  "thrill ride": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 9 9H2l6 4.5L5.5 22 12 17l6.5 5L16 13.5 22 9h-7L12 2z"/></svg>`,
  "family ride": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm6 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM9 13c-2.7 0-8 1.3-8 4v2h10v-2c0-2.7 5.3-4 8-4s8 1.3 8 4v2h2v-2c0-2.7-5.3-4-8-4-1.5 0-3.2.4-4.5 1-.9-.4-2.1-.6-3.5-.6z"/></svg>`,
  "dark ride / walk-on": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0-9 9c0 4 2.5 6.5 5 8.5L12 23l4-2.5c2.5-2 5-4.5 5-8.5a9 9 0 0 0-9-9zm0 4a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm-3 9v-1.2c0-1.3 2-2 3-2s3 .7 3 2V16z"/></svg>`,
  "water ride": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3c-1.5 3-4 5-7 6 2 1 3.5 2.5 4 5 .5-1.5 1.5-2.5 3-3 1.5.5 2.5 1.5 3 3 .5-2.5 2-4 4-5-3-1-5.5-3-7-6zm-7 14c1.5-1 3-1 4.5 0S13 18 14.5 17s3-1 4.5 0S22 18 23 17v2c-1.5 1-3 1-4.5 0S15 18 13.5 19s-3 1-4.5 0S6 18 4.5 19 2 20 .5 19v-2C2 18 3.5 18 5 17z"/></svg>`,
  "kiddie ride": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a3 3 0 0 1 3 3c0 1.2-.7 2.2-1.7 2.7L15 12h2v2h-2.2l-.8 2H17v2h-3.5l-1 2H9.5l-1-2H5v-2h3l-.8-2H5v-2h2l1.7-4.3A3 3 0 0 1 12 2z"/></svg>`,
};

export const QUICK_TYPES: { type: RideType; short: string }[] = [
  { type: "roller coaster", short: "Coaster" },
  { type: "thrill ride", short: "Thrill" },
  { type: "family ride", short: "Family" },
  { type: "dark ride / walk-on", short: "Dark" },
  { type: "water ride", short: "Water" },
  { type: "kiddie ride", short: "Kids" },
];

function isShowingAll(types: Set<RideType>): boolean {
  return QUICK_TYPES.every((t) => types.has(t.type)) && types.size >= QUICK_TYPES.length;
}

function activeSolo(types: Set<RideType>): RideType | null {
  if (types.size !== 1) return null;
  const only = [...types][0]!;
  return QUICK_TYPES.some((t) => t.type === only) ? only : null;
}

/** Always-visible Ride type chips: All + icon/label; tap solos, tap again clears to All. */
export function renderTypeQuick(filters: FilterState): string {
  const solo = activeSolo(filters.types);
  const allOn = !solo && isShowingAll(filters.types);
  const chips = QUICK_TYPES.map(({ type, short }) => {
    const on = solo === type;
    return `<button type="button" class="type-chip ${on ? "on" : ""}" data-action="quick-solo" data-type="${type}" aria-pressed="${on}">
      <span class="type-ico">${TYPE_ICONS[type] ?? ""}</span>
      <span class="type-lbl">${short}</span>
    </button>`;
  }).join("");

  return `<nav class="type-quick" aria-label="Ride type">
    <button type="button" class="type-chip type-all ${allOn ? "on" : ""}" data-action="quick-all" aria-pressed="${allOn}">All</button>
    <div class="type-scroll">${chips}</div>
  </nav>`;
}

export function typesAfterSoloTap(current: Set<RideType>, type: RideType): Set<RideType> {
  const only = current.size === 1 && current.has(type);
  return only ? new Set(ALL_RIDE_TYPES) : new Set([type]);
}
