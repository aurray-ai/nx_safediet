import Link from "next/link";

import { HomeFinalCta } from "@/components/marketing/home/home-final-cta";
import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import styles from "@/components/marketing/home/home.module.css";
import {
  IconBuyDirectFeature,
  IconCheckCircle,
  IconDeliveryVan,
  IconFarm,
  IconWallet,
} from "@/components/marketing/home/icons";
import { BreadcrumbJsonLd } from "@/components/marketing/content/breadcrumb-jsonld";
import { PillarCrossLinks } from "@/components/marketing/content/pillar-cross-links";
import { PillarFaq } from "@/components/marketing/content/pillar-faq";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Grocery Delivery — Direct From Farms & Wholesalers",
  description:
    "SafeDiet buys your groceries direct from farms, manufacturers and wholesalers instead of a marked-up retailer, and delivers straight to your door.",
  alternates: {
    canonical: "/grocery-delivery",
  },
};

const BENEFITS = [
  {
    icon: IconFarm,
    title: "Direct from the source",
    body: "Produce comes from farms, pantry staples from manufacturers, and bulk items from wholesalers — not a supermarket that's already added its own markup.",
  },
  {
    icon: IconWallet,
    title: "Save 20–30% vs. retail",
    body: "Cutting out the middleman markup means the same groceries typically cost meaningfully less than buying them at a standard supermarket.",
  },
  {
    icon: IconDeliveryVan,
    title: "Delivered to your door",
    body: "No shop trip needed — your order arrives on your schedule, matched to the meals you've actually got planned.",
  },
  {
    icon: IconCheckCircle,
    title: "Matched to your meal plan",
    body: "Groceries are ordered around what you're actually cooking that week, so you're not guessing what to buy.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How is buying direct from wholesalers cheaper than a supermarket?",
    answer:
      "Supermarkets add their own retail markup on top of what they pay farms, manufacturers and wholesalers. SafeDiet buys from those same sources directly, so that markup isn't part of your price.",
  },
  {
    question: "Where does SafeDiet actually source groceries from?",
    answer:
      "Produce and dairy are sourced farm-direct, pantry staples manufacturer-direct, and bulk items wholesaler-direct — whichever source gets you the best price for that item.",
  },
  {
    question: "Do I still get fresh produce buying this way?",
    answer:
      "Yes — produce is sourced directly from farms specifically because it's fresher and cheaper than going through a retail middleman.",
  },
  {
    question: "Is grocery delivery included in my SafeDiet plan?",
    answer:
      "Doorstep delivery of your groceries is part of SafeDiet Plus, alongside unlimited AI meal planning, kitchen tracking and calorie tracking.",
  },
];

export default async function GroceryDeliveryPage() {
  const session = await getSession();

  return (
    <div className={styles.home}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Grocery Delivery", path: "/grocery-delivery" },
        ]}
      />
      <HomeNavbar dashboardHref={session?.defaultDashboardHref ?? null} />
      <main>
        <section className={styles.catalogHero}>
          <div className={styles.wrap}>
            <IconBuyDirectFeature className={styles.pillarHeroIcon} />
            <span className={styles.eyebrow}>02 — Source</span>
            <h1 className={styles.sharedBudgetTitle} style={{ textAlign: "center" }}>
              Skip the markup. Buy groceries direct.
            </h1>
            <p className={styles.heroSub} style={{ margin: "18px auto 0", textAlign: "center" }}>
              SafeDiet buys your groceries straight from farms, manufacturers and wholesalers —
              not a retailer that&apos;s already added its own markup — and delivers to your door.
            </p>
            <div className={styles.pillarHeroCtas}>
              <Link href="/start-planning" className={`${styles.btn} ${styles.btnPrimary}`}>
                Start Planning — It&apos;s Free
              </Link>
              <Link href="/#pricing" className={`${styles.btn} ${styles.btnGhost}`}>
                See Pricing
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.stepsRail}>
              {BENEFITS.map((benefit) => (
                <div className={styles.step} key={benefit.title}>
                  <div className={styles.stepIconWrap}>
                    <div className={styles.stepIcon}>
                      <benefit.icon />
                    </div>
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>Questions</span>
              <h2>Direct grocery sourcing, answered</h2>
            </div>
            <PillarFaq items={FAQ_ITEMS} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>Explore SafeDiet</span>
              <h2>The rest of the picture</h2>
              <p>Direct sourcing is one part of SafeDiet — here&apos;s how the other pieces fit together.</p>
            </div>
            <PillarCrossLinks excludeSlug="grocery-delivery" />
          </div>
        </section>

        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
