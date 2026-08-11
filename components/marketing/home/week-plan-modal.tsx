"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import styles from "./home.module.css";
import { IconClose, IconDumbbell, IconFlame, IconMoon, IconSun, IconWallet } from "./icons";
import { weekPlan } from "./plan-data";

const MEAL_ROWS = [
  { key: "breakfast" as const, label: "Breakfast", time: "8:00 AM", icon: IconSun },
  { key: "lunch" as const, label: "Lunch", time: "1:00 PM", icon: IconSun },
  { key: "dinner" as const, label: "Dinner", time: "7:00 PM", icon: IconMoon },
];

export function WeekPlanModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(weekPlan[0].day);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const columnRefs = useRef<Record<string, HTMLTableCellElement | null>>({});

  const focusDay = (day: string) => {
    setActiveDay(day);
    const cell = columnRefs.current[day];
    if (cell && tableRef.current) {
      const offset = cell.offsetLeft - 24;
      tableRef.current.scrollTo({ left: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" className={styles.weekPlanFab} onClick={() => setIsOpen(true)}>
        Click to see John Drake&apos;s week plan
      </button>

      {isOpen && (
        <div className={styles.weekPlanOverlay} role="presentation" onClick={() => setIsOpen(false)}>
          <div
            className={styles.weekPlanModal}
            role="dialog"
            aria-modal="true"
            aria-label="John Drake's Week Plan"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.weekPlanModalClose}
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <IconClose />
            </button>

            <div className={styles.weekPlanModalHead}>
              <span className={styles.eyebrow}>Example weekly plan</span>
              <h2>John Drake&apos;s Week Plan</h2>
              <p>Here&apos;s what a real week on SAFEDIET looks like.</p>
            </div>

            <div className={styles.planPanel}>
              <div className={styles.planPanelHead}>
                <div className={styles.dayTabs} role="tablist" aria-label="Jump to day">
                  {weekPlan.map((day) => (
                    <button
                      key={day.day}
                      type="button"
                      role="tab"
                      aria-selected={activeDay === day.day}
                      className={`${styles.dayTab} ${activeDay === day.day ? styles.dayTabActive : ""}`}
                      onClick={() => focusDay(day.day)}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.planTableWrap} ref={tableRef}>
                <table className={styles.planTable}>
                  <thead>
                    <tr>
                      <th aria-hidden="true" />
                      {weekPlan.map((day) => (
                        <th
                          key={day.day}
                          ref={(el) => {
                            columnRefs.current[day.day] = el;
                          }}
                        >
                          {day.day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MEAL_ROWS.map((row) => (
                      <tr key={row.key}>
                        <td>
                          <div className={styles.mealRowLabel}>
                            <row.icon />
                            <span>
                              <span className={styles.t}>{row.label}</span>
                              <br />
                              <span className={styles.h}>{row.time}</span>
                            </span>
                          </div>
                        </td>
                        {weekPlan.map((day) => {
                          const meal = day[row.key];
                          return (
                            <td key={day.day}>
                              <div className={styles.planCell}>
                                <div className={styles.planPlate}>
                                  <Image
                                    src={meal.image}
                                    alt={meal.name}
                                    fill
                                    sizes="62px"
                                    style={{ objectFit: "cover" }}
                                  />
                                </div>
                                <span className={styles.planMealName}>{meal.name}</span>
                                <span className={styles.planMealKcal}>{meal.kcal} kcal</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.planPanelFoot}>
                <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                  Nutrition balanced. Variety guaranteed.
                </span>
                <div className={styles.footStats}>
                  <span className={styles.footStat}>
                    <IconFlame />
                    1,890 kcal / day
                  </span>
                  <span className={styles.footStat}>
                    <IconDumbbell />
                    92g protein / day
                  </span>
                  <span className={styles.footStat}>
                    <IconWallet />
                    £38.50 left
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
