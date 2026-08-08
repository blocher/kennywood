import type { WaitFeed } from "./types";

/** In-memory mock DTO for park-day board scaffolding (no network). */
export const MOCK_FEED: WaitFeed = {
  fetchedAt: "2026-08-08T14:32:00.000Z",
  attractions: [
    {
      id: 11031,
      name: "Phantom's Revenge",
      isOpen: true,
      waitMinutes: 55,
      lastUpdated: "2026-08-08T14:30:00.000Z",
    },
    {
      id: 11029,
      name: "Exterminator",
      isOpen: true,
      waitMinutes: 40,
      lastUpdated: "2026-08-08T14:30:00.000Z",
    },
    {
      id: 11027,
      name: "Black Widow",
      isOpen: true,
      waitMinutes: 20,
      lastUpdated: "2026-08-08T14:30:00.000Z",
    },
    {
      id: 11034,
      name: "Steel Curtain",
      isOpen: true,
      waitMinutes: 75,
      lastUpdated: "2026-08-08T14:30:00.000Z",
    },
    {
      id: 11037,
      name: "Aero 360",
      isOpen: true,
      waitMinutes: 5,
      lastUpdated: "2026-08-08T14:30:00.000Z",
    },
    {
      id: 11028,
      name: "Thunderbolt",
      isOpen: false,
      waitMinutes: 0,
      lastUpdated: "2026-08-07T21:27:00.000Z",
    },
    {
      id: 11036,
      name: "Ghostwood Estate",
      isOpen: false,
      waitMinutes: 0,
      lastUpdated: "2026-08-07T21:27:00.000Z",
    },
    {
      id: 11025,
      name: "Kangaroo",
      isOpen: true,
      waitMinutes: 10,
      lastUpdated: "2026-08-08T14:30:00.000Z",
    },
  ],
};
