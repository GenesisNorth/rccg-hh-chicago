# LSC-ABUJA-SITE — Implementation Sprints

**Source audit**: senior-engineer review of `app/`, `components/`, `lib/`, `functions/src/` against [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) and [FRONTEND_IMPLEMENTATION_PLAN.md](FRONTEND_IMPLEMENTATION_PLAN.md).

**Working assumption**: ship a production-grade church site in ~6 sprints (~12 weeks at 2 weeks/sprint, solo dev). Phase 4–6 roadmap items (live streaming, mobile app, AI, deep integrations) live in Sprint 7+ as a separate backlog.

**Legend** — Status icons after each item:
- 🔴 stub / missing
- 🟡 partial / cosmetic-only
- ✅ already shipped (listed for context, not work)

**How to use this file**: tick `[x]` as each task is merged. Don't tick until the corresponding screen/endpoint works end-to-end against real data.

---

## Sprint 0 — Safety & Triage (½ week, do before anything else)

Goal: prevent data leaks and unblock the rest of the plan.

- [ ] 🔴 Tighten [firestore.rules](firestore.rules): remove the catch-all `match /{document=**}` block; add explicit rules per collection (donations, attendance, chats, notifications, eventRegistrations, media, events)
- [ ] 🔴 Tighten [storage.rules](storage.rules): admin-only writes by default, public read only for `/media/public/**`
- [ ] 🔴 Re-enable route protection: rename [middleware.ts.disabled](middleware.ts.disabled) → `middleware.ts`, gate `/admin/**`, `/dashboard`, `/profile`, `/give` server-side via session cookie
- [ ] 🔴 Decide and delete duplicate auth pages: keep [app/auth/signin/page.tsx](app/auth/signin/page.tsx), remove [app/auth/login/page.tsx](app/auth/login/page.tsx) (or vice-versa)
- [ ] 🔴 Delete dead `/src/app` and `/src/components` parallel trees
- [ ] 🔴 Add `.env.example` with every key the code reads (Firebase admin, Paystack, Stripe, Cloudinary, SendGrid, NEXT_PUBLIC_APP_URL)
- [ ] 🔴 Add `.github/workflows/ci.yml`: `pnpm install`, `next lint`, `next build`, type-check on every PR

**Deliverable**: rules locked down, CI green, one canonical auth page.

---

## Sprint 1 — Foundational APIs (2 weeks)

Goal: wire the 22 missing endpoints so every existing UI stops 404-ing or reading mock data. Most are thin CRUD wrappers over [lib/firestore-utils.ts](lib/firestore-utils.ts).

### Auth endpoints
- [ ] 🔴 `POST /api/auth/forgot-password` → generate token, store in `passwordResets/{token}`, send via [lib/email.ts](lib/email.ts) `sendPasswordResetEmail`
- [ ] 🔴 `POST /api/auth/reset-password` → validate token, update Firebase Auth password via `adminAuth.updateUser`
- [ ] 🔴 `POST /api/auth/send-verification` → trigger Firebase `sendEmailVerification` + custom template
- [ ] 🔴 Verify [app/auth/verify-success/page.tsx:33](app/auth/verify-success/page.tsx) actually marks `emailVerified: true` in Firestore user doc

