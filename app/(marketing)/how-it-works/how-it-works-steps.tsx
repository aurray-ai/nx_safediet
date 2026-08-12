import styles from "@/components/marketing/home/home.module.css";
import { IconHousehold, IconPallet, IconShield, IconWand } from "@/components/marketing/home/icons";

export function HowItWorksSteps() {
  return (
    <section className={styles.section} id="steps" style={{ paddingTop: 24 }}>
      <div className={`${styles.wrap} ${styles.hiwSteps}`}>
        {/* STEP 1 */}
        <div className={styles.hiwStep}>
          <div className={styles.hiwStepCopy}>
            <span className={styles.hiwStepNum}>1</span>
            <h2>Tell us about you</h2>
            <p>
              Your weekly budget, allergies, dietary needs, cooking time and household size. Allergies and
              mandatory dietary needs are locked in as protected constraints &mdash; no recommendation is ever
              allowed to override them.
            </p>
            <span className={styles.hiwStepTag}>
              <IconShield />
              Protected by design
            </span>
          </div>
          <div className={styles.hiwStepArt}>
            <div className={styles.hiwPhoneIllustrated}>
              <div className={styles.hiwPhoneNotch} />
              <div className={styles.hiwPhoneScreen}>
                <div className={styles.hiwScreenTitle}>Plan your meals</div>
                <div className={styles.hiwScreenSub}>Step 1 of 3</div>

                <div className={styles.hiwObRow}>
                  <span className={styles.hiwObLabel}>Weekly budget</span>
                  <div className={styles.hiwObBudget}>£120</div>
                  <div className={styles.hiwObSlider}>
                    <div className={styles.hiwObSliderFill} />
                  </div>
                </div>

                <div className={styles.hiwObRow}>
                  <span className={styles.hiwObLabel}>Allergies to avoid</span>
                  <div className={styles.hiwObChips}>
                    <span className={`${styles.hiwObChip} ${styles.hiwObChipOn}`}>Peanuts</span>
                    <span className={`${styles.hiwObChip} ${styles.hiwObChipOn}`}>Shellfish</span>
                    <span className={styles.hiwObChip}>Gluten</span>
                    <span className={styles.hiwObChip}>Dairy</span>
                  </div>
                </div>

                <div className={styles.hiwObRow} style={{ marginBottom: 0 }}>
                  <span className={styles.hiwObLabel}>Household size</span>
                  <div className={styles.hiwObStepper}>
                    <button type="button" aria-label="Decrease">
                      &minus;
                    </button>
                    <span>4 people</span>
                    <button type="button" aria-label="Increase">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className={`${styles.hiwStep} ${styles.hiwStepReverse}`}>
          <div className={styles.hiwStepCopy}>
            <span className={styles.hiwStepNum}>2</span>
            <h2>Get your AI-built weekly plan</h2>
            <p>
              A full week, built around your number &mdash; nutritionally balanced and reusing ingredients
              across meals to cut waste. Swap or remove anything, and the cost updates in real time.
            </p>
            <span className={styles.hiwStepTag}>
              <IconWand />
              Budget-aware AI planning
            </span>
          </div>
          <div className={styles.hiwStepArt}>
            <div className={styles.hiwPhoneIllustrated}>
              <div className={styles.hiwPhoneNotch} />
              <div className={styles.hiwPhoneScreen}>
                <div className={styles.hiwScreenTitle}>Your Week</div>
                <div className={styles.hiwWpTabs}>
                  <span className={`${styles.hiwWpTab} ${styles.hiwWpTabOn}`}>Mon</span>
                  <span className={styles.hiwWpTab}>Tue</span>
                  <span className={styles.hiwWpTab}>Wed</span>
                  <span className={styles.hiwWpTab}>Thu</span>
                  <span className={styles.hiwWpTab}>Fri</span>
                </div>

                <div className={styles.hiwWpRow}>
                  <span className={styles.hiwWpTime}>8:00am</span>
                  <span className={styles.hiwWpName}>
                    Greek Yogurt Parfait
                    <br />
                    <span className={styles.hiwWpKcal}>350 kcal</span>
                  </span>
                </div>
                <div className={styles.hiwWpRow}>
                  <span className={styles.hiwWpTime}>1:00pm</span>
                  <span className={styles.hiwWpName}>
                    Lunch Chicken Bowl
                    <br />
                    <span className={styles.hiwWpKcal}>660 kcal</span>
                  </span>
                  <span className={styles.hiwWpSwap}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M17 3a2.83 2.83 0 0 1 4 4L7 21l-5 1 1-5Z" />
                    </svg>
                  </span>
                </div>
                <div className={styles.hiwWpRow}>
                  <span className={styles.hiwWpTime}>7:00pm</span>
                  <span className={styles.hiwWpName}>
                    Dinner with Quinoa
                    <br />
                    <span className={styles.hiwWpKcal}>650 kcal</span>
                  </span>
                </div>

                <span className={styles.hiwWpBadge}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  £38.50 left of £120
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div className={styles.hiwStep}>
          <div className={styles.hiwStepCopy}>
            <span className={styles.hiwStepNum}>3</span>
            <h2>We buy it direct from the source</h2>
            <p>
              Your plan becomes a shopping list, pooled with everyone ordering the same ingredients that week,
              and bought straight from farms, manufacturers and wholesalers &mdash; not a shop that&apos;s
              already added its own markup.
            </p>
            <span className={styles.hiwStepTag}>
              <IconPallet />
              Wholesale buying power
            </span>
          </div>
          <div className={styles.hiwStepArt}>
            <div className={styles.hiwPhoneIllustrated}>
              <div className={styles.hiwPhoneNotch} />
              <div className={styles.hiwPhoneScreen}>
                <div className={styles.hiwScreenTitle}>Smart Shopping List</div>
                <div className={styles.hiwScreenSub}>Generated from your meal plan</div>

                <div className={styles.hiwSlProgressWrap}>
                  <div className={styles.hiwSlProgress}>
                    <div className={styles.hiwSlProgressFill} />
                  </div>
                  <div className={styles.hiwSlProgressLabel}>18 of 32 added to cart</div>
                </div>

                <div className={styles.hiwSlRow}>
                  <span className={styles.hiwSlDot} />
                  <span className={styles.hiwSlName}>Broccoli 500g</span>
                  <span className={styles.hiwSlOld}>£1.49</span>
                  <span className={styles.hiwSlNew}>£1.04</span>
                </div>
                <div className={styles.hiwSlRow}>
                  <span className={styles.hiwSlDot} />
                  <span className={styles.hiwSlName}>Chicken Breast 500g</span>
                  <span className={styles.hiwSlOld}>£4.49</span>
                  <span className={styles.hiwSlNew}>£3.14</span>
                </div>
                <div className={styles.hiwSlRow}>
                  <span className={styles.hiwSlDot} />
                  <span className={styles.hiwSlName}>Rolled Oats 1kg</span>
                  <span className={styles.hiwSlOld}>£2.19</span>
                  <span className={styles.hiwSlNew}>£1.53</span>
                </div>
                <div className={styles.hiwSlRow}>
                  <span className={styles.hiwSlDot} />
                  <span className={styles.hiwSlName}>Free Range Eggs x6</span>
                  <span className={styles.hiwSlOld}>£2.19</span>
                  <span className={styles.hiwSlNew}>£1.53</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 4 */}
        <div className={`${styles.hiwStep} ${styles.hiwStepReverse}`} style={{ gridTemplateColumns: "1fr 1.15fr" }}>
          <div className={styles.hiwStepCopy}>
            <span className={styles.hiwStepNum}>4</span>
            <h2>Choose how it arrives</h2>
            <p>
              A grocery bundle to cook yourself, a shared order split with your household, or a chef-prepared
              meal delivered on schedule. Same plan, three ways to receive it.
            </p>
          </div>
          <div className={styles.hiwStepArt}>
            <div className={styles.hiwForkRow}>
              <div className={styles.hiwForkPhone}>
                <div className={styles.hiwForkScreen}>
                  <div className={styles.hiwForkIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 8h14l-1.4 10.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 8Z" strokeLinejoin="round" />
                      <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className={styles.hiwForkTitle}>Grocery bundle</div>
                  <div className={styles.hiwForkSub}>Cook it yourself, delivered ready to go.</div>
                  <div className={styles.hiwForkDivider} />
                  <div className={styles.hiwForkMiniRow}>
                    <span>Delivery</span>
                    <span>Tomorrow, 9&ndash;12</span>
                  </div>
                  <div className={styles.hiwForkMiniRow}>
                    <span>Items</span>
                    <span>18</span>
                  </div>
                  <span className={styles.hiwForkPill}>Standard &middot; Free</span>
                </div>
              </div>

              <div className={styles.hiwForkPhone}>
                <div className={styles.hiwForkScreen}>
                  <div className={styles.hiwForkIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 21v-8l8-6 8 6v8" strokeLinejoin="round" />
                      <path d="M9 21v-6h6v6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className={styles.hiwForkTitle}>Shared order</div>
                  <div className={styles.hiwForkSub}>Split with your household, fairly.</div>
                  <div className={styles.hiwForkMiniAvatars}>
                    <span style={{ background: "#3E6B52" }}>E</span>
                    <span style={{ background: "#8C5B6B" }}>S</span>
                    <span style={{ background: "#B3624A" }}>A</span>
                  </div>
                  <div className={styles.hiwForkDivider} />
                  <div className={styles.hiwForkMiniRow}>
                    <span>Household</span>
                    <span>£120 budget</span>
                  </div>
                  <span className={styles.hiwForkPill}>4 members</span>
                </div>
              </div>

              <div className={styles.hiwForkPhone}>
                <div className={styles.hiwForkScreen}>
                  <div className={styles.hiwForkIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path
                        d="M6 2v6M18 2v6M6 8a6 6 0 0 0 12 0M9 22v-8h6v8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className={styles.hiwForkTitle}>Chef-prepared</div>
                  <div className={styles.hiwForkSub}>Made by an approved chef, on schedule.</div>
                  <div className={styles.hiwForkDivider} />
                  <div className={styles.hiwForkMiniRow}>
                    <span>Rider</span>
                    <span>Tunde A.</span>
                  </div>
                  <div className={styles.hiwForkMiniRow}>
                    <span>Status</span>
                    <span>Out for delivery</span>
                  </div>
                  <span className={styles.hiwForkPill}>Speak to a chef</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 5 */}
        <div className={styles.hiwStep}>
          <div className={styles.hiwStepCopy}>
            <span className={styles.hiwStepNum}>5</span>
            <h2>Stay in sync, keep saving</h2>
            <p>
              Household balances update automatically &mdash; everyone can see who&apos;s contributed and who
              owes what, no spreadsheets. Consistent, low-waste weeks earn rewards, never restriction.
            </p>
            <span className={styles.hiwStepTag}>
              <IconHousehold />
              Shared kitchen &amp; healthy rewards
            </span>
          </div>
          <div className={styles.hiwStepArt}>
            <div className={styles.hiwPhoneIllustrated}>
              <div className={styles.hiwPhoneNotch} />
              <div className={styles.hiwPhoneScreen}>
                <div className={styles.hiwScreenTitle}>Who Owes What</div>
                <div className={styles.hiwScreenSub}>Balances for this week</div>

                <div className={styles.hiwHhRow}>
                  <span className={styles.hiwHhAvatar} style={{ background: "#3E6B52" }}>
                    S
                  </span>
                  <span className={styles.hiwHhName}>You (Sarah)</span>
                  <span className={`${styles.hiwHhStatus} ${styles.hiwHhStatusOwed}`}>+£8.35</span>
                </div>
                <div className={styles.hiwHhRow}>
                  <span className={styles.hiwHhAvatar} style={{ background: "#8C5B6B" }}>
                    D
                  </span>
                  <span className={styles.hiwHhName}>David</span>
                  <span className={`${styles.hiwHhStatus} ${styles.hiwHhStatusOwes}`}>Owes £12.19</span>
                </div>
                <div className={styles.hiwHhRow}>
                  <span className={styles.hiwHhAvatar} style={{ background: "#B3624A" }}>
                    T
                  </span>
                  <span className={styles.hiwHhName}>Tunde</span>
                  <span className={`${styles.hiwHhStatus} ${styles.hiwHhStatusSettled}`}>Settled</span>
                </div>

                <div className={styles.hiwRewardStrip}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2c1.5 3 4 4 4 7.5a4 4 0 1 1-8 0C8 6 10.5 5 12 2Z" />
                  </svg>
                  <span className={styles.hiwRewardText}>
                    <strong>4-week planning streak</strong>
                    <span>Eligible for £5 grocery credit</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
