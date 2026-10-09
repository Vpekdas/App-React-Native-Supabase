create extension if not exists pgcrypto;

create schema if not exists private;

revoke all on schema private
from public, anon, authenticated;

create or replace function private.is_student()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and user_type = 'student'
  );
$$;

create or replace function private.is_chartered_accountant()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and user_type = 'chartered_accountant'
  );
$$;


revoke all
on function private.is_chartered_accountant()
from public, anon, authenticated;

revoke all
on function private.is_student()
from public, anon, authenticated;

grant usage on schema private
to authenticated;

grant execute
on function private.is_student()
to authenticated;

grant execute
on function private.is_chartered_accountant()
to authenticated;


create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  education_year integer,
  user_type text not null,
  requested_user_type text,
  topic text not null,
  topic_description text not null,
  supra text,
  topic_search tsvector generated always as (
    to_tsvector('french', coalesce(topic,''))
  ) stored,
  constraint profiles_requested_user_type_check
    check (requested_user_type is null or requested_user_type in ('student', 'chartered_accountant'))
);

alter table public.profiles enable row level security;

create index if not exists profiles_topic_search_gin
on public.profiles using gin (topic_search);


drop policy if exists "Anyone authenticated can view chartered accountants"
on public.profiles;

drop policy if exists "Accountants can view student profiles"
on public.profiles;

drop policy if exists "Users can view their own profile"
on public.profiles;

drop policy if exists "Users can view profiles"
on public.profiles;

create policy "Users can view profiles"
on public.profiles
for select
to authenticated
using (
  user_type = 'chartered_accountant'
  or
  (user_type = 'student' and (select private.is_chartered_accountant()))
  or
  (select auth.uid()) = id
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    education_year,
    user_type,
    requested_user_type,
    topic,
    topic_description,
    supra
  )
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    (new.raw_user_meta_data->>'education_year')::integer,
    'student',
    new.raw_user_meta_data->>'user_type',
    new.raw_user_meta_data->>'topic',
    new.raw_user_meta_data->>'topic_description',
    new.raw_user_meta_data->>'supra'
  );

  return new;
end;
$$;

revoke all
on function public.handle_new_user()
from public, anon, authenticated;


revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


drop function if exists public.request_chartered_accountant();
create or replace function public.request_chartered_accountant()
returns void
language sql
security invoker
set search_path = public
as $$
  update public.profiles
  set requested_user_type = 'chartered_accountant'
  where id = auth.uid();
$$;

revoke all on function public.request_chartered_accountant() from public, anon;
grant execute on function public.request_chartered_accountant() to authenticated;


create table if not exists public.resume_meta (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  storage_bucket text not null default 'resume',
  storage_path text not null,
  updated_at timestamptz not null default now()
);

alter table public.resume_meta enable row level security;

drop policy if exists "Students manage own resume meta"
on public.resume_meta;

drop policy if exists "Students can view own resume meta"
on public.resume_meta;

drop policy if exists "Students can insert own resume meta"
on public.resume_meta;

drop policy if exists "Students can update own resume meta"
on public.resume_meta;

drop policy if exists "Students can delete own resume meta"
on public.resume_meta;

drop policy if exists "Accountants can view resume meta"
on public.resume_meta;

drop policy if exists "Users can view resume meta"
on public.resume_meta;


create policy "Users can view resume meta"
on public.resume_meta
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or
  (select private.is_chartered_accountant())
);


create policy "Students can insert own resume meta"
on public.resume_meta
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);


create policy "Students can update own resume meta"
on public.resume_meta
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);


create policy "Students can delete own resume meta"
on public.resume_meta
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);


drop policy if exists "Upload own resume" on storage.objects;
drop policy if exists "Update own resume" on storage.objects;
drop policy if exists "View resumes (owner or accountant)" on storage.objects;
drop policy if exists "Delete own resume" on storage.objects;

create policy "Upload own resume"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'resume'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Update own resume"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'resume'
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'resume'
  and owner_id = (select auth.uid()::text)
);

create policy "View resumes (owner or accountant)"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'resume'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or (select private.is_chartered_accountant())
  )
);

create policy "Delete own resume"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'resume'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create or replace function public.list_students_with_resume(
  only_with_resume boolean default true,
  first_name_filter text default null,
  last_name_filter text default null,
  topic_filter text default null,
  education_year_filter int default null
)
returns table (
  id uuid,
  first_name text,
  last_name text,
  education_year int,
  topic text,
  topic_description text,
  resume_updated_at timestamptz,
  resume_path text
)
language sql
stable
set search_path = public
as $$
  select
    p.id,
    p.first_name,
    p.last_name,
    p.education_year,
    p.topic,
    p.topic_description,
    rm.updated_at as resume_updated_at,
    rm.storage_path as resume_path
  from public.profiles p
  left join public.resume_meta rm on rm.user_id = p.id
  where
    private.is_chartered_accountant()
    and p.user_type = 'student'
    and (not only_with_resume or rm.user_id is not null)
    and (
      first_name_filter is null
      or first_name_filter = ''
      or p.first_name ilike (first_name_filter || '%')
    )
    and (
      last_name_filter is null
      or last_name_filter = ''
      or p.last_name ilike (last_name_filter || '%')
    )
    and (
      topic_filter is null
      or topic_filter = ''
      or p.topic ilike ('%' || topic_filter || '%')
    )
    and (
      education_year_filter is null
      or p.education_year = education_year_filter
    )
  order by rm.updated_at desc nulls last, p.last_name, p.first_name;
