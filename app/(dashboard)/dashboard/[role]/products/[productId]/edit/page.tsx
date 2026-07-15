import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductEditor } from "@/components/dashboard/product-editor";
import { fetchAdminMetadata, fetchAdminProduct } from "@/lib/api";

export default async function EditProductPage({
  params,
}: {
  params: { role: string; productId: string };
}) {
  try {
    const [metadata, product] = await Promise.all([
      fetchAdminMetadata(),
      fetchAdminProduct(params.productId),
    ]);

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Groceries</p>
            <h2 className="app__admin-groceriesTitle">Edit {product.product}</h2>
            <p>Update product details, pricing, category, tags, and nutrition.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link
              href={`/dashboard/${params.role}/products/${product.id}` as Route}
              className="app__admin-secondaryButton"
            >
              Back to detail
            </Link>
          </div>
        </section>

        <ProductEditor metadata={metadata} initialProduct={product} role={params.role} />
      </section>
    );
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
