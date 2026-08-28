export type RideType =
  | "roller coaster"
  | "thrill ride"
  | "family ride"
  | "dark ride / walk-on"
  | "water ride"
  | "kiddie ride"
  | "unknown";

export const ALL_LANDS = [
  "Kennywood Junction",
  "Kenny Lane",
  "Lost Kennywood",
  "Kiddieland",
  "The Lagoon",
  "Main Midway",
  "Kennyville",
  "Area 412",
  "Steelers Country",
] as const;

export type RideLand = (typeof ALL_LANDS)[number];

export type CatalogEntry = {
  id: number;
  name: string;
  rideType: RideType;
  land?: RideLand;
  /** Lowest rideable height (inches), including companion bands; null if unknown. */
  envelopeMinIn: number | null;
  /** Max height inches if published; null = unbounded. */
  envelopeMaxIn: number | null;
  /** Minimum with a supervising companion; null = none. */
  companionMinIn: number | null;
  /** Minimum without a companion; null = none or partner-required. */
  soloMinIn: number | null;
  partnerRequired?: boolean;
  allowsInfants?: boolean;
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

type HeightIn = {
  c: number | null;
  s: number | null;
  max?: number;
  partner?: true;
  infants?: true;
};

function entry(
  id: number,
  name: string,
  rideType: RideType,
  land: RideLand | undefined,
  height: HeightIn | null,
  extras: { themeParksId?: string; notes?: string; queueTimesId?: number | null } = {},
): CatalogEntry {
  const companionMinIn = height?.c ?? null;
  const soloMinIn = height?.s ?? null;
  const envelopeMaxIn = height?.max ?? null;
  const envelopeMinIn =
    height == null ? null : height.partner ? companionMinIn : (companionMinIn ?? 0);
  const queueTimesId =
    extras.queueTimesId === null ? undefined : (extras.queueTimesId ?? (id < 900000 ? id : undefined));
  return {
    id,
    name,
    rideType,
    ...(land ? { land } : {}),
    companionMinIn,
    soloMinIn,
    envelopeMinIn,
    envelopeMaxIn,
    ...(height?.partner ? { partnerRequired: true } : {}),
    ...(height?.infants ? { allowsInfants: true } : {}),
    ...(queueTimesId != null ? { queueTimesId } : {}),
    ...(extras.themeParksId ? { themeParksId: extras.themeParksId } : {}),
    ...(extras.notes ? { notes: extras.notes } : {}),
  };
}

/** Static Attraction catalog keyed by stable catalog id (QT id or local). */
export const ATTRACTION_CATALOG: Record<number, CatalogEntry> = {
  11037: entry(11037, "Aero 360", "thrill ride", "The Lagoon", { c: 48, s: 48 }, { themeParksId: "26450f3b-5bd4-46e1-a10a-9e1de3ba7223" }),
  11027: entry(11027, "Black Widow", "thrill ride", "Lost Kennywood", { c: 52, s: 52 }, { themeParksId: "77ac9a56-8606-4f84-822f-540c99e88f4e" }),
  11029: entry(11029, "Exterminator", "roller coaster", "Lost Kennywood", { c: 46, s: 59 }, { themeParksId: "82394792-c4b4-430a-9278-18cb69ef2764" }),
  11036: entry(11036, "Ghostwood Estate", "dark ride / walk-on", "Kennyville", { c: null, s: 46 }, { themeParksId: "a99ad8d7-fac2-458f-a26a-e58824855126" }),
  12431: entry(12431, "Gingerbread Express", "unknown", undefined, null, { notes: "Seasonal; height unknown; QT-only" }),
  11032: entry(11032, "Jack Rabbit", "roller coaster", "Main Midway", { c: 42, s: 48 }, { themeParksId: "c1bef986-6753-4dc0-9363-eacced64543a" }),
  11025: entry(11025, "Kangaroo", "family ride", "Main Midway", { c: 42, s: 48 }, { themeParksId: "6816d6bb-08bd-44e8-a112-f73b2c133d4b" }),
  12448: entry(12448, "Noah’s Ark", "dark ride / walk-on", "Kennyville", { c: null, s: 46 }, { themeParksId: "db999e65-3114-410b-9362-a673f1148e1d" }),
  11035: entry(11035, "Old Mill", "dark ride / walk-on", "Main Midway", { c: null, s: 46 }, { themeParksId: "81fdad42-4ee8-4ba0-8322-86ec668c5f65" }),
  11031: entry(11031, "Phantom's Revenge", "roller coaster", "Kenny Lane", { c: 48, s: 48 }, { themeParksId: "64a07ec5-0a73-4f35-a739-862c626cf39a" }),
  14916: entry(14916, "Pittsburg* Plunge", "water ride", "Lost Kennywood", { c: 36, s: 46 }, { themeParksId: "6039cbdd-6b50-427b-a13b-2e7ba8660511" }),
  11030: entry(11030, "Racer", "roller coaster", "The Lagoon", { c: 46, s: 46 }, { themeParksId: "3144cde8-276e-4c31-8a70-70ae606eaa30" }),
  12113: entry(12113, "Raging Rapids", "water ride", "Kennyville", { c: 43, s: 51 }, { themeParksId: "dd5946cb-2980-4243-a52b-fc8b16e9134d" }),
  14377: entry(14377, "Rudolph the Red-Nosed Reindeer Experience", "dark ride / walk-on", undefined, null, { notes: "Seasonal; height unknown; QT-only" }),
  11024: entry(11024, "Sky Rocket", "roller coaster", "Main Midway", { c: 52, s: 55 }, { themeParksId: "a50ea26f-36b3-4f63-b975-a3ad0200177a" }),
  11891: entry(11891, "Spinvasion", "thrill ride", "Area 412", { c: 48, s: 48 }, { themeParksId: "54d64c4e-8fec-4acd-85e0-706acd64f797" }),
  11034: entry(11034, "Steel Curtain", "roller coaster", "Steelers Country", { c: 52, s: 52, max: 77 }, { themeParksId: "bfbc7208-ec9d-4331-9d40-60059c5f154a" }),
  11033: entry(11033, "SwingShot", "thrill ride", "Lost Kennywood", { c: 48, s: 48 }, { themeParksId: "5c32b1c0-90c4-425d-8ccb-8361c6878f4a" }),
  11028: entry(11028, "Thunderbolt", "roller coaster", "Kennyville", { c: 52, s: null, partner: true }, { themeParksId: "4b42f171-5117-4903-89a5-17e8405230f7", notes: "Partner required" }),
  11026: entry(11026, "Turtle", "family ride", "Kennyville", { c: null, s: 46 }, { themeParksId: "d1204ad4-901c-431a-a392-1c41293bfa55" }),
  900001: entry(900001, "Auto Race", "family ride", "The Lagoon", { c: null, s: 46 }, { themeParksId: "adb65ee3-c608-474f-ac58-98d4434ecea8" }),
  900002: entry(900002, "Cosmic Chaos", "thrill ride", "Area 412", { c: 48, s: 48 }, { themeParksId: "645ca1d2-42d2-47c8-9ae0-6db5ae0644a6" }),
  900003: entry(900003, "Merry-Go-Round", "family ride", "The Lagoon", { c: null, s: 46, infants: true }, { themeParksId: "d9cbba3b-1949-4878-b520-d6647195b859" }),
  900004: entry(900004, "Musik Express", "thrill ride", "Kenny Lane", { c: 50, s: 50 }, { themeParksId: "0333cb8a-c49b-4c10-a87f-abc5ed634567" }),
  900005: entry(900005, "Wave Swinger", "family ride", "Lost Kennywood", { c: 46, s: 46 }, { themeParksId: "eb0d896a-0fdd-45b4-83ab-37791d78ac64" }),
  900006: entry(900006, "Whip", "family ride", "Lost Kennywood", { c: null, s: 46 }, { themeParksId: "266d5a9e-a126-4937-a20d-32f5e13ceafd" }),
  900007: entry(900007, "Potato Smash", "family ride", "Kenny Lane", { c: 42, s: 48 }, { themeParksId: "0d4fb290-ff28-45d2-b718-8ee0ad348753" }),
  900008: entry(900008, "Pirate", "thrill ride", "Kenny Lane", { c: 39, s: 48 }, { themeParksId: "0f9c1674-0d34-4127-8bf3-f8062f265cbf", notes: "Temporarily unavailable" }),
  900009: entry(900009, "Olde Kennywood Railroad", "family ride", "Kennywood Junction", { c: null, s: 46, infants: true }, { themeParksId: "59e960ac-6fdd-4184-9a85-736533637404" }),
  900010: entry(900010, "Paddle Boats", "family ride", "The Lagoon", { c: null, s: 46 }, { themeParksId: "0fc717d8-97f5-4123-a95c-22f9e5d62676", notes: "Additional fee" }),
  900011: entry(900011, "Kenny's Cargo Drop", "family ride", "Kennywood Junction", { c: 42, s: 42 }, { themeParksId: "506832a1-1746-4c6f-892a-388229ebe3cd" }),
  900012: entry(900012, "Coal Haulin’ Convoy", "family ride", "Kennywood Junction", { c: null, s: 36 }, { themeParksId: "cb9cb785-2b48-4f52-8a8e-80ddcabfec39" }),
  900013: entry(900013, "Crazy Trolley", "kiddie ride", "Kiddieland", { c: null, s: 42 }, { themeParksId: "5904c673-8f0c-4d32-9da8-5845ed3bf7e9" }),
  900014: entry(900014, "Dizzy Dynamo", "kiddie ride", "Kiddieland", { c: null, s: 36 }, { themeParksId: "63f05bdc-f7df-4e62-87e4-5552c225d6b9" }),
  900015: entry(900015, "Fire Bustin’ Brigade", "family ride", "Kennywood Junction", { c: null, s: 36 }, { themeParksId: "885bd94b-e9a2-435b-8efc-fd8ef507ab57", notes: "Temporarily unavailable" }),
  900016: entry(900016, "Kenny's Karousel", "kiddie ride", "Kiddieland", { c: 36, s: 36, max: 52 }, { themeParksId: "1ca9f7b0-a227-4cae-abcd-1dc3310fc7fc" }),
  900017: entry(900017, "Lil’ Phantom", "roller coaster", "Kiddieland", { c: null, s: 36 }, { themeParksId: "ad7474ed-ddef-4522-a21e-4f8135f5dedb" }),
  900018: entry(900018, "Parker's Cloud Cruisers", "family ride", "Kennywood Junction", { c: null, s: 36 }, { themeParksId: "b45e74b8-29d5-4c86-a764-cbd8bdee301f" }),
  900019: entry(900019, "Red Baron", "kiddie ride", "Kiddieland", { c: 36, s: 36, max: 56 }, { themeParksId: "2d1be033-b0c7-4e13-b8bb-2aefadf62430" }),
  900020: entry(900020, "Steel City Choppers", "kiddie ride", "Kiddieland", { c: 36, s: 36, max: 56 }, { themeParksId: "b701e926-22ce-468a-8166-824194586c73" }),
  900021: entry(900021, "Turtle Chase", "kiddie ride", "Kiddieland", { c: null, s: 42 }, { themeParksId: "fc20b059-3321-45b0-838f-8b9fb5f18381" }),
  900022: entry(900022, "Wacky Wheel", "kiddie ride", "Kiddieland", { c: 36, s: 36, max: 52 }, { themeParksId: "f32c4d44-c1b7-43de-818c-31724ec25e33" }),
  900023: entry(900023, "Whippersnapper", "kiddie ride", "Kiddieland", { c: 36, s: 36, max: 52 }, { themeParksId: "4132c478-e403-4f98-9604-e60b34268971" }),
  900024: entry(900024, "Whirlwind", "kiddie ride", "Kiddieland", { c: 36, s: 36, max: 48 }, { themeParksId: "83c15ada-bfb0-4c12-9a15-21bce69b4eca" }),
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
