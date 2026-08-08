import type { WaitFeed } from "./types";

export type FetchWaitsResult =
  | { ok: true; feed: WaitFeed }
  | { ok: false; status: number; message: string };

const ENDPOINT = "/api/queue-times";

export async function fetchWaits(fetcher: typeof fetch = fetch): Promise<FetchWaitsResult> {
  try {
    const res = await fetcher(ENDPOINT, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      let message = res.statusText || "Upstream error";
      try {
        const body = (await res.json()) as { error?: string };
        if (body.error) message = body.error;
      } catch {
        /* ignore */
      }
      return { ok: false, status: res.status, message };
    }
    const feed = (await res.json()) as WaitFeed;
    return { ok: true, feed };
  } catch (e) {
    return { ok: false, status: 0, message: e instanceof Error ? e.message : "Network error" };
  }
}
