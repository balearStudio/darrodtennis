/**
 * Domain logic for the booking widget (`BookingMock`).
 *
 * There is no calendar behind it: the visitor picks the times they would like,
 * and the academy confirms an actual time by email, adapting where it can. So
 * every start time in opening hours is offered and none is ever shown as taken
 * (`Slot.taken` stays for when a real calendar is wired in).
 */

export type ClassTypeId = "tennis-60" | "tennis-90" | "padel-60" | "coaching";

export type ClassType = {
  id: ClassTypeId;
  minutes: number;
  minPlayers: number;
  maxPlayers: number;
};

// No prices on the site: they depend on where the lesson happens (academy
// courts or a hotel), so the academy quotes each request by email.

export const CLASS_TYPES: ClassType[] = [
  {
    id: "tennis-60",
    minutes: 60,
    minPlayers: 1,
    maxPlayers: 4,
  },
  {
    id: "tennis-90",
    minutes: 90,
    minPlayers: 1,
    maxPlayers: 4,
  },
  {
    id: "padel-60",
    minutes: 60,
    minPlayers: 2,
    maxPlayers: 4,
  },
  {
    id: "coaching",
    minutes: 120,
    minPlayers: 1,
    maxPlayers: 2,
  },
];

export const classTypeById = (id: ClassTypeId): ClassType =>
  CLASS_TYPES.find((c) => c.id === id) ?? CLASS_TYPES[0];

export type Slot = { time: string; taken: boolean };

/** Lessons run all day: first start 08:00, last one must finish by 21:00. */
const OPEN_HOUR = 8;
const CLOSE_HOUR = 21;

/** Hourly start times that let a lesson of `minutes` end by closing time. */
function startTimes(minutes: number): string[] {
  const times: string[] = [];
  for (let h = OPEN_HOUR; h * 60 + minutes <= CLOSE_HOUR * 60; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
  }
  return times;
}

export const isMorning = (time: string) => Number(time.slice(0, 2)) < 13;

/**
 * Weekdays the academy is closed (0 = Sunday … 6 = Saturday). Empty: open
 * every day of the week, Sunday included.
 */
const CLOSED_WEEKDAYS: number[] = [];

export const isOpenDay = (date: Date) => !CLOSED_WEEKDAYS.includes(date.getDay());

/**
 * Start times offered on `date`. For today, only those still ahead of `now`, so
 * a late visit never offers a time that has passed. Client-side only: the
 * widget renders the calendar after mount, never at build time.
 */
export function slotsForDay(
  date: Date,
  classId: ClassTypeId,
  now: Date = new Date(),
): Slot[] {
  if (!isOpenDay(date)) return [];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return startTimes(classTypeById(classId).minutes)
    .filter((time) => !sameDay(date, now) || Number(time.slice(0, 2)) * 60 > nowMinutes)
    .map((time) => ({ time, taken: false }));
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

/** `YYYY-MM-DD` in local time — the stable id for a picked day. */
export function dateKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Inverse of `dateKey`; parses as local midnight, not UTC. */
export function dateFromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}
