import type { ReactNode } from "react";

import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import styles from "@/components/marketing/home/home.module.css";
import { getSession } from "@/lib/session";

type PublicSiteLayoutProps = {
  children: ReactNode;
};

export async function PublicSiteLayout({ children }: PublicSiteLayoutProps) {
  const session = await getSession();

  return (
    <div className={styles.home}>
      <HomeNavbar dashboardHref={session?.defaultDashboardHref ?? null} />
      <main>{children}</main>
      <HomeFooter />
    </div>
  );
}
