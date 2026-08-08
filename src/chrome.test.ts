import { describe, expect, it } from "vitest";
import type { BoardRow } from "./joinBoard";
import { applyChrome, defaultChrome } from "./chrome";

function row(partial: Partial<BoardRow> & Pick<BoardRow, "id" | "name" | "isOpen" | "waitMinutes">): BoardRow {
  return {
    lastUpdated: "t",
    rideType: "thrill ride",
    envelopeMinIn: 48,
    envelopeMaxIn: null,
    heightUnknown: false,
    ...partial,
  };
}

describe("applyChrome", () => {
  const rows = [
    row({ id: 1, name: "Zebra", isOpen: true, waitMinutes: 30 }),
    row({ id: 2, name: "Alpha", isOpen: true, waitMinutes: 10 }),
    row({ id: 3, name: "Closed Coaster", isOpen: false, waitMinutes: 0 }),
  ];

  it("defaults to wait ascending with closed listed", () => {
    const out = applyChrome(rows, defaultChrome());
    expect(out.map((r) => r.name)).toEqual(["Alpha", "Zebra", "Closed Coaster"]);
  });

  it("sorts alphabetically", () => {
    const out = applyChrome(rows, { sort: "alpha", hideClosed: false });
    expect(out.map((r) => r.name)).toEqual(["Alpha", "Closed Coaster", "Zebra"]);
  });

  it("hides closed when hideClosed is on", () => {
    const out = applyChrome(rows, { sort: "wait", hideClosed: true });
    expect(out.every((r) => r.isOpen)).toBe(true);
    expect(out).toHaveLength(2);
  });
});
