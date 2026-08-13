import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChefPrepStatusForm } from "@/components/dashboard/chef-prep-status-form";
import { DeclineOrderForm } from "@/components/dashboard/decline-order-form";
import { ShopperStatusForm } from "@/components/dashboard/shopper-status-form";
import { fetchChefMealOrder, fetchShopperGroceryOrder } from "@/lib/api";
import { formatCurrencyMinor, formatDate, formatLabel, formatNumber } from "@/lib/admin-format";

export default async function MyOrderDetailPage({
  params,
}: {
  params: { role: string; orderId: string };
}) {
  const isChef = params.role === "chef";

  try {
    if (isChef) {
      const order = await fetchChefMealOrder(params.orderId);

      return (
        <section className="app__admin-groceries">
          <section className="app__admin-groceriesHeader">
            <div>
              <p className="app__admin-eyebrow">My orders</p>
              <h2 className="app__admin-groceriesTitle">{order.order_number}</h2>
              <p>Review the order details and update your status as you work.</p>
            </div>

            <div className="app__admin-groceriesActions">
              <Link href={"/dashboard/chef/my-orders" as Route} className="app__admin-secondaryButton">
                Back to my orders
              </Link>
            </div>
          </section>

          <section className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Delivery details</p>
                <h2>Meals to prepare</h2>
              </div>
            </div>

            <div className="app__admin-dataList">
              {order.items.map((item) => (
                <article key={item.id} className="app__admin-dataRow app__admin-dataRow--stacked">
                  <div className="app__admin-dataLead">
                    <div className="app__admin-productThumb app__admin-productThumb--small">
                      {item.img_url ? (
                        <img src={item.img_url} alt={item.meal_name} />
                      ) : (
                        <div className="app__admin-fallback">{item.meal_name.slice(0, 2).toUpperCase()}</div>
                      )}
                    </div>
                    <div className="app__admin-stack">
                      <strong>{item.meal_name}</strong>
                      <span>Servings: {item.servings}</span>
                      <div className="app__admin-tagRow">
                        {item.slot ? <span className="app__admin-tagPill">{formatLabel(item.slot)}</span> : null}
                        {item.delivery_date ? <span className="app__admin-tagPill">{item.delivery_date}</span> : null}
                      </div>
                    </div>
                  </div>
                  <div className="app__admin-dataStats">
                    <span>Line total: {formatCurrencyMinor(item.line_total_minor, item.currency)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Actions</p>
                <h2>Update status</h2>
              </div>
            </div>

            <ChefPrepStatusForm orderId={order.id} currentStatus={order.fulfillment_status} />

            <DeclineOrderForm orderId={order.id} declineEndpoint={`/api/chef/orders/${order.id}/decline`} />
          </section>

          <section className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Timeline</p>
                <h2>Status history</h2>
              </div>
            </div>

            {order.assignment_history.length === 0 ? (
              <p className="app__admin-inlineMeta">No activity yet.</p>
            ) : (
              <div className="app__admin-dataList">
                {order.assignment_history.map((entry, index) => (
                  <article key={`${entry.action}-${entry.created_at}-${index}`} className="app__admin-dataRow">
                    <div className="app__admin-stack">
                      <strong>{formatLabel(entry.action)}</strong>
                      <span>{entry.note || "No note recorded."}</span>
                    </div>
                    <div className="app__admin-inlineMetaList">
                      <span>{formatDate(entry.created_at)}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      );
    }

    const order = await fetchShopperGroceryOrder(params.orderId);

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">My orders</p>
            <h2 className="app__admin-groceriesTitle">{order.order_number}</h2>
            <p>Review the order details and update your status as you shop.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={"/dashboard/shopper/my-orders" as Route} className="app__admin-secondaryButton">
              Back to my orders
            </Link>
          </div>
        </section>

        <section className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Shopping list</p>
              <h2>{order.items.length} items to collect</h2>
            </div>
          </div>

          <div className="app__admin-dataList">
            {order.items.map((item) => (
              <article key={item.id} className="app__admin-shopperItemCard">
                <div className="app__admin-dataLead">
                  <div className="app__admin-productThumb app__admin-productThumb--small">
                    {item.img_url ? (
                      <img src={item.img_url} alt={item.product_name} />
                    ) : (
                      <div className="app__admin-fallback">{item.product_name.slice(0, 2).toUpperCase()}</div>
                    )}
                  </div>

                  <div className="app__admin-stack">
                    <div className="app__admin-productCardTop">
                      <strong>{item.product_name}</strong>
                      {item.source_meal_id ? <span className="app__admin-categoryPill">Meal plan</span> : null}
                    </div>

                    <span className="app__admin-inlineMeta">Reference: {item.product_id}</span>

                    <div className="app__admin-tagRow">
                      <span className="app__admin-tagPill">
                        {item.quantity} x {item.unit_label}
                      </span>
                      {item.unit_weight_grams > 0 ? (
                        <span className="app__admin-tagPill">{formatNumber(item.unit_weight_grams)}g each</span>
                      ) : null}
                      <span className="app__admin-tagPill">
                        {item.allow_substitutions ? "Substitutions allowed" : "No substitutions"}
                      </span>
                      {item.substitution_resolution !== "none" ? (
                        <span className="app__admin-tagPill">{formatLabel(item.substitution_resolution)}</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="app__admin-shopperItemSummary">
                  <div className="app__admin-teamMetric">
                    <span>Unit price</span>
                    <strong>{formatCurrencyMinor(item.unit_price_minor, item.currency)}</strong>
                  </div>
                  <div className="app__admin-teamMetric">
                    <span>Line total</span>
                    <strong>{formatCurrencyMinor(item.line_total_minor, item.currency)}</strong>
                  </div>
                  {item.substituted_product_id ? (
                    <div className="app__admin-teamMetric">
                      <span>Replacement</span>
                      <strong>{item.substituted_product_id}</strong>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Actions</p>
              <h2>Update status</h2>
            </div>
          </div>

          <ShopperStatusForm orderId={order.id} orderNumber={order.order_number} currentStatus={order.fulfillment_status} />

          <DeclineOrderForm orderId={order.id} declineEndpoint={`/api/shopper/orders/${order.id}/decline`} />
        </section>

        <section className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Timeline</p>
              <h2>Status history</h2>
            </div>
          </div>

          {order.assignment_history.length === 0 ? (
            <p className="app__admin-inlineMeta">No activity yet.</p>
          ) : (
            <div className="app__admin-dataList">
              {order.assignment_history.map((entry, index) => (
                <article key={`${entry.action}-${entry.created_at}-${index}`} className="app__admin-dataRow">
                  <div className="app__admin-stack">
                    <strong>{formatLabel(entry.action)}</strong>
                    <span>{entry.note || "No note recorded."}</span>
                  </div>
                  <div className="app__admin-inlineMetaList">
                    <span>{formatDate(entry.created_at)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
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
