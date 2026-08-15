import Link from "next/link";

import { HomeFinalCta } from "@/components/marketing/home/home-final-cta";
import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import styles from "@/components/marketing/home/home.module.css";
import {
  IconCalendar,
  IconCheckCircle,
  IconDeliveryVan,
  IconLeaf,
  IconStockPantryFeature,
} from "@/components/marketing/home/icons";
import { BreadcrumbJsonLd } from "@/components/marketing/content/breadcrumb-jsonld";
import { PillarCrossLinks } from "@/components/marketing/content/pillar-cross-links";
import { PillarFaq } from "@/components/marketing/content/pillar-faq";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Kitchen & Pantry Tracker — Reduce Food Waste",
  description:
    "SafeDiet keeps track of what's in your kitchen — what's arrived, what's reserved for a meal, and what's running low — so nothing goes to waste.",
  alternates: {
    canonical: "/kitchen-pantry-tracker",
  },
};

const BENEFITS = [
  {
    icon: IconDeliveryVan,
    title: "Deliveries added automatically",
    body: "Import a delivered grocery order straight into your kitchen inventory in a couple of taps — no manual re-entry.",
  },
  {
    icon: IconCalendar,
    title: "See what's reserved for meals",
    body: "Ingredients earmarked for this week's plan are tracked separately from your general stock, so you always know what's spoken for.",
  },
  {
    icon: IconLeaf,
    title: "Reduce food waste",
    body: "Knowing what's already on hand before you buy more means less duplicate shopping, and less food going unused.",
  },
  {
    icon: IconCheckCircle,
    title: "Simple manual add",
    body: "Already got groceries you didn't order through SafeDiet? Add them to your kitchen in a few taps and track them the same way.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does SafeDiet automatically track groceries I buy elsewhere?",
    answer:
      "Orders delivered through SafeDiet can be imported into your kitchen inventory automatically. Groceries bought elsewhere can be added manually in a few taps.",
  },
  {
    question: "How does the pantry tracker reduce food waste?",
    answer:
      "By showing what you already have on hand before you plan or buy more, so you're less likely to duplicate purchases or let ingredients go unused.",
  },
  {
    question: "Can I manually add items to my kitchen inventory?",
    answer:
      "Yes — you can add any item with a quantity and unit, whether or not it came from a SafeDiet order.",
  },
  {
    question: "Does it tell me when I'm running low on something?",
    answer:
      "Your kitchen inventory shows what's available, what's reserved for upcoming meals, and what's been consumed, so it's easy to see what needs topping up.",
  },
];

export default async function KitchenPantryTrackerPage() {
  const session = await getSession();

  return (
    <div className={styles.home}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Kitchen & Pantry Tracker", path: "/kitchen-pantry-tracker" },
        ]}
      />
      <HomeNavbar dashboardHref={session?.defaultDashboardHref ?? null} />
      <main>
        <section className={styles.catalogHero}>
          <div className={styles.wrap}>
            <IconStockPantryFeature className={styles.pillarHeroIcon} />
            <span className={styles.eyebrow}>03 — Stock</span>
            <h1 className={styles.sharedBudgetTitle} style={{ textAlign: "center" }}>
              Know what&apos;s in your kitchen, always.
            </h1>
            <p className={styles.heroSub} style={{ margin: "18px auto 0", textAlign: "center" }}>
              SafeDiet keeps track of what&apos;s in your pantry — what&apos;s arrived, what&apos;s
              reserved for a meal, and what&apos;s running low — so nothing goes to waste.
            </p>
            <div className={styles.pillarHeroCtas}>
              <Link href="/start-planning" className={`${styles.btn} ${styles.btnPrimary}`}>
                Start Planning — It&apos;s Free
              </Link>
              <Link href="/how-it-works" className={`${styles.btn} ${styles.btnGhost}`}>
                See How It Works
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
              <h2>Kitchen &amp; pantry tracking, answered</h2>
            </div>
            <PillarFaq items={FAQ_ITEMS} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>Explore SafeDiet</span>
              <h2>The rest of the picture</h2>
              <p>Your kitchen is one part of SafeDiet — here&apos;s how the other pieces fit together.</p>
            </div>
            <PillarCrossLinks excludeSlug="kitchen-pantry-tracker" />
          </div>
        </section>

        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
