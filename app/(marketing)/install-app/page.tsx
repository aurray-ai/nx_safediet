import Image from "next/image";
import Link from "next/link";

import { IconCheckCircle } from "@/components/marketing/home/icons";
import styles from "@/components/marketing/home/home.module.css";

// TODO: replace with the real numeric App Store ID once provided (apps.apple.com/app/id<ID>).
const IOS_APP_STORE_URL = "https://apps.apple.com/app/id0000000000";
const ANDROID_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.safedaet.android";

export default function InstallAppPage() {
  return (
    <div className={styles.home}>
      <div className={styles.installPage}>
        <header className={styles.installHeader}>
          <div className={styles.wrap}>
            <Link href="/" className={styles.logo}>
              <Image src="/brand/logo.png" alt="SafeDiet logo" width={30} height={30} />
              SafeDiet
            </Link>
          </div>
        </header>

        <main className={styles.installMain}>
          <div className={styles.wrap}>
            <div className={styles.installCard}>
              <div className={styles.installIconWrap}>
                <IconCheckCircle />
              </div>
              <span className={styles.eyebrow}>You&apos;re all set</span>
              <h1 className={styles.installTitle}>Get the SafeDiet app to start planning.</h1>
              <p className={styles.installSub}>
                Your meal plans, grocery lists, and budget tracking all live in the SafeDiet app.
                Download it to pick up right where you left off.
              </p>

              <div className={styles.storeRow}>
                <a
                  href={IOS_APP_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.storeButton}
                >
                  <Image src="/assets/app-store.png" alt="" width={26} height={26} />
                  <span className={styles.storeButtonLabel}>
                    <span>Download on the</span>
                    <span>App Store</span>
                  </span>
                </a>
                <a
                  href={ANDROID_PLAY_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.storeButton}
                >
                  <Image src="/assets/playstore.png" alt="" width={26} height={26} />
                  <span className={styles.storeButtonLabel}>
                    <span>Get it on</span>
                    <span>Google Play</span>
                  </span>
                </a>
              </div>

              <Link href="/" className={styles.installSkip}>
                I&apos;ll do this later
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
