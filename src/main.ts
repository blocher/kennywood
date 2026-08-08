import "./style.css";
import { renderBoard } from "./board";
import { fetchWaits } from "./fetchWaits";
import { MOCK_FEED } from "./mockFeed";
import type { WaitFeed } from "./types";

const POLL_MS = 60_000;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

let lastGood: WaitFeed = MOCK_FEED;
let stale = false;
let statusOverride: string | null = "Loading waits…";

function paint() {
  app!.innerHTML = renderBoard(lastGood, {
    stale,
    statusOverride,
  });
}

async function refresh() {
  if (document.visibilityState !== "visible") return;
  const result = await fetchWaits();
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
