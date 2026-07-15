import { MealsCatalogManager } from "@/components/dashboard/meals-catalog-manager";
import { fetchAdminMealMetadata, fetchAdminMeals } from "@/lib/api";

export default async function MealsPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { search?: string };
}) {
  const search = searchParams?.search?.trim() || "";
  const [mealResponse, metadata] = await Promise.all([
    fetchAdminMeals(search || undefined),
    fetchAdminMealMetadata(),
  ]);
  const activeCount = mealResponse.items.filter((meal) => meal.is_active).length;

  return (
    <section className="app__admin-groceries">
      <MealsCatalogManager
        items={mealResponse.items}
        total={mealResponse.total}
        activeCount={activeCount}
        role={params.role}
        search={search}
        metadata={metadata}
      />
    </section>
  );
}
