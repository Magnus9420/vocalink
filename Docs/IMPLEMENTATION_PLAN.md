# VocaLink — Implementation Plan

Source: `Docs/VocaLink Product Requirements Document (PRD).md` (37 sections)
Repo: `Magnus9420/vocalink` @ `main`
Status: Docs-only, no code yet. This plan starts from design system to architecture to phased build.

Core Promise: **Skill → Training → Certification → Work**
Vision: Nigeria's trusted digital gateway for practical skills, certification, and work.

---

## 0. Guiding Constraints

- Mobile-first, Nigeria, ages 16–35. Low-bandwidth Android, small screens, low digital literacy tolerant.
- Core loop: Discover → Explore → Choose → Enrol → Learn → Complete → Certify → Prepare for Work → Connect → Work.
- Trust is differentiator. Verification ≠ accreditation. Training Completion → Assessment → Certification kept distinct.
- MVP order from PRD §31: 1. Discover, 2. Trust, 3. Training, 4. Certification, 5. Work.
- Principles: Trust First, Access, Outcomes Over Activity, Simplicity, Opportunity After Training.

---

## 1. Design System — Phase 0

### Principles
Trust, simplicity, access. Must work on 3G, offline-tolerant browsing, 44px touch targets, AA contrast.

### Tokens (v0 proposal)
- Colors:
  - Base: `#FFFFFF`, Background `#F8FAF7`
  - Ink: `#101828`, Muted `#667085`
  - Primary (trust): `#0E7C3E` — green
  - Accent (opportunity/CTA): `#F59E0B` — amber
  - Info (sponsored): `#175CD3`
  - Danger: `#D92D20`
- Semantic badges:
  - `Verified` = green solid
  - `Free` = green outline
  - `Sponsored` = blue solid
  - `Paid` = neutral
  - Misleading / Warning = amber
- Typography: system stack + Inter. H1 24, H2 20, Body 16, Small 14. Line-height 1.5.
- Spacing: 4pt grid. Radius 12 for cards, 8 for inputs.
- Light mode only for MVP. Dark deferred.

### Components (build in `packages/ui` first)
Button, Input, OTPInput, SearchBar, FilterChip, ProgrammeCard, JobCard, ProviderCard, EmployerCard, Badges (Verified/Free/Sponsored/Paid), RatingStars, ProgressBar, BottomSheet, State/City picker (36 states + FCT + national), EmptyState, ErrorState, ReportSheet, CertificationStepper, PortfolioGrid.

### Patterns
- Programme detail must answer without contacting provider: title, trade, provider + verification, location, online/offline, duration, start date, cost + what is included, certification info, entry requirements, curriculum, spaces, enrol process, contact, reviews.
- Search results prioritize Verified + relevance.
- Guided Discovery: short Q&A (interests, goals, experience, location, method, budget, availability) → recommended skills + programmes. Admin-toggleable.
- i18n keys from day 1. English first, Pidgin / Yoruba / Hausa / Igbo ready.

Deliverable: Figma + coded Storybook for above.

---

## 2. Architectural Decisions (Locked by Owner)

### Stack
**Expo React Native (mobile) + Next.js (web + Admin) + Local Postgres + Better Auth + Cloudflare R2, in Turborepo monorepo. Hosted locally — no Vercel, no Supabase Cloud.**

- DB: PostgreSQL 16 running on your own device via Docker
- Auth: Better Auth (self-hosted, Postgres-backed)
- Storage: Cloudflare R2 (S3-compatible)
- Hosting: local device only for now (`pnpm dev`, Docker Compose)

Proposed structure:
```
/
├── apps/
│   ├── mobile/   # Expo — learners primary
│   ├── web/      # Next.js — SEO browse + fallback + Better Auth server
│   └── admin/    # Next.js — portal + dashboard (shares same DB/auth)
├── packages/
│   ├── ui/       # design system
│   ├── config/   # eslint/tsconfig
│   ├── db/       # Drizzle schema + migrations + seed (Postgres)
│   └── api/      # queries, R2 helpers, feature flags
├── docker-compose.yml  # postgres local
└── Docs/
```

