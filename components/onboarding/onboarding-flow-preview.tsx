"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { PlanPreviewPanel } from "./plan-preview-panel";
import styles from "./onboarding-preview.module.css";

const STEP_LABELS = ["Planning", "Goals", "Coverage", "Preferences", "Account"];

const GOALS = [
  { id: "maintain", title: "Maintain", detail: "Steady, healthy meals for real life." },
  { id: "weightLoss", title: "Lose Weight", detail: "Lighter planning without losing satisfaction." },
  { id: "muscleBuilding", title: "Build Muscle", detail: "Protein-forward meals within budget." },
  { id: "weightGain", title: "Gain Weight", detail: "More calorie support without random bulk." },
] as const;

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"] as const;
const ALLERGIES = ["Peanuts", "Tree Nuts", "Milk", "Egg", "Soy", "Wheat", "Fish", "Shellfish", "Sesame"] as const;
const MEAL_COVERAGE = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
const DIET_RULES = ["Halal", "No Pork", "Vegetarian", "Vegan"] as const;
const CUISINES = [
  "East African",
  "West African",
  "Caribbean",
  "Indian",
  "Chinese",
  "Pakistani",
  "Italian",
  "Mexican",
] as const;

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

type OnboardingFormState = {
  planningScope: "solo" | "household";
  goal: (typeof GOALS)[number]["id"];
  age: number;
  gender: (typeof GENDERS)[number];
  budget: number;
  allergies: string[];
  mealCoverage: string[];
  dietRules: string[];
  cuisines: string[];
  fullName: string;
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  user_types: string[];
  user_configuration: {
    mode: "solo" | "household";
    goal: string;
    weekly_budget: number;
    culture_preferences: string[];
    diet_rules: string[];
    household_size: number;
    selected_plan_types: string[];
    allergies: string[];
    gender: string;
    age: number;
    timezone?: string;
  };
};

const initialFormState: OnboardingFormState = {
  planningScope: "solo",
  goal: "maintain",
  age: 24,
  gender: "Prefer not to say",
  budget: 85,
  allergies: [],
  mealCoverage: ["Breakfast", "Lunch", "Dinner"],
  dietRules: [],
  cuisines: ["East African", "Italian"],
  fullName: "",
  email: "",
  password: "",
};

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function buildRegisterPayload(form: OnboardingFormState): RegisterPayload {
  return {
    name: form.fullName.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    user_types: ["customer"],
    user_configuration: {
      mode: form.planningScope,
      goal: form.goal,
      weekly_budget: form.budget,
      culture_preferences: form.cuisines,
      diet_rules: form.dietRules,
      household_size: 1,
      selected_plan_types: form.mealCoverage,
      allergies: form.allergies,
      gender: form.gender,
      age: form.age,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
    },
  };
}

