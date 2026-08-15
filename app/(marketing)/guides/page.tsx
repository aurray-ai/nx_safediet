import Link from "next/link";

import { HomeFinalCta } from "@/components/marketing/home/home-final-cta";
import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import styles from "@/components/marketing/home/home.module.css";
import { BreadcrumbJsonLd } from "@/components/marketing/content/breadcrumb-jsonld";
import { guides } from "@/components/marketing/content/guides-data";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Guides — Budget Meal Planning, Grocery Savings & More",
  description:
    "Practical guides on meal planning on a budget, buying groceries direct from wholesalers, reducing food waste, and splitting grocery bills with your household.",
  alternates: {
    canonical: "/guides",
  },
};

export default async function GuidesIndexPage() {
  const session = await getSession();

  return (
    <div className={styles.home}>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]} />
      <HomeNavbar dashboardHref={session?.defaultDashboardHref ?? null} />
      <main>
        <section className={styles.catalogHero}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Guides</span>
            <h1 className={styles.sharedBudgetTitle} style={{ textAlign: "center" }}>
              Practical guides to eating well on a budget.
            </h1>
            <p className={styles.heroSub} style={{ margin: "18px auto 0", textAlign: "center" }}>
              Real advice on meal planning, buying groceries direct, reducing food waste, and
              splitting costs with your household.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.guidesGrid}>
              {guides.map((guide) => (
                <Link className={styles.guideCard} href={`/guides/${guide.slug}`} key={guide.slug}>
                  <span className={styles.guideCardTag}>{guide.tag}</span>
                  <h2 className={styles.guideCardTitle}>{guide.title}</h2>
                  <p className={styles.guideCardExcerpt}>{guide.excerpt}</p>
                  <span className={styles.guideMeta} style={{ justifyContent: "flex-start" }}>
                    {guide.readingTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
