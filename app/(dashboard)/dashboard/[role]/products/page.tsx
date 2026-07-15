import { ProductsCatalogManager } from "@/components/dashboard/products-catalog-manager";
import { fetchAdminProducts } from "@/lib/api";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { search?: string };
}) {
  const search = searchParams?.search?.trim() || "";
  const response = await fetchAdminProducts(search || undefined);
  const activeCount = response.items.filter((product) => product.is_active).length;

  return (
    <>
      <section className="app__admin-groceries">
        <ProductsCatalogManager
          items={response.items}
          total={response.total}
          activeCount={activeCount}
          role={params.role}
          search={search}
        />
      </section>
    </>
  );
}
