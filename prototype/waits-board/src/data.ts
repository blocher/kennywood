/**
 * PROTOTYPE mock data — Kennywood park 312 sample waits.
 * Not live. Catalog types/heights abbreviated for UI feel only.
 */

export type RideType =
  | "roller coaster"
  | "thrill ride"
  | "family ride"
  | "dark ride / walk-on"
  | "water ride"
  | "kiddie ride"
  | "unknown";

export type Attraction = {
  id: number;
  name: string;
  isOpen: boolean;
  waitMinutes: number;
  rideType: RideType;
  heightMinIn: number | null;
  heightUnknown: boolean;
};

export const MOCK_FETCHED_AT = "2026-08-08T14:32:00.000Z";

export const MOCK_ATTRACTIONS: Attraction[] = [
  { id: 11031, name: "Phantom's Revenge", isOpen: true, waitMinutes: 55, rideType: "roller coaster", heightMinIn: 48, heightUnknown: false },
  { id: 11029, name: "Exterminator", isOpen: true, waitMinutes: 40, rideType: "roller coaster", heightMinIn: 46, heightUnknown: false },
  { id: 11027, name: "Black Widow", isOpen: true, waitMinutes: 20, rideType: "thrill ride", heightMinIn: 52, heightUnknown: false },
  { id: 11034, name: "Steel Curtain", isOpen: true, waitMinutes: 75, rideType: "roller coaster", heightMinIn: 52, heightUnknown: false },
  { id: 11024, name: "Sky Rocket", isOpen: true, waitMinutes: 35, rideType: "roller coaster", heightMinIn: 52, heightUnknown: false },
  { id: 11033, name: "SwingShot", isOpen: true, waitMinutes: 15, rideType: "thrill ride", heightMinIn: 48, heightUnknown: false },
  { id: 11037, name: "Aero 360", isOpen: true, waitMinutes: 5, rideType: "thrill ride", heightMinIn: 48, heightUnknown: false },
  { id: 11891, name: "Spinvasion", isOpen: true, waitMinutes: 25, rideType: "thrill ride", heightMinIn: 48, heightUnknown: false },
  { id: 11032, name: "Jack Rabbit", isOpen: true, waitMinutes: 30, rideType: "roller coaster", heightMinIn: 42, heightUnknown: false },
  { id: 11030, name: "Racer", isOpen: true, waitMinutes: 20, rideType: "roller coaster", heightMinIn: 46, heightUnknown: false },
  { id: 11028, name: "Thunderbolt", isOpen: false, waitMinutes: 0, rideType: "roller coaster", heightMinIn: 52, heightUnknown: false },
  { id: 11036, name: "Ghostwood Estate", isOpen: false, waitMinutes: 0, rideType: "dark ride / walk-on", heightMinIn: null, heightUnknown: true },
  { id: 11035, name: "Old Mill", isOpen: true, waitMinutes: 10, rideType: "dark ride / walk-on", heightMinIn: null, heightUnknown: true },
  { id: 12448, name: "Noah’s Ark", isOpen: true, waitMinutes: 5, rideType: "dark ride / walk-on", heightMinIn: null, heightUnknown: true },
  { id: 11025, name: "Kangaroo", isOpen: true, waitMinutes: 10, rideType: "family ride", heightMinIn: 42, heightUnknown: false },
  { id: 11026, name: "Turtle", isOpen: true, waitMinutes: 5, rideType: "family ride", heightMinIn: null, heightUnknown: true },
  { id: 12113, name: "Raging Rapids", isOpen: true, waitMinutes: 45, rideType: "water ride", heightMinIn: 43, heightUnknown: false },
  { id: 14916, name: "Pittsburg* Plunge", isOpen: true, waitMinutes: 25, rideType: "water ride", heightMinIn: 36, heightUnknown: false },
  { id: 12431, name: "Gingerbread Express", isOpen: false, waitMinutes: 0, rideType: "unknown", heightMinIn: null, heightUnknown: true },
  { id: 14377, name: "Rudolph Experience", isOpen: false, waitMinutes: 0, rideType: "dark ride / walk-on", heightMinIn: null, heightUnknown: true },
];
