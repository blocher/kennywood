import { describe, expect, it } from "vitest";
import { normalizeThemeParks } from "./normalizeThemeParks";

describe("normalizeThemeParks", () => {
  it("maps OPERATING Attractions with standby waits", () => {
    const feed = normalizeThemeParks(
      {
        liveData: [
          {
            id: "645ca1d2-42d2-47c8-9ae0-6db5ae0644a6",
            name: "Cosmic Chaos",
            entityType: "ATTRACTION",
            status: "OPERATING",
            lastUpdated: "2026-08-08T16:00:00.000Z",
            queue: { STANDBY: { waitTime: 12 } },
          },
        ],
      },
      "2026-08-08T16:01:00.000Z",
    );

    expect(feed.source).toBe("themeparks");
    expect(feed.attractions).toEqual([
      {
        id: "645ca1d2-42d2-47c8-9ae0-6db5ae0644a6",
        name: "Cosmic Chaos",
        isOpen: true,
        waitMinutes: 12,
        lastUpdated: "2026-08-08T16:00:00.000Z",
        waitUnknown: false,
      },
    ]);
  });

  it("marks open Attractions without standby Wait as waitUnknown", () => {
    const feed = normalizeThemeParks({
      liveData: [
        {
          id: "x",
          name: "Coal Haulin’ Convoy",
          entityType: "ATTRACTION",
          status: "OPERATING",
          queue: { STANDBY: { waitTime: null } },
        },
      ],
    });
    expect(feed.attractions[0]).toMatchObject({ isOpen: true, waitMinutes: 0, waitUnknown: true });
  });

  it("treats CLOSED/DOWN as not open", () => {
    const feed = normalizeThemeParks({
      liveData: [
        {
          id: "a",
          name: "Pirate",
          entityType: "ATTRACTION",
          status: "DOWN",
        },
        {
          id: "b",
          name: "Cosmic Chaos",
          entityType: "ATTRACTION",
          status: "CLOSED",
        },
      ],
    });
    expect(feed.attractions.every((a) => !a.isOpen)).toBe(true);
  });
});
