# Roadmap / next steps

What's built, what's stubbed, and a suggested order for taking it further. Each
item points at the exact file to touch.

## ✅ Done

- All screens from the design prototype: Home, Bookings (month calendar + list),
  Inbox + thread, booking detail, listing detail, More hub, cleaning schedule,
  automations, analytics, integrations, scope + property sheets.
- Global "Viewing" scoping across every stat and view.
- Pure, tested business rules (status, cleaning batching, KPIs, revenue, channel
  split, calendar geometry, door codes).
- OwnerRez data adapter with automatic seed-data fallback.
- Vercel-ready build; PWA manifest.

## 🔜 Suggested next steps (in priority order)

### 1. Connect a live OwnerRez account
Follow `docs/OWNERREZ.md`. Verify booking field names against
`GET /v2/bookings` and adjust `src/lib/ownerrez/mapper.ts` if needed. This is the
highest-value step — it turns the demo into a real tool.

### 2. Switch "today" to the real date
`src/components/store.tsx` pins `today` to `REFERENCE_TODAY` so the demo matches
the mockups. For a live launch, set `const today = new Date()`. Double-check the
Home "Today" strip and calendar highlight still read well, then consider moving
`today` computation server-side for consistency.

### 3. Make automation toggles persist
Right now `state.autos` is in-memory (resets on reload). Persist per-user — e.g.
`localStorage` for a quick win, or a small OwnerRez/DB-backed settings store.
Touch: `src/components/store.tsx`.

### 4. Real Yale door codes
`genDoorCode()` in `selectors.ts` is a deterministic stub, and "Change code" uses
`Math.random()`. Wire these to the Yale/August API (or OwnerRez's smart-lock
integration): generate on booking, schedule activation ~3 days before check-in,
expire at checkout, and text the guest. Keep the function signatures so the UI
doesn't change. Touch: `selectors.ts` (`genDoorCode`), `screens/BookingDetail.tsx`
(`changeCode`).

### 5. Real messaging + "Tide" AI replies
Threads are seed-only today (`data.ts` always uses seed threads) and smart-reply
chips just close the thread. To make this real:
- Source threads from the OwnerRez messaging API (add to `fetchOwnerRezData`).
- Add a server action that drafts a reply with an LLM (see `docs/DESIGN_HANDOFF.md`
  for Tide's voice) and sends it via OwnerRez.
- Wire the composer + smart-reply chips in `screens/Thread.tsx`.

### 6. Authentication
There's a single host ("SK") and a decorative "Sign out" button. Add real auth
(e.g. Auth.js / Clerk) if more than one person will use it, and scope data to the
signed-in owner. Touch: `src/app/`, `AppShell.tsx`.

### 7. Multi-property support
The model already allows multiple properties (the property sheet, `Property[]`).
To truly support a second property: generalize the hard-coded `p1`/unit ids and
the scope groups in `sheets/ScopeSheet.tsx`, and derive listings from data rather
than `content.ts`.

### 8. Write actions back to OwnerRez
Everything is read-only today. Adding/editing a booking, blocking dates, or
adjusting rates would use OwnerRez's write endpoints (`POST /v2/bookings`, etc.).
Enforce **linked availability** (a whole-house booking blocks both units, and
vice-versa) — see the note in `docs/DESIGN_HANDOFF.md`.

## 🧹 Nice-to-haves

- Persist `codeOverrides` and other ephemeral state.
- Loading & error states for the OwnerRez fetch (currently silent fallback).
- Replace the vacationrentalslbi.com remote unit photos with owned/licensed
  images in `public/assets/` and `src/components/content.ts`.
- Add e2e tests (Playwright) for the main flows.
- Real app icons for the PWA manifest (currently reuses the hero image).

## Working with Claude Code on this repo

`CLAUDE.md` primes the assistant with the architecture and rules. Good first
prompts for the next session:

- "Connect this to my OwnerRez account — walk me through it." (→ docs/OWNERREZ.md)
- "Switch the app to use the real current date instead of the pinned demo date."
- "Wire up real door-code generation via the Yale API."
- "Deploy this to Vercel." (→ docs/DEPLOY.md)
