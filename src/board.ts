import type { WaitFeed } from "./types";
import { waitLabel } from "./waitLabel";
import { joinBoardRows, rowMeta } from "./joinBoard";
import { applyChrome, type BoardChrome } from "./chrome";
import { applyFilters, type FilterState } from "./filters";
import { formatHeight } from "./heightFormat";
import type { Rider } from "./group";
import { renderTypeFilterChips, renderTypeQuick } from "./typeQuick";
import {
  WAIT_SOURCES,
  attributionFor,
  type WaitSource,
  DEFAULT_WAIT_SOURCE,
} from "./sources";

export type BoardOptions = {
  stale?: boolean;
  statusOverride?: string | null;
  chrome?: BoardChrome;
  filters?: FilterState;
  filtersOpen?: boolean;
  groupOpen?: boolean;
  riders?: Rider[];
  selectedRiderIds?: Set<string>;
  source?: WaitSource;
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

function dualRange(opts: {
  legend: string;
  min: number;
  max: number;
  lo: number;
  hi: number;
  loAction: string;
  hiAction: string;
  readout: string;
}): string {
  const span = opts.max - opts.min || 1;
  const left = ((opts.lo - opts.min) / span) * 100;
  const right = ((opts.hi - opts.min) / span) * 100;
  return `
    <fieldset class="range-field">
      <legend>${opts.legend}</legend>
      <p class="readout" data-readout>${opts.readout}</p>
      <div class="dual-range" style="--lo:${left}%; --hi:${right}%;">
        <div class="dual-track" aria-hidden="true"></div>
        <input type="range" min="${opts.min}" max="${opts.max}" value="${opts.lo}"
          data-action="${opts.loAction}" data-bound="lo" aria-label="${opts.legend} minimum" />
        <input type="range" min="${opts.min}" max="${opts.max}" value="${opts.hi}"
          data-action="${opts.hiAction}" data-bound="hi" aria-label="${opts.legend} maximum" />
      </div>
    </fieldset>`;
}

function filtersSheet(filters: FilterState, source: WaitSource): string {
  const sourceOptions = WAIT_SOURCES.map(
    (s) => `
      <label class="source-option ${source === s.id ? "on" : ""}">
        <input type="radio" name="wait-source" data-action="set-source" value="${s.id}" ${
          source === s.id ? "checked" : ""
        } />
        <span class="source-copy">
          <span class="source-label">${escapeHtml(s.label)}</span>
          <span class="source-hint">${escapeHtml(s.hint)}</span>
        </span>
      </label>`,
  ).join("");

  return `
    <div class="sheet-backdrop" data-action="close-filters"></div>
    <div class="sheet" role="dialog" aria-label="Filters">
      <header class="sheet-head">
        <h2>Filters</h2>
        <button type="button" data-action="close-filters">Close</button>
      </header>
      <div class="sheet-body">
        <fieldset>
          <legend>Data source</legend>
          <div class="source-list" role="radiogroup" aria-label="Wait data source">${sourceOptions}</div>
        </fieldset>
        ${dualRange({
          legend: "Wait (min)",
          min: 0,
          max: 120,
          lo: filters.waitMin,
          hi: filters.waitMax,
          loAction: "wait-min",
          hiAction: "wait-max",
          readout: `${filters.waitMin} – ${filters.waitMax} min`,
        })}
        ${dualRange({
          legend: "Height range",
          min: 0,
          max: 84,
          lo: filters.heightMin,
          hi: filters.heightMax,
          loAction: "height-min",
          hiAction: "height-max",
          readout: `${formatHeight(filters.heightMin)} – ${formatHeight(filters.heightMax)}`,
        })}
        <fieldset>
          <legend>Ride type</legend>
          ${renderTypeFilterChips(filters)}
        </fieldset>
        <button type="button" class="btn-block" data-action="clear-filters">Clear filters</button>
      </div>
    </div>`;
}

function addRiderForm(): string {
  return `
    <div class="add-person">
      <h3>Add a person</h3>
      <form data-action="add-rider" class="rider-form">
        <label>First name <input name="name" required autocomplete="given-name" /></label>
        <div class="height-row">
          <label>Feet <input name="feet" type="number" min="0" max="8" value="4" required /></label>
          <label>Inches <input name="inches" type="number" min="0" max="11" value="0" required /></label>
        </div>
        <button type="submit" class="primary btn-block">Add Rider</button>
      </form>
    </div>`;
}

function groupSheet(riders: Rider[], selected: Set<string>): string {
  const list =
    riders.length === 0
      ? `<p class="hint">No one in your Group yet.</p>`
      : `<p class="hint">Select riders to show only Attractions they all can ride.</p>
        ${riders
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
          .join("")}`;

  return `
    <div class="sheet-backdrop" data-action="close-group"></div>
    <div class="sheet" role="dialog" aria-label="Group">
      <header class="sheet-head">
        <h2>Group</h2>
        <button type="button" data-action="close-group">Close</button>
      </header>
      <div class="sheet-body">
        ${list}
        ${addRiderForm()}
      </div>
    </div>`;
}

/** Render Variant A stadium scoreboard from a WaitFeed joined to the catalog. */
export function renderBoard(feed: WaitFeed, opts: BoardOptions = {}): string {
  const chrome = opts.chrome ?? { sort: "wait" as const, hideClosed: false };
  const filters = opts.filters;
  const selected = opts.selectedRiderIds ?? new Set<string>();
  const riders = opts.riders ?? [];
  const source = opts.source ?? feed.source ?? DEFAULT_WAIT_SOURCE;
  const credit = attributionFor(source);

  let joined = joinBoardRows(feed.attractions, source);
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
    const closed = !a.isOpen && !a.waitUnknown ? " closed" : "";
    const nowait = a.waitUnknown ? " nowait" : "";
    return `
        <li class="row${closed}${nowait}">
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

  const typeQuick = filters ? renderTypeQuick(filters) : "";

  return `
    <div class="board">
      <header class="top">
        <div class="top-main">
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
        </div>
        ${typeQuick}
      </header>
      <ul class="list">${empty}</ul>
      <p class="attribution">
        Powered by
        <a href="${escapeHtml(credit.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(credit.text)}</a>
      </p>
      ${opts.filtersOpen && filters ? filtersSheet(filters, source) : ""}
      ${opts.groupOpen ? groupSheet(riders, selected) : ""}
    </div>`;
}
