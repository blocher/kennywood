import { VARIANT_NAMES, type QuickVariant } from "./variants";

const ORDER: QuickVariant[] = ["A", "B", "C"];

/** Floating prototype switcher — DEV only. */
export function renderSwitcher(current: QuickVariant): string {
  const label = `${current} — ${VARIANT_NAMES[current]}`;
  return `<div class="tqf-switcher" role="group" aria-label="Prototype variant switcher">
    <button type="button" data-action="proto-prev" aria-label="Previous variant">←</button>
    <span class="tqf-switcher-label">${label}</span>
    <button type="button" data-action="proto-next" aria-label="Next variant">→</button>
  </div>`;
}

export function cycleVariant(current: QuickVariant, dir: -1 | 1): QuickVariant {
  const i = ORDER.indexOf(current);
  return ORDER[(i + dir + ORDER.length) % ORDER.length]!;
}

export function setVariantInUrl(variant: QuickVariant) {
  const url = new URL(window.location.href);
  url.searchParams.set("variant", variant);
  window.history.replaceState({}, "", url);
}
