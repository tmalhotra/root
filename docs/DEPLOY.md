# Deploying to Vercel

This is a standard Next.js App Router app — Vercel builds it with zero config.

## First deploy

### Option A — Vercel dashboard (easiest)

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new) and **Import** the repo.
3. Framework preset auto-detects **Next.js**. Leave build settings default:
   - Build command: `next build`
   - Output: `.next` (managed automatically)
4. Add **Environment Variables** (Settings → Environment Variables) if you want
   live OwnerRez data — the same keys as `.env.example`:
   - `OWNERREZ_EMAIL`, `OWNERREZ_ACCESS_TOKEN`
   - `OWNERREZ_PROPERTY_ID_TIDES`, `_DUNES`, `_WHOLE`
   - (Skip them entirely to deploy the sample-data demo.)
5. **Deploy.** Every push to the default branch then auto-deploys; pull requests
   get preview URLs.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel            # first run links/creates the project
vercel --prod     # production deploy
# add env vars:
vercel env add OWNERREZ_ACCESS_TOKEN
```

## Pushing to GitHub

```bash
git add .
git commit -m "Dunes + Tides web app"
git push -u origin <your-branch>
```

Then open a PR / merge to your default branch to trigger Vercel.

## Notes

- **Env var changes require a redeploy** to take effect.
- The home route is `dynamic = "force-dynamic"` and OwnerRez fetches use
  `cache: "no-store"`, so bookings are always fresh (no stale cache to bust).
- Set env vars for **Production**, **Preview**, and **Development** as needed in
  the Vercel UI. For local dev, use `.env.local` instead.
- Node 18+ is required; Vercel's default runtime satisfies this.
- The app is a PWA (see `public/manifest.webmanifest`) so it can be "Add to Home
  Screen"-installed on a phone once deployed over HTTPS (which Vercel provides).
