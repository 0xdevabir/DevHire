"use client";

import AppShell from "@/components/AppShell";
import DeveloperCard from "@/components/DeveloperCard";
import { searchDevelopers } from "@/lib/client-api";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  increaseSearchedUsers,
} from "@/lib/storage";
import type { GithubUserSummary } from "@/lib/types";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function DevelopersPage() {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<GithubUserSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [featuredLoaded, setFeaturedLoaded] = useState(false);

  /* load recent searches & featured devs on mount */
  useEffect(() => {
    setRecentSearches(getRecentSearches());
    void loadFeatured();
  }, []);

  useEffect(() => {
    if (!activeQuery) return;
    void runSearch(activeQuery, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function loadFeatured() {
    try {
      const data = await searchDevelopers("followers:>10000", 1, 8);
      if (data.items?.length) {
        setUsers(data.items);
        setFeaturedLoaded(true);
      }
    } catch {
      /* silent — featured is optional */
    }
  }

  async function runSearch(query: string, targetPage: number) {
    setLoading(true);
    setError("");

    try {
      const data = await searchDevelopers(query, targetPage, 10);
      setUsers(data.items || []);
      setTotalCount(data.total_count || 0);
      increaseSearchedUsers((data.items || []).length);
      setFeaturedLoaded(false);
    } catch {
      setError("Failed to fetch developers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const performSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      setKeyword(trimmed);
      setPage(1);
      setActiveQuery(trimmed);
      addRecentSearch(trimmed);
      setRecentSearches(getRecentSearches());
      await runSearch(trimmed, 1);
    },
    [],
  );

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await performSearch(keyword);
  }

  function handleClearRecent() {
    clearRecentSearches();
    setRecentSearches([]);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / 10));
  const showResults = activeQuery && !featuredLoaded;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Developer Search</h2>
          <p className="mt-1 text-sm text-gray-500">
            Search by username and open profiles for repository-level review.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-transparent focus:ring-2"
              style={{ "--tw-ring-color": "var(--brand-teal)" } as React.CSSProperties}
              placeholder="Search developers (e.g., react, python, fullstack)"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--brand-teal)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--teal-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--brand-teal)")
            }
          >
            Search
          </button>
        </form>

        {/* Recent Searches */}
        {!showResults && recentSearches.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Recent Searches
              </h3>
              <button
                onClick={handleClearRecent}
                className="text-xs text-gray-400 transition-colors hover:text-red-500"
              >
                Clear all
              </button>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {recentSearches.map((q) => (
                <button
                  key={q}
                  onClick={() => performSearch(q)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-transparent hover:text-white"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--brand-teal)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  <svg
                    className="h-3 w-3 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Featured / Default developers */}
        {!activeQuery && featuredLoaded && users.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Popular Developers
            </h3>
            <section className="mt-3 grid gap-3 sm:grid-cols-2">
              {users.map((user) => (
                <DeveloperCard key={user.id} user={user} />
              ))}
            </section>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 py-8">
            <svg
              className="h-5 w-5 animate-spin"
              style={{ color: "var(--brand-teal)" }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm text-gray-500">Searching developers...</span>
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Search Results */}
        {showResults && !loading && (
          <div>
            {/* Results header + pagination */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-gray-500">
                {totalCount.toLocaleString()} results for{" "}
                <span className="font-medium text-gray-900">&ldquo;{activeQuery}&rdquo;</span>
              </p>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                Page {page} / {totalPages}
              </div>
            </div>

            {/* Recent searches inline (when in results view) */}
            {recentSearches.length > 1 && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                <span className="shrink-0 text-xs text-gray-400">Recent:</span>
                {recentSearches
                  .filter((q) => q !== activeQuery.toLowerCase())
                  .slice(0, 5)
                  .map((q) => (
                    <button
                      key={q}
                      onClick={() => performSearch(q)}
                      className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
                    >
                      {q}
                    </button>
                  ))}
              </div>
            )}

            {/* Results list */}
            <section className="mt-4 space-y-3">
              {users.map((user) => (
                <DeveloperCard key={user.id} user={user} />
              ))}
              {users.length === 0 && !loading && (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                  <p className="text-sm text-gray-500">
                    No developers found for this search.
                  </p>
                </div>
              )}
            </section>

            {/* Bottom pagination */}
            {users.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-400">
                  {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
