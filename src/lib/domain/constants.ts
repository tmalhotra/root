/** Season + semantic constants shared by selectors and UI. */
import type { Unit } from "./types";

/** The season year the app operates in. All [month, day] tuples resolve to this. */
export const SEASON_YEAR = 2026;

/**
 * The "today" the seed demo is anchored to (2026-07-18), so the dashboard,
 * statuses, and calendar match the design prototype exactly. When live data is
 * connected you can pass the real `new Date()` into the selectors instead.
 */
export const REFERENCE_TODAY = new Date(SEASON_YEAR, 6, 18);

/** Semantic unit colors — the product's core palette. */
export const UNIT_COLOR: Record<Unit, string> = {
  Tides: "#20B7E6", // ocean blue
  Dunes: "#FF9F45", // amber
  Both: "#FF6F61", // whole-house coral
};

/** Status accent colors. */
export const STATUS_COLOR = {
  arriving: "#20B7E6",
  departing: "#FF9F45",
  inHouse: "#20B7E6",
  neutral: "#807b72",
} as const;
