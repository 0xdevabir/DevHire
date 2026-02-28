"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Props = {
  searched: number;
  shortlisted: number;
  repos: number;
};

const COLORS = {
  searched: "#38988d",
  shortlisted: "#60b8b1",
  repos: "#1b364a",
  searchedLight: "#2d7d74",
};

/* ── custom tooltip ── */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-gray-700">{entry.name}:</span>
          <span className="text-sm font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatsChart({ searched, shortlisted, repos }: Props) {
  /* bar-chart data — break metrics into comparative groups for a richer chart */
  const barData = useMemo(() => {
    const total = searched + shortlisted + repos || 1;
    return [
      {
        name: "Searched",
        value: searched,
        pct: Math.round((searched / total) * 100),
      },
      {
        name: "Shortlisted",
        value: shortlisted,
        pct: Math.round((shortlisted / total) * 100),
      },
      {
        name: "Repositories",
        value: repos,
        pct: Math.round((repos / total) * 100),
      },
    ];
  }, [searched, shortlisted, repos]);

  /* pie-chart data */
  const pieData = useMemo(
    () => [
      { name: "Searched", value: searched || 0, color: COLORS.searched },
      { name: "Shortlisted", value: shortlisted || 0, color: COLORS.shortlisted },
      { name: "Repositories", value: repos || 0, color: COLORS.repos },
    ],
    [searched, shortlisted, repos],
  );

  const barColors = [COLORS.searched, COLORS.shortlisted, COLORS.repos];

  /* conversion rate */
  const conversionRate = searched > 0 ? ((shortlisted / searched) * 100).toFixed(1) : "0";

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {/* ── Bar Chart Card ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
            Activity Breakdown
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">Comparative view of all metrics</p>
        </div>

        <div className="px-2 pt-4 pb-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }} barCategoryGap="30%">
              <defs>
                <linearGradient id="barGrad0" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.searched} stopOpacity={1} />
                  <stop offset="100%" stopColor={COLORS.searched} stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.shortlisted} stopOpacity={1} />
                  <stop offset="100%" stopColor={COLORS.shortlisted} stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.repos} stopOpacity={1} />
                  <stop offset="100%" stopColor={COLORS.repos} stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(56,152,141,0.06)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={800} name="Count">
                {barData.map((_, idx) => (
                  <Cell key={idx} fill={`url(#barGrad${idx})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mini legend*/}
        <div className="flex items-center justify-center gap-5 border-t border-gray-100 px-6 py-3">
          {barData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: barColors[i] }} />
              <span className="text-xs text-gray-500">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pie Chart Card ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
            Distribution
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">Proportional share across categories</p>
        </div>

        <div className="flex items-center justify-center pt-2 pb-0">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
                stroke="none"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-px border-t border-gray-100 bg-gray-100">
          {pieData.map((d) => {
            const total = pieData.reduce((s, p) => s + p.value, 0) || 1;
            return (
              <div key={d.name} className="bg-white px-4 py-3 text-center">
                <p className="text-lg font-bold text-gray-900">{d.value}</p>
                <p className="text-[11px] text-gray-500">{d.name}</p>
                <div className="mx-auto mt-1.5 h-1 w-10 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(d.value / total) * 100}%`,
                      backgroundColor: d.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Conversion badge */}
        <div className="flex items-center justify-center border-t border-gray-100 px-6 py-3">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ backgroundColor: "#e6f7f5" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.searched }} />
            <span className="text-xs font-medium" style={{ color: COLORS.searchedLight }}>
              {conversionRate}% conversion rate
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
