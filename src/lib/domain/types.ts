/**
 * Domain model for Dunes + Tides.
 *
 * These types are the app's own shape — deliberately decoupled from OwnerRez's
 * API shape. The OwnerRez adapter (src/lib/ownerrez) maps raw API records into
 * these; the seed fixtures (seed.ts) produce the same types. Everything above
 * the data layer (selectors, UI) speaks only this language.
 */

/** A physical property that contains one or more bookable units. */
export interface Property {
  id: string;
  name: string;
  /** Human address line, e.g. "Long Beach, NJ 08008". */
  city: string;
  /** Short summary of the units, e.g. "Tides + Dunes". */
  units: string;
}

/**
 * Which unit a booking occupies.
 * - "Tides"  — upstairs unit
 * - "Dunes"  — downstairs unit
 * - "Both"   — whole-house booking (blocks both units for the dates)
 */
export type Unit = "Tides" | "Dunes" | "Both";

/** Booking origination channel. */
export type Channel = "Airbnb" | "VRBLI" | "Direct" | string;

/** A [month, day] tuple in the 2026 season (month is 0-based, JS-style). */
export type SeasonDate = [month: number, day: number];

/** A reservation. Dates are stored as season tuples to mirror the prototype's
 *  seed format; the adapter converts real ISO dates into these. */
export interface Booking {
  id: string;
  unit: Unit;
  guest: string;
  ch: Channel;
  /** Check-in  [month, day] (0-based month). */
  s: SeasonDate;
  /** Check-out [month, day] (0-based month). */
  e: SeasonDate;
  guests: number;
  /** Net payout to the host, in whole dollars. */
  payout: number;
}

export type MessageAuthor = "guest" | "you" | "ai";

export interface Message {
  from: MessageAuthor;
  text: string;
  time: string;
}

export interface Thread {
  id: string;
  name: string;
  unit: Unit;
  ch: Channel;
  unread: boolean;
  time: string;
  snippet: string;
  messages: Message[];
  /** Tide smart-reply suggestions. */
  quick: string[];
}

/** Host-toggleable automation rules. */
export interface Automations {
  batch: boolean;
  lock: boolean;
  price: boolean;
  checkin: boolean;
  review: boolean;
  gap: boolean;
}

export type AutomationKey = keyof Automations;

/** The global "Viewing" scope that filters every derived stat. */
export type Scope = "all" | "p1" | "Tides" | "Dunes";

/** A booking's derived status relative to "today". */
export interface BookingStatus {
  label: string;
  color: string;
}

/** A cleaning turnover, optionally batched across both units. */
export interface CleaningGroup {
  date: Date;
  combined: boolean;
  units: Unit[];
}

/** The complete data payload the app renders from — produced by either the
 *  OwnerRez adapter or the seed fixtures. */
export interface AppData {
  properties: Property[];
  bookings: Booking[];
  threads: Thread[];
  /** Where this data came from — surfaced in the UI/logs for clarity. */
  source: "ownerrez" | "seed";
}
