-- Create tables for Elevate HER Workday Phase B Persistence

create table public.accounts (
  id uuid references auth.users not null primary key,
  timezone text,
  preferred_work_days text[],
  subscription_status text default 'inactive',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.profiles (
  account_id uuid references public.accounts not null primary key,
  q01_to_q09 jsonb,
  confirmed_primary text,
  confirmed_secondary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.exclusions (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts not null,
  action_id text not null,
  scope text not null, -- 'today' or 'permanent'
  local_date text,
  reason_category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.daily_entries (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts not null,
  local_date text not null,
  timezone_at_entry text,
  check_in_values jsonb,
  symptom_list jsonb,
  optional_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (account_id, local_date)
);

create table public.daily_plans (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts not null,
  local_date text not null,
  revision integer default 1,
  effective_concern text,
  effective_controls text[],
  action_snapshots jsonb,
  fallback text,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (account_id, local_date)
);

create table public.action_feedback (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts not null,
  daily_plan_id uuid references public.daily_plans,
  action_id text not null,
  status text not null, -- 'helpful', 'not_helpful', 'not_tried'
  optional_barrier text,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.accounts enable row level security;
alter table public.profiles enable row level security;
alter table public.exclusions enable row level security;
alter table public.daily_entries enable row level security;
alter table public.daily_plans enable row level security;
alter table public.action_feedback enable row level security;

-- Create policies so users can only access their own data
create policy "Users can view own account" on public.accounts for select using (auth.uid() = id);
create policy "Users can update own account" on public.accounts for update using (auth.uid() = id);
create policy "Users can insert own account" on public.accounts for insert with check (auth.uid() = id);

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = account_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = account_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = account_id);

create policy "Users can view own exclusions" on public.exclusions for select using (auth.uid() = account_id);
create policy "Users can insert own exclusions" on public.exclusions for insert with check (auth.uid() = account_id);

create policy "Users can view own daily_entries" on public.daily_entries for select using (auth.uid() = account_id);
create policy "Users can insert own daily_entries" on public.daily_entries for insert with check (auth.uid() = account_id);
create policy "Users can update own daily_entries" on public.daily_entries for update using (auth.uid() = account_id);

create policy "Users can view own daily_plans" on public.daily_plans for select using (auth.uid() = account_id);
create policy "Users can insert own daily_plans" on public.daily_plans for insert with check (auth.uid() = account_id);
create policy "Users can update own daily_plans" on public.daily_plans for update using (auth.uid() = account_id);

create policy "Users can view own action_feedback" on public.action_feedback for select using (auth.uid() = account_id);
create policy "Users can insert own action_feedback" on public.action_feedback for insert with check (auth.uid() = account_id);

-- Create auth trigger to automatically create account and profile on signup
create or replace function public.handle_new_user()
returns trigger as \$\$
begin
  insert into public.accounts (id)
  values (new.id);
  
  insert into public.profiles (account_id)
  values (new.id);
  
  return new;
end;
\$\$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
