import { normalizeQueueTimes, type QueueTimesPayload } from "../../src/normalizeQueueTimes";
import { normalizeThemeParks, themeParksLiveUrl } from "../../src/normalizeThemeParks";
import { parseWaitSource, type WaitSource } from "../../src/sources";

const QT_UPSTREAM = "https://queue-times.com/parks/312/queue_times.json";
/** Match ThemeParks.wiki guidance: live data meaningfully refreshes ~every 5 minutes. */
const CACHE_MAX_AGE_SEC = 300;

type PagesEnv = {
  THEMEPARKS_API_KEY?: string;
};

type PagesContext = {
  request: Request;
  env: PagesEnv;
  waitUntil: (promise: Promise<unknown>) => void;
};

/** Cloudflare Pages Function — GET /api/waits?source=themeparks|queue-times */
export async function onRequestGet(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);
  const source = parseWaitSource(url.searchParams.get("source"));
  const cacheKey = new Request(`https://kennywood-waits.internal/api/waits?source=${source}`, {
    method: "GET",
  });

  const cached = await caches.default.match(cacheKey);
  if (cached) {
    const hit = new Response(cached.body, cached);
    hit.headers.set("X-Waits-Cache", "HIT");
    return hit;
  }

  try {
    const fresh = await fetchNormalized(source, context.env);
    if (fresh.ok) {
      const toStore = fresh.clone();
      context.waitUntil(caches.default.put(cacheKey, toStore));
    }
    fresh.headers.set("X-Waits-Cache", "MISS");
    return fresh;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Proxy failure";
    return json({ error: message }, 504);
  }
}

async function fetchNormalized(source: WaitSource, env: PagesEnv): Promise<Response> {
  if (source === "queue-times") {
    const upstream = await fetch(QT_UPSTREAM, { headers: { Accept: "application/json" } });
    if (!upstream.ok) return upstreamError("Queue-Times", upstream);
    const payload = (await upstream.json()) as QueueTimesPayload;
    return json(normalizeQueueTimes(payload, new Date().toISOString()), 200);
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "kennywood-waits/0.1",
  };
  const apiKey = env.THEMEPARKS_API_KEY;
  if (apiKey) headers["x-api-key"] = apiKey;

  const upstream = await fetch(themeParksLiveUrl(), { headers });
  if (!upstream.ok) return upstreamError("ThemeParks.wiki", upstream);
  const payload = (await upstream.json()) as Parameters<typeof normalizeThemeParks>[0];
  return json(normalizeThemeParks(payload, new Date().toISOString()), 200);
}

async function upstreamError(label: string, upstream: Response): Promise<Response> {
  const status = upstream.status === 429 ? 429 : 502;
  const retryAfter = upstream.headers.get("Retry-After");
  const headers: Record<string, string> = {};
  if (retryAfter) headers["Retry-After"] = retryAfter;
  return json({ error: `${label} returned ${upstream.status}` }, status, headers);
}

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": status >= 400 ? "no-store" : `public, max-age=${CACHE_MAX_AGE_SEC}`,
      ...extraHeaders,
    },
  });
}
