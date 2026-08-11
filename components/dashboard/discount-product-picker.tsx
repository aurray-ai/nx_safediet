"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminProduct, AdminProductListResponse, GroceryCategory } from "@/lib/types";

const PAGE_SIZE = 20;

export function DiscountProductPicker({
  discountId,
  categories,
}: {
  discountId: string;
  categories: GroceryCategory[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (targetPage: number, currentSearch: string, currentCategoryId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.set("page", String(targetPage));
      query.set("page_size", String(PAGE_SIZE));
      if (currentSearch.trim()) query.set("search", currentSearch.trim());
      if (currentCategoryId) query.set("category_id", currentCategoryId);

      const response = await fetch(`/api/admin/products?${query.toString()}`);
      const payload = (await response.json()) as AdminProductListResponse & { detail?: string };
      if (!response.ok) {
        throw new Error((payload as { detail?: string }).detail ?? "Unable to load products.");
      }
      setProducts(payload.items);
      setTotal(payload.total);
      setPage(targetPage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load products.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(1, search, categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadProducts(1, search, categoryId);
  }

  function toggleProduct(productId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }

  async function handleSelectAllInCategory() {
    if (!categoryId) return;
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.set("page", "1");
      query.set("page_size", "200");
      query.set("category_id", categoryId);
      const response = await fetch(`/api/admin/products?${query.toString()}`);
      const payload = (await response.json()) as AdminProductListResponse & { detail?: string };
      if (!response.ok) {
        throw new Error((payload as { detail?: string }).detail ?? "Unable to load products.");
      }
      setSelectedIds((current) => {
        const next = new Set(current);
        for (const product of payload.items) next.add(product.id);
        return next;
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to select category products.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAssign() {
    if (selectedIds.size === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/discounts/${discountId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_ids: Array.from(selectedIds) }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to assign products.");
      }
      setSelectedIds(new Set());
      router.refresh();
      loadProducts(page, search, categoryId);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to assign products.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="app__admin-stack">
      <form className="app__admin-groceriesSearch" onSubmit={handleFilter}>
        <label className="app__admin-field">
          <span>Search</span>
          <div className="app__admin-searchField">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="app__admin-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Product name..."
            />
          </div>
        </label>
        <label className="app__admin-field">
          <span>Category</span>
          <select className="app__admin-input" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="app__admin-filterButton" disabled={isLoading}>
          Filter
        </button>
        {categoryId ? (
          <button
            type="button"
            className="app__admin-secondaryButton"
            onClick={handleSelectAllInCategory}
            disabled={isLoading}
          >
            Select all in category
          </button>
        ) : null}
      </form>

      {error ? <p className="app__admin-formError">{error}</p> : null}

      <div className="app__admin-dataList">
        {products.map((product) => {
          const isSelected = selectedIds.has(product.id);
          return (
            <label
              key={product.id}
              className={`app__admin-dataRow app__admin-dataRow--stacked${
                isSelected ? " app__admin-dataRow--selected" : ""
              }`}
            >
              <div className="app__admin-stack">
                <strong>{product.product}</strong>
                <span className="app__admin-inlineMeta">{product.category_id}</span>
              </div>
              <input type="checkbox" checked={isSelected} onChange={() => toggleProduct(product.id)} />
            </label>
          );
        })}
        {products.length === 0 && !isLoading ? <p className="app__admin-inlineMeta">No products match this filter.</p> : null}
      </div>

      {totalPages > 1 ? (
        <div className="app__admin-paginationActions">
          <button
            type="button"
            className="app__admin-secondaryButton"
            disabled={page <= 1 || isLoading}
            onClick={() => loadProducts(page - 1, search, categoryId)}
          >
            Previous
          </button>
          <span className="app__admin-inlineMeta">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="app__admin-primaryButton"
            disabled={page >= totalPages || isLoading}
            onClick={() => loadProducts(page + 1, search, categoryId)}
          >
            Next
          </button>
        </div>
      ) : null}

      <div className="app__admin-submitRow">
        <span className="app__admin-inlineMeta">{selectedIds.size} selected</span>
        <button
          type="button"
          className="app__admin-primaryButton"
          disabled={selectedIds.size === 0 || isSubmitting}
          onClick={handleAssign}
        >
          {isSubmitting ? "Assigning..." : "Assign selected"}
        </button>
      </div>
    </div>
  );
}
