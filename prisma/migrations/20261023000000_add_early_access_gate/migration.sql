-- Early Access Gate: newsletter signup + slot 100 pertama + token akses per periode.
-- DDL murni aditif: tidak mengubah tabel yang sudah ada.
-- Angka 100 muncul di tiga tempat (CHECK slot_number, fungsi confirm, konstanta
-- EARLY_ACCESS_CAP di src/lib/early-access/constants.ts). Mengubah cap = migration baru.

CREATE TABLE IF NOT EXISTS "subscribers" (
  "id"                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email"                 text NOT NULL CHECK ("email" = lower("email")),
  "locale"                text NOT NULL DEFAULT 'id' CHECK ("locale" IN ('id', 'en')),
  "status"                text NOT NULL DEFAULT 'pending'
                            CHECK ("status" IN ('pending', 'confirmed', 'unsubscribed')),
  "confirmation_token_hash" text UNIQUE,
  "confirmed_at"          timestamptz,
  "slot_number"           int UNIQUE CHECK ("slot_number" BETWEEN 1 AND 100),
  "unsubscribed_at"       timestamptz,
  "created_at"            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "early_access_periods" (
  "id"         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "started_at" timestamptz NOT NULL DEFAULT now(),
  "ended_at"   timestamptz,
  "started_by" text
);

CREATE TABLE IF NOT EXISTS "access_tokens" (
  "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "subscriber_id" uuid NOT NULL REFERENCES "subscribers"("id") ON DELETE CASCADE,
  "period_id"     uuid NOT NULL REFERENCES "early_access_periods"("id") ON DELETE CASCADE,
  "token_hash"    text NOT NULL UNIQUE,
  "expires_at"    timestamptz NOT NULL,
  "use_count"     int NOT NULL DEFAULT 0,
  "max_uses"      int NOT NULL DEFAULT 5,
  "created_at"    timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("subscriber_id", "period_id")
);

CREATE INDEX IF NOT EXISTS "access_tokens_period_idx" ON "access_tokens"("period_id");

CREATE TABLE IF NOT EXISTS "email_sends" (
  "id"                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "subscriber_id"       uuid NOT NULL REFERENCES "subscribers"("id") ON DELETE CASCADE,
  "period_id"           uuid REFERENCES "early_access_periods"("id") ON DELETE CASCADE,
  "kind"                text NOT NULL CHECK ("kind" IN ('confirmation', 'early_access', 'resend_link')),
  "status"              text NOT NULL DEFAULT 'pending'
                          CHECK ("status" IN ('pending', 'sent', 'failed')),
  "provider_message_id" text,
  "error"               text,
  "sent_at"             timestamptz,
  "created_at"          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "email_sends_status_idx" ON "email_sends"("status", "kind");

-- Jaminan tak pernah dobel: satu email early_access per subscriber per periode,
-- walau tombol admin ditekan dua kali atau proses pengiriman terputus di tengah.
CREATE UNIQUE INDEX IF NOT EXISTS "email_sends_early_access_once"
  ON "email_sends"("subscriber_id", "period_id")
  WHERE "kind" = 'early_access';

CREATE TABLE IF NOT EXISTS "gate_settings" (
  "id"                int PRIMARY KEY DEFAULT 1 CHECK ("id" = 1),
  "status"            text NOT NULL DEFAULT 'closed'
                        CHECK ("status" IN ('closed', 'early_access', 'public')),
  "current_period_id" uuid REFERENCES "early_access_periods"("id"),
  "updated_by"        text,
  "updated_at"        timestamptz NOT NULL DEFAULT now()
);

INSERT INTO "gate_settings" ("id") VALUES (1) ON CONFLICT ("id") DO NOTHING;

CREATE TABLE IF NOT EXISTS "gate_status_log" (
  "id"         int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "status"     text NOT NULL,
  "period_id"  uuid,
  "changed_by" text,
  "changed_at" timestamptz NOT NULL DEFAULT now()
);

-- Konfirmasi email + pembagian slot dalam satu transaksi. pg_advisory_xact_lock
-- mencegah dua konfirmasi serentak menghitung slot bebas yang sama; lock lepas
-- otomatis saat transaksi selesai.
CREATE OR REPLACE FUNCTION confirm_and_assign_slot(p_token_hash text)
RETURNS TABLE("subscriber_id" uuid, "slot_number" int, "already_confirmed" boolean)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_sub    uuid;
  v_status text;
  v_slot   int;
BEGIN
  SELECT s."id", s."status" INTO v_sub, v_status
  FROM "subscribers" s
  WHERE s."confirmation_token_hash" = p_token_hash
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'token_not_found';
  END IF;

  IF v_status = 'confirmed' THEN
    RETURN QUERY
    SELECT v_sub, s."slot_number", true FROM "subscribers" s WHERE s."id" = v_sub;
    RETURN;
  END IF;

  IF v_status <> 'pending' THEN
    RAISE EXCEPTION 'not_pending';
  END IF;

  PERFORM pg_advisory_xact_lock(90210001);

  SELECT count(*) + 1 INTO v_slot FROM "subscribers" WHERE "slot_number" IS NOT NULL;
  IF v_slot > 100 THEN
    v_slot := NULL;
  END IF;

  UPDATE "subscribers"
  SET "status" = 'confirmed', "confirmed_at" = now(), "slot_number" = v_slot
  WHERE "id" = v_sub;

  RETURN QUERY SELECT v_sub, v_slot, false;
END;
$$;

-- RLS aktif di semua tabel baru. Tanpa policy = anon/authenticated tidak melihat
-- baris apa pun; hanya role server Prisma (usebypassrls = true) yang bisa baca/tulis.
ALTER TABLE "subscribers"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "early_access_periods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "access_tokens"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "email_sends"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gate_settings"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gate_status_log"      ENABLE ROW LEVEL SECURITY;

-- Satu-satunya pengecualian: proxy.ts (Edge, tidak bisa Prisma) membaca status
-- gate lewat REST Supabase. Isinya hanya status + uuid periode, tanpa data pribadi.
CREATE POLICY "gate_settings_anon_read" ON "gate_settings"
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON "gate_settings" TO anon, authenticated;
