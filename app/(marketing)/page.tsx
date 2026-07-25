import { HomeFeaturedMeals } from "@/components/marketing/home/home-featured-meals";
import { HomeFinalCta } from "@/components/marketing/home/home-final-cta";
import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeHero } from "@/components/marketing/home/home-hero";
import { HomeHowItWorks } from "@/components/marketing/home/home-how-it-works";
import styles from "@/components/marketing/home/home.module.css";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import { HomeSharedBudget } from "@/components/marketing/home/home-shared-budget";
import { HomeWeeklyPlan } from "@/components/marketing/home/home-weekly-plan";

export default function HomePage() {
  return (
    <div className={styles.home}>
      <HomeNavbar />
      <main>
        <HomeHero />
        <HomeHowItWorks />
        <HomeWeeklyPlan />
        <HomeSharedBudget />
        <HomeFeaturedMeals />
        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
