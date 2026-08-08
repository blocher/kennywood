import type { WaitFeed } from "./types";
import { waitLabel } from "./waitLabel";
import { joinBoardRows, rowMeta } from "./joinBoard";
import { applyChrome, type BoardChrome } from "./chrome";

export type BoardOptions = {
  stale?: boolean;
  statusOverride?: string | null;
  chrome?: BoardChrome;
};

function statusText(feed: WaitFeed, opts: BoardOptions): string {
  if (opts.statusOverride) return opts.statusOverride;
  const mins = Math.max(0, Math.round((Date.now() - Date.parse(feed.fetchedAt)) / 60_000));
  const age =
    mins < 1 ? "Updated just now" : mins === 1 ? "Updated 1 min ago" : `Updated ${mins} min ago`;
  return opts.stale ? `${age} — may be stale` : age;
}

/** Render Variant A stadium scoreboard from a WaitFeed joined to the catalog. */
export function renderBoard(feed: WaitFeed, opts: BoardOptions = {}): string {
  const chrome = opts.chrome ?? { sort: "wait" as const, hideClosed: false };
  const rows = applyChrome(joinBoardRows(feed.attractions), chrome).map((a) => {
    const label = waitLabel(a);
    const closed = a.isOpen ? "" : " closed";
    return `
        <li class="row${closed}">
          <div class="main">
            <span class="name">${escapeHtml(a.name)}</span>
            <span class="meta">${escapeHtml(rowMeta(a))}</span>
          </div>
          <span class="wait" aria-label="Wait ${label}">${label}</span>
        </li>`;
  });

  const empty =
    rows.length === 0
      ? `<li class="empty">No Attractions match</li>`
      : rows.join("");

  return `
    <div class="board">
      <header class="top">
        <div>
          <h1>Kennywood Waits</h1>
          <p class="status" role="status">${escapeHtml(statusText(feed, opts))}</p>
        </div>
        <div class="actions">
          <button type="button" data-action="toggle-sort">${chrome.sort === "wait" ? "Wait ↑" : "A–Z"}</button>
          <button type="button" data-action="toggle-closed">${chrome.hideClosed ? "Closed hidden" : "Hide closed"}</button>
          <button type="button" disabled>Group</button>
          <button type="button" class="primary" disabled>Filters</button>
        </div>
      </header>
      <ul class="list">${empty}</ul>
      <p class="attribution">
        Powered by
        <a href="https://queue-times.com/en-US" target="_blank" rel="noopener noreferrer">Queue-Times.com</a>
      </p>
    </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
