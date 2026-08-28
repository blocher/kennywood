import {
  catalogWithoutQueueTimes,
  lookupCatalogByName,
  lookupCatalogByQueueTimesId,
  lookupCatalogByThemeParksId,
  normalizeAttractionName,
  type CatalogEntry,
  type RideLand,
  type RideType,
} from "./catalog";
import { heightHint } from "./heightFormat";
import type { WaitSource } from "./sources";
import type { WaitAttraction } from "./types";

export type AltWait = Pick<WaitAttraction, "isOpen" | "waitMinutes"> & {
  waitUnknown?: boolean;
};

export type BoardRow = WaitAttraction & {
  rideType: RideType;
  land?: RideLand;
  envelopeMinIn: number | null;
  envelopeMaxIn: number | null;
  companionMinIn: number | null;
  soloMinIn: number | null;
  partnerRequired?: boolean;
  heightUnknown: boolean;
  catalogNotes?: string;
  /** True when no standby Wait is available for this Attraction. */
  waitUnknown: boolean;
  catalogId?: number;
  /** Wait from the inactive source, when that feed has a matching Attraction. */
  altWait?: AltWait;
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
    land: cat.land,
    envelopeMinIn: cat.envelopeMinIn,
    envelopeMaxIn: cat.envelopeMaxIn,
    companionMinIn: cat.companionMinIn,
    soloMinIn: cat.soloMinIn,
    partnerRequired: cat.partnerRequired,
    heightUnknown: cat.envelopeMinIn == null,
    catalogNotes: cat.notes,
    waitUnknown,
    catalogId: cat.id,
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
        companionMinIn: null,
        soloMinIn: null,
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

/** Attach the inactive source's Wait onto rows that share a catalog Attraction. */
export function attachAltWaits(
  rows: BoardRow[],
  altAttractions: WaitAttraction[],
  altSource: WaitSource,
): BoardRow[] {
  const byCatalogId = new Map<number, WaitAttraction>();
  const byName = new Map<string, WaitAttraction>();
  for (const a of altAttractions) {
    const cat = resolveCatalog(a, altSource);
    if (cat) byCatalogId.set(cat.id, a);
    byName.set(normalizeAttractionName(a.name), a);
  }
  return rows.map((row) => {
    const alt =
      (row.catalogId != null ? byCatalogId.get(row.catalogId) : undefined) ??
      byName.get(normalizeAttractionName(row.name));
    if (!alt) return row;
    return {
      ...row,
      altWait: {
        isOpen: alt.isOpen,
        waitMinutes: alt.waitMinutes,
        ...(alt.waitUnknown ? { waitUnknown: true } : {}),
      },
    };
  });
}

function rideTypeLabel(type: RideType): string {
  return type.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/** Height rule on its own line under the Attraction name. */
export function rowHeight(row: BoardRow): string {
  return heightHint(row);
}

/** Meta line for a board row (Ride type · Land). */
export function rowMeta(row: BoardRow): string {
  const bits: string[] = [rideTypeLabel(row.rideType)];
  if (row.land) bits.push(row.land);
  if (row.waitUnknown) bits.push("no wait data");
  return bits.join(" · ");
}
