"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import styles from "@/components/marketing/home/home.module.css";
import { IconHeart } from "@/components/marketing/home/icons";
import { catalogMeals } from "@/components/marketing/home/plan-data";

const FILTERS = ["All", "Breakfast", "Lunch", "Dinner", "Featured"] as const;

export default function MealsPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");

  const visibleMeals = useMemo(
    () => (activeFilter === "All" ? catalogMeals : catalogMeals.filter((meal) => meal.mealType === activeFilter)),
    [activeFilter],
  );

  return (
    <div className={styles.home}>
      <HomeNavbar />
      <main>
        <section className={styles.catalogHero}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Meal catalog</span>
            <h1 className={styles.sharedBudgetTitle} style={{ textAlign: "center" }}>
              Every meal, planned around you.
            </h1>
            <p className={styles.heroSub} style={{ margin: "18px auto 0", textAlign: "center" }}>
              Browse the meals SAFEDIET plans into your week — filter by breakfast, lunch, or dinner,
              or see the ones our members love most.
            </p>

            <div className={styles.catalogFilters} role="tablist" aria-label="Filter meals">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter}
                  className={`${styles.dayTab} ${activeFilter === filter ? styles.dayTabActive : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} style={{ paddingTop: 24 }}>
          <div className={styles.wrap}>
            {visibleMeals.length === 0 ? (
              <p className={styles.catalogEmpty}>No meals in this category yet.</p>
            ) : (
              <div className={styles.catalogGrid}>
                {visibleMeals.map((meal) => (
                  <article className={styles.mealCard} key={meal.name}>
                    <div className={styles.mealCardPlate}>
                      <div className={styles.mealCardPlateIcon}>
                        <Image src={meal.image} alt={meal.name} fill sizes="230px" style={{ objectFit: "cover" }} />
                      </div>
                      <span className={styles.mealCardTag}>{meal.mealType}</span>
                    </div>
                    <div className={styles.mealCardBody}>
                      <h3>{meal.name}</h3>
                      <div className={styles.mealCardMeta}>{meal.kcal} kcal</div>
                      <div className={styles.mealCardPrice}>
                        <span className={styles.price}>{meal.price ?? "In your plan"}</span>
                        <IconHeart />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.wrap} style={{ textAlign: "center" }}>
            <Link href="/start-planning" className={`${styles.btn} ${styles.btnPrimary}`}>
              Start Planning — It&apos;s Free
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
