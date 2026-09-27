# Phase 0 Runbook — Local Only (no Vercel, no Supabase Cloud)

## 1. Prereqs you must install (I cannot do these for you)
- Docker Desktop for Windows (for local Postgres)
- Node.js 20 LTS + `npm i -g pnpm`
- Cloudflare account → R2 → create buckets `vocalink-portfolios` + `vocalink-private`, create R2 API token

## 2. Start
```powershell
cd "C:\Users\Magnus PC\Desktop\QUBATORS AI FOUNDRY\Building Folder_Open Code"
docker compose up -d db
copy .env.example apps\web\.env.local
# edit apps\web\.env.local: BETTER_AUTH_SECRET (32+ chars), R2 keys
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```
- Web: http://localhost:3000
- Admin: http://localhost:3001
- Mailhog (auth emails): http://localhost:8025
- Mobile: `pnpm --filter @vocalink/mobile dev` → scan with Expo Go (same WiFi)

## 3. Verify Phase 0 done
- [ ] `docker ps` shows vocalink-db
- [ ] Web loads Discover skeleton
- [ ] Register user works, row appears in `user` table (check via DBeaver on localhost:5432)
- [ ] Admin shows 6 feature flags
- [ ] R2 presigned upload returns URL (needs real R2 keys)

## 4. Push
```powershell
git add .
git commit -m "Phase 0: monorepo + local Postgres + Better Auth + R2 + local hosting"
git push
```

Phase 1 next: real Discover (categories, search/filters, programme detail, Guided Discovery rules).
