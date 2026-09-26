import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/about",
  title: "About the Brand",
  description:
    "RAZRBILZ is an independent unisex apparel brand from Bandung, Indonesia — boxy, relaxed silhouettes in heavyweight 240–320 gsm cotton, ethically made in small runs.",
});

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
          <strong className="text-foreground">RAZRBILZ</strong> is an independent unisex apparel
          brand born from the fusion of utilitarian aesthetics, brutalist architecture, and
          contemporary streetwear silhouettes.
        </p>

        <p>
          We focus on shape, proportion, and material comfort without gender boundaries.
          Each garment is designed with a boxy, relaxed silhouette in premium heavyweight
          cotton built to last.
        </p>

        <p>
          Ethically produced in Indonesia with strict quality control on every stitch and
          finishing detail.
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
