import { describe, expect, it } from "vitest";
import { renderBoard } from "./board";
import { debugFeeds } from "./debugFeed";
import { defaultFilters } from "./filters";

function rowSlice(html: string, name: string): string {
  const nameIdx = html.indexOf(`<span class="name">${name}</span>`);
  if (nameIdx < 0) throw new Error(`missing ${name}`);
  const liStart = html.lastIndexOf("<li", nameIdx);
  const liEnd = html.indexOf("</li>", nameIdx);
  return html.slice(liStart, liEnd);
}

describe("renderBoard", () => {
  it("shows Posted in Park and Listed in App as equal peers", () => {
    const feeds = debugFeeds();
    const html = renderBoard(feeds["queue-times"], {
      appFeed: feeds.themeparks,
    });
    const slice = rowSlice(html, "Phantom's Revenge");
    expect(slice).toContain('class="wait-source posted"');
    expect(slice).toContain('class="wait-source official-app"');
    expect(slice).toContain('class="wait-value">40</span>');
    expect(slice).toContain('class="wait-value">55</span>');
    expect(slice).toContain("Posted in Park 40 minutes; Listed in App 55 minutes");
    expect(slice).toContain("Posted in Park");
    expect(slice).toContain("Listed in App");
  });

  it("shows a dash for a missing Posted in Park value without hiding the Official App value", () => {
    const feeds = debugFeeds();
    const html = renderBoard(feeds["queue-times"], {
      appFeed: feeds.themeparks,
    });
    const slice = rowSlice(html, "Cosmic Chaos");
    expect(slice).toContain('class="wait-value is-word">—</span>');
    expect(slice).toContain('class="wait-value">35</span>');
    expect(slice).toContain("Posted in Park —; Listed in App 35 minutes");
  });

  it("removes the source switcher and explains both APIs", () => {
    const feeds = debugFeeds();
    const html = renderBoard(feeds["queue-times"], {
      appFeed: feeds.themeparks,
      filtersOpen: true,
      filters: defaultFilters(),
    });
    expect(html).not.toContain("set-source");
    expect(html).not.toContain("Wait data source");
    expect(html).toContain("Powered by Queue-Times.com");
    expect(html).toContain("Real Time API");
    expect(html).toContain("reads Herschend Pulse at");
    expect(html).toContain("/api/waitTimes/701");
    expect(html).toContain("observed, not yet confirmed");
    expect(html).toContain("<summary>Read more about the data</summary>");
  });

  it("offers Park and App wait sorting with Park first and selected by default", () => {
    const feeds = debugFeeds();
    const html = renderBoard(feeds["queue-times"], { appFeed: feeds.themeparks });
    const park = html.indexOf('data-sort="park"');
    const app = html.indexOf('data-sort="app"');
    expect(park).toBeGreaterThan(-1);
    expect(app).toBeGreaterThan(park);
    expect(html).toContain('data-sort="park"\n                class="on"\n                aria-pressed="true"');
  });
});
