import { describe, expect, it } from "vitest";
import type { BoardRow } from "./joinBoard";
import { applyChrome, defaultChrome } from "./chrome";

function row(partial: Partial<BoardRow> & Pick<BoardRow, "id" | "name" | "isOpen" | "waitMinutes">): BoardRow {
  return {
    lastUpdated: "t",
    rideType: "thrill ride",
    envelopeMinIn: 48,
    envelopeMaxIn: null,
    companionMinIn: 48,
    soloMinIn: 48,
    heightUnknown: false,
    waitUnknown: false,
    ...partial,
  };
}

describe("applyChrome", () => {
  const rows = [
    row({ id: "1", name: "Zebra", isOpen: true, waitMinutes: 30, altWait: { isOpen: true, waitMinutes: 5 } }),
    row({ id: "2", name: "Alpha", isOpen: true, waitMinutes: 10, altWait: { isOpen: true, waitMinutes: 40 } }),
    row({ id: "3", name: "Closed Coaster", isOpen: false, waitMinutes: 0, altWait: { isOpen: false, waitMinutes: 0 } }),
  ];

  it("defaults to Posted in Park ascending with closed listed", () => {
    const out = applyChrome(rows, defaultChrome());
    expect(out.map((r) => r.name)).toEqual(["Alpha", "Zebra", "Closed Coaster"]);
  });

  it("sorts missing Park values after live waits, then by App time", () => {
    const withGap = [
      ...rows,
      row({ id: "4", name: "Cosmic Chaos", isOpen: true, waitMinutes: 0, waitUnknown: true, altWait: { isOpen: true, waitMinutes: 35 } }),
      row({ id: "5", name: "Missing First", isOpen: true, waitMinutes: 0, waitUnknown: true, altWait: { isOpen: true, waitMinutes: 5 } }),
    ];
    const out = applyChrome(withGap, defaultChrome());
    expect(out.map((r) => r.name)).toEqual([
      "Alpha",
      "Zebra",
      "Missing First",
      "Cosmic Chaos",
      "Closed Coaster",
    ]);
  });

  it("sorts missing App values after live waits, then by Park time", () => {
    const withGap = [
      ...rows,
      row({ id: "4", name: "Cosmic Chaos", isOpen: true, waitMinutes: 20, altWait: { isOpen: true, waitMinutes: 0, waitUnknown: true } }),
      row({ id: "5", name: "Missing First", isOpen: true, waitMinutes: 8, altWait: { isOpen: true, waitMinutes: 0, waitUnknown: true } }),
    ];
    const out = applyChrome(withGap, { sort: "app", hideClosed: false });
    expect(out.map((r) => r.name)).toEqual([
      "Zebra",
      "Alpha",
      "Missing First",
      "Cosmic Chaos",
      "Closed Coaster",
    ]);
  });

  it("breaks equal Park waits with App time", () => {
    const tied = [
      row({ id: "1", name: "Zebra", isOpen: true, waitMinutes: 15, altWait: { isOpen: true, waitMinutes: 40 } }),
      row({ id: "2", name: "Alpha", isOpen: true, waitMinutes: 15, altWait: { isOpen: true, waitMinutes: 5 } }),
    ];
    const out = applyChrome(tied, { sort: "park", hideClosed: false });
    expect(out.map((r) => r.name)).toEqual(["Alpha", "Zebra"]);
  });

  it("sorts alphabetically", () => {
    const out = applyChrome(rows, { sort: "alpha", hideClosed: false });
    expect(out.map((r) => r.name)).toEqual(["Alpha", "Closed Coaster", "Zebra"]);
  });

  it("hides closed when hideClosed is on", () => {
    const out = applyChrome(rows, { sort: "app", hideClosed: true });
    expect(out.every((r) => r.isOpen)).toBe(true);
    expect(out).toHaveLength(2);
  });
});
