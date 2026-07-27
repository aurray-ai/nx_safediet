import Image from "next/image";
import Link from "next/link";

import styles from "./home.module.css";
import { IconArrowRight } from "./icons";

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.footerRow}`}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.logo}>
            <Image src="/assets/logo.png" alt="SAFEDIET logo" width={42} height={42} />
            SAFEDIET
          </Link>
          <p>SAFEDIET-powered meal planning and grocery shopping for households.</p>
        </div>

        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <h4>Product</h4>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/meals">Meals</Link>
            <Link href="/#pricing">Pricing</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>Account</h4>
            <Link href="/login">Log in</Link>
            <Link href="/register">Create account</Link>
            <Link href="/start-planning">Start planning</Link>
          </div>
        </div>

        <div className={styles.footerNewsletter}>
          <h4>Stay in the loop</h4>
          <p>Get tips, recipes and offers straight to your inbox.</p>
          <form className={styles.footerNewsletterForm}>
            <input type="email" placeholder="Enter your email" aria-label="Email address" required />
            <button type="submit" aria-label="Subscribe">
              <IconArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </form>
        </div>
      </div>

      <div className={`${styles.wrap} ${styles.footerBottom}`}>
        <span>© 2026 SAFEDIET. All rights reserved.</span>
        <span>Designed for eating well, on budget.</span>
      </div>
    </footer>
  );
}
