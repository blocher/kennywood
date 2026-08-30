/** Live Wait data providers for Kennywood. */
export type WaitSource = "themeparks" | "queue-times";

export const DEFAULT_WAIT_SOURCE: WaitSource = "themeparks";
export const POSTED_WAIT_SOURCE: WaitSource = "queue-times";
export const OFFICIAL_APP_WAIT_SOURCE: WaitSource = "themeparks";

export function parseWaitSource(raw: string | null | undefined): WaitSource {
  return raw === "queue-times" ? "queue-times" : "themeparks";
}

/** Explain the two user-facing Wait values and the normalized data behind them. */
export function renderDataSources(): string {
  return `
    <section class="data-sources" aria-labelledby="data-sources-title">
      <h2 id="data-sources-title">Data sources</h2>
      <div class="data-quick">
        <p><strong>Posted in Park</strong> usually matches the physical signs. <a href="https://queue-times.com/en-US" target="_blank" rel="noopener noreferrer">Powered by Queue-Times.com</a>.</p>
        <p><strong>Listed in App</strong> is the Herschend wait shown in Kennywood's app, delivered through <a href="https://themeparks.wiki/" target="_blank" rel="noopener noreferrer">ThemeParks.wiki</a>.</p>
      </div>
      <details class="data-details">
        <summary>Read more about the data</summary>
        <div class="data-details-body">
          <article>
            <h3>Posted in Park</h3>
            <p>
              This is the Queue-Times <a href="https://queue-times.com/en-US/pages/api" target="_blank" rel="noopener noreferrer">Real Time API</a>
              endpoint <a href="https://queue-times.com/parks/312/queue_times.json" target="_blank" rel="noopener noreferrer"><code>/parks/312/queue_times.json</code></a>
              for Kennywood park 312. It supplies Attraction id, name, open/closed state, wait minutes,
              and last-updated time. In-person comparisons find that it usually matches the physical
              signs, but Queue-Times does not disclose its upstream Kennywood source. That connection
              is observed, not yet confirmed.
            </p>
          </article>
          <article>
            <h3>Listed in App</h3>
            <p>
              This is ThemeParks.wiki's <a href="https://api.themeparks.wiki/v1/entity/${THEMEPARKS_KENNYWOOD_ID}/live" target="_blank" rel="noopener noreferrer">Kennywood live-data API</a>.
              It supplies Attraction status, standby wait minutes, and last-updated time. Its
              <a href="https://github.com/ThemeParks/parksapi/blob/main/src/parks/hfe/hfe.ts" target="_blank" rel="noopener noreferrer">Kennywood adapter</a>
              reads Herschend Pulse at <a href="https://pulse.hfecorp.com/api/waitTimes/701" target="_blank" rel="noopener noreferrer"><code>/api/waitTimes/701</code></a>,
              matching the value observed in Kennywood's current app.
            </p>
          </article>
          <p class="data-underlying">
            This board fetches both feeds about every five minutes, normalizes their fields, and
            matches Attractions by provider id and normalized name. Ride type, Land, and Height filter
            details come from this app's hand-maintained Attraction catalog. The waits can differ
            because they pass through separate publishing systems; neither provider documents
            Kennywood's internal update process or estimation method.
          </p>
        </div>
      </details>
    </section>`;
}

/** Kennywood destination entity on ThemeParks.wiki. */
export const THEMEPARKS_KENNYWOOD_ID = "1dea1b67-0d06-4ad2-9145-8fc1783fd4e8";