### 1. Database — Local Postgres (answering: what can we use?)
Use this, in order:

1. **Docker Desktop for Windows** (recommended) + image `postgres:16-alpine`. This keeps Postgres isolated and reproducible, no manual Windows service setup.
   - `docker-compose.yml` runs `db` on `localhost:5432`, data persisted in a Docker volume.
2. **Drizzle ORM + drizzle-kit** for schema/migrations/seed. Beginner-friendly SQL-like, works perfectly with Better Auth's Drizzle adapter.
   - Connection string local: `postgresql://vocalink:vocalink@localhost:5432/vocalink`
   - Commands: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm db:studio`
3. **GUI:** DBeaver (free) or pgAdmin, or `drizzle-studio` for quick inspection.
4. Alternative if you refuse Docker: native PostgreSQL 16 installer from postgresql.org + same Drizzle setup. Docker is still preferred so Phase 0 works on any teammate's laptop with one command: `docker compose up -d db`.

Backups locally: `pg_dump` nightly to `./backups/` (add to .gitignore).

### 2. Auth — Better Auth
- Better Auth runs in `apps/web` (Next.js) as the auth server, backed by local Postgres via Drizzle adapter.
- `apps/admin` and `apps/mobile` share the same session:
  - Web/Admin: `better-auth` Next.js handler + middleware for role guard (`learner, provider_staff, employer, org_partner, admin`)
  - Mobile (Expo): `better-auth` Expo plugin + SecureStore for session tokens
- Methods for MVP: email/password + email OTP. Add phone-number plugin later for Nigeria OTP (needs SMS provider — defer to Phase 6).
- Tables (auto via Better Auth + custom): `user, session, account, verification` + app tables `profiles, learner_profiles` linked by `userId`.
- Audit log table for admin actions stays custom.

### 3. Storage — Cloudflare R2
- Create Cloudflare account → R2 → 2 buckets: `vocalink-portfolios` (public via custom domain or R2 public URL), `vocalink-private` (private: verification docs, learning materials).
- App uses S3-compatible API (`@aws-sdk/client-s3`) pointed at `https://<accountid>.r2.cloudflarestorage.com` with R2 API token. No AWS needed.
- Upload flow: Next.js API generates presigned PUT URL → mobile/web uploads direct to R2 → store returned key in Postgres (`portfolios.media_urls`, `provider_verifications.evidence_urls`). Private files served via presigned GET (15 min expiry). Cap 10MB, compress images client-side.
- You only pay R2 usage; DB/auth stay local.

### 4. Hosting — Local Device Only (no Vercel)
- Run everything with `pnpm dev`: `web` on `:3000`, `admin` on `:3001`, `mobile` via Expo Go (LAN).
- Orchestration: `docker compose up -d db` first, then `pnpm dev`.
- Env files: `apps/web/.env.local` holds `DATABASE_URL`, `BETTER_AUTH_SECRET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BUCKET`, `R2_PRIVATE_BUCKET`.
- No CI deploy. GitHub Actions only lint/type/test/build.
- If you later need external access (test on real phone outside WiFi): use `cloudflared tunnel --url http://localhost:3000` — still no Vercel.
- Later production path (not now): same Docker image to a VPS (Coolify/Dokku) + managed Postgres + R2 unchanged.

