# Phase 8 — Hardening Notes (local beta)

## Done in code
- Security headers on web + admin (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`).
- App-level RBAC: Better Auth roles (`learner/provider_staff/employer/org_partner/admin`); admin routes separate app on :3001; destructive actions are admin-only server actions.
- PII: emails/contacts stay in local Postgres only; `.env*` git-ignored; uploads git-ignored; no third-party trackers wired (analytics deferred to beta).
- Anti-abuse basics: 10MB upload cap, 4-file portfolio cap, report/moderation queues, verification gate before badge.
- Backup: `scripts/backup.ps1` (`pg_dump` → `./backups/`). Drill restore command inside the script.

## Seed status (beta breadth, PRD §33 funnel measurable)
- 4 providers (2 approved, 2 pending), 15 programmes (all 11 trades, 4 states), 5 opportunities, 4 certification pathways, 6 flags ON.
- North-star query for beta: count learners moving Skill → Training (enrolments) → Certification (learner_certifications=certified) → Work (applications).

## Deferred (documented, not forgotten)
- Auth UI (register/login screens), SMS/OTP provider, rate limiting, R2 switch, managed Postgres, CI deploy, analytics events, payments/premium (business hooks stubbed only), mobile store builds.

## Beta entry criteria
- [ ] TEST_SCRIPT.md fully ticked locally
- [ ] Backup + restore drill done
- [ ] 10 real providers + 50 real programmes seeded (replace demo rows)
- [ ] Moderation SLA assigned (who reviews verification queue day 1?)
