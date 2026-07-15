import type { Route } from "next";
import Link from "next/link";

import { fetchAdminOrders } from "@/lib/api";
import { formatCurrencyMinor, formatDate, formatLabel, formatNumber } from "@/lib/admin-format";

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { status?: string; before?: string };
}) {
  const response = await fetchAdminOrders({
    status: searchParams?.status || undefined,
    before: searchParams?.before || undefined,
    limit: 30,
  });

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Orders</p>
          <h2 className="app__admin-groceriesTitle">Grocery orders</h2>
          <p>Track fulfillment, payment outcomes, substitution decisions, and refunds from one queue.</p>
        </div>
      </section>

      <section className="app__admin-groceriesPanel">
        <form className="app__admin-groceriesSearch" action={`/dashboard/${params.role}/orders`}>
          <label className="app__admin-field">
            <span>Status</span>
            <input
              name="status"
              defaultValue={searchParams?.status ?? ""}
              placeholder="confirmed, picking, delivered..."
              className="app__admin-input"
            />
          </label>
          <div className="app__admin-field">
            <span>Loaded</span>
            <input className="app__admin-input" value={`${response.items.length} orders`} readOnly />
          </div>
          <button type="submit" className="app__admin-filterButton">
            Filter
          </button>
        </form>
      </section>

      {response.items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No orders</p>
          <h2>No grocery orders found</h2>
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
                    <span className="app__admin-tagPill">{formatNumber(order.items.length)} items</span>
                  </div>
                </div>

                <div className="app__admin-dataStats">
                  <span>Total: {formatCurrencyMinor(order.pricing_summary.total_minor, order.currency)}</span>
                  <span>Wallet: {formatCurrencyMinor(order.payment_summary.wallet_amount_minor, order.currency)}</span>
                  <span>Card: {formatCurrencyMinor(order.payment_summary.card_amount_minor, order.currency)}</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>

                <div className="app__admin-actionsWrap">
                  <Link href={`/dashboard/${params.role}/orders/${order.id}` as Route} className="app__admin-primaryButton">
                    Open order
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {response.next_cursor ? (
            <div className="app__admin-actionsWrap">
              <Link
                href={`/dashboard/${params.role}/orders?before=${encodeURIComponent(response.next_cursor)}${searchParams?.status ? `&status=${encodeURIComponent(searchParams.status)}` : ""}` as Route}
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
