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

Set the same environment variables in the Vercel project. Set `NEXT_PUBLIC_SITE_URL` to your production URL for auth email redirects.

## Disclaimer

This is a **course project**, not a medical or crisis service. For emergencies, call **911** or **988** (US). Virginia Tech students can use [Cook Counseling Center](https://www.ucc.vt.edu) and related resources listed in the app.
