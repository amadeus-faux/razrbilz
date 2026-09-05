import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RAZRBILZ",
  description: "Find Your North.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      {/* Hero heading */}
      <div className="space-y-2 pb-8 border-b border-border">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
          RAZRBILZ Studio — Bandung, Indonesia
        </p>
        <h1 className="text-xl font-light tracking-tight text-foreground leading-snug">
          About the Brand
        </h1>
      </div>

      {/* Body copy */}
      <div className="space-y-5 text-[13px] text-muted leading-[1.85] tracking-wide">
        <p>
          <strong className="text-foreground">RAZRBILZ</strong> adalah brand
          pakaian unisex independen yang lahir dari perpaduan estetika utilitarian,
          arsitektur brutalist, dan siluet streetwear kontemporer.
        </p>

        <p>
          Kami berfokus pada bentuk, proporsi, dan kenyamanan material tanpa batasan gender.
          Setiap garmen dirancang dengan siluet boxy, relaxed, dan material katun premium
          berbobot tinggi (heavyweight) yang tahan lama.
        </p>

        <p>
          Diproduksi secara etis di Indonesia dengan kontrol kualitas yang ketat pada setiap
          jahitan dan detail finishing.
        </p>
      </div>

      {/* Values grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {[
          { label: "Material", value: "Heavyweight cotton, 240–320 gsm" },
          { label: "Production", value: "Ethically made in Bandung" },
          { label: "Design", value: "Gender-free, oversized silhouettes" },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 bg-surface rounded-xl border border-border">
            <p className="text-[9px] tracking-[0.18em] uppercase text-muted mb-1">
              {label}
            </p>
            <p className="text-xs text-foreground leading-snug">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
