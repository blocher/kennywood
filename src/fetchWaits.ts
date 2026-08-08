import type { WaitSource } from "./sources";
import { DEFAULT_WAIT_SOURCE } from "./sources";
import type { WaitFeed } from "./types";

export type FetchWaitsResult =
  | { ok: true; feed: WaitFeed }
  | { ok: false; status: number; message: string };

export async function fetchWaits(
  source: WaitSource = DEFAULT_WAIT_SOURCE,
  fetcher: typeof fetch = fetch,
): Promise<FetchWaitsResult> {
  const endpoint = `/api/waits?source=${encodeURIComponent(source)}`;
  try {
    const res = await fetcher(endpoint, { headers: { Accept: "application/json" } });
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
