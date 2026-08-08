import { parseFeetInches } from "./heightFormat";

export type Rider = {
  id: string;
  name: string;
  heightIn: number;
};

const STORAGE_KEY = "kennywood-waits:group";

export function loadGroup(): Rider[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Rider[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => r && typeof r.id === "string" && typeof r.name === "string" && typeof r.heightIn === "number");
  } catch {
    return [];
  }
}

export function saveGroup(riders: Rider[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(riders));
}

export function createRider(name: string, feet: number, inches: number): Rider {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    heightIn: parseFeetInches(feet, inches),
  };
}
