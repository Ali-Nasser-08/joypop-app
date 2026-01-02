-- 1. Create the 'jars' table
create table jars (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add 'jar_id' column to the 'stars' table
-- This allows us to "move" stars into a jar by setting this ID
alter table stars add column jar_id uuid references jars(id);

-- 3. Enable Row Level Security (RLS)
alter table jars enable row level security;

-- 4. Create policies for 'jars' table
create policy "Users can view their own jars"
  on jars for select
  using (auth.uid() = user_id);

create policy "Users can create their own jars"
  on jars for insert
  with check (auth.uid() = user_id);
