-- ============================================================
-- DROP TABLES (clean reset)
-- ============================================================

drop table if exists public.translations cascade;
drop table if exists public.app_tags cascade;
drop table if exists public.tags cascade;
drop table if exists public.app_languages cascade;
drop table if exists public.languages cascade;
drop table if exists public.apps cascade;


-- ============================================================
-- LANGUAGES (UI / app-supported / translation languages)
-- ============================================================

create table public.languages (
  code text primary key,      -- 'en', 'es', 'fr', ...
  name text not null
);


-- ============================================================
-- APPS (canonical EN content)
-- ============================================================

create table public.apps (
  id bigserial primary key,

  -- Basic info
  name text not null,
  short_description text,
  long_description text,
  website text,

  -- Store links
  play_store_link text,
  app_store_link text,

  -- Price fields
  price_type text not null check (price_type in ('free','freemium','paid','subscription')),
  price_amount numeric(10,2),
  currency text,

  -- Platforms
  platforms text[] default '{}',

  -- Accessibility ratings
  ease_of_use smallint check (ease_of_use between 1 and 5),
  cognitive_load smallint check (cognitive_load between 1 and 5),
  sensory_load smallint check (sensory_load between 1 and 5),

  -- Additional features
  accessibility_features text[] default '{}',

  -- Images
  image_urls text[] default '{}',

  -- NEW: Visibility Control (Default true means visible)
  is_active boolean default true,

  -- Timestamps
  created_at timestamp default now(),
  updated_at timestamp default now()
);


-- ============================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================

create or replace function public.update_timestamp()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_timestamp
before update on public.apps
for each row
execute procedure public.update_timestamp();


-- ============================================================
-- APP-SUPPORTED LANGUAGES (e.g., 'en', 'es')
-- ============================================================

create table public.app_languages (
  app_id bigint references public.apps(id) on delete cascade,
  lang_code text references public.languages(code),
  primary key (app_id, lang_code)
);


-- ============================================================
-- TAGS
-- ============================================================

create table public.tags (
  id bigserial primary key,
  name text unique not null   -- e.g. 'Social skills', 'AAC', 'Routines'
);


-- ============================================================
-- APP ↔ TAGS (many-to-many)
-- ============================================================

create table public.app_tags (
  app_id bigint references public.apps(id) on delete cascade,
  tag_id bigint references public.tags(id) on delete cascade,
  primary key (app_id, tag_id)
);


-- ============================================================
-- TRANSLATIONS (multilingual support)
-- ============================================================

create table public.translations (
  id bigserial primary key,

  table_name text not null,       -- 'apps', 'tags'
  column_name text not null,      -- 'name', 'short_description', ...
  row_id bigint not null,         -- ID in the source table
  lang_code text not null references public.languages(code),

  translated_text text not null,

  unique(table_name, column_name, row_id, lang_code)
);
-- ============================================================
-- 1. CLEANUP (Solo si quieres reiniciar de cero)
-- ============================================================

drop table if exists public.translations cascade;
drop table if exists public.app_tags cascade;
drop table if exists public.tags cascade;
drop table if exists public.app_languages cascade;
drop table if exists public.languages cascade;
drop table if exists public.apps cascade;

-- ============================================================
-- 2. TABLES DEFINITION
-- ============================================================

-- A. LANGUAGES
create table public.languages (
  code text primary key,      -- 'en', 'es'
  name text not null
);

