-- Now page for TenantHub (egqddklxfowfgirmpzey).
-- Run once in the Supabase SQL editor. Anyone can read. Only blog admins can write,
-- using the existing public.is_blog_admin() check (davelima2@gmail.com).

create table public.now_page (
  id integer primary key default 1,
  updated_label text not null,
  updated_date text not null,
  intro text not null,
  sections jsonb not null,
  updated_at timestamptz not null default now(),
  constraint now_page_singleton check (id = 1)
);

alter table public.now_page enable row level security;

grant select on table public.now_page to anon, authenticated;
grant insert, update, delete on table public.now_page to authenticated;

create policy "now_page public read"
  on public.now_page
  for select
  to anon, authenticated
  using (true);

create policy "now_page admin insert"
  on public.now_page
  for insert
  to authenticated
  with check ((select public.is_blog_admin()));

create policy "now_page admin update"
  on public.now_page
  for update
  to authenticated
  using ((select public.is_blog_admin()))
  with check ((select public.is_blog_admin()));

create policy "now_page admin delete"
  on public.now_page
  for delete
  to authenticated
  using ((select public.is_blog_admin()));

insert into public.now_page (id, updated_label, updated_date, intro, sections)
values (
  1,
  'October 2026',
  '2026-10',
  'I''m Dave Lima, a senior software engineer at Quirao Group in Iloilo, Philippines. This is what I''m doing now.',
  $now$[
    {
      "id": "work",
      "label": "Work",
      "paragraphs": [
        "I own the backend infrastructure for a commercial construction product at Quirao Group. Details under NDA."
      ]
    },
    {
      "id": "building",
      "label": "Building",
      "paragraphs": [
        "I'm polishing this portfolio and the blog."
      ]
    },
    {
      "id": "learning",
      "label": "Learning",
      "paragraphs": ["Two things I want to practice."],
      "items": ["System design", "Mentoring as a new senior"]
    },
    {
      "id": "writing",
      "label": "Writing",
      "paragraphs": ["I published a note on what changed from intern to senior."],
      "href": "/blog/from-intern-to-senior",
      "linkLabel": "From intern to senior: what actually changed"
    },
    {
      "id": "life",
      "label": "Life",
      "paragraphs": ["I'm based in Iloilo City."]
    }
  ]$now$::jsonb
)
on conflict (id) do nothing;
