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

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SAFEDIET",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "iOS, Web",
  description:
    "AI meal planning built around your budget, groceries bought direct from farms, manufacturers and wholesalers, a tracked kitchen and pantry, and shared household budgeting for splitting grocery bills.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
    description: "Free to start, no credit card required.",
  },
};

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className={styles.home}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
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
