import Link from "next/link";

import { LeafBranch } from "./decor";
import styles from "./home.module.css";
import {
  IconArrowRight,
  IconBarChart,
  IconCheckCircle,
  IconChevronRight,
  IconCircleArrow,
  IconHousehold,
  IconHouse,
  IconLeaf,
  IconPersonPlus,
  IconWallet,
} from "./icons";
import { householdMembers, recentContributions } from "./plan-data";

const FEATURES = [
  {
    icon: IconPersonPlus,
    title: "Invite your people",
    body: "Add members in seconds with a secure invite link.",
  },
  {
    icon: IconWallet,
    title: "Shared budget, live updates",
    body: "All grocery spending rolls up in real time against one weekly or monthly budget.",
  },
  {
    icon: IconBarChart,
    title: "See what's left",
    body: "Always know how much remains before you order more or add new meals.",
  },
  {
    icon: IconHousehold,
    title: "Stay accountable together",
    body: "See who contributed what — no spreadsheets, no back-and-forth.",
  },
];

export function HomeSharedBudget() {
  const totalSpent = 146;
  const totalBudget = 200;
  const spentPercent = Math.round((totalSpent / totalBudget) * 100);
  const remainingPercent = 100 - spentPercent;
  const remaining = totalBudget - totalSpent;

  return (
    <section className={styles.section} id="shared-budget">
      <div className={`${styles.wrap} ${styles.sharedBudget}`}>
        <div className={styles.sharedBudgetDecor} aria-hidden="true">
          <LeafBranch style={{ position: "absolute", right: "-10px", top: "-40px", width: 120, height: 300 }} />
          <LeafBranch
            flip
            style={{ position: "absolute", left: "38%", bottom: "-30px", width: 90, height: 220, opacity: 0.7 }}
          />
        </div>

        <div className={styles.sharedBudgetGrid}>
          <div>
            <div className={styles.sharedBudgetEyebrowRow}>
              <IconHousehold />
              <span className={styles.eyebrow}>Shared budget</span>
            </div>
            <h2 className={styles.sharedBudgetTitle}>
              One budget.
              <em>Everyone on track.</em>
            </h2>
            <p className={styles.sharedBudgetSub}>
              Invite your partner, family or housemates into one budget plan. 
              We help make contributions fair and transparent so there are no surprises
            </p>

            <div className={styles.featureList}>
              {FEATURES.map((feature) => (
                <div className={styles.featureItem} key={feature.title}>
                  <div className={styles.featureIconWrap}>
                    <feature.icon />
                  </div>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.sharedBudgetCtas}>
              <Link href="/start-planning" className={`${styles.btn} ${styles.btnPrimary}`}>
                Start Planning Together
                <IconArrowRight style={{ width: 16, height: 16 }} />
              </Link>
              <Link href="/how-it-works" className={styles.secondaryLink}>
                Learn how it works
                <IconCircleArrow />
              </Link>
              <Link href="/split-grocery-bills" className={styles.secondaryLink}>
                How bill splitting works
                <IconCircleArrow />
              </Link>
            </div>
          </div>

          <div className={styles.householdCard}>
            <div className={styles.householdHead}>
              <div className={styles.householdIcon}>
                <IconHouse />
              </div>
              <div className={styles.householdHeadText}>
                <h3>Household Budget</h3>
                <span>Weekly budget • May 19 – May 25</span>
              </div>
              <span className={styles.onTrackPill}>
                <IconCheckCircle />
                On track
              </span>
            </div>

            <div className={styles.householdStats}>
              <div className={styles.statBlock}>
                <div className={styles.label}>Total spent</div>
                <div className={styles.value}>£{totalSpent.toFixed(2)}</div>
                <div className={styles.meta}>of £{totalBudget.toFixed(2)}</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statBlock}>
                <div className={styles.label}>{remainingPercent}% remaining</div>
                <div className={`${styles.value} ${styles.accent}`}>£{remaining.toFixed(2)} left</div>
              </div>
              <div className={styles.walletCircle}>
                <IconWallet />
              </div>
            </div>

            <div className={styles.progressWrap}>
              <div className={styles.progressTrackLg}>
                <div className={styles.progressFillLg} style={{ width: `${spentPercent}%` }} />
              </div>
              <span className={styles.progressPercent}>{spentPercent}%</span>
            </div>

            <div className={styles.membersLabel}>
              <span>Household members</span>
            </div>
            <div className={styles.membersRow}>
              {householdMembers.map((member, index) => (
                <div
                  key={member.name}
                  className={`${styles.memberAvatar} ${index === 0 ? styles.memberAvatarRing : ""}`}
                  style={{ background: member.color }}
                  title={member.name}
                >
                  {member.initials}
                </div>
              ))}
              <button type="button" className={styles.inviteMember}>
                <span className={styles.inviteMemberCircle}>
                  <IconPersonPlus />
                </span>
                <span>
                  Invite
                  <br />
                  member
                </span>
              </button>
            </div>

            <div className={styles.contributionsHead}>
              <span>Recent contributions</span>
              <Link href="/start-planning">View all</Link>
            </div>
            {recentContributions.map((contribution) => (
              <div className={styles.contributionRow} key={`${contribution.member.name}-${contribution.timestamp}`}>
                <div className={styles.contributionAvatar} style={{ background: contribution.member.color }}>
                  {contribution.member.initials}
                </div>
                <div className={styles.contributionInfo}>
                  <strong>{contribution.member.name}</strong>
                  <span>
                    {contribution.category} • {contribution.timestamp}
                  </span>
                </div>
                <div className={styles.contributionRight}>
                  <div className={styles.contributionAmountWrap}>
                    <span className={styles.contributionAmount}>{contribution.amount}</span>
                    <span className={styles.paidPill}>{contribution.status}</span>
                  </div>
                  <IconChevronRight />
                </div>
              </div>
            ))}

            <div className={styles.householdBanner}>
              <span className={styles.bannerIcon}>
                <IconLeaf />
              </span>
              <p>Great job! You&apos;re staying on track with your household budget this week.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
