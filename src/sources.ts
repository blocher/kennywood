/** Live Wait data providers for Kennywood. */
export type WaitSource = "themeparks" | "queue-times";

export const DEFAULT_WAIT_SOURCE: WaitSource = "themeparks";

export const WAIT_SOURCES: { id: WaitSource; label: string; hint: string }[] = [
  {
    id: "themeparks",
    label: "ThemeParks.wiki",
    hint: "Fuller park coverage (incl. Cosmic Chaos)",
  },
  {
    id: "queue-times",
    label: "Queue-Times",
    hint: "Park 312 feed (~20 rides)",
  },
];

export function parseWaitSource(raw: string | null | undefined): WaitSource {
  return raw === "queue-times" ? "queue-times" : "themeparks";
}

export function otherWaitSource(source: WaitSource): WaitSource {
  return source === "themeparks" ? "queue-times" : "themeparks";
}

export function waitSourceLabel(source: WaitSource): string {
  return WAIT_SOURCES.find((s) => s.id === source)?.label ?? source;
}

const ATTRIBUTION_LINKS: { id: WaitSource; text: string; href: string }[] = [
  { id: "themeparks", text: "ThemeParks.wiki", href: "https://themeparks.wiki/" },
  { id: "queue-times", text: "Queue-Times.com", href: "https://queue-times.com/en-US" },
];

/** Subtle footer credit naming both providers and marking the active source. */
export function renderAttribution(source: WaitSource): string {
  const links = ATTRIBUTION_LINKS.map((s) => {
    const active = s.id === source;
    return `<a class="attr-link${active ? " active" : ""}" href="${s.href}" target="_blank" rel="noopener noreferrer"${
      active ? ' aria-current="true"' : ""
    }>${s.text}${active ? ' <span class="attr-active">(active)</span>' : ""}</a>`;
  }).join('<span class="attr-sep"> · </span>');
  return `<p class="attribution">Data from ${links}</p>`;
}

/** Kennywood destination entity on ThemeParks.wiki. */
export const THEMEPARKS_KENNYWOOD_ID = "1dea1b67-0d06-4ad2-9145-8fc1783fd4e8";
