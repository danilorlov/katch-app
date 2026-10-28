-- Katch Telegram MVP — схема бази
-- Запусти цей файл цілком у Supabase: SQL Editor → New query → Run.

create extension if not exists pgcrypto;

-- Користувачі (id = Telegram user id)
create table if not exists users (
  id            bigint primary key,
  username      text,
  first_name    text,
  lang          text not null default 'uk' check (lang in ('uk','en')),
  payout_method text check (payout_method in ('usdt_ton','card')),
  payout_address text,
  created_at    timestamptz not null default now()
);

-- Оффери (створюєш сам у Table Editor після брифу з брендом)
create table if not exists offers (
  id             serial primary key,
  brand          text not null,
  title_uk       text not null,
  title_en       text,
  category       text not null default 'streams' check (category in ('streams','podcasts','music','gaming','other')),
  description_uk text,
  description_en text,
  brief_uk       text,          -- ТЗ: що саме нарізати і як (кілька рядків)
  brief_en       text,
  rules_uk       text,          -- кожне правило з нового рядка
  rules_en       text,
  source_url     text,          -- папка з вихідниками (Google Drive тощо)
  rate_per_1k    numeric(10,2) not null,  -- $ за 1000 переглядів (виплата кліперу)
  budget         numeric(12,2) not null,  -- бюджет на виплати кліперам
  max_per_clip   numeric(10,2),           -- стеля на один кліп, можна порожнім
  platforms      text[] not null default '{tiktok,instagram,youtube}',
  status         text not null default 'live' check (status in ('draft','live','paused','done')),
  created_at     timestamptz not null default now()
);

-- Взяті оффери: унікальний код на пару «кліпер + оффер». Скасований оффер можна взяти знову.
create table if not exists takes (
  id         uuid primary key default gen_random_uuid(),
  user_id    bigint not null references users(id) on delete cascade,
  offer_id   int not null references offers(id) on delete cascade,
  code       text not null unique,
  status     text not null default 'active' check (status in ('active','cancelled')),
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, offer_id)
);

-- Запити на виплату
create table if not exists payouts (
  id         uuid primary key default gen_random_uuid(),
  user_id    bigint not null references users(id) on delete cascade,
  amount     numeric(12,2) not null,
  method     text not null,
  address    text not null,
  status     text not null default 'requested' check (status in ('requested','sent','failed')),
  tx_ref     text,
  created_at timestamptz not null default now(),
  sent_at    timestamptz
);

-- Кліпи (посилання на опубліковані ролики)
create table if not exists clips (
  id            uuid primary key default gen_random_uuid(),
  take_id       uuid not null references takes(id) on delete cascade,
  user_id       bigint not null references users(id) on delete cascade,
  offer_id      int not null references offers(id) on delete cascade,
  url           text not null unique,
  platform      text,
  status        text not null default 'review' check (status in ('review','approved','rejected')),
  views         int,
  payout        numeric(12,2),
  reject_reason text,
  counted_at    timestamptz,
  hold_until    timestamptz,
  payout_id     uuid references payouts(id),
  created_at    timestamptz not null default now()
);

create index if not exists clips_user_idx   on clips(user_id);
create index if not exists clips_status_idx on clips(status);

-- Коли ти ставиш кліпу status = 'approved' і вписуєш views,
-- виплата рахується сама: views / 1000 × ставка, не більше max_per_clip,
-- і стартує холд на 7 днів.
create or replace function clip_compute() returns trigger
language plpgsql as $$
declare r numeric; m numeric;
begin
  if new.status = 'approved' then
    if new.views is null then
      raise exception 'Спочатку впиши views, потім став approved';
    end if;
    select rate_per_1k, max_per_clip into r, m from offers where id = new.offer_id;
    new.payout := round(new.views / 1000.0 * r, 2);
    if m is not null and new.payout > m then new.payout := m; end if;
    if old.status is distinct from 'approved' then
      new.counted_at := now();
      new.hold_until := now() + interval '7 days';
    end if;
  elsif new.status = 'rejected' then
    new.payout := 0;
  end if;
  return new;
end $$;

drop trigger if exists clips_compute on clips;
create trigger clips_compute before update on clips
for each row execute function clip_compute();

-- Безпека: усе закрито для публічного ключа. Доступ лише через серверну функцію.
alter table users    enable row level security;
alter table offers   enable row level security;
alter table takes    enable row level security;
alter table payouts  enable row level security;
alter table clips    enable row level security;

-- Зручні вигляди для тебе (Table Editor → Views)

-- Черга перевірки: найстаріші зверху; day >= 7 — пора рахувати перегляди
create or replace view review_queue with (security_invoker = true) as
select c.id, c.url, c.platform, u.username, t.code,
       o.id as offer_id, o.brand, o.title_uk,
       (now()::date - c.created_at::date) as day,
       c.views, c.status, c.created_at
from clips c
join takes t  on t.id = c.take_id
join users u  on u.id = c.user_id
join offers o on o.id = c.offer_id
where c.status = 'review'
order by c.created_at;

-- Звіт по кампанії для бренду
create or replace view campaign_report with (security_invoker = true) as
select o.id as offer_id, o.brand, o.title_uk, o.budget,
       count(c.id) filter (where c.status = 'approved') as clips_counted,
       coalesce(sum(c.views)  filter (where c.status = 'approved'), 0) as views,
       coalesce(sum(c.payout) filter (where c.status = 'approved'), 0) as spent
from offers o
left join clips c on c.offer_id = o.id
group by o.id;

-- Запити на виплату, які треба відправити
create or replace view payouts_todo with (security_invoker = true) as
select p.id, u.username, p.amount, p.method, p.address, p.created_at
from payouts p join users u on u.id = p.user_id
where p.status = 'requested'
order by p.created_at;

revoke all on review_queue, campaign_report, payouts_todo from anon, authenticated;

-- Права для серверної функції (service_role). Потрібні, якщо в проєкті вимкнено
-- «Automatically expose new tables». Публічний ключ (anon) доступу не має.
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
