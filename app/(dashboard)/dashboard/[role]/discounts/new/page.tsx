import type { Route } from "next";
import Link from "next/link";

import { CreateDiscountForm } from "@/components/dashboard/create-discount-form";

export default function NewDiscountPage({ params }: { params: { role: string } }) {
  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Discounts</p>
          <h2 className="app__admin-groceriesTitle">New discount</h2>
          <p>Give it a name and a percentage. You can tie products to it right after creating it.</p>
        </div>

        <div className="app__admin-groceriesActions">
          <Link href={`/dashboard/${params.role}/discounts` as Route} className="app__admin-secondaryButton">
            Back to discounts
          </Link>
        </div>
      </section>

      <section className="app__admin-productSection">
        <CreateDiscountForm role={params.role} />
      </section>
    </section>
  );
}
