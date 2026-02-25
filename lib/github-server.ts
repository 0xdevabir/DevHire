const GITHUB_API_BASE = "https://api.github.com";

async function githubRequest(path: string) {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "GitHub API request failed");
  }

  return response;
}

export async function searchGithubUsers(keyword: string, page: number, perPage: number) {
  const params = new URLSearchParams({
    q: keyword,
    page: String(page),
    per_page: String(perPage),
  });

  const response = await githubRequest(`/search/users?${params.toString()}`);
  return response.json();
}

export async function getGithubUser(username: string) {
  const response = await githubRequest(`/users/${encodeURIComponent(username)}`);
  return response.json();
}

export async function getGithubUserRepos(username: string, page: number, perPage: number) {
  const params = new URLSearchParams({
    sort: "updated",
    page: String(page),
    per_page: String(perPage),
  });

  const response = await githubRequest(`/users/${encodeURIComponent(username)}/repos?${params}`);
  return response.json();
}
