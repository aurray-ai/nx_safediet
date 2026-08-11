import type { Route } from "next";
import Link from "next/link";

import { fetchAdminDiscounts } from "@/lib/api";
import { formatDate } from "@/lib/admin-format";

export default async function DiscountsPage({ params }: { params: { role: string } }) {
  const response = await fetchAdminDiscounts();

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Groceries</p>
          <h2 className="app__admin-groceriesTitle">Discounts</h2>
          <p>Create a discount tier, then tie individual products to it. Members see the discounted price on any product assigned to a discount.</p>
        </div>

        <div className="app__admin-groceriesActions">
          <Link href={`/dashboard/${params.role}/discounts/new` as Route} className="app__admin-primaryButton">
            New discount
          </Link>
        </div>
      </section>

      {response.items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No discounts</p>
          <h2>Create your first discount tier</h2>
          <p>Click &ldquo;New discount&rdquo; to get started.</p>
        </section>
      ) : (
        <section className="app__admin-productSection">
          <div className="app__admin-dataList">
            {response.items.map((discount) => (
              <Link
                key={discount.id}
                href={`/dashboard/${params.role}/discounts/${discount.id}` as Route}
                className="app__admin-dataRow app__admin-dataRow--stacked app__admin-dataRow--withChevron"
              >
                <div className="app__admin-stack">
                  <strong>{discount.label}</strong>
                  <div className="app__admin-tagRow">
                    <span className="app__admin-categoryPill">{discount.percent}% off</span>
                    <span className="app__admin-tagPill">
                      {discount.product_count} {discount.product_count === 1 ? "product" : "products"}
                    </span>
                  </div>
                  <span className="app__admin-inlineMeta">Updated {formatDate(discount.updated_at)}</span>
                </div>
                <svg
                  className="app__admin-dataRowChevron"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
