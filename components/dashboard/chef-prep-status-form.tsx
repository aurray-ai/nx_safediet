"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { formatLabel } from "@/lib/admin-format";
import type { ChefFulfillmentStatus } from "@/lib/types";

const STATUS_OPTIONS: ChefFulfillmentStatus[] = ["assigned", "preparing", "ready_for_delivery"];

export function ChefPrepStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: ChefFulfillmentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState<ChefFulfillmentStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/chef/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to update status.");
      }

      setNote("");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update status.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-stack" onSubmit={handleSubmit}>
      <div className="app__admin-tagRow">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={option === status ? "app__admin-primaryButton" : "app__admin-secondaryButton"}
            onClick={() => setStatus(option)}
          >
            {formatLabel(option)}
          </button>
        ))}
      </div>

      <label className="app__admin-field">
        <span>Note</span>
        <textarea
          className="app__admin-textarea"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder="Add a note about prep progress or any issues"
        />
      </label>

      <div className="app__admin-submitRow">
        {error ? <p className="app__admin-formError">{error}</p> : <span />}
        <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update status"}
        </button>
      </div>
    </form>
  );
}
