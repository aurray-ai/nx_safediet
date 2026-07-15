"use client";

import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  AdminMetadata,
  AdminProduct,
  AdminProductCreatePayload,
  AdminProductPayload,
  CountryPrice,
  NutritionSpec,
} from "@/lib/types";

type ProductFormProps = {
  metadata: AdminMetadata;
  role: string;
  mode: "create" | "edit";
  initialProduct?: AdminProduct;
};

type NutritionDraft = NutritionSpec & {
  clientId: string;
};

function createEmptyNutrition(defaultUnit = "g", nutrientId = 1): NutritionDraft {
  return {
    clientId: crypto.randomUUID(),
    nutrient_id: nutrientId,
    amount: 0,
    unit: defaultUnit,
  };
}

function createEmptyPrice(countryCode = "NG", currencyCode = "NGN"): CountryPrice {
  return {
    country_code: countryCode,
    currency_code: currencyCode,
    amount: 0,
    price_unit: "1 item",
    source: "admin_dashboard",
    is_active: true,
    region: "",
    city: "",
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

export function ProductForm({ metadata, role, mode, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const nutrientUnitLookup = useMemo(
    () => new Map(metadata.nutrients.map((nutrient) => [nutrient.id, nutrient.default_unit])),
    [metadata.nutrients],
  );
  const defaultCountry = metadata.supported_countries[0];
  const fallbackNutrient = metadata.nutrients[0];
  const isEditMode = mode === "edit" && initialProduct;

  const [product, setProduct] = useState(initialProduct?.product ?? "");
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id ?? metadata.categories[0]?.id ?? "");
  const [imgUrl, setImgUrl] = useState(initialProduct?.img_url ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [productTags, setProductTags] = useState(initialProduct?.product_tags.join(", ") ?? "");
  const [selectedCultures, setSelectedCultures] = useState<string[]>(initialProduct?.culture_tags ?? []);
  const [nutritionSpecs, setNutritionSpecs] = useState<NutritionDraft[]>(
    initialProduct?.nutritional_specs.length
      ? initialProduct.nutritional_specs.map((spec) => ({
          ...spec,
          clientId: crypto.randomUUID(),
        }))
      : [createEmptyNutrition(fallbackNutrient?.default_unit ?? "g", fallbackNutrient?.id ?? 1)],
  );
  const [prices, setPrices] = useState<CountryPrice[]>(
    initialProduct?.prices.length
      ? initialProduct.prices.map((price) => ({
          ...price,
          source: price.source ?? "admin_dashboard",
          region: price.region ?? "",
          city: price.city ?? "",
        }))
      : [createEmptyPrice(defaultCountry?.country_code, defaultCountry?.currency_code)],
  );
  const [isActive, setIsActive] = useState(initialProduct?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function toggleCulture(value: string) {
    setSelectedCultures((current) =>
      current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value],
    );
  }

  function nextNutritionSeed(current: NutritionDraft[]): NutritionDraft {
    const usedIds = new Set(current.map((spec) => Number(spec.nutrient_id)));
    const nextNutrient = metadata.nutrients.find((nutrient) => !usedIds.has(nutrient.id)) ?? fallbackNutrient;
    return createEmptyNutrition(nextNutrient?.default_unit ?? "g", nextNutrient?.id ?? 1);
  }

  function updateNutrition(clientId: string, key: keyof NutritionSpec, value: number | string) {
    setNutritionSpecs((current) =>
      current.map((entry) => {
        if (entry.clientId !== clientId) {
          return entry;
        }

        const next = { ...entry, [key]: value } as NutritionDraft;
        if (key === "nutrient_id") {
          next.unit = nutrientUnitLookup.get(Number(value)) ?? entry.unit;
        }
        return next;
      }),
    );
  }

  function addNutritionRow() {
    setNutritionSpecs((current) => [...current, nextNutritionSeed(current)]);
  }

  function removeNutritionRow(clientId: string) {
    setNutritionSpecs((current) => current.filter((entry) => entry.clientId !== clientId));
  }

  function updatePrice(index: number, key: keyof CountryPrice, value: string | number | boolean) {
    setPrices((current) =>
      current.map((entry, entryIndex) => {
        if (entryIndex !== index) {
          return entry;
        }

        const next = { ...entry, [key]: value } as CountryPrice;
        if (key === "country_code") {
          const matchedCountry = metadata.supported_countries.find(
            (country) => country.country_code === String(value),
          );
          if (matchedCountry) {
            next.currency_code = matchedCountry.currency_code;
          }
        }
        return next;
      }),
    );
  }

  function addPriceRow() {
    setPrices((current) => [
      ...current,
      createEmptyPrice(defaultCountry?.country_code, defaultCountry?.currency_code),
    ]);
  }

  function removePriceRow(index: number) {
    setPrices((current) => current.filter((_, entryIndex) => entryIndex !== index));
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      formData.append("folder", "products");

      const response = await fetch("/api/admin/products/uploads", {
        method: "POST",
        body: formData,
      });
      const payload = (await parseJsonResponse(response)) as {
        detail?: string;
        items?: Array<{ url: string }>;
      };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to upload product image.");
      }

      const uploadedUrl = payload.items?.[0]?.url;
      if (!uploadedUrl) {
        throw new Error("Upload completed without a returned asset URL.");
      }

      setImgUrl(uploadedUrl);
      setSuccessMessage("Image uploaded successfully.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload product image.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  function buildPayload(): AdminProductPayload | AdminProductCreatePayload {
    const normalizedNutrition = nutritionSpecs
      .filter((spec) => Number(spec.amount) > 0)
      .map((spec) => ({
        nutrient_id: Number(spec.nutrient_id),
        amount: Number(spec.amount),
        unit: spec.unit,
      }));

    const nutritionIds = normalizedNutrition.map((spec) => spec.nutrient_id);
    if (new Set(nutritionIds).size !== nutritionIds.length) {
      throw new Error("Each nutrient can only be added once.");
    }

    const normalizedPrices = prices
      .filter((price) => Number(price.amount) > 0)
      .map((price) => ({
        country_code: price.country_code,
        currency_code: price.currency_code,
        amount: Number(price.amount),
        price_unit: price.price_unit.trim(),
        source: (price.source ?? "admin_dashboard").trim() || "admin_dashboard",
        is_active: price.is_active ?? true,
        region: price.region?.trim() || null,
        city: price.city?.trim() || null,
      }));

    const basePayload: AdminProductPayload = {
      category_id: categoryId,
      img_url: imgUrl.trim(),
      product: product.trim(),
      description: description.trim(),
      product_tags: productTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      culture_tags: selectedCultures,
      nutritional_specs: normalizedNutrition,
      prices: normalizedPrices,
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
      const payload = buildPayload();
      const response = await fetch(
        isEditMode ? `/api/admin/products/${initialProduct.id}` : "/api/admin/products",
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
        throw new Error(responseBody.detail ?? `Unable to ${isEditMode ? "update" : "create"} product.`);
      }

      const resolvedProductId = responseBody.id ?? initialProduct?.id;
      if (!resolvedProductId) {
        throw new Error("Product saved, but no product id was returned.");
      }

      setSuccessMessage(isEditMode ? "Product updated successfully." : "Product created successfully.");
      router.push(`/dashboard/${role}/products/${resolvedProductId}`);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : `Unable to ${isEditMode ? "update" : "create"} product.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-editorForm" onSubmit={handleSubmit}>
      <section className="app__admin-productEditor">
        <div className="app__admin-productEditorHeader">
          <div>
            <p className="app__admin-eyebrow">{isEditMode ? "Edit grocery" : "Create grocery"}</p>
            <h2>{isEditMode ? initialProduct.id : "New catalog item"}</h2>
          </div>
          <label className="app__admin-toggle">
            <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
            <span>{isActive ? "Active" : "Inactive"}</span>
          </label>
        </div>

        <div className="app__admin-editorGrid">
          <label className="app__admin-field">
            <span>Product name</span>
            <input
              className="app__admin-input"
              value={product}
              onChange={(event) => setProduct(event.target.value)}
              required
            />
          </label>

          <label className="app__admin-field">
            <span>Category</span>
            <select className="app__admin-select" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              {metadata.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="app__admin-field app__admin-field--full">
            <span>Image URL</span>
            <input
              className="app__admin-input"
              value={imgUrl}
              onChange={(event) => setImgUrl(event.target.value)}
              placeholder="https://..."
              required
            />
          </label>

          <label className="app__admin-field app__admin-field--full">
            <span>Upload image</span>
            <input
              type="file"
              accept="image/*"
              className="app__admin-input app__admin-fileInput"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>

          <label className="app__admin-field app__admin-field--full">
            <span>Description</span>
            <textarea
              className="app__admin-textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
            />
          </label>

          <label className="app__admin-field app__admin-field--full">
            <span>Product tags</span>
            <input
              className="app__admin-input"
              value={productTags}
              onChange={(event) => setProductTags(event.target.value)}
              placeholder="rice, pantry, staple"
            />
          </label>
        </div>
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Culture tags</p>
            <h2>Audience fit</h2>
          </div>
        </div>

        <div className="app__admin-checkboxGrid">
          {metadata.cultures.map((culture) => (
            <label key={culture.value} className="app__admin-checkbox">
              <input
                type="checkbox"
                checked={selectedCultures.includes(culture.value)}
                onChange={() => toggleCulture(culture.value)}
              />
              <span>{culture.display_name}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Nutrition</p>
            <h2>Nutrition rows</h2>
          </div>
          <button type="button" className="app__admin-secondaryButton" onClick={addNutritionRow}>
            Add nutrient
          </button>
        </div>

        <div className="app__admin-stack">
          {nutritionSpecs.length === 0 ? <p className="app__admin-inlineMeta">No nutrition rows yet. Add one and save.</p> : null}

          {nutritionSpecs.map((spec) => (
            <div key={spec.clientId} className="app__admin-inlineGrid app__admin-inlineGrid--nutrition">
              <label className="app__admin-field">
                <span>Nutrient</span>
                <select
                  className="app__admin-select"
                  value={String(spec.nutrient_id)}
                  onChange={(event) => updateNutrition(spec.clientId, "nutrient_id", Number(event.target.value))}
                >
                  {metadata.nutrients.map((nutrient) => (
                    <option key={nutrient.id} value={nutrient.id}>
                      {nutrient.display_name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="app__admin-field">
                <span>Amount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="app__admin-input"
                  value={spec.amount}
                  onChange={(event) => updateNutrition(spec.clientId, "amount", Number(event.target.value))}
                />
              </label>

              <label className="app__admin-field">
                <span>Unit</span>
                <input
                  className="app__admin-input"
                  value={spec.unit}
                  onChange={(event) => updateNutrition(spec.clientId, "unit", event.target.value)}
                />
              </label>

              <button type="button" className="app__admin-ghostButton" onClick={() => removeNutritionRow(spec.clientId)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Pricing</p>
            <h2>Market price rows</h2>
          </div>
          <button type="button" className="app__admin-secondaryButton" onClick={addPriceRow}>
            Add price
          </button>
        </div>

        <div className="app__admin-stack">
          {prices.map((price, index) => (
            <div key={`${index}-${price.country_code}-${price.currency_code}`} className="app__admin-priceCard">
              <div className="app__admin-inlineGrid app__admin-inlineGrid--price">
                <label className="app__admin-field">
                  <span>Country</span>
                  <select
                    className="app__admin-select"
                    value={price.country_code}
                    onChange={(event) => updatePrice(index, "country_code", event.target.value)}
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
                  <input className="app__admin-input" value={price.currency_code} readOnly />
                </label>

                <label className="app__admin-field">
                  <span>Amount</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="app__admin-input"
                    value={price.amount}
                    onChange={(event) => updatePrice(index, "amount", Number(event.target.value))}
                  />
                </label>

                <label className="app__admin-field">
                  <span>Unit</span>
                  <input
                    className="app__admin-input"
                    value={price.price_unit}
                    onChange={(event) => updatePrice(index, "price_unit", event.target.value)}
                  />
                </label>

                <label className="app__admin-field">
                  <span>Source</span>
                  <input
                    className="app__admin-input"
                    value={price.source ?? "admin_dashboard"}
                    onChange={(event) => updatePrice(index, "source", event.target.value)}
                  />
                </label>

                <label className="app__admin-field">
                  <span>Region</span>
                  <input
                    className="app__admin-input"
                    value={price.region ?? ""}
                    onChange={(event) => updatePrice(index, "region", event.target.value)}
                  />
                </label>

                <label className="app__admin-field">
                  <span>City</span>
                  <input
                    className="app__admin-input"
                    value={price.city ?? ""}
                    onChange={(event) => updatePrice(index, "city", event.target.value)}
                  />
                </label>
              </div>

              <div className="app__admin-rowActions">
                <label className="app__admin-checkbox app__admin-checkbox--inline">
                  <input
                    type="checkbox"
                    checked={price.is_active ?? true}
                    onChange={(event) => updatePrice(index, "is_active", event.target.checked)}
                  />
                  <span>Active</span>
                </label>

                <button
                  type="button"
                  className="app__admin-ghostButton"
                  onClick={() => removePriceRow(index)}
                  disabled={prices.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="app__admin-submitRow">
        <div className="app__admin-feedbackStack">
          {error ? <p className="app__admin-formError">{error}</p> : null}
          {successMessage ? <p className="app__admin-formSuccess">{successMessage}</p> : null}
          {isUploading ? <p className="app__admin-inlineMeta">Uploading asset...</p> : null}
        </div>

        <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting || isUploading}>
          {isSubmitting ? "Saving..." : isEditMode ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}

type ProductEditorProps = {
  metadata: AdminMetadata;
  initialProduct: AdminProduct;
  role: string;
};

export function ProductEditor({ metadata, initialProduct, role }: ProductEditorProps) {
  return <ProductForm metadata={metadata} role={role} mode="edit" initialProduct={initialProduct} />;
}

type CreateProductFormProps = {
  metadata: AdminMetadata;
  role: string;
};

export function CreateProductForm({ metadata, role }: CreateProductFormProps) {
  return <ProductForm metadata={metadata} role={role} mode="create" />;
}
