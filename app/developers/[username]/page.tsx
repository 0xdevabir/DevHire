"use client";

import AppShell from "@/components/AppShell";
import RepoCard from "@/components/RepoCard";
import ReviewModal, { StarRating } from "@/components/ReviewModal";
import { fetchDeveloperProfile, fetchDeveloperRepos } from "@/lib/client-api";
import { addToShortlist, getShortlistEntry, isShortlisted, removeFromShortlist, updateShortlistReview } from "@/lib/storage";
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
  const [reviewOpen, setReviewOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentComment, setCurrentComment] = useState("");

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
      const entry = getShortlistEntry(nextUsername);
      if (entry) {
        setCurrentRating(entry.rating);
        setCurrentComment(entry.comment);
      }
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
      setCurrentRating(0);
      setCurrentComment("");
      return;
    }
    addToShortlist(profile);
    setShortlisted(true);
  }

  function handleReviewSave(rating: number, comment: string) {
    if (!profile) return;
    updateShortlistReview(profile.login, rating, comment);
    setCurrentRating(rating);
    setCurrentComment(comment);
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
        <div className="mt-4 space-y-6">
          {/* ── Profile Header Card ── */}
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Teal accent banner */}
            <div className="h-24" style={{ background: 'linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-teal) 60%, var(--lighter-teal) 100%)' }} />

            <div className="px-6 pb-6">
              {/* Avatar + name row */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4 -mt-10">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.login}
                    width={88}
                    height={88}
                    className="rounded-xl border-4 border-white shadow-md"
                  />
                  <div className="pb-1">
                    <h2 className="text-xl font-bold text-gray-900">{profile.name || profile.login}</h2>
                    <p className="text-sm text-gray-500">@{profile.login}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:pb-1">
                  <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" /></svg>
                    GitHub
                  </a>
                  <button
                    onClick={handleShortlistToggle}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      shortlisted
                        ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        : "text-white"
                    }`}
                    style={shortlisted ? {} : { backgroundColor: 'var(--brand-teal)' }}
                    onMouseEnter={(e) => { if (!shortlisted) e.currentTarget.style.backgroundColor = 'var(--teal-hover)'; }}
                    onMouseLeave={(e) => { if (!shortlisted) e.currentTarget.style.backgroundColor = 'var(--brand-teal)'; }}
                  >
                    {shortlisted ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    )}
                    {shortlisted ? "Remove" : "Shortlist"}
                  </button>
                  {shortlisted && (
                    <button
                      onClick={() => setReviewOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                      {currentRating > 0 ? "Edit Review" : "Add Review"}
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{profile.bio}</p>
              )}

              {/* Inline review display */}
              {shortlisted && currentRating > 0 && (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <StarRating rating={currentRating} size="sm" />
                  {currentComment && (
                    <span className="truncate text-sm text-gray-600">{currentComment}</span>
                  )}
                  <button
                    onClick={() => setReviewOpen(true)}
                    className="ml-auto shrink-0 text-xs font-medium transition-colors hover:underline"
                    style={{ color: 'var(--brand-teal)' }}
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* Meta tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.company && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                    {profile.company}
                  </span>
                )}
                {profile.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                    {profile.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Stat counters */}
            <div className="grid grid-cols-3 gap-px border-t border-gray-200 bg-gray-100">
              <div className="bg-white px-4 py-4 text-center">
                <p className="text-xl font-bold text-gray-900">{profile.public_repos}</p>
                <p className="text-xs text-gray-500">Repositories</p>
              </div>
              <div className="bg-white px-4 py-4 text-center">
                <p className="text-xl font-bold text-gray-900">{profile.followers.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="bg-white px-4 py-4 text-center">
                <p className="text-xl font-bold text-gray-900">{profile.following.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>
          </section>

          {/* ── Repositories Section ── */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Repositories</h3>
                <p className="mt-0.5 text-xs text-gray-500">Page {repoPage} of public repos</p>
              </div>
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

            <div className="grid gap-3 sm:grid-cols-2">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
            {repos.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500">
                No repositories available.
              </div>
            )}
          </section>
        </div>
      )}
      {/* Review Modal */}
      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onSave={handleReviewSave}
        initialRating={currentRating}
        initialComment={currentComment}
        candidateName={profile?.name || profile?.login || username}
      />
    </AppShell>
  );
}
