"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => formData.append("files", file));

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload gagal");
            const data = await res.json();
            onChange([...images, ...data.urls]);
        } catch {
            alert("Gagal upload foto. Coba lagi.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    function handleRemove(url: string) {
        onChange(images.filter((img) => img !== url));
    }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3">
                {images.map((url) => (
                    <div key={url} className="relative aspect-square border border-border bg-surface">
                        <Image src={url} alt="Foto produk" fill className="object-contain p-2" />
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow hover:bg-red-50 hover:text-red-500 transition-colors"
                            aria-label="Hapus foto"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="aspect-square border border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                    {uploading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            <Upload size={18} strokeWidth={1.5} />
                            <span className="text-[10px] font-medium">Tambah Foto</span>
                        </>
                    )}
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                className="hidden"
            />
        </div>
    );
}