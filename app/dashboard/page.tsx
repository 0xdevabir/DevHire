"use client";

import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import StatsChart from "@/components/StatsChart";
import { getDashboardStats, getShortlist } from "@/lib/storage";
import Link from "next/link";
import { useMemo, useState } from "react";

function readInitialStats() {
  if (typeof window === "undefined") {
    return { searchedUsers: 0, shortlistedUsers: 0, repositories: 0 };
  }

  const stats = getDashboardStats();
  const shortlist = getShortlist();

  return {
    searchedUsers: stats.totalSearchedUsers,
    shortlistedUsers: shortlist.length,
    repositories: shortlist.reduce((sum, item) => sum + item.publicRepos, 0),
  };
}

export default function DashboardPage() {
  const [{ searchedUsers, shortlistedUsers, repositories }] = useState(readInitialStats);

  const statItems = useMemo(
    () => [
      { label: "Total searched users", value: searchedUsers },
      { label: "Total shortlisted candidates", value: shortlistedUsers },
      { label: "Total repositories (shortlist)", value: repositories },
    ],
    [repositories, searchedUsers, shortlistedUsers],
  );

  return (
    <AppShell>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="mt-1 text-sm text-slate-600">Overview of recruiter activity and shortlisted candidates.</p>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        {statItems.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <div className="mt-5">
        <StatsChart searched={searchedUsers} shortlisted={shortlistedUsers} repos={repositories} />
      </div>

      <section className="mt-5 flex flex-wrap gap-2">
        <Link href="/developers" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Search Developers
        </Link>
        <Link href="/shortlist" className="rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800">
          Open Shortlist
        </Link>
      </section>
    </AppShell>
  );
}