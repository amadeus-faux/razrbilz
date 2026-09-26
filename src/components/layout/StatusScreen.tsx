import type { ReactNode } from "react";

/**
 * Kerangka halaman status (404 / error). Dipakai oleh `app/not-found.tsx`,
 * `app/(shop)/not-found.tsx`, dan `app/error.tsx` supaya ketiga-tiganya punya
 * ritme tipografi yang sama dengan halaman info. `global-error.tsx` sengaja
 * TIDAK memakai komponen ini — lihat komentar di file tersebut.
 */
export default function StatusScreen({
  eyebrow,
  title,
  body,
  actions,
}: {
  eyebrow: string;
  title: string;
  body: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="container-shop flex flex-1 flex-col justify-center py-24">
      <div className="w-full max-w-xl space-y-5">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
          {eyebrow}
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground leading-snug">
          {title}
        </h1>
        <div className="text-[13px] text-muted leading-[1.85] tracking-wide">
          {body}
        </div>
        {actions && <div className="flex flex-wrap gap-3 pt-3">{actions}</div>}
      </div>
    </section>
  );
}
