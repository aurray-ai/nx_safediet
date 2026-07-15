import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusForm } from "@/components/dashboard/order-status-form";
import { RefundForm } from "@/components/dashboard/refund-form";
import { SubstitutionForm } from "@/components/dashboard/substitution-form";
import { fetchAdminOrder, fetchAdminOrderRefunds, fetchAdminProductsPage } from "@/lib/api";
import { formatCurrencyMinor, formatDate, formatLabel, formatNumber } from "@/lib/admin-format";

export default async function OrderDetailPage({
  params,
}: {
  params: { role: string; orderId: string };
}) {
  try {
    const [order, refunds, products] = await Promise.all([
      fetchAdminOrder(params.orderId),
      fetchAdminOrderRefunds(params.orderId),
      fetchAdminProductsPage({ page: 1, pageSize: 100 }),
    ]);

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Orders</p>
            <h2 className="app__admin-groceriesTitle">{order.order_number}</h2>
            <p>Order status, payment split, substitutions, and refunds.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={`/dashboard/${params.role}/orders` as Route} className="app__admin-secondaryButton">
              Back to orders
            </Link>
          </div>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Summary</p>
                <h2>Order overview</h2>
              </div>
            </div>

            <div className="app__admin-detailList">
              <div className="app__admin-detailRow">
                <span>Status</span>
                <strong>{formatLabel(order.status)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Total</span>
                <strong>{formatCurrencyMinor(order.pricing_summary.total_minor, order.currency)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Total weight</span>
                <strong>{formatNumber(order.pricing_summary.total_weight_grams)}g</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>User</span>
                <strong>{order.user_id}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Created</span>
                <strong>{formatDate(order.created_at)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Cancellation window</span>
                <strong>{formatDate(order.cancellation_window_expires_at)}</strong>
              </div>
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Actions</p>
                <h2>Status update</h2>
              </div>
            </div>

            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </article>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Payment</p>
                <h2>Payment split</h2>
              </div>
            </div>

            <div className="app__admin-detailList">
              <div className="app__admin-detailRow">
                <span>Wallet</span>
                <strong>{formatCurrencyMinor(order.payment_summary.wallet_amount_minor, order.currency)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Card</span>
                <strong>{formatCurrencyMinor(order.payment_summary.card_amount_minor, order.currency)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Total paid</span>
                <strong>{formatCurrencyMinor(order.payment_summary.total_paid_minor, order.currency)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Provider</span>
                <strong>{order.payment_summary.provider ?? "Wallet only"}</strong>
              </div>
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Refunds</p>
                <h2>Create refund</h2>
              </div>
            </div>

            <RefundForm orderId={order.id} items={order.items} />
          </article>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Address</p>
                <h2>Delivery snapshot</h2>
              </div>
            </div>

            <div className="app__admin-detailList">
              {Object.entries(order.address_snapshot).length === 0 ? (
                <p className="app__admin-inlineMeta">No address snapshot recorded.</p>
              ) : (
                Object.entries(order.address_snapshot).map(([key, value]) => (
                  <div key={key} className="app__admin-detailRow">
                    <span>{formatLabel(key)}</span>
                    <strong>{String(value ?? "Not set")}</strong>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Policy</p>
                <h2>Substitution policy</h2>
              </div>
            </div>

            <div className="app__admin-detailList">
              {Object.entries(order.substitution_policy).length === 0 ? (
                <p className="app__admin-inlineMeta">No substitution policy recorded.</p>
              ) : (
                Object.entries(order.substitution_policy).map(([key, value]) => (
                  <div key={key} className="app__admin-detailRow">
                    <span>{formatLabel(key)}</span>
                    <strong>{String(value ?? "Not set")}</strong>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Items</p>
              <h2>Purchased snapshots</h2>
            </div>
          </div>

          <div className="app__admin-dataList">
            {order.items.map((item) => (
              <article key={item.id} className="app__admin-dataRow app__admin-dataRow--stacked">
                <div className="app__admin-dataLead">
                  <div className="app__admin-productThumb app__admin-productThumb--small">
                    {item.img_url ? <img src={item.img_url} alt={item.product_name} /> : <div className="app__admin-fallback">{item.product_name.slice(0, 2).toUpperCase()}</div>}
                  </div>
                  <div className="app__admin-stack">
                    <strong>{item.product_name}</strong>
                    <span>{formatNumber(item.quantity)} x {item.unit_label}</span>
                    <div className="app__admin-tagRow">
                      <span className="app__admin-tagPill">{formatLabel(item.substitution_resolution)}</span>
                      <span className="app__admin-tagPill">{item.allow_substitutions ? "Substitutable" : "No substitutions"}</span>
                    </div>
                  </div>
                </div>

                <div className="app__admin-dataStats">
                  <span>Unit: {formatCurrencyMinor(item.unit_price_minor, item.currency)}</span>
                  <span>Line total: {formatCurrencyMinor(item.line_total_minor, item.currency)}</span>
                  <span>Weight: {formatNumber(item.unit_weight_grams)}g</span>
                </div>

                <SubstitutionForm orderId={order.id} item={item} productOptions={products.items} />
              </article>
            ))}
          </div>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Timeline</p>
                <h2>Status history</h2>
              </div>
            </div>

            <div className="app__admin-dataList">
              {order.status_history.map((entry, index) => (
                <article key={`${entry.status}-${entry.created_at}-${index}`} className="app__admin-dataRow">
                  <div className="app__admin-stack">
                    <strong>{formatLabel(entry.status)}</strong>
                    <span>{entry.note || "No note recorded."}</span>
                  </div>
                  <div className="app__admin-inlineMetaList">
                    <span>{formatDate(entry.created_at)}</span>
                    <span>{entry.actor_user_id ?? "system"}</span>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Refund history</p>
                <h2>Processed refunds</h2>
              </div>
            </div>

            {refunds.items.length === 0 ? (
              <p className="app__admin-inlineMeta">No refunds recorded yet.</p>
            ) : (
              <div className="app__admin-dataList">
                {refunds.items.map((refund) => (
                  <article key={refund.id} className="app__admin-dataRow">
                    <div className="app__admin-stack">
                      <strong>{formatLabel(refund.refund_type)} refund</strong>
                      <span>{refund.reason}</span>
                    </div>
                    <div className="app__admin-inlineMetaList">
                      <span>Wallet: {formatCurrencyMinor(refund.wallet_refund_minor, refund.currency)}</span>
                      <span>Card: {formatCurrencyMinor(refund.card_refund_minor, refund.currency)}</span>
                      <span>{formatDate(refund.created_at)}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>
        </section>
      </section>
    );
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
