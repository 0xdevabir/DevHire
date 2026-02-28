import { StarRating } from "@/components/ReviewModal";
import type { ShortlistedCandidate } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  candidate: ShortlistedCandidate;
  onRemove: (username: string) => void;
  onEdit: (candidate: ShortlistedCandidate) => void;
};

export default function ShortlistCard({ candidate, onRemove, onEdit }: Props) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: avatar + info */}
        <div className="flex items-start gap-3">
          <Image
            src={candidate.avatarUrl}
            alt={candidate.username}
            width={48}
            height={48}
            className="rounded-full ring-2 ring-gray-100"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{candidate.name || candidate.username}</p>
            <p className="text-xs text-gray-500">@{candidate.username}</p>
            <p className="mt-0.5 text-xs text-gray-400">
              {candidate.company || "No company"} &middot; {candidate.location || "No location"}
            </p>

            {/* Label badge */}
            {candidate.label && (
              <span className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: 'var(--brand-teal)' }}>
                {candidate.label}
              </span>
            )}

            {/* Rating display */}
            {candidate.rating > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={candidate.rating} size="sm" />
                <span className="text-xs font-medium text-gray-500">
                  {candidate.rating}/5
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            onClick={() => onEdit(candidate)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:text-sm"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
            Review
          </button>
          <Link
            href={`/developers/${candidate.username}`}
            className="rounded-lg px-3 py-2 text-xs font-medium text-white transition-colors sm:px-4 sm:text-sm"
            style={{ backgroundColor: 'var(--brand-teal)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--teal-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-teal)')}
          >
            View
          </Link>
          <button
            onClick={() => onRemove(candidate.username)}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 sm:px-4 sm:text-sm"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Comment bar */}
      {candidate.comment && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">
            <span className="mr-1.5 font-semibold text-gray-500">Notes:</span>
            {candidate.comment}
          </p>
        </div>
      )}
    </article>
  );
}
