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

/** A — Stadium scoreboard: name left, huge wait right, amber on black. */
export const VARIANT_NAME = "A — Stadium scoreboard";

export function render(list: Attraction[], s: ProtoState): string {
  const rows = list
    .map(
      (a) => `
      <li class="a-row ${a.isOpen ? "" : "closed"}">
        <div class="a-main">
          <span class="a-name">${a.name}</span>
          <span class="a-meta">${metaLine(a)}</span>
        </div>
        <span class="a-wait" aria-label="Wait ${waitLabel(a)}">${waitLabel(a)}</span>
      </li>`,
    )
    .join("");

  return `
    <div class="variant-a">
      <header class="a-top">
        <div>
          <h1>Kennywood Waits</h1>
          <p class="status">${statusLine()}</p>
        </div>
        <div class="a-actions">
          <button type="button" data-action="toggle-sort">${s.sort === "wait" ? "Wait ↑" : "A–Z"}</button>
          <button type="button" data-action="toggle-closed">${s.hideClosed ? "Closed hidden" : "Show closed"}</button>
          <button type="button" data-action="open-group">Group</button>
          <button type="button" class="primary" data-action="open-filters">Filters</button>
        </div>
      </header>
      <ul class="a-list">${rows || `<li class="empty">No Attractions match <button type="button" data-action="clear-filters">Clear filters</button></li>`}</ul>
      ${attribution()}
      ${s.filtersOpen ? filtersSheet(s) : ""}
      ${s.groupOpen ? groupSheet(s) : ""}
    </div>`;
}
