export type DashboardRole = "admin" | "user" | "chef" | "shopper" | "delivery_agent";

export type DashboardNavItem = {
  href: string;
  label: string;
  group?: string;
};

export type DashboardRoleConfig = {
  role: DashboardRole;
  label: string;
  dashboardHref: string;
  navItems: DashboardNavItem[];
};

const DASHBOARD_ROLE_PRIORITY: DashboardRole[] = [
  "admin",
  "chef",
  "shopper",
  "delivery_agent",
  "user",
];

const ROLE_ALIASES: Record<string, DashboardRole> = {
  admin: "admin",
  platform_user: "admin",
  chef: "chef",
  shopper: "shopper",
  delivery_agent: "delivery_agent",
  user: "user",
  customer: "user",
};

const ROLE_CONFIGS: Record<DashboardRole, DashboardRoleConfig> = {
  admin: {
    role: "admin",
    label: "Admin",
    dashboardHref: "/dashboard/admin",
    navItems: [
      { href: "/dashboard/admin", label: "Home" },
      { href: "/dashboard/admin/products", label: "Groceries", group: "Catalog" },
      { href: "/dashboard/admin/meals", label: "Meals", group: "Catalog" },
      { href: "/dashboard/admin/inventory", label: "Inventory", group: "Catalog" },
      { href: "/dashboard/admin/discounts", label: "Discounts", group: "Pricing" },
      { href: "/dashboard/admin/delivery-fees", label: "Delivery fees", group: "Pricing" },
      { href: "/dashboard/admin/customers", label: "Customers", group: "Customers" },
      { href: "/dashboard/admin/orders", label: "Orders", group: "Orders & Fulfillment" },
      { href: "/dashboard/admin/meal-orders", label: "Meal orders", group: "Orders & Fulfillment" },
      { href: "/dashboard/admin/fulfillment", label: "Fulfillment", group: "Orders & Fulfillment" },
      { href: "/dashboard/admin/chefs", label: "Chefs", group: "Team" },
      { href: "/dashboard/admin/shoppers", label: "Shoppers", group: "Team" },
      { href: "/dashboard/admin/staff", label: "Staff", group: "Team" },
      { href: "/dashboard/admin/promotions", label: "Promotions", group: "Engagement" },
      { href: "/dashboard/admin/surveys", label: "Surveys", group: "Engagement" },
    ],
  },
  user: {
    role: "user",
    label: "User",
    dashboardHref: "/dashboard/user",
    navItems: [{ href: "/dashboard/user", label: "Home" }],
  },
  chef: {
    role: "chef",
    label: "Chef",
    dashboardHref: "/dashboard/chef",
    navItems: [
      { href: "/dashboard/chef", label: "Home" },
      { href: "/dashboard/chef/my-orders", label: "My orders" },
      { href: "/dashboard/chef/history", label: "History" },
    ],
  },
  shopper: {
    role: "shopper",
    label: "Shopper",
    dashboardHref: "/dashboard/shopper",
    navItems: [
      { href: "/dashboard/shopper", label: "Home" },
      { href: "/dashboard/shopper/my-orders", label: "My orders" },
      { href: "/dashboard/shopper/history", label: "History" },
    ],
  },
  delivery_agent: {
    role: "delivery_agent",
    label: "Delivery Agent",
    dashboardHref: "/dashboard/delivery-agent",
    navItems: [{ href: "/dashboard/delivery-agent", label: "Home" }],
  },
};

const ROLE_TO_SLUG: Record<DashboardRole, string> = {
  admin: "admin",
  user: "user",
  chef: "chef",
  shopper: "shopper",
  delivery_agent: "delivery-agent",
};

const SLUG_TO_ROLE: Record<string, DashboardRole> = {
  admin: "admin",
  user: "user",
  chef: "chef",
  shopper: "shopper",
  "delivery-agent": "delivery_agent",
};

export function resolveDashboardRole(userTypes: readonly string[]): DashboardRole | null {
  const normalized = new Set(userTypes.map((userType) => ROLE_ALIASES[userType] ?? null));

  for (const role of DASHBOARD_ROLE_PRIORITY) {
    if (normalized.has(role)) {
      return role;
    }
  }

  return null;
}

export function getDashboardHrefForRole(role: DashboardRole): string {
  return ROLE_CONFIGS[role].dashboardHref;
}

export function getRoleConfig(role: DashboardRole): DashboardRoleConfig {
  return ROLE_CONFIGS[role];
}

export function getRoleSlug(role: DashboardRole): string {
  return ROLE_TO_SLUG[role];
}

export function getRoleFromSlug(slug: string): DashboardRole | null {
  return SLUG_TO_ROLE[slug] ?? null;
}
