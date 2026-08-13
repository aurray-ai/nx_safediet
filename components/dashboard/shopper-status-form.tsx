"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminConfirmDialog } from "@/components/dashboard/admin-confirm-dialog";
import { formatLabel } from "@/lib/admin-format";
import { getShopperPickingStorageKey } from "@/lib/shopper-picking";
import type { ShopperFulfillmentStatus } from "@/lib/types";

const STATUS_OPTIONS: ShopperFulfillmentStatus[] = ["assigned", "shopping", "packed"];

export function ShopperStatusForm({
  orderId,
  orderNumber,
  currentStatus,
}: {
  orderId: string;
  orderNumber: string;
  currentStatus: ShopperFulfillmentStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ShopperFulfillmentStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const currentIndex = STATUS_OPTIONS.indexOf(currentStatus);

  async function submitStatusUpdate() {
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/shopper/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to update status.");
      }

      if (status === "packed") {
        window.localStorage.removeItem(getShopperPickingStorageKey(orderId));
      }

      setNote("");
      setIsConfirmOpen(false);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update status.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (status === currentStatus) {
      setError("Choose the next shopper status before updating.");
      return;
    }

    setIsConfirmOpen(true);
  }

  return (
    <>
      <form className="app__admin-stack" onSubmit={handleSubmit}>
        <div className="app__admin-tagRow">
          {STATUS_OPTIONS.map((option, index) => {
            const isSelected = option === status;
            const isCurrent = option === currentStatus;
            const isAvailableNextStep = index === currentIndex + 1;
            const isDisabled = !isCurrent && !isAvailableNextStep;

            return (
              <button
                key={option}
                type="button"
                className={isSelected ? "app__admin-primaryButton" : "app__admin-secondaryButton"}
                onClick={() => setStatus(option)}
                disabled={isDisabled}
              >
                {formatLabel(option)}
              </button>
            );
          })}
        </div>

        <label className="app__admin-field">
          <span>Note</span>
          <textarea
            className="app__admin-textarea"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="Add a note about substitutions, store issues, or anything important"
          />
        </label>

        <div className="app__admin-submitRow">
          {error ? <p className="app__admin-formError">{error}</p> : <span />}
          <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting || status === currentStatus}>
            {isSubmitting ? "Updating..." : "Update status"}
          </button>
        </div>
      </form>

      <AdminConfirmDialog
        open={isConfirmOpen}
        title={`Mark ${orderNumber} as ${formatLabel(status)}?`}
        description="This will update your live shopper workflow for this order."
        details={[
          { label: "Current status", value: formatLabel(currentStatus) },
          { label: "New status", value: formatLabel(status) },
          ...(note.trim() ? [{ label: "Note", value: note.trim() }] : []),
        ]}
        confirmLabel="Confirm update"
        cancelLabel="Go back"
        isSubmitting={isSubmitting}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={submitStatusUpdate}
      />
    </>
  );
}
