import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { getRoleConfig, getRoleFromSlug, getRoleSlug } from "@/lib/roles";
import { getSession } from "@/lib/session";

export default async function DashboardRoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { role: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const roleFromPath = getRoleFromSlug(params.role);
  if (!roleFromPath || getRoleSlug(session.activeRole) !== params.role) {
    redirect(session.defaultDashboardHref);
  }

  const roleConfig = getRoleConfig(session.activeRole);

  return (
    <main className="app__admin">
      <div className="app__admin-shell">
        <aside className="app__admin-sidebar">
          <Link href="/" className="app__admin-sidebarBrand">
            <Image src="/brand/logo.png" alt="Safediet logo" width={72} height={72} className="app__admin-logo" />
            <div>
              <p className="app__admin-eyebrow">Safediet internal</p>
              <strong className="app__admin-sidebarTitle">{roleConfig.label} workspace</strong>
            </div>
          </Link>
          <p className="app__admin-copy">{session.user.email}</p>
          <SidebarNav role={session.activeRole} />
          <div className="app__admin-sidebarCard">
            <span className="app__admin-userLabel">Account</span>
            <strong>{session.user.name}</strong>
            <span>{roleConfig.label}</span>
          </div>
          <div className="app__admin-sidebarActions">
            <Link href="/" className="app__admin-link">
              Marketing site
            </Link>
            <LogoutButton />
          </div>
        </aside>

        <main className="app__admin-main">{children}</main>
      </div>
    </main>
  );
}