export function OnboardingFlowPreview() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<OnboardingFormState>(initialFormState);
  const [isTransitioningStep, setIsTransitioningStep] = useState(false);
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const shellRef = useRef<HTMLDivElement | null>(null);

  const isLastStep = stepIndex === STEP_LABELS.length - 1;
  const passwordIsValid = PASSWORD_RULE.test(form.password);

  const stepValid = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return Boolean(form.planningScope);
      case 1:
        return Boolean(form.goal) && Boolean(form.gender) && form.age >= 16 && form.budget >= 35;
      case 2:
        return form.mealCoverage.length > 0;
      case 3:
        return true;
      case 4:
        return form.fullName.trim().length > 1 && form.email.includes("@") && passwordIsValid;
      default:
        return false;
    }
  }, [form, passwordIsValid, stepIndex]);

  function updateForm(updater: (current: OnboardingFormState) => OnboardingFormState) {
    setSubmitError("");
    setForm(updater);
  }

  function goToStep(nextIndex: number) {
    if (isTransitioningStep || nextIndex === stepIndex) {
      return;
    }
    setIsTransitioningStep(true);
    window.setTimeout(() => {
      setStepIndex(nextIndex);
      shellRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsTransitioningStep(false);
    }, 200);
  }

  async function handleContinue() {
    if (!stepValid || isTransitioningStep || isSubmittingRegistration) {
      return;
    }

    if (!isLastStep) {
      goToStep(stepIndex + 1);
      return;
    }

    setIsSubmittingRegistration(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRegisterPayload(form)),
      });

      const payload = (await response.json()) as { detail?: string; redirectTo?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to create your account right now.");
      }

      window.location.assign(payload.redirectTo ?? "/account-setup");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create your account right now.");
    } finally {
      setIsSubmittingRegistration(false);
    }
  }

  function handlePrevious() {
    if (isTransitioningStep || stepIndex === 0) {
      return;
    }
    goToStep(stepIndex - 1);
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell} ref={shellRef}>
        <span className={styles.protoBadge}>Prototype — product-led onboarding</span>

        <div className={styles.topbar}>
          <Link href="/" className={styles.homeLink}>
            Back to home
          </Link>

          <div className={styles.topbarRight}>
            <div className={styles.progressMeta}>
              Step {stepIndex + 1} of {STEP_LABELS.length}
            </div>
            <div className={styles.stepRail} aria-hidden="true">
              {STEP_LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`${styles.stepPill} ${index <= stepIndex ? styles.stepPillActive : ""}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ width: `${((stepIndex + 1) / STEP_LABELS.length) * 100}%` }}
          />
        </div>

        <div className={styles.body}>
          <div className={`${styles.panel} ${isTransitioningStep ? styles.panelTransitioning : ""}`}>
            {stepIndex === 0 ? (
              <>
                <p className={styles.eyebrow}>Start planning</p>
                <h1 className={styles.title}>Who should this plan cover?</h1>
                <p className={styles.copy}>Start with one person.</p>

                <div className={styles.stack}>
                  <button
                    type="button"
                    className={`${styles.choice} ${form.planningScope === "solo" ? styles.choiceSelected : ""}`}
                    onClick={() => updateForm((current) => ({ ...current, planningScope: "solo" }))}
                  >
                    <h3>Just me</h3>
                    <p>Meals, groceries, and delivery for your week.</p>
                  </button>

                  <button type="button" className={`${styles.choice} ${styles.choiceDisabled}`} disabled>
                    <h3>A household</h3>
                    <p>Shared planning is coming soon.</p>
                  </button>
                </div>
              </>
            ) : null}

            {stepIndex === 1 ? (
              <>
                <p className={styles.eyebrow}>Goals and budget</p>
                <h1 className={styles.title}>What should your meals help with?</h1>
                <p className={styles.copy}>Choose a goal and set a realistic weekly budget.</p>

                <div className={styles.grid}>
                  {GOALS.map((goal) => (
                    <button
                      type="button"
                      key={goal.id}
                      className={`${styles.cardButton} ${form.goal === goal.id ? styles.choiceSelected : ""}`}
                      onClick={() => updateForm((current) => ({ ...current, goal: goal.id }))}
                    >
                      <h3>{goal.title}</h3>
                      <p>{goal.detail}</p>
                    </button>
                  ))}
                </div>

                <div className={styles.formRow}>
                  <label className={styles.field}>
                    <span>Age</span>
                    <input
                      type="number"
                      min={16}
                      max={80}
                      value={form.age}
                      onChange={(event) =>
                        updateForm((current) => ({ ...current, age: Number(event.target.value) || 16 }))
                      }
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Gender</span>
                    <select
                      value={form.gender}
                      onChange={(event) =>
                        updateForm((current) => ({
                          ...current,
                          gender: event.target.value as OnboardingFormState["gender"],
                        }))
                      }
                    >
                      {GENDERS.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.field}>
                    <span>Weekly budget</span>
                    <div className={styles.budgetValue}>£{form.budget} / week</div>
                  </label>
                </div>

                <label className={styles.rangeWrap}>
                  <input
                    type="range"
                    min={35}
                    max={180}
                    step={5}
                    value={form.budget}
                    onChange={(event) =>
                      updateForm((current) => ({ ...current, budget: Number(event.target.value) }))
                    }
                  />
                </label>
              </>
            ) : null}

            {stepIndex === 2 ? (
              <>
                <p className={styles.eyebrow}>Coverage</p>
                <h1 className={styles.title}>Anything we should avoid or always plan?</h1>
                <p className={styles.copy}>Set allergies and the meals you want covered.</p>

                <div className={styles.sectionBlock}>
                  <h3 className={styles.subtitle}>Allergies</h3>
                  <div className={styles.pillGrid}>
                    {ALLERGIES.map((allergy) => (
                      <button
                        type="button"
                        key={allergy}
                        className={`${styles.pill} ${form.allergies.includes(allergy) ? styles.pillSelected : ""}`}
                        onClick={() =>
                          updateForm((current) => ({
                            ...current,
                            allergies: toggleValue(current.allergies, allergy),
                          }))
                        }
                      >
                        {allergy}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionBlock}>
                  <h3 className={styles.subtitle}>Meals to plan</h3>
                  <div className={styles.pillGrid}>
                    {MEAL_COVERAGE.map((mealType) => (
                      <button
                        type="button"
                        key={mealType}
                        className={`${styles.pill} ${form.mealCoverage.includes(mealType) ? styles.pillSelected : ""}`}
                        onClick={() =>
                          updateForm((current) => ({
                            ...current,
                            mealCoverage: toggleValue(current.mealCoverage, mealType),
                          }))
                        }
                      >
                        {mealType}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {stepIndex === 3 ? (
              <>
                <p className={styles.eyebrow}>Preferences</p>
                <h1 className={styles.title}>What should your food feel like?</h1>
                <p className={styles.copy}>Choose diet rules and cuisines you prefer.</p>

                <div className={styles.sectionBlock}>
                  <h3 className={styles.subtitle}>Diet rules</h3>
                  <div className={styles.pillGrid}>
                    {DIET_RULES.map((rule) => (
                      <button
                        type="button"
                        key={rule}
                        className={`${styles.pill} ${form.dietRules.includes(rule) ? styles.pillSelected : ""}`}
                        onClick={() =>
                          updateForm((current) => ({ ...current, dietRules: toggleValue(current.dietRules, rule) }))
                        }
                      >
                        {rule}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionBlock}>
                  <h3 className={styles.subtitle}>Preferred cuisines</h3>
                  <div className={styles.pillGrid}>
                    {CUISINES.map((cuisine) => (
                      <button
                        type="button"
                        key={cuisine}
                        className={`${styles.pill} ${form.cuisines.includes(cuisine) ? styles.pillSelected : ""}`}
                        onClick={() =>
                          updateForm((current) => ({ ...current, cuisines: toggleValue(current.cuisines, cuisine) }))
                        }
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>

                <p className={styles.helper}>
                  Cuisine and diet-rule matching isn&apos;t wired into this prototype&apos;s preview yet — the
                  panel keeps showing your current plan rather than guessing matches that don&apos;t exist in
                  the sample catalog.
                </p>
              </>
            ) : null}

            {stepIndex === 4 ? (
              <>
                <p className={styles.eyebrow}>Create account</p>
                <h1 className={styles.title}>Save this plan and continue</h1>
                <p className={styles.copy}>
                  Create your account to keep the plan you just built and continue on iPhone or Android.
                </p>

                <div className={styles.formColumn}>
                  <label className={styles.field}>
                    <span>Full name</span>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.fullName}
                      onChange={(event) => updateForm((current) => ({ ...current, fullName: event.target.value }))}
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Email</span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(event) => updateForm((current) => ({ ...current, email: event.target.value }))}
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Password</span>
                    <input
                      type="password"
                      placeholder="8+ chars, upper, lower, number"
                      value={form.password}
                      onChange={(event) => updateForm((current) => ({ ...current, password: event.target.value }))}
                    />
                    <p className={styles.helper}>
                      Use at least 8 characters with one uppercase letter, one lowercase letter, and one number.
                    </p>
                  </label>
                </div>

                {submitError ? <p className={styles.error}>{submitError}</p> : null}
              </>
            ) : null}

            <div className={styles.footer}>
              {stepIndex > 0 ? (
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
                  onClick={handlePrevious}
                  disabled={isTransitioningStep || isSubmittingRegistration}
                >
                  Previous
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                className={styles.actionButton}
                onClick={handleContinue}
                disabled={!stepValid || isSubmittingRegistration}
              >
                {isLastStep ? (isSubmittingRegistration ? "Creating account..." : "Save this plan") : "Continue"}
              </button>
            </div>
          </div>

          <PlanPreviewPanel
            stepIndex={stepIndex}
            mealCoverage={form.mealCoverage}
            allergies={form.allergies}
            budget={form.budget}
          />
        </div>
      </div>
    </div>
  );
}
