"use client";

import { FormEvent, useEffect, useState } from "react";

type GithubUser = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
};

export default function DashboardPage() {
  const [allowed, setAllowed] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    setAllowed(true);
  }, []);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(keyword)}&page=${page}&per_page=10`
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.items || []);
    } catch {
      setError("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  }

  if (!allowed) return <main className="min-h-screen p-8">Checking login...</main>;

  return (
    <main className="min-h-screen p-8 w-full mx-auto bg-[#272727]">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/login";
        }}
        className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white"
      >
        Logout
      </button>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search GitHub users..."
          className="flex-1 border rounded-md px-3 py-2"
        />
        <button type="submit" className="rounded-md bg-black text-white px-4 py-2">
          Search
        </button>
      </form>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <ul className="mt-6 space-y-3">
        {users.map((user) => (
          <li key={user.id} className="border rounded-md p-3 flex items-center gap-3">
            <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{user.login}</p>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View GitHub Profile
              </a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}