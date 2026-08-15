import Link from "next/link";

import styles from "./home.module.css";
import { IconCheckCircle } from "./icons";

const FEATURES = [
  "Save up to 30% on every grocery order",
  "Unlimited AI meal planning & smart recommendations",
  "Free doorstep grocery & meal delivery",
  "Smart Kitchen automatic pantry tracking",
  "Access to verified Professional Personal Chef",
  "Calorie tracking & AI meal scanner",
  "Household budgeting & split expenses",
];

export function PricingTeaser() {
  return (
    <section className={styles.pricingTeaser} id="pricing">
      <div className={styles.wrap}>
        <div className={styles.pricingCard}>
          <span className={styles.eyebrow}>SAFEDIET Plus</span>
          <h2>Everything above, unlocked.</h2>

          <div className={styles.pricingPlans}>
            <div className={styles.pricingPlan}>
              <span className={styles.pricingPlanLabel}>Students</span>
              <div className={styles.pricingPlanPrice}>
                &pound;7.99 <span>/ month</span>
              </div>
              <div className={styles.pricingPlanNote}>Verification required</div>
            </div>
            <div className={styles.pricingPlan}>
              <span className={styles.pricingPlanLabel}>Professionals &amp; families</span>
              <div className={styles.pricingPlanPrice}>
                &pound;15.99 <span>/ month</span>
              </div>
            </div>
          </div>

          <ul className={styles.pricingList}>
            {FEATURES.map((feature) => (
              <li key={feature}>
                <IconCheckCircle />
                {feature}
              </li>
            ))}
          </ul>
          <Link href="/start-planning" className={`${styles.btn} ${styles.btnPrimary}`}>
            Start 14-day Free Trial
          </Link>
          <div className={styles.pricingNote}>No credit card required. Cancel anytime.</div>
        </div>
      </div>
    </section>
  );
}
