"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminOrderItem, AdminProduct } from "@/lib/types";

type SubstitutionFormProps = {
  orderId: string;
  item: AdminOrderItem;
  productOptions: AdminProduct[];
};

export function SubstitutionForm({ orderId, item, productOptions }: SubstitutionFormProps) {
  const router = useRouter();
  const [replacementProductId, setReplacementProductId] = useState(item.substituted_product_id ?? "");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/items/${item.id}/substitution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replacement_product_id: replacementProductId || null,
          note,
        }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to apply substitution decision.");
      }

      setNote("");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to apply substitution decision.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-stack" onSubmit={handleSubmit}>
      <label className="app__admin-field">
        <span>Replacement product</span>
        <select
          className="app__admin-select"
          value={replacementProductId}
          onChange={(event) => setReplacementProductId(event.target.value)}
        >
          <option value="">Remove item instead</option>
          {productOptions
            .filter((product) => product.id !== item.product_id)
            .map((product) => (
              <option key={product.id} value={product.id}>
                {product.product}
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
          placeholder="Why this substitution or removal is being applied"
        />
      </label>

      <div className="app__admin-submitRow">
        {error ? <p className="app__admin-formError">{error}</p> : <span />}
        <button type="submit" className="app__admin-secondaryButton" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Apply decision"}
        </button>
      </div>
    </form>
  );
}
