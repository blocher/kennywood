const UPSTREAM = "https://queue-times.com/parks/312/queue_times.json";

type QtRide = {
  id: number;
  name: string;
  is_open: boolean;
  wait_time: number;
  last_updated: string;
};

type QtPayload = {
  lands?: Array<{ rides?: QtRide[] }>;
  rides?: QtRide[];
};

/** Cloudflare Pages Function — GET /api/queue-times */
export async function onRequestGet(): Promise<Response> {
  try {
    const upstream = await fetch(UPSTREAM, { headers: { Accept: "application/json" } });
    if (!upstream.ok) {
      return json({ error: `Queue-Times returned ${upstream.status}` }, 502);
    }
    const payload = (await upstream.json()) as QtPayload;
    const byId = new Map<
      number,
      { id: number; name: string; isOpen: boolean; waitMinutes: number; lastUpdated: string }
    >();
    const ingest = (rides: QtRide[] | undefined) => {
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

    return json(
      { fetchedAt: new Date().toISOString(), attractions: [...byId.values()] },
      200,
    );
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
