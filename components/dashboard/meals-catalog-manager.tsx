"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { formatLabel } from "@/lib/admin-format";
import type { AdminMeal, AdminMealBulkDeleteResponse, AdminMealMetadata } from "@/lib/types";

type MealsCatalogManagerProps = {
  items: AdminMeal[];
  total: number;
  activeCount: number;
  role: string;
  search: string;
  metadata: AdminMealMetadata;
};

export function MealsCatalogManager({
  items,
  total,
  activeCount,
  role,
  search,
  metadata,
}: MealsCatalogManagerProps) {
  const router = useRouter();
  const [selectedMealIds, setSelectedMealIds] = useState<string[]>([]);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categoryMap = useMemo(
    () => new Map(metadata.categories.map((category) => [category.id, category.name])),
    [metadata.categories],
  );
  const typeMap = useMemo(
    () => new Map(metadata.meal_types.map((type) => [type.value, type.display_name])),
    [metadata.meal_types],
  );
  const averagePrepWindowMinutes = items.length
    ? Math.round(items.reduce((totalMinutes, meal) => totalMinutes + meal.prep_time_minutes + meal.cook_time_minutes, 0) / items.length)
    : 0;
  const allVisibleSelected = useMemo(
    () => items.length > 0 && items.every((meal) => selectedMealIds.includes(meal.id)),
    [items, selectedMealIds],
  );

  function toggleSelection(mealId: string) {
    setErrorMessage(null);
    setSelectedMealIds((current) =>
      current.includes(mealId) ? current.filter((item) => item !== mealId) : [...current, mealId],
    );
  }

  function toggleSelectAllVisible() {
    setErrorMessage(null);
    setSelectedMealIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !items.some((meal) => meal.id === id));
      }

      const merged = new Set(current);
      for (const meal of items) {
        merged.add(meal.id);
      }
      return Array.from(merged);
    });
  }

  async function handleDeleteSelected() {
    if (selectedMealIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedMealIds.length} selected meal${selectedMealIds.length === 1 ? "" : "s"}?`,
    );
    if (!confirmed) {
      return;
    }

    setIsDeletingSelected(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/meals/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meal_ids: selectedMealIds }),
      });

      const payload = (await response.json().catch(() => null)) as
        | ({ detail?: string } & Partial<AdminMealBulkDeleteResponse>)
        | null;

      if (!response.ok) {
        throw new Error(payload?.detail ?? "Unable to delete selected meals.");
      }

      const deletedIds = payload?.deleted_meal_ids ?? selectedMealIds;
      const missingIds = payload?.missing_meal_ids ?? [];
      setSelectedMealIds((current) => current.filter((id) => !deletedIds.includes(id)));

      if (missingIds.length > 0) {
        setErrorMessage(`${deletedIds.length} deleted. ${missingIds.length} already missing and were skipped.`);
      }

      router.refresh();
    } catch (deleteError) {
      setErrorMessage(deleteError instanceof Error ? deleteError.message : "Unable to delete selected meals.");
    } finally {
      setIsDeletingSelected(false);
    }
  }

  return (
    <>
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Meals</p>
          <h2 className="app__admin-groceriesTitle">Meal management</h2>
          <p>Structured meals for planning, reuse, and grocery-linked meal operations.</p>
        </div>

        <div className="app__admin-groceriesActions">
          <span className="app__admin-inlineMeta">{total} items</span>
          {selectedMealIds.length > 0 ? (
            <>
              <button
                type="button"
                className="app__admin-secondaryButton"
                onClick={() => setSelectedMealIds([])}
                disabled={isDeletingSelected}
              >
                Clear selection
              </button>
              <button
                type="button"
                className="app__admin-ghostButton app__admin-dangerButton"
                onClick={handleDeleteSelected}
                disabled={isDeletingSelected}
              >
                {isDeletingSelected ? "Deleting..." : `Delete selected (${selectedMealIds.length})`}
              </button>
            </>
          ) : null}
          <Link href={`/dashboard/${role}/meals/new` as Route} className="app__admin-primaryButton">
            Add meal
          </Link>
        </div>
      </section>

      <section className="app__admin-summaryGrid">
        <article className="app__admin-productStat">
          <strong>{total}</strong>
          <span>Total meals</span>
        </article>
        <article className="app__admin-productStat">
          <strong>{activeCount}</strong>
          <span>Active in catalog</span>
        </article>
        <article className="app__admin-productStat">
          <strong>{metadata.categories.length}</strong>
          <span>Meal categories</span>
        </article>
        <article className="app__admin-productStat">
          <strong>{averagePrepWindowMinutes} min</strong>
          <span>Average prep window</span>
        </article>
      </section>

      <section className="app__admin-groceriesPanel">
        <form className="app__admin-groceriesSearch" action={`/dashboard/${role}/meals`}>
          <label className="app__admin-field">
            <span>Search</span>
            <input
              name="search"
              defaultValue={search}
              placeholder="Search meals"
              className="app__admin-input"
            />
          </label>
          <div className="app__admin-field">
            <span>Status</span>
            <input className="app__admin-input" value={`${activeCount} active`} readOnly />
          </div>
          <button type="submit" className="app__admin-filterButton">
            Search
          </button>
        </form>

        {items.length > 0 ? (
          <div className="app__admin-selectionToolbar">
            <label className="app__admin-checkbox app__admin-checkbox--inline">
              <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAllVisible} />
              <span>{allVisibleSelected ? "Clear visible selection" : "Select all visible"}</span>
            </label>
            <span className="app__admin-inlineMeta">{selectedMealIds.length} selected</span>
          </div>
        ) : null}

        {errorMessage ? <p className="app__admin-formError">{errorMessage}</p> : null}
      </section>

      {items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No meals</p>
          <h2>No meals found</h2>
          <p>Try another search term or create the first meal for the catalog.</p>
        </section>
      ) : (
        <section className="app__admin-mealCatalogGrid">
          {items.map((meal) => {
            const estimate = meal.estimated_costs[0];
            const typeLabel = typeMap.get(meal.meal_type) ?? formatLabel(meal.meal_type);
            const visibleTags = [
              ...meal.category_ids.slice(0, 2).map((categoryId) => categoryMap.get(categoryId) ?? categoryId),
              ...meal.culture_tags.slice(0, 1).map((culture) => formatLabel(culture)),
              ...meal.diet_rules_supported.slice(0, 1).map((rule) => formatLabel(rule)),
            ];
            const isSelected = selectedMealIds.includes(meal.id);

            return (
              <article
                key={meal.id}
                className={`app__admin-mealCard app__admin-mealCardSelectable ${isSelected ? "is-selected" : ""}`}
              >
                <div className="app__admin-productCardSelection">
                  <label className="app__admin-checkbox app__admin-checkbox--inline">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelection(meal.id)} />
                  </label>
                </div>

                <Link href={`/dashboard/${role}/meals/${meal.id}` as Route} className="app__admin-mealCardLink">
                  <div
                    className="app__admin-mealCardHero"
                    style={
                      meal.hero_image_url
                        ? {
                            backgroundImage: `linear-gradient(180deg, rgba(23,17,13,0.06) 0%, rgba(23,17,13,0.24) 100%), url("${meal.hero_image_url}")`,
                          }
                        : undefined
                    }
                  >
                    <div className="app__admin-mealCardHeroBadge">
                      <span className="app__admin-categoryPill">{typeLabel}</span>
                      <span className={`app__admin-statusPill ${meal.is_active ? "" : "is-inactive"}`}>
                        {meal.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {!meal.hero_image_url ? (
                      <div className="app__admin-mealCardFallback">{meal.name.slice(0, 2).toUpperCase()}</div>
                    ) : null}
                  </div>

                  <div className="app__admin-mealCardBody">
                    <div className="app__admin-mealCardIntro">
                      <h3 className="app__admin-productName">{meal.name}</h3>
                      <p>{meal.description || "No description yet."}</p>
                    </div>

                    <div className="app__admin-mealCardStats">
                      <div className="app__admin-mealCardStat">
                        <strong>{meal.prep_time_minutes + meal.cook_time_minutes} min</strong>
                        <span>Total time</span>
                      </div>
                      <div className="app__admin-mealCardStat">
                        <strong>{meal.servings}</strong>
                        <span>Servings</span>
                      </div>
                      <div className="app__admin-mealCardStat">
                        <strong>{estimate ? `${estimate.currency_code} ${estimate.amount}` : "Pending"}</strong>
                        <span>Primary cost</span>
                      </div>
                    </div>

                    <div className="app__admin-tagRow">
                      {visibleTags.map((tag) => (
                        <span key={`${meal.id}-${tag}`} className="app__admin-tagPill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}
