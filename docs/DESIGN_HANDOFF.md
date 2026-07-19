# Handoff: Dunes + Tides — Short-Term Rental Property Manager

## Overview
Dunes + Tides is a **mobile-first property-management app** for a solo host who manages
short-term vacation rentals. The founding property is an oceanfront duplex at
**123 East Herbert St, Long Beach Island (LBI), NJ 08008** with two independently
bookable units — **Tides** (upstairs) and **Dunes** (downstairs) — plus a
**whole-house "Tides + Dunes"** listing that books both at once. The app is built to
scale to additional properties over time.

The product's signature ideas:
- **One duplex, three linked listings** with shared availability (booking the whole
  house blocks the two units, and vice-versa).
- **Tide**, an AI co-pilot that drafts guest replies and optimizes operations.
- **Batched cleaning turnovers** — when both units flip within 24h (or a whole-house
  week ends), one combined cleaning visit is scheduled instead of two, saving a trip fee.
- **Multi-listing scoping** — a global "Viewing" selector filters every stat and view
  to All listings → a property → an individual unit.
- **Integrations** with channels (Airbnb, VRBLI), a PMS (OwnerRez), and a Yale smart lock
  with auto-rotating door codes.

## About the Design Files
The file in this bundle (`Dunes + Tides.dc.html`) is a **design reference created in
HTML** — a working prototype showing the intended look, layout, copy, and interaction
behavior. **It is not production code to ship.** It is authored as a "Design Component"
(a single self-contained HTML file with an inline template + a `Component` logic class);
that format is specific to the prototyping environment and should **not** be reproduced
verbatim.

The task is to **recreate these designs in the target codebase's environment** using its
established patterns and libraries. Given this is a mobile-first product, a React Native /
Expo app or a responsive React (Vite/Next) PWA are both reasonable targets — pick whatever
matches the team's stack. Treat the HTML as the source of truth for **visual design,
copy, and behavior**, and re-implement the data/logic cleanly against a real backend.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, layout, copy, and interactions are
all specified. Recreate the UI pixel-accurately using the codebase's component library.
The prototype's data is hard-coded sample data (a real 2026 booking season) — in
production it must come from the PMS/channel APIs.

---

## Personas
- **Shefali Kakar (primary)** — solo host/owner. Wants to run the whole operation from her
  phone, customize it to her workflow, and let automation handle repetitive work.
- **Guest** — books via Airbnb, VRBLI, or direct; messages the host; receives a door code.
- **Cleaner (external)** — "Coastal Turnovers Co." receives batched turnover jobs (not a
  direct app user in this version).

## Domain Model (entities)
- **Property** — e.g. `123 East Herbert St`. Has an address and one or more **Units**.
- **Unit / Listing** — `Tides` (upstairs), `Dunes` (downstairs), and `Tides + Dunes`
  (whole house). The whole-house listing is a composite that, when booked, makes the two
  single units unavailable for the same dates (shared availability / linked calendars).
- **Booking (Reservation)** — guest, unit (`Tides` | `Dunes` | `Both`), channel, check-in,
  check-out, guest count, net payout. Status is derived from dates relative to "today".
- **Channel** — Airbnb, VRBLI (Vacation Rentals LBI). Bookings originate on a channel.
- **PMS** — OwnerRez (central booking/channel hub).
- **Cleaning turnover** — derived from checkouts; batched when units flip together.
- **Door code** — per-booking Yale keypad code; auto-rotates each stay.
- **Message thread** — per guest; may contain AI-drafted replies and smart-reply chips.
- **Automation** — host-toggleable rules (batching, pricing, check-in msg, review request,
  gap-fill, door-code rotation).

---

## User Stories & Acceptance Criteria

### Epic A — Multi-listing scoping
**A1.** *As a host, I want to switch what I'm "viewing" (all listings, a property, or a
single unit) so that every stat and calendar reflects that scope.*
- AC1: A "Viewing" selector is visible on Home and Bookings (not on Inbox/More).
- AC2: Tapping it opens a bottom sheet grouped by property: **All listings**, then under
  "123 East Herbert St": **Entire property**, **Tides**, **Dunes**.
