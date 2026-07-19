# CLAUDE.md — working notes for Claude Code

This file orients an AI coding assistant (and any new developer) working in this
repo. Read it first.

## What this is

**Dunes + Tides** is a mobile-first web app for managing a short-term rental:
the oceanfront duplex at **123 East Herbert St, Long Beach Island, NJ**, which
has three linked listings — **Tides** (upstairs), **Dunes** (downstairs), and
**Tides + Dunes** (whole house). Built with **Next.js (App Router) + TypeScript**,
deployed on **Vercel**, with **OwnerRez** as the single source of booking data.

It was recreated from a high-fidelity design prototype. The original design +
product spec lives in `docs/DESIGN_HANDOFF.md` — that is the source of truth for
look, copy, and behavior.

## Golden rules

1. **The data layer only talks to OwnerRez.** Airbnb (native) and VRBLI (iCal)
   are connected to OwnerRez *upstream*; their bookings arrive through the
   OwnerRez API. Do **not** add direct Airbnb/iCal clients to this app.
2. **No credentials required to develop.** With no `.env.local`, the app renders
   the built-in 2026-season **seed data**. This is intentional — keep it working.
3. **Business rules are pure functions** in `src/lib/domain/selectors.ts`, unit-
   tested in `selectors.test.ts`. Add new rules there, with a test. No dates/
   money/status logic in components.
4. **The design is the spec.** When building UI, match `docs/DESIGN_HANDOFF.md`.
   Components use inline style objects ported 1:1 from the prototype + tokens in
   `src/components/tokens.ts` — keep that style for visual consistency.

## Architecture at a glance

```
Airbnb ─native─┐
VRBLI ──iCal──►│ OwnerRez │ ──v2 API──► loadAppData() ──► <AppRoot data> (client)
Direct ────────┘                              │                    │
                                     seed fallback         StoreProvider (useReducer)
                                     (no creds)                     │
                                                          screens read state + run
                                                          pure selectors on data
```

- `src/lib/domain/` — types, seed fixtures, constants, **pure selectors** (+tests).
- `src/lib/ownerrez/` — API client, mapper (OwnerRez→domain), high-level fetch.
- `src/lib/data.ts` — `loadAppData()`: OwnerRez if configured, else seed. **Only
  entry point the UI uses.**
- `src/components/` — `AppShell` (frame/nav/routing), `store.tsx` (state),
  `screens/`, `sheets/`, `ui/`, `icons.tsx`, `tokens.ts`, `content.ts`.
- `src/app/` — `page.tsx` (server: loads data), `layout.tsx`, `globals.css`.

## State model

Global app state mirrors the prototype exactly — see `State` in
`src/components/store.tsx`. Access it with `useApp()`:

```ts
const { state, set, data, today } = useApp();
set({ scope: "Tides" });                 // partial patch (like setState)
set((s) => ({ calOffset: s.calOffset - 1 })); // functional update
```

`data` is the loaded `AppData` (bookings/threads/properties/source). `today` is
the date all status/calendar math is relative to (see below).

## Commands

```bash
npm run dev        # local dev at http://localhost:3000
npm run build      # production build (Vercel runs this)
npm run typecheck  # tsc --noEmit
npm test           # vitest — the selector unit tests
npm run lint       # next lint
```

## Things that will bite you

- **"today" is pinned.** `store.tsx` uses `REFERENCE_TODAY` (2026-07-18) so the
  demo matches the mockups. For a live launch, switch it to `new Date()`.
- **Dates are `[month, day]` tuples**, month **0-based** (Jun=5). The OwnerRez
  mapper converts real ISO dates into these. See `toSeasonDate` in the mapper.
- **Reconciling with live OwnerRez data?** Everything to adjust (field names,
  the property_id→unit map, channel names, payout source) is isolated in
  `src/lib/ownerrez/mapper.ts`. Start there. See `docs/OWNERREZ.md`.
- **Door codes + AI replies are stubs.** `genDoorCode` is deterministic; smart
  replies just close the thread. Wiring points are noted in `docs/ROADMAP.md`.
- **Fonts** load via `<link>` in `layout.tsx` (not `next/font`) so builds never
  depend on a font fetch. `Unbounded` stands in for the design's `Mafinest`.

## Where to look next

- `docs/OWNERREZ.md` — connect a real OwnerRez account.
- `docs/DEPLOY.md` — ship to Vercel.
- `docs/ARCHITECTURE.md` — deeper tour + how to add a screen.
- `docs/ROADMAP.md` — prioritized next features (this is your to-do list).
