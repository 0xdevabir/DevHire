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

export function addToShortlist(profile: GithubUserProfile) {
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
