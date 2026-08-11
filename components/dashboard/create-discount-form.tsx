"use client";

import { type FormEvent, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export function CreateDiscountForm({ role }: { role: string }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [percent, setPercent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedPercent = Number(percent);
    if (!label.trim()) {
      setError("Enter a name for this discount.");
      return;
    }
    if (!percent || Number.isNaN(parsedPercent) || parsedPercent <= 0 || parsedPercent >= 100) {
      setError("Enter a percentage between 1 and 99.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim(), percent: parsedPercent }),
      });
      const payload = (await response.json()) as { id?: string; detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to create discount.");
      }

      router.push(`/dashboard/${role}/discounts/${payload.id}` as Route);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to create discount.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-stack" onSubmit={handleSubmit}>
      <label className="app__admin-field">
        <span>Name</span>
        <input
          className="app__admin-input"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="e.g. 10% Off"
          required
        />
      </label>

      <label className="app__admin-field">
        <span>Discount %</span>
        <input
          type="number"
          className="app__admin-input"
          value={percent}
          onChange={(event) => setPercent(event.target.value)}
          placeholder="e.g. 10"
          min={1}
          max={99}
          step={1}
          required
        />
      </label>

      <div className="app__admin-submitRow">
        {error ? <p className="app__admin-formError">{error}</p> : <span />}
        <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create discount"}
        </button>
      </div>
    </form>
  );
}
