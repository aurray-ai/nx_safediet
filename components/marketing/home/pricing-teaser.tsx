import Link from "next/link";

import styles from "./home.module.css";
import { IconCheckCircle } from "./icons";

const FEATURES = [
  "Unlimited AI meal planning",
  "Save up to 30% buying direct from wholesalers",
  "Doorstep delivery, groceries or prepared meals",
  "Personal chef requests",
];

export function PricingTeaser() {
  return (
    <section className={styles.pricingTeaser} id="pricing">
      <div className={styles.wrap}>
        <div className={styles.pricingCard}>
          <span className={styles.eyebrow}>SAFEDIET Plus</span>
          <h2>Everything above, unlocked.</h2>
          <div className={styles.pricingPrice}>
            £7.99 <span>/ month</span>
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
