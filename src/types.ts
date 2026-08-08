import type { WaitSource } from "./sources";

/** Normalized wait DTO from the same-origin proxy (and mocks). */
export type WaitFeed = {
  fetchedAt: string;
  source: WaitSource;
  attractions: WaitAttraction[];
};

export type WaitAttraction = {
  /** Provider ride id (Queue-Times numeric string, or ThemeParks UUID). */
  id: string;
  name: string;
  isOpen: boolean;
  waitMinutes: number;
  lastUpdated: string;
  /** True when the Attraction is open/operating but no standby Wait was published. */
  waitUnknown?: boolean;
};
