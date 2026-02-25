"use client";

import AppShell from "@/components/AppShell";
import RepoCard from "@/components/RepoCard";
import { fetchDeveloperProfile, fetchDeveloperRepos } from "@/lib/client-api";
import { addToShortlist, isShortlisted, removeFromShortlist } from "@/lib/storage";
import type { GithubRepository, GithubUserProfile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Props = {
  params: Promise<{ username: string }>;
};

export default function DeveloperProfilePage({ params }: Props) {
  const { username } = use(params);
  const [profile, setProfile] = useState<GithubUserProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repoPage, setRepoPage] = useState(1);
  const [shortlisted, setShortlisted] = useState(false);

  useEffect(() => {
    void loadData(username, repoPage);
  }, [username, repoPage]);

  async function loadData(nextUsername: string, page: number) {
    setLoading(true);
    setError("");

    try {
      const [profileData, repoData] = await Promise.all([
        fetchDeveloperProfile(nextUsername),
        fetchDeveloperRepos(nextUsername, page, 10),
      ]);
      setProfile(profileData);
      setRepos(repoData);
      setShortlisted(isShortlisted(nextUsername));
    } catch {
      setError("Could not load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleShortlistToggle() {
    if (!profile) return;
    if (shortlisted) {
      removeFromShortlist(profile.login);
      setShortlisted(false);
      return;
    }
    addToShortlist(profile);
    setShortlisted(true);
  }

  return (
    <AppShell>
      <Link href="/developers" className="text-sm text-slate-600 underline">
        ← Back to search
      </Link>

      {loading && <p className="mt-5 text-sm text-slate-600">Loading profile...</p>}
      {error && <p className="mt-5 text-sm text-rose-600">{error}</p>}

      {!loading && profile && (
        <>
          <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={profile.avatar_url}
                  alt={profile.login}
                  width={72}
                  height={72}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-xl font-bold">{profile.name || profile.login}</h2>
                  <p className="text-sm text-slate-600">@{profile.login}</p>
                  <a href={profile.html_url} target="_blank" rel="noreferrer" className="text-sm underline">
                    Open on GitHub
                  </a>
                </div>
              </div>

              <button
                onClick={handleShortlistToggle}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                  shortlisted ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {shortlisted ? "Remove from shortlist" : "Add to shortlist"}
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-700">{profile.bio || "No bio provided."}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
              <p>Followers: {profile.followers}</p>
              <p>Following: {profile.following}</p>
              <p>Public repos: {profile.public_repos}</p>
              <p>Company: {profile.company || "N/A"}</p>
              <p>Location: {profile.location || "N/A"}</p>
              <p>Created: {new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Repositories</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setRepoPage((prev) => Math.max(1, prev - 1))}
                  disabled={repoPage === 1 || loading}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setRepoPage((prev) => prev + 1)}
                  disabled={loading || repos.length < 10}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
              {repos.length === 0 && <p className="text-sm text-slate-600">No repositories available.</p>}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
