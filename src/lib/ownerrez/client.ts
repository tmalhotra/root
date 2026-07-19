/**
 * Low-level OwnerRez v2 API client.
 *
 * Auth is HTTP Basic: username = your OwnerRez login email, password = a
 * Personal Access Token (OwnerRez → Settings → API Access). See docs/OWNERREZ.md.
 *
 * This file only knows how to *talk* to OwnerRez (auth, pagination, errors).
 * Turning raw records into our domain model lives in ./mapper.ts.
 */

const BASE_URL = "https://api.ownerrez.com/v2";

export interface OwnerRezConfig {
  email: string;
  token: string;
}

/** Read credentials from the environment. Returns null when unconfigured. */
export function ownerRezConfigFromEnv(): OwnerRezConfig | null {
  const email = process.env.OWNERREZ_EMAIL;
  const token = process.env.OWNERREZ_ACCESS_TOKEN;
  if (!email || !token) return null;
  return { email, token };
}

/** OwnerRez paginates list endpoints with this envelope. */
interface Paged<T> {
  items: T[];
  count?: number;
  limit?: number;
  offset?: number;
  nextPageUrl?: string | null;
}

function authHeader({ email, token }: OwnerRezConfig): string {
  // btoa is available in the Node 18+/Edge runtimes Next.js uses.
  return "Basic " + Buffer.from(`${email}:${token}`).toString("base64");
}

async function get<T>(config: OwnerRezConfig, path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: authHeader(config),
      Accept: "application/json",
      // OwnerRez asks integrations to send a descriptive User-Agent.
      "User-Agent": "DunesAndTides/0.1 (+https://github.com/tmalhotra/root)",
    },
    // Bookings change often; don't let Next cache stale data at the fetch layer.
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OwnerRez ${res.status} ${res.statusText} for ${url}${body ? ` — ${body.slice(0, 300)}` : ""}`);
  }
  return (await res.json()) as T;
}

/** Follow OwnerRez pagination to collect every item from a list endpoint. */
async function getAll<T>(config: OwnerRezConfig, path: string): Promise<T[]> {
  const out: T[] = [];
  let next: string | null = path;
  // Safety valve so a malformed nextPageUrl can't loop forever.
  for (let page = 0; next && page < 100; page++) {
    const data: Paged<T> = await get<Paged<T>>(config, next);
    if (Array.isArray(data.items)) out.push(...data.items);
    next = data.nextPageUrl || null;
  }
  return out;
}

// ── Raw OwnerRez record shapes (partial — only the fields we read) ────────────
// These are intentionally loose. The exact field names should be confirmed
// against a live account (GET /v2/bookings); adjust here + in mapper.ts only.

export interface OrProperty {
  id: number;
  name?: string;
  address?: { city?: string; state?: string; postal_code?: string };
}

export interface OrGuest {
  id: number;
  first_name?: string;
  last_name?: string;
}

export interface OrBooking {
  id: number;
  property_id: number;
  guest_id?: number;
  guest?: OrGuest;
  arrival?: string; // ISO date, e.g. "2026-06-21"
  departure?: string; // ISO date
  adults?: number;
  children?: number;
  status?: string; // active | cancelled | pending
  is_block?: boolean; // owner/maintenance block, not a real reservation
  listing_site?: string; // channel: Airbnb, HomeAway/VRBO, ICal, Direct, ...
  total_amount?: number;
  total_host_revenue?: number;
}

// ── Public fetch functions ───────────────────────────────────────────────────

export function listProperties(config: OwnerRezConfig): Promise<OrProperty[]> {
  return getAll<OrProperty>(config, "/properties");
}

export function getGuest(config: OwnerRezConfig, id: number): Promise<OrGuest> {
  return get<OrGuest>(config, `/guests/${id}`);
}

/**
 * List bookings, optionally constrained to a set of property ids and an arrival
 * window. OwnerRez requires a date range on /bookings; we default to the season.
 */
export function listBookings(
  config: OwnerRezConfig,
  opts: { propertyIds?: number[]; from?: string; to?: string } = {},
): Promise<OrBooking[]> {
  const params = new URLSearchParams();
  if (opts.propertyIds?.length) params.set("property_ids", opts.propertyIds.join(","));
  params.set("from", opts.from ?? "2026-01-01");
  params.set("to", opts.to ?? "2026-12-31");
  return getAll<OrBooking>(config, `/bookings?${params.toString()}`);
}
