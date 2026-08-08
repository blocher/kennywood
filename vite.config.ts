import { defineConfig, type Plugin } from "vite";
import { normalizeQueueTimes, type QueueTimesPayload } from "./src/normalizeQueueTimes";

const UPSTREAM = "https://queue-times.com/parks/312/queue_times.json";

/** Dev-only same-origin /api/queue-times mirroring the Cloudflare Function. */
function queueTimesDevProxy(): Plugin {
  return {
    name: "kennywood-queue-times-dev-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== "/api/queue-times") return next();
        try {
          const upstream = await fetch(UPSTREAM, { headers: { Accept: "application/json" } });
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
  plugins: [queueTimesDevProxy()],
  test: {
    environment: "node",
  },
});
