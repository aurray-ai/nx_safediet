"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getRoleConfig, type DashboardNavItem, type DashboardRole } from "@/lib/roles";

type SidebarNavProps = {
  role: DashboardRole;
};

type NavBucket = {
  group: string | null;
  items: DashboardNavItem[];
};

function groupNavItems(items: DashboardNavItem[]): NavBucket[] {
  const buckets: NavBucket[] = [];
  for (const item of items) {
    const group = item.group ?? null;
    const lastBucket = buckets[buckets.length - 1];
    if (lastBucket && lastBucket.group === group) {
      lastBucket.items.push(item);
    } else {
      buckets.push({ group, items: [item] });
    }
  }
  return buckets;
}

function isItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveGroup(pathname: string, buckets: NavBucket[]) {
  const activeBucket = buckets.find((bucket) => bucket.group && bucket.items.some((item) => isItemActive(pathname, item.href)));
  return activeBucket?.group ?? null;
}

export function SidebarNav({ role }: SidebarNavProps) {
  const roleConfig = getRoleConfig(role);
  const pathname = usePathname();
  const buckets = groupNavItems(roleConfig.navItems);

  const [openGroup, setOpenGroup] = useState<string | null>(() => getActiveGroup(pathname, buckets));

  useEffect(() => {
    setOpenGroup(getActiveGroup(pathname, buckets));
  }, [pathname, role]);

  function toggleGroup(group: string) {
    setOpenGroup((current) => (current === group ? null : group));
  }

  let runningIndex = 0;

  return (
    <nav className="app__admin-nav" aria-label="Dashboard navigation">
      {buckets.map((bucket) => {
        if (!bucket.group) {
          return bucket.items.map((item) => {
            runningIndex += 1;
            const isActive = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                className={`app__admin-navItem ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="app__admin-navIndex">{String(runningIndex).padStart(2, "0")}</span>
                <span className="app__admin-navLabel">{item.label}</span>
              </Link>
            );
          });
        }

        const group = bucket.group;
        const isOpen = openGroup === group;
        const startIndex = runningIndex;
        runningIndex += bucket.items.length;

        return (
          <div key={group} className="app__admin-navGroup">
            <button
              type="button"
              className="app__admin-navGroupToggle"
              aria-expanded={isOpen}
              onClick={() => toggleGroup(group)}
            >
              <span className="app__admin-navGroupLabel">{group}</span>
              <svg
                className={`app__admin-navGroupChevron ${isOpen ? "is-open" : ""}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className={`app__admin-navGroupContent ${isOpen ? "is-open" : ""}`}>
              <div className="app__admin-navGroupItems">
                {bucket.items.map((item, offset) => {
                  const isActive = isItemActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href as Route}
                      className={`app__admin-navItem ${isActive ? "is-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="app__admin-navIndex">{String(startIndex + offset + 1).padStart(2, "0")}</span>
                      <span className="app__admin-navLabel">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
