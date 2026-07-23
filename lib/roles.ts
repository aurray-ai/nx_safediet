export type DashboardRole = "admin" | "user" | "chef" | "shopper" | "delivery_agent";

export type DashboardNavItem = {
  href: string;
  label: string;
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
      { href: "/dashboard/admin/products", label: "Groceries" },
      { href: "/dashboard/admin/inventory", label: "Inventory" },
      { href: "/dashboard/admin/orders", label: "Orders" },
      { href: "/dashboard/admin/delivery-fees", label: "Delivery fees" },
      { href: "/dashboard/admin/meals", label: "Meals" },
      { href: "/dashboard/admin/promotions", label: "Promotions" },
      { href: "/dashboard/admin/surveys", label: "Surveys" },
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
    navItems: [{ href: "/dashboard/chef", label: "Home" }],
  },
  shopper: {
    role: "shopper",
    label: "Shopper",
    dashboardHref: "/dashboard/shopper",
    navItems: [{ href: "/dashboard/shopper", label: "Home" }],
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
