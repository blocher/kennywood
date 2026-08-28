import { describe, expect, it } from "vitest";
import { renderBoard } from "./board";
import { debugFeeds } from "./debugFeed";

function rowSlice(html: string, name: string): string {
  const nameIdx = html.indexOf(`<span class="name">${name}</span>`);
  if (nameIdx < 0) throw new Error(`missing ${name}`);
  const liStart = html.lastIndexOf("<li", nameIdx);
  const liEnd = html.indexOf("</li>", nameIdx);
  return html.slice(liStart, liEnd);
}

describe("renderBoard", () => {
  it("shows the inactive source Wait smaller in the same row", () => {
    const feeds = debugFeeds();
    const html = renderBoard(feeds.themeparks, {
      source: "themeparks",
      altFeed: feeds["queue-times"],
    });
    const slice = rowSlice(html, "Phantom's Revenge");
    expect(slice).toContain('class="wait-alt"');
    expect(slice).toContain(">40</span>");
    expect(slice).toContain('class="wait">55</span>');
    expect(slice).toContain("Wait 55, Queue-Times 40");
  });

  it("omits the comparison Wait when the other source has no matching Attraction", () => {
    const feeds = debugFeeds();
    const html = renderBoard(feeds.themeparks, {
      source: "themeparks",
      altFeed: feeds["queue-times"],
    });
    const slice = rowSlice(html, "Cosmic Chaos");
    expect(slice).toContain('class="wait">35</span>');
    expect(slice).not.toContain("wait-alt");
  });
});
