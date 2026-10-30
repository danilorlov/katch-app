-- Katch — аналітика для дашборду.
-- Запусти один раз у Supabase: SQL Editor → New query → встав цей файл → Run.
-- Можна запускати повторно — нічого не зламає.

-- Події: хто запустив бота, хто відкрив апку, яку сторону обрав, хто натиснув «Написати бриф».
-- user_id = Telegram id. Без зовнішнього ключа: /start у боті буває раніше, ніж людина відкриє апку.
create table if not exists events (
  id         bigserial primary key,
  user_id    bigint,
  name       text not null check (name in ('bot_start','app_open','role_clipper','role_brand','brief_click')),
  meta       jsonb,
  created_at timestamptz not null default now()
);
create index if not exists events_name_time_idx on events(name, created_at);
create index if not exists events_user_idx      on events(user_id);

-- Коли людина востаннє заходила в апку
alter table users add column if not exists last_seen_at timestamptz;
update users set last_seen_at = created_at where last_seen_at is null;

alter table events enable row level security;
grant all on events to service_role;
grant all on sequence events_id_seq to service_role;
