import Image from "next/image";
import Link from "next/link";

import styles from "./home.module.css";

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.footerRow}`}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.logo}>
            <Image src="/brand/logo.png" alt="SafeDiet logo" width={30} height={30} />
            SafeDiet
          </Link>
          <p>AI meal planning that fits your goals, allergies, and budget — one week at a time.</p>
        </div>

        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <h4>Product</h4>
            <Link href="/#how-it-works">How it works</Link>
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
      </div>

      <div className={`${styles.wrap} ${styles.footerBottom}`}>
        <span>© 2026 SafeDiet. All rights reserved.</span>
        <span>Designed for eating well, on budget.</span>
      </div>
    </footer>
  );
}
