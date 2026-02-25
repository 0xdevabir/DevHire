"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
  candidateName: string;
};

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
      {/* full star background (gray) */}
      <path
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        fill={filled ? "var(--brand-teal)" : "#e5e7eb"}
        stroke={filled ? "var(--teal-hover)" : "#d1d5db"}
        strokeWidth="0.5"
      />
    </svg>
  );
}

export default function ReviewModal({
  open,
  onClose,
  onSave,
  initialRating = 0,
  initialComment = "",
  candidateName,
}: Props) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState(initialComment);

  // Sync internal state when modal opens with new values
  useEffect(() => {
    if (open) {
      setRating(initialRating);
      setComment(initialComment);
      setHoveredStar(0);
    }
  }, [open, initialRating, initialComment]);

  if (!open) return null;

  const displayRating = hoveredStar || rating;

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  function handleSave() {
    onSave(rating, comment.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Header accent */}
        <div
          className="h-1.5"
          style={{
            background:
              "linear-gradient(90deg, var(--brand-navy), var(--brand-teal), var(--lighter-teal))",
          }}
        />

        <div className="p-6">
          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Review Candidate
              </h3>
              <p className="mt-0.5 text-sm text-gray-500">{candidateName}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Star Rating */}
          <div className="mt-6">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Rating
            </label>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <StarIcon filled={star <= displayRating} />
                </button>
              ))}
              {displayRating > 0 && (
                <span
                  className="ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: "var(--teal-light)",
                    color: "var(--teal-hover)",
                  }}
                >
                  {ratingLabels[displayRating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Notes / Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Add your notes about this candidate..."
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-transparent focus:bg-white focus:ring-2"
              style={
                { "--tw-ring-color": "var(--brand-teal)" } as React.CSSProperties
              }
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {comment.length} / 500
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "var(--brand-teal)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--teal-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--brand-teal)")
              }
            >
              Save Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Inline Star Display (read-only) ── */

export function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={dim} viewBox="0 0 24 24" fill="none">
          <path
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            fill={star <= rating ? "var(--brand-teal)" : "#e5e7eb"}
            stroke={star <= rating ? "var(--teal-hover)" : "#d1d5db"}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}
