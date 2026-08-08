# Kennywood Waits

Phone-first live Wait times for Kennywood (ThemeParks.wiki by default; Queue-Times optional).

## Develop

```bash
npm install
npm test
npm run dev
```

`npm run dev` serves the SPA and same-origin **`GET /api/waits?source=themeparks|queue-times`** (mirrors `functions/api/waits.ts`). The client polls about every **5 minutes** (ThemeParks.wiki’s documented live-data cadence).

### ThemeParks.wiki API key

Live waits work without a key. Limits are **300 requests / 5 minutes**, counted **per API key if sent, otherwise per IP**. Docs do not advertise a higher ceiling for keys — the win is a dedicated bucket for this app (not shared with other IPs).

1. Create a key in your [ThemeParks.wiki](https://themeparks.wiki/) profile.
2. Local: copy `.env.example` → `.env` and `.dev.vars` with `THEMEPARKS_API_KEY=…` (both gitignored).
3. Production: `printf '%s' 'YOUR_KEY' | npx wrangler pages secret put THEMEPARKS_API_KEY --project-name=kennywood-waits`

The proxy sends it as `x-api-key` only to ThemeParks.wiki. Successful `/api/waits` responses are stored in the Cloudflare Cache API for **5 minutes**, so many browsers share one upstream fetch per edge (not one fetch per visitor).

## Spec

See [SPEC: Kennywood Waits v1](https://github.com/blocher/kennywood/issues/8).
