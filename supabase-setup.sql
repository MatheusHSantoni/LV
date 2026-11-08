-- Executar no SQL Editor do Supabase após criar o projeto.
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.site_content (
  id integer primary key check (id = 1),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;
alter table public.site_content enable row level security;

create policy "Admins can check their access" on public.site_admins
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Everyone can read published content" on public.site_content
  for select to anon, authenticated using (true);

create policy "Only admins can create content" on public.site_content
  for insert to authenticated
  with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));

create policy "Only admins can change content" on public.site_content
  for update to authenticated
  using (exists (select 1 from public.site_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Only admins can upload images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'site-images'
    and (storage.foldername(name))[1] = 'profile'
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

-- Após criar a conta de Lívia em Authentication > Users, execute
-- substituindo o UUID pelo ID REAL copiado do painel:
-- insert into public.site_admins (user_id)
-- values ('00000000-0000-0000-0000-000000000000');
