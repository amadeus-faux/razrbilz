import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/require-admin";
import { requireEnv } from "@/lib/env";

export const maxDuration = 30;

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

// Ekstensi ditentukan dari MIME yang diizinkan, bukan dari nama file kiriman.
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: Request) {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    try {
        const formData = await request.formData();
        const files = formData
            .getAll("files")
            .filter((entry): entry is File => entry instanceof File);

        if (files.length === 0) {
            return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
        }
        if (files.length > MAX_FILES) {
            return NextResponse.json(
                { error: `Maksimum ${MAX_FILES} foto per unggahan.` },
                { status: 400 }
            );
        }

        for (const file of files) {
            if (!ALLOWED_IMAGE_TYPES[file.type]) {
                return NextResponse.json(
                    { error: "Format foto harus JPG, PNG, WEBP, atau AVIF." },
                    { status: 400 }
                );
            }
            if (file.size === 0) {
                return NextResponse.json({ error: "Ada file kosong." }, { status: 400 });
            }
            if (file.size > MAX_FILE_BYTES) {
                return NextResponse.json(
                    { error: "Ukuran tiap foto maksimal 5 MB." },
                    { status: 400 }
                );
            }
        }

        const supabaseAdmin = createClient(
            requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
            requireEnv("SUPABASE_SERVICE_ROLE_KEY")
        );

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${randomUUID()}.${ALLOWED_IMAGE_TYPES[file.type]}`;

            const { error } = await supabaseAdmin.storage
                .from("product-images")
                .upload(fileName, buffer, {
                    contentType: file.type,
                    upsert: false,
                });

            if (error) throw error;

            const { data } = supabaseAdmin.storage
                .from("product-images")
                .getPublicUrl(fileName);

            uploadedUrls.push(data.publicUrl);
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Gagal upload foto" }, { status: 500 });
    }
}
