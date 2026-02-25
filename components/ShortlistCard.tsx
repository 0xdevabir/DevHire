import type { ShortlistedCandidate } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  candidate: ShortlistedCandidate;
  onRemove: (username: string) => void;
};

export default function ShortlistCard({ candidate, onRemove }: Props) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={candidate.avatarUrl}
          alt={candidate.username}
          width={48}
          height={48}
          className="rounded-full ring-2 ring-gray-100"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{candidate.name || candidate.username}</p>
          <p className="text-xs text-gray-500">@{candidate.username}</p>
          <p className="mt-0.5 text-xs text-gray-400">
            {candidate.company || "No company"} &middot; {candidate.location || "No location"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/developers/${candidate.username}`}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--brand-teal)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--teal-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-teal)')}
        >
          View
        </Link>
        <button
          onClick={() => onRemove(candidate.username)}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          Remove
        </button>
      </div>
    </article>
  );
}