$$;

revoke all on function public.list_students_with_resume(boolean, text, text, text, int) from public, anon;
grant execute on function public.list_students_with_resume(boolean, text, text, text, int) to authenticated;

create table if not exists public.accountant_public (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  topic text not null,
  topic_description text not null,
  topic_search tsvector generated always as (
    to_tsvector('french', coalesce(topic,'') || ' ' || coalesce(topic_description,''))
  ) stored,
  updated_at timestamptz not null default now()
);

create index if not exists accountant_public_topic_search_gin
on public.accountant_public using gin (topic_search);

alter table public.accountant_public enable row level security;

drop policy if exists "Authenticated can read accountant public" on public.accountant_public;
create policy "Authenticated can read accountant public"
on public.accountant_public
for select
to authenticated
using (true);

drop trigger if exists trg_sync_accountant_public on public.profiles;
drop function if exists public.sync_accountant_public();

create function public.sync_accountant_public()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_type = 'chartered_accountant' then
    insert into public.accountant_public (user_id, topic, topic_description, updated_at)
    values (new.id, new.topic, new.topic_description, now())
    on conflict (user_id)
    do update set
      topic = excluded.topic,
      topic_description = excluded.topic_description,
      updated_at = now();
  else
    delete from public.accountant_public where user_id = new.id;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_accountant_public() from public, anon, authenticated;

create trigger trg_sync_accountant_public
after insert or update of user_type, topic, topic_description
on public.profiles
for each row
execute procedure public.sync_accountant_public();

insert into public.accountant_public (user_id, topic, topic_description, updated_at)
select id, topic, topic_description, now()
from public.profiles
where user_type = 'chartered_accountant'
on conflict (user_id)
do update set
  topic = excluded.topic,
  topic_description = excluded.topic_description,
  updated_at = now();

drop function if exists public.search_accountant_public(text);
create or replace function public.search_accountant_public(search text)
returns table (
  user_id uuid,
  topic text,
  topic_description text,
  rank real,
  topic_highlight text
)
language sql
stable
set search_path = public
as $$
  with q as (select websearch_to_tsquery('french', search) as query)
  select
    ap.user_id,
    ap.topic,
    ap.topic_description,
    ts_rank(ap.topic_search, q.query) as rank,
    ts_headline('french', ap.topic, q.query, 'StartSel=[, StopSel=]') as topic_highlight
  from public.accountant_public ap, q
  where ap.topic_search @@ q.query
  order by rank desc;
$$;


revoke all on function public.search_accountant_public(text) from public, anon;
grant execute on function public.search_accountant_public(text) to authenticated;

create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  day_of_week int not null,
  start_time time not null,
  end_time time not null
);

alter table public.availability_rules enable row level security;

drop policy if exists "Accountants manage only their availability" on public.availability_rules;
drop policy if exists "Accountants select own availability" on public.availability_rules;
drop policy if exists "Accountants insert own availability" on public.availability_rules;
drop policy if exists "Accountants update own availability" on public.availability_rules;
drop policy if exists "Accountants delete own availability" on public.availability_rules;
drop policy if exists "Accountants can delete own availability" on public.availability_rules;
drop policy if exists "Anyone authenticated can view any availability" on public.availability_rules;


create policy "Anyone authenticated can view any availability"
on public.availability_rules
for select
to authenticated
using (true);

create policy "Accountants insert own availability"
on public.availability_rules
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (select private.is_chartered_accountant())
);

create policy "Accountants update own availability"
on public.availability_rules
for update
to authenticated
using (
  (select auth.uid()) = user_id
  and (select private.is_chartered_accountant())
)
with check (
  (select auth.uid()) = user_id
  and (select private.is_chartered_accountant())
);

create policy "Accountants delete own availability"
on public.availability_rules
for delete
to authenticated
using (
  (select auth.uid()) = user_id
  and (select private.is_chartered_accountant())
);


create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),

  room_name text not null unique,

  student_id uuid not null
    references public.profiles(id)
    on delete cascade,

  accountant_id uuid not null
    references public.profiles(id)
    on delete cascade,

  student_topic text not null,
  student_topic_description text not null,

  accountant_topic text not null,
  accountant_topic_description text not null,

  starts_at timestamptz not null,
  ends_at timestamptz not null,

  status text not null default 'scheduled'
    check (
      status in (
        'scheduled',
        'active',
        'completed',
        'cancelled'
      )
    ),

  created_at timestamptz not null default now(),

  constraint meetings_time_check
    check (ends_at > starts_at)
);

