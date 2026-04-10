# HokieHealth

A **mental health micro check-in** web app for Virginia Tech students: quick mood + stress logging, curated coping and affirmations (no external LLM), mood trends, and campus resources. Built with **Next.js 15**, **Tailwind CSS**, **shadcn/ui**, and **Supabase** (auth + Postgres).

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```


2. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

4. **Auth**

   - Sign up on `/signup`. If email confirmation is enabled in Supabase, confirm via email before signing in.
   - The `profiles` row is upserted when you use the app (`ensureUserProfile`).

## Scripts

| Command        | Description        |
| -------------- | ------------------ |
| `npm run dev`  | Dev server (Turbopack) |
| `npm run build`| Production build   |
| `npm run start`| Production server |
| `npm run lint` | ESLint             |

## Project layout

- `src/app` — App Router routes (marketing `/`, auth `/login` `/signup`, protected app under `(protected)/…`).
- `src/components` — UI primitives (`components/ui`) and feature components.
- `src/lib` — Supabase clients, feedback pools, campus resources, stats helpers.
- `mockups/` — Original static HTML mockups (reference only).
- `supabase/migrations` — SQL for manual application in Supabase.

## Deploy (e.g. Vercel)

1. **Vercel → Project → Settings → Environment Variables** (Production at minimum):
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same as local).
   - `NEXT_PUBLIC_SITE_URL` = your live origin, e.g. `https://mental-health-webapp-sigma.vercel.app` (no trailing slash).  
     If you omit this, the app falls back to Vercel’s `VERCEL_URL` on the server so email links can still work, but setting the variable explicitly is recommended.

2. **Supabase → Authentication → URL configuration**
   - **Site URL**: your production URL (same as above), not `http://localhost:3000`.
   - **Redirect URLs**: include  
     `https://mental-health-webapp-sigma.vercel.app/auth/callback`  
     (and `http://localhost:3000/auth/callback` for local dev).  
     Add preview URLs too if you test PR deployments, e.g. `https://*.vercel.app/**` or each preview URL.

Confirmation and magic-link emails use `emailRedirectTo` built from `NEXT_PUBLIC_SITE_URL` (or `VERCEL_URL` on Vercel). If links still open localhost, the Supabase allow list or Vercel env is usually missing the production URL—update both, redeploy, then sign up again (or resend confirmation).

## Disclaimer

This is a **course project**, not a medical or crisis service. For emergencies, call **911** or **988** (US). Virginia Tech students can use [Cook Counseling Center](https://www.ucc.vt.edu) and related resources listed in the app.
