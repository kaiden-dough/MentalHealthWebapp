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

3. **Auth**

   - Sign up on `/signup`. If email confirmation is enabled in Supabase, confirm via email before signing in.
   - The `profiles` row is upserted when you use the app (`ensureUserProfile`).

## Testing

The suite uses **[Vitest](https://vitest.dev/)** in a Node environment. Tests live under `tests/` (`tests/lib`, `tests/app`, `tests/integration`, etc.), with `vitest.config.ts` at the repo root. Server actions, library helpers, the auth callback route, Supabase middleware helpers, and instrumentation are exercised with **mocked** Supabase and Next.js APIs, so you do not need a running database to execute the suite.

`npm run test:coverage` enables **v8** coverage, prints a summary table in the terminal, and writes an HTML report to `coverage/` (gitignored). Coverage targets `src/**/*.{ts,tsx}` with noisy paths trimmed (for example `src/components/ui`).

The main `tsconfig.json` **excludes** the `tests/` tree so `next build` (including on Vercel, where devDependencies such as Vitest are not installed) does not typecheck spec files that import `vitest`.

## Scripts

| Command        | Description        |
| -------------- | ------------------ |
| `npm run dev`  | Dev server (Turbopack) |
| `npm run build`| Production build   |
| `npm run start`| Production server |
| `npm run lint` | ESLint             |
| `npm test` | Vitest (watch) |
| `npm run test:run` | Vitest (single run) |
| `npm run test:coverage` | Vitest + coverage report |

## Project layout

- `src/app` — App Router routes (marketing `/`, auth `/login` `/signup`, protected app under `(protected)/…`).
- `src/components` — UI primitives (`components/ui`) and feature components.
- `src/lib` — Supabase clients, feedback pools, campus resources, stats helpers.
- `tests/` — Vitest specs and shared test helpers (see **Testing** above).
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
