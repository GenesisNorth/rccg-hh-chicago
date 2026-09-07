# Disabled: Firebase, auth, and the admin system

Nothing here is deleted — it is **moved out of the build**. The site now runs as a
static church website with a single mail-sending API route. This folder holds
everything that was removed, at paths that mirror where it came from.

It is excluded from:

- the TypeScript build — `"exclude": ["_disabled"]` in `tsconfig.json`
- ESLint — `ignorePatterns` in `.eslintrc.json`
- Next.js routing — Next only reads `app/`, so nothing here is served

## What's in here

| Path | Was |
| --- | --- |
| `app/admin/` | Admin CMS (events, sermons, media, users, donations, analytics, settings) |
| `app/auth/` | Sign in, sign up, password reset, email verification |
| `app/dashboard/`, `app/profile/`, `app/messages/`, `app/users/`, `app/notifications/`, `app/announcements/` | Member-only features |
| `app/devotionals/`, `app/media/` | Firestore-backed content pages |
| `app/api/` | All the old API routes (Firestore CRUD, session cookie, Paystack webhook) |
| `app/events/[id]/`, `app/sermons/[id]/` | Event and sermon detail pages |
| `lib/firebase*.ts`, `lib/firestore-*.ts`, `lib/admin-firestore.ts`, `lib/server-auth.ts` | Firebase client + admin SDK wiring |
| `lib/roles.ts`, `lib/auth-errors.ts`, `lib/validation.ts`, `lib/email.ts`, `lib/events-server.ts`, `lib/cloudinary.ts` | Supporting libraries |
| `contexts/AuthContext.tsx`, `providers/session-provider.tsx` | Auth state |
| `hooks/useFirestore.ts`, `hooks/use-token-refresh.ts`, `hooks/use-sermons.ts` | Firestore data hooks |
| `components/admin/`, `components/communication/`, `components/media/`, `components/payments/` | Admin, chat, media and payment widgets |
| `components/session-*.tsx`, `components/user-*.tsx`, `components/profile-image-upload.tsx`, `components/Sermon*.tsx`, `components/file-upload.tsx` | Account UI |
| `config/` | `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `storage.rules` |
| `scripts/` | Admin bootstrap and Firebase connection scripts |
| `__tests__/`, `vitest.config.ts` | Firestore security-rules tests |
| `middleware.ts` | Session-cookie route protection |
| `env.local.firebase.bak` | The original `.env.local`, including the Firebase keys |

## How to restore it

1. Move the files back to their original locations (the table above maps them).
2. Reinstall the removed packages:

   ```bash
   npm install firebase firebase-admin cloudinary next-cloudinary \
     @stripe/stripe-js react-paystack ts-node --legacy-peer-deps
   npm install -D firebase-tools @firebase/rules-unit-testing vitest --legacy-peer-deps
   ```

3. Restore the Firebase env vars from `env.local.firebase.bak` into `.env.local`.
4. Re-add `<AuthProvider>` around the tree in `app/layout.tsx`.
5. Restore the account menu in `components/layout/IntuitiveHeader.tsx` (it was
   replaced with "Plan a Visit" / "Prayer" links).
6. Re-add the `setup:admin`, `test:rules` and `firebase:deploy:rules` scripts to
   `package.json`, and the `rules-tests` job to `.github/workflows/ci.yml`.

## Careful

`app/events/page.tsx` and `app/sermons/page.tsx` were **rewritten** to read from
`content/events.ts` and `content/sermons.ts`. Their Firestore versions are gone,
not archived — restoring auth means rewriting those two pages against the API
again, or leaving them static (they work fine either way).
