import { describe, expect, it } from "vitest";
import { ALL_RIDE_TYPES } from "./filters";
import { isShowingAllTypes, typesAfterTypeTap } from "./typeQuick";

describe("typesAfterTypeTap", () => {
  it("from All, tapping a type solos that type", () => {
    const next = typesAfterTypeTap(new Set(ALL_RIDE_TYPES), "roller coaster");
    expect([...next]).toEqual(["roller coaster"]);
  });

  it("switching types replaces the previous selection", () => {
    const next = typesAfterTypeTap(new Set(["roller coaster"]), "thrill ride");
    expect([...next]).toEqual(["thrill ride"]);
  });

  it("tapping the active type again returns to All", () => {
    const next = typesAfterTypeTap(new Set(["roller coaster"]), "roller coaster");
    expect(isShowingAllTypes(next)).toBe(true);
  });
});
