import { ProductsCatalogManager } from "@/components/dashboard/products-catalog-manager";
import { fetchAdminProductsPage } from "@/lib/api";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { search?: string; page?: string };
}) {
  const search = searchParams?.search?.trim() || "";
  const rawPage = Number(searchParams?.page ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const response = await fetchAdminProductsPage({
    search: search || undefined,
    page,
    pageSize: 24,
  });
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
          page={response.page}
          pageSize={response.page_size}
        />
      </section>
    </>
  );
}
