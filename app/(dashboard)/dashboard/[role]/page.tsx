import { getRoleConfig, getRoleFromSlug } from "@/lib/roles";
import { fetchAdminInventory, fetchAdminOrders, fetchAdminProductsPage, fetchDeliveryFeeRules } from "@/lib/api";
import { formatCurrencyMinor, formatLabel, formatNumber } from "@/lib/admin-format";

export default function DashboardRolePage({
  params,
}: {
  params: { role: string };
}) {
  const role = getRoleFromSlug(params.role) ?? "user";
  const config = getRoleConfig(role);

  const roleCopyMap = {
    admin: {
      eyebrow: "Admin side",
      title: "Operations dashboard",
      description: "Manage catalog, meals, delivery, and promotions from one workspace.",
    },
    platform_user: {
      eyebrow: "Platform side",
      title: "Operations dashboard",
      description: "Manage catalog, meals, delivery, and promotions from one workspace.",
    },
    chef: {
      eyebrow: "Chef side",
      title: "Kitchen workspace",
      description: "Track prep, meal readiness, and handoff flow from one cleaner internal workspace.",
    },
    shopper: {
      eyebrow: "Shopper side",
      title: "Fulfillment workspace",
      description: "Handle grocery runs, substitutions, and handoff status without leaving the Safediet app.",
    },
    delivery_agent: {
      eyebrow: "Delivery side",
      title: "Route workspace",
      description: "Review assigned drops, route progress, and proof of delivery from one compact view.",
    },
    user: {
      eyebrow: "User side",
      title: "Account workspace",
      description: "See account-side tools, plan support, and customer actions in a lighter internal shell.",
    },
  } as const;
  const roleCopy = roleCopyMap[role as keyof typeof roleCopyMap];

  const roleCardsMap = {
    admin: [
      { title: "Catalog control", text: "Keep grocery records, pricing, and availability aligned across the platform." },
      { title: "Meal operations", text: "Review meal coverage, detail completeness, and publishing readiness." },
      { title: "Promotion planning", text: "Prepare campaign windows, launch visibility, and promotional tracking." },
      { title: "Delivery oversight", text: "Watch handoff health, delays, and cross-team operational risk." },
    ],
    platform_user: [
      { title: "Catalog control", text: "Keep grocery records, pricing, and availability aligned across the platform." },
      { title: "Meal operations", text: "Review meal coverage, detail completeness, and publishing readiness." },
      { title: "Promotion planning", text: "Prepare campaign windows, launch visibility, and promotional tracking." },
      { title: "Delivery oversight", text: "Watch handoff health, delays, and cross-team operational risk." },
    ],
    chef: [
      { title: "Prep queue", text: "See assigned meals, current kitchen load, and readiness priorities." },
      { title: "Kitchen signals", text: "Track blockers, quality checks, and prep handoff notes." },
      { title: "Coverage", text: "Watch shift capacity and balance upcoming production needs." },
    ],
    shopper: [
      { title: "Run list", text: "Stay on top of assigned grocery runs and urgent picks." },
      { title: "Substitutions", text: "Review out-of-stock decisions and replacement options." },
      { title: "Collection status", text: "Keep handoff readiness and completion tracking tight." },
    ],
    delivery_agent: [
      { title: "Route queue", text: "Review active drops, stop order, and route progress." },
      { title: "Exceptions", text: "Capture delays, access issues, and customer delivery notes." },
      { title: "Completion", text: "Confirm drop-offs and maintain proof-of-delivery flow." },
    ],
    user: [
      { title: "Account access", text: "Manage profile details and available internal account controls." },
      { title: "Plan support", text: "Keep plan-related follow-up actions visible and accessible." },
      { title: "Requests", text: "Handle customer-side needs and service updates from one place." },
    ],
  } as const;
  const roleCards = roleCardsMap[role as keyof typeof roleCardsMap];

  const activeSection = {
    label: "Dashboard home",
    eyebrow: "Dashboard home",
    description: "Start with the high-level workspace summary and the most important operating surfaces.",
  };

  if (role !== "admin") {
    return (
      <>
        <header className="app__admin-hero">
          <div className="app__admin-heroCopy">
            <p className="app__admin-eyebrow">{activeSection.eyebrow}</p>
            <h1 className="app__admin-title">{config.label} dashboard</h1>
            <p className="app__admin-copy">{activeSection.description}</p>
            <p className="app__admin-supportingCopy">{roleCopy.description}</p>
          </div>

          <div className="app__admin-heroStats">
            <article className="app__admin-statCard">
              <span className="app__admin-userLabel">Signed in as</span>
              <strong>{config.label}</strong>
            </article>
            <article className="app__admin-statCard">
              <span className="app__admin-userLabel">Active role</span>
              <strong>{config.label}</strong>
            </article>
            <article className="app__admin-statCard">
              <span className="app__admin-userLabel">Section</span>
              <strong>{activeSection.label}</strong>
            </article>
          </div>
        </header>

        <section className="app__admin-panels">
          <article className="app__admin-panel app__admin-panel--feature">
            <p className="app__admin-eyebrow">{roleCopy.eyebrow}</p>
            <h2>Workspace</h2>
            <p>Use the sidebar to move between operating areas.</p>
          </article>

          <article className="app__admin-panel">
            <p className="app__admin-eyebrow">Current section</p>
            <h2>{activeSection.label}</h2>
            <p>{activeSection.description}</p>
          </article>
        </section>

        <section className="app__admin-grid">
          {roleCards.map((card) => (
            <article className="app__admin-card" key={card.title}>
              <p className="app__admin-userLabel">{activeSection.label}</p>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          ))}
        </section>
      </>
    );
  }

  return <AdminDashboard configLabel={config.label} roleCopy={roleCopy.description} />;
}

