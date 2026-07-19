/**
 * Pure derived-data selectors.
 *
 * Every value the UI shows — statuses, KPIs, revenue, the calendar grid,
 * cleaning batches, door codes — is a pure function of (bookings, scope,
 * automations, today). No React, no I/O. This is what makes the business rules
 * testable (see selectors.test.ts) and reusable on server or client.
 */
import type {
  Booking,
  BookingStatus,
  CleaningGroup,
  Channel,
  Scope,
  Unit,
} from "./types";
import { SEASON_YEAR, REFERENCE_TODAY, UNIT_COLOR, STATUS_COLOR } from "./constants";
import type { SeasonDate } from "./types";

// ── date helpers ─────────────────────────────────────────────────────────────

/** Resolve a [month, day] season tuple to a real Date in the season year. */
export function toDate([m, d]: SeasonDate): Date {
  return new Date(SEASON_YEAR, m, d);
}
export function keyOf(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
export function dayDiff(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}
export function fmtMD(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
export function fmtWkd(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
export function money(n: number): string {
  return "$" + n.toLocaleString("en-US");
}
export function nights(b: Booking): number {
  return dayDiff(toDate(b.e), toDate(b.s));
}

// ── small presentational helpers ─────────────────────────────────────────────

export function unitColor(u: Unit): string {
  return UNIT_COLOR[u];
}
export function unitLabel(u: Unit): string {
  return u === "Both" ? "Whole house" : u;
}
export function initials(name: string): string {
  const parts = name.replace(/^The /, "").split(" ");
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

export interface ChannelInfo {
  mark: string;
  bg: string;
  fg: string;
}
export function channelInfo(ch: Channel): ChannelInfo {
  if (ch === "Airbnb") return { mark: "A", bg: "#FF5A5F", fg: "#fff" };
  if (ch === "VRBLI") return { mark: "VR", bg: "#245ABC", fg: "#fff" };
  return { mark: "D", bg: "rgba(32,183,230,.18)", fg: "#0e7fa6" };
}

// ── core business rules ──────────────────────────────────────────────────────

/**
 * A booking's status relative to `today`. Pure function of dates — the whole
 * "Arriving/Departing/In-house/Checked out/Upcoming" ladder.
 */
export function status(b: Booking, today: Date = REFERENCE_TODAY): BookingStatus {
  const t = keyOf(today);
  const s = toDate(b.s);
  const e = toDate(b.e);
  if (keyOf(e) === t) return { label: "Departing today", color: STATUS_COLOR.departing };
  if (keyOf(s) === t) return { label: "Arriving today", color: STATUS_COLOR.arriving };
  if (dayDiff(e, today) === 1) return { label: "Departing tomorrow", color: STATUS_COLOR.departing };
  if (dayDiff(s, today) === 1) return { label: "Arriving tomorrow", color: STATUS_COLOR.arriving };
  if (s < today && e > today) return { label: "In-house", color: STATUS_COLOR.inHouse };
  if (e < today) return { label: "Checked out", color: STATUS_COLOR.neutral };
  return { label: "Upcoming", color: STATUS_COLOR.neutral };
}

/**
 * Filter bookings to the current viewing scope. A single-unit scope includes
 * whole-house ("Both") bookings that occupy that unit (AC A4).
 */
export function scopedBookings(bookings: Booking[], scope: Scope): Booking[] {
  if (scope === "Tides") return bookings.filter((b) => b.unit === "Tides" || b.unit === "Both");
  if (scope === "Dunes") return bookings.filter((b) => b.unit === "Dunes" || b.unit === "Both");
  return bookings.slice();
}

/**
 * Group checkouts into cleaning turnovers. When `batch` is on and both units
 * flip on the same checkout date, they merge into one combined visit (AC F2).
 * Expects bookings already scoped.
 */
export function cleaningGroups(bookings: Booking[], batch: boolean): CleaningGroup[] {
  const groups: Record<string, { date: Date; units: Unit[] }> = {};
  bookings.forEach((b) => {
    const us: Unit[] = b.unit === "Both" ? ["Dunes", "Tides"] : [b.unit];
    const d = toDate(b.e);
    const k = keyOf(d);
    const g = (groups[k] = groups[k] || { date: d, units: [] });
    us.forEach((u) => {
      if (!g.units.includes(u)) g.units.push(u);
    });
  });
  const out: CleaningGroup[] = [];
  Object.values(groups)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach((g) => {
      if (batch && g.units.length > 1) {
        out.push({ date: g.date, combined: true, units: g.units.slice() });
      } else {
        g.units.forEach((u) => out.push({ date: g.date, combined: false, units: [u] }));
      }
    });
  return out;
}

/** Per-night rate for a given date (summer vs. shoulder). */
export function nightPrice(d: Date): number {
  const m = d.getMonth();
  const day = d.getDate();
  const summer = (m === 5 && day >= 14) || m === 6 || m === 7 || (m === 8 && day <= 5);
  return summer ? 750 : 650;
}

/**
 * Deterministic per-booking door code (stub). In production this is replaced by
 * a code returned from the Yale/OwnerRez lock API; keep the signature so the UI
 * doesn't change. See docs/ROADMAP.md.
 */
export function genDoorCode(b: Pick<Booking, "id">): string {
  const n = parseInt((b.id || "b0").slice(1)) || 1;
  return String(((n * 2473 + 1000) % 9000) + 1000);
}

// ── aggregate stats (KPIs / revenue / channels) ──────────────────────────────

export interface Kpi {
  label: string;
  value: string;
  delta: string;
}

const OCCUPANCY_BY_SCOPE: Record<Scope, string> = { all: "92%", p1: "92%", Tides: "90%", Dunes: "94%" };
const RATING_BY_SCOPE: Record<Scope, string> = { all: "5.0", p1: "5.0", Tides: "New", Dunes: "5.0" };

export function bookedTotal(bookings: Booking[]): number {
  return bookings.reduce((s, b) => s + b.payout, 0);
}
export function bookedLabelK(bookings: Booking[]): string {
  return "$" + (bookedTotal(bookings) / 1000).toFixed(1) + "K";
}

export function kpis(bookings: Booking[], scope: Scope): Kpi[] {
  const bookedK = bookedLabelK(bookings);
  return [
    { label: "BOOKED · 2026", value: bookedK, delta: bookings.length + " stays" },
    { label: "OCCUPANCY", value: OCCUPANCY_BY_SCOPE[scope] || "92%", delta: "Peak season" },
    { label: "ADR / UNIT", value: "$714", delta: "per night" },
    { label: "RATING", value: RATING_BY_SCOPE[scope] || "5.0", delta: "Guest avg" },
  ];
}

export interface MonthBar {
  m: string;
  /** 0..1 fraction of the tallest month (multiply by pixel height in the view). */
  fraction: number;
  isMax: boolean;
}
const MONTH_DEFS: [string, number][] = [["Jun", 5], ["Jul", 6], ["Aug", 7], ["Sep", 8]];

export function revenueByMonth(bookings: Booking[]): MonthBar[] {
  const totals = MONTH_DEFS.map(([, mi]) =>
    bookings.filter((b) => toDate(b.s).getMonth() === mi).reduce((s, b) => s + b.payout, 0),
  );
  const max = Math.max(1, ...totals);
  return MONTH_DEFS.map(([label], i) => ({
    m: label,
    fraction: totals[i] / max,
    isMax: totals[i] === max,
  }));
}

export interface ChannelShare {
  name: string;
  pct: string;
}
export function channelSplit(bookings: Booking[]): ChannelShare[] {
  const sums: Record<string, number> = {};
  bookings.forEach((b) => {
    sums[b.ch] = (sums[b.ch] || 0) + b.payout;
  });
  const total = bookedTotal(bookings) || 1;
  return Object.keys(sums)
    .sort((a, b) => sums[b] - sums[a])
    .map((k) => ({ name: k, pct: Math.round((sums[k] / total) * 100) + "%" }));
}

// ── "Today" strip — arrivals & departures in the next 24h ────────────────────

export interface TodayItem {
  booking: Booking;
  tag: "Arriving" | "Departing";
  detail: string;
}
const DETAIL_FOR: Record<string, string> = {
  "Departing today": "Checkout 11 AM · turnover follows",
  "Departing tomorrow": "Checks out 11 AM tomorrow",
  "Arriving today": "Checks in after 3 PM",
  "Arriving tomorrow": "Arrives tomorrow after 3 PM",
};

export function todayItems(bookings: Booking[], today: Date = REFERENCE_TODAY): TodayItem[] {
  const out: TodayItem[] = [];
  (["Departing today", "Departing tomorrow", "Arriving today", "Arriving tomorrow"] as const).forEach((label) => {
    bookings.forEach((b) => {
      if (status(b, today).label === label) {
        out.push({ booking: b, tag: label.startsWith("Departing") ? "Departing" : "Arriving", detail: DETAIL_FOR[label] });
      }
    });
  });
  return out;
}

/** Season stays sorted by check-in. */
export function reservationsByCheckIn(bookings: Booking[]): Booking[] {
  return bookings.slice().sort((a, b) => toDate(a.s).getTime() - toDate(b.s).getTime());
}

// ── month-grid calendar ──────────────────────────────────────────────────────

export interface CalDay {
  day: number;
  key: string;
  inMonth: boolean;
  isToday: boolean;
  hasClean: boolean;
  /** true when the cleaning on this day is a combined (both-unit) turnover. */
  cleanCombined: boolean;
}
export interface CalBar {
  bookingId: string;
  guest: string;
  unit: Unit;
  color: string;
  /** 0..6 column where the bar starts within the week. */
  startCol: number;
  /** number of day-columns the bar spans within the week. */
  span: number;
  startsHere: boolean;
  endsHere: boolean;
  /** which lane the bar occupies: top (0), bottom (1), or spanning both. */
  lane: 0 | 1 | "both";
  showName: boolean;
}
export interface CalWeek {
  days: CalDay[];
  bars: CalBar[];
}
export interface MonthGrid {
  label: string;
  weeks: CalWeek[];
}

/**
 * Build a 6-week month grid with per-booking bars. `scope` controls lanes: a
 * single-unit scope draws full-height bars; "all"/property splits Tides (top
 * lane) and Dunes (bottom), with whole-house spanning both (AC C4).
 */
export function buildMonthGrid(
  bookings: Booking[],
  scope: Scope,
  calOffset: number,
  today: Date = REFERENCE_TODAY,
): MonthGrid {
  const base = new Date(SEASON_YEAR, 6, 1);
  base.setMonth(base.getMonth() + calOffset);
  const gy = base.getFullYear();
  const gmo = base.getMonth();
  const label = base.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDow = new Date(gy, gmo, 1).getDay();
  const gridStart = new Date(gy, gmo, 1 - firstDow);

  const cleanMap: Record<string, boolean> = {};
  cleaningGroups(bookings, true).forEach((g) => {
    cleanMap[keyOf(g.date)] = g.combined;
  });

  const singleLane = scope === "Tides" || scope === "Dunes";
  const weeks: CalWeek[] = [];

  for (let w = 0; w < 6; w++) {
    const weekStart = new Date(gridStart);
    weekStart.setDate(gridStart.getDate() + w * 7);
    const wEndEx = new Date(weekStart);
    wEndEx.setDate(weekStart.getDate() + 7);

    const days: CalDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const key = keyOf(d);
      days.push({
        day: d.getDate(),
        key,
        inMonth: d.getMonth() === gmo,
        isToday: key === keyOf(today),
        hasClean: cleanMap[key] !== undefined,
        cleanCombined: cleanMap[key] === true,
      });
    }

    const bars: CalBar[] = [];
    bookings.forEach((b) => {
      const s = toDate(b.s);
      const e = toDate(b.e);
      const os = s > weekStart ? s : weekStart;
      const oeEx = e < wEndEx ? e : wEndEx;
      if (os < oeEx) {
        const startCol = Math.round((os.getTime() - weekStart.getTime()) / 86_400_000);
        const span = Math.round((oeEx.getTime() - os.getTime()) / 86_400_000);
        const startsHere = s >= weekStart;
        const endsHere = e <= wEndEx;
        const lane: 0 | 1 | "both" = singleLane || b.unit === "Both" ? "both" : b.unit === "Tides" ? 0 : 1;
        bars.push({
          bookingId: b.id,
          guest: b.guest,
          unit: b.unit,
          color: UNIT_COLOR[b.unit],
          startCol,
          span,
          startsHere,
          endsHere,
          lane,
          showName: startsHere || startCol === 0,
        });
      }
    });

    weeks.push({ days, bars });
  }

  return { label, weeks };
}

/** Stays that occupy a given calendar day (for the day-detail popover). */
export function staysOnDay(bookings: Booking[], dayKey: string): Booking[] {
  const [y, m, d] = dayKey.split("-").map(Number);
  const sd = new Date(y, m, d);
  return bookings.filter((b) => {
    const s = toDate(b.s);
    const e = toDate(b.e);
    return sd >= s && sd < e;
  });
}
