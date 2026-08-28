export function formatHeight(inches: number): string {
  const ft = Math.floor(inches / 12);
  const inn = inches % 12;
  return `${ft}'${inn}"`;
}

export type HeightRule = {
  companionMinIn?: number | null;
  soloMinIn?: number | null;
  envelopeMaxIn?: number | null;
  partnerRequired?: boolean;
  heightUnknown?: boolean;
};

const IN = "″";

/** One meta-line format for published height rules. */
export function heightHint(h: HeightRule): string {
  if (h.heightUnknown) return "height unknown";
  if (h.partnerRequired && h.companionMinIn != null) {
    return `${h.companionMinIn}${IN}+ · partner`;
  }
  const companion = h.companionMinIn;
  const solo = h.soloMinIn;
  const max = h.envelopeMaxIn ?? null;
  if (companion == null && solo != null) {
    return `0${IN}+ (<${solo}${IN} requires companion)`;
  }
  const min = companion ?? solo;
  if (min == null) return "height unknown";
  const range = max != null ? `${min}–${max}${IN}` : `${min}${IN}+`;
  if (companion != null && solo != null && solo !== companion) {
    return `${range} (<${solo}${IN} requires companion)`;
  }
  return range;
}

export function parseFeetInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}
