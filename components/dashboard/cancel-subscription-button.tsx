"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CancelSubscriptionButtonProps = {
  userId: string;
  provider: string;
};

export function CancelSubscriptionButton({ userId, provider }: CancelSubscriptionButtonProps) {
  const router = useRouter();
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    const isApple = provider === "apple";
    const warning = isApple
      ? "This revokes Premium access immediately, but the customer's Apple subscription will keep renewing " +
        "and they will keep being charged until they cancel it themselves in their App Store settings. " +
        "This does NOT stop the charge.\n\nEnter a reason to proceed (required):"
      : "This will cancel the customer's Stripe subscription immediately and revoke Premium access. " +
        "This cannot be undone.\n\nEnter a reason to proceed (required):";

    const reason = window.prompt(warning);
    if (reason === null) {
      return;
    }
    if (!reason.trim()) {
      setError("A reason is required to cancel a subscription.");
      return;
    }

    setIsCanceling(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/customers/${userId}/subscription/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? "Unable to cancel subscription.");
      }

      router.refresh();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Unable to cancel subscription.");
    } finally {
      setIsCanceling(false);
    }
  }

  return (
    <div className="app__admin-actionStack">
      <button
        type="button"
        className="app__admin-ghostButton app__admin-dangerButton"
        onClick={handleCancel}
        disabled={isCanceling}
      >
        {isCanceling ? "Canceling..." : "Cancel subscription"}
      </button>
      {error ? <p className="app__admin-formError">{error}</p> : null}
    </div>
  );
}
