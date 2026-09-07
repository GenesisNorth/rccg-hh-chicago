# LSC-ABUJA-SITE — Application Review

**Date**: 2026-07-10
**Reviewed as**: Senior Software Engineer / QA / Product
**Stack**: Next.js 15 (App Router) · React 19 · Firebase (Auth, Firestore, Storage, Functions) · Cloudinary · Paystack · Tailwind + shadcn/ui
**Companion docs**: [IMPLEMENTATION_SPRINTS.md](IMPLEMENTATION_SPRINTS.md) (sprint-level task breakdown), [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md), [FRONTEND_IMPLEMENTATION_PLAN.md](FRONTEND_IMPLEMENTATION_PLAN.md)

---

## 1. Executive Summary

The application has a broad and impressive **surface area** — 30+ pages covering public site, member portal, admin panel, giving, sermons, events, devotionals, messaging, and prayer requests — and the UI layer is genuinely far along. However, it is **not safe to deploy in its current state**. The security model is effectively absent: Firestore rules contain a public-read catch-all and a role self-escalation hole, every API route is unauthenticated, route middleware is disabled, and admin access is enforced only in client-side React code.

**Verdict**: ~70% complete on UI, ~40% on backend wiring, ~10% on security/hardening. The highest-leverage work is Sprint 0 of [IMPLEMENTATION_SPRINTS.md](IMPLEMENTATION_SPRINTS.md) — lock down data access before anything else.

| Area | State |
|---|---|
| Public site (home, about, ministries, contact, gallery) | 🟢 Largely done, polished |
| Auth (Firebase email/password + Google) | 🟡 Works, but duplicate pages & no server-side session |
| Admin panel UI | 🟡 Screens exist; protection is client-only |
| API layer | 🔴 Unauthenticated, unvalidated, partially non-functional |
| Security rules (Firestore/Storage) | 🔴 Critical holes |
| Payments (Paystack) | 🟡 Widget wired; server verification is soft-fail |
| Realtime messaging | 🔴 UI shell only |
| Tests / CI | 🔴 None exist |

---

## 2. Critical Security Issues (fix before any deploy)

