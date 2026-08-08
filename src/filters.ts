import type { BoardRow } from "./joinBoard";
import type { RideType } from "./catalog";

export const ALL_RIDE_TYPES: RideType[] = [
  "roller coaster",
  "thrill ride",
  "family ride",
  "dark ride / walk-on",
  "water ride",
  "kiddie ride",
  "unknown",
];

export type FilterState = {
  types: Set<RideType>;
  waitMin: number;
  waitMax: number;
  heightMin: number;
  heightMax: number;
};

export function defaultFilters(): FilterState {
  return {
    types: new Set(ALL_RIDE_TYPES),
    waitMin: 0,
    waitMax: 120,
    heightMin: 0,
    heightMax: 84,
  };
}

export function clearFilters(): FilterState {
  return defaultFilters();
}

/** True if every height in [L,U] fits the Attraction envelope (unknown min always passes). */
export function heightRangeMatches(row: BoardRow, heightMin: number, heightMax: number): boolean {
  if (heightMin <= 0 && heightMax >= 84) return true;
  if (row.heightUnknown || row.envelopeMinIn == null) return true;
  const envMin = row.envelopeMinIn;
  const envMax = row.envelopeMaxIn ?? Number.POSITIVE_INFINITY;
  for (let h = heightMin; h <= heightMax; h++) {
    if (h < envMin || h > envMax) return false;
  }
  return true;
}

export function applyFilters(rows: BoardRow[], filters: FilterState): BoardRow[] {
  return rows.filter((row) => {
    if (!filters.types.has(row.rideType)) return false;
    const wait = row.isOpen ? row.waitMinutes : 0;
    if (wait < filters.waitMin || wait > filters.waitMax) return false;
    if (!heightRangeMatches(row, filters.heightMin, filters.heightMax)) return false;
    return true;
  });
}
