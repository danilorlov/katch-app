// Katch API — одна Supabase Edge Function на все.
// Секрети (Edge Functions → Secrets): BOT_TOKEN (обовʼязково), MIN_PAYOUT (необовʼязково, за замовчуванням 10).
// SUPABASE_URL і SUPABASE_SERVICE_ROLE_KEY Supabase підставляє сам.
// ВАЖЛИВО: при деплої вимкни "Verify JWT" (Enforce JWT verification) — вхід перевіряємо через Telegram.

import { createClient } from "npm:@supabase/supabase-js@2";

// Токен бота: секрет BOT_TOKEN, а если его назвали иначе — любой секрет, похожий на токен Telegram-бота.
function findBotToken(): string {
  const direct = Deno.env.get("BOT_TOKEN");
  if (direct) return direct.trim();
  for (const [, v] of Object.entries(Deno.env.toObject())) {
    if (/^\d{6,}:[A-Za-z0-9_-]{30,}$/.test((v ?? "").trim())) return v.trim();
  }
  console.error("Bot token not found in secrets");
  return "";
}
const BOT_TOKEN = findBotToken();
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const MIN_PAYOUT = Number(Deno.env.get("MIN_PAYOUT") ?? "10");
const MAX_AUTH_AGE = 60 * 60 * 24; // дані входу Telegram дійсні 24 години

// Серверний ключ: у старих проєктах SUPABASE_SERVICE_ROLE_KEY, у нових — секретний ключ із SUPABASE_SECRET_KEYS.
function serverKey(): string {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  const single = Deno.env.get("SUPABASE_SECRET_KEY");
  if (single) return single;
  try {
    const all = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    const first = Object.values(all)[0];
    if (typeof first === "string") return first;
  } catch { /* ignore */ }
  console.error("No server key found in env");
  return "";
}

const db = createClient(SUPABASE_URL, serverKey(), {
  auth: { persistSession: false },
});

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-telegram-init-data",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const fail = (error: string, status = 400) => json({ error }, status);

// ---------- Перевірка входу через Telegram ----------
const enc = new TextEncoder();
async function hmac(key: Uint8Array, msg: string): Promise<Uint8Array> {
  const k = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
}
const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

type TgUser = { id: number; username?: string; first_name?: string; language_code?: string };

export async function verifyInitData(initData: string, botToken: string): Promise<TgUser | null> {
  if (!initData || !botToken) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const secret = await hmac(enc.encode("WebAppData"), botToken);
  const calc = toHex(await hmac(secret, dataCheckString));
  if (!safeEqual(calc, hash)) return null;
  const authDate = Number(params.get("auth_date") ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > MAX_AUTH_AGE) return null;
  try {
    const user = JSON.parse(params.get("user") ?? "null");
    return user && typeof user.id === "number" ? user : null;
  } catch {
    return null;
  }
}

// ---------- Допоміжне ----------
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"; // без 0/o, 1/l/i
function randomCode(prefix: string, len: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return prefix + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

function parseClipUrl(raw: string): { url: string; platform: string } | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let platform = "";
  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) platform = "tiktok";
  else if (host === "instagram.com") platform = "instagram";
  else if (host === "youtube.com" || host === "youtu.be") platform = "youtube";
  else return null;
  const v = u.searchParams.get("v"); // youtube.com/watch?v=... — параметр v потрібен, решту відкидаємо
  const clean = `https://${host}${u.pathname.replace(/\/$/, "")}${v ? `?v=${v}` : ""}`;
  return { url: clean, platform };
}

const sum = (rows: { payout?: number | null; amount?: number | null }[], k: "payout" | "amount") =>
  Math.round(rows.reduce((s, r) => s + Number(r[k] ?? 0), 0) * 100) / 100;

