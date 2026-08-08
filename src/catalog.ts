export type RideType =
  | "roller coaster"
  | "thrill ride"
  | "family ride"
  | "dark ride / walk-on"
  | "water ride"
  | "kiddie ride"
  | "unknown";

export type CatalogEntry = {
  id: number;
  rideType: RideType;
  /** Lowest rideable height (inches), including companion bands; null if unknown. */
  envelopeMinIn: number | null;
  /** Max height inches if published; null = unbounded. */
  envelopeMaxIn: number | null;
  notes?: string;
};

/** Static Attraction catalog keyed by Queue-Times id (research draft). */
export const ATTRACTION_CATALOG: Record<number, CatalogEntry> = {
  11037: { id: 11037, rideType: "thrill ride", envelopeMinIn: 48, envelopeMaxIn: null },
  11027: { id: 11027, rideType: "thrill ride", envelopeMinIn: 52, envelopeMaxIn: null },
  11029: { id: 11029, rideType: "roller coaster", envelopeMinIn: 46, envelopeMaxIn: null, notes: "Companion 46–59″" },
  11036: { id: 11036, rideType: "dark ride / walk-on", envelopeMinIn: null, envelopeMaxIn: null },
  12431: { id: 12431, rideType: "unknown", envelopeMinIn: null, envelopeMaxIn: null, notes: "Seasonal; height unknown" },
  11032: { id: 11032, rideType: "roller coaster", envelopeMinIn: 42, envelopeMaxIn: null, notes: "Companion 42–48″" },
  11025: { id: 11025, rideType: "family ride", envelopeMinIn: 42, envelopeMaxIn: null, notes: "Companion 42–48″" },
  12448: { id: 12448, rideType: "dark ride / walk-on", envelopeMinIn: null, envelopeMaxIn: null },
  11035: { id: 11035, rideType: "dark ride / walk-on", envelopeMinIn: null, envelopeMaxIn: null },
  11031: { id: 11031, rideType: "roller coaster", envelopeMinIn: 48, envelopeMaxIn: null },
  14916: { id: 14916, rideType: "water ride", envelopeMinIn: 36, envelopeMaxIn: null, notes: "Companion 36–46″" },
  11030: { id: 11030, rideType: "roller coaster", envelopeMinIn: 46, envelopeMaxIn: null },
  12113: { id: 12113, rideType: "water ride", envelopeMinIn: 43, envelopeMaxIn: null, notes: "Companion 43–51″" },
  14377: {
    id: 14377,
    rideType: "dark ride / walk-on",
    envelopeMinIn: null,
    envelopeMaxIn: null,
    notes: "Seasonal; height unknown",
  },
  11024: { id: 11024, rideType: "roller coaster", envelopeMinIn: 52, envelopeMaxIn: null, notes: "Companion 52–55″" },
  11891: { id: 11891, rideType: "thrill ride", envelopeMinIn: 48, envelopeMaxIn: null },
  11034: { id: 11034, rideType: "roller coaster", envelopeMinIn: 52, envelopeMaxIn: 77 },
  11033: { id: 11033, rideType: "thrill ride", envelopeMinIn: 48, envelopeMaxIn: null },
  11028: { id: 11028, rideType: "roller coaster", envelopeMinIn: 52, envelopeMaxIn: null, notes: "Partner required (not modeled)" },
  11026: { id: 11026, rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null },
};

export function lookupCatalog(id: number): CatalogEntry | undefined {
  return ATTRACTION_CATALOG[id];
}
