import { HomeFinalCta } from "@/components/marketing/home/home-final-cta";
import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import styles from "@/components/marketing/home/home.module.css";
import { PricingTeaser } from "@/components/marketing/home/pricing-teaser";
import { getSession } from "@/lib/session";

import { HowItWorksSteps } from "./how-it-works-steps";
import { WhyItWorks } from "./why-it-works";

export const metadata = {
  title: "How It Works",
  description:
    "SAFEDIET agents plan your meals around your budget, you shop them at wholesale prices, and your household tracks the spend together.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default async function HowItWorksPage() {
  const session = await getSession();

  return (
    <div className={styles.home}>
      <HomeNavbar dashboardHref={session?.defaultDashboardHref ?? null} />
      <main>
        <section className={styles.catalogHero}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>How it works</span>
            <h1 className={styles.sharedBudgetTitle} style={{ textAlign: "center" }}>
              From your weekly budget to your door, in six steps.
            </h1>
            <p className={styles.heroSub} style={{ margin: "18px auto 0", textAlign: "center" }}>
              One connected system — tell it your budget once, and SAFEDIET plans, sources and
              delivers the rest.
            </p>
          </div>
        </section>

        <HowItWorksSteps />
        <WhyItWorks />
        <PricingTeaser />
        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
