"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { WorkerSummary } from "@/lib/types";

type GroceryOrderAssignFormProps = {
  orderId: string;
  currentWorkerId?: string | null;
  workers: WorkerSummary[];
};

export function GroceryOrderAssignForm({ orderId, currentWorkerId, workers }: GroceryOrderAssignFormProps) {
  const router = useRouter();
  const [workerId, setWorkerId] = useState(currentWorkerId ?? "");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workerId) {
      setError("Choose a shopper before assigning.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worker_id: workerId, note }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to assign order.");
      }

      setNote("");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to assign order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-stack" onSubmit={handleSubmit}>
      {currentWorkerId ? (
        <p className="app__admin-inlineMeta">Currently assigned — choose a different shopper to reassign.</p>
      ) : (
        <p className="app__admin-inlineMeta">Currently unassigned — assign this order to begin collection.</p>
      )}

      <label className="app__admin-field">
        <span>Shopper</span>
        <select className="app__admin-select" value={workerId} onChange={(event) => setWorkerId(event.target.value)}>
          <option value="">Choose a shopper…</option>
          {workers.map((worker) => (
            <option key={worker.id} value={worker.id}>
              {worker.name} ({worker.email})
            </option>
          ))}
        </select>
      </label>

      <label className="app__admin-field">
        <span>Note</span>
        <textarea
          className="app__admin-textarea"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder="Optional note for the shopper"
        />
      </label>

      <div className="app__admin-submitRow">
        {error ? <p className="app__admin-formError">{error}</p> : <span />}
        <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting}>
          {isSubmitting ? "Assigning..." : "Assign"}
        </button>
      </div>
    </form>
  );
}
