"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UnassignDiscountProductButton({
  discountId,
  productId,
  onRemoved,
}: {
  discountId: string;
  productId: string;
  onRemoved?: () => void;
}) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove() {
    setIsRemoving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/discounts/${discountId}/products`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_ids: [productId] }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to remove product.");
      }
      if (onRemoved) {
        onRemoved();
      } else {
        router.refresh();
      }
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove product.");
      setIsRemoving(false);
    }
  }

  return (
    <div className="app__admin-actionStack">
      <button type="button" className="app__admin-secondaryButton" onClick={handleRemove} disabled={isRemoving}>
        {isRemoving ? "Removing..." : "Remove"}
      </button>
      {error ? <p className="app__admin-formError">{error}</p> : null}
    </div>
  );
}
