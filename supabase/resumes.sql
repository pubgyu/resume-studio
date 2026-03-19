create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_name text not null,
  resume_json text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.resumes enable row level security;

create policy "Users can view their own resumes"
on public.resumes
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
on public.resumes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
on public.resumes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own resumes"
on public.resumes
for delete
to authenticated
using (auth.uid() = user_id);
