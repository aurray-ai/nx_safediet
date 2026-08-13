"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminConfirmDialog } from "@/components/dashboard/admin-confirm-dialog";
import { formatLabel } from "@/lib/admin-format";
import type { OrderStatus } from "@/lib/types";

type OrderStatusFormProps = {
  orderId: string;
  orderNumber: string;
  currentStatus: OrderStatus;
};

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["payment_processing", "confirmed", "canceled", "payment_failed"],
  payment_processing: ["confirmed", "canceled", "payment_failed"],
  confirmed: ["picking", "canceled", "partially_refunded", "refunded"],
  picking: ["packed", "canceled", "partially_refunded", "refunded"],
  packed: ["out_for_delivery", "partially_refunded", "refunded"],
  out_for_delivery: ["delivered", "partially_refunded", "refunded"],
  delivered: ["partially_refunded", "refunded"],
  partially_refunded: ["refunded"],
  refunded: [],
  canceled: [],
  payment_failed: [],
};

const WARNING_ORDER_STATUSES = new Set<OrderStatus>(["delivered", "partially_refunded", "refunded", "canceled", "payment_failed"]);

export function OrderStatusForm({ orderId, orderNumber, currentStatus }: OrderStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const availableStatuses = [currentStatus, ...(ORDER_STATUS_TRANSITIONS[currentStatus] ?? [])];
  const isWarningStatus = WARNING_ORDER_STATUSES.has(status);

  async function submitStatusUpdate() {
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
      setIsConfirmOpen(false);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update order status.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (status === currentStatus) {
      setError("Choose the next order status before updating.");
      return;
    }

    setIsConfirmOpen(true);
  }

  return (
    <>
      <form className="app__admin-stack" onSubmit={handleSubmit}>
        <label className="app__admin-field">
          <span>Status</span>
          <select className="app__admin-select" value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
            {availableStatuses.map((option) => (
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
          <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting || status === currentStatus}>
            {isSubmitting ? "Updating..." : "Update status"}
          </button>
        </div>
      </form>

      <AdminConfirmDialog
        open={isConfirmOpen}
        title={`Change ${orderNumber} to ${formatLabel(status)}?`}
        description={
          isWarningStatus
            ? "This is a sensitive status change and may affect downstream operations or customer communication."
            : "This will update the live order record."
        }
        details={[
          { label: "Current status", value: formatLabel(currentStatus) },
          { label: "New status", value: formatLabel(status) },
          ...(note.trim() ? [{ label: "Note", value: note.trim() }] : []),
        ]}
        confirmLabel="Confirm update"
        cancelLabel="Go back"
        tone={isWarningStatus ? "warning" : "default"}
        isSubmitting={isSubmitting}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={submitStatusUpdate}
      />
    </>
  );
}
