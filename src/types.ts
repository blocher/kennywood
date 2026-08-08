/** Normalized wait DTO from the same-origin proxy (and mocks). */
export type WaitFeed = {
  fetchedAt: string;
  attractions: WaitAttraction[];
};

export type WaitAttraction = {
  id: number;
  name: string;
  isOpen: boolean;
  waitMinutes: number;
  lastUpdated: string;
};
