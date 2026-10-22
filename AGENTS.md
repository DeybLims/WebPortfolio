# Agents

Next.js 16.1.7, React 19.2.3, TypeScript 5 (`strict`), Tailwind CSS 4. App Router.

## Map

- `src/app` — routes: home, `work/[slug]`, `blog`, `now`, `admin`.
- `src/components` — UI. Page sections live in `sections/`.
- `src/lib` — data and helpers. Public copy is `portfolio-data.ts` and `resume-public.ts`. Posts come from Supabase. There is no `content/` directory.
- `supabase/migrations` — SQL only. Do not apply it from the app.
- `public` — images, résumé PDF, `llms.txt`, `resume.json`.

## Commands

- `npm run dev`
- `npm run build` (typechecks)
- `npm run lint`
- `npm run typecheck` (`tsc --noEmit`)
- `npm run mobile-check` — server already running (`MOBILE_CHECK_URL`, default `http://127.0.0.1:3000`)

## Conventions

Server Components by default. Add `"use client"` only for state, events, or browser APIs. Style with Tailwind plus `src/app/globals.css`. Import from `@/*`. Screenshots use `next/image` with `width`, `height`, and `sizes`.

## Before you finish

Build passes. At 390px, `documentElement.scrollWidth <= clientWidth` (and `innerWidth` stays equal to `clientWidth`). Check light and dark.

## Hard rules

- BuildMaster: no tech stack, vendors, architecture, or metrics. Mobile app only — never mention a web storefront or admin. Keep the App Store and Google Play links already in the data.
- TenantHub is not on the public site. Do not add it to the project list, `/work`, résumé, `llms.txt`, sitemap, or nav. The admin SQL hint may still name the private Supabase project.
- ColorAid is a finished 2024 college thesis, not current work.
- Never commit secrets, `.env*`, or demo credentials.
- Commits are Dave Emanuel Lima `<99727483+DeybLims@users.noreply.github.com>` only. No Co-authored-by, Cursor, or other trailers.
