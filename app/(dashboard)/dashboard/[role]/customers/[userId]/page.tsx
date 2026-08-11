import type { Route } from "next";
import Link from "next/link";

import { CancelSubscriptionButton } from "@/components/dashboard/cancel-subscription-button";
import { fetchAdminCustomer, fetchAdminCustomerAuditLog } from "@/lib/api";
import { formatCurrencyMinor, formatDate, formatLabel } from "@/lib/admin-format";

export default async function CustomerDetailPage({
  params,
}: {
  params: { role: string; userId: string };
}) {
  const [customer, auditLog] = await Promise.all([
    fetchAdminCustomer(params.userId),
    fetchAdminCustomerAuditLog(params.userId),
  ]);

  const { subscription, wallet } = customer;

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Customers</p>
          <h2 className="app__admin-groceriesTitle">{customer.name}</h2>
          <p>{customer.email}</p>
          <span className="app__admin-inlineMeta">Joined {formatDate(customer.created_at)}</span>
        </div>
      </section>

      <section className="app__admin-productSection">
        <h3>Subscription</h3>
        <div className="app__admin-dataRow app__admin-dataRow--stacked">
          <div className="app__admin-stack">
            <div className="app__admin-tagRow">
              <span className="app__admin-categoryPill">{formatLabel(subscription.plan_code)}</span>
              <span className="app__admin-tagPill">{formatLabel(subscription.status)}</span>
              <span className="app__admin-tagPill">Provider: {formatLabel(subscription.provider)}</span>
            </div>
            <span>
              {subscription.is_premium
                ? `${formatCurrencyMinor(subscription.price_minor, subscription.currency)} / period`
                : "No active paid subscription."}
            </span>
            {subscription.renewal_at ? (
              <span className="app__admin-inlineMeta">Renews {formatDate(subscription.renewal_at)}</span>
            ) : null}
          </div>

          {subscription.is_premium ? (
            <CancelSubscriptionButton userId={customer.id} provider={subscription.provider} />
          ) : null}
        </div>
      </section>

      <section className="app__admin-productSection">
        <h3>Wallet</h3>
        <div className="app__admin-dataRow app__admin-dataRow--stacked">
          <div className="app__admin-stack">
            <strong>{formatCurrencyMinor(wallet.available_balance_minor, wallet.currency)}</strong>
            <span className="app__admin-inlineMeta">Available balance</span>
          </div>
          <div className="app__admin-stack">
            <span>{formatCurrencyMinor(wallet.held_balance_minor, wallet.currency)}</span>
            <span className="app__admin-inlineMeta">Held</span>
          </div>
        </div>
      </section>

      <section className="app__admin-productSection">
        <h3>Recent orders</h3>
        {customer.recent_orders.length === 0 ? (
          <p className="app__admin-inlineMeta">No orders yet.</p>
        ) : (
          <div className="app__admin-dataList">
            {customer.recent_orders.map((order) => (
              <Link
                key={`${order.kind}-${order.id}`}
                href={
                  (order.kind === "grocery"
                    ? `/dashboard/${params.role}/orders/${order.id}`
                    : `/dashboard/${params.role}/meal-orders/${order.id}`) as Route
                }
                className="app__admin-dataRow app__admin-dataRow--stacked"
              >
                <div className="app__admin-stack">
                  <strong>{order.order_number}</strong>
                  <span className="app__admin-inlineMeta">
                    {formatLabel(order.kind)} order &middot; {formatLabel(order.status)}
                  </span>
                  <span className="app__admin-inlineMeta">{formatDate(order.created_at)}</span>
                </div>
                <span>{formatCurrencyMinor(order.total_minor, order.currency)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="app__admin-productSection">
        <h3>Admin activity log</h3>
        {auditLog.items.length === 0 ? (
          <p className="app__admin-inlineMeta">No admin actions on this account yet.</p>
        ) : (
          <div className="app__admin-dataList">
            {auditLog.items.map((entry, index) => (
              <div key={index} className="app__admin-dataRow app__admin-dataRow--stacked">
                <div className="app__admin-stack">
                  <strong>{formatLabel(entry.action)}</strong>
                  {typeof entry.details?.reason === "string" ? <span>{entry.details.reason}</span> : null}
                  <span className="app__admin-inlineMeta">{formatDate(entry.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
