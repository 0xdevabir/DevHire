export type GithubUserSummary = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
};

export type GithubSearchResponse = {
  total_count: number;
  items: GithubUserSummary[];
};

export type GithubUserProfile = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  location: string | null;
  company: string | null;
  created_at: string;
};

export type GithubRepository = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
};

export type ShortlistedCandidate = {
  id: number;
  username: string;
  avatarUrl: string;
  profileUrl: string;
  name: string | null;
  company: string | null;
  location: string | null;
  publicRepos: number;
  addedAt: string;
  rating: number;
  comment: string;
  label: string;
};

export type DashboardStats = {
  totalSearchedUsers: number;
};
