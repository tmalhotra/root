# Dunes + Tides

A mobile-first web app for managing the **123 East Herbert St** oceanfront duplex
on Long Beach Island, NJ — three linked listings (**Tides**, **Dunes**, and the
whole-house **Tides + Dunes**), one calendar, batched cleanings, an AI co-pilot
("Tide"), and Yale smart-lock door codes. Booking data comes from **OwnerRez**.

Built with **Next.js (App Router) + TypeScript**, designed for **Vercel**.

<p align="center"><em>Home · Bookings calendar · Scope selector</em></p>

## Quick start

```bash
npm install
npm run dev          # → http://localhost:3000
```

That's it — with no credentials the app runs on a built-in **2026-season sample
dataset**, so you can explore and build the whole UI offline. To connect real
data, see **[docs/OWNERREZ.md](docs/OWNERREZ.md)**.

## How it fits together

```
Airbnb  ──native API──►  ┌──────────┐   v2 API   ┌─────────────────┐
VRBLI   ──iCal feed───►  │ OwnerRez │ ─────────► │  Dunes + Tides  │
Direct  ─────────────►   └──────────┘            └─────────────────┘
```

The app connects **only to OwnerRez**. Airbnb and VRBLI are wired into OwnerRez
upstream, so every booking flows through the OwnerRez API into this app.

## Project layout

| Path | What's there |
|------|--------------|
| `src/lib/domain/` | Types, sample data, and **pure business-rule selectors** (+ tests) |
| `src/lib/ownerrez/` | OwnerRez API client + mapping to the domain model |
| `src/lib/data.ts` | `loadAppData()` — OwnerRez with automatic seed fallback |
| `src/components/` | UI: app shell, screens, sheets, state store, icons, tokens |
| `src/app/` | Next.js routes, layout, global CSS |
| `docs/` | Design handoff (source of truth), OwnerRez + deploy guides, roadmap |

## Scripts

| Command | Does |
|---------|------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm start` | Serve a production build |
| `npm test` | Run the selector unit tests (Vitest) |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | Lint |

## Docs

- **[CLAUDE.md](CLAUDE.md)** — orientation for Claude Code / new devs (read first).
- **[docs/OWNERREZ.md](docs/OWNERREZ.md)** — connect a real OwnerRez account.
- **[docs/DEPLOY.md](docs/DEPLOY.md)** — deploy to Vercel.
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — architecture + how to extend.
- **[docs/ROADMAP.md](docs/ROADMAP.md)** — what to build next.
- **[docs/DESIGN_HANDOFF.md](docs/DESIGN_HANDOFF.md)** — the original design spec.

## Status

Feature-complete against the design prototype (all screens, scoping, calendar,
cleaning batching, automations, door codes, integrations view). Data is served
from sample fixtures until OwnerRez credentials are added. Live integrations for
door codes and AI replies are stubbed — see the roadmap.
