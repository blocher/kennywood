import type { WaitFeed } from "./types";
import { waitLabel } from "./waitLabel";
import { joinBoardRows, rowMeta } from "./joinBoard";
import { applyChrome, type BoardChrome } from "./chrome";
import { ALL_RIDE_TYPES, applyFilters, type FilterState } from "./filters";
import { formatHeight } from "./heightFormat";
import type { Rider } from "./group";

export type BoardOptions = {
  stale?: boolean;
  statusOverride?: string | null;
  chrome?: BoardChrome;
  filters?: FilterState;
  filtersOpen?: boolean;
  groupOpen?: boolean;
  riders?: Rider[];
  selectedRiderIds?: Set<string>;
};

function statusText(feed: WaitFeed, opts: BoardOptions): string {
  if (opts.statusOverride) return opts.statusOverride;
  const mins = Math.max(0, Math.round((Date.now() - Date.parse(feed.fetchedAt)) / 60_000));
  const age =
    mins < 1 ? "Updated just now" : mins === 1 ? "Updated 1 min ago" : `Updated ${mins} min ago`;
  return opts.stale ? `${age} — may be stale` : age;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function filtersSheet(filters: FilterState): string {
  const chips = ALL_RIDE_TYPES.map((t) => {
    const on = filters.types.has(t);
    return `<label class="chip ${on ? "on" : ""}">
      <input type="checkbox" data-action="toggle-type" data-type="${t}" ${on ? "checked" : ""} />
      ${escapeHtml(t)}
    </label>`;
  }).join("");

  return `
    <div class="sheet-backdrop" data-action="close-filters"></div>
    <div class="sheet" role="dialog" aria-label="Filters">
      <header class="sheet-head">
        <h2>Filters</h2>
        <button type="button" data-action="close-filters">Close</button>
      </header>
      <div class="sheet-body">
        <fieldset>
          <legend>Wait (min)</legend>
          <label>Min <input type="range" min="0" max="120" value="${filters.waitMin}" data-action="wait-min" /></label>
          <label>Max <input type="range" min="0" max="120" value="${filters.waitMax}" data-action="wait-max" /></label>
          <p class="readout">${filters.waitMin} – ${filters.waitMax} min</p>
        </fieldset>
        <fieldset>
          <legend>Height range</legend>
          <label>Low <input type="range" min="0" max="84" value="${filters.heightMin}" data-action="height-min" /></label>
          <label>High <input type="range" min="0" max="84" value="${filters.heightMax}" data-action="height-max" /></label>
          <p class="readout">${formatHeight(filters.heightMin)} – ${formatHeight(filters.heightMax)}</p>
        </fieldset>
        <fieldset>
          <legend>Ride type</legend>
          <div class="chips">${chips}</div>
        </fieldset>
        <button type="button" class="btn-block" data-action="clear-filters">Clear filters</button>
      </div>
    </div>`;
}

function groupSheet(riders: Rider[], selected: Set<string>): string {
  if (riders.length === 0) {
    return `
      <div class="sheet-backdrop" data-action="close-group"></div>
      <div class="sheet" role="dialog" aria-label="Group">
        <header class="sheet-head">
          <h2>Group</h2>
          <button type="button" data-action="close-group">Close</button>
        </header>
        <div class="sheet-body">
          <form data-action="add-rider" class="rider-form">
            <label>First name <input name="name" required autocomplete="given-name" /></label>
            <label>Feet <input name="feet" type="number" min="0" max="8" value="4" required /></label>
            <label>Inches <input name="inches" type="number" min="0" max="11" value="0" required /></label>
            <button type="submit" class="primary btn-block">Add Rider</button>
          </form>
        </div>
      </div>`;
  }

  const list = riders
    .map((r) => {
      const on = selected.has(r.id);
      const ft = Math.floor(r.heightIn / 12);
      const inn = r.heightIn % 12;
      return `<div class="rider ${on ? "on" : ""}">
        <label>
          <input type="checkbox" data-action="toggle-rider" data-id="${r.id}" ${on ? "checked" : ""} />
          <span class="rider-name">${escapeHtml(r.name)}</span>
          <span class="rider-h">${ft}'${inn}"</span>
        </label>
        <button type="button" data-action="edit-rider" data-id="${r.id}">Edit</button>
        <button type="button" data-action="delete-rider" data-id="${r.id}">Delete</button>
      </div>`;
    })
    .join("");

  return `
    <div class="sheet-backdrop" data-action="close-group"></div>
    <div class="sheet" role="dialog" aria-label="Group">
      <header class="sheet-head">
        <h2>Group</h2>
        <button type="button" data-action="close-group">Close</button>
      </header>
      <div class="sheet-body">
        <p class="hint">Select riders to show only Attractions they all can ride.</p>
        ${list}
        <form data-action="add-rider" class="rider-form">
          <label>First name <input name="name" required autocomplete="given-name" /></label>
          <label>Feet <input name="feet" type="number" min="0" max="8" value="4" required /></label>
          <label>Inches <input name="inches" type="number" min="0" max="11" value="0" required /></label>
          <button type="submit" class="primary btn-block">Add Rider</button>
        </form>
      </div>
    </div>`;
}

/** Render Variant A stadium scoreboard from a WaitFeed joined to the catalog. */
export function renderBoard(feed: WaitFeed, opts: BoardOptions = {}): string {
  const chrome = opts.chrome ?? { sort: "wait" as const, hideClosed: false };
  const filters = opts.filters;
  const selected = opts.selectedRiderIds ?? new Set<string>();
  const riders = opts.riders ?? [];

  let joined = joinBoardRows(feed.attractions);
  if (filters) joined = applyFilters(joined, filters);
  // Eligibility: all selected riders must fit
  if (selected.size > 0) {
    const chosen = riders.filter((r) => selected.has(r.id));
    joined = joined.filter((row) => {
      if (row.heightUnknown || row.envelopeMinIn == null) return true;
      const envMax = row.envelopeMaxIn ?? Number.POSITIVE_INFINITY;
      return chosen.every((r) => r.heightIn >= row.envelopeMinIn! && r.heightIn <= envMax);
    });
  }
  const rows = applyChrome(joined, chrome).map((a) => {
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
      ? `<li class="empty">No Attractions match <button type="button" data-action="clear-filters">Clear filters</button></li>`
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
          <button type="button" data-action="open-group">Group${selected.size ? ` (${selected.size})` : ""}</button>
          <button type="button" class="primary" data-action="open-filters">Filters</button>
        </div>
      </header>
      <ul class="list">${empty}</ul>
      <p class="attribution">
        Powered by
        <a href="https://queue-times.com/en-US" target="_blank" rel="noopener noreferrer">Queue-Times.com</a>
      </p>
      ${opts.filtersOpen && filters ? filtersSheet(filters) : ""}
      ${opts.groupOpen ? groupSheet(riders, selected) : ""}
    </div>`;
}
