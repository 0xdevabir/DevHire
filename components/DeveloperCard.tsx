import type { GithubUserSummary } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  user: GithubUserSummary;
};

export default function DeveloperCard({ user }: Props) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={44}
          height={44}
          className="rounded-full ring-2 ring-gray-100"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{user.login}</p>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-500 hover:underline"
            style={{ color: 'var(--brand-teal)' }}
          >
            GitHub profile
          </a>
        </div>
      </div>
      <Link
        href={`/developers/${user.login}`}
        className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        style={{ backgroundColor: 'var(--brand-teal)' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--teal-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-teal)')}
      >
        View Details
      </Link>
    </article>
  );
}
