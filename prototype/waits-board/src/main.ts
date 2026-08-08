import "./style.css";
import { MOCK_ATTRACTIONS } from "./data";
import { ALL_TYPES, defaultState, filterAttractions, type ProtoState } from "./state";
import * as VariantA from "./variantA";
import * as VariantB from "./variantB";
import * as VariantC from "./variantC";

const variants = {
  A: VariantA,
  B: VariantB,
  C: VariantC,
} as const;

type VariantKey = keyof typeof variants;

const VARIANT_META: Record<VariantKey, string> = {
  A: VariantA.VARIANT_NAME,
  B: VariantB.VARIANT_NAME,
  C: VariantC.VARIANT_NAME,
};

const KEYS: VariantKey[] = ["A", "B", "C"];

let state: ProtoState = defaultState();

function currentVariant(): VariantKey {
  const v = new URLSearchParams(location.search).get("variant")?.toUpperCase();
  if (v === "A" || v === "B" || v === "C") return v;
  return "A";
}

function setVariant(key: VariantKey) {
  const url = new URL(location.href);
  url.searchParams.set("variant", key);
  history.replaceState(null, "", url);
  render();
}

function cycle(delta: number) {
  const i = KEYS.indexOf(currentVariant());
  setVariant(KEYS[(i + delta + KEYS.length) % KEYS.length]);
}

function switcherHtml(key: VariantKey): string {
  if (import.meta.env.PROD) return "";
  return `
    <div class="proto-switcher" role="navigation" aria-label="Prototype variants">
      <button type="button" data-action="prev-variant" aria-label="Previous variant">←</button>
      <span class="proto-label">${VARIANT_META[key]}</span>
      <button type="button" data-action="next-variant" aria-label="Next variant">→</button>
    </div>`;
}

function render() {
  const key = currentVariant();
  const list = filterAttractions(MOCK_ATTRACTIONS, state);
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = variants[key].render(list, state) + switcherHtml(key);
  console.debug("[prototype state]", {
    variant: key,
    visible: list.length,
    sort: state.sort,
    hideClosed: state.hideClosed,
    wait: [state.waitMin, state.waitMax],
    height: [state.heightMin, state.heightMax],
    types: [...state.types],
    riders: [...state.selectedRiderIds],
  });
}

function onAction(action: string, el: HTMLElement) {
  switch (action) {
    case "prev-variant":
      cycle(-1);
      break;
    case "next-variant":
      cycle(1);
      break;
    case "toggle-sort":
      state = { ...state, sort: state.sort === "wait" ? "alpha" : "wait" };
      render();
      break;
    case "toggle-closed":
      state = { ...state, hideClosed: !state.hideClosed };
      render();
      break;
    case "open-filters":
      state = { ...state, filtersOpen: true, groupOpen: false };
      render();
      break;
    case "close-filters":
      state = { ...state, filtersOpen: false };
      render();
      break;
    case "open-group":
      state = { ...state, groupOpen: true, filtersOpen: false };
      render();
      break;
    case "close-group":
      state = { ...state, groupOpen: false };
      render();
      break;
    case "clear-filters":
      state = {
        ...state,
        waitMin: 0,
        waitMax: 120,
        heightMin: 0,
        heightMax: 84,
        types: new Set(ALL_TYPES),
      };
      render();
      break;
    case "toggle-type": {
      const t = el.dataset.type!;
      const types = new Set(state.types);
      if (types.has(t)) types.delete(t);
      else types.add(t);
      state = { ...state, types };
      render();
      break;
    }
    case "toggle-rider": {
      const id = el.dataset.id!;
      const selectedRiderIds = new Set(state.selectedRiderIds);
      if (selectedRiderIds.has(id)) selectedRiderIds.delete(id);
      else selectedRiderIds.add(id);
      state = { ...state, selectedRiderIds };
      render();
      break;
    }
    case "wait-min":
      state = {
        ...state,
        waitMin: Math.min(Number((el as HTMLInputElement).value), state.waitMax),
      };
      render();
      break;
    case "wait-max":
      state = {
        ...state,
        waitMax: Math.max(Number((el as HTMLInputElement).value), state.waitMin),
      };
      render();
      break;
    case "height-min":
      state = {
        ...state,
        heightMin: Math.min(Number((el as HTMLInputElement).value), state.heightMax),
      };
      render();
      break;
    case "height-max":
      state = {
        ...state,
        heightMax: Math.max(Number((el as HTMLInputElement).value), state.heightMin),
      };
      render();
      break;
  }
}

document.addEventListener("click", (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!t) return;
  const action = t.dataset.action!;
  if (action.startsWith("wait-") || action.startsWith("height-")) return;
  if (action === "toggle-type" || action === "toggle-rider") return;
  onAction(action, t);
});

document.addEventListener("change", (e) => {
  const t = e.target as HTMLElement;
  if (!(t instanceof HTMLInputElement)) return;
  const host = t.closest<HTMLElement>("[data-action]");
  if (!host) return;
  onAction(host.dataset.action!, host);
});

document.addEventListener("input", (e) => {
  const t = e.target as HTMLElement;
  if (!(t instanceof HTMLInputElement)) return;
  const host = t.closest<HTMLElement>("[data-action]");
  if (!host) return;
  const a = host.dataset.action!;
  if (a.startsWith("wait-") || a.startsWith("height-")) onAction(a, host);
});

document.addEventListener("keydown", (e) => {
  const tag = (e.target as HTMLElement)?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable)
    return;
  if (e.key === "ArrowLeft") cycle(-1);
  if (e.key === "ArrowRight") cycle(1);
});

render();
