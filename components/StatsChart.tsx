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
      name: "Activity",
      "Developers Searched": searched,
      "Candidates Shortlisted": shortlisted,
      "Total Repositories": repos,
    },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold">Activity Snapshot</h2>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Developers Searched" fill="#0f172a" />
            <Bar dataKey="Candidates Shortlisted" fill="#0e7490" />
            <Bar dataKey="Total Repositories" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
