# Connecting OwnerRez

The app reads all booking data from **OwnerRez**. Airbnb (native) and VRBLI
(iCal) are connected to OwnerRez upstream — you configure those *inside*
OwnerRez, not in this app. With no credentials, the app falls back to sample
data, so this is optional for UI work but required for real data.

## 1. Create a Personal Access Token

1. Log in to OwnerRez.
2. Go to **Settings → API Access** (Account → API Access on some plans).
3. **Create Access Token**, name it e.g. "Dunes + Tides app", and copy it.

Auth is HTTP Basic: **username = your OwnerRez login email**, **password = the
token**. Test it:

```bash
curl -u you@example.com:pt_YOURTOKEN https://api.ownerrez.com/v2/properties
```

## 2. Find your property ids and map them to units

The duplex is three separate listings in OwnerRez (Tides, Dunes, whole house),
each its own property with an id. List them:

```bash
curl -u you@example.com:pt_YOURTOKEN https://api.ownerrez.com/v2/properties
```

Note the `id` and `name` of each. You'll map each id to a unit so bookings land
in the right calendar lane.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
OWNERREZ_EMAIL=you@example.com
OWNERREZ_ACCESS_TOKEN=pt_YOURTOKEN

OWNERREZ_PROPERTY_ID_TIDES=123456   # the "Tides" property id
OWNERREZ_PROPERTY_ID_DUNES=123457   # the "Dunes" property id
OWNERREZ_PROPERTY_ID_WHOLE=123458   # the whole-house property id

# USE_SEED_DATA=true                 # force sample data even with creds (demos)
```

Verify the connection and auto-discover your ids with the built-in checker:

```bash
npm run ownerrez:check
```

It prints your properties, a suggested `OWNERREZ_PROPERTY_ID_*` mapping to paste,
and a season booking count. (It uses `curl`, so it works through the proxy inside
a Claude Code web environment; it never prints your token.)

Then restart `npm run dev`. On the **More → Integrations** screen the OwnerRez
card shows "synced" (green) instead of "showing demo data" when live data loads.

> **Running inside a Claude Code web session?** Outbound traffic is proxied and
> `api.ownerrez.com` must be allowed by the session's network policy. The app's
> server-side fetch honors the `HTTPS_PROXY` automatically (via undici); on
> Vercel there's no proxy and it's a no-op.

> If the property_id vars are left blank, the mapper falls back to matching by
> property **name** (looks for "tides"/"dunes"/"whole"), so it can work before
> you've pinned the ids — but setting the ids is more reliable.

## 4. Reconciling field names with a live account

The app maps OwnerRez records into its own model in **one file**:
`src/lib/ownerrez/mapper.ts`. If a live account uses different field names than
the client assumes, adjust them there — nothing else needs to change. The fields
the app reads from a booking:

| App needs | OwnerRez field (assumed) | Notes |
|-----------|--------------------------|-------|
| unit | `property_id` → unit map | Tides / Dunes / Both |
| guest name | `guest.first_name`/`last_name` or `guest_id` | falls back to a generic name |
| channel | `listing_site` | Airbnb / iCal→VRBLI / Direct |
| check-in / out | `arrival` / `departure` | ISO dates → `[month, day]` |
| guests | `adults` + `children` | |
| payout | `total_host_revenue` ?? `total_amount` | pick what your account exposes |
| filtering | `status`, `is_block` | drops cancellations + owner blocks |

Confirm the exact shapes against `GET /v2/bookings` for your account and tweak
`mapBookings` / the `OrBooking` interface in `src/lib/ownerrez/client.ts`.

## How the fallback works

`src/lib/data.ts` decides the source on each request:

- No credentials, or `USE_SEED_DATA=true` → **seed data**.
- Credentials present → fetch OwnerRez; **on any error, log it and fall back to
  seed** so the app never hard-fails.

The active source is surfaced as `data.source` (`"ownerrez"` | `"seed"`).

## Security

- Keep tokens in `.env.local` (git-ignored) and Vercel **Environment Variables**.
  Never commit them.
- All OwnerRez calls run **server-side** (Server Components / `server-only`
  modules); the token is never shipped to the browser.
