import type { DashboardStats, GithubUserProfile, ShortlistedCandidate } from "@/lib/types";

const SHORTLIST_KEY = "devhire_shortlist";
const STATS_KEY = "devhire_stats";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getShortlist() {
  return readJson<ShortlistedCandidate[]>(SHORTLIST_KEY, []);
}

export function isShortlisted(username: string) {
  return getShortlist().some(
    (candidate) => candidate.username.toLowerCase() === username.toLowerCase(),
  );
}

export function addToShortlist(profile: GithubUserProfile, rating = 0, comment = "") {
  const current = getShortlist();
  if (current.some((candidate) => candidate.username === profile.login)) {
    return current;
  }

  const next: ShortlistedCandidate[] = [
    {
      id: profile.id,
      username: profile.login,
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url,
      name: profile.name,
      company: profile.company,
      location: profile.location,
      publicRepos: profile.public_repos,
      addedAt: new Date().toISOString(),
      rating,
      comment,
    },
    ...current,
  ];

  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
  return next;
}

export function removeFromShortlist(username: string) {
  const next = getShortlist().filter((candidate) => candidate.username !== username);
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
  return next;
}

export function updateShortlistReview(username: string, rating: number, comment: string) {
  const next = getShortlist().map((c) =>
    c.username.toLowerCase() === username.toLowerCase()
      ? { ...c, rating, comment }
      : c,
  );
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
  return next;
}

export function getShortlistEntry(username: string): ShortlistedCandidate | undefined {
  return getShortlist().find(
    (c) => c.username.toLowerCase() === username.toLowerCase(),
  );
}

export function getDashboardStats() {
  return readJson<DashboardStats>(STATS_KEY, { totalSearchedUsers: 0 });
}

export function increaseSearchedUsers(by: number) {
  const current = getDashboardStats();
  const next = {
    totalSearchedUsers: Math.max(0, current.totalSearchedUsers + Math.max(0, by)),
  };

  localStorage.setItem(STATS_KEY, JSON.stringify(next));
  return next;
}

/* ── Recent Searches ── */

const RECENT_SEARCHES_KEY = "devhire_recent_searches";
const MAX_RECENT = 8;

export function getRecentSearches(): string[] {
  return readJson<string[]>(RECENT_SEARCHES_KEY, []);
}

export function addRecentSearch(query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return;
  const current = getRecentSearches().filter((q) => q !== trimmed);
  const next = [trimmed, ...current].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  return next;
}

export function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}
