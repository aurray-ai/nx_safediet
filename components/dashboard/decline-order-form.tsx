"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const REASON_OPTIONS = [
  { value: "too_busy", label: "Too busy" },
  { value: "out_of_stock", label: "Missing ingredients" },
  { value: "outside_availability", label: "Outside my availability" },
  { value: "other", label: "Other" },
];

export function DeclineOrderForm({ orderId, declineEndpoint }: { orderId: string; declineEndpoint: string }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [reasonCode, setReasonCode] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reasonCode) {
      setError("Choose a reason before declining.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(declineEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason_code: reasonCode, note }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to decline order.");
      }

      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to decline order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isExpanded) {
    return (
      <button type="button" className="app__admin-link" onClick={() => setIsExpanded(true)}>
        Can't take this order? Decline it
      </button>
    );
  }

  return (
    <form className="app__admin-stack" onSubmit={handleSubmit}>
      <div className="app__admin-tagRow">
        {REASON_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={option.value === reasonCode ? "app__admin-primaryButton" : "app__admin-secondaryButton"}
            onClick={() => setReasonCode(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="app__admin-field">
        <span>Additional note (optional)</span>
        <textarea
          className="app__admin-textarea"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={2}
          placeholder="Share any extra details to help the admin team"
        />
      </label>

      <p className="app__admin-inlineMeta">This will return the order to the admin queue for reassignment.</p>

      <div className="app__admin-submitRow">
        {error ? <p className="app__admin-formError">{error}</p> : <span />}
        <button type="submit" className="app__admin-secondaryButton" disabled={isSubmitting}>
          {isSubmitting ? "Declining..." : "Decline order"}
        </button>
      </div>
    </form>
  );
}
