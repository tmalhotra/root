import { describe, it, expect } from "vitest";
import {
  status,
  scopedBookings,
  cleaningGroups,
  bookedTotal,
  channelSplit,
  buildMonthGrid,
  genDoorCode,
  nights,
} from "./selectors";
import { SEED_BOOKINGS } from "./seed";
import { REFERENCE_TODAY } from "./constants";
import type { Booking } from "./types";

const bk = (over: Partial<Booking>): Booking => ({
  id: "x", unit: "Tides", guest: "Test Guest", ch: "Airbnb", s: [6, 18], e: [6, 22], guests: 2, payout: 1000, ...over,
});

describe("status", () => {
  const today = REFERENCE_TODAY; // 2026-07-18
  it("flags arriving/departing today", () => {
    expect(status(bk({ s: [6, 18], e: [6, 22] }), today).label).toBe("Arriving today");
    expect(status(bk({ s: [6, 12], e: [6, 18] }), today).label).toBe("Departing today");
  });
  it("flags tomorrow", () => {
    expect(status(bk({ s: [6, 19], e: [6, 25] }), today).label).toBe("Arriving tomorrow");
    expect(status(bk({ s: [6, 14], e: [6, 19] }), today).label).toBe("Departing tomorrow");
  });
  it("flags in-house, checked out, upcoming", () => {
    expect(status(bk({ s: [6, 14], e: [6, 24] }), today).label).toBe("In-house");
    expect(status(bk({ s: [6, 1], e: [6, 8] }), today).label).toBe("Checked out");
    expect(status(bk({ s: [7, 1], e: [7, 8] }), today).label).toBe("Upcoming");
  });
});

describe("scopedBookings", () => {
  it("single-unit scope includes whole-house bookings (AC A4)", () => {
    const tides = scopedBookings(SEED_BOOKINGS, "Tides");
    expect(tides.every((b) => b.unit === "Tides" || b.unit === "Both")).toBe(true);
    // Eni Zejnati is a whole-house ("Both") week and must appear under Tides.
    expect(tides.some((b) => b.guest === "Eni Zejnati")).toBe(true);
  });
  it("'all' returns everything", () => {
    expect(scopedBookings(SEED_BOOKINGS, "all").length).toBe(SEED_BOOKINGS.length);
  });
});

describe("cleaningGroups batching (AC F2/F3)", () => {
  const both = bk({ id: "w", unit: "Both", s: [6, 2], e: [6, 9] });
  it("batches a whole-house checkout into one combined trip", () => {
    const g = cleaningGroups([both], true);
    expect(g).toHaveLength(1);
    expect(g[0].combined).toBe(true);
    expect(g[0].units.sort()).toEqual(["Dunes", "Tides"]);
  });
  it("splits into per-unit visits when batching is off", () => {
    const g = cleaningGroups([both], false);
    expect(g).toHaveLength(2);
    expect(g.every((x) => !x.combined)).toBe(true);
  });
  it("batches two units flipping on the same day", () => {
    const a = bk({ id: "a", unit: "Tides", e: [6, 20] });
    const b = bk({ id: "b", unit: "Dunes", e: [6, 20] });
    expect(cleaningGroups([a, b], true).filter((x) => x.combined)).toHaveLength(1);
  });
});

describe("aggregates", () => {
  it("bookedTotal sums payouts", () => {
    expect(bookedTotal(SEED_BOOKINGS)).toBe(89_244);
  });
  it("channelSplit percentages sum to ~100", () => {
    const split = channelSplit(SEED_BOOKINGS);
    const sum = split.reduce((s, c) => s + parseInt(c.pct), 0);
    expect(Math.abs(sum - 100)).toBeLessThanOrEqual(1);
  });
  it("nights computes stay length", () => {
    expect(nights(bk({ s: [6, 10], e: [6, 17] }))).toBe(7);
  });
});

describe("buildMonthGrid", () => {
  it("produces 6 weeks of 7 days", () => {
    const grid = buildMonthGrid(SEED_BOOKINGS, "all", 0);
    expect(grid.weeks).toHaveLength(6);
    expect(grid.weeks.every((w) => w.days.length === 7)).toBe(true);
  });
  it("splits lanes when scope is 'all', full-height for single unit", () => {
    const all = buildMonthGrid(SEED_BOOKINGS, "all", 0);
    const laned = all.weeks.flatMap((w) => w.bars);
    expect(laned.some((b) => b.lane === 0 || b.lane === 1)).toBe(true);
    const tides = buildMonthGrid(SEED_BOOKINGS, "Tides", 0);
    expect(tides.weeks.flatMap((w) => w.bars).every((b) => b.lane === "both")).toBe(true);
  });
});

describe("genDoorCode", () => {
  it("is deterministic and 4 digits", () => {
    expect(genDoorCode({ id: "b1" })).toBe(genDoorCode({ id: "b1" }));
    expect(genDoorCode({ id: "b1" })).toMatch(/^\d{4}$/);
  });
});
