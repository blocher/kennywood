import "./style.css";
import { renderBoard } from "./board";
import { defaultChrome, type BoardChrome } from "./chrome";
import { fetchWaits } from "./fetchWaits";
import { clearFilters, defaultFilters, type FilterState } from "./filters";
import { createRider, loadGroup, saveGroup, type Rider } from "./group";
import { MOCK_FEED } from "./mockFeed";
import type { RideType } from "./catalog";
import type { WaitFeed } from "./types";
import { typesAfterTypeTap } from "./typeQuick";
import { formatHeight } from "./heightFormat";
import {
  DEFAULT_WAIT_SOURCE,
  parseWaitSource,
  type WaitSource,
} from "./sources";

const POLL_MS = 5 * 60_000;
const CHROME_KEY = "kennywood-waits:chrome";
const FILTERS_KEY = "kennywood-waits:filters";
const SOURCE_KEY = "kennywood-waits:source";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

let lastGood: WaitFeed = { ...MOCK_FEED, source: DEFAULT_WAIT_SOURCE };
let stale = false;
let statusOverride: string | null = "Loading waits…";
let chromeState: BoardChrome = loadChrome();
let filters: FilterState = loadFilters();
let waitSource: WaitSource = loadSource();
let filtersOpen = false;
let groupOpen = false;
let riders: Rider[] = loadGroup();
let selectedRiderIds = new Set<string>();

function paint() {
  app!.innerHTML = renderBoard(lastGood, {
    stale,
    statusOverride,
    chrome: chromeState,
    filters,
    filtersOpen,
    groupOpen,
    riders,
    selectedRiderIds,
    source: waitSource,
  });
}

/** Refresh the attraction list without remounting an open sheet (keeps sliders alive). */
function paintList() {
  const next = document.createElement("div");
  next.innerHTML = renderBoard(lastGood, {
    stale,
    statusOverride,
    chrome: chromeState,
    filters,
    filtersOpen,
    groupOpen,
    riders,
    selectedRiderIds,
    source: waitSource,
  });
  const newList = next.querySelector(".list");
  const curList = app!.querySelector(".list");
  if (newList && curList) curList.replaceWith(newList);
}

function persistChrome() {
  localStorage.setItem(CHROME_KEY, JSON.stringify(chromeState));
}

function persistFilters() {
  localStorage.setItem(
    FILTERS_KEY,
    JSON.stringify({
      types: [...filters.types],
      waitMin: filters.waitMin,
      waitMax: filters.waitMax,
      heightMin: filters.heightMin,
      heightMax: filters.heightMax,
    }),
  );
}

function persistSource() {
  localStorage.setItem(SOURCE_KEY, waitSource);
}

function loadChrome(): BoardChrome {
  try {
    const raw = localStorage.getItem(CHROME_KEY);
    if (!raw) return defaultChrome();
    const p = JSON.parse(raw) as BoardChrome;
    if (p.sort !== "wait" && p.sort !== "alpha") return defaultChrome();
    return { sort: p.sort, hideClosed: Boolean(p.hideClosed) };
  } catch {
    return defaultChrome();
  }
}

function loadFilters(): FilterState {
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    if (!raw) return defaultFilters();
    const p = JSON.parse(raw) as {
      types: RideType[];
      waitMin: number;
      waitMax: number;
      heightMin: number;
      heightMax: number;
    };
    return {
      types: new Set(p.types),
      waitMin: p.waitMin,
      waitMax: p.waitMax,
      heightMin: p.heightMin,
      heightMax: p.heightMax,
    };
  } catch {
    return defaultFilters();
  }
}

function loadSource(): WaitSource {
  try {
    return parseWaitSource(localStorage.getItem(SOURCE_KEY));
  } catch {
    return DEFAULT_WAIT_SOURCE;
  }
}

async function refresh() {
  if (document.visibilityState !== "visible") return;
  const result = await fetchWaits(waitSource);
  if (result.ok) {
    lastGood = result.feed;
    stale = false;
    statusOverride = null;
  } else {
    stale = true;
    statusOverride = `Showing last-good data — ${result.message || "fetch failed"}`;
  }
  paint();
}

paint();
void refresh();

window.setInterval(() => {
  void refresh();
}, POLL_MS);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") void refresh();
});

