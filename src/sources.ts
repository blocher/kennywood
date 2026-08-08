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

export function attributionFor(source: WaitSource): { text: string; href: string } {
  if (source === "queue-times") {
    return { text: "Queue-Times.com", href: "https://queue-times.com/en-US" };
  }
  return { text: "ThemeParks.wiki", href: "https://themeparks.wiki/" };
}

/** Kennywood destination entity on ThemeParks.wiki. */
export const THEMEPARKS_KENNYWOOD_ID = "1dea1b67-0d06-4ad2-9145-8fc1783fd4e8";
