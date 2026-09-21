"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useState, useMemo } from "react";
import { formatRupiah } from "@/lib/utils";

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
  groupByWeek: boolean;
  newestProductDate: string | null;
  oldestDataDate: string | null;
  isLoading?: boolean;
}

function formatXLabel(dateStr: string, groupByWeek: boolean): string {
  if (groupByWeek) {
    // "2026-W38" → "W38"
    return dateStr.slice(5);
  }
  // "2026-09-21" → "21 Sep"
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

interface TooltipPayload {
  value: number;
  name: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  groupByWeek,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: TooltipPayload }>;
  label?: string;
  groupByWeek: boolean;
}) {
  if (!active || !payload?.length || !label) return null;
  const revenue = payload[0]?.value ?? payload[0]?.payload?.value ?? 0;

  return (
    <div className="bg-[#1c1b18] border border-[#2e2c28] rounded-xl px-3.5 py-2.5 shadow-xl">
      <p className="text-[10px] text-[#9c968f] uppercase tracking-wider mb-1">
        {groupByWeek ? label : formatXLabel(label, false)}
      </p>
      <p className="text-sm font-semibold text-[#f4f2ee]">{formatRupiah(revenue)}</p>
    </div>
  );
}

export default function RevenueChart({
  data,
  groupByWeek,
  newestProductDate,
  oldestDataDate,
  isLoading,
}: RevenueChartProps) {
  const [showAllTime, setShowAllTime] = useState(false);

  // Default view: data from newest product onwards
  const newestProductKey = useMemo(() => {
    if (!newestProductDate) return null;
    if (groupByWeek) {
      const d = new Date(newestProductDate);
      const day = d.getDay() || 7;
      d.setDate(d.getDate() + 4 - day);
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
      return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
    }
    return newestProductDate.slice(0, 10);
  }, [newestProductDate, groupByWeek]);

  const filteredData = useMemo(() => {
    if (showAllTime || !newestProductKey) return data;
    return data.filter((d) => d.date >= newestProductKey);
  }, [data, showAllTime, newestProductKey]);

  const hasData = data.length > 0;

  return (
    <div className="bg-[#141412] border border-[#242320] rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-semibold text-[#f4f2ee]">Pendapatan dari Waktu ke Waktu</h2>
          <p className="text-xs text-[#8c8680] mt-0.5">
            {groupByWeek ? "Dikelompokkan per minggu" : "Dikelompokkan per hari"}
            {!showAllTime && newestProductDate
              ? " · Mulai dari produk terbaru ditambahkan"
              : " · Semua data"}
          </p>
        </div>
        {(hasData || oldestDataDate) && (
          <button
            onClick={() => setShowAllTime(!showAllTime)}
            className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all font-medium cursor-pointer ${
              showAllTime
                ? "bg-white text-black border-white"
                : "bg-[#1c1b18] text-[#9c968f] border-[#2e2c28] hover:border-[#4a4845] hover:text-[#dedad3]"
            }`}
          >
            {showAllTime ? "Dari Produk Terbaru" : "Semua Data"}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="h-56 bg-[#1c1b18] rounded-xl animate-pulse" />
      ) : !hasData ? (
        <div className="h-56 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#282623] text-[#736e67]">
          <p className="text-xs uppercase tracking-widest">Belum ada data pendapatan</p>
          <p className="text-[11px] mt-1 text-[#5a5650]">Pendapatan akan muncul setelah ada order yang dibayar</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="h-56 flex items-center justify-center rounded-xl border border-dashed border-[#282623] text-[#736e67]">
          <p className="text-xs uppercase tracking-widest">Tidak ada data pada rentang ini</p>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242320" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatXLabel(v, groupByWeek)}
                tick={{ fontSize: 10, fill: "#736e67" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v) =>
                  v >= 1_000_000
                    ? `${(v / 1_000_000).toFixed(1)}jt`
                    : v >= 1_000
                      ? `${(v / 1_000).toFixed(0)}rb`
                      : String(v)
                }
                tick={{ fontSize: 10, fill: "#736e67" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                content={<CustomTooltip groupByWeek={groupByWeek} />}
                cursor={{ stroke: "#3e3c38", strokeWidth: 1 }}
              />
              {/* Marker: newest product added */}
              {newestProductKey && filteredData.some((d) => d.date === newestProductKey) && (
                <ReferenceLine
                  x={newestProductKey}
                  stroke="#a78bfa"
                  strokeDasharray="4 3"
                  label={{
                    value: "Produk baru",
                    position: "insideTopRight",
                    fill: "#a78bfa",
                    fontSize: 9,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ffffff"
                strokeWidth={1.5}
                dot={filteredData.length <= 14}
                activeDot={{ r: 4, fill: "#ffffff", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
