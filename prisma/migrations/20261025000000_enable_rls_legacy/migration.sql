-- RLS untuk tabel legacy yang dibuat Prisma.
--
-- Anon key Supabase ikut terkirim ke browser (satu JWT role `anon`), jadi
-- tanpa RLS setiap tabel di schema public bisa dibaca lewat Data API selama
-- role anon punya akses. Aplikasi tidak pernah memakai Data API untuk tabel
-- ini: semua akses lewat Prisma memakai role pemilik database, dan role
-- pemilik TIDAK terpengaruh RLS selama FORCE ROW LEVEL SECURITY tidak diaktifkan.
--
-- Sengaja tanpa policy: satu-satunya klien yang berhak adalah Prisma.
-- _prisma_migrations tidak disentuh karena tidak berisi data pengguna dan
-- dibutuhkan tooling migrasi.

ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExchangeRate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductSize" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ShippingLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SizeGuide" ENABLE ROW LEVEL SECURITY;
