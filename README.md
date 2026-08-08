# Kennywood Waits

Phone-first live Wait times for Kennywood (Queue-Times park 312).

## Develop

```bash
npm install
npm test
npm run dev
```

`npm run dev` serves the SPA and a same-origin **`GET /api/queue-times`** proxy (mirrors the Cloudflare Pages Function under `functions/api/queue-times.ts`).

## Spec

See [SPEC: Kennywood Waits v1](https://github.com/blocher/kennywood/issues/8).
