import type { BoardRow } from "./joinBoard";
import { ALL_LANDS, type RideLand, type RideType } from "./catalog";

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
  lands: Set<RideLand>;
  waitMin: number;
  waitMax: number;
  heightMin: number;
  heightMax: number;
};

export function defaultFilters(): FilterState {
  return {
    types: new Set(ALL_RIDE_TYPES),
    lands: new Set(ALL_LANDS),
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

export function isShowingAllLands(lands: Set<RideLand>): boolean {
  return ALL_LANDS.every((land) => lands.has(land)) && lands.size >= ALL_LANDS.length;
}

function landMatches(row: BoardRow, lands: Set<RideLand>): boolean {
  if (isShowingAllLands(lands)) return true;
  return row.land != null && lands.has(row.land);
}

export function applyFilters(rows: BoardRow[], filters: FilterState): BoardRow[] {
  const waitUnrestricted = filters.waitMin <= 0 && filters.waitMax >= 120;
  return rows.filter((row) => {
    if (!filters.types.has(row.rideType)) return false;
    if (!landMatches(row, filters.lands)) return false;
    if (row.waitUnknown) {
      // No live Wait — only keep when the Wait range filter is at defaults.
      if (!waitUnrestricted) return false;
    } else {
      const wait = row.isOpen ? row.waitMinutes : 0;
      if (wait < filters.waitMin || wait > filters.waitMax) return false;
    }
    if (!heightRangeMatches(row, filters.heightMin, filters.heightMax)) return false;
    return true;
  });
}
