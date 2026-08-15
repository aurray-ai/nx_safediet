import Link from "next/link";

import { HomeFinalCta } from "@/components/marketing/home/home-final-cta";
import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import styles from "@/components/marketing/home/home.module.css";
import {
  IconBarChart,
  IconHousehold,
  IconPersonPlus,
  IconShareSaveFeature,
  IconSliders,
} from "@/components/marketing/home/icons";
import { BreadcrumbJsonLd } from "@/components/marketing/content/breadcrumb-jsonld";
import { PillarCrossLinks } from "@/components/marketing/content/pillar-cross-links";
import { PillarFaq } from "@/components/marketing/content/pillar-faq";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Split Grocery Bills With Your Household",
  description:
    "Pool one shared grocery budget with roommates, partners or family, split costs fairly, and always know who owes what. Free for every household member.",
  alternates: {
    canonical: "/split-grocery-bills",
  },
};

const BENEFITS = [
  {
    icon: IconHousehold,
    title: "One shared budget",
    body: "Everyone's grocery spending rolls up in real time against one weekly or monthly household budget — no separate spreadsheets to keep updated.",
  },
  {
    icon: IconSliders,
    title: "Split fairly",
    body: "Choose an equal split or a weighted one that fits your household, instead of guesswork or awkward conversations about who paid for what.",
  },
  {
    icon: IconBarChart,
    title: "Always know who owes what",
    body: "Running balances per person mean it's always clear where things stand — no chasing people down at the end of the month.",
  },
  {
    icon: IconPersonPlus,
    title: "Free for every member",
    body: "Shared household budgeting isn't a premium feature — anyone you invite can join and use it, whether or not they're a SafeDiet Plus subscriber.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How does splitting grocery bills work in SafeDiet?",
    answer:
      "Everyone in your household contributes to and spends from one shared grocery budget. SafeDiet tracks who's paid in, what's been spent, and calculates a running balance so it's always clear who owes what.",
  },
  {
    question: "Is shared household budgeting free?",
    answer:
      "Yes. Splitting grocery bills and shared budgeting is free for every member of a household, regardless of whether they're subscribed to SafeDiet Plus.",
  },
  {
    question: "Can I split costs unevenly between housemates?",
    answer:
      "Yes — you can choose an equal split across everyone, or a weighted split that better reflects your household's arrangement.",
  },
  {
    question: "How many people can join a shared household budget?",
    answer:
      "You can invite as many housemates, partners or family members as your household actually has — everyone joins the same shared budget.",
  },
  {
    question: "Does everyone need their own SafeDiet account?",
    answer:
      "Yes, each household member creates their own free account to join and contribute to the shared budget, so contributions and balances are tracked per person.",
  },
];

export default async function SplitGroceryBillsPage() {
  const session = await getSession();

  return (
    <div className={styles.home}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Split Grocery Bills", path: "/split-grocery-bills" },
        ]}
      />
      <HomeNavbar dashboardHref={session?.defaultDashboardHref ?? null} />
      <main>
        <section className={styles.catalogHero}>
          <div className={styles.wrap}>
            <IconShareSaveFeature className={styles.pillarHeroIcon} />
            <span className={styles.eyebrow}>04 — Split</span>
            <h1 className={styles.sharedBudgetTitle} style={{ textAlign: "center" }}>
              Split grocery bills, fairly, with your household.
            </h1>
            <p className={styles.heroSub} style={{ margin: "18px auto 0", textAlign: "center" }}>
              Pool one shared grocery budget with roommates, partners or family, split costs
              fairly, and always know who owes what — free for everyone in the household.
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
              <h2>Splitting grocery bills, answered</h2>
            </div>
            <PillarFaq items={FAQ_ITEMS} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>Explore SafeDiet</span>
              <h2>The rest of the picture</h2>
              <p>Shared budgeting is one part of SafeDiet — here&apos;s how the other pieces fit together.</p>
            </div>
            <PillarCrossLinks excludeSlug="split-grocery-bills" />
          </div>
        </section>

        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
