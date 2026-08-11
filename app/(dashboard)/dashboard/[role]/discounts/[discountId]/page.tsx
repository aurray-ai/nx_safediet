import type { Route } from "next";
import Link from "next/link";

import { DeleteDiscountButton } from "@/components/dashboard/delete-discount-button";
import { DiscountActivityLog } from "@/components/dashboard/discount-activity-log";
import { DiscountProductPicker } from "@/components/dashboard/discount-product-picker";
import { DiscountTiedProducts } from "@/components/dashboard/discount-tied-products";
import { EditDiscountForm } from "@/components/dashboard/edit-discount-form";
import {
  fetchAdminDiscount,
  fetchAdminDiscountAuditLog,
  fetchAdminDiscountProducts,
  fetchAdminMetadata,
} from "@/lib/api";

const PRODUCT_PREVIEW_SIZE = 5;

export default async function DiscountDetailPage({
  params,
}: {
  params: { role: string; discountId: string };
}) {
  const [discount, productsResponse, auditLog, metadata] = await Promise.all([
    fetchAdminDiscount(params.discountId),
    fetchAdminDiscountProducts(params.discountId, { page: 1, pageSize: PRODUCT_PREVIEW_SIZE }),
    fetchAdminDiscountAuditLog(params.discountId),
    fetchAdminMetadata(),
  ]);

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Discounts</p>
          <h2 className="app__admin-groceriesTitle">{discount.label}</h2>
          <p>
            {discount.percent}% off &middot; {discount.product_count}{" "}
            {discount.product_count === 1 ? "product" : "products"} tied to this discount
          </p>
        </div>

        <div className="app__admin-groceriesActions">
          <Link href={`/dashboard/${params.role}/discounts` as Route} className="app__admin-secondaryButton">
            Back to discounts
          </Link>
        </div>
      </section>

      <section className="app__admin-productSection">
        <h3>1. Edit discount</h3>
        <EditDiscountForm discountId={discount.id} label={discount.label} percent={discount.percent} />
        <DeleteDiscountButton
          discountId={discount.id}
          discountLabel={discount.label}
          productCount={discount.product_count}
          role={params.role}
        />
      </section>

      <section className="app__admin-productSection">
        <h3>2. Products in this discount</h3>
        <DiscountTiedProducts
          discountId={discount.id}
          initialProducts={productsResponse.items}
          total={productsResponse.total}
        />
      </section>

      <section className="app__admin-productSection">
        <h3>3. Add products</h3>
        <DiscountProductPicker discountId={discount.id} categories={metadata.categories} />
      </section>

      <section className="app__admin-productSection">
        <h3>4. Activity log</h3>
        <DiscountActivityLog entries={auditLog.items} />
      </section>
    </section>
  );
}
