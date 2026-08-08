import { describe, expect, it } from "vitest";
import type { BoardRow } from "./joinBoard";
import { applyFilters, defaultFilters, heightRangeMatches } from "./filters";

function row(p: Partial<BoardRow> & Pick<BoardRow, "id" | "name" | "isOpen" | "waitMinutes" | "rideType">): BoardRow {
  return {
    lastUpdated: "t",
    envelopeMinIn: 48,
    envelopeMaxIn: null,
    heightUnknown: false,
    ...p,
  };
}

describe("heightRangeMatches", () => {
  it("requires the whole hypothetical range to fit the envelope", () => {
    const r = row({
      id: 1,
      name: "X",
      isOpen: true,
      waitMinutes: 10,
      rideType: "thrill ride",
      envelopeMinIn: 48,
      envelopeMaxIn: null,
    });
    expect(heightRangeMatches(r, 48, 60)).toBe(true);
    expect(heightRangeMatches(r, 40, 50)).toBe(false);
  });

  it("passes unknown-min Attractions", () => {
    const r = row({
      id: 2,
      name: "Y",
      isOpen: true,
      waitMinutes: 5,
      rideType: "dark ride / walk-on",
      envelopeMinIn: null,
      heightUnknown: true,
    });
    expect(heightRangeMatches(r, 30, 40)).toBe(true);
  });
});

describe("applyFilters", () => {
  const rows = [
    row({ id: 1, name: "A", isOpen: true, waitMinutes: 5, rideType: "thrill ride", envelopeMinIn: 48 }),
    row({ id: 2, name: "B", isOpen: true, waitMinutes: 50, rideType: "roller coaster", envelopeMinIn: 52 }),
  ];

  it("ANDs type and wait range", () => {
    const f = defaultFilters();
    f.types = new Set(["thrill ride"]);
    f.waitMax = 10;
    expect(applyFilters(rows, f).map((r) => r.name)).toEqual(["A"]);
  });
});
