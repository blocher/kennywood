import { describe, expect, it } from "vitest";
import { ALL_RIDE_TYPES } from "./filters";
import { QUICK_TYPES, isShowingAllTypes, typesAfterTypeTap } from "./typeQuick";

describe("typesAfterTypeTap", () => {
  it("from All, tapping a type solos that type", () => {
    const next = typesAfterTypeTap(new Set(ALL_RIDE_TYPES), "roller coaster");
    expect([...next]).toEqual(["roller coaster"]);
  });

  it("toggles a second type on for multi-select", () => {
    const next = typesAfterTypeTap(new Set(["roller coaster"]), "thrill ride");
    expect(next.has("roller coaster")).toBe(true);
    expect(next.has("thrill ride")).toBe(true);
    expect(next.size).toBe(2);
  });

  it("toggles a type off", () => {
    const next = typesAfterTypeTap(new Set(["roller coaster", "thrill ride"]), "thrill ride");
    expect([...next]).toEqual(["roller coaster"]);
  });

  it("returns to All when the last type is cleared", () => {
    const next = typesAfterTypeTap(new Set(["roller coaster"]), "roller coaster");
    expect(isShowingAllTypes(next)).toBe(true);
  });

  it("returns to All when every quick type is selected", () => {
    const almost = new Set(QUICK_TYPES.slice(0, -1).map((t) => t.type));
    const last = QUICK_TYPES.at(-1)!.type;
    const next = typesAfterTypeTap(almost, last);
    expect(isShowingAllTypes(next)).toBe(true);
  });
});
