import type { ShortlistedCandidate } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  candidate: ShortlistedCandidate;
  onRemove: (username: string) => void;
};

export default function ShortlistCard({ candidate, onRemove }: Props) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={candidate.avatarUrl}
          alt={candidate.username}
          width={52}
          height={52}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">{candidate.name || candidate.username}</p>
          <p className="text-sm text-slate-600">@{candidate.username}</p>
          <p className="text-xs text-slate-500">
            {candidate.company || "No company"} • {candidate.location || "No location"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/developers/${candidate.username}`}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          View
        </Link>
        <button
          onClick={() => onRemove(candidate.username)}
          className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          Remove
        </button>
      </div>
    </article>
  );
}
