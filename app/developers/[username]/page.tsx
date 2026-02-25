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
      <Link href="/developers" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
        Back to search
      </Link>

      {loading && <p className="mt-5 text-sm text-gray-500">Loading profile...</p>}
      {error && <p className="mt-5 text-sm text-red-600">{error}</p>}

      {!loading && profile && (
        <>
          <section className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={profile.avatar_url}
                  alt={profile.login}
                  width={72}
                  height={72}
                  className="rounded-full ring-2 ring-gray-100"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.name || profile.login}</h2>
                  <p className="text-sm text-gray-500">@{profile.login}</p>
                  <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-sm font-medium transition-colors hover:underline"
                    style={{ color: 'var(--brand-teal)' }}
                  >
                    Open on GitHub
                  </a>
                </div>
              </div>

              <button
                onClick={handleShortlistToggle}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  shortlisted
                    ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "text-white"
                }`}
                style={
                  shortlisted
                    ? {}
                    : { backgroundColor: 'var(--brand-teal)' }
                }
                onMouseEnter={(e) => {
                  if (!shortlisted) e.currentTarget.style.backgroundColor = 'var(--teal-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!shortlisted) e.currentTarget.style.backgroundColor = 'var(--brand-teal)';
                }}
              >
                {shortlisted ? "Remove from shortlist" : "Add to shortlist"}
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">{profile.bio || "No bio provided."}</p>
            <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-3">
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
              <h3 className="text-base font-semibold text-gray-900">Repositories</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setRepoPage((prev) => Math.max(1, prev - 1))}
                  disabled={repoPage === 1 || loading}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setRepoPage((prev) => prev + 1)}
                  disabled={loading || repos.length < 10}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
              {repos.length === 0 && <p className="text-sm text-gray-500">No repositories available.</p>}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
