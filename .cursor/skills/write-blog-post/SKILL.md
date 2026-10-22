---
name: write-blog-post
description: Draft or update a blog note as a blog_posts row (slug, tags, cover, draft). Use when writing, publishing, or editing a post. Posts are not files in the repo.
---

# Write a blog post

There is no posts directory. A post is a `blog_posts` row, edited at `/admin` by `is_blog_admin()`. `savePost` in `src/app/admin/actions.ts` writes it.

- `title` — required, at most 180 characters
- `slug` — lowercase letters, numbers, hyphens (`isSlug` in `src/lib/slug.ts`), at most 80 characters
- `excerpt` — optional, at most 400 characters
- `content` — markdown body (GFM). Not a file.
- `tags` — up to 12 strings
- `cover_image_url` — public URL in the `blog-images` bucket, or null. Upload before save.
- `published` — `false` is the draft. `true` sets `published_at` when it is empty.

Published rows appear on `/blog`, the homepage notes, the RSS feed, and the sitemap. Do not insert with a service key, and do not publish by editing SQL.
