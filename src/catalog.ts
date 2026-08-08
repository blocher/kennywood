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
  name: string;
  rideType: RideType;
  /** Lowest rideable height (inches), including companion bands; null if unknown. */
  envelopeMinIn: number | null;
  /** Max height inches if published; null = unbounded. */
  envelopeMaxIn: number | null;
  /** Queue-Times ride id when this Attraction appears in park 312 feed. */
  queueTimesId?: number;
  /** ThemeParks.wiki attraction entity UUID when tracked there. */
  themeParksId?: string;
  notes?: string;
};

/** Local ids for Attractions Queue-Times does not track (stable; avoid QT collisions). */
export const LOCAL_CATALOG_ID = {
  autoRace: 900001,
  cosmicChaos: 900002,
  merryGoRound: 900003,
  musikExpress: 900004,
  waveSwinger: 900005,
  whip: 900006,
  potatoSmash: 900007,
  pirate: 900008,
  oldeKennywoodRailroad: 900009,
  paddleBoats: 900010,
  kennysCargoDrop: 900011,
  coalHaulinConvoy: 900012,
  crazyTrolley: 900013,
  dizzyDynamo: 900014,
  fireBustinBrigade: 900015,
  kennysKarousel: 900016,
  lilPhantom: 900017,
  parkersCloudCruisers: 900018,
  redBaron: 900019,
  steelCityChoppers: 900020,
  turtleChase: 900021,
  wackyWheel: 900022,
  whippersnapper: 900023,
  whirlwind: 900024,
} as const;

