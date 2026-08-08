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

/** C — Meter strip: proportional wait bars, dense phone list, chrome as chip rail. */
export const VARIANT_NAME = "C — Meter strip";

function barWidth(a: Attraction): number {
  if (!a.isOpen) return 0;
  return Math.min(100, (a.waitMinutes / 90) * 100);
}

export function render(list: Attraction[], s: ProtoState): string {
  const rows = list
    .map(
      (a) => `
      <li class="c-row ${a.isOpen ? "" : "closed"}">
        <div class="c-bar" style="width:${barWidth(a)}%"></div>
        <div class="c-content">
          <span class="c-name">${a.name}</span>
          <span class="c-meta">${metaLine(a)}</span>
        </div>
        <span class="c-wait">${waitLabel(a)}${a.isOpen ? "<small>m</small>" : ""}</span>
      </li>`,
    )
    .join("");

  return `
    <div class="variant-c">
      <header class="c-top">
        <h1>Kennywood Waits</h1>
        <p class="status">${statusLine()}</p>
      </header>
      <nav class="c-rail" aria-label="Board controls">
        <button type="button" class="chip-btn ${s.sort === "wait" ? "on" : ""}" data-action="toggle-sort">Sort: ${s.sort === "wait" ? "wait" : "alpha"}</button>
        <button type="button" class="chip-btn ${s.hideClosed ? "on" : ""}" data-action="toggle-closed">Hide closed</button>
        <button type="button" class="chip-btn" data-action="open-group">Group${s.selectedRiderIds.size ? ` (${s.selectedRiderIds.size})` : ""}</button>
        <button type="button" class="chip-btn on" data-action="open-filters">Filters</button>
      </nav>
      <ul class="c-list">${rows || `<li class="empty">No Attractions match <button type="button" data-action="clear-filters">Clear filters</button></li>`}</ul>
      ${attribution()}
      ${s.filtersOpen ? filtersSheet(s) : ""}
      ${s.groupOpen ? groupSheet(s) : ""}
    </div>`;
}
