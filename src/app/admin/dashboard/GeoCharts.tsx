"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MapPin, Globe } from "lucide-react";

interface GeoDataPoint {
  name: string;
  count: number;
  percent: number;
}

interface GeoChartsProps {
  cityData: GeoDataPoint[];
  countryData: GeoDataPoint[];
  isLoading?: boolean;
}

// Muted, premium dark-theme palette
const COLORS = [
  "#e2e8f0", "#94a3b8", "#64748b", "#a78bfa", "#7dd3fc",
  "#6ee7b7", "#fcd34d", "#f87171", "#fb923c",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: GeoDataPoint }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#1c1b18] border border-[#2e2c28] rounded-xl px-3.5 py-2.5 shadow-xl">
      <p className="text-[11px] font-semibold text-[#f4f2ee]">{d.name}</p>
      <p className="text-[11px] text-[#9c968f]">{d.count} pesanan · {d.percent}%</p>
    </div>
  );
}

function DonutChart({ data, isLoading, emptyText }: { data: GeoDataPoint[]; isLoading?: boolean; emptyText: string }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-36 h-36 rounded-full bg-[#1c1b18] animate-pulse" />
        <div className="space-y-2 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2e2c28] animate-pulse flex-shrink-0" />
              <div className="h-3 bg-[#1c1b18] rounded flex-1 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 text-center">
        <p className="text-xs text-[#736e67] uppercase tracking-widest">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="78%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-1.5">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-[11px] text-[#dedad3] truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] font-semibold text-[#f4f2ee]">{item.count}</span>
              <span className="text-[10px] text-[#736e67]">({item.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GeoCharts({ cityData, countryData, isLoading }: GeoChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* City Distribution (Indonesia) */}
      <div className="bg-[#141412] border border-[#242320] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={15} strokeWidth={1.75} className="text-[#9c968f]" />
          <div>
            <h2 className="text-sm font-semibold text-[#f4f2ee]">Kota Pembeli — Indonesia</h2>
            <p className="text-[11px] text-[#8c8680] mt-0.5">Dari pesanan berbayar di Indonesia</p>
          </div>
        </div>
        <DonutChart
          data={cityData}
          isLoading={isLoading}
          emptyText="Belum ada data kota"
        />
      </div>

      {/* Country Distribution (Non-Indonesia) */}
      <div className="bg-[#141412] border border-[#242320] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={15} strokeWidth={1.75} className="text-[#9c968f]" />
          <div>
            <h2 className="text-sm font-semibold text-[#f4f2ee]">Negara Pembeli — Internasional</h2>
            <p className="text-[11px] text-[#8c8680] mt-0.5">Pesanan luar Indonesia (Indonesia dikecualikan)</p>
          </div>
        </div>
        <DonutChart
          data={countryData}
          isLoading={isLoading}
          emptyText="Belum ada pesanan internasional"
        />
      </div>
    </div>
  );
}
