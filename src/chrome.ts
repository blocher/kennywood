import type { BoardRow } from "./joinBoard";

export type SortMode = "app" | "park" | "alpha";

export type BoardChrome = {
  sort: SortMode;
  hideClosed: boolean;
};

export function defaultChrome(): BoardChrome {
  return { sort: "park", hideClosed: false };
}

function waitSortValue(wait: BoardRow["altWait"] | BoardRow | undefined): number {
  if (!wait || wait.waitUnknown) return 8998;
  return wait.isOpen ? wait.waitMinutes : 9999;
}

function primaryWait(row: BoardRow, sort: SortMode) {
  return sort === "app" ? row.altWait : row;
}

function secondaryWait(row: BoardRow, sort: SortMode) {
  return sort === "app" ? row : row.altWait;
}

/** Apply sort + hide-closed to joined board rows. */
export function applyChrome(rows: BoardRow[], chrome: BoardChrome): BoardRow[] {
  let out = chrome.hideClosed ? rows.filter((r) => r.isOpen) : [...rows];
  out.sort((a, b) => {
    if (chrome.sort === "alpha") return a.name.localeCompare(b.name);
    // Live waits first, then unavailable values, then closed.
    const aw = waitSortValue(primaryWait(a, chrome.sort));
    const bw = waitSortValue(primaryWait(b, chrome.sort));
    if (aw !== bw) return aw - bw;
    const as = waitSortValue(secondaryWait(a, chrome.sort));
    const bs = waitSortValue(secondaryWait(b, chrome.sort));
    if (as !== bs) return as - bs;
    return a.name.localeCompare(b.name);
  });
  return out;
}