alter table public.meetings enable row level security;

create index if not exists meetings_student_id_idx
on public.meetings(student_id);

create index if not exists meetings_accountant_id_idx
on public.meetings(accountant_id);

create index if not exists meetings_starts_at_idx
on public.meetings(starts_at);


drop policy if exists "Students can view own meetings"
on public.meetings;

drop policy if exists "Accountants can view own meetings"
on public.meetings;

drop policy if exists "Users can view own meetings"
on public.meetings;

create policy "Users can view own meetings"
on public.meetings
for select
to authenticated
using (
  (select auth.uid()) = student_id
  or
  (select auth.uid()) = accountant_id
);




drop policy if exists "Students can create meetings"
on public.meetings;

create policy "Students can create meetings"
on public.meetings
for insert
to authenticated
with check (
(select auth.uid()) = student_id
and (select private.is_student())
);


drop policy if exists "Students can cancel own meetings"
on public.meetings;

drop policy if exists "Accountants can update own meetings"
on public.meetings;

drop policy if exists "Users can update own meetings"
on public.meetings;

create policy "Users can update own meetings"
on public.meetings
for update
to authenticated
using (
  (select auth.uid()) = student_id
  or
  (select auth.uid()) = accountant_id
)
with check (
  (select auth.uid()) = student_id
  or
  (select auth.uid()) = accountant_id
);


create or replace function public.get_available_slots(
  p_accountant_id uuid,
  p_date date
)
returns table (
  start_time timestamptz,
  end_time timestamptz
)
language sql
stable
security invoker
set search_path = public
as $$
with rules as (
  select *
  from public.availability_rules
  where user_id = p_accountant_id
    and day_of_week = extract(dow from p_date)
    and exists (
      select 1
      from public.profiles
      where id = p_accountant_id
        and user_type = 'chartered_accountant'
    )
),

slots as (
  select
    (p_date::timestamp + start_time) as local_start,
    (p_date::timestamp + end_time) as local_end
  from rules
),

converted as (
  select
    local_start at time zone 'Europe/Paris' as slot_start,
    local_end at time zone 'Europe/Paris' as slot_end
  from slots
),

expanded as (
  select
    generate_series(
      slot_start,
      slot_end - interval '1 hour',
      interval '1 hour'
    ) as start_time
  from converted
),

candidate_slots as (
  select
    start_time,
    start_time + interval '1 hour' as end_time
  from expanded
)

select cs.*
from candidate_slots cs
where not exists (
  select 1
  from public.meetings m
  where m.accountant_id = p_accountant_id
    and m.status != 'cancelled'
    and tstzrange(m.starts_at, m.ends_at)
        && tstzrange(cs.start_time, cs.end_time)
)
and (
  p_date > (now() at time zone 'Europe/Paris')::date
  or (
    p_date = (now() at time zone 'Europe/Paris')::date
    and cs.end_time > (now() at time zone 'Europe/Paris')
  )
)
order by start_time;
$$;

revoke all
on function public.get_available_slots(uuid, date)
from public, anon, authenticated;

grant execute
on function public.get_available_slots(uuid, date)
to authenticated;


create or replace function public.create_availability_rules(rules jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  r jsonb;
begin
  delete from public.availability_rules
  where user_id = auth.uid();

  for r in select jsonb_array_elements(rules)
  loop
    insert into public.availability_rules (
      user_id,
      day_of_week,
      start_time,
      end_time
    )
    values (
      auth.uid(),
      (r->>'day_of_week')::int,
      (r->>'start_time')::time,
      (r->>'end_time')::time
    );
  end loop;
end;
$$;

revoke all on function public.create_availability_rules(jsonb) from public, anon;
grant execute on function public.create_availability_rules(jsonb) to authenticated;

alter table public.meetings drop constraint if exists no_overlapping_accountant_meetings;

create schema if not exists extensions;
drop extension if exists btree_gist;
create extension if not exists btree_gist schema extensions;
revoke create on schema extensions from public;

alter table public.meetings
add constraint no_overlapping_accountant_meetings
exclude using gist (
  accountant_id with =,
  tstzrange(starts_at, ends_at) with &&
)
where (status = 'scheduled');


revoke all on function public.rls_auto_enable() from public, anon, authenticated;


create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    uid uuid;
begin
    uid := (select auth.uid());

    if uid is null then
        raise exception 'Not authenticated';
    end if;

    delete from storage.objects
    where bucket_id = 'resume'
      and name like uid::text || '/%';

    delete from public.profiles
    where id = uid;

    delete from auth.users
    where id = uid;
end;
$$;

revoke all
on function public.delete_my_account()
from public, anon, authenticated;

grant execute
on function public.delete_my_account()
to authenticated;
