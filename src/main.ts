import "./style.css";
import { renderBoard } from "./board";
import { defaultChrome, type BoardChrome } from "./chrome";
import { fetchWaits } from "./fetchWaits";
import { clearFilters, defaultFilters, type FilterState } from "./filters";
import { createRider, loadGroup, saveGroup, type Rider } from "./group";
import { debugFeeds, isDebugMode } from "./debugFeed";
import { ALL_LANDS, type RideLand, type RideType } from "./catalog";
import type { WaitFeed } from "./types";
import { landsAfterLandTap, typesAfterTypeTap } from "./typeQuick";
import { formatHeight } from "./heightFormat";
import {
  OFFICIAL_APP_WAIT_SOURCE,
  POSTED_WAIT_SOURCE,
  type WaitSource,
} from "./sources";

const POLL_MS = 5 * 60_000;
const CHROME_KEY = "kennywood-waits:chrome";
const FILTERS_KEY = "kennywood-waits:filters";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

const debug = isDebugMode(window.location.search);
const initialFeeds: Partial<Record<WaitSource, WaitFeed>> = debug
  ? debugFeeds()
  : {};
let feeds = initialFeeds;
let stale = false;
let statusOverride: string | null = debug ? "Debug sample waits" : "Loading waits…";
let chromeState: BoardChrome = loadChrome();
let filters: FilterState = loadFilters();
let filtersOpen = false;
let groupOpen = false;
let riders: Rider[] = loadGroup();
let selectedRiderIds = new Set<string>();

function currentPostedFeed(): WaitFeed {
  return (
    feeds[POSTED_WAIT_SOURCE] ?? {
      fetchedAt: new Date().toISOString(),
      source: POSTED_WAIT_SOURCE,
      attractions: [],
    }
  );
}

function currentAppFeed(): WaitFeed | null {
  return feeds[OFFICIAL_APP_WAIT_SOURCE] ?? null;
}

function paint() {
  app!.innerHTML = renderBoard(currentPostedFeed(), {
    stale,
    statusOverride,
    chrome: chromeState,
    filters,
    filtersOpen,
    groupOpen,
    riders,
    selectedRiderIds,
    appFeed: currentAppFeed(),
  });
}

/** Refresh the attraction list without remounting an open sheet (keeps sliders alive). */
function paintList() {
  const next = document.createElement("div");
  next.innerHTML = renderBoard(currentPostedFeed(), {
    stale,
    statusOverride,
    chrome: chromeState,
    filters,
    filtersOpen,
    groupOpen,
    riders,
    selectedRiderIds,
    appFeed: currentAppFeed(),
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
      lands: [...filters.lands],
      waitMin: filters.waitMin,
      waitMax: filters.waitMax,
      heightMin: filters.heightMin,
      heightMax: filters.heightMax,
    }),
  );
}

function loadChrome(): BoardChrome {
  try {
    const raw = localStorage.getItem(CHROME_KEY);
    if (!raw) return defaultChrome();
    const p = JSON.parse(raw) as { sort?: string; hideClosed?: boolean };
    const legacySort = p.sort;
    const sort = legacySort === "alpha" || legacySort === "app" ? legacySort : "park";
    return { sort, hideClosed: Boolean(p.hideClosed) };
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
      lands?: string[];
      waitMin: number;
      waitMax: number;
      heightMin: number;
      heightMax: number;
    };
    const lands = (p.lands ?? []).filter((l): l is RideLand =>
      (ALL_LANDS as readonly string[]).includes(l),
    );
    return {
      types: new Set(p.types),
      lands: new Set(lands.length ? lands : ALL_LANDS),
      waitMin: p.waitMin,
      waitMax: p.waitMax,
      heightMin: p.heightMin,
      heightMax: p.heightMax,
    };
  } catch {
    return defaultFilters();
  }
}

async function refresh() {
  if (document.visibilityState !== "visible") return;
  if (debug) {
    feeds = debugFeeds();
    stale = false;
    statusOverride = "Debug sample waits";
    paint();
    return;
  }
  const [posted, appFeed] = await Promise.all([
    fetchWaits(POSTED_WAIT_SOURCE),
    fetchWaits(OFFICIAL_APP_WAIT_SOURCE),
  ]);
  const failures: string[] = [];
  if (posted.ok) feeds = { ...feeds, [POSTED_WAIT_SOURCE]: posted.feed };
  else failures.push("posted-in-park data");
  if (appFeed.ok) feeds = { ...feeds, [OFFICIAL_APP_WAIT_SOURCE]: appFeed.feed };
  else failures.push("official-app data");
  stale = failures.length > 0;
  statusOverride = failures.length
    ? `Some data unavailable — ${failures.join(" and ")}`
    : null;
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
      const raw = t.dataset.sort;
      const next: BoardChrome["sort"] = raw === "alpha" || raw === "app" ? raw : "park";
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
    case "quick-land-all":
      filters = { ...filters, lands: new Set(ALL_LANDS) };
      persistFilters();
      paint();
      break;
    case "quick-land": {
      const land = t.dataset.land as RideLand;
      filters = { ...filters, lands: landsAfterLandTap(filters.lands, land) };
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
