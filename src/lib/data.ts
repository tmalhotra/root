/**
 * The app's single data entry point.
 *
 * `loadAppData()` returns the full payload the UI renders from. It tries
 * OwnerRez when credentials are present; on any failure — or when unconfigured,
 * or when USE_SEED_DATA=true — it returns the built-in 2026-season seed data so
 * the app always renders. The `source` field tells the UI which one it got.
 *
 * Messaging threads are not yet sourced from OwnerRez (see docs/ROADMAP.md), so
 * they always come from seed for now.
 */
import "server-only";
import type { AppData } from "@/lib/domain/types";
import { seedAppData } from "@/lib/domain/seed";
import { fetchOwnerRezData, ownerRezConfigFromEnv } from "@/lib/ownerrez";

export async function loadAppData(): Promise<AppData> {
  const forceSeed = process.env.USE_SEED_DATA === "true";
  const configured = !!ownerRezConfigFromEnv();

  if (forceSeed || !configured) {
    if (!configured && !forceSeed) {
      console.info("[data] OwnerRez not configured — using seed data. See .env.example / docs/OWNERREZ.md.");
    }
    return seedAppData();
  }

  try {
    const { properties, bookings } = await fetchOwnerRezData();
    const seed = seedAppData();
    return {
      properties: properties.length ? properties : seed.properties,
      bookings,
      threads: seed.threads, // TODO: source from OwnerRez messaging API
      source: "ownerrez",
    };
  } catch (err) {
    console.error("[data] OwnerRez fetch failed — falling back to seed data:", err);
    return seedAppData();
  }
}
