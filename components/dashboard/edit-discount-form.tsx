"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function EditDiscountForm({
  discountId,
  label,
  percent,
}: {
  discountId: string;
  label: string;
  percent: number;
}) {
  const router = useRouter();
  const [labelValue, setLabelValue] = useState(label);
  const [percentValue, setPercentValue] = useState(String(percent));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedPercent = Number(percentValue);
    if (!labelValue.trim()) {
      setError("Enter a name for this discount.");
      return;
    }
    if (!percentValue || Number.isNaN(parsedPercent) || parsedPercent <= 0 || parsedPercent >= 100) {
      setError("Enter a percentage between 1 and 99.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/discounts/${discountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: labelValue.trim(), percent: parsedPercent }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to update discount.");
      }
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update discount.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-stack" onSubmit={handleSubmit}>
      <div className="app__admin-tagRow">
        <label className="app__admin-field">
          <span>Name</span>
          <input
            className="app__admin-input"
            value={labelValue}
            onChange={(event) => setLabelValue(event.target.value)}
          />
        </label>
        <label className="app__admin-field">
          <span>Discount %</span>
          <input
            type="number"
            className="app__admin-input"
            value={percentValue}
            onChange={(event) => setPercentValue(event.target.value)}
            min={1}
            max={99}
            step={1}
          />
        </label>
        <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
      {error ? <p className="app__admin-formError">{error}</p> : null}
    </form>
  );
}
