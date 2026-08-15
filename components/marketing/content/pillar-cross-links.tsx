import Link from "next/link";

import styles from "@/components/marketing/home/home.module.css";
import {
  IconBuyDirectFeature,
  IconPlanMealsFeature,
  IconShareSaveFeature,
  IconStockPantryFeature,
} from "@/components/marketing/home/icons";

const ALL_PILLARS = [
  {
    slug: "ai-meal-planning",
    icon: IconPlanMealsFeature,
    label: "AI Meal Planning",
    sub: "Weekly plans built around your budget",
  },
  {
    slug: "grocery-delivery",
    icon: IconBuyDirectFeature,
    label: "Grocery Delivery",
    sub: "Bought direct from farms & wholesalers",
  },
  {
    slug: "kitchen-pantry-tracker",
    icon: IconStockPantryFeature,
    label: "Kitchen & Pantry Tracker",
    sub: "Know what you have, reduce waste",
  },
  {
    slug: "split-grocery-bills",
    icon: IconShareSaveFeature,
    label: "Split Grocery Bills",
    sub: "One shared budget, split fairly",
  },
] as const;

export function PillarCrossLinks({ excludeSlug }: { excludeSlug: string }) {
  const others = ALL_PILLARS.filter((pillar) => pillar.slug !== excludeSlug);

  return (
    <div className={styles.pillarLinksGrid}>
      {others.map(({ slug, icon: Icon, label, sub }) => (
        <Link className={styles.pillarLinkCard} href={`/${slug}`} key={slug}>
          <Icon className={styles.pillarLinkIcon} />
          <span>
            <span className={styles.pillarLinkLabel}>{label}</span>
            <span className={styles.pillarLinkSub}>{sub}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
