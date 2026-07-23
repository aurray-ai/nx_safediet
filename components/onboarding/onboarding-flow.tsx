"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

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

type OnboardingFlowProps = {
  initialStep?: number;
  redirectTo?: string;
  initialEmail?: string;
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

export function OnboardingFlow({ initialStep = 0, redirectTo, initialEmail = "" }: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(() => Math.min(Math.max(initialStep, 0), STEP_LABELS.length - 1));
  const [form, setForm] = useState<OnboardingFormState>(() => ({
    ...initialFormState,
    email: initialEmail,
  }));
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

  function transitionToStep(nextStepIndex: number) {
    if (isTransitioningStep || nextStepIndex === stepIndex) {
      return;
    }

    setIsTransitioningStep(true);

    window.setTimeout(() => {
      setStepIndex(nextStepIndex);
      shellRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsTransitioningStep(false);
    }, 200);
  }

  async function handleContinue() {
    if (!stepValid || isTransitioningStep || isSubmittingRegistration) {
      return;
    }

    if (!isLastStep) {
      transitionToStep(stepIndex + 1);
      return;
    }

    setIsSubmittingRegistration(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...buildRegisterPayload(form),
          redirectTo,
        }),
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

    transitionToStep(stepIndex - 1);
  }

  return (
    <section className="app__onboarding">
      <div className="app__onboarding-shell" ref={shellRef}>
        <div className="app__onboarding-topbar">
          <Link href="/" className="app__onboarding-homeLink">
            Back to home
          </Link>

          <div className="app__onboarding-topbarRight">
            <div className="app__onboarding-progressMeta">
              Step {stepIndex + 1} of {STEP_LABELS.length}
            </div>
            <div className="app__onboarding-stepRail" aria-hidden="true">
              {STEP_LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`app__onboarding-stepPill ${index <= stepIndex ? "is-active" : ""}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="app__onboarding-progressTrack" aria-hidden="true">
          <div
            className="app__onboarding-progressFill"
            style={{ width: `${((stepIndex + 1) / STEP_LABELS.length) * 100}%` }}
          />
        </div>

        <div className="app__onboarding-body">
          <div className={`app__onboarding-panel ${isTransitioningStep ? "is-transitioning" : ""}`}>
            {stepIndex === 0 ? (
              <>
                <p className="app__onboarding-eyebrow">Start planning</p>
                <h1 className="app__onboarding-title">Who should this plan cover?</h1>
                <p className="app__onboarding-copy">Start with one person.</p>

                <div className="app__onboarding-stack">
                  <button
                    type="button"
                    className={`app__onboarding-choice ${form.planningScope === "solo" ? "is-selected" : ""}`}
                    onClick={() => updateForm((current) => ({ ...current, planningScope: "solo" }))}
                  >
                    <div>
                      <h3>Just me</h3>
                      <p>Meals, groceries, and delivery for your week.</p>
                    </div>
                  </button>

                  <button type="button" className="app__onboarding-choice is-disabled" disabled>
                    <div>
                      <h3>A household</h3>
                      <p>Shared planning is coming soon.</p>
                    </div>
                  </button>
                </div>
              </>
            ) : null}

            {stepIndex === 1 ? (
              <>
                <p className="app__onboarding-eyebrow">Goals and budget</p>
                <h1 className="app__onboarding-title">What should your meals help with?</h1>
                <p className="app__onboarding-copy">Choose a goal and set a realistic weekly budget.</p>

                <div className="app__onboarding-grid">
                  {GOALS.map((goal) => (
                    <button
                      type="button"
                      key={goal.id}
                      className={`app__onboarding-cardButton ${form.goal === goal.id ? "is-selected" : ""}`}
                      onClick={() => updateForm((current) => ({ ...current, goal: goal.id }))}
                    >
                      <h3>{goal.title}</h3>
                      <p>{goal.detail}</p>
                    </button>
                  ))}
                </div>

                <div className="app__onboarding-formRow app__onboarding-formRow--triple">
                  <label className="app__onboarding-field">
                    <span>Age</span>
                    <input
                      type="number"
                      min={16}
                      max={80}
                      value={form.age}
                      onChange={(event) =>
                        updateForm((current) => ({
                          ...current,
                          age: Number(event.target.value) || 16,
                        }))
                      }
                    />
                  </label>

                  <label className="app__onboarding-field">
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

                  <label className="app__onboarding-field">
                    <span>Weekly budget</span>
                    <div className="app__onboarding-budgetValue">${form.budget} / week</div>
                  </label>
                </div>

                <label className="app__onboarding-rangeWrap">
                  <input
                    type="range"
                    min={35}
                    max={180}
                    step={5}
                    value={form.budget}
                    onChange={(event) =>
                      updateForm((current) => ({
                        ...current,
                        budget: Number(event.target.value),
                      }))
                    }
                  />
                </label>
              </>
            ) : null}

            {stepIndex === 2 ? (
              <>
                <p className="app__onboarding-eyebrow">Coverage</p>
                <h1 className="app__onboarding-title">Anything we should avoid or always plan?</h1>
                <p className="app__onboarding-copy">Set allergies and the meals you want covered.</p>

                <div className="app__onboarding-sectionBlock">
                  <h3 className="app__onboarding-subtitle">Allergies</h3>
                  <div className="app__onboarding-pillGrid">
                    {ALLERGIES.map((allergy) => (
                      <button
                        type="button"
                        key={allergy}
                        className={`app__onboarding-pill ${form.allergies.includes(allergy) ? "is-selected" : ""}`}
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

                <div className="app__onboarding-sectionBlock">
                  <h3 className="app__onboarding-subtitle">Meals to plan</h3>
                  <div className="app__onboarding-pillGrid">
                    {MEAL_COVERAGE.map((mealType) => (
                      <button
                        type="button"
                        key={mealType}
                        className={`app__onboarding-pill ${form.mealCoverage.includes(mealType) ? "is-selected" : ""}`}
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
                <p className="app__onboarding-eyebrow">Preferences</p>
                <h1 className="app__onboarding-title">What should your food feel like?</h1>
                <p className="app__onboarding-copy">Choose diet rules and cuisines you prefer.</p>

                <div className="app__onboarding-sectionBlock">
                  <h3 className="app__onboarding-subtitle">Diet rules</h3>
                  <div className="app__onboarding-pillGrid">
                    {DIET_RULES.map((rule) => (
                      <button
                        type="button"
                        key={rule}
                        className={`app__onboarding-pill ${form.dietRules.includes(rule) ? "is-selected" : ""}`}
                        onClick={() =>
                          updateForm((current) => ({
                            ...current,
                            dietRules: toggleValue(current.dietRules, rule),
                          }))
                        }
                      >
                        {rule}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="app__onboarding-sectionBlock">
                  <h3 className="app__onboarding-subtitle">Preferred cuisines</h3>
                  <div className="app__onboarding-pillGrid">
                    {CUISINES.map((cuisine) => (
                      <button
                        type="button"
                        key={cuisine}
                        className={`app__onboarding-pill ${form.cuisines.includes(cuisine) ? "is-selected" : ""}`}
                        onClick={() =>
                          updateForm((current) => ({
                            ...current,
                            cuisines: toggleValue(current.cuisines, cuisine),
                          }))
                        }
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {stepIndex === 4 ? (
              <>
                <p className="app__onboarding-eyebrow">Create account</p>
                <h1 className="app__onboarding-title">Save your plan and continue</h1>
                <p className="app__onboarding-copy">Create your account to continue on iPhone or Android.</p>

                <div className="app__onboarding-formColumn">
                  <label className="app__onboarding-field">
                    <span>Full name</span>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.fullName}
                      onChange={(event) =>
                        updateForm((current) => ({
                          ...current,
                          fullName: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="app__onboarding-field">
                    <span>Email</span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(event) =>
                        updateForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="app__onboarding-field">
                    <span>Password</span>
                    <input
                      type="password"
                      placeholder="8+ chars, upper, lower, number"
                      value={form.password}
                      onChange={(event) =>
                        updateForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                    />
                    <p className="app__onboarding-helper">
                      Use at least 8 characters with one uppercase letter, one lowercase letter, and one number.
                    </p>
                  </label>
                </div>

                {submitError ? <p className="app__onboarding-error">{submitError}</p> : null}
              </>
            ) : null}

            <div className="app__onboarding-footer">
              {stepIndex > 0 ? (
                <button
                  type="button"
                  className="app__onboarding-actionButton app__onboarding-actionButton--secondary"
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
                className="app__onboarding-actionButton"
                onClick={handleContinue}
                disabled={!stepValid || isSubmittingRegistration}
              >
                {isLastStep
                  ? isSubmittingRegistration
                    ? "Creating account..."
                    : "Create account"
                  : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
