"use client";

import Image from "next/image";
import { useMemo } from "react";

import { catalogMeals, type CatalogMeal } from "@/components/marketing/home/plan-data";

import styles from "./onboarding-preview.module.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ROW_TYPES = ["Breakfast", "Lunch", "Dinner"] as const;

function estimatePrice(meal: CatalogMeal): number {
  if (meal.price) {
    const parsed = Number(meal.price.replace(/[^0-9.]/g, ""));
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  // Deterministic estimate for dishes without a real price yet, scaled from kcal.
  return Math.round((1.5 + (meal.kcal / 1000) * 1.8) * 20) / 20;
}

type PlanPreviewPanelProps = {
  stepIndex: number;
  mealCoverage: string[];
  allergies: string[];
  budget: number;
};

export function PlanPreviewPanel({ stepIndex, mealCoverage, allergies, budget }: PlanPreviewPanelProps) {
  const pools = useMemo(() => {
    const byType: Record<string, CatalogMeal[]> = {};
    ROW_TYPES.forEach((type) => {
      byType[type] = catalogMeals.filter((meal) => meal.mealType === type);
    });
    return byType;
  }, []);

  const activeRowTypes = ROW_TYPES.filter((type) => mealCoverage.includes(type));
  const hasSnack = mealCoverage.includes("Snack");

  const week = useMemo(() => {
    return DAYS.map((day, dayIndex) => {
      const meals = activeRowTypes.map((type) => {
        const pool = pools[type];
        const meal = pool.length > 0 ? pool[dayIndex % pool.length] : null;
        return { type, meal };
      });
      return { day, meals };
    });
  }, [activeRowTypes, pools]);

  const totalCost = useMemo(() => {
    return week.reduce((weekSum, day) => {
      return (
        weekSum +
        day.meals.reduce((daySum, row) => (row.meal ? daySum + estimatePrice(row.meal) : daySum), 0)
      );
    }, 0);
  }, [week]);

  const isOverBudget = totalCost > budget;
  const showEmpty = stepIndex === 0 || activeRowTypes.length === 0;

  return (
    <aside className={styles.previewPanel} aria-label="Live plan preview">
      <div className={styles.previewHead}>
        <h3>Your week so far</h3>
        <span className={styles.previewHint}>Updates as you answer</span>
      </div>

      {showEmpty ? (
        <p className={styles.previewEmpty}>
          Answer a few questions and we&apos;ll build this into a real week of meals.
        </p>
      ) : (
        <>
          <div className={styles.previewStats}>
            <div className={styles.previewStat}>
              <div className={styles.label}>Est. weekly cost</div>
              <div className={`${styles.value} ${isOverBudget ? styles.valueOver : styles.valueOk}`}>
                £{totalCost.toFixed(2)}
              </div>
            </div>
            <div className={styles.previewStat}>
              <div className={styles.label}>Your budget</div>
              <div className={styles.value}>£{budget.toFixed(0)}</div>
            </div>
          </div>

          {allergies.length > 0 ? (
            <p className={styles.previewTags}>Avoiding: {allergies.join(", ")}</p>
          ) : null}

          <div className={styles.previewGrid}>
            {week.map((day) => (
              <div className={styles.previewDay} key={day.day}>
                <div className={styles.previewDayLabel}>{day.day}</div>
                {day.meals.map(({ type, meal }) =>
                  meal ? (
                    <div className={styles.previewMealRow} key={type}>
                      <div className={styles.previewPlate}>
                        <Image src={meal.image} alt={meal.name} fill sizes="30px" style={{ objectFit: "cover" }} />
                      </div>
                      <span className={styles.previewMealName}>{meal.name}</span>
                      <span className={styles.previewMealKcal}>{meal.kcal} kcal</span>
                    </div>
                  ) : null,
                )}
              </div>
            ))}
          </div>

          {hasSnack ? (
            <p className={styles.previewLimitNote}>
              Snacks are added once you&apos;re in the app — not shown in this preview yet.
            </p>
          ) : null}
        </>
      )}
    </aside>
  );
}
