"use client";

import AppShell from "@/components/AppShell";
import DeveloperCard from "@/components/DeveloperCard";
import { searchDevelopers } from "@/lib/client-api";
import { increaseSearchedUsers } from "@/lib/storage";
import type { GithubUserSummary } from "@/lib/types";
import { FormEvent, useEffect, useState } from "react";

export default function DevelopersPage() {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<GithubUserSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  useEffect(() => {
    if (!activeQuery) return;
    void runSearch(activeQuery, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function runSearch(query: string, targetPage: number) {
    setLoading(true);
    setError("");

    try {
      const data = await searchDevelopers(query, targetPage, 10);
      setUsers(data.items || []);
      setTotalCount(data.total_count || 0);
      increaseSearchedUsers((data.items || []).length);
    } catch {
      setError("Failed to fetch developers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = keyword.trim();
    if (!nextQuery) return;
    setPage(1);
    setActiveQuery(nextQuery);
    await runSearch(nextQuery, 1);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / 10));

  return (
    <AppShell>
      <h2 className="text-2xl font-bold">Developer Search</h2>
      <p className="mt-1 text-sm text-slate-600">Search by username and open profiles for repository-level review.</p>

      <form onSubmit={handleSearch} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none ring-slate-900 focus:ring-2"
          placeholder="Search users (e.g., frontend engineer)"
        />
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <p>{totalCount.toLocaleString()} users found</p>
        <p>
          Page {page} / {totalPages}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1 || loading || !activeQuery}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages || loading || !activeQuery}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {loading && <p className="mt-5 text-sm text-slate-600">Loading...</p>}
      {error && <p className="mt-5 text-sm text-rose-600">{error}</p>}

      {!loading && !error && users.length === 0 && activeQuery && (
        <p className="mt-5 text-sm text-slate-600">No developers found for this search.</p>
      )}

      <section className="mt-5 space-y-3">
        {users.map((user) => (
          <DeveloperCard key={user.id} user={user} />
        ))}
      </section>
    </AppShell>
  );
}
