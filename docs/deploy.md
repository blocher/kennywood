# Deploy Kennywood Waits (Cloudflare Pages)

Human steps required (API token / browser login). App build + `functions/api/queue-times.ts` are ready on the feature branch.

## One-time

1. Create a Cloudflare account (if needed): https://dash.cloudflare.com/sign-up
2. Create an API token with **Account → Cloudflare Pages → Edit** (or use `wrangler login`): https://dash.cloudflare.com/profile/api-tokens
3. From the repo:

```bash
npm install
npx wrangler login
# or: export CLOUDFLARE_API_TOKEN=...
```

## Deploy

```bash
npm run pages:deploy
```

This builds `dist/` and deploys with Pages Functions (same-origin `GET /api/queue-times`).

## Verify

- Open the printed `*.pages.dev` URL
- Board shows live waits
- DevTools → Network: waits come from `/api/queue-times` on the same origin (not `queue-times.com`)
- Footer attribution present
