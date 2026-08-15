import Link from "next/link";

import { DashedHeartDoodle, DashedLeafDoodle } from "./decor";
import styles from "./home.module.css";
import {
  IconBuyDirectFeature,
  IconPlanMealsFeature,
  IconShareSaveFeature,
  IconStockPantryFeature,
} from "./icons";

const FEATURE_CARDS = [
  { icon: IconPlanMealsFeature, label: "Plan Meals", href: "/ai-meal-planning" },
  { icon: IconBuyDirectFeature, label: "Buy Direct", href: "/grocery-delivery" },
  { icon: IconStockPantryFeature, label: "Stock Pantry", href: "/kitchen-pantry-tracker" },
  { icon: IconShareSaveFeature, label: "Share & Save", href: "/split-grocery-bills" },
] as const;

function Clause({ children }: { children: string }) {
  return (
    <>
      {children}
      <span className={styles.mainHeroDot}>.</span>
    </>
  );
}

export function HomeMainHero() {
  return (
    <section className={styles.mainHero}>
      <div className={styles.wrap}>
        <div className={styles.mainHeroDecor} aria-hidden="true">
          <DashedLeafDoodle style={{ position: "absolute", left: "0%", top: "34%", width: 240, height: 155 }} />
          <DashedHeartDoodle style={{ position: "absolute", right: "1%", top: "22%", width: 230, height: 170 }} />
        </div>

        <div className={styles.mainHeroContent}>
          <h1 className={styles.mainHeroTitle}>
            <Clause>Plan better</Clause>
            <br />
            <Clause>Source smarter</Clause> <Clause>Stock easily</Clause> <Clause>Split fairly</Clause>
          </h1>

          <svg className={styles.mainHeroUnderline} viewBox="0 0 170 14" fill="none" aria-hidden="true">
            <path d="M4 8c30-9 106-9 162 0" stroke="#d9a43d" strokeWidth="2.4" strokeLinecap="round" />
          </svg>

          <p className={styles.mainHeroSub}>
            The all-in-one way to plan meals around your budget, buy direct and manage your kitchen
            together.
          </p>

          <div className={styles.mainHeroCards}>
            {FEATURE_CARDS.map(({ icon: Icon, label, href }) => (
              <Link className={styles.mainHeroCard} key={label} href={href}>
                <Icon className={styles.mainHeroCardIcon} />
                <span className={styles.mainHeroCardLabel}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
