import styles from "./home.module.css";

const PRESS = ["TechCrunch", "Forbes", "Yahoo Finance", "Business Insider", "Healthline"];

export function HomePress() {
  return (
    <section className={styles.pressStrip}>
      <div className={`${styles.wrap} ${styles.pressRow}`}>
        <span className={styles.eyebrow}>As seen in &amp; trusted by</span>
        <div className={styles.pressLogos}>
          {PRESS.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
