import type { WaitAttraction } from "./types";

/** Display label for an Attraction's Wait time on the board. */
export function waitLabel(
  attraction: Pick<WaitAttraction, "isOpen" | "waitMinutes"> & { waitUnknown?: boolean },
): string {
  if (attraction.waitUnknown) return "—";
  if (!attraction.isOpen) return "CLOSED";
  return String(attraction.waitMinutes);
}