### Core Data Model (v1)
- `profiles` (id, role, name, location_state, location_city, avatar)
- `learner_profiles` (age_range, education, existing_skills, interests, preferred_format, budget, availability)
- `providers` (name, type, bio, verification_status, contact)
- `provider_verifications` (provider_id, evidence_urls, status: pending/approved/needs_info/rejected, reviewer, notes)
- `programmes` (title, trade_category, description, provider_id, location, format: online/offline/hybrid, duration, start_date, cost, cost_type: free/sponsored/paid, certification_info, entry_requirements, curriculum, spaces, status)
- `enrolments` (learner_id, programme_id, status, payment_status, progress)
- `reviews` (learner_id, programme_id, rating, text, moderation_status)
- `reports` (reporter_id, target_type, target_id, reason, status)
- `certification_pathways` (trade, body, steps, assessment_location, requirements, is_nsq_related)
- `learner_certifications` (learner_id, pathway_id, status: interested/in_progress/assessed/certified)
- `skills_passports` (learner_id materialized view: skills, training, certs, experience)
- `portfolios` (learner_id, title, trade, media_urls, description)
- `opportunities` (type: internship/apprenticeship/mentorship/job, org_id, role, trade, location, duration, paid_status, requirements, application_process, status)
- `applications` (learner_id, opportunity_id, status, cover_note)
- `conversations`, `messages` (in-app only MVP)
- `notifications` (user_id, type, payload, read, preferences respected)
- `admin_feature_flags` (key, enabled) — guided_discovery, reviews, jobs, internships, provider_reg, employer_reg, category toggles
- `audit_logs`

### Cross-cutting
- Search: Postgres FTS + location filters first (trigram + `state/city`). Typesense later, still self-hostable via Docker.
- Storage: Cloudflare R2 as above — `vocalink-portfolios` public, `vocalink-private` presigned. No local disk uploads in prod code, so R2 switch later is zero-change.
- Messaging: in-app only (no WhatsApp redirect per PRD §26). Simple `conversations/messages` tables polled, upgrade to websocket later.
- Notifications: Expo push + email first (local SMTP catcher like Mailhog in Docker for dev), SMS later. Preferences table from start.
- Analytics: self-hosted PostHog via Docker OR minimal `events` table to start to avoid extra subscription. Track PRD §33 funnel regardless.
- Performance: <3s interactive on 3G, cached browse, image compression before R2 upload.
- Security: app-level RBAC checks (since no Supabase RLS) + Better Auth middleware, PII minimization, presigned URLs, rate limits, anti-scrape, moderation SLA. Back up local Postgres volume.

---

## 3. Phased Implementation

### Phase 0 — Foundation (1–2 weeks)
Goal: shippable skeleton running fully local.
- Monorepo + TS + ESLint + Prettier + Husky + pnpm workspaces
- GitHub Actions: lint/type/test/build only (no deploy)
- `docker-compose.yml`: `postgres:16-alpine` + optional `mailhog` for auth email testing. `pnpm db:migrate + seed` for states/cities/trades + admin flags
- Better Auth wired in `apps/web` (Drizzle adapter), role guard shared to `admin` + `mobile`
- R2 buckets created + presigned upload helper tested
- UI kit v0 + Storybook
- Done when: `docker compose up -d db`, `pnpm dev` runs web :3000 + admin :3001, user can register as learner locally, flags toggle Guided Discovery ON/OFF.

### Phase 1 — Discover (MVP P1)
PRD §6, §7.
- Learner onboarding (progressive, not long form)
- Skill categories + trades taxonomy (Fashion, Catering, Welding, Plumbing, Carpentry, Electrical, Photo/Video, Beauty, Construction, Automotive, + Other)
- Search/browse + filters: free/paid, online/physical, location, duration, certification, verified, level, start date
- Programme detail skeleton
- Guided Discovery Q&A + rules-based recommendations v1 (no AI yet, admin-manageable)
- Acceptance: undecided user gets 3 relevant programmes in <60s.

### Phase 2 — Trust (MVP P2)
PRD §9, §10, §8.
- Provider registration + verification submit → admin approve / request info / reject → Verified badge
- Programme publishing v1 (full field set §8)
- Reviews + reporting + moderation queue
- UI always shows verification + review count + history + cert info alongside rating
- Acceptance: unverified cannot claim verified; misleading listing can be reported and hidden pending review.

### Phase 3 — Training (MVP P3)
PRD §11, §12, §13, §14.
- Enrolment variants: direct, application, approval, paid, scholarship, eligibility check
- Free / Sponsored / Paid clearly labelled
- Learner dashboard: enrolled, status, upcoming, certificates, opportunities
- Online materials viewer + progress; offline info (location, schedule, trainer, attendance)
- Acceptance: enrol → track → complete record exists.

