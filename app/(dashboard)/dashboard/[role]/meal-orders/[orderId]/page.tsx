import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MealOrderAssignForm } from "@/components/dashboard/meal-order-assign-form";
import { fetchAdminChefs, fetchAdminMealOrder } from "@/lib/api";
import { formatCurrencyMinor, formatDate, formatLabel } from "@/lib/admin-format";

export default async function MealOrderDetailPage({
  params,
}: {
  params: { role: string; orderId: string };
}) {
  try {
    const [order, chefs] = await Promise.all([
      fetchAdminMealOrder(params.orderId),
      fetchAdminChefs({ pageSize: 200 }),
    ]);

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Meal orders</p>
            <h2 className="app__admin-groceriesTitle">{order.order_number}</h2>
            <p>Review order details, planned meals, and assign to a chef.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={`/dashboard/${params.role}/meal-orders` as Route} className="app__admin-secondaryButton">
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
                <span>Chef prep status</span>
                <strong>{order.assigned_worker_id ? formatLabel(order.fulfillment_status) : "Not started"}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Total</span>
                <strong>{formatCurrencyMinor(order.total_minor, order.currency)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>User</span>
                <strong>{order.user_id}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Created</span>
                <strong>{formatDate(order.created_at)}</strong>
              </div>
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Actions</p>
                <h2>Assign to chef</h2>
              </div>
            </div>

            <MealOrderAssignForm
              orderId={order.id}
              currentWorkerId={order.assigned_worker_id}
              workers={chefs.items}
            />
          </article>
        </section>

        <section className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Meals</p>
              <h2>Planned meals</h2>
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
                  <span>Unit: {formatCurrencyMinor(item.unit_price_minor, item.currency)}</span>
                  <span>Line total: {formatCurrencyMinor(item.line_total_minor, item.currency)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Timeline</p>
                <h2>Assignment history</h2>
              </div>
            </div>

            {order.assignment_history.length === 0 ? (
              <p className="app__admin-inlineMeta">No assignment activity yet.</p>
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
                      <span>{entry.actor_user_id ?? "system"}</span>
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
