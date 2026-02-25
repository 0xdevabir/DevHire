import type { GithubUserSummary } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  user: GithubUserSummary;
};

export default function DeveloperCard({ user }: Props) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">{user.login}</p>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-600 underline"
          >
            GitHub profile
          </a>
        </div>
      </div>
      <Link
        href={`/developers/${user.login}`}
        className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
      >
        View Details
      </Link>
    </article>
  );
}
