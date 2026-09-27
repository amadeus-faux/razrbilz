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
          RAZRBILZ ID — Bandung, Indonesia
        </p>
        <h1 className="text-xl font-light tracking-tight text-foreground leading-snug">
          About the Brand
        </h1>
      </div>

      {/* Body copy */}
      <div className="space-y-5 text-[13px] text-muted leading-[1.85] tracking-wide">
        <p>
          <strong className="text-foreground">RAZRBILZ</strong> is an apparel brand born from the collision of three seemingly opposite worlds: the honesty of utilitarian design, the raw strength of brutalist architecture, and the freedom of contemporary streetwear silhouettes. To us, clothing is never just something you wear, it's structure, space, and a statement carried through everyday life.
        </p>

        <p>
          It all began with a fascination for concrete buildings that stay true to their own form, no unnecessary ornamentation, no pretense, just function and strength speaking for themselves. That same philosophy runs through everything we design: sharp lines, deliberate proportions, and silhouettes that aren't afraid to feel large, weighted, and real.
        </p>

        <p>
          RAZRBILZ was founded in Bandung in 2025 by <strong>Amadeus</strong> and <strong>Yvain</strong>, two individuals from different backgrounds united by a shared obsession with form, texture, and material honesty. What started as a small studio and a curiosity about how clothing could become a medium of expression beyond gender has grown into a brand built on one belief: the best fashion is the kind anyone can wear, anytime, without needing to fit into definitions of masculine or feminine.
        </p>
        
        <p>
          We approach every piece the way an architect approaches a building, considering proportion, movement, and longevity. Each garment carries a boxy, relaxed silhouette, built from the belief that good clothing should be made to last, not just to trend.
        </p>
        
        <p>
        RAZRBILZ isn't just an apparel brand. It's a space where concrete meets fabric, where structure meets comfort, and where identity isn't confined by labels.
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