document.addEventListener("click", (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!t) return;
  const action = t.dataset.action;
  switch (action) {
    case "set-sort": {
      const next = t.dataset.sort === "alpha" ? "alpha" : "wait";
      if (next !== chromeState.sort) {
        chromeState = { ...chromeState, sort: next };
        persistChrome();
        paint();
      }
      break;
    }
    case "open-filters":
      filtersOpen = true;
      groupOpen = false;
      paint();
      break;
    case "close-filters":
      filtersOpen = false;
      paint();
      break;
    case "open-group":
      groupOpen = true;
      filtersOpen = false;
      paint();
      break;
    case "close-group":
      groupOpen = false;
      paint();
      break;
    case "clear-filters":
      filters = clearFilters();
      persistFilters();
      paint();
      break;
    case "quick-all":
      filters = clearFilters();
      persistFilters();
      paint();
      break;
    case "quick-toggle": {
      const type = t.dataset.type as RideType;
      filters = { ...filters, types: typesAfterTypeTap(filters.types, type) };
      persistFilters();
      paint();
      break;
    }
    case "toggle-rider":
      return;
    case "delete-rider": {
      const id = t.dataset.id!;
      riders = riders.filter((r) => r.id !== id);
      selectedRiderIds.delete(id);
      saveGroup(riders);
      paint();
      break;
    }
    case "edit-rider": {
      const id = t.dataset.id!;
      const rider = riders.find((r) => r.id === id);
      if (!rider) break;
      const name = prompt("First name", rider.name);
      if (name == null || !name.trim()) break;
      const feet = Number(prompt("Feet", String(Math.floor(rider.heightIn / 12))));
      const inches = Number(prompt("Inches", String(rider.heightIn % 12)));
      if (!Number.isFinite(feet) || !Number.isFinite(inches)) break;
      riders = riders.map((r) =>
        r.id === id ? { ...r, name: name.trim(), heightIn: feet * 12 + inches } : r,
      );
      saveGroup(riders);
      paint();
      break;
    }
  }
});

document.addEventListener("change", (e) => {
  const el = e.target as HTMLInputElement;
  const host = el.closest<HTMLElement>("[data-action]");
  if (!host) return;
  const action = host.dataset.action;
  if (action === "toggle-rider") {
    const id = host.dataset.id!;
    const next = new Set(selectedRiderIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    selectedRiderIds = next;
    paint();
  }
  if (action === "set-source") {
    const next = parseWaitSource(el.value);
    if (next === waitSource) return;
    waitSource = next;
    persistSource();
    statusOverride = "Loading waits…";
    stale = false;
    paint();
    void refresh();
  }
});

function syncDualRange(dual: HTMLElement, lo: number, hi: number, min: number, max: number) {
  const span = max - min || 1;
  dual.style.setProperty("--lo", `${((lo - min) / span) * 100}%`);
  dual.style.setProperty("--hi", `${((hi - min) / span) * 100}%`);
  const loInput = dual.querySelector<HTMLInputElement>('[data-bound="lo"]');
  const hiInput = dual.querySelector<HTMLInputElement>('[data-bound="hi"]');
  if (loInput) loInput.value = String(lo);
  if (hiInput) hiInput.value = String(hi);
}

document.addEventListener("input", (e) => {
  const el = e.target as HTMLInputElement;
  const host = el.closest<HTMLElement>("[data-action]");
  if (!host) return;
  const action = host.dataset.action;
  const value = Number(el.value);
  const dual = host.closest<HTMLElement>(".dual-range");
  const field = host.closest<HTMLElement>(".range-field");
  const readout = field?.querySelector<HTMLElement>("[data-readout]");

  if (action === "wait-min" || action === "wait-max") {
    let waitMin = filters.waitMin;
    let waitMax = filters.waitMax;
    if (action === "wait-min") {
      waitMin = value;
      if (waitMin > waitMax) waitMax = waitMin;
    } else {
      waitMax = value;
      if (waitMax < waitMin) waitMin = waitMax;
    }
    filters = { ...filters, waitMin, waitMax };
    persistFilters();
    if (dual) syncDualRange(dual, waitMin, waitMax, 0, 120);
    if (readout) readout.textContent = `${waitMin} – ${waitMax} min`;
    paintList();
  }
  if (action === "height-min" || action === "height-max") {
    let heightMin = filters.heightMin;
    let heightMax = filters.heightMax;
    if (action === "height-min") {
      heightMin = value;
      if (heightMin > heightMax) heightMax = heightMin;
    } else {
      heightMax = value;
      if (heightMax < heightMin) heightMin = heightMax;
    }
    filters = { ...filters, heightMin, heightMax };
    persistFilters();
    if (dual) syncDualRange(dual, heightMin, heightMax, 0, 84);
    if (readout) readout.textContent = `${formatHeight(heightMin)} – ${formatHeight(heightMax)}`;
    paintList();
  }
});

document.addEventListener("submit", (e) => {
  const form = (e.target as HTMLElement).closest<HTMLFormElement>("form[data-action='add-rider']");
  if (!form) return;
  e.preventDefault();
  const fd = new FormData(form);
  const name = String(fd.get("name") ?? "");
  const feet = Number(fd.get("feet"));
  const inches = Number(fd.get("inches"));
  if (!name.trim() || !Number.isFinite(feet) || !Number.isFinite(inches)) return;
  riders = [...riders, createRider(name, feet, inches)];
  saveGroup(riders);
  paint();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (filtersOpen || groupOpen) {
    filtersOpen = false;
    groupOpen = false;
    paint();
  }
});
