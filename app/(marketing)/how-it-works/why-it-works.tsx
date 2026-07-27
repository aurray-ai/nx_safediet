import styles from "@/components/marketing/home/home.module.css";
import { IconChevronRight, IconCheckCircle, IconHousehold, IconWallet } from "@/components/marketing/home/icons";

const REASONS = [
  {
    icon: IconWallet,
    title: "Buy direct, skip the markup",
    body: "We buy direct from manufacturers and wholesalers, so you get better quality at lower prices.",
  },
  {
    icon: IconCheckCircle,
    title: "Agents check your pantry first",
    body: "We scan what you already have to build plans you can actually cook and finish.",
  },
  {
    icon: IconHousehold,
    title: "Split fairly, see everything",
    body: "Fair splits, full visibility, and shared receipts keep everyone aligned and accountable.",
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
