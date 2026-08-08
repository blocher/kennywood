import { normalizeQueueTimes, type QueueTimesPayload } from "../../src/normalizeQueueTimes";
import { normalizeThemeParks, themeParksLiveUrl } from "../../src/normalizeThemeParks";
import { parseWaitSource } from "../../src/sources";

const QT_UPSTREAM = "https://queue-times.com/parks/312/queue_times.json";

type PagesContext = { request: Request };

/** Cloudflare Pages Function — GET /api/waits?source=themeparks|queue-times */
export async function onRequestGet(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);
  const source = parseWaitSource(url.searchParams.get("source"));

  try {
    if (source === "queue-times") {
      const upstream = await fetch(QT_UPSTREAM, { headers: { Accept: "application/json" } });
      if (!upstream.ok) {
        return json({ error: `Queue-Times returned ${upstream.status}` }, 502);
      }
      const payload = (await upstream.json()) as QueueTimesPayload;
      return json(normalizeQueueTimes(payload, new Date().toISOString()), 200);
    }

    const upstream = await fetch(themeParksLiveUrl(), {
      headers: { Accept: "application/json", "User-Agent": "kennywood-waits/0.1" },
    });
    if (!upstream.ok) {
      return json({ error: `ThemeParks.wiki returned ${upstream.status}` }, 502);
    }
    const payload = (await upstream.json()) as Parameters<typeof normalizeThemeParks>[0];
    return json(normalizeThemeParks(payload, new Date().toISOString()), 200);
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
