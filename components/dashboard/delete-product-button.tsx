"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
  role: string;
};

export function DeleteProductButton({ productId, productName, role }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${productName}" from groceries?`);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? "Unable to delete product.");
      }

      router.push(`/dashboard/${role}/products`);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product.");
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
        {isDeleting ? "Deleting..." : "Delete product"}
      </button>
      {error ? <p className="app__admin-formError">{error}</p> : null}
    </div>
  );
}
