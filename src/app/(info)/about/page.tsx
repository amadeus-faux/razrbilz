import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/about",
  title: "About the Brand",
  description:
    "RAZRBILZ is a streetwear brand from Bandung, Indonesia. Made to order, in small runs.",
});

export default function AboutPage() {
  return (
    <div className="space-y-10">
      {/* Hero heading */}
      <div className="space-y-2 pb-8 border-b border-border">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
          RAZRBILZ ID, Bandung, Indonesia
        </p>
        <h1 className="text-xl font-light tracking-tight text-foreground leading-snug">
          About the Brand
        </h1>
      </div>

      {/* Body copy */}
      <div className="space-y-5 text-[13px] text-muted leading-[1.85] tracking-wide">
        <p>
          <strong className="text-foreground">RAZRBILZ</strong> started with a small frustration. <strong>Amadeus</strong> and <strong>Yvain</strong> kept looking at racks full of plain tees with a graphic on the front, and kept wondering where the design had gone. A good print in the right hands can be great. But a print alone can't replace a garment that was actually thought through.
        </p>

        <p>
          So in 2025 we started making our own. Since then it has mostly been trial and error: cutting, sewing, unpicking, trying again. We're not chasing clothes that are merely nice to wear. We want every piece to have something worth looking at in the cut itself, in how it hangs and moves.
        </p>

        <p>
          We chose to go our own way instead of following the current. That isn't a judgment on anyone else's taste. It's simply the only way we know how to make things we're proud of.
        </p>

        <p>
          RAZRBILZ is for people who would rather stand out than blend in, and who want their clothes to say something without a slogan.
        </p>

        <p>
          <strong>FIND YOUR NORTH.</strong>
        </p>
      </div>
    </div>
  );
}
