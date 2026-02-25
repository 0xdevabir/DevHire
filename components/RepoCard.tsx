import type { GithubRepository } from "@/lib/types";

type Props = {
  repo: GithubRepository;
};

export default function RepoCard({ repo }: Props) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <a href={repo.html_url} target="_blank" rel="noreferrer" className="font-semibold underline">
        {repo.name}
      </a>
      <p className="mt-2 text-sm text-slate-600">{repo.description || "No description"}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
        <span>⭐ {repo.stargazers_count}</span>
        <span>🍴 {repo.forks_count}</span>
        <span>🧩 {repo.language || "Unknown"}</span>
      </div>
    </article>
  );
}
