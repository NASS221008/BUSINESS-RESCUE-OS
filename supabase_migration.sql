-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run
-- Creates a table to hold each user's business-onboarding details,
-- with Row Level Security so a user can only ever see/edit their own row.

create table if not exists public.business_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  business_name text not null,
  industry text,
  business_type text,
  location text,
  employee_count text,
  primary_challenge text,
  created_at timestamp with time zone default now()
);

alter table public.business_profiles enable row level security;

-- A user can read only their own profile row
create policy "Users can view own business profile"
  on public.business_profiles for select
  using (auth.uid() = id);

-- A user can create only their own profile row (id must match their own auth id)
create policy "Users can insert own business profile"
  on public.business_profiles for insert
  with check (auth.uid() = id);

-- A user can update only their own profile row
create policy "Users can update own business profile"
  on public.business_profiles for update
  using (auth.uid() = id);
