import type { Route } from "next";
import Link from "next/link";

import { fetchAdminInventory } from "@/lib/api";
import { formatDate, formatLabel, formatNumber } from "@/lib/admin-format";

export default async function InventoryPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { search?: string; is_active?: string };
}) {
  const search = searchParams?.search?.trim() || "";
  const isActiveFilter =
    searchParams?.is_active === "true" ? true : searchParams?.is_active === "false" ? false : undefined;
  const response = await fetchAdminInventory({
    search: search || undefined,
    isActive: isActiveFilter,
    page: 1,
    pageSize: 50,
  });
  const lowStock = response.items.filter((item) => item.available_quantity > 0 && item.available_quantity <= 10).length;
  const outOfStock = response.items.filter((item) => item.available_quantity <= 0).length;

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Inventory</p>
          <h2 className="app__admin-groceriesTitle">Operational stock</h2>
          <p>Control sellable inventory, substitution policy, and stock movement for grocery items.</p>
        </div>

        <div className="app__admin-groceriesActions">
          <span className="app__admin-inlineMeta">{response.total} items</span>
        </div>
      </section>

      <section className="app__admin-groceriesPanel">
        <form className="app__admin-groceriesSearch" action={`/dashboard/${params.role}/inventory`}>
          <label className="app__admin-field">
            <span>Search</span>
            <input
              name="search"
              defaultValue={search}
              placeholder="Search by product id, name, or SKU"
              className="app__admin-input"
            />
          </label>

          <label className="app__admin-field">
            <span>Sellable</span>
            <select name="is_active" defaultValue={searchParams?.is_active ?? ""} className="app__admin-select">
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>

          <button type="submit" className="app__admin-filterButton">
            Filter
          </button>
        </form>
      </section>

      <section className="app__admin-summaryGrid">
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Low stock</p>
          <h2>{formatNumber(lowStock)}</h2>
          <p>Items at 10 units or below.</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Out of stock</p>
          <h2>{formatNumber(outOfStock)}</h2>
          <p>Items that should be restocked or deactivated.</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Sellable</p>
          <h2>{formatNumber(response.items.filter((item) => item.is_active).length)}</h2>
          <p>Inventory items currently marked active.</p>
        </article>
      </section>

      {response.items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No inventory</p>
          <h2>No inventory items found</h2>
        </section>
      ) : (
        <section className="app__admin-productSection">
          <div className="app__admin-dataList">
            {response.items.map((item) => (
              <article key={item.id} className="app__admin-dataRow">
                <div className="app__admin-dataLead">
                  <div className="app__admin-productThumb app__admin-productThumb--small">
                    {item.img_url ? <img src={item.img_url} alt={item.product_name ?? item.product_id} /> : <div className="app__admin-fallback">{(item.product_name ?? item.product_id).slice(0, 2).toUpperCase()}</div>}
                  </div>

                  <div className="app__admin-stack">
                    <strong>{item.product_name ?? item.product_id}</strong>
                    <span>{item.sku}</span>
                    <div className="app__admin-tagRow">
                      <span className="app__admin-categoryPill">{item.category_id ? formatLabel(item.category_id) : "Uncategorised"}</span>
                      <span className={`app__admin-statusPill ${item.is_active ? "" : "is-inactive"}`}>
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="app__admin-dataStats">
                  <span>Available: {formatNumber(item.available_quantity)}</span>
                  <span>Reserved: {formatNumber(item.reserved_quantity)}</span>
                  <span>Weight: {formatNumber(item.unit_weight_grams)}g</span>
                  <span>Updated: {formatDate(item.updated_at)}</span>
                </div>

                <div className="app__admin-actionsWrap">
                  <Link href={`/dashboard/${params.role}/inventory/${item.product_id}` as Route} className="app__admin-primaryButton">
                    Manage
                  </Link>
                  <Link href={`/dashboard/${params.role}/products/${item.product_id}` as Route} className="app__admin-secondaryButton">
                    Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
