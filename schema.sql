-- ============================================================
-- Sahyadri Trail Hub — Supabase Schema
-- Paste this into: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

create extension if not exists "uuid-ossp";


-- ============================================================
-- TABLES
-- ============================================================

-- Trails & Forts directory
create table public.trails (
  id                    uuid default uuid_generate_v4() primary key,
  name                  text not null,
  slug                  text not null unique,
  description           text,
  region                text not null,           -- e.g. Pune, Nashik, Konkan
  latitude              double precision not null,
  longitude             double precision not null,
  elevation_meters      int,
  length_km             numeric(6, 2),
  difficulty            text check (difficulty in ('easy', 'moderate', 'hard', 'expert'))
                        not null default 'moderate',
  is_fort               boolean default false,
  is_community_submitted boolean default false,  -- true when added by a user, not curated
  submitted_by          uuid references auth.users(id) on delete set null,
  created_at            timestamptz default now()
);

-- Hiker profiles (extends Supabase's built-in auth.users)
create table public.hikers (
  id          uuid references auth.users(id) on delete cascade primary key,
  username    text unique not null,
  full_name   text,
  bio         text,
  home_city   text,           -- e.g. Pune, Mumbai, Nagpur
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Trek logs — covers both Live (GPS verified) and Memoir (past) entries
create table public.trek_logs (
  id                  uuid default uuid_generate_v4() primary key,
  hiker_id            uuid references public.hikers(id) on delete cascade not null,
  trail_id            uuid references public.trails(id) on delete cascade not null,
  date_climbed        date not null,
  story               text,                  -- free-form memoir / trip report
  conditions_review   text,                  -- structured conditions (ingested by RAG in Phase 3)
  rating              int check (rating between 1 and 5),
  is_verified         boolean default false, -- true = GPS-confirmed at trailhead
  drive_folder_url    text,                  -- Google Drive folder shared link
  google_photos_url   text,                  -- Google Photos album link (optional)
  created_at          timestamptz default now(),
  constraint unique_hiker_trail unique(hiker_id, trail_id)
);

-- Badges — one per trail, generated once and cached forever
create table public.badges (
  id           uuid default uuid_generate_v4() primary key,
  trail_id     uuid references public.trails(id) on delete cascade unique not null,
  image_url    text not null,    -- Pollinations.ai generated URL, cached here
  prompt_used  text,             -- the prompt used to generate it (for reference)
  created_at   timestamptz default now()
);

-- Hiker badge collection — which badges each hiker has earned
create table public.hiker_badges (
  id           uuid default uuid_generate_v4() primary key,
  hiker_id     uuid references public.hikers(id) on delete cascade not null,
  badge_id     uuid references public.badges(id) on delete cascade not null,
  trek_log_id  uuid references public.trek_logs(id) on delete set null,
  is_verified  boolean default false,   -- mirrors trek_log.is_verified at time of earning
  earned_at    timestamptz default now(),
  constraint unique_hiker_badge unique(hiker_id, badge_id)
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- keeps data safe — users can only touch their own rows
-- ============================================================

alter table public.trails       enable row level security;
alter table public.hikers       enable row level security;
alter table public.trek_logs    enable row level security;
alter table public.badges       enable row level security;
alter table public.hiker_badges enable row level security;

-- Trails: public read, auth users can submit new ones
create policy "Anyone can view trails"
  on public.trails for select using (true);
create policy "Authenticated users can add trails"
  on public.trails for insert with check (auth.role() = 'authenticated');

-- Hikers: public read, own row only for write
create policy "Anyone can view hiker profiles"
  on public.hikers for select using (true);
create policy "Users can create their own profile"
  on public.hikers for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on public.hikers for update using (auth.uid() = id);

-- Trek logs: public read, own rows for write
create policy "Anyone can view trek logs"
  on public.trek_logs for select using (true);
create policy "Users can create their own trek logs"
  on public.trek_logs for insert with check (auth.uid() = hiker_id);
create policy "Users can update their own trek logs"
  on public.trek_logs for update using (auth.uid() = hiker_id);
create policy "Users can delete their own trek logs"
  on public.trek_logs for delete using (auth.uid() = hiker_id);

-- Badges: public read, open insert (server generates them)
create policy "Anyone can view badges"
  on public.badges for select using (true);
create policy "Server can insert badges"
  on public.badges for insert with check (true);

-- Hiker badges: public read, users earn their own
create policy "Anyone can view hiker badges"
  on public.hiker_badges for select using (true);
create policy "Users can earn their own badges"
  on public.hiker_badges for insert with check (auth.uid() = hiker_id);


-- ============================================================
-- TRIGGER: auto-create hiker profile on signup
-- fires immediately after a new user registers via Supabase Auth
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.hikers (id, username, full_name, avatar_url)
  values (
    new.id,
    -- fall back to email prefix if no username passed at signup
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
