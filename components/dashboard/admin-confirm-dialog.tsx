"use client";

import { useEffect } from "react";

type AdminConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  details?: Array<{ label: string; value: string }>;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "warning";
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminConfirmDialog({
  open,
  title,
  description,
  details = [],
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  isSubmitting = false,
  onCancel,
  onConfirm,
}: AdminConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onCancel, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="app__admin-dialogBackdrop" role="presentation" onClick={isSubmitting ? undefined : onCancel}>
      <div
        className={`app__admin-dialog ${tone === "warning" ? "is-warning" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="app__admin-dialogBody">
          <p className="app__admin-eyebrow">Confirm update</p>
          <h2 id="admin-confirm-dialog-title">{title}</h2>
          <p>{description}</p>

          {details.length > 0 ? (
            <div className="app__admin-dialogDetails">
              {details.map((detail) => (
                <div key={`${detail.label}-${detail.value}`} className="app__admin-detailRow">
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="app__admin-dialogActions">
          <button type="button" className="app__admin-secondaryButton" onClick={onCancel} disabled={isSubmitting}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={tone === "warning" ? "app__admin-primaryButton app__admin-dangerButton" : "app__admin-primaryButton"}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
