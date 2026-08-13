"use client";

import { useEffect, useMemo, useState } from "react";

import { formatLabel, formatNumber } from "@/lib/admin-format";
import { getShopperPickingStorageKey, type ShopperPickingItemStatus } from "@/lib/shopper-picking";
import type { GroceryOrderFulfillmentItem } from "@/lib/types";

type ShopperPickingSheetProps = {
  orderId: string;
  items: GroceryOrderFulfillmentItem[];
};

type PickingState = Record<string, ShopperPickingItemStatus>;

export function ShopperPickingSheet({ orderId, items }: ShopperPickingSheetProps) {
  const [pickedItems, setPickedItems] = useState<PickingState>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storageKey = getShopperPickingStorageKey(orderId);

    try {
      const savedValue = window.localStorage.getItem(storageKey);
      if (!savedValue) {
        setIsReady(true);
        return;
      }

      const parsed = JSON.parse(savedValue) as unknown;
      if (!parsed || typeof parsed !== "object") {
        window.localStorage.removeItem(storageKey);
        setIsReady(true);
        return;
      }

      const nextState: PickingState = {};
      for (const item of items) {
        const itemStatus = (parsed as Record<string, unknown>)[item.id];
        if (itemStatus === "item_picked") {
          nextState[item.id] = "item_picked";
        }
      }

      setPickedItems(nextState);
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setIsReady(true);
    }
  }, [items, orderId]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const storageKey = getShopperPickingStorageKey(orderId);
    const hasPickedItems = Object.keys(pickedItems).length > 0;

    if (!hasPickedItems) {
      window.localStorage.removeItem(storageKey);
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(pickedItems));
  }, [isReady, orderId, pickedItems]);

  const pickedCount = useMemo(
    () => items.filter((item) => pickedItems[item.id] === "item_picked").length,
    [items, pickedItems],
  );
  const remainingCount = Math.max(items.length - pickedCount, 0);
  const progressPercent = items.length === 0 ? 0 : Math.round((pickedCount / items.length) * 100);

  function togglePicked(itemId: string) {
    setPickedItems((current) => {
      if (current[itemId] === "item_picked") {
        const next = { ...current };
        delete next[itemId];
        return next;
      }

      return {
        ...current,
        [itemId]: "item_picked",
      };
    });
  }

  return (
    <section className="app__admin-pickingSheet">
      <div className="app__admin-pickingSummary">
        <div className="app__admin-pickingProgress">
          <span>Picking progress</span>
          <strong>
            {formatNumber(pickedCount)} of {formatNumber(items.length)} item{items.length === 1 ? "" : "s"} picked
          </strong>
        </div>
        <div className="app__admin-pickingProgressBar" aria-hidden="true">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="app__admin-tagRow">
          <span className="app__admin-tagPill">{formatNumber(remainingCount)} remaining</span>
          <span className="app__admin-tagPill">{progressPercent}% complete</span>
        </div>
      </div>

      <div className="app__admin-dataList">
        {items.map((item) => {
          const isPicked = pickedItems[item.id] === "item_picked";

          return (
            <article key={item.id} className={`app__admin-pickingRow${isPicked ? " is-picked" : ""}`}>
              <label className="app__admin-checkbox app__admin-checkbox--inline app__admin-pickingCheck">
                <input
                  type="checkbox"
                  checked={isPicked}
                  onChange={() => togglePicked(item.id)}
                  aria-label={`Mark ${item.product_name} as item picked`}
                />
                <span>{isPicked ? "Item picked" : "Mark as item picked"}</span>
              </label>

              <div className="app__admin-dataLead">
                <div className="app__admin-productThumb app__admin-productThumb--small">
                  {item.img_url ? (
                    <img src={item.img_url} alt={item.product_name} />
                  ) : (
                    <div className="app__admin-fallback">{item.product_name.slice(0, 2).toUpperCase()}</div>
                  )}
                </div>

                <div className="app__admin-stack">
                  <div className="app__admin-productCardTop">
                    <strong>{item.product_name}</strong>
                    <span className={`app__admin-statusPill${isPicked ? "" : " is-inactive"}`}>
                      {isPicked ? "Item picked" : "Pending"}
                    </span>
                  </div>

                  <div className="app__admin-tagRow">
                    <span className="app__admin-tagPill">
                      {item.quantity} x {item.unit_label}
                    </span>
                    {item.unit_weight_grams > 0 ? (
                      <span className="app__admin-tagPill">{formatNumber(item.unit_weight_grams)}g each</span>
                    ) : null}
                    {item.source_meal_id ? <span className="app__admin-categoryPill">Meal plan</span> : null}
                    <span className="app__admin-tagPill">
                      {item.allow_substitutions ? "Substitutions allowed" : "No substitutions"}
                    </span>
                    {item.substitution_resolution !== "none" ? (
                      <span className="app__admin-tagPill">{formatLabel(item.substitution_resolution)}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