### Phase 4 — Certification + Passport (MVP P4)
PRD §15, §16, §17.
- Certification info pages + pathways (NSQ-related as content entries first, not API)
- Status tracker: Interested → In Progress → Assessed → Certified (separate from training completion)
- Skills Passport auto-filled: skills, training, providers, certs, experience, portfolio, endorsements, internships. Shareable link for applications.
- Portfolio uploads for practical trades.
- Acceptance: learner understands what cert is relevant, what to do, where assessment happens, current status.

### Phase 5 — Work (MVP P5)
PRD §18, §19, §20.
- Internship/apprenticeship/mentorship listings with org, role, location, duration, requirements, paid/unpaid, process
- Jobs marketplace by trade, apply with Passport
- Employer: business profile, post vacancy, search candidates by skill/location/experience/certification, manage applications, contact via in-app
- Acceptance: certified learner can apply; employer can find learner by skill + cert + portfolio.

### Phase 6 — Marketplace Completeness
PRD §21, §22, §23, §24, §25, §26.
- Provider dashboard: programmes, enrolments, messages, feedback, performance
- NGO/Gov publishing: sponsor, beneficiaries, eligibility, places, deadline, provider, duration, outcomes. Future funnel stub: Selection → Training → Completion → Certification → Placement
- Global search (skills, courses, centres, trainers, jobs, internships, mentors, orgs)
- Location discovery: state/city/area/distance + national
- Notifications center + preferences
- In-app messaging learner↔provider/employer/mentor
- Acceptance: org can publish sponsored programme; user controls notification categories.

### Phase 7 — Admin Portal + Dashboard
PRD §27, §28, §29.
- Manage: users, skills/categories, programmes, jobs, internships, mentorships
- Trust & Safety: verification queue, reports/complaints, reviews moderation, suspicious listings, restrictions
- Certification: pathways, info, partners, learner status
- Platform controls: feature flags + registration open/closed + category active/inactive
- Dashboard metrics: learners, active, providers/verified, programmes, enrolments, completions, cert activity, employers/jobs/internships, placements, issues — focused on movement toward employment
- Acceptance: admin can turn off Jobs/Reviews/Guided Discovery without deploy.

### Phase 8 — Hardening & Launch Prep
- Perf budget, RLS audit, PII review, backup/restore drill
- Seed: 50 real programmes (Lagos/Abuja), 10 verified providers
- Beta: 100 learners, measure funnel per §33. North star: count moving Skill → Training → Certification → Work.
- Business hooks stubbed (featured slots, premium jobs) but free remains discoverable per §30.

### Phase 9 — Future (PRD §32, deferred)
AI career guidance, skill recommendations, assessments/RPL, digital badges, apprenticeship matching, video/live classes, payments/instalments, scholarships marketplace, enterprise recruitment/reporting, forums/alumni, startup support.

---

## 4. Business Model Hooks (build stubs, don't enforce yet)
Provider: premium visibility, featured programmes. Employer: premium jobs, candidate search. Institutional: programme/beneficiary management, reporting. Certification/services: eligible fees with transparent UX.

---

## 5. Risks & Open Questions
1. Mobile-first confirm: Expo app vs PWA web-first?
2. Who manually reviews providers day 1? SLA?
3. NSQ bodies list — do you have contacts or start informational?
4. Monetization deferred to keep trust?
5. Language: English-only MVP?
6. Verification evidence required: CAC, photos, refs, ID?
7. Payments in MVP? Recommend no — display costs only.

---

## 6. Suggested Milestones
- M0 Foundation + Design system
- M1 Discover usable
- M2 Trust live (first verified providers)
- M3 Training loop closed (first enrolments)
- M4 Certification + Passport
- M5 Work marketplace (first placements)
- Launch beta

Next step after saving: scaffold Phase 0 monorepo.

---
VocaLink: From Skill to Opportunity.