async function AdminDashboard({
  configLabel,
  roleCopy,
}: {
  configLabel: string;
  roleCopy: string;
}) {
  const [products, inventory, orders, deliveryFees] = await Promise.all([
    fetchAdminProductsPage({ page: 1, pageSize: 100 }),
    fetchAdminInventory({ page: 1, pageSize: 100 }),
    fetchAdminOrders({ limit: 20 }),
    fetchDeliveryFeeRules(),
  ]);

  const activeProducts = products.items.filter((product) => product.is_active).length;
  const lowStockItems = inventory.items.filter((item) => item.available_quantity > 0 && item.available_quantity <= 10).length;
  const outOfStockItems = inventory.items.filter((item) => item.available_quantity <= 0).length;
  const pendingSubstitutions = orders.items.reduce(
    (total, order) => total + order.items.filter((item) => item.allow_substitutions && item.substitution_resolution === "none").length,
    0,
  );
  const todayRevenueMinor = orders.items
    .filter((order) => order.status !== "canceled" && order.status !== "payment_failed")
    .reduce((total, order) => total + order.pricing_summary.total_minor, 0);

  return (
    <>
      <header className="app__admin-hero">
        <div className="app__admin-heroCopy">
          <p className="app__admin-eyebrow">Operations dashboard</p>
          <h1 className="app__admin-title">{configLabel} dashboard</h1>
          <p className="app__admin-copy">Watch catalog health, stock risk, delivery pricing, and order exceptions from one place.</p>
          <p className="app__admin-supportingCopy">{roleCopy}</p>
        </div>

        <div className="app__admin-heroStats">
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Active products</span>
            <strong>{formatNumber(activeProducts)}</strong>
          </article>
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Low stock</span>
            <strong>{formatNumber(lowStockItems)}</strong>
          </article>
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Order exceptions</span>
            <strong>{formatNumber(pendingSubstitutions)}</strong>
          </article>
        </div>
      </header>

      <section className="app__admin-summaryGrid">
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Catalog</p>
          <h2>{formatNumber(products.total)}</h2>
          <p>{formatNumber(activeProducts)} active groceries ready for merchandising.</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Inventory</p>
          <h2>{formatNumber(outOfStockItems)}</h2>
          <p>Out-of-stock items that need restocking or deactivation.</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Delivery fees</p>
          <h2>{formatNumber(deliveryFees.items.length)}</h2>
          <p>Active and inactive weight bands configured for checkout.</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Orders loaded</p>
          <h2>{formatNumber(orders.items.length)}</h2>
          <p>{formatCurrencyMinor(todayRevenueMinor, orders.items[0]?.currency ?? "GBP")} in loaded order value.</p>
        </article>
      </section>

      <section className="app__admin-detailGrid">
        <article className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Operational watchlist</p>
              <h2>What needs attention</h2>
            </div>
          </div>

          <div className="app__admin-detailList">
            <div className="app__admin-detailRow">
              <span>Low stock items</span>
              <strong>{formatNumber(lowStockItems)}</strong>
            </div>
            <div className="app__admin-detailRow">
              <span>Out-of-stock items</span>
              <strong>{formatNumber(outOfStockItems)}</strong>
            </div>
            <div className="app__admin-detailRow">
              <span>Pending substitution decisions</span>
              <strong>{formatNumber(pendingSubstitutions)}</strong>
            </div>
            <div className="app__admin-detailRow">
              <span>Refunded orders in loaded set</span>
              <strong>{formatNumber(orders.items.filter((order) => order.status === "refunded" || order.status === "partially_refunded").length)}</strong>
            </div>
          </div>
        </article>

        <article className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Recent orders</p>
              <h2>Queue snapshot</h2>
            </div>
          </div>

          <div className="app__admin-dataList">
            {orders.items.slice(0, 5).map((order) => (
              <article key={order.id} className="app__admin-dataRow">
                <div className="app__admin-stack">
                  <strong>{order.order_number}</strong>
                  <span>{order.user_id}</span>
                </div>
                <div className="app__admin-inlineMetaList">
                  <span>{formatLabel(order.status)}</span>
                  <span>{formatCurrencyMinor(order.pricing_summary.total_minor, order.currency)}</span>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
