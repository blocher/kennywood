import { lookupCatalog, type RideType } from "./catalog";
import type { WaitAttraction } from "./types";

export type BoardRow = WaitAttraction & {
  rideType: RideType;
  envelopeMinIn: number | null;
  envelopeMaxIn: number | null;
  heightUnknown: boolean;
  catalogNotes?: string;
};

export function joinBoardRows(attractions: WaitAttraction[]): BoardRow[] {
  return attractions.map((a) => {
    const cat = lookupCatalog(a.id);
    if (!cat) {
      return {
        ...a,
        rideType: "unknown",
        envelopeMinIn: null,
        envelopeMaxIn: null,
        heightUnknown: true,
      };
    }
    return {
      ...a,
      rideType: cat.rideType,
      envelopeMinIn: cat.envelopeMinIn,
      envelopeMaxIn: cat.envelopeMaxIn,
      heightUnknown: cat.envelopeMinIn == null,
      catalogNotes: cat.notes,
    };
  });
}

/** Meta line for a board row (Ride type · height hint). */
export function rowMeta(row: BoardRow): string {
  const bits: string[] = [row.rideType];
  if (row.heightUnknown) bits.push("height unknown");
  else if (row.envelopeMinIn != null) {
    const max = row.envelopeMaxIn != null ? `–${row.envelopeMaxIn}"` : "+";
    bits.push(`${row.envelopeMinIn}"${max === "+" ? "+" : max}`);
  }
  return bits.join(" · ");
}
