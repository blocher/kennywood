import { describe, expect, it } from "vitest";
import { waitLabel } from "./waitLabel";

describe("waitLabel", () => {
  it("shows wait minutes when the Attraction is open", () => {
    expect(waitLabel({ isOpen: true, waitMinutes: 45 })).toBe("45");
  });

  it("shows CLOSED when the Attraction is not open", () => {
    expect(waitLabel({ isOpen: false, waitMinutes: 0 })).toBe("CLOSED");
  });
});