### SEC-1: Firestore catch-all makes the entire database publicly readable
[firestore.rules:47-51](firestore.rules#L47-L51)
```
match /{document=**} {
  allow read: if true;
  ...
}
```
Firestore grants access if **any** matching rule allows it, so this block overrides every restriction above it. **All collections — users (with phone, address, DOB, emergency contacts), donations, notifications, prayer requests, chats — are readable by anyone on the internet without logging in.** For a church congregation this is a serious privacy/data-protection incident waiting to happen.

### SEC-2: Any member can promote themselves to SUPERADMIN
[firestore.rules:5-7](firestore.rules#L5-L7) allows a user to `write` their own user document with no field restrictions — including the `role` field. A logged-in member can set `role: 'SUPERADMIN'` from the browser console, then pass every role check in the app. Rules must exclude `role` (and `departmentIds`/`ledDepartmentIds`) from self-writes using `request.resource.data.diff()`.

### SEC-3: API routes have zero authentication
Every route in [app/api/](app/api/) is callable by anyone:
- `GET /api/users` ([app/api/users/route.ts:6](app/api/users/route.ts#L6)) — dumps **all member PII** as JSON.
- `POST /api/users` ([app/api/users/route.ts:44](app/api/users/route.ts#L44)) — accepts `body.role`, so an anonymous caller can create an ADMIN user document.
- `GET /api/donations` ([app/api/donations/route.ts:4](app/api/donations/route.ts#L4)) — exposes the full donation ledger.
- Sermons, events, media, devotionals routes: unauthenticated writes.

None verify a Firebase ID token. There is no `verifyIdToken` / session-cookie check anywhere in `app/api`.

### SEC-4: Route middleware is disabled — and can't just be re-enabled
[middleware.ts.disabled](middleware.ts.disabled) is written for **NextAuth**, which is no longer in [package.json](package.json). The app migrated to Firebase Auth but never rebuilt server-side protection. `/admin/**` is guarded only by a client-side `useEffect` redirect in [app/admin/layout.tsx:20-29](app/admin/layout.tsx#L20-L29) — trivially bypassed (and the pages' data calls hit the open APIs anyway). The middleware needs a rewrite around Firebase **session cookies**, not a rename.

### SEC-5: API routes use the *client* Firebase SDK on the server
[lib/firestore-utils.ts:1-20](lib/firestore-utils.ts#L1-L20) imports from `firebase/firestore` (client SDK) and is used inside API routes. Server-side, these run **unauthenticated**, so they only work because of the SEC-1 public-read hole — fixing the rules will silently break most API routes. All server data access must move to [lib/firebase-admin.ts](lib/firebase-admin.ts) (Admin SDK), with explicit auth checks since Admin SDK bypasses rules.

### SEC-6: Paystack verification is advisory, not enforced
[app/api/donations/route.ts:29-58](app/api/donations/route.ts#L29-L58):
- If `PAYSTACK_SECRET_KEY` is missing, verification is **skipped** and the donation is recorded as `COMPLETED`.
- If the verify call throws, the code logs and **proceeds anyway** (the comment even says so).
- The amount-match check is **commented out** — a caller can pay ₦100 and record a ₦1,000,000 donation.
- `status` is taken from the request body, defaulting to `COMPLETED`.
- No Paystack **webhook** endpoint exists, so out-of-band confirmations/failures are never reconciled.

### SEC-7: Storage rules depend on custom claims the app never sets
[storage.rules](storage.rules) checks `request.auth.token.role`, but custom claims are only set by manual CLI scripts ([scripts/setup-admin.js:143](scripts/setup-admin.js#L143), [scripts/update-role.js:48](scripts/update-role.js#L48)). Role changes made through the admin UI update only the Firestore doc — so storage permissions and actual roles **drift apart**. Claims must be synced whenever a role changes (Cloud Function trigger or Admin-SDK API route).

### SEC-8: Build is configured to hide errors
[next.config.mjs](next.config.mjs) sets `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`. Combined with zero tests, broken code ships silently. (Typecheck currently reports ~25 real errors — see §4.)

**Positive finding**: `.env.local` / service-account keys were **never committed** — full git-history scan came back clean. Keep it that way.

---

## 3. Repository & Architecture Issues

| # | Issue | Detail |
|---|---|---|
| R-1 | `functions/node_modules` is tracked in git | **6,274 files**; `.git` is 73 MB. Add `functions/node_modules` to [.gitignore](.gitignore) and remove from the index (`git rm -r --cached`). Consider history rewrite later if clone size matters. |
| R-2 | Dead parallel app tree | [src/](src/) contains a leftover v0 SaaS template (`Pricing.tsx`, `Testimonials.tsx`, its own `app/layout.tsx`). Not routed, but confuses tooling and imports. Delete. |
| R-3 | Duplicate auth pages | Both [app/auth/login/page.tsx](app/auth/login/page.tsx) and [app/auth/signin/page.tsx](app/auth/signin/page.tsx) exist. Keep one, redirect the other. |
| R-4 | Dependency bloat / conflicting choices | Two hashing libs (`bcrypt` + `bcryptjs`), three email providers (`@sendgrid/mail`, `nodemailer`, `resend`), two realtime stacks (`socket.io` + `pusher-js`), Stripe alongside Paystack, `jsonwebtoken` with no consumer. Pick one per concern and prune — this bloats installs and invites drift. |
| R-5 | `"latest"` version pins | `framer-motion`, `next-themes`, `@emotion/is-prop-valid` pinned to `latest` — non-reproducible builds. Pin real versions. |
| R-6 | Package identity | `package.json` is still `"name": "my-v0-project"`, `"type": "commonjs"` (risky with Next 15 ESM tooling), ISC license, empty author. |
| R-7 | Two lockfiles | `package-lock.json` (833 KB, real) and a stub `pnpm-lock.yaml`. Delete one; the sprints doc assumes pnpm — decide and standardize. |
| R-8 | No CI | No `.github/workflows`. Minimum viable: install → typecheck → lint → build on every PR. |
| R-9 | `tsconfig.tsbuildinfo` (328 KB) sitting in repo root | Ignored now, but delete the stray file. |
| R-10 | `next-pwa` installed but not configured in `next.config.mjs` | Either wire it up (nice for a church congregation on mobile) or remove it. |

---

## 4. Bugs Found

### Type errors (currently masked by `ignoreBuildErrors`)
`npx tsc --noEmit` reports ~25 errors, several of which are **live logic bugs**, not just typing noise:

1. **Role checks that can never pass** — [app/announcements/page.tsx:481](app/announcements/page.tsx#L481) and [:601](app/announcements/page.tsx#L601) compare `user.role` against lowercase `"admin" | "pastor" | "leader"`, but `UserRole` values are uppercase (`ADMIN`, …). These comparisons are **always false** → admin-only announcement controls never render for actual admins.
2. **`user.uid` does not exist** — [app/announcements/page.tsx:274](app/announcements/page.tsx#L274), [app/give/page.tsx:183](app/give/page.tsx#L183) access `.uid`/`.photoURL` on the Firestore `User` type (which has `id`/`image`). Author IDs on announcements and donor IDs on donations are likely `undefined` at runtime.
3. **Checkbox handler type mismatch** — [app/give/page.tsx:378](app/give/page.tsx#L378), [:451](app/give/page.tsx#L451) pass `setState` directly to Radix `onCheckedChange` (`"indeterminate"` case unhandled).
4. **Props that don't exist** — [app/profile/page.tsx:540](app/profile/page.tsx#L540) passes `initialSettings` to a component that declares no props; settings are silently ignored.
5. **Null into required props** — [components/admin/EventForm.tsx:222](components/admin/EventForm.tsx#L222), [components/events/event-calendar.tsx:72](components/events/event-calendar.tsx#L72), [components/communication/new-chat-dialog.tsx:187](components/communication/new-chat-dialog.tsx#L187).
6. **Functions won't compile** — [functions/src/index.ts:9-10](functions/src/index.ts#L9-L10) (`express`/`cors` import interop), [functions/src/routes/notifications.ts:194](functions/src/routes/notifications.ts#L194), [functions/src/routes/sermons.ts:44](functions/src/routes/sermons.ts#L44). The deployed `functions/lib/index.js` is likely stale relative to `src`.

### Functional bugs
7. **Fixing the rules breaks the APIs** (see SEC-5) — the API layer only functions because the DB is world-readable. This is a landmine: whoever fixes SEC-1 first will "break the site."
8. **Signup redirects to `/dashboard` before email verification** ([contexts/AuthContext.tsx:153](contexts/AuthContext.tsx#L153)) and nothing enforces `emailVerified` anywhere afterward — the verification email is decorative.
9. **`updateUserProfile` spreads unvalidated `Partial<User>`** ([contexts/AuthContext.tsx:245-259](contexts/AuthContext.tsx#L245-L259)) — combined with SEC-2, this is the self-escalation vector; even after rules are fixed, the client should whitelist editable fields.
10. **Several public pages still render hardcoded/mock data** (events, devotionals, announcements have inline seed arrays alongside fetch logic) — a member could see phantom events. Audit each `app/*/page.tsx` against real Firestore data.
11. **Raw Firebase error messages surfaced to users** — `toast.error(error.message)` throughout [contexts/AuthContext.tsx](contexts/AuthContext.tsx) shows strings like `Firebase: Error (auth/wrong-password)`. Map error codes to friendly copy (also avoids user-enumeration hints).

---

## 5. QA Assessment

### What's missing entirely
- **Zero automated tests** — no unit, integration, or E2E tests, no test runner installed.
- **No CI gate** — nothing prevents a red typecheck from merging (and the build config actively hides it).
- **No error tracking** (Sentry/GlitchTip) and no analytics — you can't see production failures.
- **No staging environment / emulator workflow** — `firebase.json` exists but there's no documented emulator flow for rules testing.

### Recommended test priorities (in order)
1. **Firestore rules tests** (`@firebase/rules-unit-testing`) — the highest-value tests this project can have given §2. Assert: anonymous cannot read `users`/`donations`; member cannot write own `role`; admin can.
2. **API route tests** — auth required, role required, Zod-validated payloads, Paystack verify failure ⇒ donation rejected.
3. **E2E smoke via Playwright** — signup → verify → profile update; give flow with Paystack test keys; admin CRUD for sermons/events.
4. **Manual QA checklist per release**: mobile nav on 360px width, dark mode on every page (theme toggle exists), gallery auto-scroll performance, form validation states, empty-states when collections are empty (many pages assume data exists).

### QA observations on current UX
- Loading states exist on some routes ([app/sermons/loading.tsx](app/sermons/loading.tsx)) but not most — add skeletons per route group.
- `images.unoptimized: true` in [next.config.mjs](next.config.mjs) disables Next image optimization — on a media-heavy church site this is a real performance cost (was probably set for static export; if deploying to Vercel/Node, remove it).
- Accessibility not yet audited: run axe on key pages; check focus traps in the many Radix dialogs, alt text on gallery images, contrast in the dark theme.

---

## 6. Product Review — Suggested Features

### Near-term, high congregation value
1. **Service times + "Plan Your Visit" flow** on the homepage — the single most common reason people visit a church site. Include map/directions and what-to-expect for first-timers.
2. **Recurring giving** — Paystack subscriptions for tithes; this materially changes giving consistency. Add giving statements (annual PDF receipt per member) for records.
3. **Event registration + reminders** — the API stub exists ([app/api/events/[id]/register/route.ts](app/api/events/[id]/register/route.ts)); finish it with capacity limits, QR check-in (`qrcode` is already a dependency), and email reminders.
4. **Sermon audio/video streaming embeds** (YouTube/Spotify podcast) rather than self-hosted files — cheaper, faster, and members already have the apps.
5. **WhatsApp integration for announcements** — in the Nigerian context WhatsApp reach far exceeds email; even a "share to WhatsApp" deep link on announcements/devotionals is high ROI.

### Medium-term
6. **Member directory with privacy controls** — the `privacySettings` field exists on the user model but is unused; ship visibility toggles before exposing the directory.
7. **Volunteer/department scheduling** — departments exist in the data model; rota scheduling for workers is a natural next step and a genuine admin pain point.
8. **Push notifications via the PWA** — `next-pwa` is already installed; service worker + FCM covers event reminders and devotional drops.
9. **Attendance tracking** — check-in at services (QR), giving admins real membership-engagement data.

### Later / roadmap-tier (already in [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md))
10. Live streaming page, mobile app, small-group management, counselling booking.

**Product advice**: the app currently tries to ship *everything at once* (messaging, media library, prayer wall, devotionals, donations, admin analytics). Cut scope for launch: **public site + auth + giving + sermons + events** is a complete v1. Messaging and the media library are v2 — their half-built state currently drags down both security and quality.

---

## 7. Prioritized Action Plan

**P0 — before any public deploy (≈3–5 days)**
1. Rewrite [firestore.rules](firestore.rules): delete the catch-all, per-collection rules, block self-role-writes (SEC-1, SEC-2).
2. Migrate API routes to Admin SDK + Firebase session-cookie/ID-token auth with role checks (SEC-3, SEC-5); do this *together with* #1 since they're coupled.
3. New `middleware.ts` for Firebase session cookies gating `/admin`, `/dashboard`, `/profile` (SEC-4).
4. Make Paystack verification mandatory, enforce amount match, add webhook route, server-set `status` (SEC-6).
5. Sync role custom claims on every role change (SEC-7).

**P1 — same week**
6. Remove `ignoreBuildErrors`/`ignoreDuringBuilds`; fix the ~25 type errors (several are real bugs — §4).
7. Untrack `functions/node_modules`; delete `src/`, duplicate login page, stray lockfile; pin `latest` deps.
8. Add CI (typecheck + lint + build) and Firestore rules tests.

**P2 — before launch**
9. Kill remaining mock data; empty-states everywhere; friendly auth error messages; enforce email verification.
10. Error tracking + basic analytics; re-enable image optimization; accessibility pass.

**P3 — post-launch**
11. Follow [IMPLEMENTATION_SPRINTS.md](IMPLEMENTATION_SPRINTS.md) Sprints 2–6 for feature completion, filtered through the scope cut in §6.

---

*Generated by senior-engineer review on 2026-07-10. Verify line numbers against current HEAD before acting; the codebase moves.*
