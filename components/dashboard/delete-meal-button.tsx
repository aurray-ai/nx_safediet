"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteMealButtonProps = {
  mealId: string;
  mealName: string;
  role: string;
};

export function DeleteMealButton({ mealId, mealName, role }: DeleteMealButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${mealName}" from meals?`);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/meals/${mealId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? "Unable to delete meal.");
      }

      router.push(`/dashboard/${role}/meals`);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete meal.");
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
        {isDeleting ? "Deleting..." : "Delete meal"}
      </button>
      {error ? <p className="app__admin-formError">{error}</p> : null}
    </div>
  );
}
