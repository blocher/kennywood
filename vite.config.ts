import { defineConfig, type Plugin } from "vite";
import { normalizeQueueTimes, type QueueTimesPayload } from "./src/normalizeQueueTimes";
import { normalizeThemeParks, themeParksLiveUrl } from "./src/normalizeThemeParks";
import { parseWaitSource } from "./src/sources";

const QT_UPSTREAM = "https://queue-times.com/parks/312/queue_times.json";

/** Dev-only same-origin /api/waits (+ legacy /api/queue-times) mirroring Cloudflare Functions. */
function waitsDevProxy(): Plugin {
  return {
    name: "kennywood-waits-dev-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== "/api/waits" && path !== "/api/queue-times") return next();

        const url = new URL(req.url ?? "/", "http://dev.local");
        const source =
          path === "/api/queue-times" ? "queue-times" : parseWaitSource(url.searchParams.get("source"));

        try {
          if (source === "queue-times") {
            const upstream = await fetch(QT_UPSTREAM, { headers: { Accept: "application/json" } });
            if (!upstream.ok) {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: `Queue-Times returned ${upstream.status}` }));
              return;
            }
            const payload = (await upstream.json()) as QueueTimesPayload;
            const feed = normalizeQueueTimes(payload, new Date().toISOString());
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.setHeader("Cache-Control", "public, max-age=60");
            res.end(JSON.stringify(feed));
            return;
          }

          const upstream = await fetch(themeParksLiveUrl(), {
            headers: { Accept: "application/json", "User-Agent": "kennywood-waits/0.1" },
          });
          if (!upstream.ok) {
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: `ThemeParks.wiki returned ${upstream.status}` }));
            return;
          }
          const payload = await upstream.json();
          const feed = normalizeThemeParks(payload, new Date().toISOString());
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "public, max-age=60");
          res.end(JSON.stringify(feed));
        } catch (e) {
          res.statusCode = 504;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: e instanceof Error ? e.message : "Proxy failure" }));
        }
      });
    },
  };
}

export default defineConfig({
  root: ".",
  publicDir: "public",
  plugins: [waitsDevProxy()],
  test: {
    environment: "node",
  },
});