/** Static Attraction catalog keyed by stable catalog id (QT id or local). */
export const ATTRACTION_CATALOG: Record<number, CatalogEntry> = {
  11037: { id: 11037, name: "Aero 360", rideType: "thrill ride", envelopeMinIn: 48, envelopeMaxIn: null, queueTimesId: 11037, themeParksId: "26450f3b-5bd4-46e1-a10a-9e1de3ba7223" },
  11027: { id: 11027, name: "Black Widow", rideType: "thrill ride", envelopeMinIn: 52, envelopeMaxIn: null, queueTimesId: 11027, themeParksId: "77ac9a56-8606-4f84-822f-540c99e88f4e" },
  11029: { id: 11029, name: "Exterminator", rideType: "roller coaster", envelopeMinIn: 46, envelopeMaxIn: null, queueTimesId: 11029, themeParksId: "82394792-c4b4-430a-9278-18cb69ef2764", notes: "Companion 46–59″" },
  11036: { id: 11036, name: "Ghostwood Estate", rideType: "dark ride / walk-on", envelopeMinIn: null, envelopeMaxIn: null, queueTimesId: 11036, themeParksId: "a99ad8d7-fac2-458f-a26a-e58824855126" },
  12431: { id: 12431, name: "Gingerbread Express", rideType: "unknown", envelopeMinIn: null, envelopeMaxIn: null, queueTimesId: 12431, notes: "Seasonal; height unknown; QT-only" },
  11032: { id: 11032, name: "Jack Rabbit", rideType: "roller coaster", envelopeMinIn: 42, envelopeMaxIn: null, queueTimesId: 11032, themeParksId: "c1bef986-6753-4dc0-9363-eacced64543a", notes: "Companion 42–48″" },
  11025: { id: 11025, name: "Kangaroo", rideType: "family ride", envelopeMinIn: 42, envelopeMaxIn: null, queueTimesId: 11025, themeParksId: "6816d6bb-08bd-44e8-a112-f73b2c133d4b", notes: "Companion 42–48″" },
  12448: { id: 12448, name: "Noah’s Ark", rideType: "dark ride / walk-on", envelopeMinIn: null, envelopeMaxIn: null, queueTimesId: 12448, themeParksId: "db999e65-3114-410b-9362-a673f1148e1d" },
  11035: { id: 11035, name: "Old Mill", rideType: "dark ride / walk-on", envelopeMinIn: null, envelopeMaxIn: null, queueTimesId: 11035, themeParksId: "81fdad42-4ee8-4ba0-8322-86ec668c5f65" },
  11031: { id: 11031, name: "Phantom's Revenge", rideType: "roller coaster", envelopeMinIn: 48, envelopeMaxIn: null, queueTimesId: 11031, themeParksId: "64a07ec5-0a73-4f35-a739-862c626cf39a" },
  14916: { id: 14916, name: "Pittsburg* Plunge", rideType: "water ride", envelopeMinIn: 36, envelopeMaxIn: null, queueTimesId: 14916, themeParksId: "6039cbdd-6b50-427b-a13b-2e7ba8660511", notes: "Companion 36–46″" },
  11030: { id: 11030, name: "Racer", rideType: "roller coaster", envelopeMinIn: 46, envelopeMaxIn: null, queueTimesId: 11030, themeParksId: "3144cde8-276e-4c31-8a70-70ae606eaa30" },
  12113: { id: 12113, name: "Raging Rapids", rideType: "water ride", envelopeMinIn: 43, envelopeMaxIn: null, queueTimesId: 12113, themeParksId: "dd5946cb-2980-4243-a52b-fc8b16e9134d", notes: "Companion 43–51″" },
  14377: { id: 14377, name: "Rudolph the Red-Nosed Reindeer Experience", rideType: "dark ride / walk-on", envelopeMinIn: null, envelopeMaxIn: null, queueTimesId: 14377, notes: "Seasonal; height unknown; QT-only" },
  11024: { id: 11024, name: "Sky Rocket", rideType: "roller coaster", envelopeMinIn: 52, envelopeMaxIn: null, queueTimesId: 11024, themeParksId: "a50ea26f-36b3-4f63-b975-a3ad0200177a", notes: "Companion 52–55″" },
  11891: { id: 11891, name: "Spinvasion", rideType: "thrill ride", envelopeMinIn: 48, envelopeMaxIn: null, queueTimesId: 11891, themeParksId: "54d64c4e-8fec-4acd-85e0-706acd64f797" },
  11034: { id: 11034, name: "Steel Curtain", rideType: "roller coaster", envelopeMinIn: 52, envelopeMaxIn: 77, queueTimesId: 11034, themeParksId: "bfbc7208-ec9d-4331-9d40-60059c5f154a" },
  11033: { id: 11033, name: "SwingShot", rideType: "thrill ride", envelopeMinIn: 48, envelopeMaxIn: null, queueTimesId: 11033, themeParksId: "5c32b1c0-90c4-425d-8ccb-8361c6878f4a" },
  11028: { id: 11028, name: "Thunderbolt", rideType: "roller coaster", envelopeMinIn: 52, envelopeMaxIn: null, queueTimesId: 11028, themeParksId: "4b42f171-5117-4903-89a5-17e8405230f7", notes: "Partner required (not modeled)" },
  11026: { id: 11026, name: "Turtle", rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null, queueTimesId: 11026, themeParksId: "d1204ad4-901c-431a-a392-1c41293bfa55" },
  900001: { id: 900001, name: "Auto Race", rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "adb65ee3-c608-474f-ac58-98d4434ecea8", notes: "No QT wait; under 46″ companion; infants not permitted" },
  900002: { id: 900002, name: "Cosmic Chaos", rideType: "thrill ride", envelopeMinIn: 48, envelopeMaxIn: null, themeParksId: "645ca1d2-42d2-47c8-9ae0-6db5ae0644a6", notes: "No QT wait; Accessibility + Attraction agree 48″" },
  900003: { id: 900003, name: "Merry-Go-Round", rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "d9cbba3b-1949-4878-b520-d6647195b859", notes: "No QT wait; under 46″ companion; infants permitted" },
  900004: { id: 900004, name: "Musik Express", rideType: "thrill ride", envelopeMinIn: 50, envelopeMaxIn: null, themeParksId: "0333cb8a-c49b-4c10-a87f-abc5ed634567", notes: "No QT wait" },
  900005: { id: 900005, name: "Wave Swinger", rideType: "family ride", envelopeMinIn: 46, envelopeMaxIn: null, themeParksId: "eb0d896a-0fdd-45b4-83ab-37791d78ac64", notes: "No QT wait" },
  900006: { id: 900006, name: "Whip", rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "266d5a9e-a126-4937-a20d-32f5e13ceafd", notes: "No QT wait; 46″ and under companion; infants not permitted" },
  900007: { id: 900007, name: "Potato Smash", rideType: "family ride", envelopeMinIn: 42, envelopeMaxIn: null, themeParksId: "0d4fb290-ff28-45d2-b718-8ee0ad348753", notes: "No QT wait; companion 42–48″; drive ≥48″" },
  900008: { id: 900008, name: "Pirate", rideType: "thrill ride", envelopeMinIn: 39, envelopeMaxIn: null, themeParksId: "0f9c1674-0d34-4127-8bf3-f8062f265cbf", notes: "No QT wait; companion 39–48″; Attraction page marked Temporarily Unavailable" },
  900009: { id: 900009, name: "Olde Kennywood Railroad", rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "59e960ac-6fdd-4184-9a85-736533637404", notes: "No QT wait; 46″ and under companion; infants permitted" },
  900010: { id: 900010, name: "Paddle Boats", rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "0fc717d8-97f5-4123-a95c-22f9e5d62676", notes: "No QT wait; under 46″ companion; infants not permitted; additional fee" },
  900011: { id: 900011, name: "Kenny's Cargo Drop", rideType: "family ride", envelopeMinIn: 42, envelopeMaxIn: null, themeParksId: "506832a1-1746-4c6f-892a-388229ebe3cd", notes: "No QT wait; Attraction Family Ride (also listed under Accessibility Children’s Rides)" },
  900012: { id: 900012, name: "Coal Haulin’ Convoy", rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "cb9cb785-2b48-4f52-8a8e-80ddcabfec39", notes: "No QT wait; under 36″ companion" },
  900013: { id: 900013, name: "Crazy Trolley", rideType: "kiddie ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "5904c673-8f0c-4d32-9da8-5845ed3bf7e9", notes: "No QT wait; under 42″ companion" },
  900014: { id: 900014, name: "Dizzy Dynamo", rideType: "kiddie ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "63f05bdc-f7df-4e62-87e4-5552c225d6b9", notes: "No QT wait; under 36″ companion" },
  900015: { id: 900015, name: "Fire Bustin’ Brigade", rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "885bd94b-e9a2-435b-8efc-fd8ef507ab57", notes: "No QT wait; under 36″ companion; Attraction page marked Temporarily Unavailable" },
  900016: { id: 900016, name: "Kenny's Karousel", rideType: "kiddie ride", envelopeMinIn: 36, envelopeMaxIn: 52, themeParksId: "1ca9f7b0-a227-4cae-abcd-1dc3310fc7fc", notes: "No QT wait" },
  900017: { id: 900017, name: "Lil’ Phantom", rideType: "roller coaster", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "ad7474ed-ddef-4522-a21e-4f8135f5dedb", notes: "No QT wait; Attraction Roller Coaster (Kiddieland); under 36″ companion" },
  900018: { id: 900018, name: "Parker's Cloud Cruisers", rideType: "family ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "b45e74b8-29d5-4c86-a764-cbd8bdee301f", notes: "No QT wait; under 36″ companion" },
  900019: { id: 900019, name: "Red Baron", rideType: "kiddie ride", envelopeMinIn: 36, envelopeMaxIn: 56, themeParksId: "2d1be033-b0c7-4e13-b8bb-2aefadf62430", notes: "No QT wait" },
  900020: { id: 900020, name: "Steel City Choppers", rideType: "kiddie ride", envelopeMinIn: 36, envelopeMaxIn: 56, themeParksId: "b701e926-22ce-468a-8166-824194586c73", notes: "No QT wait" },
  900021: { id: 900021, name: "Turtle Chase", rideType: "kiddie ride", envelopeMinIn: null, envelopeMaxIn: null, themeParksId: "fc20b059-3321-45b0-838f-8b9fb5f18381", notes: "No QT wait; under 42″ companion" },
  900022: { id: 900022, name: "Wacky Wheel", rideType: "kiddie ride", envelopeMinIn: 36, envelopeMaxIn: 52, themeParksId: "f32c4d44-c1b7-43de-818c-31724ec25e33", notes: "No QT wait" },
  900023: { id: 900023, name: "Whippersnapper", rideType: "kiddie ride", envelopeMinIn: 36, envelopeMaxIn: 52, themeParksId: "4132c478-e403-4f98-9604-e60b34268971", notes: "No QT wait" },
  900024: { id: 900024, name: "Whirlwind", rideType: "kiddie ride", envelopeMinIn: 36, envelopeMaxIn: 48, themeParksId: "83c15ada-bfb0-4c12-9a15-21bce69b4eca", notes: "No QT wait" },
};

export function normalizeAttractionName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’*]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const byQueueTimesId = new Map<number, CatalogEntry>();
const byThemeParksId = new Map<string, CatalogEntry>();
const byName = new Map<string, CatalogEntry>();

for (const entry of Object.values(ATTRACTION_CATALOG)) {
  if (entry.queueTimesId != null) byQueueTimesId.set(entry.queueTimesId, entry);
  if (entry.themeParksId) byThemeParksId.set(entry.themeParksId, entry);
  byName.set(normalizeAttractionName(entry.name), entry);
}

export function lookupCatalog(id: number): CatalogEntry | undefined {
  return ATTRACTION_CATALOG[id];
}

export function lookupCatalogByQueueTimesId(id: number): CatalogEntry | undefined {
  return byQueueTimesId.get(id);
}

export function lookupCatalogByThemeParksId(id: string): CatalogEntry | undefined {
  return byThemeParksId.get(id);
}

export function lookupCatalogByName(name: string): CatalogEntry | undefined {
  return byName.get(normalizeAttractionName(name));
}

/** Catalog Attractions that have no Queue-Times wait row (shown with unavailable Wait on QT source). */
export function catalogWithoutQueueTimes(): CatalogEntry[] {
  return Object.values(ATTRACTION_CATALOG).filter((c) => c.queueTimesId == null);
}
