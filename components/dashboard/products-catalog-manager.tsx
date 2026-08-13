"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { formatCurrencyAmount } from "@/lib/admin-format";
import type { AdminProductBulkDeleteResponse, AdminProductListItem } from "@/lib/types";

type ProductsCatalogManagerProps = {
  items: AdminProductListItem[];
  total: number;
  activeCount: number;
  role: string;
  search: string;
  page: number;
  pageSize: number;
};

export function ProductsCatalogManager({
  items,
  total,
  activeCount,
  role,
  search,
  page,
  pageSize,
}: ProductsCatalogManagerProps) {
  const router = useRouter();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = total === 0 ? 0 : Math.min(currentPage * pageSize, total);

  const allVisibleSelected = useMemo(
    () => items.length > 0 && items.every((product) => selectedProductIds.includes(product.id)),
    [items, selectedProductIds]
  );

  function buildPageHref(nextPage: number): Route {
    const params = new URLSearchParams();
    if (search) {
      params.set("search", search);
    }
    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }
    const query = params.toString();
    return `/dashboard/${role}/products${query ? `?${query}` : ""}` as Route;
  }

  function toggleSelection(productId: string) {
    setErrorMessage(null);
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId]
    );
  }

  function toggleSelectAllVisible() {
    setErrorMessage(null);
    setSelectedProductIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !items.some((product) => product.id === id));
      }

      const merged = new Set(current);
      for (const product of items) {
        merged.add(product.id);
      }
      return Array.from(merged);
    });
  }

  async function handleDeleteSelected() {
    if (selectedProductIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedProductIds.length} selected grocery product${selectedProductIds.length === 1 ? "" : "s"}?`
    );
    if (!confirmed) {
      return;
    }

    setIsDeletingSelected(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/products/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_ids: selectedProductIds }),
      });

      const payload = (await response.json().catch(() => null)) as
        | ({ detail?: string } & Partial<AdminProductBulkDeleteResponse>)
        | null;

      if (!response.ok) {
        throw new Error(payload?.detail ?? "Unable to delete selected products.");
      }

      const deletedIds = payload?.deleted_product_ids ?? selectedProductIds;
      const missingIds = payload?.missing_product_ids ?? [];
      setSelectedProductIds((current) => current.filter((id) => !deletedIds.includes(id)));

      if (missingIds.length > 0) {
        setErrorMessage(
          `${deletedIds.length} deleted. ${missingIds.length} already missing and were skipped.`
        );
      }

      router.refresh();
    } catch (deleteError) {
      setErrorMessage(
        deleteError instanceof Error ? deleteError.message : "Unable to delete selected products."
      );
    } finally {
      setIsDeletingSelected(false);
    }
  }

  return (
    <>
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Groceries</p>
          <h2 className="app__admin-groceriesTitle">Products</h2>
        </div>

        <div className="app__admin-groceriesActions">
          <span className="app__admin-inlineMeta">
            {total} items · Showing {pageStart}-{pageEnd}
          </span>
          {selectedProductIds.length > 0 ? (
            <>
              <button
                type="button"
                className="app__admin-secondaryButton"
                onClick={() => setSelectedProductIds([])}
                disabled={isDeletingSelected}
              >
                Clear selection
              </button>
              <button
                type="button"
                className="app__admin-ghostButton app__admin-dangerButton"
                onClick={handleDeleteSelected}
                disabled={isDeletingSelected}
              >
                {isDeletingSelected ? "Deleting..." : `Delete selected (${selectedProductIds.length})`}
              </button>
            </>
          ) : null}
          <Link href={`/dashboard/${role}/products/new` as Route} className="app__admin-primaryButton">
            Add product
          </Link>
        </div>
      </section>

      <section className="app__admin-groceriesPanel">
        <form className="app__admin-groceriesSearch" action={`/dashboard/${role}/products`}>
          <label className="app__admin-field">
            <span>Search</span>
            <input
              name="search"
              defaultValue={search}
              placeholder="Search products"
              className="app__admin-input"
            />
          </label>
          <div className="app__admin-field">
            <span>Status</span>
            <input className="app__admin-input" value={`${activeCount} active`} readOnly />
          </div>
          <button type="submit" className="app__admin-filterButton">
            Search
          </button>
        </form>

        {items.length > 0 ? (
          <div className="app__admin-selectionToolbar">
            <label className="app__admin-checkbox app__admin-checkbox--inline">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleSelectAllVisible}
              />
              <span>
                {allVisibleSelected ? "Clear visible selection" : "Select all visible"}
              </span>
            </label>
            <span className="app__admin-inlineMeta">
              {selectedProductIds.length} selected
            </span>
          </div>
        ) : null}

        {errorMessage ? <p className="app__admin-formError">{errorMessage}</p> : null}
      </section>

      {items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No products</p>
          <h2>No groceries found</h2>
        </section>
      ) : (
        <section className="app__admin-productList">
          {items.map((product) => {
            const isSelected = selectedProductIds.includes(product.id);

            return (
              <article
                key={product.id}
                className={`app__admin-productListItem ${isSelected ? "is-selected" : ""}`}
              >
                <div className="app__admin-productListSelection">
                  <label className="app__admin-checkbox app__admin-checkbox--inline">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(product.id)}
                    />
                  </label>
                </div>

                <Link
                  href={`/dashboard/${role}/products/${product.id}` as Route}
                  className="app__admin-productListRow"
                >
                  <div className="app__admin-productThumb app__admin-productThumb--small">
                    {product.img_url ? (
                      <img src={product.img_url} alt={product.product} />
                    ) : (
                      <div className="app__admin-fallback">{product.product.slice(0, 2).toUpperCase()}</div>
                    )}
                  </div>

                  <div className="app__admin-productListMain">
                    <div className="app__admin-productCardTop">
                      <span className="app__admin-categoryPill">{product.category_name}</span>
                      <span className={`app__admin-statusPill ${product.is_active ? "" : "is-inactive"}`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <h3 className="app__admin-productName">{product.product}</h3>
                  </div>

                  <div className="app__admin-productListValue">
                    <strong>
                      {product.price
                        ? formatCurrencyAmount(product.price.amount, product.price.currency_code)
                        : "Price pending"}
                    </strong>
                    <span>{product.price?.price_unit ?? "No unit"}</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </section>
      )}

      {totalPages > 1 ? (
        <section className="app__admin-pagination">
          <span className="app__admin-inlineMeta">
            Page {currentPage} of {totalPages}
          </span>
          <div className="app__admin-paginationActions">
            {currentPage > 1 ? (
              <Link href={buildPageHref(currentPage - 1)} className="app__admin-secondaryButton">
                Previous
              </Link>
            ) : (
              <span className="app__admin-secondaryButton app__admin-paginationButton is-disabled">
                Previous
              </span>
            )}
            {currentPage < totalPages ? (
              <Link href={buildPageHref(currentPage + 1)} className="app__admin-primaryButton">
                Next
              </Link>
            ) : (
              <span className="app__admin-primaryButton app__admin-paginationButton is-disabled">
                Next
              </span>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}
