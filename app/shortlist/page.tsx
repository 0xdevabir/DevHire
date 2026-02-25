"use client";

import AppShell from "@/components/AppShell";
import ShortlistCard from "@/components/ShortlistCard";
import { getShortlist, removeFromShortlist } from "@/lib/storage";
import type { ShortlistedCandidate } from "@/lib/types";
import { useState } from "react";

function readInitialCandidates() {
  if (typeof window === "undefined") {
    return [];
  }
  return getShortlist();
}

export default function ShortlistPage() {
  const [candidates, setCandidates] = useState<ShortlistedCandidate[]>(readInitialCandidates);

  function handleRemove(username: string) {
    const next = removeFromShortlist(username);
    setCandidates(next);
  }

  return (
    <AppShell>
      <h2 className="text-2xl font-bold">Candidate Shortlist</h2>
      <p className="mt-1 text-sm text-slate-600">Stored locally in your browser for quick recruiter workflow.</p>

      <section className="mt-5 space-y-3">
        {candidates.map((candidate) => (
          <ShortlistCard key={candidate.id} candidate={candidate} onRemove={handleRemove} />
        ))}
      </section>

      {candidates.length === 0 && (
        <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          No shortlisted candidates yet. Add developers from the profile page.
        </div>
      )}
    </AppShell>
  );
}
