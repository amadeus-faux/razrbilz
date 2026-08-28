import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const maxDuration = 30;

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const ext = file.name.split(".").pop() || "jpg";
            const fileName = `${randomUUID()}.${ext}`;

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