/**
 * OwnerRez → domain mapping.
 *
 * This is the ONE file to adjust when reconciling with a live OwnerRez account:
 * field names, the property→unit mapping, channel names, and payout source all
 * live here. Everything downstream speaks the clean domain model.
 *
 * ── The duplex, in OwnerRez ──────────────────────────────────────────────────
 * "123 East Herbert St" is three bookable listings: Tides (upstairs), Dunes
 * (downstairs), and Tides + Dunes (whole house). In OwnerRez these are almost
 * certainly three separate *properties*, each with its own property_id, mapped
 * to the same channels. We translate each OwnerRez property_id to a Unit via the
 * env-configured map below. Confirm the ids with GET /v2/properties.
 */
import type { Booking, Channel, Unit } from "@/lib/domain/types";
import type { OrBooking, OrGuest, OrProperty } from "./client";

export interface UnitMap {
  tides?: number;
  dunes?: number;
  whole?: number;
}

/** Read the OwnerRez property_id → unit mapping from the environment. */
export function unitMapFromEnv(): UnitMap {
  const num = (v?: string) => (v ? Number(v) : undefined);
  return {
    tides: num(process.env.OWNERREZ_PROPERTY_ID_TIDES),
    dunes: num(process.env.OWNERREZ_PROPERTY_ID_DUNES),
    whole: num(process.env.OWNERREZ_PROPERTY_ID_WHOLE),
  };
}

/** Which unit an OwnerRez property_id represents. */
export function unitForProperty(propertyId: number, map: UnitMap, fallbackName?: string): Unit {
  if (map.whole && propertyId === map.whole) return "Both";
  if (map.tides && propertyId === map.tides) return "Tides";
  if (map.dunes && propertyId === map.dunes) return "Dunes";
  // Fall back to name matching so it still works before ids are configured.
  const n = (fallbackName || "").toLowerCase();
  if (n.includes("both") || n.includes("whole") || (n.includes("tides") && n.includes("dunes"))) return "Both";
  if (n.includes("dunes")) return "Dunes";
  return "Tides";
}

/** Normalize OwnerRez's listing_site into our Channel labels. */
export function channelFromListingSite(site?: string): Channel {
  const s = (site || "").toLowerCase();
  if (s.includes("airbnb")) return "Airbnb";
  // VRBLI is imported into OwnerRez as an iCal feed; its listing_site is often a
  // custom name or "ical". Treat non-Airbnb imports as VRBLI for this account.
  if (s.includes("ical") || s.includes("vrbli") || s.includes("vacationrentalslbi")) return "VRBLI";
  if (!site || s.includes("direct") || s.includes("owner")) return "Direct";
  return site; // pass through anything else (e.g. VRBO/HomeAway) unchanged
}

function guestName(b: OrBooking, guestsById: Map<number, OrGuest>): string {
  const g = b.guest ?? (b.guest_id != null ? guestsById.get(b.guest_id) : undefined);
  const name = [g?.first_name, g?.last_name].filter(Boolean).join(" ").trim();
  return name || (channelFromListingSite(b.listing_site) === "Airbnb" ? "Airbnb Guest" : "Guest");
}

/** ISO "2026-06-21" → [month(0-based), day]. */
function toSeasonDate(iso?: string): [number, number] {
  if (!iso) return [0, 1];
  const [, m, d] = iso.split("T")[0].split("-").map(Number);
  return [m - 1, d];
}

/** Whole dollars of host payout for a booking. */
function payoutOf(b: OrBooking): number {
  // Prefer the host-revenue figure; fall back to gross, then 0.
  return Math.round(b.total_host_revenue ?? b.total_amount ?? 0);
}

export function mapProperty(p: OrProperty): { id: string; name: string; city: string } {
  const city = [p.address?.city, p.address?.state, p.address?.postal_code].filter(Boolean).join(", ");
  return { id: String(p.id), name: p.name || "Property", city };
}

/**
 * Map raw OwnerRez bookings into domain Bookings. Drops owner/maintenance
 * blocks and cancellations. `guestsById` supplies names when the booking record
 * only carries a guest_id.
 */
export function mapBookings(
  raw: OrBooking[],
  unitMap: UnitMap,
  propertyNames: Map<number, string>,
  guestsById: Map<number, OrGuest>,
): Booking[] {
  return raw
    .filter((b) => !b.is_block && (b.status ?? "active").toLowerCase() === "active")
    .map((b) => ({
      id: String(b.id),
      unit: unitForProperty(b.property_id, unitMap, propertyNames.get(b.property_id)),
      guest: guestName(b, guestsById),
      ch: channelFromListingSite(b.listing_site),
      s: toSeasonDate(b.arrival),
      e: toSeasonDate(b.departure),
      guests: (b.adults ?? 0) + (b.children ?? 0) || 1,
      payout: payoutOf(b),
    }));
}
