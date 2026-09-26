-- Pengaturan situs disimpan key-value supaya menambah pengaturan baru tidak
-- butuh migrasi lagi (daftar kuncinya hidup di src/lib/site-settings.ts).
-- Tabel ini sengaja kosong di awal: pembacaan selalu punya fallback default,
-- jadi homepage tetap punya meta description sebelum ada yang mengisi.
CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);
