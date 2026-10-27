-- Versi uji untuk Supabase SQL Editor. Isinya identik dengan migration.sql,
-- tetapi diakhiri ROLLBACK sehingga tidak ada perubahan yang tersimpan.
-- Jalankan seluruh file ini, periksa hasil SELECT di bagian bawah, lalu baru
-- jalankan migration.sql.
--
-- Catatan: DDL di PostgreSQL transaksional, jadi semua ALTER di bawah ikut
-- dibatalkan oleh ROLLBACK.

BEGIN;

ALTER TABLE "gate_settings"
  ADD COLUMN IF NOT EXISTS "early_access_cap" integer DEFAULT NULL;

ALTER TABLE "gate_settings"
  ALTER COLUMN "early_access_cap" DROP NOT NULL;

ALTER TABLE "gate_settings"
  ALTER COLUMN "early_access_cap" SET DEFAULT NULL;

UPDATE "gate_settings" SET "early_access_cap" = NULL;

DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'gate_settings'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%early_access_cap%'
  LOOP
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'gate_settings', c.conname);
  END LOOP;
END $$;

ALTER TABLE "gate_settings"
  ADD CONSTRAINT "gate_settings_early_access_cap_positive"
  CHECK ("early_access_cap" IS NULL OR "early_access_cap" > 0);

DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'subscribers'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%slot_number%'
  LOOP
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'subscribers', c.conname);
  END LOOP;
END $$;

ALTER TABLE "subscribers"
  ADD CONSTRAINT "subscribers_slot_number_positive"
  CHECK ("slot_number" IS NULL OR "slot_number" > 0);

CREATE OR REPLACE FUNCTION confirm_and_assign_slot(p_token_hash text)
RETURNS TABLE("subscriber_id" uuid, "slot_number" int, "already_confirmed" boolean)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_sub    uuid;
  v_status text;
  v_slot   int;
  v_cap    int;
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

  SELECT g."early_access_cap" INTO v_cap
  FROM "gate_settings" g
  WHERE g."id" = 1;

  IF v_cap IS NOT NULL THEN
    PERFORM pg_advisory_xact_lock(90210001);

    SELECT count(*) + 1 INTO v_slot
    FROM "subscribers"
    WHERE "slot_number" IS NOT NULL;

    IF v_slot > v_cap THEN
      v_slot := NULL;
    END IF;
  END IF;

  UPDATE "subscribers"
  SET "status" = 'confirmed', "confirmed_at" = now(), "slot_number" = v_slot
  WHERE "id" = v_sub;

  RETURN QUERY SELECT v_sub, v_slot, false;
END;
$$;

-- Verifikasi di dalam transaksi. Hasil yang diharapkan:
--   early_access_cap: is_nullable = YES, column_default = kosong/NULL
--   gate_settings.early_access_cap = NULL
--   CHECK slot_number hanya "IS NULL OR slot_number > 0"
--   fungsi memuat v_cap dan tidak lagi memuat angka 100

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'gate_settings'
  AND column_name = 'early_access_cap';

SELECT "id", "status", "early_access_cap" FROM "gate_settings";

SELECT conrelid::regclass::text AS tabel, conname, pg_get_constraintdef(oid) AS definisi
FROM pg_constraint
WHERE conrelid IN ('gate_settings'::regclass, 'subscribers'::regclass)
  AND contype = 'c'
ORDER BY 1, 2;

SELECT pg_get_functiondef('confirm_and_assign_slot(text)'::regprocedure);

ROLLBACK;
