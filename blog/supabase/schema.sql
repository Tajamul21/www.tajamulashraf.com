-- Journey in Bytes dynamic backend setup for Supabase.
-- Run this once in Supabase SQL Editor, then paste your Project URL and anon key
-- into assets/js/site-config.js.

create table if not exists public.blog_comments (
  id bigint generated always as identity primary key,
  site_id text not null,
  post_slug text not null,
  display_name text default 'Anonymous',
  comment_text text not null,
  website text,
  is_anonymous boolean not null default false,
  status text not null default 'approved' check (status in ('approved', 'pending', 'hidden')),
  created_at timestamptz not null default now()
);

create table if not exists public.blog_visits (
  id bigint generated always as identity primary key,
  site_id text not null,
  page_slug text not null default 'home',
  path text,
  referrer text,
  visitor_id text,
  country text,
  country_code text,
  city text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

create index if not exists blog_comments_site_post_status_created_idx
  on public.blog_comments (site_id, post_slug, status, created_at desc);

create index if not exists blog_visits_site_created_idx
  on public.blog_visits (site_id, created_at desc);

create index if not exists blog_visits_site_country_idx
  on public.blog_visits (site_id, country_code, city);

alter table public.blog_comments enable row level security;
alter table public.blog_visits enable row level security;

-- Recreate policies so the script is safe to re-run.
drop policy if exists "Public can read approved comments" on public.blog_comments;
drop policy if exists "Public can add comments" on public.blog_comments;
drop policy if exists "Public can insert visit pings" on public.blog_visits;

create policy "Public can read approved comments"
  on public.blog_comments
  for select
  to anon, authenticated
  using (status = 'approved');

create policy "Public can add comments"
  on public.blog_comments
  for insert
  to anon, authenticated
  with check (
    site_id ~ '^[a-z0-9][a-z0-9_-]{2,63}$'
    and post_slug ~ '^[a-z0-9][a-z0-9_-]{1,159}$'
    and char_length(trim(comment_text)) between 2 and 1600
    and char_length(coalesce(display_name, '')) <= 80
    and (website is null or website ~* '^https?://')
    and status in ('approved', 'pending')
  );

create policy "Public can insert visit pings"
  on public.blog_visits
  for insert
  to anon, authenticated
  with check (
    site_id ~ '^[a-z0-9][a-z0-9_-]{2,63}$'
    and char_length(coalesce(page_slug, '')) between 1 and 180
    and char_length(coalesce(path, '')) <= 700
    and char_length(coalesce(referrer, '')) <= 500
    and char_length(coalesce(visitor_id, '')) <= 120
    and char_length(coalesce(country, '')) <= 120
    and char_length(coalesce(country_code, '')) <= 12
    and char_length(coalesce(city, '')) <= 120
    and (latitude is null or latitude between -90 and 90)
    and (longitude is null or longitude between -180 and 180)
  );

-- Browser-safe write endpoint for visits. This keeps the raw visits table
-- non-readable while avoiding client-side insert policy differences across key
-- types.
create or replace function public.record_blog_visit(
  p_site_id text,
  p_page_slug text,
  p_path text default null,
  p_referrer text default null,
  p_visitor_id text default null,
  p_country text default null,
  p_country_code text default null,
  p_city text default null,
  p_latitude double precision default null,
  p_longitude double precision default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not (
    p_site_id ~ '^[a-z0-9][a-z0-9_-]{2,63}$'
    and char_length(coalesce(p_page_slug, '')) between 1 and 180
    and char_length(coalesce(p_path, '')) <= 700
    and char_length(coalesce(p_referrer, '')) <= 500
    and char_length(coalesce(p_visitor_id, '')) <= 120
    and char_length(coalesce(p_country, '')) <= 120
    and char_length(coalesce(p_country_code, '')) <= 12
    and char_length(coalesce(p_city, '')) <= 120
    and (p_latitude is null or p_latitude between -90 and 90)
    and (p_longitude is null or p_longitude between -180 and 180)
  ) then
    raise exception 'Invalid visit payload';
  end if;

  insert into public.blog_visits (
    site_id,
    page_slug,
    path,
    referrer,
    visitor_id,
    country,
    country_code,
    city,
    latitude,
    longitude
  )
  values (
    p_site_id,
    p_page_slug,
    p_path,
    p_referrer,
    p_visitor_id,
    p_country,
    p_country_code,
    p_city,
    p_latitude,
    p_longitude
  );
end;
$$;

-- Public aggregate functions. These expose counts and coarse map points without
-- exposing the raw visit table.
create or replace function public.get_blog_visit_summary(p_site_id text)
returns table (
  total_views bigint,
  unique_visitors bigint,
  countries bigint,
  recent_views_24h bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*)::bigint as total_views,
    count(distinct nullif(visitor_id, ''))::bigint as unique_visitors,
    count(distinct nullif(country_code, ''))::bigint as countries,
    count(*) filter (where created_at >= now() - interval '24 hours')::bigint as recent_views_24h
  from public.blog_visits
  where site_id = p_site_id;
$$;

create or replace function public.get_blog_visit_locations(p_site_id text, p_days integer default 365)
returns table (
  label text,
  country text,
  country_code text,
  latitude double precision,
  longitude double precision,
  views bigint,
  last_seen timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(nullif(trim(both ', ' from concat_ws(', ', nullif(city, ''), nullif(country, ''))), ''), 'Unknown') as label,
    country,
    country_code,
    avg(latitude)::double precision as latitude,
    avg(longitude)::double precision as longitude,
    count(*)::bigint as views,
    max(created_at) as last_seen
  from public.blog_visits
  where site_id = p_site_id
    and created_at >= now() - make_interval(days => least(greatest(coalesce(p_days, 365), 1), 3650))
    and latitude is not null
    and longitude is not null
  group by country, country_code, city
  order by count(*) desc, max(created_at) desc
  limit 100;
$$;

create or replace function public.get_blog_comment_counts(p_site_id text)
returns table (
  post_slug text,
  approved_comments bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select post_slug, count(*)::bigint as approved_comments
  from public.blog_comments
  where site_id = p_site_id
    and status = 'approved'
  group by post_slug;
$$;

grant usage on schema public to anon, authenticated;
grant select, insert on public.blog_comments to anon, authenticated;
grant insert on public.blog_visits to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
grant execute on function public.record_blog_visit(text, text, text, text, text, text, text, text, double precision, double precision) to anon, authenticated;
grant execute on function public.get_blog_visit_summary(text) to anon, authenticated;
grant execute on function public.get_blog_visit_locations(text, integer) to anon, authenticated;
grant execute on function public.get_blog_comment_counts(text) to anon, authenticated;

-- Optional: enable realtime comment updates if your Supabase project has the
-- supabase_realtime publication. The DO block avoids duplicate-publication errors.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'blog_comments'
    ) then
      execute 'alter publication supabase_realtime add table public.blog_comments';
    end if;
  end if;
end $$;
