/** Static UI content: the three listings, More-hub items, and integration
 *  cards. Listing photos/copy come from the design handoff. Booking/stat data
 *  is separate (that comes from OwnerRez/seed via the data layer). */
import { C } from "./tokens";

export interface ListingContent {
  id: string; // "Tides" | "Dunes" | "p1" (whole house) — matches scope ids
  name: string;
  floor: string;
  color: string;
  rate: string;
  occ: string;
  statusLabel: string;
  specs: string;
  beds: string;
  baths: string;
  sleeps: string;
  desc: string;
  amenities: string[];
  photo: string;
}

const TIDES_PHOTO =
  "https://www.vacationrentalslbi.com/images/w.1280/h.853/c.1/mr.0/d.listing_photos/sd.2026-04/i.708c7ad27dd5818ce57b07b4570de77d.jpg";
const DUNES_PHOTO =
  "https://www.vacationrentalslbi.com/images/w.1280/h.853/c.1/mr.0/d.listing_photos/sd.2026-04/i.35335e988c5cc1bc6a37557999ecd8a4.jpg";

export const LISTINGS: ListingContent[] = [
  {
    id: "Tides",
    name: "Tides",
    floor: "Upstairs · Bookable alone",
    color: C.accent,
    rate: "$5,000 / wk",
    occ: "3BR · sleeps 6",
    statusLabel: "In-house",
    specs: "Private balcony · 1 car · pets OK",
    beds: "3 bed",
    baths: "2 bath",
    sleeps: "Sleeps 6",
    desc: "The upstairs unit — light-filled oceanfront living with a wraparound balcony over the dunes. Open kitchen, king primary, and two guest rooms.",
    amenities: ["Ocean-view balcony", "Central A/C", "Beach badges ×6", "Washer / dryer", "Outdoor shower", "Pet friendly"],
    photo: TIDES_PHOTO,
  },
  {
    id: "Dunes",
    name: "Dunes",
    floor: "Downstairs · Bookable alone",
    color: C.dunes,
    rate: "$5,000 / wk",
    occ: "3BR · sleeps 6",
    statusLabel: "In-house",
    specs: "Fenced yard · 2 cars · pets OK",
    beds: "3 bed",
    baths: "2 bath",
    sleeps: "Sleeps 6",
    desc: "The downstairs unit — step-out-to-the-sand living with a fenced yard and covered patio. Great for families with young kids and dogs.",
    amenities: ["Fenced yard", "Central A/C", "Beach badges ×6", "Washer / dryer", "Pack-n-play & high chair", "Pet friendly"],
    photo: DUNES_PHOTO,
  },
  {
    id: "p1",
    name: "Tides + Dunes",
    floor: "Whole house · Both units",
    color: C.whole,
    rate: "$10,000 / wk",
    occ: "6BR · sleeps 12",
    statusLabel: "Blocks both units",
    specs: "Books the entire duplex — Tides & Dunes go unavailable",
    beds: "6 bed",
    baths: "4 bath",
    sleeps: "Sleeps 12",
    desc: "The entire oceanfront duplex booked as one. Ideal for reunions and large groups — both floors, both yards, both balconies. Booking this blocks the individual Tides and Dunes listings.",
    amenities: ["Whole house · both floors", "2 kitchens", "Beach badges ×12", "Parking for 3 cars", "2 outdoor showers", "Pet friendly"],
    photo: "/assets/herbert-both.png",
  },
];

/** Hero image + labels per scope. */
export const SCOPE_HERO: Record<string, string> = {
  all: "/assets/lbi-hero-wide.png",
  p1: "/assets/herbert-both.png",
  Tides: TIDES_PHOTO,
  Dunes: DUNES_PHOTO,
};

export interface MoreItem {
  title: string;
  desc: string;
  icon: string;
  target: { tab?: "listings"; moreView?: MoreViewTarget };
}
type MoreViewTarget = "cleaning" | "automations" | "connections";

export const MORE_ITEMS: MoreItem[] = [
  { title: "Listings", desc: "Tides, Dunes & whole house", icon: "M4 20V6l8-3 8 3v14M9 20v-5h6v5", target: { tab: "listings" } },
  { title: "Cleaning schedule", desc: "Auto-batched turnovers", icon: "M14 4l6 6l-4 4l-6 -6z M13 11l-6 6 M17 15l-6 6 M4 20l3.5 -3.5", target: { moreView: "cleaning" } },
  { title: "Automations", desc: "Rules Tide runs for you", icon: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8", target: { moreView: "automations" } },
  { title: "Integrations", desc: "OwnerRez, channels & smart-home", icon: "M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4", target: { moreView: "connections" } },
];

export const AUTOMATION_DEFS: { key: keyof import("@/lib/domain/types").Automations; title: string; desc: string }[] = [
  { key: "batch", title: "Batch turnovers", desc: "Combine cleanings when both units flip within 24h — one trip instead of two." },
  { key: "lock", title: "Auto-rotate Yale door codes", desc: "Generate a unique keypad code for each stay — active at check-in, expired at checkout." },
  { key: "price", title: "Smart nightly pricing", desc: "Adjust rates by demand, season, and local LBI events." },
  { key: "checkin", title: "Auto check-in message", desc: "Send door code and parking info 24h before arrival." },
  { key: "review", title: "Auto review request", desc: "Ask happy guests for a review the morning after checkout." },
  { key: "gap", title: "Gap-night fill", desc: "Offer 1–2 night orphan gaps at a discount to avoid vacancy." },
];

/** Integration cards. Airbnb (native) and VRBLI (iCal) both flow INTO OwnerRez;
 *  the app reads everything from OwnerRez. */
export const PMS_INTEGRATIONS = [
  { name: "OwnerRez", mark: "OR", iconBg: "#1B3A5B", iconFg: "#fff", sub: "Central booking & channel hub · synced 2 min ago" },
];
export const CHANNEL_INTEGRATIONS = [
  { name: "Airbnb", mark: "A", iconBg: C.airbnb, iconFg: "#fff", sub: "Native sync via OwnerRez · Tides + Dunes" },
  { name: "VRBLI", mark: "VR", iconBg: C.vrbli, iconFg: "#fff", sub: "iCal import via OwnerRez · vacationrentalslbi.com" },
];
