"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { formatDate, formatLabel } from "@/lib/admin-format";
import type {
  AdminInventoryAdjustment,
  AdminInventoryItem,
  AdminInventoryItemUpsertPayload,
  AdminProduct,
  InventoryAdjustmentType,
} from "@/lib/types";

type InventoryEditorProps = {
  role: string;
  product: AdminProduct;
  initialInventory: AdminInventoryItem | null;
  adjustments: AdminInventoryAdjustment[];
};

const MANUAL_ADJUSTMENT_OPTIONS: Array<{ value: InventoryAdjustmentType; label: string }> = [
  { value: "manual_increment", label: "Increase stock" },
  { value: "manual_decrement", label: "Decrease stock" },
  { value: "manual_set", label: "Set stock level" },
];

export function InventoryEditor({ role, product, initialInventory, adjustments }: InventoryEditorProps) {
  const router = useRouter();
  const [inventory, setInventory] = useState<AdminInventoryItemUpsertPayload>({
    sku: initialInventory?.sku ?? "",
    is_active: initialInventory?.is_active ?? true,
    available_quantity: initialInventory?.available_quantity ?? 0,
    reserved_quantity: initialInventory?.reserved_quantity ?? 0,
    unit_label: initialInventory?.unit_label ?? "item",
    unit_weight_grams: initialInventory?.unit_weight_grams ?? 100,
    max_per_order: initialInventory?.max_per_order ?? 25,
    allow_substitutions: initialInventory?.allow_substitutions ?? true,
    substitution_group: initialInventory?.substitution_group ?? "",
  });
  const [adjustmentType, setAdjustmentType] = useState<InventoryAdjustmentType>("manual_increment");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentReferenceType, setAdjustmentReferenceType] = useState("");
  const [adjustmentReferenceId, setAdjustmentReferenceId] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);

  function updateField<Key extends keyof AdminInventoryItemUpsertPayload>(key: Key, value: AdminInventoryItemUpsertPayload[Key]) {
    setInventory((current) => ({ ...current, [key]: value }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/admin/inventory/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...inventory,
          substitution_group: inventory.substitution_group?.trim() || null,
        }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to save inventory item.");
      }

      setSuccessMessage("Inventory settings updated.");
      router.refresh();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save inventory item.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAdjustment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAdjusting(true);
    setAdjustmentError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/admin/inventory/${product.id}/adjustments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adjustment_type: adjustmentType,
          quantity: adjustmentQuantity,
          reason: adjustmentReason.trim(),
          reference_type: adjustmentReferenceType.trim() || null,
          reference_id: adjustmentReferenceId.trim() || null,
          metadata: {},
        }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to apply stock adjustment.");
      }

      setSuccessMessage("Stock adjustment applied.");
      setAdjustmentQuantity(1);
      setAdjustmentReason("");
      setAdjustmentReferenceType("");
      setAdjustmentReferenceId("");
      router.refresh();
    } catch (error) {
      setAdjustmentError(error instanceof Error ? error.message : "Unable to apply stock adjustment.");
    } finally {
      setIsAdjusting(false);
    }
  }

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Inventory</p>
          <h2 className="app__admin-groceriesTitle">{product.product}</h2>
          <p>Operational stock, sellability, substitutions, and adjustment history.</p>
        </div>
        <div className="app__admin-groceriesActions">
          <Link href={`/dashboard/${role}/products/${product.id}`} className="app__admin-secondaryButton">
            Product detail
          </Link>
        </div>
      </section>

      <section className="app__admin-detailGrid">
        <form className="app__admin-productSection" onSubmit={handleSave}>
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Settings</p>
              <h2>Inventory configuration</h2>
            </div>
          </div>

          <div className="app__admin-editorGrid">
            <label className="app__admin-field">
              <span>SKU</span>
              <input className="app__admin-input" value={inventory.sku} onChange={(event) => updateField("sku", event.target.value)} required />
            </label>

            <label className="app__admin-field">
              <span>Unit label</span>
              <input
                className="app__admin-input"
                value={inventory.unit_label}
                onChange={(event) => updateField("unit_label", event.target.value)}
                required
              />
            </label>

            <label className="app__admin-field">
              <span>Available quantity</span>
              <input
                type="number"
                min="0"
                className="app__admin-input"
                value={inventory.available_quantity}
                onChange={(event) => updateField("available_quantity", Number(event.target.value))}
                required
              />
            </label>

            <label className="app__admin-field">
              <span>Reserved quantity</span>
              <input
                type="number"
                min="0"
                className="app__admin-input"
                value={inventory.reserved_quantity}
                onChange={(event) => updateField("reserved_quantity", Number(event.target.value))}
                required
              />
            </label>

            <label className="app__admin-field">
              <span>Unit weight grams</span>
              <input
                type="number"
                min="1"
                className="app__admin-input"
                value={inventory.unit_weight_grams}
                onChange={(event) => updateField("unit_weight_grams", Number(event.target.value))}
                required
              />
            </label>

            <label className="app__admin-field">
              <span>Max per order</span>
              <input
                type="number"
                min="1"
                className="app__admin-input"
                value={inventory.max_per_order}
                onChange={(event) => updateField("max_per_order", Number(event.target.value))}
                required
              />
            </label>

            <label className="app__admin-field app__admin-field--full">
              <span>Substitution group</span>
              <input
                className="app__admin-input"
                value={inventory.substitution_group ?? ""}
                onChange={(event) => updateField("substitution_group", event.target.value)}
                placeholder="e.g. leafy_greens"
              />
            </label>
          </div>

          <div className="app__admin-rowActions">
            <label className="app__admin-checkbox app__admin-checkbox--inline">
              <input
                type="checkbox"
                checked={inventory.is_active}
                onChange={(event) => updateField("is_active", event.target.checked)}
              />
              <span>Sellable</span>
            </label>

            <label className="app__admin-checkbox app__admin-checkbox--inline">
              <input
                type="checkbox"
                checked={inventory.allow_substitutions}
                onChange={(event) => updateField("allow_substitutions", event.target.checked)}
              />
              <span>Allow substitutions</span>
            </label>
          </div>

          <div className="app__admin-submitRow">
            <div className="app__admin-feedbackStack">
              {saveError ? <p className="app__admin-formError">{saveError}</p> : null}
              {successMessage ? <p className="app__admin-formSuccess">{successMessage}</p> : null}
            </div>
            <button type="submit" className="app__admin-primaryButton" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save inventory"}
            </button>
          </div>
        </form>

        <form className="app__admin-productSection" onSubmit={handleAdjustment}>
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Stock movement</p>
              <h2>Apply adjustment</h2>
            </div>
          </div>

          <div className="app__admin-editorGrid">
            <label className="app__admin-field">
              <span>Adjustment type</span>
              <select className="app__admin-select" value={adjustmentType} onChange={(event) => setAdjustmentType(event.target.value as InventoryAdjustmentType)}>
                {MANUAL_ADJUSTMENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                value={adjustmentQuantity}
                onChange={(event) => setAdjustmentQuantity(Number(event.target.value))}
                required
              />
            </label>

            <label className="app__admin-field app__admin-field--full">
              <span>Reason</span>
              <input
                className="app__admin-input"
                value={adjustmentReason}
                onChange={(event) => setAdjustmentReason(event.target.value)}
                placeholder="Cycle count, damaged goods, supplier top-up..."
                required
              />
            </label>

            <label className="app__admin-field">
              <span>Reference type</span>
              <input
                className="app__admin-input"
                value={adjustmentReferenceType}
                onChange={(event) => setAdjustmentReferenceType(event.target.value)}
                placeholder="purchase_order"
              />
            </label>

            <label className="app__admin-field">
              <span>Reference id</span>
              <input
                className="app__admin-input"
                value={adjustmentReferenceId}
                onChange={(event) => setAdjustmentReferenceId(event.target.value)}
                placeholder="PO-1049"
              />
            </label>
          </div>

          <div className="app__admin-submitRow">
            <div className="app__admin-feedbackStack">
              {adjustmentError ? <p className="app__admin-formError">{adjustmentError}</p> : null}
            </div>
            <button type="submit" className="app__admin-primaryButton" disabled={isAdjusting}>
              {isAdjusting ? "Applying..." : "Apply adjustment"}
            </button>
          </div>
        </form>
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">History</p>
            <h2>Stock adjustments</h2>
          </div>
        </div>

        {adjustments.length === 0 ? (
          <p className="app__admin-inlineMeta">No adjustments recorded yet.</p>
        ) : (
          <div className="app__admin-dataList">
            {adjustments.map((adjustment) => (
              <article key={adjustment.id} className="app__admin-dataRow">
                <div className="app__admin-stack">
                  <strong>{formatLabel(adjustment.adjustment_type)}</strong>
                  <span>{adjustment.reason}</span>
                </div>
                <div className="app__admin-inlineMetaList">
                  <span>Delta: {adjustment.delta_quantity > 0 ? `+${adjustment.delta_quantity}` : adjustment.delta_quantity}</span>
                  <span>{formatDate(adjustment.created_at)}</span>
                  {adjustment.reference_type ? (
                    <span>
                      {adjustment.reference_type}: {adjustment.reference_id ?? "n/a"}
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
