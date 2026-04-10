# HokieHealth

A **mental health micro check-in** web app for Virginia Tech students: quick mood + stress logging, curated coping and affirmations (no external LLM), mood trends, and campus resources. Built with **Next.js 15**, **Tailwind CSS**, **shadcn/ui**, and **Supabase** (auth + Postgres).

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Supabase**

   - Copy `.env.example` to **`.env.local`** and set **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** (Dashboard → **Project Settings → API** — use the **anon** “legacy” JWT or the **publishable** key; either works with `@supabase/ssr`).
   - **`NEXT_PUBLIC_SUPABASE_URL`** is prefilled in `.env.example` for the shared project; change it if you use a different project.
   - **Authentication → URL configuration**: set **Site URL** to `http://localhost:3000` (and your production URL later). Under **Redirect URLs**, add `http://localhost:3000/auth/callback` (and the production callback when you deploy).
   - Database tables (`profiles`, `mood_entries` + RLS) are created by migration `hokiehealth_initial_schema` on the linked project. For a fresh project, run `supabase/migrations/001_initial.sql` in the SQL Editor.

3. **Run the dev server**

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

Set the same environment variables in the Vercel project. Set `NEXT_PUBLIC_SITE_URL` to your production URL for auth email redirects.

## Troubleshooting dev server (`localStorage.getItem is not a function`)

If Node was started with **`--localstorage-file`** without a valid path, **`localStorage.getItem` may not be a function**. That can come from **Cursor/IDE** injecting `NODE_OPTIONS` even when your PowerShell session shows **`$env:NODE_OPTIONS` empty**.

1. **`next.config.ts`** imports **`src/lib/patch-node-localstorage.ts`** first so a safe in-memory `localStorage` is installed before SSR.
2. **`src/instrumentation.ts`** applies the same fix when the instrumentation hook runs (no longer requires `NEXT_RUNTIME === "nodejs"`).
3. **Toasts** use `next/dynamic` with `ssr: false` so Sonner does not render on the server.
4. Fallback: run **`npm run dev:webpack`** (no Turbopack) if anything still misbehaves.
5. Optional: remove bad flags from **Windows Environment Variables** or Cursor’s terminal profile so Node stops printing the `--localstorage-file` warning.

## Disclaimer

This is a **course project**, not a medical or crisis service. For emergencies, call **911** or **988** (US). Virginia Tech students can use [Cook Counseling Center](https://www.ucc.vt.edu) and related resources listed in the app.
