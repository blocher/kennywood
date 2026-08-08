import { normalizeQueueTimes, type QueueTimesPayload } from "../../src/normalizeQueueTimes";

const UPSTREAM = "https://queue-times.com/parks/312/queue_times.json";

/** Cloudflare Pages Function — GET /api/queue-times (Queue-Times only; prefer /api/waits). */
export async function onRequestGet(): Promise<Response> {
  try {
    const upstream = await fetch(UPSTREAM, { headers: { Accept: "application/json" } });
    if (!upstream.ok) {
      return json({ error: `Queue-Times returned ${upstream.status}` }, 502);
    }
    const payload = (await upstream.json()) as QueueTimesPayload;
    return json(normalizeQueueTimes(payload, new Date().toISOString()), 200);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Proxy failure";
    return json({ error: message }, 504);
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": status >= 500 ? "no-store" : "public, max-age=60",
    },
  });
}
