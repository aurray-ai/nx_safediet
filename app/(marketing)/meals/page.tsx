import Link from "next/link";

const meals = [
  { title: "Full English Breakfast", tag: "Breakfast" },
  { title: "Madras", tag: "Dinner" },
  { title: "Baked Beans and Eggs", tag: "Lunch" },
  { title: "Rarebit", tag: "Snack" },
];

export default function MealsPage() {
  return (
    <main className="marketing-page">
      <section className="marketing-section simple-hero">
        <div className="section-head">
          <div>
            <span className="eyebrow">Meals</span>
            <h1 className="hero-title">Meals that feel like a live catalog.</h1>
          </div>
          <Link href="/login" className="secondary-button">
            Sign in
          </Link>
        </div>
        <div className="meal-preview-grid">
          {meals.map((meal, index) => (
            <article key={meal.title} className="meal-preview-card">
              <img src={`/assets/gallery0${(index % 4) + 1}.png`} alt={meal.title} loading="lazy" />
              <span className="pill">{meal.tag}</span>
              <h3>{meal.title}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
