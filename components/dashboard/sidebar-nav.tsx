"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getRoleConfig, type DashboardRole } from "@/lib/roles";

type SidebarNavProps = {
  role: DashboardRole;
};

export function SidebarNav({ role }: SidebarNavProps) {
  const roleConfig = getRoleConfig(role);
  const pathname = usePathname();

  return (
    <nav className="app__admin-nav" aria-label="Dashboard navigation">
      {roleConfig.navItems.map((item, index) => (
        <Link
          key={item.href}
          href={item.href as Route}
          className={`app__admin-navItem ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? "is-active" : ""}`}
          aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
        >
          <span className="app__admin-navIndex">{String(index + 1).padStart(2, "0")}</span>
          <span className="app__admin-navLabel">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
