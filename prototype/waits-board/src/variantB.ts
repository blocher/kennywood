import type { Attraction } from "./data";
import type { ProtoState } from "./state";
import {
  attribution,
  filtersSheet,
  groupSheet,
  metaLine,
  statusLine,
  waitLabel,
} from "./shared";

/** B — Poster stack: each Attraction is a full-bleed poster; wait as a stamp. */
export const VARIANT_NAME = "B — Poster stack";

export function render(list: Attraction[], s: ProtoState): string {
  const cards = list
    .map(
      (a) => `
      <article class="b-card ${a.isOpen ? "" : "closed"}">
        <p class="b-meta">${metaLine(a)}</p>
        <h2 class="b-name">${a.name}</h2>
        <div class="b-stamp">
          <span class="b-label">${a.isOpen ? "WAIT" : ""}</span>
          <span class="b-wait">${waitLabel(a)}</span>
          ${a.isOpen ? `<span class="b-unit">min</span>` : ""}
        </div>
      </article>`,
    )
    .join("");

  return `
    <div class="variant-b">
      <header class="b-top">
        <p class="b-kicker">Kennywood</p>
        <h1>Waits</h1>
        <p class="status">${statusLine()}</p>
        <div class="b-toolbar">
          <button type="button" data-action="toggle-sort">${s.sort === "wait" ? "Shortest" : "A–Z"}</button>
          <button type="button" data-action="toggle-closed">${s.hideClosed ? "Hide closed ✓" : "Hide closed"}</button>
          <button type="button" data-action="open-group">Group</button>
          <button type="button" data-action="open-filters">Filters</button>
        </div>
      </header>
      <div class="b-stack">${cards || `<p class="empty">No Attractions match <button type="button" data-action="clear-filters">Clear filters</button></p>`}</div>
      ${attribution()}
      ${s.filtersOpen ? filtersSheet(s) : ""}
      ${s.groupOpen ? groupSheet(s) : ""}
    </div>`;
}
