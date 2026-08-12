import styles from "@/components/marketing/home/home.module.css";
import { IconChevronRight, IconCheckCircle, IconShield, IconWallet } from "@/components/marketing/home/icons";

const REASONS = [
  {
    icon: IconShield,
    title: "Diets always protected",
    body: "Allergies and mandatory dietary needs are hard constraints — never traded away for a lower price.",
  },
  {
    icon: IconWallet,
    title: "Pricing shown before checkout",
    body: "Product cost, delivery and any service fee are always broken out — nothing hidden in the total.",
  },
  {
    icon: IconCheckCircle,
    title: "Cancel anytime",
    body: "No lock-in, no retention calls. Free tools stay free even if you cancel Plus.",
  },
];

export function WhyItWorks() {
  return (
    <section className={styles.section} id="why-it-works">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Why it works</span>
          <h2>The mechanics behind the savings.</h2>
        </div>

        <div className={styles.mechanismList}>
          {REASONS.map((reason) => (
            <div className={styles.mechanismRow} key={reason.title}>
              <div className={styles.mechanismLead}>
                <div className={styles.mechanismIconWrap}>
                  <reason.icon />
                </div>
                <h3>{reason.title}</h3>
              </div>
              <p className={styles.mechanismBody}>{reason.body}</p>
              <IconChevronRight className={styles.mechanismChevron} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
