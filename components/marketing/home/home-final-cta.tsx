import Image from "next/image";
import Link from "next/link";

import styles from "./home.module.css";

export function HomeFinalCta() {
  return (
    <section className={styles.section} id="pricing">
      <div className={styles.wrap}>
        <div className={styles.finalCta}>
          <div className={styles.finalCtaGrid}>
            <div className={styles.finalCtaBody}>
              <span className={styles.eyebrow}>Get started</span>
              <h2>Ready to eat better and feel your best?</h2>
              <p>
                Join thousands of people who are saving time, eating healthy, and staying within
                budget with SafeDiet.
              </p>
              <div className={styles.finalCtaCtas}>
                <Link href="/start-planning" className={`${styles.btn} ${styles.btnGold}`}>
                  Start Planning — It&apos;s Free
                </Link>
                <Link href="/start-planning" className={`${styles.btn} ${styles.btnOutlineLight}`}>
                  Take the Quiz
                </Link>
              </div>
              <p className={styles.finalCtaNote}>No credit card required. Cancel anytime.</p>
            </div>

            <div className={styles.finalCtaImageWrap}>
              <Image
                src="/brand/grocery/fresh_picks_banner.png"
                alt="Fresh produce used in SafeDiet meal plans"
                fill
                className={styles.finalCtaImage}
                sizes="(max-width: 820px) 100vw, 40vw"
              />
              <div className={styles.priceBubble}>
                Plans as low as
                <strong>£1.20</strong>
                per meal
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