-- B. APPS 
create table public.apps (
  id bigserial primary key,

  -- Basic info
  name text not null,
  short_description text,
  long_description text,
  website text,

  -- Store links
  play_store_link text,
  app_store_link text,

  -- Prices
  price_type text not null check (price_type in ('free','freemium','paid','subscription')),
  price_amount numeric(10,2),
  currency text,

  -- Platforms
  platforms text[] default '{}',

  -- Ratings
  ease_of_use smallint check (ease_of_use between 1 and 5),
  cognitive_load smallint check (cognitive_load between 1 and 5),
  sensory_load smallint check (sensory_load between 1 and 5),

  -- Features
  accessibility_features text[] default '{}',

  -- Images
  image_urls text[] default '{}',

  -- Control
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Trigger for updated_at
create or replace function public.update_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_timestamp
before update on public.apps
for each row execute procedure public.update_timestamp();

-- C. LANGUAGES IN THE APP
create table public.app_languages (
  app_id bigint references public.apps(id) on delete cascade,
  lang_code text references public.languages(code),
  primary key (app_id, lang_code)
);

-- D. TAGS
create table public.tags (
  id bigserial primary key,
  name text unique not null   -- ej: 'Social skills', 'Pictogram'
);

-- E. APP <-> TAGS
create table public.app_tags (
  app_id bigint references public.apps(id) on delete cascade,
  tag_id bigint references public.tags(id) on delete cascade,
  primary key (app_id, tag_id)
);

-- F. TRANSLATIONS (Apps and Tags)
create table public.translations (
  id bigserial primary key,
  table_name text not null,       -- 'apps', 'tags'
  column_name text not null,      -- 'name', 'short_description'
  row_id bigint not null,         -- ID original
  lang_code text not null references public.languages(code),
  translated_text text not null,
  unique(table_name, column_name, row_id, lang_code)
);

-- ============================================================
-- 3. SECURITY (Row Level Security)
-- ============================================================
-- Needed by the frontend

alter table public.apps enable row level security;
alter table public.tags enable row level security;
alter table public.app_tags enable row level security;
alter table public.languages enable row level security;
alter table public.app_languages enable row level security;
alter table public.translations enable row level security;

-- Read Policies
create policy "Public read apps" on public.apps for select using (true);
create policy "Public read tags" on public.tags for select using (true);
create policy "Public read app_tags" on public.app_tags for select using (true);
create policy "Public read languages" on public.languages for select using (true);
create policy "Public read app_languages" on public.app_languages for select using (true);
create policy "Public read translations" on public.translations for select using (true);

-- Write Policies
create policy "Service role writes apps" on public.apps for all to service_role using (true) with check (true);
create policy "Service role writes tags" on public.tags for all to service_role using (true) with check (true);
create policy "Service role writes app_tags" on public.app_tags for all to service_role using (true) with check (true);
create policy "Service role writes languages" on public.languages for all to service_role using (true) with check (true);
create policy "Service role writes app_languages" on public.app_languages for all to service_role using (true) with check (true);
create policy "Service role writes translations" on public.translations for all to service_role using (true) with check (true);

-- ============================================================
-- 4. INITIAL DATA (Seed)
-- ============================================================

-- A. LANG
insert into public.languages (code, name) values
('en', 'English'),
('es', 'Spanish')
on conflict (code) do nothing;

-- B. TAGS
insert into public.tags (name) values
('AAC'),
('Communication'),
('Language'),
('Social skills'),
('Social stories'),
('Routines'),
('Visual schedules'),
('Speech therapy'),
('Emotional regulation'),
('Sensory support'),
('Games'),
('Timers'),
('Behavior tracking'),
('Reading'),
('Math'),
('Pictogram') -- Etiqueta nueva
on conflict (name) do nothing;

-- C. TRANSLATED TAGS (EN -> ES)
with tag_map (en_name, es_translation) as (
  values
    ('AAC',                  'CAA'),
    ('Communication',        'Comunicación'),
    ('Language',             'Lenguaje'),
    ('Social skills',        'Habilidades sociales'),
    ('Social stories',       'Historias sociales'),
    ('Routines',             'Rutinas'),
    ('Visual schedules',     'Horarios visuales'),
    ('Speech therapy',       'Terapia del habla'),
    ('Emotional regulation', 'Regulación emocional'),
    ('Sensory support',      'Apoyo sensorial'),
    ('Games',                'Juegos'),
    ('Timers',               'Temporizadores'),
    ('Behavior tracking',    'Registro de conducta'),
    ('Reading',              'Lectura'),
    ('Math',                 'Matemáticas'),
    ('Pictogram',            'Pictograma')
)
insert into public.translations (table_name, column_name, row_id, lang_code, translated_text)
select 
    'tags', 
    'name', 
    t.id, 
    'es', 
    tm.es_translation
from public.tags t
join tag_map tm on t.name = tm.en_name
on conflict (table_name, column_name, row_id, lang_code) 
do update set translated_text = excluded.translated_text;