// ---------- Обробник ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const path = new URL(req.url).pathname.replace(/^.*?\/api(?=\/|$)/, "") || "/";

  try {
    // Усе — лише для тих, хто зайшов через Telegram. Реєстрація = перший вхід.
    const tg = await verifyInitData(req.headers.get("x-telegram-init-data") ?? "", BOT_TOKEN);
    if (!tg) return fail("unauthorized", 401);
    const uid = tg.id;
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};

    // Профіль (і реєстрація при першому вході)
    if (path === "/me") {
      const { data: existing } = await db.from("users").select("*").eq("id", uid).maybeSingle();
      let user = existing;
      if (!existing) {
        const lang = tg.language_code === "en" ? "en" : "uk";
        const ins = await db.from("users")
          .insert({ id: uid, username: tg.username ?? null, first_name: tg.first_name ?? null, lang })
          .select().single();
        if (ins.error) throw ins.error;
        user = ins.data;
      } else if (existing.username !== (tg.username ?? null) || existing.first_name !== (tg.first_name ?? null)) {
        await db.from("users").update({ username: tg.username ?? null, first_name: tg.first_name ?? null }).eq("id", uid);
      }
      return json({ user, is_new: !existing });
    }

    if (path === "/settings" && req.method === "POST") {
      const patch: Record<string, string> = {};
      if (body.lang === "uk" || body.lang === "en") patch.lang = body.lang;
      if (body.payout_method === "usdt_ton" || body.payout_method === "card") patch.payout_method = body.payout_method;
      if (typeof body.payout_address === "string") patch.payout_address = body.payout_address.trim().slice(0, 120);
      const { data, error } = await db.from("users").update(patch).eq("id", uid).select().single();
      if (error) throw error;
      return json({ user: data });
    }

    // Активні оффери з залишком бюджету і відміткою, чи взяв їх кліпер
    if (path === "/offers") {
      const { data: offers, error } = await db.from("offers").select("*").eq("status", "live").order("rate_per_1k", { ascending: false });
      if (error) throw error;
      const ids = (offers ?? []).map((o) => o.id);
      const { data: spentRows } = ids.length
        ? await db.from("clips").select("offer_id, payout").eq("status", "approved").in("offer_id", ids)
        : { data: [] };
      const { data: mine } = await db.from("takes").select("id, offer_id, code").eq("user_id", uid).eq("status", "active");
      const mineBy: Record<number, { id: string; code: string }> = {};
      for (const t of mine ?? []) mineBy[t.offer_id] = { id: t.id, code: t.code };
      const spent: Record<number, number> = {};
      for (const r of spentRows ?? []) spent[r.offer_id] = (spent[r.offer_id] ?? 0) + Number(r.payout ?? 0);
      return json({
        offers: (offers ?? []).map((o) => ({
          ...o,
          spent: Math.round((spent[o.id] ?? 0) * 100) / 100,
          budget_left: Math.max(0, Math.round((Number(o.budget) - (spent[o.id] ?? 0)) * 100) / 100),
          take: mineBy[o.id] ?? null,
        })),
      });
    }

    // Взяти оффер → унікальний код. Скасований раніше оффер можна взяти знову з новим кодом.
    if (path === "/take" && req.method === "POST") {
      const offerId = Number(body.offer_id);
      const { data: offer } = await db.from("offers").select("*").eq("id", offerId).maybeSingle();
      if (!offer || offer.status !== "live") return fail("offer_closed", 410);
      const { data: existing } = await db.from("takes").select("*").eq("user_id", uid).eq("offer_id", offerId).maybeSingle();
      if (existing?.status === "active") return json({ take: existing, offer });
      for (let i = 0; i < 5; i++) {
        const code = randomCode("k", 4);
        const res = existing
          ? await db.from("takes").update({ code, status: "active", cancelled_at: null, created_at: new Date().toISOString() }).eq("id", existing.id).select().single()
          : await db.from("takes").insert({ user_id: uid, offer_id: offerId, code }).select().single();
        if (!res.error) return json({ take: res.data, offer });
        if (res.error.code !== "23505") throw res.error; // 23505 — такий код уже є, пробуємо інший
      }
      throw new Error("could_not_create_code");
    }

    // Скасувати оффер: усе, що ще не пішло на виплату, згорає
    const cancelMatch = path.match(/^\/take\/([0-9a-f-]{36})\/cancel$/);
    if (cancelMatch && req.method === "POST") {
      const { data: take } = await db.from("takes").select("*").eq("id", cancelMatch[1]).eq("user_id", uid).eq("status", "active").maybeSingle();
      if (!take) return fail("not_found", 404);
      const burn = await db.from("clips")
        .update({ status: "rejected", reject_reason: "Оффер скасовано" })
        .eq("take_id", take.id).is("payout_id", null).in("status", ["review", "approved"]);
      if (burn.error) throw burn.error;
      const upd = await db.from("takes").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", take.id);
      if (upd.error) throw upd.error;
      return json({ ok: true });
    }

    // Надіслати посилання на опублікований кліп
    if (path === "/clip" && req.method === "POST") {
      const parsed = parseClipUrl(String(body.url ?? ""));
      if (!parsed) return fail("bad_url");
      const { data: take } = await db.from("takes").select("*, offers(status, platforms)").eq("id", String(body.take_id ?? "")).eq("user_id", uid).eq("status", "active").maybeSingle();
      if (!take) return fail("not_found", 404);
      // deno-lint-ignore no-explicit-any
      const offer = (take as any).offers;
      if (offer?.status !== "live") return fail("offer_closed", 410);
      if (Array.isArray(offer?.platforms) && !offer.platforms.includes(parsed.platform)) return fail("platform_not_allowed");
      const ins = await db.from("clips")
        .insert({ take_id: take.id, user_id: uid, offer_id: take.offer_id, url: parsed.url, platform: parsed.platform })
        .select().single();
      if (ins.error?.code === "23505") return fail("duplicate_clip", 409);
      if (ins.error) throw ins.error;
      return json({ clip: ins.data });
    }

    // Кабінет: взяті оффери + усі кліпи
    if (path === "/clips") {
      const { data: takes } = await db.from("takes").select("*, offers(*)").eq("user_id", uid).eq("status", "active").order("created_at", { ascending: false });
      const { data: clips } = await db.from("clips").select("*, offers(brand, title_uk, title_en)").eq("user_id", uid).order("created_at", { ascending: false });
      const { data: payouts } = await db.from("payouts").select("id, status").eq("user_id", uid);
      const paidIds = new Set((payouts ?? []).filter((p) => p.status === "sent").map((p) => p.id));
      return json({
        takes: takes ?? [],
        clips: (clips ?? []).map((c) => ({ ...c, paid: !!c.payout_id && paidIds.has(c.payout_id) })),
      });
    }

    // Гаманець
    if (path === "/wallet") {
      const now = new Date().toISOString();
      const { data: user } = await db.from("users").select("payout_method, payout_address").eq("id", uid).single();
      const { data: approved } = await db.from("clips").select("id, payout, hold_until, payout_id, counted_at, offers(brand, title_uk, title_en)").eq("user_id", uid).eq("status", "approved");
      const { data: payouts } = await db.from("payouts").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      const rows = approved ?? [];
      const free = rows.filter((c) => !c.payout_id && c.hold_until && c.hold_until <= now);
      const held = rows.filter((c) => !c.payout_id && c.hold_until && c.hold_until > now);
      const ps = payouts ?? [];
      return json({
        available: sum(free, "payout"),
        hold: sum(held, "payout"),
        requested: sum(ps.filter((p) => p.status === "requested"), "amount"),
        paid: sum(ps.filter((p) => p.status === "sent"), "amount"),
        min_payout: MIN_PAYOUT,
        payout_method: user?.payout_method ?? null,
        payout_address: user?.payout_address ?? "",
        held: held.map((c) => ({ id: c.id, payout: c.payout, hold_until: c.hold_until, offer: c.offers })),
        payouts: ps,
      });
    }

    // Запит на виплату: забирає весь доступний баланс
    if (path === "/payout" && req.method === "POST") {
      const method = body.method === "card" ? "card" : body.method === "usdt_ton" ? "usdt_ton" : null;
      const address = String(body.address ?? "").trim().slice(0, 120);
      if (!method || address.length < 6) return fail("bad_payout_details");
      const now = new Date().toISOString();
      const { data: free } = await db.from("clips").select("id, payout").eq("user_id", uid).eq("status", "approved").is("payout_id", null).lte("hold_until", now);
      const amount = sum(free ?? [], "payout");
      if (amount < MIN_PAYOUT) return fail("below_min");
      const ins = await db.from("payouts").insert({ user_id: uid, amount, method, address }).select().single();
      if (ins.error) throw ins.error;
      await db.from("clips").update({ payout_id: ins.data.id }).in("id", (free ?? []).map((c) => c.id)).is("payout_id", null);
      await db.from("users").update({ payout_method: method, payout_address: address }).eq("id", uid);
      return json({ payout: ins.data });
    }

    return fail("not_found", 404);
  } catch (e) {
    console.error(e);
    return fail("server_error", 500);
  }
});
