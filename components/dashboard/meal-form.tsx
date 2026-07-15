"use client";

import { type ChangeEvent, type Dispatch, type FormEvent, type SetStateAction, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  AdminMeal,
  AdminMealCreatePayload,
  AdminMealMetadata,
  AdminMealPayload,
  AdminMealRecipeStep,
  AdminMealUploadResponse,
  MealEstimatedCost,
  MealIngredient,
  MealNutritionSummary,
} from "@/lib/types";

type MealFormProps = {
  metadata: AdminMealMetadata;
  role: string;
  mode: "create" | "edit";
  initialMeal?: AdminMeal;
};

type ProductSearchOption = {
  id: string;
  name: string;
  img_url: string;
};

function emptyEstimatedCost(): MealEstimatedCost {
  return {
    country_code: "NG",
    currency_code: "NGN",
    amount: 0,
  };
}

function createIngredientId() {
  return `ingredient_${crypto.randomUUID().replaceAll("-", "").slice(0, 10)}`;
}

function emptyIngredient(): MealIngredient {
  return {
    id: createIngredientId(),
    name: "",
    quantity: 0,
    unit: "g",
    optional: false,
    linked_product_ids: [],
  };
}

function emptyRecipeStep(): AdminMealRecipeStep {
  return {
    instruction: "",
    ingredient_ids: [],
    image_url: null,
  };
}

async function parseJsonResponse(response: Response) {
  const raw = await response.text();
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as { detail?: string; id?: string };
  } catch {
    return { detail: raw };
  }
}

async function uploadMealAssets(files: File[], folder: string): Promise<string[]> {
  const formData = new FormData();
  formData.append("folder", folder);
  files.forEach((file) => formData.append("files", file));

  const response = await fetch("/api/admin/meals/uploads", {
    method: "POST",
    body: formData,
  });
  const payload = (await parseJsonResponse(response)) as AdminMealUploadResponse & { detail?: string };
  if (!response.ok) {
    throw new Error(payload.detail ?? "Unable to upload images.");
  }
  return payload.items.map((item) => item.url);
}

