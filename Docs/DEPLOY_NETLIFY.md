# Deploy VocaLink (web) to Netlify — beginner steps

Netlify hosts the **app only**. Your database is local Docker, which Netlify
cannot reach, so you need free hosted Postgres first (Neon free tier).

## Step 1 — Free hosted Postgres (Neon)
1. https://neon.tech → Sign up (email/GitHub, no card for free tier).
2. Create project `vocalink` (region closest to Nigeria/Europe, e.g. EU).
3. Copy the **pooled** connection string:
   `postgresql://user:pass@host/db?sslmode=require`
4. From your PC, point at it once to create tables + demo data:
```powershell
cd "C:\Users\Magnus PC\Desktop\QUBATORS AI FOUNDRY\Building Folder_Open Code"
$env:DATABASE_URL = "paste-neon-string-here"
pnpm.cmd --filter @vocalink/db db:migrate
pnpm.cmd --filter @vocalink/db db:seed
```

## Step 2 — Netlify site
1. https://app.netlify.com → Sign up (GitHub button — use your account).
2. **Add new site → Import an existing project** → GitHub → `Magnus9420/vocalink`.
3. Build settings (auto-filled from `netlify.toml`, verify):
   - Build command: `pnpm --filter @vocalink/web build`
   - Publish directory: `apps/web/.next`
4. **Environment variables** (Site settings → Environment variables → Add):
   - `DATABASE_URL` = Neon string from Step 1
   - `BETTER_AUTH_SECRET` = any random 32+ chars
   - `BETTER_AUTH_URL` = `https://YOUR-SITE.netlify.app` (fix after first deploy)
   - `NEXT_PUBLIC_APP_URL` = same URL
   - `GEMINI_API_KEY` = your AI Studio key (optional; empty = rules-only)
   - `GEMINI_MODEL` = `gemini-2.5-flash`
   - `NODE_VERSION` = `20`
5. **Deploy site**. First URL looks like `https://random-name.netlify.app`.
6. Go back and set `BETTER_AUTH_URL`/`NEXT_PUBLIC_APP_URL` to that URL →
   **Deploys → Trigger deploy** once more.

## Step 3 — Verify live
- Home, search, detail, `/guided`, `/learning`, `/work`, `/passport` load.
- Admin app is NOT on this site (deploy it separately later the same way
  with build `pnpm --filter @vocalink/admin build`, publish `apps/admin/.next`).

## Known limits (demo deployment)
- Portfolio uploads use local disk on Netlify = **wiped on redeploy**.
  Production fix: Cloudflare R2 keys (needs card) — code switches automatically.
- Expo mobile is NOT deployable to Netlify (native app; use Expo/EAS later).
- Keep Neon free-tier limits in mind (storage/compute hours reset monthly).
