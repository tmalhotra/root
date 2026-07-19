/**
 * High-level OwnerRez data assembly: fetch properties + bookings + guests and
 * map them into the domain model. Consumed by src/lib/data.ts.
 */
import "server-only";
import type { Property, Booking } from "@/lib/domain/types";
import {
  ownerRezConfigFromEnv,
  listProperties,
  listBookings,
  getGuest,
  type OrGuest,
} from "./client";
import { mapBookings, mapProperty, unitMapFromEnv } from "./mapper";

export { ownerRezConfigFromEnv } from "./client";

export interface OwnerRezResult {
  properties: Property[];
  bookings: Booking[];
}

/**
 * Fetch and map everything the app needs from OwnerRez. Throws on auth/network
 * errors so the caller (loadAppData) can fall back to seed data and log why.
 */
export async function fetchOwnerRezData(): Promise<OwnerRezResult> {
  const config = ownerRezConfigFromEnv();
  if (!config) throw new Error("OwnerRez not configured");

  const unitMap = unitMapFromEnv();
  const orProps = await listProperties(config);
  const propertyNames = new Map(orProps.map((p) => [p.id, p.name || ""]));

  const propertyIds = orProps.map((p) => p.id);
  const orBookings = await listBookings(config, { propertyIds });

  // Resolve guest names. Bookings may embed a guest object or just a guest_id;
  // fetch the ids we don't already have, de-duplicated.
  const guestsById = new Map<number, OrGuest>();
  const missing = new Set<number>();
  for (const b of orBookings) {
    if (b.guest?.id != null) guestsById.set(b.guest.id, b.guest);
    else if (b.guest_id != null && !guestsById.has(b.guest_id)) missing.add(b.guest_id);
  }
  await Promise.all(
    [...missing].map(async (id) => {
      try {
        guestsById.set(id, await getGuest(config, id));
      } catch {
        /* leave unresolved — mapper falls back to a generic name */
      }
    }),
  );

  // Collapse OwnerRez's three physical listings into the app's single-property
  // model. The three properties share the "123 East Herbert St" address.
  const first = orProps[0];
  const properties: Property[] = first
    ? [{ ...mapProperty(first), id: "p1", units: "Tides + Dunes" }]
    : [];

  const bookings = mapBookings(orBookings, unitMap, propertyNames, guestsById);
  return { properties, bookings };
}
