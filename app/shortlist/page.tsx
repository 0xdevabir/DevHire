"use client";

import AppShell from "@/components/AppShell";
import ReviewModal from "@/components/ReviewModal";
import ShortlistCard from "@/components/ShortlistCard";
import { getShortlist, removeFromShortlist, updateShortlistReview } from "@/lib/storage";
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
  const [reviewOpen, setReviewOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<ShortlistedCandidate | null>(null);
  const [filterLabel, setFilterLabel] = useState("");

  // Derive unique labels from all candidates
  const allLabels = Array.from(
    new Set(candidates.map((c) => c.label).filter(Boolean))
  );

  const filtered = filterLabel
    ? candidates.filter((c) => c.label === filterLabel)
    : candidates;

  function handleRemove(username: string) {
    const next = removeFromShortlist(username);
    setCandidates(next);
  }

  function handleEdit(candidate: ShortlistedCandidate) {
    setEditingCandidate(candidate);
    setReviewOpen(true);
  }

  function handleReviewSave(rating: number, comment: string, label: string) {
    if (!editingCandidate) return;
    const next = updateShortlistReview(editingCandidate.username, rating, comment, label);
    setCandidates(next);
    setEditingCandidate(null);
  }

  return (
    <AppShell>
      <h2 className="text-2xl font-bold text-gray-900">Candidate Shortlist</h2>
      <p className="mt-1 text-sm text-gray-500">Stored locally in your browser for quick recruiter workflow.</p>

      {/* Label filter pills */}
      {allLabels.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Filter:</span>
          <button
            onClick={() => setFilterLabel("")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              filterLabel === ""
                ? "border-transparent text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
            style={filterLabel === "" ? { backgroundColor: "var(--brand-teal)" } : {}}
          >
            All ({candidates.length})
          </button>
          {allLabels.map((lbl) => (
            <button
              key={lbl}
              onClick={() => setFilterLabel(lbl === filterLabel ? "" : lbl)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filterLabel === lbl
                  ? "border-transparent text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
              style={filterLabel === lbl ? { backgroundColor: "var(--brand-teal)" } : {}}
            >
              {lbl} ({candidates.filter((c) => c.label === lbl).length})
            </button>
          ))}
        </div>
      )}

      <section className="mt-5 space-y-3">
        {filtered.map((candidate) => (
          <ShortlistCard
            key={candidate.id}
            candidate={candidate}
            onRemove={handleRemove}
            onEdit={handleEdit}
          />
        ))}
      </section>

      {candidates.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          No shortlisted candidates yet. Add developers from the profile page.
        </div>
      )}

      {candidates.length > 0 && filtered.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          No candidates match the selected filter.
        </div>
      )}

      {/* Review edit modal */}
      <ReviewModal
        open={reviewOpen}
        onClose={() => { setReviewOpen(false); setEditingCandidate(null); }}
        onSave={handleReviewSave}
        initialRating={editingCandidate?.rating ?? 0}
        initialComment={editingCandidate?.comment ?? ""}
        initialLabel={editingCandidate?.label ?? ""}
        candidateName={editingCandidate?.name || editingCandidate?.username || ""}
      />
    </AppShell>
  );
}
