# Setting up real per-user auth (Supabase)

## 1. Create a Supabase project
1. Go to https://supabase.com → New project.
2. Pick any name/region/password (this password is for the Postgres DB, not user logins).
3. Wait ~2 min for it to provision.

## 2. Turn on email/password auth (usually on by default)
Dashboard → **Authentication → Providers → Email** → make sure it's enabled.
For hackathon speed, also turn OFF "Confirm email" under **Authentication → Providers → Email → Confirm email**,
so new accounts can log in immediately without clicking a verification link.

## 3. Create the business_profiles table
Dashboard → **SQL Editor → New query** → paste the contents of `supabase_migration.sql`
(included in this project) → **Run**.

This creates a `business_profiles` table with Row Level Security, so each user can only
ever read or write their own row — Postgres enforces this, not your app code.

## 4. Grab your keys
Dashboard → **Settings → API**:
- **Project URL**
- **anon public** key

(You do NOT need a JWT secret — newer Supabase projects use public signing keys instead,
and the backend verifies tokens against Supabase's public key endpoint automatically.)

## 5. Configure the frontend
```
cd frontend-ui
cp .env.example .env.local
```
Edit `.env.local`:
```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
Then install the new dependency and rebuild:
```
npm install
npm run build
```
(The FastAPI backend serves `frontend-ui/dist`, so `npm run build` is required after any
frontend change — `npm run dev` on port 5173 also works for local iteration.)

## 6. Configure the backend
From the project root:
```
cp .env.example .env
```
Edit `.env`:
```
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
```
Install the new Python deps:
```
pip install -r backend/requirements.txt
```

## 7. Run it
```
uvicorn backend.main:app --reload --port 8000
```
Visit http://localhost:8000. The old `business_rescue.db` was removed since its schema
changed (added an `owner_id` column) — a fresh one is created automatically on first run.

## What you should see now
1. **Sign up** with an email/password → real Supabase account is created.
2. Since it's a new account, you're prompted for **business details** → saved to
   `business_profiles`, scoped to your user id only.
3. You land on the **dashboard**, and any incidents you create are tagged with your
   account's id in SQLite (`owner_id`), so another account will never see them.
4. **Sign out** and create a second account → you'll get a blank dashboard and a fresh
   onboarding prompt — proving the two accounts are fully separated.
5. Logging back into the first account skips onboarding and goes straight to its own
   dashboard, since `business_profiles` already has a row for that user id.

## Files changed/added
```
backend/auth.py                          (new — verifies Supabase JWT via public JWKS)
backend/main.py                          (every endpoint now requires + filters by owner_id)
backend/requirements.txt                 (+ PyJWT, cryptography, python-dotenv)
database/models.py                       (+ owner_id column on Product)
.env.example                             (new)
supabase_migration.sql                   (new — run this in Supabase SQL Editor)

frontend-ui/src/lib/supabaseClient.ts    (new)
frontend-ui/src/lib/api.ts               (new — auth-aware fetch wrapper)
frontend-ui/src/components/AuthPage.tsx  (new — sign in / sign up)
frontend-ui/src/components/OnboardingForm.tsx (new — business details form)
frontend-ui/src/AuthGate.tsx             (new — orchestrates auth → onboarding → dashboard)
frontend-ui/src/main.jsx                 (mounts AuthGate instead of App)
frontend-ui/src/App.tsx                  (fetch → apiFetch, accepts user/business props)
frontend-ui/src/components/Header.tsx    (account badge + sign-out button)
frontend-ui/package.json                 (+ @supabase/supabase-js)
frontend-ui/.env.example                 (new)
```

## Note on business_rescue.db
Product/Problem/RecoveryReport data still lives in the local SQLite file — that part
wasn't moved to Supabase. Only **auth** and the **business_profiles** onboarding data
live in Supabase. This was the fastest path to "real separate accounts" without a full
database migration; if you later want everything in one place, the same `owner_id`
pattern extends cleanly to migrating those tables into Supabase Postgres too.
