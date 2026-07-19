/**
 * Seed fixtures — a real 2026 LBI summer season lifted verbatim from the design
 * prototype. This is what renders when no live integration is configured, and
 * what the selector unit tests run against. In production the provider layer
 * (src/lib/providers) replaces this with OwnerRez / Airbnb / iCal data.
 */
import type { AppData, Automations, Property, Booking, Thread } from "./types";

export const SEED_PROPERTIES: Property[] = [
  { id: "p1", name: "123 East Herbert St", city: "Long Beach, NJ 08008", units: "Tides + Dunes" },
];

// Months are 0-based (Jun=5, Jul=6, Aug=7, Sep=8). "Both" = whole-house week.
export const SEED_BOOKINGS: Booking[] = [
  { id: "b1", unit: "Dunes", guest: "Patti Pretot", ch: "VRBLI", s: [5, 21], e: [5, 28], guests: 6, payout: 5000 },
  { id: "b2", unit: "Dunes", guest: "Corrine", ch: "VRBLI", s: [6, 3], e: [6, 6], guests: 4, payout: 2250 },
  { id: "b3", unit: "Tides", guest: "Airbnb Guest", ch: "Airbnb", s: [6, 5], e: [6, 10], guests: 3, payout: 3586 },
  { id: "b4", unit: "Tides", guest: "Amanda Immitt", ch: "VRBLI", s: [6, 10], e: [6, 19], guests: 4, payout: 6500 },
  { id: "b5", unit: "Dunes", guest: "Karen Wyckoff", ch: "VRBLI", s: [6, 12], e: [6, 19], guests: 6, payout: 6000 },
  { id: "b6", unit: "Both", guest: "Eni Zejnati", ch: "VRBLI", s: [6, 19], e: [6, 26], guests: 12, payout: 10000 },
  { id: "b7", unit: "Both", guest: "Jennifer Bini", ch: "VRBLI", s: [6, 26], e: [7, 2], guests: 12, payout: 10000 },
  { id: "b8", unit: "Both", guest: "Jackie Allen", ch: "VRBLI", s: [7, 2], e: [7, 9], guests: 12, payout: 10000 },
  { id: "b9", unit: "Dunes", guest: "Mary Castle", ch: "VRBLI", s: [7, 9], e: [7, 16], guests: 6, payout: 5000 },
  { id: "b10", unit: "Dunes", guest: "Janet Ellenblacher", ch: "VRBLI", s: [7, 16], e: [7, 23], guests: 6, payout: 5000 },
  { id: "b11", unit: "Tides", guest: "Marybeth Daly", ch: "Airbnb", s: [7, 16], e: [7, 21], guests: 4, payout: 4394 },
  { id: "b12", unit: "Tides", guest: "Mandy", ch: "VRBLI", s: [7, 21], e: [7, 27], guests: 4, payout: 4000 },
  { id: "b13", unit: "Dunes", guest: "Karen Caruso", ch: "VRBLI", s: [7, 23], e: [7, 30], guests: 6, payout: 5000 },
  { id: "b14", unit: "Tides", guest: "Nora Nagle", ch: "Airbnb", s: [7, 27], e: [7, 30], guests: 3, payout: 1820 },
  { id: "b15", unit: "Dunes", guest: "Jeanine Vollrath", ch: "Airbnb", s: [8, 1], e: [8, 5], guests: 4, payout: 2434 },
  { id: "b16", unit: "Tides", guest: "Airbnb Guest", ch: "Airbnb", s: [8, 3], e: [8, 7], guests: 3, payout: 2629 },
  { id: "b17", unit: "Tides", guest: "Susan Snedekar", ch: "VRBLI", s: [8, 12], e: [8, 18], guests: 4, payout: 3700 },
  { id: "b18", unit: "Tides", guest: "Holly", ch: "VRBLI", s: [8, 18], e: [8, 21], guests: 2, payout: 1931 },
];

export const SEED_THREADS: Thread[] = [
  {
    id: "t1", name: "Amanda Immitt", unit: "Tides", ch: "VRBLI", unread: true, time: "9:12 AM",
    snippet: "What time is checkout tomorrow? Sad to leave!",
    messages: [
      { from: "guest", text: "We've had the best week in Tides. What time is checkout tomorrow?", time: "9:12 AM" },
      { from: "ai", text: "So glad, Amanda! Checkout is 11 AM tomorrow — the cleaners come right after to flip both units for the next guests. Leave the keys on the counter and text me if you need a hand with bags.", time: "9:13 AM" },
    ],
    quick: ["Confirm 11 AM checkout", "Request a review", "Offer bag storage"],
  },
  {
    id: "t2", name: "Karen Wyckoff", unit: "Dunes", ch: "VRBLI", unread: true, time: "8:40 AM",
    snippet: "Any chance of a late checkout tomorrow?",
    messages: [
      { from: "guest", text: "Any chance of a late checkout tomorrow? Our ferry is not until the afternoon.", time: "8:40 AM" },
      { from: "ai", text: "I wish I could — but Dunes flips to a whole-house group tomorrow, so the cleaners need the unit at 11 AM. You're welcome to leave bags on the porch and enjoy the beach until your ferry.", time: "8:41 AM" },
    ],
    quick: ["Explain same-day turnover", "Offer porch bag storage", "Share beach badge return"],
  },
  {
    id: "t3", name: "Eni Zejnati", unit: "Both", ch: "VRBLI", unread: false, time: "Yesterday",
    snippet: "We are 11 people — can we check in early?",
    messages: [
      { from: "guest", text: "We're renting the whole house for the family reunion — 11 of us. Any chance of an early check-in tomorrow?", time: "Yesterday" },
      { from: "you", text: "Both units flip tomorrow morning, so earliest I can promise is 3 PM once the combined turnover wraps. I'll message the moment it's ready.", time: "Yesterday" },
    ],
    quick: ["Confirm 3 PM check-in", "Send whole-house guide", "Share parking for 4 cars"],
  },
  {
    id: "t4", name: "Nora Nagle", unit: "Tides", ch: "Airbnb", unread: false, time: "Jul 15",
    snippet: "Is there parking for two cars?",
    messages: [
      { from: "guest", text: "Booked Tides for late July — is there parking for two cars?", time: "Jul 15" },
      { from: "you", text: "Yes — Tides gets the two driveway spots on the right. I'll send the exact layout with your check-in details closer to arrival.", time: "Jul 15" },
    ],
    quick: ["Confirm 2 spots", "Send arrival details", "List amenities"],
  },
];

/** Default automation rule states. */
export const DEFAULT_AUTOMATIONS: Automations = {
  batch: true, lock: true, price: true, checkin: true, review: true, gap: false,
};

export function seedAppData(): AppData {
  return {
    properties: SEED_PROPERTIES,
    bookings: SEED_BOOKINGS,
    threads: SEED_THREADS,
    source: "seed",
  };
}
