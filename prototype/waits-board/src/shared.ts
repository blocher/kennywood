import type { Attraction } from "./data";
import { MOCK_FETCHED_AT } from "./data";
import {
  ALL_TYPES,
  MOCK_RIDERS,
  type ProtoState,
  formatHeight,
} from "./state";

function statusLine(): string {
  const mins = Math.round((Date.now() - Date.parse(MOCK_FETCHED_AT)) / 60000);
  return mins < 2 ? "Updated just now" : `Updated ${mins} min ago · mock data`;
}

function sheetShell(
  title: string,
  bodyHtml: string,
  onCloseAttr: string,
): string {
  return `
    <div class="sheet-backdrop" data-action="${onCloseAttr}"></div>
    <div class="sheet" role="dialog" aria-label="${title}">
      <header class="sheet-head">
        <h2>${title}</h2>
        <button type="button" class="sheet-close" data-action="${onCloseAttr}">Close</button>
      </header>
      <div class="sheet-body">${bodyHtml}</div>
    </div>`;
}

export function filtersSheet(s: ProtoState): string {
  const types = ALL_TYPES.map(
    (t) => `
      <label class="chip ${s.types.has(t) ? "on" : ""}">
        <input type="checkbox" data-action="toggle-type" data-type="${t}" ${s.types.has(t) ? "checked" : ""} />
        ${t}
      </label>`,
  ).join("");

  return sheetShell(
    "Filters",
    `
    <fieldset>
      <legend>Wait (min)</legend>
      <div class="dual">
        <label>Min <input type="range" min="0" max="120" value="${s.waitMin}" data-action="wait-min" /></label>
        <label>Max <input type="range" min="0" max="120" value="${s.waitMax}" data-action="wait-max" /></label>
        <p class="dual-readout">${s.waitMin} – ${s.waitMax} min</p>
      </div>
    </fieldset>
    <fieldset>
      <legend>Height range (hypothetical)</legend>
      <div class="dual">
        <label>Low <input type="range" min="0" max="84" value="${s.heightMin}" data-action="height-min" /></label>
        <label>High <input type="range" min="0" max="84" value="${s.heightMax}" data-action="height-max" /></label>
        <p class="dual-readout">${formatHeight(s.heightMin)} – ${formatHeight(s.heightMax)}</p>
      </div>
    </fieldset>
    <fieldset>
      <legend>Ride type</legend>
      <div class="chips">${types}</div>
    </fieldset>
    <button type="button" class="btn-clear" data-action="clear-filters">Clear filters</button>
    `,
    "close-filters",
  );
}

export function groupSheet(s: ProtoState): string {
  const rows = MOCK_RIDERS.map((r) => {
    const on = s.selectedRiderIds.has(r.id);
    return `
      <label class="rider ${on ? "on" : ""}">
        <input type="checkbox" data-action="toggle-rider" data-id="${r.id}" ${on ? "checked" : ""} />
        <span class="rider-name">${r.name}</span>
        <span class="rider-h">${formatHeight(r.heightIn)}</span>
      </label>`;
  }).join("");

  return sheetShell(
    "Group",
    `
    <p class="hint">Select riders to filter to rides they all can do. (Add/edit is stubbed in this prototype.)</p>
    <div class="riders">${rows}</div>
    `,
    "close-group",
  );
}

export function attribution(): string {
  return `<p class="attribution">Powered by <a href="https://queue-times.com/en-US" target="_blank" rel="noopener">Queue-Times.com</a></p>`;
}

export function waitLabel(a: Attraction): string {
  if (!a.isOpen) return "CLOSED";
  return String(a.waitMinutes);
}

export function metaLine(a: Attraction): string {
  const bits: string[] = [a.rideType];
  if (a.heightUnknown) bits.push("height unknown");
  else if (a.heightMinIn != null) bits.push(`${a.heightMinIn}"+`);
  return bits.join(" · ");
}

export { statusLine };
