import type { Route } from "next";
import Link from "next/link";

import { CreateProductForm } from "@/components/dashboard/product-form";
import { fetchAdminMetadata } from "@/lib/api";

export default async function NewProductPage({
  params,
}: {
  params: { role: string };
}) {
  const metadata = await fetchAdminMetadata();

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Groceries</p>
          <h2 className="app__admin-groceriesTitle">Create product</h2>
          <p>Add a new grocery item, upload imagery, and configure market pricing from one form.</p>
        </div>

        <div className="app__admin-groceriesActions">
          <Link href={`/dashboard/${params.role}/products` as Route} className="app__admin-secondaryButton">
            Back to products
          </Link>
        </div>
      </section>

      <CreateProductForm metadata={metadata} role={params.role} />
    </section>
  );
}
