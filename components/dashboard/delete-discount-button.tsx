"use client";

import type { Route } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteDiscountButtonProps = {
  discountId: string;
  discountLabel: string;
  productCount: number;
  role: string;
};

export function DeleteDiscountButton({ discountId, discountLabel, productCount, role }: DeleteDiscountButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const warning =
      productCount > 0
        ? `Delete "${discountLabel}"? This will remove it from ${productCount} ${productCount === 1 ? "product" : "products"} and they will return to full price.`
        : `Delete "${discountLabel}"?`;
    const confirmed = window.confirm(warning);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/discounts/${discountId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? "Unable to delete discount.");
      }

      router.push(`/dashboard/${role}/discounts` as Route);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete discount.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="app__admin-actionStack">
      <button
        type="button"
        className="app__admin-ghostButton app__admin-dangerButton"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete discount"}
      </button>
      <p className="app__admin-inlineMeta">
        Deleting this discount will remove it from all products and restore full prices.
      </p>
      {error ? <p className="app__admin-formError">{error}</p> : null}
    </div>
  );
}
