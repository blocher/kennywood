import { describe, expect, it } from "vitest";
import { normalizeQueueTimes } from "./normalizeQueueTimes";

describe("normalizeQueueTimes", () => {
  it("reads flat rides (Kennywood-style empty lands)", () => {
    const feed = normalizeQueueTimes(
      {
        lands: [],
        rides: [
          {
            id: 11031,
            name: "Phantom's Revenge",
            is_open: true,
            wait_time: 45,
            last_updated: "2026-08-08T14:30:00.000Z",
          },
        ],
      },
      "2026-08-08T14:32:00.000Z",
    );

    expect(feed.fetchedAt).toBe("2026-08-08T14:32:00.000Z");
    expect(feed.attractions).toEqual([
      {
        id: 11031,
        name: "Phantom's Revenge",
        isOpen: true,
        waitMinutes: 45,
        lastUpdated: "2026-08-08T14:30:00.000Z",
      },
    ]);
  });

  it("also reads nested lands[].rides", () => {
    const feed = normalizeQueueTimes({
      lands: [
        {
          rides: [
            {
              id: 1,
              name: "Coaster",
              is_open: false,
              wait_time: 0,
              last_updated: "2026-08-08T10:00:00.000Z",
            },
          ],
        },
      ],
      rides: [],
    });

    expect(feed.attractions[0]).toMatchObject({ id: 1, isOpen: false, waitMinutes: 0 });
  });
});
