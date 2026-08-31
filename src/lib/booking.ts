/**
 * Domain logic for the booking preview (`BookingMock`).
 *
 * Availability is fully deterministic — derived from the calendar date — so the
 * same slots show on every render and the demo is stable when shown to the
 * client. It is a realistic mock, not a real calendar: the real booking is
 * confirmed by email afterwards (see design/darrod-build-guide.md §7).
 */

export type ClassTypeId = "tennis-60" | "tennis-90" | "padel-60" | "coaching";

export type ClassType = {
  id: ClassTypeId;
  minutes: number;
  minPlayers: number;
  maxPlayers: number;
  /** Price in euros for a given player count. */
  price: (players: number) => number;
};

const TENNIS_TIER = [60, 80, 100, 120];
const LONG_TIER = [90, 120, 150, 180];

export const CLASS_TYPES: ClassType[] = [
  {
    id: "tennis-60",
    minutes: 60,
    minPlayers: 1,
    maxPlayers: 4,
    price: (p) => TENNIS_TIER[clampPlayers(p, 1, 4) - 1],
  },
  {
    id: "tennis-90",
    minutes: 90,
    minPlayers: 1,
    maxPlayers: 4,
    price: (p) => LONG_TIER[clampPlayers(p, 1, 4) - 1],
  },
  {
    id: "padel-60",
    minutes: 60,
    minPlayers: 2,
    maxPlayers: 4,
    price: (p) => TENNIS_TIER[clampPlayers(p, 2, 4) - 1],
  },
  {
    id: "coaching",
    minutes: 120,
    minPlayers: 1,
    maxPlayers: 2,
    price: () => 180,
  },
];

export const classTypeById = (id: ClassTypeId): ClassType =>
  CLASS_TYPES.find((c) => c.id === id) ?? CLASS_TYPES[0];

function clampPlayers(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export type Slot = { time: string; taken: boolean };

const MORNING = ["08:00", "09:00", "10:00", "11:00"];
const AFTERNOON = ["16:00", "17:00", "18:00"];
const COACHING_SLOTS = ["09:00", "16:00"];

export const isMorning = (time: string) => Number(time.slice(0, 2)) < 13;

/** Academy opening days — closed on Sunday. */
export const isOpenDay = (date: Date) => date.getDay() !== 0;

/** Small deterministic PRNG so availability never shifts between renders. */
function pseudo(seed: number) {
  let t = (seed + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function slotsForDay(date: Date, classId: ClassTypeId): Slot[] {
  if (!isOpenDay(date)) return [];
  const times = classId === "coaching" ? COACHING_SLOTS : [...MORNING, ...AFTERNOON];
  const daySeed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const takenChance = date.getDay() === 6 ? 0.55 : 0.32;
  const classOffset = CLASS_TYPES.findIndex((c) => c.id === classId) * 17;
  return times.map((time, i) => ({
    time,
    taken: pseudo(daySeed + classOffset + i * 41) < takenChance,
  }));
}

export function hasAvailability(date: Date, classId: ClassTypeId): boolean {
  return slotsForDay(date, classId).some((s) => !s.taken);
}

/** First bookable day on/after `from`, scanning up to ~4 months out. */
export function firstAvailableDay(
  classId: ClassTypeId,
  from: Date,
): Date | null {
  const cursor = startOfDay(from);
  for (let i = 0; i < 120; i++) {
    if (isOpenDay(cursor) && hasAvailability(cursor, classId)) {
      return new Date(cursor);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return null;
}

export function formatPrice(value: number, locale: string): string {
  // Design guide §4: `60 €` (ES, space before €) / `€60` (EN).
  return locale === "es" ? `${value} €` : `€${value}`;
}

export function sameDay(a: Date | null, b: Date | null): boolean {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Cells for a month grid, Monday-first, padded to full weeks. */
export function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
