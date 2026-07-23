"use client";

import Link from "next/link";
import { useRef } from "react";

import styles from "./home.module.css";
import { IconChevronLeft, IconChevronRight, IconHeart } from "./icons";
import { PlateIcon } from "./plate-icon";
import { featuredMeals } from "./plan-data";

export function HomeFeaturedMeals() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -270 : 270, behavior: "smooth" });
  };

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHeadRow}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Featured meals</span>
            <h2>Chef-curated. AI-approved.</h2>
            <p>Explore some of our most loved and nutritious meals.</p>
          </div>
          <div className={styles.carouselNav}>
            <button type="button" onClick={() => scroll("left")} aria-label="Scroll left">
              <IconChevronLeft />
            </button>
            <button type="button" onClick={() => scroll("right")} aria-label="Scroll right">
              <IconChevronRight />
            </button>
          </div>
        </div>

        <div className={styles.mealScroll} ref={scrollRef}>
          {featuredMeals.map((meal, index) => (
            <article className={styles.mealCard} key={meal.name}>
              <div className={styles.mealCardPlate}>
                <PlateIcon seed={index} className={styles.mealCardPlateIcon} />
                <span className={styles.mealCardTag}>{meal.tag}</span>
              </div>
              <div className={styles.mealCardBody}>
                <h3>{meal.name}</h3>
                <div className={styles.mealCardMeta}>
                  {meal.kcal} kcal · {meal.protein}g protein · {meal.minutes} mins
                </div>
                <div className={styles.mealCardPrice}>
                  <span className={styles.price}>{meal.price} / serving</span>
                  <IconHeart />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.browseAllWrap}>
          <Link href="/meals" className={`${styles.btn} ${styles.btnGhost}`}>
            Browse All Meals
          </Link>
        </div>
      </div>
    </section>
  );
}
