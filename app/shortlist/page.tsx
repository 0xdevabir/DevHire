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

  function handleRemove(username: string) {
    const next = removeFromShortlist(username);
    setCandidates(next);
  }

  function handleEdit(candidate: ShortlistedCandidate) {
    setEditingCandidate(candidate);
    setReviewOpen(true);
  }

  function handleReviewSave(rating: number, comment: string) {
    if (!editingCandidate) return;
    const next = updateShortlistReview(editingCandidate.username, rating, comment);
    setCandidates(next);
    setEditingCandidate(null);
  }

  return (
    <AppShell>
      <h2 className="text-2xl font-bold text-gray-900">Candidate Shortlist</h2>
      <p className="mt-1 text-sm text-gray-500">Stored locally in your browser for quick recruiter workflow.</p>

      <section className="mt-5 space-y-3">
        {candidates.map((candidate) => (
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

      {/* Review edit modal */}
      <ReviewModal
        open={reviewOpen}
        onClose={() => { setReviewOpen(false); setEditingCandidate(null); }}
        onSave={handleReviewSave}
        initialRating={editingCandidate?.rating ?? 0}
        initialComment={editingCandidate?.comment ?? ""}
        candidateName={editingCandidate?.name || editingCandidate?.username || ""}
      />
    </AppShell>
  );
}
