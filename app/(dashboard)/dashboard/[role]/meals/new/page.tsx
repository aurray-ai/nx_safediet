import type { Route } from "next";
import Link from "next/link";

import { CreateMealForm } from "@/components/dashboard/meal-form";
import { fetchAdminMealMetadata } from "@/lib/api";

export default async function NewMealPage({
  params,
}: {
  params: { role: string };
}) {
  const metadata = await fetchAdminMealMetadata();

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Meals</p>
          <h2 className="app__admin-groceriesTitle">Create meal</h2>
          <p>Add structured meal data, link ingredients to groceries, and prepare meals for planning.</p>
        </div>

        <div className="app__admin-groceriesActions">
          <Link href={`/dashboard/${params.role}/meals` as Route} className="app__admin-secondaryButton">
            Back to meals
          </Link>
        </div>
      </section>

      <CreateMealForm metadata={metadata} role={params.role} />
    </section>
  );
}
