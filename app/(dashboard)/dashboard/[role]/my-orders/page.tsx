import type { Route } from "next";
import Link from "next/link";

import { fetchChefMealOrders, fetchShopperGroceryOrders } from "@/lib/api";
import { formatCurrencyMinor, formatDate, formatLabel } from "@/lib/admin-format";

export default async function MyOrdersPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { before?: string };
}) {
  const isChef = params.role === "chef";

  if (isChef) {
    const response = await fetchChefMealOrders({ before: searchParams?.before, limit: 30 });
    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">My orders</p>
            <h2 className="app__admin-groceriesTitle">My orders</h2>
            <p>Everything currently assigned to you, sorted by delivery time.</p>
          </div>
        </section>

        {response.items.length === 0 ? (
          <section className="app__admin-emptyState">
            <p className="app__admin-eyebrow">No orders</p>
            <h2>No orders assigned yet</h2>
          </section>
        ) : (
          <section className="app__admin-productSection">
            <div className="app__admin-dataList">
              {response.items.map((order) => (
                <article key={order.id} className="app__admin-dataRow">
                  <div className="app__admin-stack">
                    <strong>{order.items.map((item) => item.meal_name).join(", ") || order.order_number}</strong>
                    <div className="app__admin-tagRow">
                      <span className="app__admin-categoryPill">{formatLabel(order.fulfillment_status)}</span>
                    </div>
                  </div>

                  <div className="app__admin-dataStats">
                    <span>Total: {formatCurrencyMinor(order.total_minor, order.currency)}</span>
                    <span>{formatDate(order.created_at)}</span>
                  </div>

                  <div className="app__admin-actionsWrap">
                    <Link href={`/dashboard/chef/my-orders/${order.id}` as Route} className="app__admin-primaryButton">
                      Open order
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {response.next_cursor ? (
              <div className="app__admin-actionsWrap">
                <Link
                  href={`/dashboard/chef/my-orders?before=${encodeURIComponent(response.next_cursor)}` as Route}
                  className="app__admin-secondaryButton"
                >
                  Load older orders
                </Link>
              </div>
            ) : null}
          </section>
        )}
      </section>
    );
  }

  const response = await fetchShopperGroceryOrders({ before: searchParams?.before, limit: 30 });
  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">My orders</p>
          <h2 className="app__admin-groceriesTitle">My orders</h2>
          <p>Grocery runs currently assigned to you.</p>
        </div>
      </section>

      {response.items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No orders</p>
          <h2>No orders match this filter</h2>
        </section>
      ) : (
        <section className="app__admin-productSection">
          <div className="app__admin-dataList">
            {response.items.map((order) => (
              <article key={order.id} className="app__admin-dataRow">
                <div className="app__admin-stack">
                  <strong>{order.items.length} items to collect</strong>
                  <div className="app__admin-tagRow">
                    <span className="app__admin-categoryPill">{formatLabel(order.fulfillment_status)}</span>
                  </div>
                </div>

                <div className="app__admin-dataStats">
                  <span>Total: {formatCurrencyMinor(order.total_minor, order.currency)}</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>

                <div className="app__admin-actionsWrap">
                  <Link href={`/dashboard/shopper/my-orders/${order.id}` as Route} className="app__admin-primaryButton">
                    Open order
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {response.next_cursor ? (
            <div className="app__admin-actionsWrap">
              <Link
                href={`/dashboard/shopper/my-orders?before=${encodeURIComponent(response.next_cursor)}` as Route}
                className="app__admin-secondaryButton"
              >
                Load older orders
              </Link>
            </div>
          ) : null}
        </section>
      )}
    </section>
  );
}
