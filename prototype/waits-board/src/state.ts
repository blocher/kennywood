import type { Attraction } from "./data";

export type SortMode = "wait" | "alpha";

export type ProtoState = {
  sort: SortMode;
  hideClosed: boolean;
  filtersOpen: boolean;
  groupOpen: boolean;
  waitMin: number;
  waitMax: number;
  heightMin: number;
  heightMax: number;
  types: Set<string>;
  selectedRiderIds: Set<string>;
};

export const ALL_TYPES = [
  "roller coaster",
  "thrill ride",
  "family ride",
  "dark ride / walk-on",
  "water ride",
  "kiddie ride",
  "unknown",
];

export function defaultState(): ProtoState {
  return {
    sort: "wait",
    hideClosed: false,
    filtersOpen: false,
    groupOpen: false,
    waitMin: 0,
    waitMax: 120,
    heightMin: 0,
    heightMax: 84,
    types: new Set(ALL_TYPES),
    selectedRiderIds: new Set(),
  };
}

/** Mock Group — in-memory only (prototype rule). */
export const MOCK_RIDERS = [
  { id: "r1", name: "Alex", heightIn: 70 },
  { id: "r2", name: "Sam", heightIn: 48 },
  { id: "r3", name: "Jamie", heightIn: 42 },
];

export function filterAttractions(list: Attraction[], s: ProtoState): Attraction[] {
  let out = list.filter((a) => {
    if (s.hideClosed && !a.isOpen) return false;
    if (!s.types.has(a.rideType)) return false;
    const wait = a.isOpen ? a.waitMinutes : 0;
    if (wait < s.waitMin || wait > s.waitMax) return false;

    // Height range: whole [heightMin, heightMax] must fit envelope
    if (s.heightMin > 0 || s.heightMax < 84) {
      if (a.heightUnknown || a.heightMinIn == null) {
        // still include (marked unknown in UI)
      } else {
        const envMin = a.heightMinIn;
        const envMax = a.id === 11034 ? 77 : 999;
        for (let h = s.heightMin; h <= s.heightMax; h++) {
          if (h < envMin || h > envMax) return false;
        }
      }
    }

    // Eligibility: all selected riders must fit
    if (s.selectedRiderIds.size > 0) {
      const riders = MOCK_RIDERS.filter((r) => s.selectedRiderIds.has(r.id));
      for (const r of riders) {
        if (a.heightUnknown || a.heightMinIn == null) continue;
        const envMax = a.id === 11034 ? 77 : 999;
        if (r.heightIn < a.heightMinIn || r.heightIn > envMax) return false;
      }
    }

    return true;
  });

  out = [...out].sort((a, b) => {
    if (s.sort === "alpha") return a.name.localeCompare(b.name);
    const aw = a.isOpen ? a.waitMinutes : 9999;
    const bw = b.isOpen ? b.waitMinutes : 9999;
    if (aw !== bw) return aw - bw;
    return a.name.localeCompare(b.name);
  });

  return out;
}

export function formatHeight(inches: number): string {
  const ft = Math.floor(inches / 12);
  const inn = inches % 12;
  return `${ft}'${inn}"`;
}
