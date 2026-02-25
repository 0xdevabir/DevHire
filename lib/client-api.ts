import type {
  GithubRepository,
  GithubSearchResponse,
  GithubUserProfile,
} from "@/lib/types";

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return (await response.json()) as T;
}

export async function searchDevelopers(keyword: string, page: number, perPage = 10) {
  const query = new URLSearchParams({
    q: keyword,
    page: String(page),
    perPage: String(perPage),
  });

  const response = await fetch(`/api/github/search?${query.toString()}`);
  return readResponse<GithubSearchResponse>(response);
}

export async function fetchDeveloperProfile(username: string) {
  const response = await fetch(`/api/github/users/${encodeURIComponent(username)}`);
  return readResponse<GithubUserProfile>(response);
}

export async function fetchDeveloperRepos(username: string, page: number, perPage = 10) {
  const query = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  const response = await fetch(
    `/api/github/users/${encodeURIComponent(username)}/repos?${query.toString()}`,
  );
  return readResponse<GithubRepository[]>(response);
}
