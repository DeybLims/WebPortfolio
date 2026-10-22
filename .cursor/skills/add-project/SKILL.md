---
name: add-project
description: Add or edit a portfolio project and its /work page, including the next/image screenshot and NDA checks. Use when changing a case study, project card, or work slug.
---

# Add a project

1. Add the `Project` in `src/lib/portfolio-data.ts`. `/work/[slug]` is generated from that array (`dynamicParams` is false). The slug is `workSlug(title)`: lowercase, non-alphanumerics become hyphens. Káon is `/work/k-on`.
2. Fields: `title`, `year`, `description`, `tags`, `links`, `problem`, `constraints`, `solution`, `metrics`. Optional `image`, `images`, `imageFit` (`cover`, `contain`, or `shot`).
3. Save screenshots under `public/images/projects/` and reference `/images/projects/...`. `ProjectGallery` renders them with `next/image` (`width`, `height`, `sizes`). Keep each file under 500KB.
4. BuildMaster: no stack, vendors, metrics, or web storefront. Do not add TenantHub to the public site. ColorAid stays a finished 2024 thesis with `links: []`.
5. Touch `resume-public.ts` or `public/llms.txt` only when the public story changes. The résumé PDF must stay one page (`npm run resume`).
