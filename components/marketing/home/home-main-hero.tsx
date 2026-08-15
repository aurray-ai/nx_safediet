import { DashedHeartDoodle, DashedLeafDoodle } from "./decor";
import styles from "./home.module.css";
import {
  IconBuyDirectFeature,
  IconPlanMealsFeature,
  IconShareSaveFeature,
  IconStockPantryFeature,
} from "./icons";

const STARS = [0, 1, 2, 3, 4];

const FEATURE_CARDS = [
  { icon: IconPlanMealsFeature, label: "Plan Meals" },
  { icon: IconBuyDirectFeature, label: "Buy Direct" },
  { icon: IconStockPantryFeature, label: "Stock Pantry" },
  { icon: IconShareSaveFeature, label: "Share & Save" },
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

          <div className={styles.mainHeroProof}>
            <div className={styles.avatarStack}>
              <span style={{ background: "#3E6B52" }}>A</span>
              <span style={{ background: "#D9A43D" }}>M</span>
              <span style={{ background: "#8C5B6B" }}>J</span>
              <span style={{ background: "#B3624A" }}>R</span>
            </div>
            <span className={styles.stars} aria-hidden="true">
              {STARS.map((i) => (
                <svg key={i} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L10 14.7l-5.3 2.9 1.1-5.9L1.5 7.6l5.9-.7L10 1.5Z" />
                </svg>
              ))}
            </span>
            <span className={styles.proofText}>
              <strong>4.8/5</strong> from 2,347+ users
            </span>
          </div>

          <div className={styles.mainHeroCards}>
            {FEATURE_CARDS.map(({ icon: Icon, label }) => (
              <div className={styles.mainHeroCard} key={label}>
                <Icon className={styles.mainHeroCardIcon} />
                <span className={styles.mainHeroCardLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
