# Queue-Times browser access (Kennywood park 312)

Research for [issue #2](https://github.com/blocher/kennywood/issues/2). Primary sources only: Queue-Times API docs, linked site pages, and live HTTP for park 312. Observed **2026-08-08** (UTC).

## Question

Hard constraints for calling Queue-Times’ Real Time API from a static Vite browser app for Kennywood (park id **312**).

## Sources

| Source | URL | Role |
| --- | --- | --- |
| Real Time API docs | https://queue-times.com/en-US/pages/api | Documented cadence, attribution, endpoints, example payload shape |
| Park list | https://queue-times.com/parks.json | Confirms Kennywood id 312 + timezone |
| Live queue times | https://queue-times.com/parks/312/queue_times.json | Live headers + Kennywood payload |
| Comparison park (docs example) | https://queue-times.com/parks/2/queue_times.json | Lands-vs-rides shape contrast |
| About | https://queue-times.com/en-US/pages/about | Linking / embedding preference |
| Privacy | https://queue-times.com/en-US/pages/privacy | Linked from site nav; no API terms beyond privacy |
| robots.txt | https://queue-times.com/robots.txt | No Disallow active |

No Terms / Terms of Service page is linked from the site nav. Direct paths such as `/en-US/pages/terms` returned **404** when probed (2026-08-08).

---

## Verdict (short)

1. **CORS blocks direct browser `fetch`** to `queue_times.json` from a Vite origin — responses omit `Access-Control-Allow-Origin`; preflight `OPTIONS` returns 404. API docs do not document a browser/CORS alternative.
2. **Upstream data refresh is every 5 minutes** (docs). Responses also advertise **`Cache-Control: max-age=60`**. A ~1 minute client poll matches cache TTL but is finer than the documented data cadence.
3. **Attribution requirement** on the API page: prominent “Powered by Queue-Times.com” linking to `https://queue-times.com/en-US`. Optional Patreon. No additional API Terms page found.
4. **Kennywood (312) uses flat `rides`** with empty `lands` (inverse of the docs’ Thorpe Park example).
5. **Closed Attractions** often have `wait_time: 0` and **stale `last_updated`** (hours old in the sample); open rides share a few recent UTC timestamps.

---

## CORS / browser access

### What the docs say

The API page documents free HTTP JSON endpoints (`/parks.json`, `/parks/{id}/queue_times.json`). It does **not** mention CORS, JSONP, authenticated keys, SDKs, or a browser-specific access path.

### What live HTTP shows (park 312)

Observed on `GET https://queue-times.com/parks/312/queue_times.json` (with and without `Origin: http://localhost:5173` / `https://example.com`):

- **Status**: `200`
- **Content-Type**: `application/json; charset=utf-8`
- **Cache-Control**: `max-age=60, public`
- **Age**: present (CDN/proxy age in seconds; e.g. values in the tens of seconds observed)
- **ETag**: weak ETag present (e.g. `W/"…"`)
- **`Access-Control-Allow-Origin`**: **absent**
- Other `Access-Control-*` headers: **absent**

`OPTIONS` with `Origin` + `Access-Control-Request-Method: GET` returned **404** (HTML), with no CORS grant headers.

**Implication for a static Vite SPA:** a same-origin page calling `fetch('https://queue-times.com/parks/312/queue_times.json')` will fail the browser CORS check (readable body blocked). Non-browser clients (curl, Node, CI) can still retrieve the JSON successfully — as this research did.

**Documented alternatives:** none on the API page. About page welcomes **linking** to the site and prefers **not embedding** the site in a page ([About](https://queue-times.com/en-US/pages/about)) — that is about embedding Queue-Times’ UI, not an alternate data API.

---

## Update cadence vs ~1 min refresh

| Claim | Source | Observation |
| --- | --- | --- |
| Data updated every **5 minutes** | API page: “These data are updated every 5 minutes.” | Normative cadence for the Real Time API |
| HTTP cache **60 seconds** | Live `Cache-Control: max-age=60, public` on park 312 | Intermediaries may serve the same body for up to ~1 minute |
| Per-ride `last_updated` | Live JSON; docs: timestamps are **UTC** | Open Kennywood rides clustered on two timestamps ~35s apart (`…T03:30:20.000Z`, `…T03:30:55.000Z` in the sample); closed rides shared an older stamp (`…T21:27:45.000Z` previous calendar day UTC) |

**Constraint for the product:** polling about once per minute while the tab is active is consistent with the **cache** TTL and does not contradict the API page, but **new wait values should not be expected more often than ~5 minutes**. More frequent polling mainly re-fetches the same cached/upstream snapshot.

No rate-limit, User-Agent, or API-key requirements appear on the API page.

---

## Attribution / terms

From the [API page](https://queue-times.com/en-US/pages/api):

- Access is **free**.
- **Required:** display the message **“Powered by Queue-Times.com”** that **links to** `https://queue-times.com/en-US` **somewhere prominent** in the app or service.
- **Optional:** sponsor on Patreon (`https://www.patreon.com/queue_times`).

From [About](https://queue-times.com/en-US/pages/about):

- Linking to the site is welcome; embedding the site in a page is discouraged (“I'd prefer if you didn't embed the site within your page”).

From [Privacy](https://queue-times.com/en-US/pages/privacy):

- Covers site analytics/cookies/ads for queue-times.com visitors; **no additional Real Time API usage terms** beyond what the API page states.

**No dedicated Terms page** was found linked from nav; probed `/en-US/pages/terms` (and similar) → **404**.

Footer copyright observed on pages: “© 2026 Queue Times Limited”.

---

## Payload quirks (park 312)

### Park identity

From `https://queue-times.com/parks.json` (2026-08-08): Kennywood is under group **“Parques Reunidos”**, `id: 312`, `timezone: "America/New_York"`, lat/long present.

### Shape: lands vs rides

API docs example (Thorpe Park) shows **`lands`** as an array of `{ id, name, rides: [...] }` and top-level **`rides`: `[]`**.

Live **park 312** (Kennywood), same response keys, inverted population:

```json
{
  "lands": [],
  "rides": [ /* flat list of ride objects */ ]
}
```

Live **park 2** (Thorpe Park) still matched the docs pattern at observation time: populated `lands`, empty top-level `rides`.

**Spec implication:** consumers must read Attractions from **`rides` and/or nested `lands[].rides`**, not assume the docs example’s land-only layout. For Kennywood today, the flat `rides` array is the live list.

### Ride object fields (observed)

Each ride object had exactly:

| Field | Example / notes |
| --- | --- |
| `id` | integer (e.g. `11031`) |
| `name` | string; may include Unicode (e.g. curly apostrophe in `Noah’s Ark`) and punctuation (`Pittsburg* Plunge`) |
| `is_open` | boolean |
| `wait_time` | integer minutes |
| `last_updated` | ISO-8601 UTC with millis, e.g. `2026-08-08T03:30:55.000Z` |

No land metadata on Kennywood rides (lands empty).

### Counts / open-closed (sample)

At observation: **20** rides; **15** `is_open: true`, **5** `is_open: false`.

Closed sample all had `wait_time: 0` and a shared older `last_updated`. Names included seasonal/holiday-style entries still present while closed (e.g. Gingerbread Express, Rudolph the Red-Nosed Reindeer Experience).

Open waits in the sample were in `{5,10,15,20,30,40}` — all positive; no open ride with `wait_time: 0` in this snapshot (do not treat that as a permanent invariant; only what was observed).

---

## Practical failure modes to name in the spec

Grounded in observed HTTP/docs (not an exhaustive SLA):

| Mode | Basis |
| --- | --- |
| **Browser CORS failure** | No `Access-Control-Allow-Origin` on live JSON; `OPTIONS` 404 → `fetch` from a Vite origin fails |
| **Stale per-Attraction timestamps** | Closed rides with `last_updated` many hours old while open rides are recent; board “freshness” should not assume one park-level clock |
| **Closed + zero wait** | Closed entries returned with `is_open: false`, `wait_time: 0` — still listed in the feed |
| **Empty `lands` / rely on wrong array** | Parsing only `lands` yields an empty Kennywood board |
| **Cached responses up to ~60s** | `max-age=60` — retries within a minute may see identical bodies/`Age` |
| **Data older than poll interval** | Documented 5-minute update cadence vs 1-minute UI refresh |
| **Non-ASCII / odd names** | Encoding and display must tolerate Unicode and special characters in `name` |
| **Network / non-200** | Not observed for park 312 in this session (always 200 for GET JSON), but any static app must still handle timeouts, DNS, and HTTP errors; API page does not document error schemas |
| **Empty feed** | Not observed for 312; both arrays can be empty in principle (`lands` already is) — worth treating as a distinct UI state |

`robots.txt` has no active `Disallow` (only commented examples). That does not grant browser CORS.

---

## Hard constraints summary (for product / later tickets)

1. **Direct browser calls to Queue-Times from a static Vite app are not viable under current CORS headers** unless Queue-Times changes responses or the app obtains the JSON through some other same-origin mechanism (not documented on the API page; out of scope to invent here).
2. Treat **5 minutes** as the meaningful wait-data freshness floor; **~1 minute** polling mainly aligns with `max-age=60`.
3. Ship **prominent** attribution: text “Powered by Queue-Times.com” → `https://queue-times.com/en-US`.
4. For park **312**, merge/read the **flat `rides`** list; keep a lands-aware parser for shape compatibility.
5. Spec failure UX should cover **CORS/network failure**, **stale `last_updated`**, **closed rows**, and **wrong-array / empty lists**.

---

## Citation log (raw observations)

- API docs text: Real Time API free; 5-minute updates; required Powered-by link to `https://queue-times.com/en-US`; example payload with `lands` + empty `rides`; timestamps UTC — https://queue-times.com/en-US/pages/api
- Live 312 GET: HTTP/2 200, `cache-control: max-age=60, public`, no ACAO, JSON body with `lands: []` and 20 flat `rides` — https://queue-times.com/parks/312/queue_times.json
- Live OPTIONS with CORS request headers: HTTP/2 404 — same URL
- Live park 2: lands populated, top-level `rides: []` — https://queue-times.com/parks/2/queue_times.json
- parks.json: Kennywood id 312, timezone `America/New_York`, group Parques Reunidos — https://queue-times.com/parks.json
- About embedding preference; Privacy with no API license addendum; terms paths 404 — as linked above
