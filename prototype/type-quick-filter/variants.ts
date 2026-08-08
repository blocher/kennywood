/**
 * PROTOTYPE — Three variants of always-visible Ride type quick filters.
 * Switch via ?variant=A|B|C — see README.md
 */
import type { FilterState } from "../../filters";
import { ALL_RIDE_TYPES } from "../../filters";
import type { RideType } from "../../catalog";
import { QUICK_TYPES, TYPE_ICONS, isAllTypes } from "./icons";

export type QuickVariant = "A" | "B" | "C";

export const VARIANT_NAMES: Record<QuickVariant, string> = {
  A: "Under-header chips",
  B: "Segmented exclusive",
  C: "Icon dock (multi)",
};

function activeSolo(types: Set<RideType>): RideType | null {
  if (isAllTypes(types) || types.size !== 1) return null;
  const only = [...types][0];
  return QUICK_TYPES.some((t) => t.type === only) ? only : null;
}

/** A — sticky chip strip: icon + short label; solo tap / tap again = All */
export function renderVariantA(filters: FilterState): string {
  const solo = activeSolo(filters.types);
  const allOn = isAllTypes(filters.types) || filters.types.size === ALL_RIDE_TYPES.length;
  const chips = QUICK_TYPES.map(({ type, short }) => {
    const on = solo === type;
    const icon = TYPE_ICONS[type] ?? "";
    return `<button type="button" class="tqf-chip ${on ? "on" : ""}" data-action="quick-solo" data-type="${type}" aria-pressed="${on}">
      <span class="tqf-ico">${icon}</span>
      <span class="tqf-lbl">${short}</span>
    </button>`;
  }).join("");

  return `<nav class="tqf tqf-a" aria-label="Ride type quick filter">
    <button type="button" class="tqf-chip tqf-all ${allOn && !solo ? "on" : ""}" data-action="quick-all" aria-pressed="${allOn && !solo}">All</button>
    <div class="tqf-scroll">${chips}</div>
  </nav>`;
}

/** B — exclusive segmented control with explicit All */
export function renderVariantB(filters: FilterState): string {
  const solo = activeSolo(filters.types);
  const allOn = !solo;
  const segs = [
    `<button type="button" class="tqf-seg ${allOn ? "on" : ""}" data-action="quick-all" aria-pressed="${allOn}">All</button>`,
    ...QUICK_TYPES.map(({ type, short }) => {
      const on = solo === type;
      const icon = TYPE_ICONS[type] ?? "";
      return `<button type="button" class="tqf-seg ${on ? "on" : ""}" data-action="quick-solo" data-type="${type}" aria-pressed="${on}" title="${short}">
        <span class="tqf-ico">${icon}</span>
        <span class="tqf-lbl">${short}</span>
      </button>`;
    }),
  ].join("");

  return `<nav class="tqf tqf-b" aria-label="Ride type quick filter">
    <div class="tqf-segmented" role="radiogroup">${segs}</div>
  </nav>`;
}

/** C — icon-only dock; multi-select (combine types) */
export function renderVariantC(filters: FilterState): string {
  const allOn = isAllTypes(filters.types);
  const icons = QUICK_TYPES.map(({ type, short }) => {
    const on = !allOn && filters.types.has(type);
    const icon = TYPE_ICONS[type] ?? "";
    return `<button type="button" class="tqf-dock-btn ${on ? "on" : ""}" data-action="quick-toggle" data-type="${type}" aria-pressed="${on}" title="${short}" aria-label="${short}">
      <span class="tqf-ico">${icon}</span>
    </button>`;
  }).join("");

  return `<nav class="tqf tqf-c" aria-label="Ride type quick filter">
    <div class="tqf-dock">${icons}</div>
    <p class="tqf-state" aria-live="polite">${allOn ? "Showing all types" : `On: ${[...filters.types].filter((t) => t !== "unknown").join(", ") || "none"}`}</p>
  </nav>`;
}

export function renderQuickFilter(variant: QuickVariant, filters: FilterState): string {
  if (variant === "B") return renderVariantB(filters);
  if (variant === "C") return renderVariantC(filters);
  return renderVariantA(filters);
}

export function parseVariant(raw: string | null): QuickVariant {
  if (raw === "B" || raw === "C" || raw === "A") return raw;
  return "A";
}