async function searchAdminProducts(search: string): Promise<ProductSearchOption[]> {
  const params = new URLSearchParams({ page_size: "8" });
  const normalizedSearch = search.trim();
  if (normalizedSearch) {
    params.set("search", normalizedSearch);
  }

  const response = await fetch(`/api/admin/products?${params.toString()}`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as {
    items?: Array<{ id: string; product: string; img_url: string }>;
    detail?: string;
  };
  if (!response.ok) {
    throw new Error(payload.detail ?? "Unable to search products.");
  }

  return (payload.items ?? []).map((item) => ({
    id: item.id,
    name: item.product,
    img_url: item.img_url,
  }));
}

type IngredientProductPickerProps = {
  ingredient: MealIngredient;
  knownProducts: Record<string, ProductSearchOption>;
  onToggleProduct: (productId: string) => void;
  onHydrateProducts: Dispatch<SetStateAction<Record<string, ProductSearchOption>>>;
};

function IngredientProductPicker({
  ingredient,
  knownProducts,
  onToggleProduct,
  onHydrateProducts,
}: IngredientProductPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSearchOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setSearchError(null);
      setIsLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setSearchError(null);

      try {
        const items = await searchAdminProducts(trimmedQuery);
        setResults(items);
        onHydrateProducts((current) => ({
          ...current,
          ...Object.fromEntries(items.map((item) => [item.id, item])),
        }));
      } catch (error) {
        setResults([]);
        setSearchError(error instanceof Error ? error.message : "Unable to search products.");
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [onHydrateProducts, query]);

  return (
    <div className="app__admin-productSearchStack">
      <label className="app__admin-field app__admin-field--full">
        <span>Linked products</span>
        <input
          className="app__admin-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search product catalog"
        />
      </label>

      {ingredient.linked_product_ids.length ? (
        <div className="app__admin-productChipList">
          {ingredient.linked_product_ids.map((productId) => {
            const product = knownProducts[productId];
            return (
              <button
                key={productId}
                type="button"
                className="app__admin-productChip"
                onClick={() => onToggleProduct(productId)}
              >
                <span>{product?.name ?? productId}</span>
                <strong>Remove</strong>
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="app__admin-inlineMeta">
        {isLoading
          ? "Searching products..."
          : searchError
            ? searchError
            : query.trim().length < 2
              ? "Type at least 2 characters to search the product catalog."
              : results.length
                ? "Select one or more matching grocery products."
                : "No matching products found."}
      </p>

      {results.length ? (
        <div className="app__admin-productSearchResults">
          {results.map((product) => {
            const isSelected = ingredient.linked_product_ids.includes(product.id);
            return (
              <div key={product.id} className="app__admin-productSearchResult">
                <div className="app__admin-productResultMeta">
                  <strong>{product.name}</strong>
                  <span>{product.id}</span>
                </div>
                <button
                  type="button"
                  className={isSelected ? "app__admin-ghostButton" : "app__admin-secondaryButton"}
                  onClick={() => onToggleProduct(product.id)}
                >
                  {isSelected ? "Linked" : "Link"}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function MealForm({ metadata, role, mode, initialMeal }: MealFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit" && initialMeal;

  const [name, setName] = useState(initialMeal?.name ?? "");
  const [description, setDescription] = useState(initialMeal?.description ?? "");
  const [mealType, setMealType] = useState(initialMeal?.meal_type ?? metadata.meal_types[0]?.value ?? "breakfast");
  const [difficulty, setDifficulty] = useState(initialMeal?.difficulty ?? metadata.difficulties[0]?.value ?? "easy");
  const [servings, setServings] = useState(initialMeal?.servings ?? 1);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(initialMeal?.prep_time_minutes ?? 10);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(initialMeal?.cook_time_minutes ?? 15);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialMeal?.category_ids ?? []);
  const [selectedCultures, setSelectedCultures] = useState<string[]>(initialMeal?.culture_tags ?? []);
  const [dietRules, setDietRules] = useState(initialMeal?.diet_rules_supported.join(", ") ?? "");
  const [allergyExclusions, setAllergyExclusions] = useState(initialMeal?.allergy_exclusions.join(", ") ?? "");
  const [nutritionSummary, setNutritionSummary] = useState<MealNutritionSummary>(
    initialMeal?.nutrition_summary ?? {
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
    },
  );
  const [estimatedCosts, setEstimatedCosts] = useState<MealEstimatedCost[]>(
    initialMeal?.estimated_costs.length ? initialMeal.estimated_costs : [emptyEstimatedCost()],
  );
  const [recipeSteps, setRecipeSteps] = useState<AdminMealRecipeStep[]>(
    initialMeal?.recipe_step_items.length ? initialMeal.recipe_step_items : [emptyRecipeStep()],
  );
  const [ingredientItems, setIngredientItems] = useState<MealIngredient[]>(
    initialMeal?.ingredient_items.length ? initialMeal.ingredient_items : [emptyIngredient()],
  );
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialMeal?.image_urls?.length
      ? initialMeal.image_urls
      : initialMeal?.hero_image_url
        ? [initialMeal.hero_image_url]
        : [],
  );
  const [chefAvailable, setChefAvailable] = useState(initialMeal?.chef_available ?? false);
  const [isActive, setIsActive] = useState(initialMeal?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingMealImages, setIsUploadingMealImages] = useState(false);
  const [stepUploadIndex, setStepUploadIndex] = useState<number | null>(null);

  const [knownProducts, setKnownProducts] = useState<Record<string, ProductSearchOption>>(() =>
    Object.fromEntries(
      metadata.products.map((product) => [
        product.id,
        {
          id: product.id,
          name: product.name,
          img_url: product.img_url,
        },
      ]),
    ),
  );

  const primaryImageUrl = imageUrls[0] ?? "";
  const previewMealType = metadata.meal_types.find((option) => option.value === mealType)?.display_name ?? "Meal";
  const linkedProductNames = useMemo(
    () => new Map(Object.values(knownProducts).map((product) => [product.id, product.name])),
    [knownProducts],
  );

  function toggleSelection(value: string, setter: Dispatch<SetStateAction<string[]>>) {
    setter((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value],
    );
  }

  function updateEstimatedCost(index: number, key: keyof MealEstimatedCost, value: string | number) {
    setEstimatedCosts((current) =>
      current.map((entry, entryIndex) => {
        if (entryIndex !== index) {
          return entry;
        }
        const next = { ...entry, [key]: value } as MealEstimatedCost;
        if (key === "country_code") {
          const match = metadata.supported_countries.find((country) => country.country_code === String(value));
          if (match) {
            next.currency_code = match.currency_code;
          }
        }
        return next;
      }),
    );
  }

  function updateRecipeStep(index: number, key: keyof AdminMealRecipeStep, value: string | string[] | null) {
    setRecipeSteps((current) =>
      current.map((step, stepIndex) =>
        stepIndex === index ? ({ ...step, [key]: value } as AdminMealRecipeStep) : step,
      ),
    );
  }

  function updateIngredient(
    index: number,
    key: keyof MealIngredient,
    value: string | number | boolean | string[],
  ) {
    setIngredientItems((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? ({ ...entry, [key]: value } as MealIngredient) : entry,
      ),
    );
  }

  async function handleMealImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    setIsUploadingMealImages(true);
    setError(null);
    try {
      const uploadedUrls = await uploadMealAssets(files, "meals/gallery");
      setImageUrls((current) => [...current, ...uploadedUrls.filter((url) => !current.includes(url))]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload meal images.");
    } finally {
      setIsUploadingMealImages(false);
      event.target.value = "";
    }
  }

  async function handleStepImageUpload(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setStepUploadIndex(index);
    setError(null);
    try {
      const [uploadedUrl] = await uploadMealAssets([file], "meals/steps");
      updateRecipeStep(index, "image_url", uploadedUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload step image.");
    } finally {
      setStepUploadIndex(null);
      event.target.value = "";
    }
  }

  function makePrimaryImage(url: string) {
    setImageUrls((current) => [url, ...current.filter((entry) => entry !== url)]);
  }

  function removeMealImage(url: string) {
    setImageUrls((current) => current.filter((entry) => entry !== url));
  }

  function buildPayload(): AdminMealPayload | AdminMealCreatePayload {
    const basePayload: AdminMealPayload = {
      name: name.trim(),
      hero_image_url: primaryImageUrl,
      image_urls: imageUrls,
      description: description.trim(),
      meal_type: mealType,
      meal_types: [mealType],
      category_ids: selectedCategoryIds,
      culture_tags: selectedCultures,
      diet_rules_supported: dietRules
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
      allergy_exclusions: allergyExclusions
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
      prep_time_minutes: prepTimeMinutes,
      cook_time_minutes: cookTimeMinutes,
      difficulty,
      servings,
      nutrition_summary: nutritionSummary,
      estimated_costs: estimatedCosts.filter((cost) => cost.amount > 0),
      recipe_steps: recipeSteps.map((step) => step.instruction.trim()).filter(Boolean),
      recipe_step_items: recipeSteps
        .map((step) => ({
          instruction: step.instruction.trim(),
          ingredient_ids: step.ingredient_ids,
          image_url: step.image_url || null,
        }))
        .filter((step) => step.instruction),
      ingredient_items: ingredientItems.map((ingredient) => ({
        ...ingredient,
        id: ingredient.id.trim(),
        name: ingredient.name.trim(),
        unit: ingredient.unit.trim(),
        linked_product_ids: ingredient.linked_product_ids.filter(Boolean),
      })),
      chef_available: chefAvailable,
      is_active: isActive,
    };

    if (mode === "create") {
      return basePayload;
    }

    return basePayload;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!imageUrls.length) {
        throw new Error("Every meal must include at least one image.");
      }

      const payload = buildPayload();
      const response = await fetch(
        isEditMode ? `/api/admin/meals/${initialMeal.id}` : "/api/admin/meals",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const responseBody = (await parseJsonResponse(response)) as { detail?: string; id?: string };
      if (!response.ok) {
        throw new Error(responseBody.detail ?? `Unable to ${isEditMode ? "update" : "create"} meal.`);
      }

      const resolvedMealId = responseBody.id ?? initialMeal?.id;
      if (!resolvedMealId) {
        throw new Error("Meal saved, but no meal id was returned.");
      }

      setSuccessMessage(isEditMode ? "Meal updated successfully." : "Meal created successfully.");
      router.push(`/dashboard/${role}/meals/${resolvedMealId}`);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : `Unable to ${isEditMode ? "update" : "create"} meal.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-editorForm" onSubmit={handleSubmit}>
      <section className="app__admin-productSection">
        <div className="app__admin-productEditorHeader">
          <div>
            <p className="app__admin-eyebrow">{isEditMode ? "Edit meal" : "Create meal"}</p>
            <h2>{isEditMode ? initialMeal.name : "Meal gallery and setup"}</h2>
          </div>
          <label className="app__admin-toggle">
            <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
            <span>{isActive ? "Active" : "Inactive"}</span>
          </label>
        </div>

        <div className="app__admin-editorGrid">
          <label className="app__admin-field">
            <span>Meal name</span>
            <input
              className="app__admin-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jollof Chicken Rice"
              required
            />
          </label>

          <label className="app__admin-field">
            <span>Meal type</span>
            <select className="app__admin-select" value={mealType} onChange={(event) => setMealType(event.target.value)}>
              {metadata.meal_types.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.display_name}
                </option>
              ))}
            </select>
          </label>

          <label className="app__admin-field">
            <span>Difficulty</span>
            <select className="app__admin-select" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              {metadata.difficulties.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.display_name}
                </option>
              ))}
            </select>
          </label>

          <label className="app__admin-field">
            <span>Servings</span>
            <input
              className="app__admin-input"
              type="number"
              min="1"
              max="20"
              value={servings}
              onChange={(event) => setServings(Number(event.target.value))}
            />
          </label>

          <label className="app__admin-field">
            <span>Prep time (min)</span>
            <input
              className="app__admin-input"
              type="number"
              min="0"
              value={prepTimeMinutes}
              onChange={(event) => setPrepTimeMinutes(Number(event.target.value))}
            />
          </label>

          <label className="app__admin-field">
            <span>Cook time (min)</span>
            <input
              className="app__admin-input"
              type="number"
              min="0"
              value={cookTimeMinutes}
              onChange={(event) => setCookTimeMinutes(Number(event.target.value))}
            />
          </label>

          <label className="app__admin-field app__admin-field--full">
            <span>Description</span>
            <textarea
              className="app__admin-textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Describe how this meal fits a user’s day and routine."
            />
          </label>

          <label className="app__admin-field app__admin-field--full">
            <span>Upload meal images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="app__admin-input app__admin-fileInput"
              onChange={handleMealImageUpload}
              disabled={isUploadingMealImages}
            />
          </label>
        </div>

        {imageUrls.length ? (
          <div className="app__admin-mealImageGrid">
            {imageUrls.map((url, index) => (
              <div key={url} className="app__admin-mealImageCard">
                <div className="app__admin-mealImageFrame">
                  <img src={url} alt={`${name || "Meal"} image ${index + 1}`} />
                </div>
                <div className="app__admin-mealImageActions">
                  <span className={`app__admin-categoryPill ${index === 0 ? "is-primary" : ""}`}>
                    {index === 0 ? "Primary" : `Image ${index + 1}`}
                  </span>
                  <div className="app__admin-rowActions">
                    {index !== 0 ? (
                      <button type="button" className="app__admin-ghostButton" onClick={() => makePrimaryImage(url)}>
                        Make primary
                      </button>
                    ) : null}
                    <button type="button" className="app__admin-ghostButton app__admin-dangerButton" onClick={() => removeMealImage(url)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="app__admin-uploadEmptyState">
            <strong>No meal images uploaded yet</strong>
            <p>Add at least one meal image before saving this meal.</p>
          </div>
        )}
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Tags and availability</p>
            <h2>Discovery controls</h2>
          </div>
        </div>

        <div className="app__admin-choicePanel">
          <div className="app__admin-field app__admin-field--full">
            <span>Categories</span>
            <div className="app__admin-choiceGrid">
              {metadata.categories.map((category) => {
                const active = selectedCategoryIds.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`app__admin-choiceChip ${active ? "is-active" : ""}`}
                    onClick={() => toggleSelection(category.id, setSelectedCategoryIds)}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="app__admin-field app__admin-field--full">
            <span>Cultures</span>
            <div className="app__admin-choiceGrid">
              {metadata.cultures.map((culture) => {
                const active = selectedCultures.includes(culture.value);
                return (
                  <button
                    key={culture.value}
                    type="button"
                    className={`app__admin-choiceChip ${active ? "is-active" : ""}`}
                    onClick={() => toggleSelection(culture.value, setSelectedCultures)}
                  >
                    {culture.display_name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="app__admin-editorGrid">
          <label className="app__admin-field">
            <span>Diet rules supported</span>
            <input
              className="app__admin-input"
              value={dietRules}
              onChange={(event) => setDietRules(event.target.value)}
              placeholder="high_protein, pescatarian"
            />
          </label>

          <label className="app__admin-field">
            <span>Allergy exclusions</span>
            <input
              className="app__admin-input"
              value={allergyExclusions}
              onChange={(event) => setAllergyExclusions(event.target.value)}
              placeholder="nuts, shellfish"
            />
          </label>
        </div>

        <div className="app__admin-toggleCluster">
          <label className="app__admin-toggle">
            <input type="checkbox" checked={chefAvailable} onChange={(event) => setChefAvailable(event.target.checked)} />
            <span>Chef available</span>
          </label>
        </div>
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Nutrition</p>
            <h2>Macro summary</h2>
          </div>
        </div>

        <div className="app__admin-inlineGrid app__admin-inlineGrid--mealNutrition">
          <label className="app__admin-field">
            <span>Calories</span>
            <input
              className="app__admin-input"
              type="number"
              min="0"
              value={nutritionSummary.calories}
              onChange={(event) =>
                setNutritionSummary((current) => ({ ...current, calories: Number(event.target.value) }))
              }
            />
          </label>
          <label className="app__admin-field">
            <span>Protein (g)</span>
            <input
              className="app__admin-input"
              type="number"
              min="0"
              step="0.1"
              value={nutritionSummary.protein_g}
              onChange={(event) =>
                setNutritionSummary((current) => ({ ...current, protein_g: Number(event.target.value) }))
              }
            />
          </label>
          <label className="app__admin-field">
            <span>Carbs (g)</span>
            <input
              className="app__admin-input"
              type="number"
              min="0"
              step="0.1"
              value={nutritionSummary.carbs_g}
              onChange={(event) =>
                setNutritionSummary((current) => ({ ...current, carbs_g: Number(event.target.value) }))
              }
            />
          </label>
          <label className="app__admin-field">
            <span>Fat (g)</span>
            <input
              className="app__admin-input"
              type="number"
              min="0"
              step="0.1"
              value={nutritionSummary.fat_g}
              onChange={(event) =>
                setNutritionSummary((current) => ({ ...current, fat_g: Number(event.target.value) }))
              }
            />
          </label>
        </div>
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Costs</p>
            <h2>Estimated spend by country</h2>
          </div>
          <button type="button" className="app__admin-secondaryButton" onClick={() => setEstimatedCosts((current) => [...current, emptyEstimatedCost()])}>
            Add cost row
          </button>
        </div>

        <div className="app__admin-stack">
          {estimatedCosts.map((cost, index) => (
            <div key={`estimated-cost-${index}`} className="app__admin-priceCard">
              <div className="app__admin-inlineGrid app__admin-inlineGrid--price">
                <label className="app__admin-field">
                  <span>Country</span>
                  <select
                    className="app__admin-select"
                    value={cost.country_code}
                    onChange={(event) => updateEstimatedCost(index, "country_code", event.target.value)}
                  >
                    {metadata.supported_countries.map((country) => (
                      <option key={country.country_code} value={country.country_code}>
                        {country.display_name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="app__admin-field">
                  <span>Currency</span>
                  <input className="app__admin-input" value={cost.currency_code} readOnly />
                </label>

                <label className="app__admin-field">
                  <span>Amount</span>
                  <input
                    className="app__admin-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={cost.amount}
                    onChange={(event) => updateEstimatedCost(index, "amount", Number(event.target.value))}
                  />
                </label>
              </div>

              <div className="app__admin-rowActions">
                <button
                  type="button"
                  className="app__admin-ghostButton"
                  onClick={() => setEstimatedCosts((current) => (current.length === 1 ? current : current.filter((_, i) => i !== index)))}
                >
                  Remove cost row
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Ingredients</p>
            <h2>Ingredients and linked groceries</h2>
          </div>
          <button type="button" className="app__admin-secondaryButton" onClick={() => setIngredientItems((current) => [...current, emptyIngredient()])}>
            Add ingredient
          </button>
        </div>

        <div className="app__admin-stack">
          {ingredientItems.map((ingredient, index) => (
            <div key={`ingredient-${ingredient.id}`} className="app__admin-priceCard">
              <div className="app__admin-editorGrid">
                <label className="app__admin-field">
                  <span>Ingredient</span>
                  <input
                    className="app__admin-input"
                    value={ingredient.name}
                    onChange={(event) => updateIngredient(index, "name", event.target.value)}
                    placeholder="Chicken breast"
                  />
                </label>
                <label className="app__admin-field">
                  <span>Unit</span>
                  <input
                    className="app__admin-input"
                    value={ingredient.unit}
                    onChange={(event) => updateIngredient(index, "unit", event.target.value)}
                    placeholder="g"
                  />
                </label>
                <label className="app__admin-field">
                  <span>Quantity</span>
                  <input
                    className="app__admin-input"
                    type="number"
                    min="0"
                    step="0.1"
                    value={ingredient.quantity}
                    onChange={(event) => updateIngredient(index, "quantity", Number(event.target.value))}
                  />
                </label>

                <IngredientProductPicker
                  ingredient={ingredient}
                  knownProducts={knownProducts}
                  onHydrateProducts={setKnownProducts}
                  onToggleProduct={(productId) =>
                    updateIngredient(
                      index,
                      "linked_product_ids",
                      ingredient.linked_product_ids.includes(productId)
                        ? ingredient.linked_product_ids.filter((id) => id !== productId)
                        : [...ingredient.linked_product_ids, productId],
                    )
                  }
                />
              </div>

              <div className="app__admin-inlineMeta">
                {ingredient.linked_product_ids.length
                  ? ingredient.linked_product_ids.map((productId) => linkedProductNames.get(productId) ?? productId).join(", ")
                  : "No products linked yet"}
              </div>

              <div className="app__admin-rowActions">
                <label className="app__admin-checkbox app__admin-checkbox--inline">
                  <input
                    type="checkbox"
                    checked={ingredient.optional}
                    onChange={(event) => updateIngredient(index, "optional", event.target.checked)}
                  />
                  <span>Optional ingredient</span>
                </label>

                <button
                  type="button"
                  className="app__admin-ghostButton"
                  onClick={() =>
                    setIngredientItems((current) => {
                      if (current.length === 1) {
                        return current;
                      }

                      const ingredientId = current[index]?.id;
                      if (ingredientId) {
                        setRecipeSteps((currentSteps) =>
                          currentSteps.map((step) => ({
                            ...step,
                            ingredient_ids: step.ingredient_ids.filter((id) => id !== ingredientId),
                          })),
                        );
                      }

                      return current.filter((_, itemIndex) => itemIndex !== index);
                    })
                  }
                >
                  Remove ingredient
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Recipe</p>
            <h2>Recipe steps</h2>
          </div>
          <button type="button" className="app__admin-secondaryButton" onClick={() => setRecipeSteps((current) => [...current, emptyRecipeStep()])}>
            Add step
          </button>
        </div>

        <div className="app__admin-stack">
          {recipeSteps.map((step, index) => (
            <div key={`recipe-step-${index}`} className="app__admin-recipeStepEditor">
              <div className="app__admin-recipeStepHeader">
                <div className="app__admin-stepIndex">{index + 1}</div>
                <div className="app__admin-stack">
                  <strong>Step {index + 1}</strong>
                  <span className="app__admin-inlineMeta">Link ingredients and optionally upload a visual reference.</span>
                </div>
                <button
                  type="button"
                  className="app__admin-ghostButton"
                  onClick={() =>
                    setRecipeSteps((current) => (current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index)))
                  }
                >
                  Remove
                </button>
              </div>

              <div className="app__admin-recipeStepLayout">
                <div className="app__admin-stack">
                  <label className="app__admin-field app__admin-field--full">
                    <span>Instruction</span>
                    <input
                      className="app__admin-input"
                      value={step.instruction}
                      onChange={(event) => updateRecipeStep(index, "instruction", event.target.value)}
                      placeholder="Describe the next cooking step"
                    />
                  </label>

                  <div className="app__admin-field app__admin-field--full">
                    <span>Linked ingredients</span>
                    <div className="app__admin-choiceGrid">
                      {ingredientItems.map((ingredient) => {
                        if (!ingredient.name.trim()) {
                          return null;
                        }

                        const active = step.ingredient_ids.includes(ingredient.id);
                        return (
                          <button
                            key={`${ingredient.id}-${index}`}
                            type="button"
                            className={`app__admin-choiceChip ${active ? "is-active" : ""}`}
                            onClick={() =>
                              updateRecipeStep(
                                index,
                                "ingredient_ids",
                                active
                                  ? step.ingredient_ids.filter((id) => id !== ingredient.id)
                                  : [...step.ingredient_ids, ingredient.id],
                              )
                            }
                          >
                            {ingredient.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="app__admin-recipeStepImageCard">
                  {step.image_url ? (
                    <div className="app__admin-mealImageFrame">
                      <img src={step.image_url} alt={`Recipe step ${index + 1}`} />
                    </div>
                  ) : (
                    <div className="app__admin-uploadEmptyState app__admin-uploadEmptyState--compact">
                      <strong>No step image</strong>
                      <p>This is optional, but useful for richer recipe detail.</p>
                    </div>
                  )}

                  <div className="app__admin-rowActions">
                    <label className="app__admin-secondaryButton">
                      <input type="file" accept="image/*" hidden onChange={(event) => handleStepImageUpload(index, event)} />
                      {stepUploadIndex === index ? "Uploading..." : "Upload step image"}
                    </label>
                    {step.image_url ? (
                      <button type="button" className="app__admin-ghostButton" onClick={() => updateRecipeStep(index, "image_url", null)}>
                        Remove image
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Preview</p>
            <h2>Catalog preview</h2>
          </div>
        </div>

        <div className="app__admin-previewCard">
          <div className="app__admin-previewImage">
            {primaryImageUrl ? (
              <img src={primaryImageUrl} alt={name || "Meal preview"} />
            ) : (
              <div className="app__admin-fallback">{(name || "ME").slice(0, 2).toUpperCase()}</div>
            )}
          </div>

          <div className="app__admin-previewCopy">
            <span className="app__admin-categoryPill">{previewMealType}</span>
            <h3 className="app__admin-productName">{name || "Meal name"}</h3>
            <p>{description || "Description preview will appear here."}</p>
            <div className="app__admin-previewStats">
              <div className="app__admin-productStat">
                <strong>{imageUrls.length}</strong>
                <span>Images</span>
              </div>
              <div className="app__admin-productStat">
                <strong>{recipeSteps.filter((step) => step.image_url).length}</strong>
                <span>Step visuals</span>
              </div>
              <div className="app__admin-productStat">
                <strong>{ingredientItems.filter((item) => item.name.trim()).length}</strong>
                <span>Ingredients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="app__admin-submitRow">
        <div className="app__admin-feedbackStack">
          {error ? <p className="app__admin-formError">{error}</p> : null}
          {successMessage ? <p className="app__admin-formSuccess">{successMessage}</p> : null}
          {isUploadingMealImages ? <p className="app__admin-inlineMeta">Uploading meal assets...</p> : null}
        </div>

        <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting || isUploadingMealImages || stepUploadIndex !== null}>
          {isSubmitting ? "Saving..." : isEditMode ? "Save changes" : "Create meal"}
        </button>
      </div>
    </form>
  );
}

type MealEditorProps = {
  metadata: AdminMealMetadata;
  initialMeal: AdminMeal;
  role: string;
};

export function MealEditor({ metadata, initialMeal, role }: MealEditorProps) {
  return <MealForm metadata={metadata} role={role} mode="edit" initialMeal={initialMeal} />;
}

type CreateMealFormProps = {
  metadata: AdminMealMetadata;
  role: string;
};

export function CreateMealForm({ metadata, role }: CreateMealFormProps) {
  return <MealForm metadata={metadata} role={role} mode="create" />;
}