- AC3: Selecting a scope updates: hero image, KPIs (Booked $, Occupancy, ADR, Rating/Stays),
  revenue-by-month chart, revenue-by-channel split, the calendar bars, the bookings list,
  and Today items.
- AC4: Scope = a single unit includes that unit's bookings **plus** whole-house ("Both")
  bookings that occupy it.
- AC5: The active scope shows a check; the selector label shows the scope name + subtitle.

### Epic B — Home / dashboard
**B1.** *As a host, I want an at-a-glance dashboard so I can see the day's activity and
performance.*
- AC1: Home shows a hero image (scope-dependent; "All" = LBI lighthouse) with the address
  and a location pin, contained within the screen (no full-bleed past the device frame).
- AC2: A **Today** section renders as a horizontally **swipable row** of compact cards, one
  per arrival/departure in the next 24h. Each card: colored top accent, status pill
  (Arriving/Departing), guest name, detail line, unit. Tapping a card opens the booking.
- AC3: A 2×2 **KPI grid**: Booked · 2026, Occupancy, ADR / Unit, Rating.
- AC4: A **Revenue · 2026** card: monthly bar chart (Jun–Sep) + revenue-by-channel bars.
- AC5: All values recompute from the current scope.

### Epic C — Bookings (calendar + list)
**C1.** *As a host, I want a monthly calendar of reservations so I can see occupancy at a glance.*
- AC1: Bookings tab defaults to **Monthly** view with a **Monthly / List** toggle.
- AC2: Month grid shows weeks with day numbers and per-night prices on open days.
- AC3: Multi-day reservations render as **continuous horizontal bars labeled with the guest
  name**, colored by unit: Tides `#20B7E6`, Dunes `#FF9F45`, whole-house `#FF6F61`.
- AC4: When scope is a single unit, bars render full-height; when "all"/property, Tides bars
  sit in the top lane and Dunes in the bottom lane; whole-house spans both.
- AC5: Each **cleaning/turnover day** shows a **broom icon** on that day cell.
- AC6: Month nav (prev / Today / next). Tapping a day reveals that day's stays.
- AC7: **List** view shows all season stays sorted by check-in, each with guest, dates,
  channel, unit, and status; tapping opens the booking.

**C2.** *As a host, I want a reservation detail page.*
- AC1: Shows unit, status pill, guest, **channel badge/icon** (Airbnb logo / VRBLI mark),
  check-in & check-out (with unit-specific times), guests, nights, net payout.
- AC2: If the Yale automation is on, a **Yale door code** card shows the code, its active
  window, and a **Change** action.
