import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MealEditor } from "@/components/dashboard/meal-form";
import { fetchAdminMeal, fetchAdminMealMetadata } from "@/lib/api";

export default async function EditMealPage({
  params,
}: {
  params: { role: string; mealId: string };
}) {
  try {
    const [metadata, meal] = await Promise.all([
      fetchAdminMealMetadata(),
      fetchAdminMeal(params.mealId),
    ]);

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Meals</p>
            <h2 className="app__admin-groceriesTitle">Edit {meal.name}</h2>
            <p>Refine ingredient links, recipe-step mappings, pricing, and visual meal data.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={`/dashboard/${params.role}/meals/${meal.id}` as Route} className="app__admin-secondaryButton">
              Back to detail
            </Link>
          </div>
        </section>

        <MealEditor metadata={metadata} initialMeal={meal} role={params.role} />
      </section>
    );
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
