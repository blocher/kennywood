import { describe, expect, it } from "vitest";
import { debugFeeds, isDebugMode } from "./debugFeed";

describe("isDebugMode", () => {
  it("is on only for debug=1", () => {
    expect(isDebugMode("?debug=1")).toBe(true);
    expect(isDebugMode("?debug=0")).toBe(false);
    expect(isDebugMode("")).toBe(false);
  });
});

describe("debugFeeds", () => {
  it("makes up different Waits per source for Phantom's Revenge", () => {
    const feeds = debugFeeds();
    const tp = feeds.themeparks.attractions.find((a) => a.name === "Phantom's Revenge");
    const qt = feeds["queue-times"].attractions.find((a) => a.name === "Phantom's Revenge");
    expect(tp).toMatchObject({ isOpen: true, waitMinutes: 55 });
    expect(qt).toMatchObject({ isOpen: true, waitMinutes: 40 });
  });
});