- AC3: **Change** requires a **double confirm** ("This reprograms the lock and texts the
  guest — continue?" → Cancel / Yes, change code) before generating a new code.
- AC4: A **Message guest** button opens that guest's thread.

### Epic D — Inbox / messaging
**D1.** *As a host, I want a unified inbox with AI-assisted replies.*
- AC1: Inbox lists threads with avatar, name, unit tag, snippet, timestamp, unread dot.
- AC2: Opening a thread shows the conversation; host and AI messages are right-aligned,
  guest left-aligned; **AI-drafted** messages are badged "Tide drafted this".
- AC3: A horizontally scrollable row of **smart-reply chips** appears above the composer.
- AC4: The app bar shows a back button, the guest name, and unit · channel.

### Epic E — Listings
**E1.** *As a host, I want to see and drill into each listing.*
- AC1: Listings (under More) shows the three listings with photo, floor label, summer rate,
  layout, and status; plus an "Add listing" affordance.
- AC2: Tapping a listing opens a **detail page**: hero photo, beds/baths/sleeps, summer
  rate, description, amenities checklist, and a **View bookings** button that jumps to
  Bookings scoped to that listing.
- AC3: The whole-house listing states that booking it blocks the two individual units.

### Epic F — Cleaning / turnovers
**F1.** *As a host, I want turnovers auto-scheduled and batched to save trips.*
- AC1: Cleaning schedule (under More) lists upcoming turnovers derived from checkouts.
- AC2: When both units flip within 24h (or a whole-house week ends), the turnovers are
  merged into one **Combined · 1 trip** visit tagged "Saved $45".
- AC3: Batching is controlled by the "Batch turnovers" automation toggle; turning it off
  splits combined visits back into per-unit visits.

### Epic G — Automations
**G1.** *As a host, I want toggleable automation rules.*
- AC1: Automations (under More) lists rules with title, description, and a toggle:
  Batch turnovers, Auto-rotate Yale door codes, Smart nightly pricing, Auto check-in
  message, Auto review request, Gap-night fill.
- AC2: Toggling "Batch turnovers" immediately changes the cleaning schedule and calendar.
- AC3: Toggling "Auto-rotate Yale door codes" shows/hides the door-code card on bookings.

### Epic H — Integrations
**H1.** *As a host, I want to manage connected systems.*
- AC1: Integrations (under More) has two sections: **Property Management Systems**
  (OwnerRez — central booking/channel hub) and **Smart Home** (Yale Smart Lock).
- AC2: Yale shows "Codes auto-rotate every stay" when its automation is on, plus
  "Manage codes" (→ Bookings) and "Settings".
- AC3: (Channels like Airbnb/VRBLI are managed **through** the PMS; there is no separate
  Channels section in this version.)

### Epic I — Tide AI co-pilot (cross-cutting)
**I1.** *As a host, I want an AI co-pilot that drafts replies and optimizes ops.*
- AC1: AI-drafted guest replies are labeled in threads and offered as smart-reply chips.
- AC2: Operational suggestions (e.g., combined turnover timing/savings) surface in context.

---

## Navigation & Information Architecture
Bottom tab bar (5 tabs): **Home · Bookings · Inbox · More**, plus a channel-sync icon and
avatar in the top app bar. (Note: the tab row currently renders Home, Bookings, Inbox, More;
the old separate Calendar tab was merged into Bookings.)
- **More** hub → Listings, Cleaning schedule, Automations, Analytics, Integrations, Sign out.
- Detail/overlay screens (thread, reservation, listing detail, scope sheet) push over tabs
  with a back button in the app bar; the bottom nav persists except within a message thread.

## Interactions & Behavior
- **Screen transitions:** subtle fade/slide-up (`dtFade`, ~0.28s ease-out).
- **Bottom sheets** (scope selector, property sheet): slide up (`dtSheet`, ~0.26s ease-out)
  over a dark scrim; tap scrim to dismiss.
- **Swipable Today row & smart replies & calendar:** horizontal scroll, hidden scrollbars.
- **Toggles:** knob slides 0.18s ease; track fills accent when on.
- **Door-code change:** two-step confirm (never single-tap destructive).
- **Month calendar:** horizontal day columns; "today" highlighted; whole-house bookings
  span both unit lanes.

## State Management
Prototype state (recreate as app state / server data):
- `scope` (`all` | `p1` | `Tides` | `Dunes`) — global viewing scope; drives all derived stats.
- `tab` (`home` | `bookings` | `inbox` | `more`) and `moreView`
  (`listings` | `cleaning` | `automations` | `analytics` | `connections`).
- `bookingsView` (`month` | `list`).
- `openThreadId`, `selBookingId`, `selListing` — active detail overlays.
- `calOffset` (month paging), `selDay` (selected calendar day).
- `codeConfirm` (door-code double-confirm in progress), `codeOverrides` (per-booking code).
- `autos` — automation toggles: `{ batch, lock, price, checkin, review, gap }`.
- `scopeOpen`, `propSheetOpen` — sheet visibility.

Derived (compute server-side or in selectors):
- Booking **status** from dates vs today (Arriving/Departing today/tomorrow, In-house,
  Checked out, Upcoming).
- **Cleaning groups** (batched by checkout date when `autos.batch`).
- **KPIs / revenue / channel split** from the scoped booking set.
- **Door code** = deterministic per booking unless overridden.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| Canvas (device desk) | `#e2e6ea`–`#eef1f4` | app background gradient |
| Screen surface | `#F4F2ED` | phone screen base |
| Card / surface | `#FFFFFF` | cards, sheets, list rows |
| Ink / primary text | `#1D1D1B` | headings, values |
| Body text | `#2b2823` | paragraphs |
| Muted text | `#6f6a62` | labels, secondary |
| Faint text | `#8f8a82` | tertiary |
| Hairline | `rgba(0,0,0,.06–.08)` | borders, dividers |
| **Accent (ocean blue)** | `#20B7E6` | primary accent, Tides, CTAs, links |
| Accent deep | `#0e7fa6` / `#245ABC` | pressed/links, VRBLI mark |
| **Dunes (amber)** | `#FF9F45` | Dunes unit, departing |
| **Whole house (coral)** | `#FF6F61` | Tides + Dunes bookings |
| Airbnb brand | `#FF5A5F` | Airbnb references |
| Tag tints | `rgba(32,183,230,.12)` · `rgba(255,159,69,.14)` · `rgba(255,111,97,.14)` | status pills |

### Typography
- **Display:** `Mafinest` (italic, uppercase) for screen titles, big numbers, unit names.
  Fallbacks: Poppins/Unbounded. Line-height ~1, tight tracking.
- **UI / body:** `Poppins` (300–700). Buttons, nav, labels, paragraphs.
- **Monospace:** `ui-monospace, 'SF Mono', monospace` for door codes.
- Scale (px): eyebrow/label 10–11 (letter-spacing .1–.18em, 600–700), body 12–14,
  titles 15–17, section headers 28, big display numbers 24–30.

### Spacing / radius / shadow
- Spacing: 4 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 22 / 24.
- Screen padding: 16–18px horizontal.
- Radius: cards 14–20, tiles/icons 11–12, pills/toggles 100, sheets 26 (top corners),
  phone frame 44.
- Device frame: `max-width:404px`, inset bezel via `inset 0 0 0 6px #0f0d0b`,
  shadow `0 30px 70px rgba(60,60,80,.22)`.

### Icons
Line icons, 1.6–1.8 stroke, rounded caps/joins (Tabler/Lucide style). Cleaning = **broom**
(`M14 4l6 6l-4 4l-6 -6z M13 11l-6 6 M17 15l-6 6 M4 20l3.5 -3.5`). Channel-sync = refresh
loop. Home/Bookings(calendar)/Inbox/More in the tab bar.

---

## Assets
Bundled in `assets/` (see the `assets/` folder copied alongside this README):
- `lbi-hero-wide.png` — Barnegat Lighthouse ("Old Barney"), cropped wide — the **"All
  listings"** hero. Source: user-provided.
- `herbert-both.png` — aerial of the 123 East Herbert St duplex — **whole-house / property**
  hero and listing photo. Source: user-provided (Bright MLS listing photo).
- `airbnb-logo.png` — Airbnb wordmark, used on channel references. Source: user-provided.
- Tides & Dunes unit photos are referenced by remote URL from vacationrentalslbi.com in the
  prototype; replace with owned/licensed photography in production.

Real sample data (a full 2026 LBI summer season — 18 bookings across Tides, Dunes, and 3
whole-house weeks) is embedded in the prototype's logic class and can be lifted as seed/test
data. Channels present: Airbnb and VRBLI (Vacation Rentals LBI). Cleaner: Coastal Turnovers Co.

## Files
- `Dunes + Tides.dc.html` — the complete high-fidelity prototype (all screens, states, and
  sample data). Open in a browser to interact with it. Read its `Component` class for the
  exact derived-data logic (status, batching, KPIs, door codes, scoping).
- `assets/` — images listed above.

## Notes for implementation
- Enforce **linked availability**: creating/holding a whole-house booking must block the two
  unit calendars for those dates, and any unit booking must block the whole-house listing.
- Booking **status** and **cleaning batching** are pure functions of dates + toggles —
  implement as testable selectors.
- Door-code generation is a stub in the prototype; wire it to the Yale API and schedule
  activation (recommended **3 days before check-in**, active check-in→checkout).
- Replace hard-coded sample bookings/threads with PMS (OwnerRez) + channel API data.
