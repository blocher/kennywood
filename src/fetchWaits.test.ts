import { describe, expect, it, vi } from "vitest";
import { fetchWaits } from "./fetchWaits";

describe("fetchWaits", () => {
  it("returns ok feed on 200", async () => {
    const feed = { fetchedAt: "t", source: "themeparks", attractions: [] };
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => feed,
    });
    await expect(fetchWaits("themeparks", fetcher)).resolves.toEqual({ ok: true, feed });
    expect(fetcher).toHaveBeenCalledWith("/api/waits?source=themeparks", expect.any(Object));
  });

  it("returns error on 502 without losing caller last-good responsibility", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      json: async () => ({ error: "ThemeParks.wiki returned 500" }),
    });
    await expect(fetchWaits("themeparks", fetcher)).resolves.toEqual({
      ok: false,
      status: 502,
      message: "ThemeParks.wiki returned 500",
    });
  });
});
