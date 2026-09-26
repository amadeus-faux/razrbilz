"use client";

import { useRouter, usePathname } from "next/navigation";
import { CalendarDays } from "lucide-react";

const OPTIONS = [
  { value: "7", label: "7 Hari Terakhir" },
  { value: "30", label: "30 Hari Terakhir" },
  { value: "90", label: "90 Hari Terakhir" },
  { value: "year", label: "Tahun Ini" },
  { value: "all", label: "Semua" },
];

export default function OrdersDateFilter({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function setRange(range: string) {
    const params = new URLSearchParams();
    params.set("range", range);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#8c8680] font-medium mr-0.5">
        <CalendarDays size={13} />
        Rentang Waktu
      </span>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setRange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            value === opt.value
              ? "bg-white text-black font-semibold"
              : "text-[#8c8680] hover:text-[#f4f2ee] hover:bg-[#1f1e1c] border border-[#242320]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
