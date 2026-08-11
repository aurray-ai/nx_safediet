"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { DiscountProduct } from "@/lib/types";
import { formatLabel } from "@/lib/admin-format";

import { UnassignDiscountProductButton } from "./unassign-discount-product-button";

export function DiscountTiedProducts({
  discountId,
  initialProducts,
  total,
}: {
  discountId: string;
  initialProducts: DiscountProduct[];
  total: number;
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleViewAll() {
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.set("page", "1");
      query.set("page_size", String(Math.max(total, 1)));
      const response = await fetch(`/api/admin/discounts/${discountId}/products?${query.toString()}`);
      const payload = (await response.json()) as { items?: DiscountProduct[]; detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to load all products.");
      }
      setProducts(payload.items ?? []);
      setIsExpanded(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load all products.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleRemoved(productId: string) {
    setProducts((current) => current.filter((product) => product.id !== productId));
    router.refresh();
  }

  if (products.length === 0) {
    return <p className="app__admin-inlineMeta">No products tied to this discount yet.</p>;
  }

  return (
    <div className="app__admin-stack">
      <div className="app__admin-dataList">
        {products.map((product) => (
          <div key={product.id} className="app__admin-dataRow app__admin-dataRow--stacked">
            <div className="app__admin-stack">
              <strong>{product.product}</strong>
              <span className="app__admin-inlineMeta">{formatLabel(product.category_id)}</span>
            </div>
            <UnassignDiscountProductButton
              discountId={discountId}
              productId={product.id}
              onRemoved={() => handleRemoved(product.id)}
            />
          </div>
        ))}
      </div>
      {!isExpanded && total > products.length ? (
        <button type="button" className="app__admin-linkButton" onClick={handleViewAll} disabled={isLoading}>
          {isLoading ? "Loading..." : `View all ${total} products`}
        </button>
      ) : null}
      {error ? <p className="app__admin-formError">{error}</p> : null}
    </div>
  );
}
