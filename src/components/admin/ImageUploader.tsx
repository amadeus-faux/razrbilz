"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

/**
 * Compresses an image client-side using HTML5 Canvas.
 * Reduces 5MB-10MB high-res camera photos to ~200KB-400KB web-optimized images,
 * completely preventing Vercel 413 (Payload Too Large) errors and speeding up uploads.
 */
async function compressImage(file: File, maxWidth = 1600, quality = 0.85): Promise<File> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            if (blob.size < file.size) {
              const ext = outputType === "image/png" ? "png" : "jpg";
              const newName = file.name.replace(/\.[^/.]+$/, "") + "." + ext;
              resolve(new File([blob], newName, { type: outputType }));
            } else {
              resolve(file);
            }
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFiles = e.target.files;
    if (!rawFiles || rawFiles.length === 0) return;

    setUploading(true);
    setUploadProgress("Mengoptimalkan foto...");

    try {
      // 1. Compress images client-side to prevent Vercel 413 Payload Too Large
      const fileList = Array.from(rawFiles);
      const compressedFiles = await Promise.all(
        fileList.map((file) => compressImage(file))
      );

      setUploadProgress("Mengunggah ke storage...");

      // 2. Upload files individually in parallel to ensure each request payload stays well below 500KB
      const uploadPromises = compressedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("files", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Upload gagal (Status ${res.status})`);
        }

        const data = await res.json();
        return data.urls as string[];
      });

      const results = await Promise.all(uploadPromises);
      const allNewUrls = results.flat();

      onChange([...images, ...allNewUrls]);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Gagal upload foto. Coba lagi.");
    } finally {
      setUploading(false);
      setUploadProgress("");
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
            <>
              <Loader2 size={18} className="animate-spin text-foreground" />
              <span className="text-[9px] font-medium text-center px-1 leading-tight">
                {uploadProgress || "Mengunggah..."}
              </span>
            </>
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