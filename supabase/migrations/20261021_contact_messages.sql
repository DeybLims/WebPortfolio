-- Contact form for TenantHub (egqddklxfowfgirmpzey).
-- Do not apply this from the app. Run it once in the Supabase SQL editor.
-- Anon can insert. Only public.is_blog_admin() (davelima2@gmail.com) can read or delete.
-- Requires the existing public.is_blog_admin() function from the blog admin setup.
--
-- Spam controls:
--   * company_url is a honeypot. It must stay an empty string.
--   * A before-insert trigger allows 3 messages per email per hour, and 30 messages total per hour.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  company_url text not null default '',
  created_at timestamptz not null default now(),
  constraint contact_messages_name_len check (char_length(btrim(name)) between 1 and 80),
  constraint contact_messages_email_len check (char_length(btrim(email)) between 3 and 200),
  constraint contact_messages_email_shape check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint contact_messages_message_len check (char_length(btrim(message)) between 1 and 4000),
  constraint contact_messages_honeypot check (company_url = '')
);

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index contact_messages_email_created_idx on public.contact_messages (lower(email), created_at desc);

alter table public.contact_messages enable row level security;

revoke all on table public.contact_messages from public, anon, authenticated;
grant insert on table public.contact_messages to anon, authenticated;
grant select, delete on table public.contact_messages to authenticated;

create policy "contact_messages insert"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (
    company_url = ''
    and char_length(btrim(name)) between 1 and 80
    and char_length(btrim(email)) between 3 and 200
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and char_length(btrim(message)) between 1 and 4000
  );

create policy "contact_messages admin read"
  on public.contact_messages
  for select
  to authenticated
  using ((select public.is_blog_admin()));

create policy "contact_messages admin delete"
  on public.contact_messages
  for delete
  to authenticated
  using ((select public.is_blog_admin()));

create or replace function public.enforce_contact_message_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent_email integer;
  recent_all integer;
begin
  if new.company_url is distinct from '' then
    raise exception 'rejected' using errcode = '42501';
  end if;

  select count(*)
    into recent_email
  from public.contact_messages
  where lower(email) = lower(new.email)
    and created_at > now() - interval '1 hour';

  if recent_email >= 3 then
    raise exception 'rate limited' using errcode = '54000';
  end if;

  select count(*)
    into recent_all
  from public.contact_messages
  where created_at > now() - interval '1 hour';

  if recent_all >= 30 then
    raise exception 'rate limited' using errcode = '54000';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_contact_message_rate_limit() from public;
grant execute on function public.enforce_contact_message_rate_limit() to anon, authenticated;

drop trigger if exists contact_messages_rate_limit on public.contact_messages;
create trigger contact_messages_rate_limit
  before insert on public.contact_messages
  for each row
  execute function public.enforce_contact_message_rate_limit();
