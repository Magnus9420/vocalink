# VocaLink — Consolidated Local Test Script (Phases 0–8, deferred testing)

Prereqs: Docker Desktop open (Engine running), fresh PowerShell.

```powershell
cd "C:\Users\Magnus PC\Desktop\QUBATORS AI FOUNDRY\Building Folder_Open Code"
docker compose up -d db
pnpm.cmd install --ignore-scripts
pnpm.cmd --filter @vocalink/db db:generate
pnpm.cmd --filter @vocalink/db db:migrate
pnpm.cmd --filter @vocalink/db db:seed
```

Expected seed: trades 11, programmes 15, opportunities 5, pathways 4.

## Web — `pnpm.cmd --filter @vocalink/web dev` → http://localhost:3000
- [ ] Home loads, nav shows Discover/Guided/Providers/Publish/Learning/Certify/Passport/Work/Search/Notifications/Messages
- [ ] Search `electrical` → results; filter Free + Lagos → narrows; Verified badges first
- [ ] Programme detail: badges, cost/format/cert info, verification note, Enrol → redirects to /learning
- [ ] /guided: answer 4 → recommendations with links
- [ ] /providers/apply → submit → applied confirmation with ID
- [ ] /programmes/new → publish → appears in Discover
- [ ] Detail: leave review (stars + count update), Report → goes to admin queue
- [ ] /learning: enrolments listed, set 100% → completed
- [ ] /certifications: 4 pathways, NSQ badges; open one → step tracker through certified
- [ ] /passport: completed training + certs listed; upload photo → file link works
- [ ] /work: 5 opportunities, filters; open → Apply → /work/applications
- [ ] /work/new: post → appears; /candidates: certified + portfolios listed
- [ ] /providers/dashboard: counts per provider; /org/publish: sponsored → Discover shows Sponsored
- [ ] /search: one query returns programmes + providers + opportunities + pathways
- [ ] /notifications: enrol/apply/message generated entries; mark-all-read; save prefs
- [ ] /messages → new message → thread → reply

## Admin — `pnpm.cmd --filter @vocalink/admin dev` → http://localhost:3001
- [ ] Dashboard: 16 metric cards (learners, providers/verified, enrolments/completed, certs, jobs, reports…)
- [ ] /verifications: pending provider → Approve → badge flips on web; Need info/Reject paths
- [ ] /users, /content (publish/hide programme, open/close opportunity), /reports (resolve/dismiss)
- [ ] /flags: turn `guided_discovery` OFF → web home hides Guided; turn back ON. Same for `jobs`, `reviews` (form hides)
- [ ] /certifications: add pathway → appears on web /certifications

## Design preview (no server)
- [ ] Double-click `Docs/design-system-preview.html` → colors, buttons, inputs, cards, §10 improvement note

Pass = all boxes ticked with no red errors. Log issues with route + message.
