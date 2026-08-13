import type { Route } from "next";
import Link from "next/link";
import { isRedirectError } from "next/dist/client/components/redirect";

import { getRoleConfig, getRoleFromSlug } from "@/lib/roles";
import {
  fetchAdminInventory,
  fetchAdminOrders,
  fetchAdminProductsPage,
  fetchChefMealOrders,
  fetchDeliveryFeeRules,
  fetchShopperGroceryOrders,
} from "@/lib/api";
import { formatCurrencyMinor, formatDate, formatLabel, formatNumber } from "@/lib/admin-format";

type DashboardLoadResult<T> = {
  data: T | null;
  error: string | null;
  label: string;
};

function getDashboardLoadMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return "Unavailable right now.";
}

async function safeDashboardLoad<T>(label: string, loader: () => Promise<T>): Promise<DashboardLoadResult<T>> {
  try {
    return {
      data: await loader(),
      error: null,
      label,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      data: null,
      error: getDashboardLoadMessage(error),
      label,
    };
  }
}

export default function DashboardRolePage({
  params,
}: {
  params: { role: string };
}) {
  const role = getRoleFromSlug(params.role) ?? "user";
  const config = getRoleConfig(role);
  const quickLinks = config.navItems.filter((item) => item.href !== config.dashboardHref).slice(0, 4);

  if (role === "chef") {
    return <ChefDashboard configLabel={config.label} />;
  }

  if (role === "shopper") {
    return <ShopperDashboard configLabel={config.label} />;
  }

  if (role !== "admin") {
    return (
      <>
        <header className="app__admin-hero">
          <div className="app__admin-heroCopy">
            <p className="app__admin-eyebrow">Dashboard</p>
            <h1 className="app__admin-title">{config.label}</h1>
          </div>

          <div className="app__admin-heroStats">
            <article className="app__admin-statCard">
              <span className="app__admin-userLabel">Role</span>
              <strong>{config.label}</strong>
            </article>
            <article className="app__admin-statCard">
              <span className="app__admin-userLabel">Areas</span>
              <strong>{formatNumber(quickLinks.length)}</strong>
            </article>
          </div>
        </header>

        <section className="app__admin-grid">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href as Route} className="app__admin-card app__admin-cardLink">
              <p className="app__admin-userLabel">{item.group ?? "Workspace"}</p>
              <h2>{item.label}</h2>
            </Link>
          ))}
        </section>
      </>
    );
  }

  return <AdminDashboard configLabel={config.label} />;
}

