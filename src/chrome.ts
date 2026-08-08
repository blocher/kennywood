import type { BoardRow } from "./joinBoard";

export type SortMode = "wait" | "alpha";

export type BoardChrome = {
  sort: SortMode;
  hideClosed: boolean;
};

export function defaultChrome(): BoardChrome {
  return { sort: "wait", hideClosed: false };
}

/** Apply sort + hide-closed to joined board rows. */
export function applyChrome(rows: BoardRow[], chrome: BoardChrome): BoardRow[] {
  let out = chrome.hideClosed ? rows.filter((r) => r.isOpen) : [...rows];
  out.sort((a, b) => {
    if (chrome.sort === "alpha") return a.name.localeCompare(b.name);
    // Live waits first, then no-wait catalog rows, then closed.
    const aw = a.waitUnknown ? 8998 : a.isOpen ? a.waitMinutes : 9999;
    const bw = b.waitUnknown ? 8998 : b.isOpen ? b.waitMinutes : 9999;
    if (aw !== bw) return aw - bw;
    return a.name.localeCompare(b.name);
  });
  return out;
}
