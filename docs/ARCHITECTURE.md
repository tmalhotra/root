# Architecture

A tour of how the app is put together, and recipes for extending it.

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│ src/app/page.tsx  (Server Component)                         │
│   await loadAppData()  ──►  <AppRoot data={...} />           │
└─────────────────────────────────────────────────────────────┘
         │ server boundary
         ▼
┌─────────────────────────────────────────────────────────────┐
│ src/components/AppRoot.tsx  (Client)                         │
│   <StoreProvider data>  →  <AppShell />                      │
│     - useReducer state (mirrors the prototype)               │
│     - screens read state + `data`, run pure selectors        │
└─────────────────────────────────────────────────────────────┘

Data:  loadAppData()  ─►  OwnerRez adapter  ─►  domain model
                       └► seed fixtures  ────┘   (types.ts)
Logic: selectors.ts (pure) — status, batching, KPIs, calendar, scoping
```

### 1. Domain (`src/lib/domain/`)

- **`types.ts`** — the app's own model (`Property`, `Booking`, `Thread`, `Scope`,
  `Automations`, `AppData`). Deliberately independent of OwnerRez's shape.
- **`constants.ts`** — season year, the pinned `REFERENCE_TODAY`, unit colors.
- **`seed.ts`** — the real 2026 season as fixtures (18 bookings, 4 threads).
- **`selectors.ts`** — **all business rules as pure functions.** Nothing here
  imports React or does I/O, so it's trivially testable and runs on server or
  client. `selectors.test.ts` covers the tricky ones.

### 2. Data adapter (`src/lib/ownerrez/` + `data.ts`)

- **`client.ts`** — authenticated `fetch` wrapper, pagination, raw record types.
- **`mapper.ts`** — the *only* place that knows OwnerRez field names; maps to the
  domain model (property_id→unit, listing_site→channel, ISO→season dates).
- **`index.ts`** — `fetchOwnerRezData()` orchestrates properties + bookings +
  guests.
- **`data.ts`** — `loadAppData()` chooses OwnerRez vs. seed and never hard-fails.

### 3. UI (`src/components/`)

- **`store.tsx`** — `StoreProvider` + `useApp()`. One state object, `set()` with
  setState-style semantics.
- **`AppShell.tsx`** — the phone frame, status bar, app bar (back/switcher/
  avatar), scope bar, bottom nav, sheet mounting, and screen routing from state.
- **`screens/`** — one file per screen. Each pulls `useApp()` and runs selectors.
- **`sheets/`** — the scope selector and property bottom sheets.
- **`ui/`** — shared pieces (e.g. `ReservationList`).
- **`tokens.ts` / `icons.tsx` / `content.ts`** — palette + type helpers, line
  icons, and static UI content (listing copy/photos, More-hub items, integration
  cards).

## Styling approach

The design prototype is entirely inline-styled. To guarantee pixel fidelity and
make the prototype→code mapping obvious, screens use inline `style` objects plus
the shared tokens in `tokens.ts` and CSS variables in `globals.css`. Keep this
convention so the app reads as one system. (If you later prefer a utility
framework, migrate token-by-token — but it isn't required.)

## Recipes

### Add a screen under "More"

1. Add a `MoreView` value in `store.tsx` and a label in `AppShell`'s
   `MORE_LABELS`.
2. Create `src/components/screens/YourScreen.tsx` (`"use client"`, pull
   `useApp()`).
3. Route it in `AppShell`'s `ActiveTab` (`if (moreView === "your") return ...`).
4. Add an entry to `MORE_ITEMS` in `content.ts` to link to it.

### Add a business rule

1. Write a pure function in `selectors.ts` taking `(bookings, ...opts)`.
2. Add a case to `selectors.test.ts`.
3. Call it from a screen. Never compute date/money/status logic inside a screen.

### Add a data field from OwnerRez

1. Add the field to `OrBooking` (or the relevant raw type) in `client.ts`.
2. Read/transform it in `mapper.ts` into the domain `Booking`.
3. Add it to the domain `types.ts` if the UI needs it.

## Testing

`npm test` runs Vitest against the selectors — the layer where correctness
actually matters (status ladder, cleaning batching, scoping, aggregates,
calendar geometry). Extend these when you add rules.