async function AdminDashboard({
  configLabel,
}: {
  configLabel: string;
}) {
  const [productsResult, inventoryResult, ordersResult, deliveryFeesResult] = await Promise.all([
    safeDashboardLoad("Catalog", () => fetchAdminProductsPage({ page: 1, pageSize: 100 })),
    safeDashboardLoad("Inventory", () => fetchAdminInventory({ page: 1, pageSize: 100 })),
    safeDashboardLoad("Orders", () => fetchAdminOrders({ limit: 20 })),
    safeDashboardLoad("Delivery fees", () => fetchDeliveryFeeRules()),
  ]);

  const products = productsResult.data;
  const inventory = inventoryResult.data;
  const orders = ordersResult.data;
  const deliveryFees = deliveryFeesResult.data;

  const productItems = products?.items ?? [];
  const inventoryItems = inventory?.items ?? [];
  const orderItems = orders?.items ?? [];
  const deliveryFeeItems = deliveryFees?.items ?? [];

  const activeProducts = productItems.filter((product) => product.is_active).length;
  const lowStockItems = inventoryItems.filter((item) => item.available_quantity > 0 && item.available_quantity <= 10).length;
  const outOfStockItems = inventoryItems.filter((item) => item.available_quantity <= 0).length;
  const pendingSubstitutions = orderItems.reduce(
    (total, order) => total + order.items.filter((item) => item.allow_substitutions && item.substitution_resolution === "none").length,
    0,
  );
  const refundedOrders = orderItems.filter((order) => order.status === "refunded" || order.status === "partially_refunded").length;
  const todayRevenueMinor = orderItems
    .filter((order) => order.status !== "canceled" && order.status !== "payment_failed")
    .reduce((total, order) => total + order.pricing_summary.total_minor, 0);
  const dashboardWarnings = [productsResult, inventoryResult, ordersResult, deliveryFeesResult].flatMap((result) =>
    result.error ? [{ label: result.label, error: result.error }] : [],
  );

  return (
    <>
      <header className="app__admin-hero">
        <div className="app__admin-heroCopy">
          <p className="app__admin-eyebrow">Dashboard</p>
          <h1 className="app__admin-title">{configLabel}</h1>
          {dashboardWarnings.length > 0 ? (
            <p className="app__admin-formError">Some data is currently unavailable.</p>
          ) : null}
        </div>

        <div className="app__admin-heroStats">
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Products</span>
            <strong>{products ? formatNumber(activeProducts) : "Unavailable"}</strong>
          </article>
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Low stock</span>
            <strong>{inventory ? formatNumber(lowStockItems) : "Unavailable"}</strong>
          </article>
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Exceptions</span>
            <strong>{orders ? formatNumber(pendingSubstitutions) : "Unavailable"}</strong>
          </article>
        </div>
      </header>

      <section className="app__admin-grid">
        <Link href={"/dashboard/admin/products" as Route} className="app__admin-card app__admin-cardLink">
          <p className="app__admin-userLabel">Catalog</p>
          <h2>Products</h2>
        </Link>
        <Link href={"/dashboard/admin/inventory" as Route} className="app__admin-card app__admin-cardLink">
          <p className="app__admin-userLabel">Catalog</p>
          <h2>Inventory</h2>
        </Link>
        <Link href={"/dashboard/admin/orders" as Route} className="app__admin-card app__admin-cardLink">
          <p className="app__admin-userLabel">Orders</p>
          <h2>Orders</h2>
        </Link>
        <Link href={"/dashboard/admin/customers" as Route} className="app__admin-card app__admin-cardLink">
          <p className="app__admin-userLabel">Customers</p>
          <h2>Customers</h2>
        </Link>
      </section>

      {dashboardWarnings.length > 0 ? (
        <section className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Status</p>
              <h2>Unavailable</h2>
            </div>
          </div>

          <div className="app__admin-inlineMetaList">
            {dashboardWarnings.map((warning) => (
              <p key={warning.label} className="app__admin-formError">
                {warning.label}: {warning.error}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="app__admin-summaryGrid">
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Catalog</p>
          <h2>{products ? formatNumber(products.total) : "Unavailable"}</h2>
          <p>{products ? "Active groceries" : "Data unavailable"}</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Inventory</p>
          <h2>{inventory ? formatNumber(outOfStockItems) : "Unavailable"}</h2>
          <p>{inventory ? "Out of stock" : "Data unavailable"}</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Delivery fees</p>
          <h2>{deliveryFees ? formatNumber(deliveryFeeItems.length) : "Unavailable"}</h2>
          <p>{deliveryFees ? "Rules configured" : "Data unavailable"}</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Orders</p>
          <h2>{orders ? formatNumber(orderItems.length) : "Unavailable"}</h2>
          <p>{orders ? formatCurrencyMinor(todayRevenueMinor, orderItems[0]?.currency ?? "GBP") : "Data unavailable"}</p>
        </article>
      </section>

      <section className="app__admin-detailGrid app__admin-homeDetailGrid">
        <article className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <Link href={"/dashboard/admin/inventory" as Route} className="app__admin-sectionLink">
              <p className="app__admin-eyebrow">Watchlist</p>
              <h2>Attention</h2>
            </Link>
          </div>

          <div className="app__admin-homeMetricGrid">
            <article className="app__admin-homeMetricCard">
              <span>Low stock</span>
              <strong>{inventory ? formatNumber(lowStockItems) : "Unavailable"}</strong>
            </article>
            <article className="app__admin-homeMetricCard">
              <span>Out of stock</span>
              <strong>{inventory ? formatNumber(outOfStockItems) : "Unavailable"}</strong>
            </article>
            <article className="app__admin-homeMetricCard">
              <span>Pending substitutions</span>
              <strong>{orders ? formatNumber(pendingSubstitutions) : "Unavailable"}</strong>
            </article>
            <article className="app__admin-homeMetricCard">
              <span>Refunded orders</span>
              <strong>{orders ? formatNumber(refundedOrders) : "Unavailable"}</strong>
            </article>
          </div>
        </article>

        <article className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <Link href={"/dashboard/admin/orders" as Route} className="app__admin-sectionLink">
              <p className="app__admin-eyebrow">Recent orders</p>
              <h2>Orders</h2>
            </Link>
            <Link href={"/dashboard/admin/orders" as Route} className="app__admin-secondaryButton">
              View all
            </Link>
          </div>

          {!orders ? (
            <p className="app__admin-formError">Recent orders couldn't be loaded.</p>
          ) : orderItems.length === 0 ? (
            <p className="app__admin-inlineMeta">No recent orders.</p>
          ) : (
            <div className="app__admin-homeOrderList">
              {orderItems.slice(0, 5).map((order) => (
                <article key={order.id} className="app__admin-homeOrderRow">
                  <div className="app__admin-homeOrderMain">
                    <div className="app__admin-homeOrderTop">
                      <strong>{order.order_number}</strong>
                      <span className="app__admin-statusPill">{formatLabel(order.status)}</span>
                    </div>
                    <div className="app__admin-homeOrderMeta">
                      <span>{formatNumber(order.items.length)} items</span>
                      <span>{formatLabel(order.fulfillment_status)}</span>
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <div className="app__admin-homeOrderValue">
                    <strong>{formatCurrencyMinor(order.pricing_summary.total_minor, order.currency)}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </>
  );
}

async function ChefDashboard({
  configLabel,
}: {
  configLabel: string;
}) {
  const ordersResult = await safeDashboardLoad("Chef orders", () => fetchChefMealOrders({ limit: 20 }));
  const orders = ordersResult.data;
  const orderItems = orders?.items ?? [];

  const assignedCount = orderItems.filter((order) => order.fulfillment_status === "assigned").length;
  const preparingCount = orderItems.filter((order) => order.fulfillment_status === "preparing").length;
  const readyCount = orderItems.filter((order) => order.fulfillment_status === "ready_for_delivery").length;

  return (
    <>
      <header className="app__admin-hero">
        <div className="app__admin-heroCopy">
          <p className="app__admin-eyebrow">Dashboard</p>
          <h1 className="app__admin-title">{configLabel}</h1>
        </div>

        <div className="app__admin-heroStats">
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Assigned</span>
            <strong>{orders ? formatNumber(assignedCount) : "Unavailable"}</strong>
          </article>
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Preparing</span>
            <strong>{orders ? formatNumber(preparingCount) : "Unavailable"}</strong>
          </article>
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Ready</span>
            <strong>{orders ? formatNumber(readyCount) : "Unavailable"}</strong>
          </article>
        </div>
      </header>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Today</p>
            <h2>My orders</h2>
          </div>
        </div>

        {!orders ? (
          <p className="app__admin-formError">{ordersResult.error}</p>
        ) : orderItems.length === 0 ? (
          <p className="app__admin-inlineMeta">No orders assigned.</p>
        ) : (
          <div className="app__admin-dataList">
            {orderItems.slice(0, 5).map((order) => (
              <article key={order.id} className="app__admin-dataRow">
                <div className="app__admin-stack">
                  <strong>{order.order_number}</strong>
                  <span>{order.items.map((item) => item.meal_name).join(", ")}</span>
                </div>
                <div className="app__admin-inlineMetaList">
                  <span>{formatLabel(order.fulfillment_status)}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="app__admin-actionsWrap">
          <Link href={"/dashboard/chef/my-orders" as Route} className="app__admin-secondaryButton">
            View all
          </Link>
        </div>
      </section>
    </>
  );
}

async function ShopperDashboard({
  configLabel,
}: {
  configLabel: string;
}) {
  const ordersResult = await safeDashboardLoad("Shopper orders", () => fetchShopperGroceryOrders({ limit: 20 }));
  const orders = ordersResult.data;
  const orderItems = orders?.items ?? [];

  const assignedCount = orderItems.filter((order) => order.fulfillment_status === "assigned").length;
  const shoppingCount = orderItems.filter((order) => order.fulfillment_status === "shopping").length;
  const packedCount = orderItems.filter((order) => order.fulfillment_status === "packed").length;

  return (
    <>
      <header className="app__admin-hero">
        <div className="app__admin-heroCopy">
          <p className="app__admin-eyebrow">Dashboard</p>
          <h1 className="app__admin-title">{configLabel}</h1>
        </div>

        <div className="app__admin-heroStats">
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Assigned</span>
            <strong>{orders ? formatNumber(assignedCount) : "Unavailable"}</strong>
          </article>
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Shopping</span>
            <strong>{orders ? formatNumber(shoppingCount) : "Unavailable"}</strong>
          </article>
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Packed</span>
            <strong>{orders ? formatNumber(packedCount) : "Unavailable"}</strong>
          </article>
        </div>
      </header>

      <section className="app__admin-productSection">
        <div className="app__admin-sectionHeader">
          <div>
            <p className="app__admin-eyebrow">Today</p>
            <h2>My orders</h2>
          </div>
        </div>

        {!orders ? (
          <p className="app__admin-formError">{ordersResult.error}</p>
        ) : orderItems.length === 0 ? (
          <p className="app__admin-inlineMeta">No runs assigned.</p>
        ) : (
          <div className="app__admin-dataList">
            {orderItems.slice(0, 5).map((order) => (
              <article key={order.id} className="app__admin-dataRow">
                <div className="app__admin-stack">
                  <strong>{order.items.length} items</strong>
                  <span>{order.order_number}</span>
                </div>
                <div className="app__admin-inlineMetaList">
                  <span>{formatLabel(order.fulfillment_status)}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="app__admin-actionsWrap">
          <Link href={"/dashboard/shopper/my-orders" as Route} className="app__admin-secondaryButton">
            View all
          </Link>
        </div>
      </section>
    </>
  );
}
