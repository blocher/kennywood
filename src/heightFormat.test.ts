import { describe, expect, it } from "vitest";
import { heightHint } from "./heightFormat";

describe("heightHint", () => {
  it("uses one format for a hard minimum", () => {
    expect(heightHint({ companionMinIn: 48, soloMinIn: 48 })).toBe("48″+");
  });

  it("uses a range when a maximum is published", () => {
    expect(heightHint({ companionMinIn: 36, soloMinIn: 36, envelopeMaxIn: 56 })).toBe("36–56″");
  });

  it("shows companion vs solo when they differ", () => {
    expect(heightHint({ companionMinIn: 42, soloMinIn: 48 })).toBe(
      "42″+ (<48″ requires companion)",
    );
  });

  it("shows companion-under when there is no companion minimum", () => {
    expect(heightHint({ companionMinIn: null, soloMinIn: 46 })).toBe(
      "0″+ (<46″ requires companion)",
    );
  });

  it("marks partner-required Attractions", () => {
    expect(heightHint({ companionMinIn: 52, soloMinIn: null, partnerRequired: true })).toBe(
      "52″+ · partner",
    );
  });

  it("keeps height unknown only when no rule exists", () => {
    expect(heightHint({ heightUnknown: true })).toBe("height unknown");
  });
});
