import { HomeFeaturedMeals } from "@/components/marketing/home/home-featured-meals";
import { HomeFinalCta } from "@/components/marketing/home/home-final-cta";
import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeMainHero } from "@/components/marketing/home/home-main-hero";
import styles from "@/components/marketing/home/home.module.css";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import { PlanMealHero } from "@/components/marketing/home/plan-meal-hero";
import { HomeRouteCompare } from "@/components/marketing/home/home-route-compare";
import { HomeSharedBudget } from "@/components/marketing/home/home-shared-budget";
import { PricingTeaser } from "@/components/marketing/home/pricing-teaser";
import { getSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className={styles.home}>
      <HomeNavbar dashboardHref={session?.defaultDashboardHref ?? null} />
      <main>
        <HomeMainHero />
        <PlanMealHero />
        <HomeRouteCompare />
        <HomeSharedBudget />
        <HomeFeaturedMeals />
        <PricingTeaser />
        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
