import type { Route } from "next";
import Link from "next/link";

import { fetchAdminOrders } from "@/lib/api";
import { formatCurrencyMinor, formatDate, formatLabel, formatNumber } from "@/lib/admin-format";
import type { OrderStatus } from "@/lib/types";

const ORDER_STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending_payment", label: "Pending payment" },
  { value: "payment_processing", label: "Payment processing" },
  { value: "confirmed", label: "Confirmed" },
  { value: "picking", label: "Picking" },
  { value: "packed", label: "Packed" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "partially_refunded", label: "Partially refunded" },
  { value: "refunded", label: "Refunded" },
  { value: "canceled", label: "Canceled" },
  { value: "payment_failed", label: "Payment failed" },
];

const QUICK_FILTERS: OrderStatus[] = [
  "confirmed",
  "picking",
  "packed",
  "out_for_delivery",
  "delivered",
  "refunded",
];

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { status?: string; page?: string };
}) {
  const selectedStatus = normalizeOrderStatus(searchParams?.status);
  const rawPage = Number(searchParams?.page ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSize = 20;
  const response = await fetchAdminOrders({
    status: selectedStatus,
    page,
    pageSize,
  });
  const totalPages = Math.max(1, Math.ceil(response.total / response.page_size));
  const pageStart = response.total === 0 ? 0 : (response.page - 1) * response.page_size + 1;
  const pageEnd = response.total === 0 ? 0 : Math.min(response.page * response.page_size, response.total);
  const awaitingActionCount = response.items.filter((order) =>
    ["pending_payment", "payment_processing", "confirmed", "picking", "packed"].includes(order.status),
  ).length;
  const deliveryCount = response.items.filter((order) => order.status === "out_for_delivery").length;
  const closedCount = response.items.filter((order) =>
    ["delivered", "refunded", "partially_refunded", "canceled"].includes(order.status),
  ).length;

  function buildPageHref(targetPage: number): Route {
    const query = new URLSearchParams();
    if (selectedStatus) {
      query.set("status", selectedStatus);
    }
    if (targetPage > 1) {
      query.set("page", String(targetPage));
    }
    const serialized = query.toString();
    return `/dashboard/${params.role}/orders${serialized ? `?${serialized}` : ""}` as Route;
  }

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Orders</p>
          <h2 className="app__admin-groceriesTitle">Grocery orders</h2>
          <p>Track payment, picking, delivery, substitutions, and refunds from one live queue.</p>
        </div>
        <div className="app__admin-groceriesActions">
          <span className="app__admin-inlineMeta">
            {response.total} orders · Showing {pageStart}-{pageEnd}
          </span>
        </div>
      </section>

      <section className="app__admin-groceriesPanel">
        <div className="app__admin-orderSummaryGrid">
          <article className="app__admin-orderSummaryCard">
            <span>Loaded</span>
            <strong>{formatNumber(response.items.length)}</strong>
            <p>Current page size after filters.</p>
          </article>
          <article className="app__admin-orderSummaryCard">
            <span>Action needed</span>
            <strong>{formatNumber(awaitingActionCount)}</strong>
            <p>Awaiting payment, picking, or packing work.</p>
          </article>
          <article className="app__admin-orderSummaryCard">
            <span>Out for delivery</span>
            <strong>{formatNumber(deliveryCount)}</strong>
            <p>Orders currently on the road.</p>
          </article>
          <article className="app__admin-orderSummaryCard">
            <span>Closed</span>
            <strong>{formatNumber(closedCount)}</strong>
            <p>Delivered, refunded, or canceled orders.</p>
          </article>
        </div>

        <form className="app__admin-groceriesSearch" action={`/dashboard/${params.role}/orders`}>
          <label className="app__admin-field">
            <span>Status</span>
            <select name="status" defaultValue={selectedStatus ?? ""} className="app__admin-select">
              <option value="">All statuses</option>
              {ORDER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="app__admin-field">
            <span>Queue</span>
            <input className="app__admin-input" value={selectedStatus ? formatLabel(selectedStatus) : "All orders"} readOnly />
          </div>

          <div className="app__admin-actionsWrap">
            <button type="submit" className="app__admin-filterButton">
              Apply filter
            </button>
            {selectedStatus ? (
              <Link href={`/dashboard/${params.role}/orders` as Route} className="app__admin-secondaryButton">
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <div className="app__admin-orderFilterBar">
          <Link
            href={`/dashboard/${params.role}/orders` as Route}
            className={`app__admin-orderFilterChip${selectedStatus ? "" : " is-active"}`}
          >
            All
          </Link>
          {QUICK_FILTERS.map((status) => (
            <Link
              key={status}
              href={`/dashboard/${params.role}/orders?status=${encodeURIComponent(status)}` as Route}
              className={`app__admin-orderFilterChip${selectedStatus === status ? " is-active" : ""}`}
            >
              {formatLabel(status)}
            </Link>
          ))}
        </div>
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
              <article key={order.id} className="app__admin-orderRow">
                <div className="app__admin-orderMain">
                  <div className="app__admin-orderTop">
                    <strong>{order.order_number}</strong>
                    <span className="app__admin-inlineMeta">User {order.user_id}</span>
                  </div>

                  <div className="app__admin-tagRow">
                    <span className="app__admin-categoryPill">{formatLabel(order.status)}</span>
                    <span className="app__admin-tagPill">
                      {order.assigned_worker_id ? formatLabel(order.fulfillment_status) : "Unassigned"}
                    </span>
                    <span className="app__admin-tagPill">{formatNumber(order.items.length)} items</span>
                  </div>

                  <div className="app__admin-orderMeta">
                    <span>Placed {formatDate(order.created_at)}</span>
                    <span>Updated {formatDate(order.updated_at)}</span>
                    <span>{order.payment_summary.provider ? formatLabel(order.payment_summary.provider) : "Wallet only"}</span>
                  </div>
                </div>

                <div className="app__admin-orderMetrics">
                  <div className="app__admin-orderMetric">
                    <span>Total</span>
                    <strong>{formatCurrencyMinor(order.pricing_summary.total_minor, order.currency)}</strong>
                  </div>
                  <div className="app__admin-orderMetric">
                    <span>Wallet</span>
                    <strong>{formatCurrencyMinor(order.payment_summary.wallet_amount_minor, order.currency)}</strong>
                  </div>
                  <div className="app__admin-orderMetric">
                    <span>Card</span>
                    <strong>{formatCurrencyMinor(order.payment_summary.card_amount_minor, order.currency)}</strong>
                  </div>
                </div>

                <div className="app__admin-actionsWrap">
                  <Link href={`/dashboard/${params.role}/orders/${order.id}` as Route} className="app__admin-primaryButton">
                    Open order
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 ? (
            <section className="app__admin-pagination">
              <span className="app__admin-inlineMeta">
                Page {response.page} of {totalPages}
              </span>
              <div className="app__admin-paginationActions">
                {response.page > 1 ? (
                  <Link href={buildPageHref(response.page - 1)} className="app__admin-secondaryButton">
                    Previous
                  </Link>
                ) : (
                  <span className="app__admin-secondaryButton app__admin-paginationButton is-disabled">Previous</span>
                )}
                {response.page < totalPages ? (
                  <Link href={buildPageHref(response.page + 1)} className="app__admin-primaryButton">
                    Next
                  </Link>
                ) : (
                  <span className="app__admin-primaryButton app__admin-paginationButton is-disabled">Next</span>
                )}
              </div>
            </section>
          ) : null}
        </section>
      )}
    </section>
  );
}

function normalizeOrderStatus(rawStatus?: string): OrderStatus | undefined {
  const normalized = rawStatus?.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  return ORDER_STATUS_OPTIONS.some((option) => option.value === normalized) ? (normalized as OrderStatus) : undefined;
}
