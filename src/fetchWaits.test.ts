import { describe, expect, it, vi } from "vitest";
import { fetchWaits } from "./fetchWaits";

describe("fetchWaits", () => {
  it("returns ok feed on 200", async () => {
    const feed = { fetchedAt: "t", attractions: [] };
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => feed,
    });
    await expect(fetchWaits(fetcher)).resolves.toEqual({ ok: true, feed });
    expect(fetcher).toHaveBeenCalledWith("/api/queue-times", expect.any(Object));
  });

  it("returns error on 502 without losing caller last-good responsibility", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      json: async () => ({ error: "Queue-Times returned 500" }),
    });
    await expect(fetchWaits(fetcher)).resolves.toEqual({
      ok: false,
      status: 502,
      message: "Queue-Times returned 500",
    });
  });
});