### User endpoints
- [ ] 🔴 `GET /api/user/profile` — returns current user doc
- [ ] 🔴 `PATCH /api/user/profile` — partial update with Zod validation
- [ ] 🔴 `PATCH /api/user/settings` — notification/theme/privacy prefs
- [ ] 🔴 `POST /api/user/upload-image` — Cloudinary signed upload, update `image`/`imagePublicId`
- [ ] 🔴 `GET /api/users/directory` — paginated, respects `privacySettings.profileVisibility`
- [ ] 🔴 `POST /api/users/bulk` — bulk role change / delete (admin only)
- [ ] 🔴 `POST /api/users/send-verification` — admin-triggered email
- [ ] 🔴 `GET /api/admin/users/recent?limit=5`
- [ ] 🟡 Fix [app/profile/page.tsx:79](app/profile/page.tsx#L79) syntax (`useState(null);  const [isLoading...]` on one line)

### Content endpoints
- [ ] 🔴 `GET|POST /api/announcements`, `GET|PATCH|DELETE /api/announcements/[id]`
- [ ] 🔴 `GET|POST /api/prayer-requests`, `GET|PATCH|DELETE /api/prayer-requests/[id]` (with "prayed for" counter)
- [ ] 🔴 `GET|POST /api/devotional-series`, `GET|PATCH|DELETE /api/devotional-series/[id]`

### Messages endpoints (REST shell only — realtime in Sprint 4)
- [ ] 🔴 `GET /api/messages/chats` — list current user's 1:1 + group chats
- [ ] 🔴 `GET /api/messages/chats/[id]/messages` — paginated history
- [ ] 🔴 `POST /api/messages/chats/[id]/messages` — send message

### Admin/dashboard endpoints
- [ ] 🔴 `GET /api/admin/events` — admin view with all statuses
- [ ] 🔴 `GET /api/admin/media`, `POST /api/admin/media/bulk` (bulk delete/move/visibility)
- [ ] 🔴 `GET /api/admin/donations/recent?limit=5`
- [ ] 🟡 Replace fake `monthlyGrowth` literals in [app/api/admin/metrics/route.ts:26-31](app/api/admin/metrics/route.ts#L26-L31) with real month-over-month query
- [ ] 🟡 Replace fake series in [app/api/admin/charts/route.ts:9-16](app/api/admin/charts/route.ts#L9-L16) with real 6-month aggregation (or scheduled Cloud Function writing to `metrics/{yyyy-mm}`)
- [ ] 🟡 Replace single hard-coded entry in [app/api/admin/activity/route.ts:19](app/api/admin/activity/route.ts#L19) — derive from `audit_log` collection (introduce it) OR merge most-recent docs from users/sermons/donations/events

**Deliverable**: every `fetch('/api/...')` call in the codebase resolves; no more `mockX` fallback branches firing.

---

## Sprint 2 — Public Site Completion (1.5 weeks)

Goal: close every gap a visitor or member would hit.

- [ ] 🔴 [app/sermons/[id]/page.tsx](app/sermons/[id]/page.tsx) — replace the 2 hard-coded `sermons` literals + lorem-ipsum with `useParams()` + Firestore fetch via `sermonService.getById`
- [ ] 🔴 `/devotionals/[id]/page.tsx` — create detail page (currently missing)
- [ ] 🔴 `/media/[id]/page.tsx` + `/media/[category]/page.tsx` — viewer + category pages
- [ ] 🟡 [app/media/page.tsx:67-194](app/media/page.tsx#L67-L194) — drop `mockMedia`, fetch from `/api/media`
- [ ] 🟡 [app/devotionals/page.tsx:216-238](app/devotionals/page.tsx#L216-L238) — drop `mockSeries`, fetch from `/api/devotional-series`
- [ ] 🟡 [app/announcements/page.tsx:133-307](app/announcements/page.tsx#L133-L307) — drop mock, wire to live API
- [ ] 🟡 [app/prayer-requests/page.tsx:121-266](app/prayer-requests/page.tsx#L121-L266) — drop mock, wire to live API, implement "I prayed for this" counter
- [ ] 🟡 [app/contact/page.tsx](app/contact/page.tsx) — implement form submit → `POST /api/contact` → email via `lib/email.ts`
- [ ] 🟡 [app/contact/page.tsx:296-298](app/contact/page.tsx#L296-L298) — replace blurred-image "map placeholder" with Google Maps embed or Mapbox
- [ ] 🟡 Replace all `/placeholder.svg` images in [app/ministries/youth/page.tsx](app/ministries/youth/page.tsx), [app/ministries/men/page.tsx](app/ministries/men/page.tsx), [app/ministries/women/page.tsx](app/ministries/women/page.tsx) with real photography
- [ ] 🟡 [app/events/page.tsx:67-70](app/events/page.tsx#L67-L70) — populate `currentAttendees` and `isRegistered` (needs `/api/events` to include registration counts + user-specific check)
- [ ] 🟡 Re-enable `<UpcomingEvents />` in [app/page.tsx:33-37](app/page.tsx#L33-L37) once events API returns real data
- [ ] 🟡 Verify gallery autoscroll on small screens — recently shipped (commit `ca1a814`), regression-test

**Deliverable**: a logged-out visitor can browse every public surface and see real content.

---

## Sprint 3 — Admin Completion (2 weeks)

Goal: church staff can run the site without a developer.

### Missing edit pages (reuse existing `*Form` components with `mode="edit"`)
- [ ] 🔴 `/admin/sermons/[id]/edit/page.tsx`
- [ ] 🔴 `/admin/events/[id]/edit/page.tsx`
- [ ] 🔴 `/admin/devotionals/[id]/edit/page.tsx`
- [ ] 🔴 `/admin/workers/[id]/edit/page.tsx`
- [ ] 🔴 `/admin/users/[id]/edit/page.tsx` (or convert existing dialog to dedicated page)

### Missing admin index pages advertised by [components/admin/sidebar.tsx:72-105](components/admin/sidebar.tsx#L72-L105)
- [ ] 🔴 `/admin/communications/page.tsx` — outbox of email/SMS broadcasts + templates
- [ ] 🔴 `/admin/notifications/page.tsx` — push/in-app notification composer + history
- [ ] 🔴 `/admin/analytics/page.tsx` — member engagement, sermon plays, giving trends, event attendance
- [ ] 🔴 `/admin/website/page.tsx` — CMS for hero copy, service times, featured banner
- [ ] 🔴 `/admin/settings/page.tsx` — payment gateway keys, email provider, branding

### Workflow gaps
- [ ] 🔴 [app/admin/media/upload/page.tsx:55](app/admin/media/upload/page.tsx#L55) — remove `uploadedBy: "admin"` placeholder, use `user.id`
- [ ] 🔴 Department member assignment UI inside `/admin/workers/[id]/edit`
- [ ] 🔴 Bulk sermon operations (publish/feature/delete) — `/admin/sermons/bulk/page.tsx`
- [ ] 🔴 Event attendees management: `/admin/events/[id]/attendees/page.tsx`
- [ ] 🔴 Devotional content scheduler: `/admin/devotionals/schedule/page.tsx`
- [ ] 🔴 Donation analytics + report generator + payment settings (per [FRONTEND_IMPLEMENTATION_PLAN.md](FRONTEND_IMPLEMENTATION_PLAN.md) week 1, day 5-7)

**Deliverable**: every sidebar link resolves; every record type supports full CRUD from the UI.

---

## Sprint 4 — Payments, Email, Real-time (2 weeks)

Goal: money flows end-to-end, members get notified.

### Payments
- [ ] 🔴 `POST /api/payments/create-payment-intent` — Stripe payment intent creation (called from [components/payments/stripe-widget.tsx:138](components/payments/stripe-widget.tsx#L138))
- [ ] 🔴 `POST /api/payments/webhooks/stripe` — verify signature, mark donation `COMPLETED`/`FAILED`, trigger receipt
- [ ] 🔴 `POST /api/payments/webhooks/paystack` — same, with charge.success event
- [ ] 🔴 `GET /api/donations/history?userId=` — for [components/payments/payment-history.tsx:89](components/payments/payment-history.tsx#L89)
- [ ] 🔴 `GET /api/donations/stats?userId=` — totals by year/type
- [ ] 🔴 `POST /api/donations/recurring` + cron job — Paystack subscription create + monthly charge reconciliation
- [ ] 🔴 PDF receipt generator (`pdfkit` or HTML→PDF via Cloud Function) attached to receipt email

### Email triggers (each calls existing [lib/email.ts](lib/email.ts) / [lib/mail.ts](lib/mail.ts))
- [ ] 🔴 Welcome email on signup (currently silent — wire into `signUp` flow in [contexts/AuthContext.tsx:106](contexts/AuthContext.tsx#L106))
- [ ] 🔴 Donation receipt email on `donations.status → COMPLETED` (already a Cloud Function trigger at [functions/src/index.ts:77](functions/src/index.ts#L77) — extend to also send email)
- [ ] 🔴 Event reminder email (24 h before `startDate`) — scheduled Cloud Function
- [ ] 🔴 New prayer-request notification to subscribers
- [ ] 🔴 Weekly digest (latest sermon + announcements + upcoming events)

### Real-time
- [ ] 🔴 Chat: replace REST polling in [components/communication/chat-window.tsx](components/communication/chat-window.tsx) with Firestore `onSnapshot` listener on `chats` collection (filtered by `chatId`)
- [ ] 🔴 Notifications: bell badge driven by Firestore listener on `notifications/?userId=current&read=false`
- [ ] 🔴 Prayer wall: realtime "prayer count" increments via listener
- [ ] 🔴 Announcement broadcasts: listener-driven banner on member dashboard
- [ ] 🔴 Remove unused `socket.io` / `socket.io-client` / `pusher-js` deps (Firestore covers it) or commit to one and use it consistently

**Deliverable**: a member can give → see receipt email + history; admin posts announcement → all dashboards update live.

---

## Sprint 5 — Hardening & Launch Prep (1.5 weeks)

Goal: ready for a soft launch with real members.

### Search & performance
- [ ] 🟡 Replace client-side search in [lib/firestore-utils.ts:175-192](lib/firestore-utils.ts#L175-L192) with Algolia or Typesense (or at minimum Firestore composite indexes + cursor pagination on all list views)
- [ ] 🔴 Add Firestore composite indexes for every `where + orderBy` combination actually used (sermons-by-series, events-by-status+date, donations-by-donor+date)
- [ ] 🔴 Image optimization: replace remaining `<img>` with `next/image`, configure Cloudinary loader in [next.config.mjs](next.config.mjs)
- [ ] 🔴 Add loading skeletons for every list (most pages use spinner — slower perceived UX)
- [ ] 🔴 Lighthouse audit on `/`, `/sermons`, `/give`, `/dashboard`, `/admin` — target 90+

### PWA & notifications
- [ ] 🔴 `public/manifest.json` (icons, theme color, start URL)
- [ ] 🔴 Service worker registration via `next-pwa` (already installed, unused)
- [ ] 🔴 FCM token storage on user doc + send-to-token via Cloud Function

### Observability
- [ ] 🔴 Sentry integration (`@sentry/nextjs`) — both client + server, source maps uploaded in CI
- [ ] 🔴 Firebase Performance Monitoring init in [lib/firebase.ts](lib/firebase.ts)
- [ ] 🔴 Structured logging in API routes (`pino` or `console.log` with consistent JSON shape)
- [ ] 🔴 `/admin/audit-log` page driven by a new `audit_log` collection written from every admin mutation

### Tests
- [ ] 🔴 Vitest + React Testing Library setup
- [ ] 🔴 Unit tests for `lib/firestore-utils.ts`, `lib/email.ts`, payment verification logic
- [ ] 🔴 Playwright smoke tests: signup → verify → login → give → see receipt; admin creates sermon → appears on `/sermons`
- [ ] 🔴 Firestore rules tests (`@firebase/rules-unit-testing`) — every collection's allow/deny matrix

### Final pre-launch
- [ ] 🔴 Vercel/Firebase Hosting prod deployment + custom domain + SSL
- [ ] 🔴 Backup strategy: automated daily Firestore export to GCS
- [ ] 🔴 Status page / uptime monitor (UptimeRobot, BetterStack)
- [ ] 🔴 Beta-tester invite list, soft-launch announcement copy
- [ ] 🔴 User onboarding flow / "first 5 minutes" experience polished

**Deliverable**: a tagged `v1.0.0` release deployed to production, soft-launched with beta members.

---

## Sprint 6 — Polish & Feedback Loop (1 week)

Goal: react to real-user feedback before public launch.

- [ ] 🔴 Triage beta feedback into GitHub Issues, fix P0/P1 only
- [ ] 🔴 Accessibility pass: keyboard nav, ARIA on dialogs/menus, contrast on dark mode (`axe-core` audit)
- [ ] 🔴 Mobile responsiveness sweep across every page (visit each on iPhone SE + iPad widths)
- [ ] 🔴 Copy/content review by pastoral team
- [ ] 🔴 Analytics dashboard sanity check (real numbers populating)
- [ ] 🔴 Public launch announcement
- [ ] 🔴 Set up "office hours" / support channel for first month

**Deliverable**: public launch.

---

## Sprint 7+ Backlog (post-launch, from [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) phases 4–6)

Not scheduled — pick up after v1 is stable and feedback-shaped.

### Worker & ministry management (Phase 4, week 5)
- [ ] 🔴 Worker profiles + skills tracking
- [ ] 🔴 QR-code attendance system (admin scans member badge → `attendance` doc)
- [ ] 🔴 Task assignment + scheduling
- [ ] 🔴 Visitor tracking + automated follow-up workflows
- [ ] 🔴 Member lifecycle (visitor → first-timer → member → worker) automation

### External integrations (Phase 4, week 6)
- [ ] 🔴 Google Calendar sync for events
- [ ] 🔴 Zoom/Teams integration for online services
- [ ] 🔴 QuickBooks / accounting export for donations
- [ ] 🔴 Social media auto-posting (sermon clips → IG/FB)
- [ ] 🔴 Sermon transcription (Whisper) + searchable transcripts

### Live features (Phase 3, days 4-5)
- [ ] 🔴 Live streaming embed + live chat during services
- [ ] 🔴 Live polls / Q&A during service
- [ ] 🔴 Live giving during services

### Mobile (Phase 5)
- [ ] 🔴 Flutter project bootstrap with Firebase integration
- [ ] 🔴 Auth, sermon playback, giving, notifications, profile
- [ ] 🔴 Offline sermon downloads + background audio
- [ ] 🔴 Mobile chat, biometric giving, push notifications
- [ ] 🔴 App Store + Play Store submission

### AI / advanced
- [ ] 🔴 Member segmentation + engagement predictions
- [ ] 🔴 Intelligent content recommendations
- [ ] 🔴 EmergingAI chatbot — extend beyond FAQ to use sermon corpus (RAG)

---

## Running summary

| Sprint | Theme | Duration | Status |
|---|---|---|---|
| 0 | Safety & Triage | 0.5 wk | ⬜ |
| 1 | Foundational APIs | 2 wk | ⬜ |
| 2 | Public Site Completion | 1.5 wk | ⬜ |
| 3 | Admin Completion | 2 wk | ⬜ |
| 4 | Payments, Email, Real-time | 2 wk | ⬜ |
| 5 | Hardening & Launch Prep | 1.5 wk | ⬜ |
| 6 | Polish & Feedback Loop | 1 wk | ⬜ |
| 7+ | Worker mgmt, integrations, live, mobile, AI | — | backlog |

**Mark each row** `🟡 in progress` / `✅ done` as you complete the sprint's checklist. The site is ship-ready at the end of Sprint 5; everything after is iteration.
