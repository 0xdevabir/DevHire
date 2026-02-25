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
      <div className="space-y-6">
        {/* Page heading */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your recruitment activity and shortlisted candidates.
          </p>
        </div>

        {/* Stats Cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          {statItems.map((item, index) => (
            <StatCard key={item.label} label={item.label} value={item.value} index={index} />
          ))}
        </section>

        {/* Chart Section */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <StatsChart searched={searchedUsers} shortlisted={shortlistedUsers} repos={repositories} />
        </div>

        {/* Quick Actions */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Quick Actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "var(--brand-teal)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--teal-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-teal)")}
            >
              Search Developers
            </Link>
            <Link
              href="/shortlist"
              className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
              style={{ borderColor: "var(--brand-teal)", color: "var(--brand-teal)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--teal-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              View Shortlist
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}