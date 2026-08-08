import type { WaitAttraction, WaitFeed } from "./types";
import { THEMEPARKS_KENNYWOOD_ID, type WaitSource } from "./sources";

/** Raw ThemeParks.wiki entity live payload (subset we consume). */
export type ThemeParksLivePayload = {
  id?: string;
  name?: string;
  liveData?: ThemeParksLiveEntity[];
};

export type ThemeParksLiveEntity = {
  id: string;
  name: string;
  entityType?: string;
  status?: string;
  lastUpdated?: string;
  queue?: {
    STANDBY?: { waitTime?: number | null };
  };
};

/** Flatten ThemeParks.wiki Kennywood liveData Attractions into a WaitFeed. */
export function normalizeThemeParks(
  payload: ThemeParksLivePayload,
  fetchedAt = new Date().toISOString(),
): WaitFeed {
  const attractions: WaitAttraction[] = [];
  for (const e of payload.liveData ?? []) {
    if ((e.entityType ?? "ATTRACTION").toUpperCase() !== "ATTRACTION") continue;
    const status = (e.status ?? "").toUpperCase();
    const isOpen = status === "OPERATING";
    const standby = e.queue?.STANDBY?.waitTime;
    const hasWait = typeof standby === "number" && Number.isFinite(standby);
    attractions.push({
      id: e.id,
      name: e.name,
      isOpen,
      waitMinutes: hasWait ? standby : 0,
      lastUpdated: e.lastUpdated ?? fetchedAt,
      waitUnknown: isOpen && !hasWait,
    });
  }

  return {
    fetchedAt,
    source: "themeparks" satisfies WaitSource,
    attractions,
  };
}

export function themeParksLiveUrl(parkId = THEMEPARKS_KENNYWOOD_ID): string {
  return `https://api.themeparks.wiki/v1/entity/${parkId}/live`;
}
