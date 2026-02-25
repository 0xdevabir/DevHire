"use client";

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Props = {
  searched: number;
  shortlisted: number;
  repos: number;
};

export default function StatsChart({ searched, shortlisted, repos }: Props) {
  const data = [
    {
      name: "Activity Overview",
      "Developers Searched": searched,
      "Candidates Shortlisted": shortlisted,
      "Total Repositories": repos,
    },
  ];

  return (
    <section className="p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Activity Snapshot</h3>
        <p className="mt-1 text-sm text-gray-500">Your recruitment activity at a glance</p>
      </div>
      <div className="rounded-lg">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="Developers Searched" 
              fill="var(--brand-teal)" 
              radius={[4, 4, 0, 0]}
              name="Developers Searched"
            />
            <Bar 
              dataKey="Candidates Shortlisted" 
              fill="var(--lighter-teal)" 
              radius={[4, 4, 0, 0]}
              name="Candidates Shortlisted"
            />
            <Bar 
              dataKey="Total Repositories" 
              fill="var(--brand-navy)" 
              radius={[4, 4, 0, 0]}
              name="Total Repositories"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
