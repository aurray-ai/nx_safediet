import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteProductButton } from "@/components/dashboard/delete-product-button";
import { fetchAdminInventoryItem, fetchAdminMetadata, fetchAdminProduct } from "@/lib/api";
import { formatDate, formatLabel, formatNumber } from "@/lib/admin-format";

export default async function ProductDetailPage({
  params,
}: {
  params: { role: string; productId: string };
  }) {
  try {
    const [metadata, product] = await Promise.all([
      fetchAdminMetadata(),
      fetchAdminProduct(params.productId),
    ]);
    let inventory = null;
    try {
      inventory = await fetchAdminInventoryItem(params.productId);
    } catch (error) {
      if (!(error instanceof Error) || !/not found/i.test(error.message)) {
        throw error;
      }
      inventory = null;
    }
    const categoryLabel =
      metadata.categories.find((category) => category.id === product.category_id)?.name ?? product.category_id;
    const leadPrice = product.prices[0];

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Groceries</p>
            <h2 className="app__admin-groceriesTitle">{product.product}</h2>
            <p>{product.description || "No description yet."}</p>
          </div>

          <div className="app__admin-actionsWrap">
            <Link
              href={`/dashboard/${params.role}/products/${product.id}/edit` as Route}
              className="app__admin-primaryButton"
            >
              Edit product
            </Link>
            <Link href={`/dashboard/${params.role}/products` as Route} className="app__admin-secondaryButton">
              Back to products
            </Link>
            <DeleteProductButton productId={product.id} productName={product.product} role={params.role} />
          </div>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-productDetailHero">
              <div className="app__admin-detailThumb">
                {product.img_url ? (
                  <img src={product.img_url} alt={product.product} />
                ) : (
                  <div className="app__admin-fallback">{product.product.slice(0, 2).toUpperCase()}</div>
                )}
              </div>

              <div className="app__admin-stack">
                <div className="app__admin-productCardTop">
                  <span className="app__admin-categoryPill">{categoryLabel}</span>
                  <span className={`app__admin-statusPill ${product.is_active ? "" : "is-inactive"}`}>
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="app__admin-tagRow">
                  {product.culture_tags.map((tag) => (
                    <span key={tag} className="app__admin-tagPill is-culture">
                      {formatLabel(tag)}
                    </span>
                  ))}
                  {product.product_tags.map((tag) => (
                    <span key={tag} className="app__admin-tagPill">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="app__admin-inlineMetaList">
                  <span>Product ID: {product.id}</span>
                  <span>Updated: {formatDate(product.updated_at)}</span>
                  <span>Created: {formatDate(product.created_at)}</span>
                </div>
              </div>
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Overview</p>
                <h2>Product details</h2>
              </div>
            </div>

            <div className="app__admin-detailList">
              <div className="app__admin-detailRow">
                <span>Category</span>
                <strong>{categoryLabel}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Lead price</span>
                <strong>
                  {leadPrice ? `${leadPrice.currency_code} ${leadPrice.amount} · ${leadPrice.price_unit}` : "Not set"}
                </strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Price rows</span>
                <strong>{product.prices.length}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Nutrition rows</span>
                <strong>{product.nutritional_specs.length}</strong>
              </div>
              <div className="app__admin-detailRow">
                <span>Inventory status</span>
                <strong>
                  {inventory
                    ? `${formatNumber(inventory.available_quantity)} ${inventory.unit_label}${inventory.available_quantity === 1 ? "" : "s"}`
                    : "Not configured"}
                </strong>
              </div>
            </div>
          </article>
        </section>

        <section className="app__admin-detailGrid">
          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Pricing</p>
                <h2>Market pricing</h2>
              </div>
            </div>

            <div className="app__admin-stack">
              {product.prices.map((price, index) => (
                <div key={`${price.country_code}-${index}`} className="app__admin-productStat">
                  <strong>
                    {price.currency_code} {price.amount}
                  </strong>
                  <span>
                    {price.country_code}
                    {price.price_unit ? ` · ${price.price_unit}` : ""}
                    {price.region ? ` · ${price.region}` : ""}
                    {price.city ? ` · ${price.city}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Inventory</p>
                <h2>Sellable state</h2>
              </div>
              <Link
                href={`/dashboard/${params.role}/inventory/${product.id}` as Route}
                className="app__admin-secondaryButton"
              >
                Manage inventory
              </Link>
            </div>

            {inventory ? (
              <div className="app__admin-detailList">
                <div className="app__admin-detailRow">
                  <span>SKU</span>
                  <strong>{inventory.sku}</strong>
                </div>
                <div className="app__admin-detailRow">
                  <span>Available</span>
                  <strong>{formatNumber(inventory.available_quantity)}</strong>
                </div>
                <div className="app__admin-detailRow">
                  <span>Reserved</span>
                  <strong>{formatNumber(inventory.reserved_quantity)}</strong>
                </div>
                <div className="app__admin-detailRow">
                  <span>Weight</span>
                  <strong>{formatNumber(inventory.unit_weight_grams)}g</strong>
                </div>
                <div className="app__admin-detailRow">
                  <span>Substitutions</span>
                  <strong>{inventory.allow_substitutions ? "Allowed" : "Disabled"}</strong>
                </div>
                <div className="app__admin-detailRow">
                  <span>Updated</span>
                  <strong>{formatDate(inventory.updated_at)}</strong>
                </div>
              </div>
            ) : (
              <div className="app__admin-emptyState">
                <p className="app__admin-eyebrow">Inventory missing</p>
                <h2>No operational stock yet</h2>
                <p>Set SKU, quantity, unit weight, and substitution policy before this item can be sold reliably.</p>
              </div>
            )}
          </article>

          <article className="app__admin-productSection">
            <div className="app__admin-sectionHeader">
              <div>
                <p className="app__admin-eyebrow">Nutrition</p>
                <h2>Nutrient values</h2>
              </div>
            </div>

            <div className="app__admin-stack">
              {product.nutritional_specs.map((spec, index) => {
                const nutrient = metadata.nutrients.find((item) => item.id === spec.nutrient_id);
                return (
                  <div key={`${spec.nutrient_id}-${index}`} className="app__admin-productStat">
                    <strong>{nutrient?.display_name ?? `Nutrient ${spec.nutrient_id}`}</strong>
                    <span>
                      {spec.amount} {spec.unit}
                    </span>
                  </div>
                );
              })}
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
