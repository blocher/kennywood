import type { WaitAttraction, WaitFeed } from "./types";

/** Raw Queue-Times park queue_times.json shape (lands and/or flat rides). */
export type QueueTimesPayload = {
  lands?: Array<{ rides?: QueueTimesRide[] }>;
  rides?: QueueTimesRide[];
};

type QueueTimesRide = {
  id: number;
  name: string;
  is_open: boolean;
  wait_time: number;
  last_updated: string;
};

/** Flatten lands[].rides and top-level rides into a WaitFeed. */
export function normalizeQueueTimes(payload: QueueTimesPayload, fetchedAt = new Date().toISOString()): WaitFeed {
  const byId = new Map<number, WaitAttraction>();

  const ingest = (rides: QueueTimesRide[] | undefined) => {
    for (const r of rides ?? []) {
      byId.set(r.id, {
        id: r.id,
        name: r.name,
        isOpen: Boolean(r.is_open),
        waitMinutes: Number(r.wait_time) || 0,
        lastUpdated: r.last_updated,
      });
    }
  };

  for (const land of payload.lands ?? []) ingest(land.rides);
  ingest(payload.rides);

  return {
    fetchedAt,
    attractions: [...byId.values()],
  };
}
