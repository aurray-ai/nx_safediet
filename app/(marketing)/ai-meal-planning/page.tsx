import Link from "next/link";

import { HomeFinalCta } from "@/components/marketing/home/home-final-cta";
import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import styles from "@/components/marketing/home/home.module.css";
import { IconCalendar, IconPlanMealsFeature, IconShield, IconWallet, IconWand } from "@/components/marketing/home/icons";
import { BreadcrumbJsonLd } from "@/components/marketing/content/breadcrumb-jsonld";
import { PillarCrossLinks } from "@/components/marketing/content/pillar-cross-links";
import { PillarFaq } from "@/components/marketing/content/pillar-faq";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "AI Meal Planner — Budget-Friendly Weekly Plans",
  description:
    "SafeDiet's AI plans your week around your budget, allergies and goals — swap any meal in seconds. Free to start, no credit card required.",
  alternates: {
    canonical: "/ai-meal-planning",
  },
};

const BENEFITS = [
  {
    icon: IconWallet,
    title: "Budget-first, not budget-last",
    body: "Set your weekly food budget upfront. SafeDiet's AI plans every meal inside it, instead of building a plan and hoping the cost works out.",
  },
  {
    icon: IconWand,
    title: "Swap any meal, instantly",
    body: "Not feeling a suggestion? Swap it for something else in a couple of taps — the AI updates your budget and nutrition totals automatically.",
  },
  {
    icon: IconShield,
    title: "Built around your diet",
    body: "Allergies, intolerances and goals — like muscle building, weight loss, or just eating well on a budget — are respected in every plan generated.",
  },
  {
    icon: IconCalendar,
    title: "A full week, in seconds",
    body: "Breakfast, lunch and dinner planned for the whole week at once, with calories and protein worked out for you.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How does SafeDiet's AI meal planner work?",
    answer:
      "You tell SafeDiet your weekly budget, dietary needs, allergies and goals once. Its AI then generates a full week of breakfast, lunch and dinner that fits inside that budget and those restrictions.",
  },
  {
    question: "Can I change or swap meals after they're planned?",
    answer:
      "Yes. Every meal in your plan can be swapped for another option at any time, and your weekly budget and nutrition totals update automatically when you do.",
  },
  {
    question: "Does the meal planner account for allergies and dietary restrictions?",
    answer:
      "Yes. Allergies, intolerances and dietary preferences are set once in your profile and applied automatically to every plan the AI generates — they're never suggested by accident.",
  },
  {
    question: "Is AI meal planning free to use?",
    answer:
      "You can start planning for free with no credit card required. SafeDiet Plus unlocks unlimited AI meal planning alongside grocery delivery, kitchen tracking and calorie/AI meal scanning.",
  },
];

export default async function AiMealPlanningPage() {
  const session = await getSession();

  return (
    <div className={styles.home}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "AI Meal Planning", path: "/ai-meal-planning" },
        ]}
      />
      <HomeNavbar dashboardHref={session?.defaultDashboardHref ?? null} />
      <main>
        <section className={styles.catalogHero}>
          <div className={styles.wrap}>
            <IconPlanMealsFeature className={styles.pillarHeroIcon} />
            <span className={styles.eyebrow}>01 — Plan</span>
            <h1 className={styles.sharedBudgetTitle} style={{ textAlign: "center" }}>
              AI meal planning, built around your budget.
            </h1>
            <p className={styles.heroSub} style={{ margin: "18px auto 0", textAlign: "center" }}>
              Tell SafeDiet your weekly budget, dietary needs and allergies — the AI builds your
              week, and you can swap or update any meal in seconds.
            </p>
            <div className={styles.pillarHeroCtas}>
              <Link href="/start-planning" className={`${styles.btn} ${styles.btnPrimary}`}>
                Start Planning — It&apos;s Free
              </Link>
              <Link href="/meals" className={`${styles.btn} ${styles.btnGhost}`}>
                Browse Meals
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
              <h2>AI meal planning, answered</h2>
            </div>
            <PillarFaq items={FAQ_ITEMS} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>Explore SafeDiet</span>
              <h2>The rest of the picture</h2>
              <p>Meal planning is one part of SafeDiet — here&apos;s how the other pieces fit together.</p>
            </div>
            <PillarCrossLinks excludeSlug="ai-meal-planning" />
          </div>
        </section>

        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
