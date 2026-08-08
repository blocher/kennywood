import { describe, expect, it } from "vitest";
import { ATTRACTION_CATALOG, LOCAL_CATALOG_ID, catalogWithoutQueueTimes } from "./catalog";
import { joinBoardRows, rowMeta } from "./joinBoard";
import type { WaitAttraction } from "./types";

const phantom: WaitAttraction = {
  id: "11031",
  name: "Phantom's Revenge",
  isOpen: true,
  waitMinutes: 55,
  lastUpdated: "2026-08-08T14:30:00.000Z",
};

const ghostwood: WaitAttraction = {
  id: "11036",
  name: "Ghostwood Estate",
  isOpen: false,
  waitMinutes: 0,
  lastUpdated: "2026-08-07T21:27:00.000Z",
};

const unknownId: WaitAttraction = {
  id: "99999",
  name: "Mystery Ride",
  isOpen: true,
  waitMinutes: 10,
  lastUpdated: "2026-08-08T14:30:00.000Z",
};

const cosmicTpw: WaitAttraction = {
  id: "645ca1d2-42d2-47c8-9ae0-6db5ae0644a6",
  name: "Cosmic Chaos",
  isOpen: true,
  waitMinutes: 5,
  lastUpdated: "2026-08-08T16:00:00.000Z",
};

describe("joinBoardRows", () => {
  it("joins catalog Ride type and height envelope by Queue-Times id", () => {
    const [row] = joinBoardRows([phantom], "queue-times");
    expect(row.rideType).toBe("roller coaster");
    expect(row.envelopeMinIn).toBe(48);
    expect(row.heightUnknown).toBe(false);
    expect(row.waitUnknown).toBe(false);
  });

  it("marks height unknown when envelope min is null", () => {
    const [row] = joinBoardRows([ghostwood], "queue-times");
    expect(row.heightUnknown).toBe(true);
    expect(rowMeta(row)).toContain("height unknown");
  });

  it("treats missing catalog as unknown type/height (still shows the feed row)", () => {
    const [row] = joinBoardRows([unknownId], "queue-times");
    expect(row.rideType).toBe("unknown");
    expect(row.heightUnknown).toBe(true);
  });

  it("appends catalog Attractions that have no Queue-Times wait row", () => {
    const rows = joinBoardRows([phantom], "queue-times");
    const cosmic = rows.find((r) => r.name === "Cosmic Chaos");
    expect(cosmic).toMatchObject({
      rideType: "thrill ride",
      envelopeMinIn: 48,
      waitUnknown: true,
    });
    expect(rowMeta(cosmic!)).toContain("no wait data");
  });

  it("joins ThemeParks.wiki UUIDs without appending catalog-only rows", () => {
    const rows = joinBoardRows([cosmicTpw], "themeparks");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: "Cosmic Chaos",
      rideType: "thrill ride",
      envelopeMinIn: 48,
      waitUnknown: false,
    });
  });
});

describe("ATTRACTION_CATALOG", () => {
  it("covers the Queue-Times park-312 Attraction set", () => {
    const qtIds = [
      11024, 11025, 11026, 11027, 11028, 11029, 11030, 11031, 11032, 11033, 11034, 11035, 11036,
      11037, 11891, 12113, 12431, 12448, 14377, 14916,
    ];
    for (const id of qtIds) {
      expect(ATTRACTION_CATALOG[id]?.queueTimesId).toBe(id);
    }
  });

  it("includes Cosmic Chaos and other first-party Attractions without QT waits", () => {
    const extras = catalogWithoutQueueTimes();
    expect(extras.some((c) => c.name === "Cosmic Chaos")).toBe(true);
    expect(extras.length).toBe(Object.keys(LOCAL_CATALOG_ID).length);
    expect(ATTRACTION_CATALOG[LOCAL_CATALOG_ID.cosmicChaos]?.themeParksId).toBeTruthy();
  });
});
