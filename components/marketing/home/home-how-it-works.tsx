import styles from "./home.module.css";
import { IconBasket, IconPerson, IconSliders, IconWand } from "./icons";

const STEPS = [
  {
    icon: IconPerson,
    title: "Tell us about you",
    body: "Share your goals, budget, allergies, cuisine preferences, and how many meals you need.",
  },
  {
    icon: IconWand,
    title: "AI builds your plan",
    body: "Our AI creates a personalized weekly meal plan that's healthy, balanced, and budget-friendly.",
  },
  {
    icon: IconSliders,
    title: "Review & customize",
    body: "Edit meals, swap dishes, or adjust portions to match your taste and schedule.",
  },
  {
    icon: IconBasket,
    title: "Shop & enjoy",
    body: "Get smart grocery lists, order ingredients, and enjoy your meals stress-free.",
  },
];

export function HomeHowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>How it works</span>
          <h2>Plan once. Eat well. Stress less.</h2>
          <p>Our AI does the thinking, so you can focus on living.</p>
        </div>

        <div className={styles.stepsRail}>
          {STEPS.map((step, index) => (
            <div className={styles.step} key={step.title}>
              <div className={styles.stepIconWrap}>
                <div className={styles.stepIcon}>
                  <step.icon />
                </div>
                <span className={styles.stepNumBadge}>{index + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
