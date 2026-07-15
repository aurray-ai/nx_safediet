"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminOrderItem } from "@/lib/types";

type RefundFormProps = {
  orderId: string;
  items: AdminOrderItem[];
};

export function RefundForm({ orderId, items }: RefundFormProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [amountMinor, setAmountMinor] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/refunds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason.trim(),
          amount_minor: amountMinor ? Number(amountMinor) : undefined,
          line_items: itemId ? [{ item_id: itemId, quantity: Number(quantity) || 1 }] : [],
          idempotency_key: crypto.randomUUID(),
        }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to create refund.");
      }

      setReason("");
      setAmountMinor("");
      setItemId("");
      setQuantity("1");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to create refund.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-stack" onSubmit={handleSubmit}>
      <label className="app__admin-field">
        <span>Reason</span>
        <textarea
          className="app__admin-textarea"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={4}
          placeholder="Customer cancellation, damaged item, unavailable stock..."
          required
        />
      </label>

      <div className="app__admin-inlineGrid app__admin-inlineGrid--price">
        <label className="app__admin-field">
          <span>Amount minor</span>
          <input
            type="number"
            min="0"
            className="app__admin-input"
            value={amountMinor}
            onChange={(event) => setAmountMinor(event.target.value)}
            placeholder="Optional"
          />
        </label>

        <label className="app__admin-field">
          <span>Line item</span>
          <select className="app__admin-select" value={itemId} onChange={(event) => setItemId(event.target.value)}>
            <option value="">Full order or amount-based refund</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.product_name}
              </option>
            ))}
          </select>
        </label>

        <label className="app__admin-field">
          <span>Quantity</span>
          <input
            type="number"
            min="1"
            className="app__admin-input"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            disabled={!itemId}
          />
        </label>
      </div>

      <div className="app__admin-submitRow">
        {error ? <p className="app__admin-formError">{error}</p> : <span />}
        <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create refund"}
        </button>
      </div>
    </form>
  );
}
