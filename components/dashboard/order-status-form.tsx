"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { formatLabel } from "@/lib/admin-format";
import type { OrderStatus } from "@/lib/types";

type OrderStatusFormProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "pending_payment",
  "payment_processing",
  "confirmed",
  "picking",
  "packed",
  "out_for_delivery",
  "delivered",
  "partially_refunded",
  "refunded",
  "canceled",
  "payment_failed",
];

export function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, note }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to update order status.");
      }

      setNote("");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update order status.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-stack" onSubmit={handleSubmit}>
      <label className="app__admin-field">
        <span>Status</span>
        <select className="app__admin-select" value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {formatLabel(option)}
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
          rows={4}
          placeholder="Why this status changed"
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
