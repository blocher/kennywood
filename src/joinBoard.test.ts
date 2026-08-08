import { describe, expect, it } from "vitest";
import { ATTRACTION_CATALOG } from "./catalog";
import { joinBoardRows, rowMeta } from "./joinBoard";
import type { WaitAttraction } from "./types";

const phantom: WaitAttraction = {
  id: 11031,
  name: "Phantom's Revenge",
  isOpen: true,
  waitMinutes: 55,
  lastUpdated: "2026-08-08T14:30:00.000Z",
};

const ghostwood: WaitAttraction = {
  id: 11036,
  name: "Ghostwood Estate",
  isOpen: false,
  waitMinutes: 0,
  lastUpdated: "2026-08-07T21:27:00.000Z",
};

const unknownId: WaitAttraction = {
  id: 99999,
  name: "Mystery Ride",
  isOpen: true,
  waitMinutes: 10,
  lastUpdated: "2026-08-08T14:30:00.000Z",
};

describe("joinBoardRows", () => {
  it("joins catalog Ride type and height envelope by Queue-Times id", () => {
    const [row] = joinBoardRows([phantom]);
    expect(row.rideType).toBe("roller coaster");
    expect(row.envelopeMinIn).toBe(48);
    expect(row.heightUnknown).toBe(false);
  });

  it("marks height unknown when envelope min is null", () => {
    const [row] = joinBoardRows([ghostwood]);
    expect(row.heightUnknown).toBe(true);
    expect(rowMeta(row)).toContain("height unknown");
  });

  it("treats missing catalog as unknown type/height (still shows the feed row)", () => {
    const [row] = joinBoardRows([unknownId]);
    expect(row.rideType).toBe("unknown");
    expect(row.heightUnknown).toBe(true);
  });

  it("does not invent rows for catalog-only ids", () => {
    const rows = joinBoardRows([phantom]);
    expect(rows).toHaveLength(1);
    expect(Object.keys(ATTRACTION_CATALOG).length).toBeGreaterThan(1);
    expect(rows.every((r) => r.id === 11031)).toBe(true);
  });
});

describe("ATTRACTION_CATALOG", () => {
  it("covers the research park-312 Attraction set", () => {
    expect(Object.keys(ATTRACTION_CATALOG).map(Number).sort()).toEqual(
      [
        11024, 11025, 11026, 11027, 11028, 11029, 11030, 11031, 11032, 11033, 11034, 11035,
        11036, 11037, 11891, 12113, 12431, 12448, 14377, 14916,
      ].sort((a, b) => a - b),
    );
  });
});
