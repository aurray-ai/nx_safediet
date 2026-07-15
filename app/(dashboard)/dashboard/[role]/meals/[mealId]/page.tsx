import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteMealButton } from "@/components/dashboard/delete-meal-button";
import { fetchAdminMeal, fetchAdminMealMetadata } from "@/lib/api";
import { formatDate, formatLabel, formatNumber } from "@/lib/admin-format";

function compactList(values: string[]) {
  return values.length ? values.map(formatLabel).join(", ") : "Not set";
}

export default async function MealDetailPage({
  params,
}: {
  params: { role: string; mealId: string };
}) {
  try {
    const [metadata, meal] = await Promise.all([
      fetchAdminMealMetadata(),
      fetchAdminMeal(params.mealId),
    ]);

    const categoryMap = new Map(metadata.categories.map((category) => [category.id, category.name]));
    const typeLabel =
      metadata.meal_types.find((type) => type.value === meal.meal_type)?.display_name ?? formatLabel(meal.meal_type);
    const difficultyLabel =
      metadata.difficulties.find((difficulty) => difficulty.value === meal.difficulty)?.display_name ??
      formatLabel(meal.difficulty);
    const totalTime = meal.prep_time_minutes + meal.cook_time_minutes;

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Meals</p>
            <h2 className="app__admin-groceriesTitle">{meal.name}</h2>
            <p>{meal.description || "No description yet."}</p>
          </div>

          <div className="app__admin-actionsWrap">
            <Link
              href={`/dashboard/${params.role}/meals/${meal.id}/edit` as Route}
              className="app__admin-primaryButton"
            >
              Edit meal
            </Link>
            <Link href={`/dashboard/${params.role}/meals` as Route} className="app__admin-secondaryButton">
              Back to meals
            </Link>
            <DeleteMealButton mealId={meal.id} mealName={meal.name} role={params.role} />
          </div>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-productDetailHero">
              <div className="app__admin-detailThumb">
                {meal.hero_image_url ? (
                  <img src={meal.hero_image_url} alt={meal.name} />
                ) : (
                  <div className="app__admin-fallback">{meal.name.slice(0, 2).toUpperCase()}</div>
                )}
              </div>

              <div className="app__admin-stack">
                <div className="app__admin-productCardTop">
                  <span className="app__admin-categoryPill">{typeLabel}</span>
                  <span className={`app__admin-statusPill ${meal.is_active ? "" : "is-inactive"}`}>
                    {meal.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="app__admin-tagRow">
                  {meal.category_ids.map((categoryId) => (
                    <span key={categoryId} className="app__admin-tagPill">
                      {categoryMap.get(categoryId) ?? categoryId}
                    </span>
                  ))}
                  {meal.culture_tags.map((tag) => (
                    <span key={tag} className="app__admin-tagPill is-culture">
                      {formatLabel(tag)}
                    </span>
                  ))}
                </div>

                <div className="app__admin-inlineMetaList">
                  <span>Meal ID: {meal.id}</span>
                  <span>Updated: {formatDate(meal.updated_at)}</span>
                  <span>Created: {formatDate(meal.created_at)}</span>
                </div>
              </div>
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Overview</p>
                <h2>Meal details</h2>
              </div>
            </div>

            <div className="app__admin-detailList">
              <div className="app__admin-detailRow">
                <span>Meal type</span>
                <strong>{typeLabel}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Difficulty</span>
                <strong>{difficultyLabel}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Total time</span>
                <strong>{formatNumber(totalTime)} min</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Servings</span>
                <strong>{formatNumber(meal.servings)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Linked products</span>
                <strong>{formatNumber(meal.linked_product_ids.length)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Chef available</span>
                <strong>{meal.chef_available ? "Yes" : "No"}</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Diet and culture</p>
                <h2>Targeting details</h2>
              </div>
            </div>

            <div className="app__admin-detailList">
              <div className="app__admin-detailRow">
                <span>Culture tags</span>
                <strong>{compactList(meal.culture_tags)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Diet rules</span>
                <strong>{compactList(meal.diet_rules_supported)}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Allergy exclusions</span>
                <strong>{compactList(meal.allergy_exclusions)}</strong>
              </div>
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Nutrition</p>
                <h2>Macro profile</h2>
              </div>
            </div>

            <div className="app__admin-inlineGrid app__admin-inlineGrid--mealNutrition">
              <div className="app__admin-productStat">
                <strong>{formatNumber(meal.nutrition_summary.calories)}</strong>
                <span>Calories</span>
              </div>
              <div className="app__admin-productStat">
                <strong>{formatNumber(meal.nutrition_summary.protein_g)}g</strong>
                <span>Protein</span>
              </div>
              <div className="app__admin-productStat">
                <strong>{formatNumber(meal.nutrition_summary.carbs_g)}g</strong>
                <span>Carbs</span>
              </div>
              <div className="app__admin-productStat">
                <strong>{formatNumber(meal.nutrition_summary.fat_g)}g</strong>
                <span>Fat</span>
              </div>
            </div>
          </article>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Costs</p>
                <h2>Estimated pricing</h2>
              </div>
            </div>

            <div className="app__admin-stack">
              {meal.estimated_costs.map((cost, index) => (
                <div key={`${cost.country_code}-${index}`} className="app__admin-productStat">
                  <strong>
                    {cost.currency_code} {cost.amount}
                  </strong>
                  <span>{cost.country_code}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Gallery</p>
                <h2>Meal imagery</h2>
              </div>
            </div>

            <div className="app__admin-mealImageGrid">
              {meal.image_urls.map((url, index) => (
                <div key={url} className="app__admin-mealImageCard">
                  <div className="app__admin-mealImageFrame">
                    <img src={url} alt={`${meal.name} image ${index + 1}`} />
                  </div>
                  <div className="app__admin-mealImageActions">
                    <span className="app__admin-categoryPill">{index === 0 ? "Primary" : `Image ${index + 1}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Ingredients</p>
                <h2>Ingredient list</h2>
              </div>
            </div>

            <div className="app__admin-detailList">
              {meal.ingredient_items.length === 0 ? (
                <p className="app__admin-inlineMeta">No ingredients recorded yet.</p>
              ) : (
                meal.ingredient_items.map((ingredient) => (
                  <div key={ingredient.id} className="app__admin-detailRow app__admin-detailRow--stacked">
                    <div className="app__admin-stack">
                      <strong>{ingredient.name}</strong>
                      <span className="app__admin-inlineMeta">
                        {formatNumber(ingredient.quantity)} {ingredient.unit}
                        {ingredient.optional ? " · Optional" : ""}
                      </span>
                      <span className="app__admin-inlineMeta">
                        Linked products: {ingredient.linked_product_ids.length}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Recipe</p>
                <h2>Cooking steps</h2>
              </div>
            </div>

            <div className="app__admin-stack">
              {meal.recipe_step_items.length === 0 ? (
                <p className="app__admin-inlineMeta">No recipe steps recorded yet.</p>
              ) : (
                meal.recipe_step_items.map((step, index) => (
                  <div key={`${index}-${step.instruction}`} className="app__admin-recipeStepEditor">
                    <div className="app__admin-recipeStepHeader">
                      <div className="app__admin-stepIndex">{index + 1}</div>
                      <div className="app__admin-stack">
                        <strong>Step {index + 1}</strong>
                        <span className="app__admin-inlineMeta">{step.instruction}</span>
                      </div>
                    </div>
                    {step.image_url ? (
                      <div className="app__admin-mealImageFrame">
                        <img src={step.image_url} alt={`Step ${index + 1}`} />
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </section>
    );
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
