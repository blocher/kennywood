import {
  catalogWithoutQueueTimes,
  lookupCatalogByName,
  lookupCatalogByQueueTimesId,
  lookupCatalogByThemeParksId,
  type CatalogEntry,
  type RideType,
} from "./catalog";
import type { WaitSource } from "./sources";
import type { WaitAttraction } from "./types";

export type BoardRow = WaitAttraction & {
  rideType: RideType;
  envelopeMinIn: number | null;
  envelopeMaxIn: number | null;
  heightUnknown: boolean;
  catalogNotes?: string;
  /** True when no standby Wait is available for this Attraction. */
  waitUnknown: boolean;
};

function resolveCatalog(a: WaitAttraction, source: WaitSource): CatalogEntry | undefined {
  if (source === "queue-times") {
    const n = Number(a.id);
    if (Number.isFinite(n)) {
      const hit = lookupCatalogByQueueTimesId(n);
      if (hit) return hit;
    }
  } else {
    const hit = lookupCatalogByThemeParksId(a.id);
    if (hit) return hit;
  }
  return lookupCatalogByName(a.name);
}

function fromCatalog(a: WaitAttraction, cat: CatalogEntry, waitUnknown: boolean): BoardRow {
  return {
    ...a,
    rideType: cat.rideType,
    envelopeMinIn: cat.envelopeMinIn,
    envelopeMaxIn: cat.envelopeMaxIn,
    heightUnknown: cat.envelopeMinIn == null,
    catalogNotes: cat.notes,
    waitUnknown,
  };
}

export function joinBoardRows(
  attractions: WaitAttraction[],
  source: WaitSource = "queue-times",
): BoardRow[] {
  const fromFeed = attractions.map((a) => {
    const cat = resolveCatalog(a, source);
    const waitUnknown = Boolean(a.waitUnknown);
    if (!cat) {
      return {
        ...a,
        rideType: "unknown" as const,
        envelopeMinIn: null,
        envelopeMaxIn: null,
        heightUnknown: true,
        waitUnknown,
      };
    }
    return fromCatalog(a, cat, waitUnknown);
  });

  // Queue-Times omits many park Attractions — append catalog-only rows with no wait data.
  if (source !== "queue-times") return fromFeed;

  const feedQtIds = new Set(
    fromFeed.map((r) => Number(r.id)).filter((n) => Number.isFinite(n)),
  );
  const extras: BoardRow[] = [];
  for (const cat of catalogWithoutQueueTimes()) {
    if (cat.queueTimesId != null && feedQtIds.has(cat.queueTimesId)) continue;
    if (fromFeed.some((r) => lookupCatalogByName(r.name)?.id === cat.id)) continue;
    extras.push(
      fromCatalog(
        {
          id: String(cat.id),
          name: cat.name,
          isOpen: true,
          waitMinutes: 0,
          lastUpdated: "",
          waitUnknown: true,
        },
        cat,
        true,
      ),
    );
  }

  return [...fromFeed, ...extras];
}

/** Meta line for a board row (Ride type · height hint). */
export function rowMeta(row: BoardRow): string {
  const bits: string[] = [row.rideType];
  if (row.heightUnknown) bits.push("height unknown");
  else if (row.envelopeMinIn != null) {
    const max = row.envelopeMaxIn != null ? `–${row.envelopeMaxIn}"` : "+";
    bits.push(`${row.envelopeMinIn}"${max === "+" ? "+" : max}`);
  }
  if (row.waitUnknown) bits.push("no wait data");
  return bits.join(" · ");
}
