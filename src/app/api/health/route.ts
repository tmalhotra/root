import { NextResponse } from "next/server";
import { loadAppData } from "@/lib/data";
import { ownerRezConfigFromEnv } from "@/lib/ownerrez";

export const dynamic = "force-dynamic";

/**
 * Diagnostic endpoint — hit /api/health to see whether the app is actually
 * talking to OwnerRez or falling back to seed data. Returns NO secrets (only
 * booleans + counts), so it's safe to leave enabled.
 */
export async function GET() {
  const configured = !!ownerRezConfigFromEnv();
  const propertyIdsMapped = !!(
    process.env.OWNERREZ_PROPERTY_ID_TIDES ||
    process.env.OWNERREZ_PROPERTY_ID_DUNES ||
    process.env.OWNERREZ_PROPERTY_ID_WHOLE
  );

  let source: "ownerrez" | "seed" = "seed";
  let bookings = 0;
  let properties = 0;
  let error: string | null = null;
  try {
    const data = await loadAppData();
    source = data.source;
    bookings = data.bookings.length;
    properties = data.properties.length;
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const connected = source === "ownerrez";
  const hint = connected
    ? "Connected to OwnerRez."
    : configured
      ? "OwnerRez credentials ARE set, but the fetch failed (auth, mapping, or network) — falling back to seed. Check the deployment's function logs for a '[data] OwnerRez fetch failed' message."
      : "OwnerRez credentials are NOT set in this environment. Add OWNERREZ_EMAIL and OWNERREZ_ACCESS_TOKEN, then redeploy.";

  return NextResponse.json(
    {
      connected,
      source,
      ownerRezConfigured: configured,
      propertyIdsMapped,
      bookings,
      properties,
      usingSeedForced: process.env.USE_SEED_DATA === "true",
      error,
      hint,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
