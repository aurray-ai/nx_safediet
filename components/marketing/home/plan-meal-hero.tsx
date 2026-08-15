import Image from "next/image";
import Link from "next/link";

import { LeafBranch, SwirlRing } from "./decor";
import styles from "./home.module.css";
import {
  IconBasket,
  IconCalendar,
  IconCheckCircle,
  IconDumbbell,
  IconFlame,
  IconLeaf,
  IconShield,
  IconSparkle,
  IconWallet,
} from "./icons";
import { weekPlan } from "./plan-data";

const STARS = [0, 1, 2, 3, 4];

/// Most people don't eat a planned breakfast every day, so these four days show an
/// empty "add a meal" slot instead of a real breakfast entry, for a more realistic plan.
const SKIP_BREAKFAST_DAYS = new Set(["Tue", "Thu", "Sat"]);
const TOTAL_MEAL_SLOTS = weekPlan.length * 3;
const PLANNED_MEAL_SLOTS = TOTAL_MEAL_SLOTS - SKIP_BREAKFAST_DAYS.size;
const PLANNED_MEAL_PERCENT = Math.round((PLANNED_MEAL_SLOTS / TOTAL_MEAL_SLOTS) * 100);

export function PlanMealHero() {
  return (
    <section className={styles.hero} id="home">
      <svg className={styles.heroWaveTop} viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 44C240 4 480 84 720 64S1200 4 1440 44V90H0V44Z" fill="var(--cream)" />
      </svg>
      <div className={styles.wrap}>
        <div className={styles.heroDecor} aria-hidden="true">
          <SwirlRing style={{ position: "absolute", right: "2%", top: "-160px", width: 440, height: 440, opacity: 0.5 }} />
          <LeafBranch style={{ position: "absolute", right: "-6px", top: "20px", width: 84, height: 320, opacity: 0.55 }} />
        </div>

        <div className={styles.heroGrid}>
        <div>
          <span className={styles.eyebrowPill}>Students Friendly</span>
          <h1 className={styles.heroTitle}>
            Smarter meals.
            <br />
            <em>Better you.</em>
          </h1>
          <p className={styles.heroSub}>
            SAFEDIET&apos;s AI automatically plans your weekly meals around your budget, health
            goals, allergies, and preferences.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/start-planning" className={`${styles.btn} ${styles.btnPrimary}`}>
              Start Planning — It&apos;s Free
            </Link>
            <Link href="/meals" className={`${styles.btn} ${styles.btnGhost}`}>
              Browse Meals
              <IconBasket style={{ width: 16, height: 16 }} />
            </Link>
          </div>

          {/* <div className={styles.heroProof}>
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
          </div> */}

          <div className={styles.trustLine}>
            <span className={styles.trustHeading}>Trusted by students, professionals &amp; families</span>
            <span className={styles.trustChip}>
              <IconSparkle />
              Personalized AI Plans
            </span>
            <span className={styles.trustChip}>
              <IconWallet />
              Budget Friendly
            </span>
            <span className={styles.trustChip}>
              <IconLeaf />
              Nutrition Focused
            </span>
            <span className={styles.trustChip}>
              <IconShield />
              No Hidden Fees
            </span>
          </div>
        </div>

        <div className={styles.snapshotCard}>
          <div className={styles.snapshotHead}>
            <span className={styles.snapshotTitle}>Your Weekly Plan</span>
            <span className={styles.snapshotDateNav}>May 19 – May 25</span>
            <span className={styles.onTrackPill}>
              <IconCheckCircle />
              On Track
            </span>
          </div>

          <div className={styles.statGrid}>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>
                <IconCalendar />
                Budget Left
              </span>
              <div className={styles.statValue}>£38.50</div>
              <div className={styles.statMeta}>of £120.00</div>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>
                <IconLeaf />
                Meals Planned
              </span>
              <div className={styles.statValue}>{PLANNED_MEAL_SLOTS} / {TOTAL_MEAL_SLOTS}</div>
              <div className={styles.statMeta}>{PLANNED_MEAL_PERCENT}% complete</div>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>
                <IconFlame />
                Calories Avg
              </span>
              <div className={styles.statValue}>1,890 kcal</div>
              <div className={styles.statMeta}>per day</div>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statLabel}>
                <IconDumbbell />
                Protein Avg
              </span>
              <div className={styles.statValue}>92 g</div>
              <div className={styles.statMeta}>per day</div>
            </div>
          </div>

          <div className={styles.miniGrid}>
            <div className={styles.miniGridInner}>
              {weekPlan.map((day) => {
                const meals = [
                  SKIP_BREAKFAST_DAYS.has(day.day) ? null : day.breakfast,
                  day.lunch,
                  day.dinner,
                ];
                return (
                  <div className={styles.miniDayCol} key={day.day}>
                    <div className={styles.miniDayLabel}>{day.day}</div>
                    {meals.map((meal, index) =>
                      meal ? (
                        <div className={styles.miniMealCell} key={meal.name}>
                          <div className={styles.miniPlate}>
                            <Image src={meal.image} alt={meal.name} fill sizes="34px" style={{ objectFit: "cover" }} />
                          </div>
                          <span className={styles.miniMealName}>{meal.name}</span>
                          <span className={styles.miniMealKcal}>{meal.kcal} kcal</span>
                        </div>
                      ) : (
                        <div className={styles.miniMealCell} key={`${day.day}-empty-${index}`}>
                          <div className={styles.miniPlateEmpty}>
                            <span className={styles.miniPlateQuestion}>?</span>
                          </div>
                          <span className={styles.miniMealName}>No breakfast</span>
                          <span className={styles.miniMealKcal}>Add meal</span>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.snapshotFoot}>
            <span className={styles.snapshotFootMsg}>
              <IconCheckCircle />
              Great job! You&apos;re hitting your goals and staying within budget.
            </span>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
