import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ShopperPickingSheet } from "@/components/dashboard/shopper-picking-sheet";
import { fetchShopperGroceryOrder } from "@/lib/api";

export default async function ShopperPickingPage({
  params,
}: {
  params: { role: string; orderId: string };
}) {
  if (params.role !== "shopper") {
    notFound();
  }

  try {
    const order = await fetchShopperGroceryOrder(params.orderId);

    if (order.fulfillment_status !== "shopping") {
      return (
        <section className="app__admin-groceries">
          <section className="app__admin-groceriesHeader">
            <div>
              <p className="app__admin-eyebrow">Picking sheet</p>
              <h2 className="app__admin-groceriesTitle">{order.order_number}</h2>
              <p>Start the shopping workflow first before using the picking checklist.</p>
            </div>

            <div className="app__admin-groceriesActions">
              <Link href={`/dashboard/shopper/my-orders/${order.id}` as Route} className="app__admin-secondaryButton">
                Back to order
              </Link>
            </div>
          </section>
        </section>
      );
    }

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Picking sheet</p>
            <h2 className="app__admin-groceriesTitle">{order.order_number}</h2>
            <p>Use this live checklist while you collect the order.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={`/dashboard/shopper/my-orders/${order.id}` as Route} className="app__admin-secondaryButton">
              Back to order
            </Link>
          </div>
        </section>

        <section className="app__admin-productSection app__admin-productSection--compact">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Items</p>
              <h2>{order.items.length} items to pick</h2>
            </div>
          </div>

          <ShopperPickingSheet orderId={order.id} items={order.items} />
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
