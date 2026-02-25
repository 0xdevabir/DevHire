import type { GithubRepository } from "@/lib/types";

type Props = {
  repo: GithubRepository;
};

export default function RepoCard({ repo }: Props) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-semibold text-gray-900 hover:underline"
        style={{ color: 'var(--brand-teal)' }}
      >
        {repo.name}
      </a>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{repo.description || "No description"}</p>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" /></svg>
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-12.814a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093" /></svg>
          {repo.forks_count}
        </span>
        {repo.language && (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ backgroundColor: 'var(--teal-light)', color: 'var(--teal-hover)' }}>
            {repo.language}
          </span>
        )}
      </div>
    </article>
  );
}
