# Kennywood wait-source provenance and legacy-API confirmation

**Observed:** 2026-08-30 (America/New_York)  
**Scope:** Follow-up to the [shared ChatGPT investigation](https://chatgpt.com/share/6a94813c-bc30-83ea-b8c1-4a6c09ed3101). The conversation defines the hypothesis; it is not evidence for it.

## Question

What do the app's two wait values currently represent, and how can we authoritatively confirm or reject the theory that Queue-Times' Kennywood collector still uses the retired StayApp API?

## Verdict

The evidence already proves that **two materially different live Kennywood datasets exist**:

- ThemeParks.wiki follows Herschend's Pulse wait-time system.
- Queue-Times publishes a different set of current values for the same Attractions.

The evidence does **not** yet prove that Queue-Times obtains its values from the old StayApp endpoint. Queue-Times does not disclose the upstream endpoint in its public JSON, and its collector implementation is not public. Exact agreement between Queue-Times, StayApp, and the in-park signs would prove a shared data lineage, but not necessarily that Queue-Times calls StayApp directly; literal endpoint use requires confirmation from Queue-Times or collector request logs/source.

Accordingly, the product may describe the two observable values as **Posted in Park** and **Listed in App**, based on the field observation that motivated this research, but should not say “old API” or “StayApp” as an established fact yet.

## Confirmed facts

### The current official app belongs to Herschend

Kennywood calls the current product “The Official Kennywood App,” says it provides wait-time alerts and real-time updates, and links its app-store listings from its own site ([Kennywood app page](https://www.kennywood.com/kennywood-app/)). Apple's first-party listing identifies the seller as Herschend Family Entertainment Corporation and advertises real-time wait times ([Apple App Store](https://apps.apple.com/us/app/kennywood/id6754702234)).

This establishes who operates the current official app. It does not, by itself, establish the exact API request the app makes.

### ThemeParks.wiki deliberately moved Kennywood from StayApp to Herschend Pulse

ThemeParks.wiki's open-source backend changed Kennywood on 2026-03-27. The commit says Kennywood uses the Herschend API, “not StayApp,” and removes Kennywood from the Parcs Reunidos adapter ([commit `ca8c6b6`](https://github.com/ThemeParks/parksapi/commit/ca8c6b68645fd0cce5f518ebb8dcb9516d6847b1)). The immediately preceding source shows Kennywood registered under the StayApp-backed Parcs Reunidos class ([pre-migration source](https://github.com/ThemeParks/parksapi/blob/bf16bfc83aa6e4449a2295a70e6afbed52fd3132/src/parks/parcsreunidos/parcsreunidos.ts#L573-L583)).

Current ThemeParks source:

- sends `User-Agent: okhttp/5.1.0` to Pulse ([source](https://github.com/ThemeParks/parksapi/blob/f9055592166b465945e055c49db0b15bee027f90/src/parks/hfe/hfe.ts#L222-L242));
- requests `/api/waitTimes/{waitTimeDestId}` and caches it for 60 seconds ([source](https://github.com/ThemeParks/parksapi/blob/f9055592166b465945e055c49db0b15bee027f90/src/parks/hfe/hfe.ts#L275-L286)); and
- identifies Kennywood's Pulse destination as `701` ([source](https://github.com/ThemeParks/parksapi/blob/f9055592166b465945e055c49db0b15bee027f90/src/parks/hfe/hfe.ts#L827-L844)).

The resulting official-backend endpoint is:

```text
GET https://pulse.hfecorp.com/api/waitTimes/701
User-Agent: okhttp/5.1.0
```

It requires no API key, cookie, bearer token, device identifier, or user login. At observation time it returned HTTP 200 JSON with `rideId`, `rideName`, `operationStatus`, `waitTime`, `waitTimeDisplay`, and millisecond `waitTimeDate`. Generic browser/curl user agents could receive an Akamai 403, so the app-shaped user agent is part of a reproducible request even though it is not authentication.

### A synchronized live sample separates the two datasets

At approximately 2026-08-30 15:20 EDT, these three endpoints were requested together:

- [Herschend Pulse 701](https://pulse.hfecorp.com/api/waitTimes/701)
- [ThemeParks.wiki Kennywood live data](https://api.themeparks.wiki/v1/entity/1dea1b67-0d06-4ad2-9145-8fc1783fd4e8/live)
- [Queue-Times Kennywood park 312](https://queue-times.com/parks/312/queue_times.json)

After normalizing names and comparing non-null waits:

| Comparison | Shared Attractions | Exact wait matches |
| --- | ---: | ---: |
| Pulse vs ThemeParks.wiki | 31 | 31 |
| Pulse vs Queue-Times | 14 | 1 |
| ThemeParks.wiki vs Queue-Times | 14 | 1 |

Representative values from the same capture:

| Attraction | Pulse | ThemeParks.wiki | Queue-Times |
| --- | ---: | ---: | ---: |
| Jack Rabbit | 60 | 60 | 45 |
| Old Mill | 60 | 60 | 30 |
| Racer | 45 | 45 | 30 |
| Steel Curtain | 60 | 60 | 40 |
| Turtle | 10 | 10 | 35 |

Queue-Times' rows carried fresh timestamps around 15:15 EDT, so those large differences cannot be explained merely by comparing a current Pulse response with a long-expired Queue-Times snapshot. This observation confirms different live datasets. It does not identify Queue-Times' upstream.

A minimal Pulse reproduction is:

```sh
curl --compressed \
  -H 'User-Agent: okhttp/5.1.0' \
  'https://pulse.hfecorp.com/api/waitTimes/701'
```

### The retired StayApp API and wait field still have a reproducible contract

ThemeParks.wiki's StayApp adapter documents and implements the old mechanics:

- `Authorization: Bearer …` and `Stay-Establishment: …` headers ([source](https://github.com/ThemeParks/parksapi/blob/f9055592166b465945e055c49db0b15bee027f90/src/parks/parcsreunidos/parcsreunidos.ts#L145-L175));
- `GET /api/v1/service/attraction` ([source](https://github.com/ThemeParks/parksapi/blob/f9055592166b465945e055c49db0b15bee027f90/src/parks/parcsreunidos/parcsreunidos.ts#L181-L205)); and
- each Attraction's `waitingTime` converted into a standby wait when non-negative ([source](https://github.com/ThemeParks/parksapi/blob/f9055592166b465945e055c49db0b15bee027f90/src/parks/parcsreunidos/parcsreunidos.ts#L384-L423)).

The current adapter extracts the shared client bearer from StayApp's publicly served Weex bundle rather than performing a user-login exchange ([commit `d76725a`](https://github.com/ThemeParks/parksapi/commit/d76725a004414b5fb454886f8b5c15a736e5c2e4)). The active bearer must be treated as sensitive operational material and must not be committed, logged, or reproduced in documentation.

The host is still live. On 2026-08-30, an unauthenticated request to [the attraction endpoint](https://api-manager.stay-app.com/api/v1/service/attraction) returned HTTP 401 rather than DNS failure or 404. That confirms the API route still exists, but not that Kennywood's retired tenant still returns current values.

### Queue-Times does not disclose park 312's upstream

Queue-Times says its wait times are the values “published officially by the park” ([About](https://queue-times.com/en-US/pages/about)) and documents its public five-minute API ([API](https://queue-times.com/en-US/pages/api)). Its park 312 response contains only normalized ride records; it does not identify the collector host or endpoint.

Therefore none of Queue-Times' public pages or responses confirms that park 312 currently polls StayApp.

## Confirmed, inferred, and unknown

| Claim | Status | Evidence needed to advance it |
| --- | --- | --- |
| ThemeParks.wiki's Kennywood waits come from Pulse 701 | Confirmed | Current source plus synchronized exact-value sample |
| Pulse represents the current Herschend system | Confirmed | Herschend endpoint, ThemeParks migration source, current Herschend app ownership |
| The current official app displays Pulse values | Strongly supported, not directly captured here | Capture the app's actual network request while refreshing waits |
| Queue-Times represents a dataset distinct from Pulse | Confirmed | Same-minute responses with 13 of 14 common waits different |
| Queue-Times matches physical in-park signs | User field observation | Timestamped sign photographs plus same-minute raw Queue-Times capture |
| Kennywood's old StayApp tenant still receives current waits | Unknown | Recover the retired tenant identifiers and query it during park operation |
| Queue-Times directly calls the old StayApp API | Unknown | Queue-Times maintainer confirmation, collector source, or request logs |
| Queue-Times and StayApp share the signage system upstream | Testable hypothesis | Repeated synchronized value and transition matching |

## Authoritative confirmation procedure

### 1. Ask the source owner first

Contact Queue-Times through its [official contact page](https://queue-times.com/en-US/pages/contact) and ask one narrow, falsifiable question:

> For Kennywood park 312, does the collector currently obtain waits from `api-manager.stay-app.com/api/v1/service/attraction`, or from another endpoint? We do not need credentials; the upstream host/path and whether it is the retired StayApp integration are sufficient.

A written answer from Queue-Times' operator is the quickest authoritative confirmation of **direct endpoint use**. Preserve the response and date in this note.

### 2. Recover the retired app configuration without publishing credentials

Obtain an official pre-migration Android artifact for package `com.mobail.kennywood`—a build that still contains the actual StayApp client, not the later “we have moved” redirect shell.

For evidentiary integrity:

1. Record the artifact's SHA-256, version/version code, acquisition URL, and timestamp.
2. Verify the APK signing certificate and package name against another known official build or a trusted store record.
3. Extract only Kennywood's tenant `appId`, `Stay-Establishment` identifier, and public bundle URL.
4. Do not publish or commit an active bearer. Resolve it only at request time from the same public bundle mechanism used by the open-source StayApp adapter.
5. Store raw response bodies outside the repository if they contain operational tokens or headers; commit only redacted results.

The readily available 1.0.4 Android artifact inspected during this research is only a deprecation/redirect shell pointing to `com.kennywood.app`; it cannot supply the retired tenant configuration. An earlier build or the Queue-Times maintainer's answer is required.

### 3. Directly capture the current official app request

During an operating day, use a device-level proxy such as Proxyman, Charles, or mitmproxy on a test device, open the official app's wait-time screen, and save a HAR or equivalent trace. Record:

- app package and version;
- request URL, method, and non-secret headers;
- response timestamp and body;
- whether certificate pinning prevented inspection.

If the app calls `pulse.hfecorp.com/api/waitTimes/701`, that closes the last inference in the “Listed in App” lineage. Do not bypass certificate pinning on a device/account without authorization; if pinning blocks inspection, a Herschend engineering confirmation is the appropriate alternative.

### 4. Run a synchronized in-park comparison

On an operating day, sample every 1–2 minutes for at least 30 minutes and include several moments when values change. At each sample, preserve:

1. legacy StayApp response, if the retired tenant can be queried;
2. Pulse 701 response;
3. ThemeParks.wiki response;
4. Queue-Times park 312 response;
5. official-app screenshot; and
6. photograph of the corresponding physical sign with a visible synchronized clock or an immediately adjacent timestamped phone screen.

Use a fixed ride-name/ID mapping and compare not only values but **transitions and source timestamps**. Matching a single rounded value is weak; repeated, same-order changes across many Attractions are a strong fingerprint.

Interpret the outcome precisely:

- `Pulse = ThemeParks.wiki = official app` proves that product label's lineage.
- `StayApp = Queue-Times = physical signs` across multiple changes strongly proves a shared operational lineage.
- It still does not prove Queue-Times calls StayApp directly if both could consume a common upstream. Only maintainer confirmation, collector source, or request logs prove the literal call path.
- If Queue-Times matches signs but not StayApp, the theory is falsified in its narrow form and the signage has another upstream.

## Product wording supported now

The defensible user-facing explanation is:

- **Listed in App** — the value carried by the current Herschend wait-time system and exposed through ThemeParks.wiki.
- **Posted in Park** — the separate value observed on Kennywood's physical wait displays and exposed through Queue-Times.

Until the procedure above closes the final link, describe the Queue-Times/legacy connection as an investigation or hypothesis, not as fact. Also avoid calling either value inherently “correct”: they are two official-facing estimates from a split data environment, and the labels should say where a guest encounters each one.
