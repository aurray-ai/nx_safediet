import styles from "@/components/marketing/home/home.module.css";
import { IconBasket, IconChevronRight, IconHousehold, IconWand } from "@/components/marketing/home/icons";

const STEPS = [
  {
    icon: IconWand,
    title: "Your meals, planned for you",
    body: "SAFEDIET agents build your week around your budget, your goals, and your dietary and cultural preferences — checking what's already in your kitchen first, so nothing goes to waste.",
  },
  {
    icon: IconBasket,
    title: "Groceries, priced fairly",
    body: "Your plan turns into a grocery list you can order right in the app — priced at wholesale because you're buying directly from manufacturers and wholesalers, no retail markup.",
  },
  {
    icon: IconHousehold,
    title: "One budget, everyone in sync",
    body: "Pool a weekly budget with your household, split it equally or by weighted share, and see exactly where the money goes — with receipts, or by importing a real SAFEDIET order automatically.",
  },
];

export function HowItWorksSteps() {
  return (
    <section className={styles.section} id="steps">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Three steps</span>
          <h2>Less thinking. Less spending. Better eating.</h2>
          <p>Meal planning, shopping, and household budgeting — connected, not separate apps.</p>
        </div>

        <div className={`${styles.stepsRail} ${styles.stepsRailThree}`}>
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
              <IconChevronRight className={styles.stepChevron} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
