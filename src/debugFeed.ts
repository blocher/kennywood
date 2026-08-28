import { ATTRACTION_CATALOG } from "./catalog";
import type { WaitSource } from "./sources";
import type { WaitAttraction, WaitFeed } from "./types";

const FETCHED_AT = "2026-08-28T16:05:00.000Z";

/** Hand-picked sample Waits so the comparison UI has obvious deltas. */
const FEATURED: Record<number, { themeparks?: number; "queue-times"?: number; closed?: boolean }> =
  {
    11031: { themeparks: 55, "queue-times": 40 },
    11034: { themeparks: 70, "queue-times": 85 },
    11029: { themeparks: 25, "queue-times": 40 },
    11027: { themeparks: 20, "queue-times": 15 },
    11037: { themeparks: 10, "queue-times": 5 },
    11025: { themeparks: 15, "queue-times": 10 },
    11024: { themeparks: 45, "queue-times": 50 },
    11030: { themeparks: 30, "queue-times": 25 },
    11032: { themeparks: 20, "queue-times": 30 },
    11033: { themeparks: 15, "queue-times": 20 },
    11891: { themeparks: 35, "queue-times": 25 },
    11028: { closed: true },
    11036: { closed: true },
    900002: { themeparks: 35 },
  };

export function isDebugMode(search: string): boolean {
  return new URLSearchParams(search).get("debug") === "1";
}

function minutes(catalogId: number, source: WaitSource): number {
  const featured = FEATURED[catalogId];
  const picked = featured?.[source];
  if (picked != null) return picked;
  const salt = source === "themeparks" ? 5 : 11;
  return ((catalogId * 3 + salt) % 16) * 5;
}

function attraction(
  catalogId: number,
  id: string,
  name: string,
  source: WaitSource,
): WaitAttraction {
  const featured = FEATURED[catalogId];
  if (featured?.closed) {
    return { id, name, isOpen: false, waitMinutes: 0, lastUpdated: FETCHED_AT };
  }
  return {
    id,
    name,
    isOpen: true,
    waitMinutes: minutes(catalogId, source),
    lastUpdated: FETCHED_AT,
  };
}

/** Synthetic dual-source Wait feeds for UI work while the park is closed. */
export function debugFeeds(): Record<WaitSource, WaitFeed> {
  const themeparks: WaitAttraction[] = [];
  const queueTimes: WaitAttraction[] = [];
  for (const cat of Object.values(ATTRACTION_CATALOG)) {
    if (cat.themeParksId) {
      themeparks.push(attraction(cat.id, cat.themeParksId, cat.name, "themeparks"));
    }
    if (cat.queueTimesId != null) {
      queueTimes.push(attraction(cat.id, String(cat.queueTimesId), cat.name, "queue-times"));
    }
  }
  return {
    themeparks: { fetchedAt: FETCHED_AT, source: "themeparks", attractions: themeparks },
    "queue-times": { fetchedAt: FETCHED_AT, source: "queue-times", attractions: queueTimes },
  };
}
