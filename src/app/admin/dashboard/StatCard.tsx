"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  sub?: string;
  change?: number | null;
  changeSuffix?: string;
  isLoading?: boolean;
  variant?: "default" | "positive" | "negative" | "warning";
  detail?: React.ReactNode;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  change,
  changeSuffix = "%",
  isLoading,
  variant = "default",
  detail,
}: StatCardProps) {
  const iconBgMap = {
    default: "bg-[#1c1b18] text-[#dedad3]",
    positive: "bg-emerald-500/10 text-emerald-400",
    negative: "bg-rose-500/10 text-rose-400",
    warning: "bg-amber-500/10 text-amber-400",
  };

  const hasChange = change !== null && change !== undefined;
  const isPositive = hasChange && change! > 0;
  const isNegative = hasChange && change! < 0;

  return (
    <div className="bg-[#141412] border border-[#242320] rounded-2xl p-5 hover:border-[#383530] transition-colors space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#9c968f]">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border border-white/5 ${iconBgMap[variant]}`}>
          <Icon size={15} strokeWidth={1.75} />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2 pt-1">
          <div className="h-7 w-24 bg-[#1c1b18] rounded-lg animate-pulse" />
          <div className="h-3 w-32 bg-[#1c1b18] rounded animate-pulse" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-[#f4f2ee] tracking-tight mt-3 leading-none">
            {value}
          </p>

          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            {sub && (
              <p className="text-[11px] text-[#736e67]">{sub}</p>
            )}
            {hasChange && (
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
                  isPositive
                    ? "text-emerald-400"
                    : isNegative
                      ? "text-rose-400"
                      : "text-[#8c8680]"
                }`}
              >
                {isPositive ? (
                  <TrendingUp size={11} strokeWidth={2} />
                ) : isNegative ? (
                  <TrendingDown size={11} strokeWidth={2} />
                ) : (
                  <Minus size={11} strokeWidth={2} />
                )}
                {isPositive ? "+" : ""}{change!.toFixed(1)}{changeSuffix}
              </span>
            )}
          </div>

          {detail && (
            <div className="pt-1.5 border-t border-[#242320] mt-2">{detail}</div>
          )}
        </>
      )}
    </div>
  );
}
