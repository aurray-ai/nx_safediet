import type { Route } from "next";
import Link from "next/link";

import { fetchAdminMealOrders } from "@/lib/api";
import { formatCurrencyMinor, formatDate, formatLabel } from "@/lib/admin-format";

export default async function MealOrdersPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { before?: string };
}) {
  const response = await fetchAdminMealOrders({ before: searchParams?.before, limit: 30 });

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Meal orders</p>
          <h2 className="app__admin-groceriesTitle">Meal orders</h2>
          <p>Paid prepared-meal orders awaiting or in chef assignment.</p>
        </div>
      </section>

      {response.items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No orders</p>
          <h2>No meal orders found</h2>
        </section>
      ) : (
        <section className="app__admin-productSection">
          <div className="app__admin-dataList">
            {response.items.map((order) => (
              <article key={order.id} className="app__admin-dataRow">
                <div className="app__admin-stack">
                  <strong>{order.order_number}</strong>
                  <span>User {order.user_id}</span>
                  <div className="app__admin-tagRow">
                    <span className="app__admin-categoryPill">{formatLabel(order.status)}</span>
                    {order.assigned_worker_id ? (
                      <span className="app__admin-tagPill">{formatLabel(order.fulfillment_status)}</span>
                    ) : (
                      <span className="app__admin-tagPill">Unassigned</span>
                    )}
                  </div>
                </div>

                <div className="app__admin-dataStats">
                  <span>{order.items.length} meal{order.items.length === 1 ? "" : "s"}</span>
                  <span>Total: {formatCurrencyMinor(order.total_minor, order.currency)}</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>

                <div className="app__admin-actionsWrap">
                  <Link href={`/dashboard/${params.role}/meal-orders/${order.id}` as Route} className="app__admin-primaryButton">
                    Open order
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {response.next_cursor ? (
            <div className="app__admin-actionsWrap">
              <Link
                href={`/dashboard/${params.role}/meal-orders?before=${encodeURIComponent(response.next_cursor)}` as Route}
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
