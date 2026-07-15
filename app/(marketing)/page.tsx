"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { Newsletter } from "@/components/marketing/newsletter";
import { SiteNavbar } from "@/components/marketing/site-navbar";

const howItWorks = [
  {
    imgUrl: "/assets/award01.png",
    title: "Set your goals and budget",
    subtitle:
      "Tell SafeDiet what you want to eat, what you want to spend, and how you want the week to feel.",
  },
  {
    imgUrl: "/assets/award02.png",
    title: "AI meal planning",
    subtitle:
      "Get a daily or weekly plan shaped around your budget, your preferences, and the meals that fit your routine.",
  },
  {
    imgUrl: "/assets/award03.png",
    title: "Request meals or groceries",
    subtitle:
      "Choose chef-prepared meals or request groceries with matched recipes when you want support in the kitchen.",
  },
  {
    imgUrl: "/assets/award05.png",
    title: "Delivery to your doorstep",
    subtitle:
      "Have your meals or grocery order delivered so your plan stays simple, practical, and easy to follow.",
  },
];

const galleryMeals = [
  {
    image: "/assets/gallery01.png",
    name: "Berry oats bowl",
    cost: "£4",
    description: "Fresh breakfast support built for a calm start to the day.",
    meta: ["Breakfast", "1 serving", "15 min"],
  },
  {
    image: "/assets/gallery02.png",
    name: "Roasted chicken plate",
    cost: "£8",
    description: "A warm dinner option that feels balanced without feeling heavy.",
    meta: ["Dinner", "2 servings", "35 min"],
  },
  {
    image: "/assets/gallery03.png",
    name: "Lunch grain bowl",
    cost: "£6",
    description: "A practical meal for busy days and repeatable weekly planning.",
    meta: ["Lunch", "1 serving", "20 min"],
  },
  {
    image: "/assets/gallery04.png",
    name: "Fresh prep plate",
    cost: "£7",
    description: "A preview of the kind of meals the catalog should feel like.",
    meta: ["Chef available", "2 servings", "30 min"],
  },
];

function SubHeading({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p className="p__cormorant">{title}</p>
      <img src="/assets/spoon.svg" alt="spoon_image" className="spoon__img" />
    </div>
  );
}

function MealCard({ meal }: { meal: (typeof galleryMeals)[number] }) {
  return (
    <article className="app__mealCard app__mealCard--featured">
      <div className="app__mealCard-imageWrapper">
        <img src={meal.image} alt={meal.name} />
      </div>
      <div className="app__mealCard-content">
        <div className="app__mealCard-header">
          <p className="p__cormorant">{meal.name}</p>
          <span className="app__mealCard-cost">{meal.cost}</span>
        </div>
        <p className="app__mealCard-description p__opensans">{meal.description}</p>
        <div className="app__mealCard-meta">
          {meal.meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playVideo, setPlayVideo] = useState(false);

  const scroll = (direction: "left" | "right") => {
    const current = scrollRef.current;
    if (!current) {
      return;
    }

    current.scrollLeft += direction === "left" ? -300 : 300;
  };

  return (
    <>
      <SiteNavbar />

      <header className="app__header app__wrapper section__padding" id="home">
        <div className="app__wrapper_info">
          <SubHeading title="Healthy meals, planned around your budget" />
          <h1 className="app__header-h1">Your personal chef for smarter weekly eating</h1>
          <br />
          <br />
          <Link href="/start-planning" className="custom__button">
            Start Planning
          </Link>
        </div>

        <div className="app__wrapper_img">
          <img src="/assets/assets_3.png" alt="Fresh SafeDiet meal planning hero" />
        </div>
      </header>

      <section className="app__bg app__wrapper section__padding app__howitworks" id="how-it-works">
        <div className="app__wrapper_info">
          <SubHeading title="How SafeDiet works" />
          <h1 className="headtext__cormorant app__howitworks-heading">
            We help plan your meals for the week ahead, bring it to your doorstep, and help you
            stay on track
          </h1>

          <div className="app__howitworks_steps">
            {howItWorks.map((step) => (
              <div className="app__howitworks_step-card" key={step.title}>
                <img src={step.imgUrl} alt={step.title} />
                <div className="app__howitworks_step-card_content">
                  <p className="p__cormorant" style={{ color: "#DCCA87" }}>
                    {step.title}
                  </p>
                  <p className="p__opensans">{step.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app__aboutus app__bg flex__center section__padding" id="about">
        

        <div className="app__aboutus-content flex__center">
          <div className="app__aboutus-content_about">
            <h1 className="headtext__cormorant">About SafeDiet</h1>
            <img src="/assets/spoon.svg" alt="about_spoon" className="spoon__img" />
            <p className="p__opensans">
              SafeDiet is a personal chef experience designed for people who want healthier meals
              without losing control of their spending. We turn budgets, preferences, and routines
              into practical meal decisions.
            </p>
            <Link href="/start-planning" className="custom__button">
              Learn More
            </Link>
          </div>

          <div className="app__aboutus-content_knife flex__center">
            <img src="/assets/packaging.png" alt="about_knife" />
          </div>

          <div className="app__aboutus-content_history">
            <h1 className="headtext__cormorant">How It Works</h1>
            <img src="/assets/spoon.svg" alt="about_spoon" className="spoon__img" />
            <p className="p__opensans">
              You choose your goals and budget, SafeDiet builds a plan, and you can request
              groceries, recipes, or meal support that keeps your week easy to follow.
            </p>
            <Link href="/start-planning" className="custom__button">
              See Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="app__bg app__wrapper section__padding">
        <div className="app__wrapper_img app__wrapper_img-reverse">
          <img src="/assets/chef.png" alt="chef_image" />
        </div>
        <div className="app__wrapper_info">
          <SubHeading title="Our approach" />
          <h1 className="headtext__cormorant">Healthy meals should still feel realistic</h1>

          <div className="app__chef-content">
            <div className="app__chef-content_quote">
              <img src="/assets/quote.png" alt="quote_image" />
              <p className="p__opensans">Good planning should reduce stress, not add more of it.</p>
            </div>
            <p className="p__opensans">
              SafeDiet combines budget awareness, healthier meal choices, and practical support so
              people can stay consistent through busy days, changing routines, and real grocery
              limits.
            </p>
          </div>

          <div className="app__chef-sign">
            <p>SafeDiet</p>
            <p className="p__opensans">Personal Chef Planning Platform</p>
            <img src="/assets/sign.png" alt="sign_image" />
          </div>
        </div>
      </section>

      <section className="app__video">
        <video ref={videoRef} src="/assets/meal.mp4" loop controls={false} muted />
        <div className="app__video-overlay flex__center">
          <button
            type="button"
            className="app__video-overlay_circle flex__center"
            onClick={() => {
              setPlayVideo((current) => {
                const next = !current;
                if (next) {
                  videoRef.current?.play();
                } else {
                  videoRef.current?.pause();
                }
                return next;
              });
            }}
          >
            <span className="p__cormorant" style={{ color: "#fff", fontSize: "30px" }}>
              {playVideo ? "❚❚" : "▶"}
            </span>
          </button>
        </div>
      </section>

      <section className="app__gallery flex__center">
        <div className="app__gallery-content">
          <SubHeading title="Meal selection" />
          <h1 className="headtext__cormorant">Featured Meals</h1>
          <p className="p__opensans" style={{ color: "#AAAAAA", marginTop: "2rem", textTransform: "none" }}>
            Browse real meals from the SafeDiet catalog. This section should feel like a preview of
            what customers can actually order, not a generic photo strip.
          </p>
          <Link href="/start-planning" className="custom__button app__gallery-link">
            See more meals
          </Link>
        </div>
        <div className="app__gallery-images">
          <div className="app__gallery-images_container" ref={scrollRef}>
            {galleryMeals.map((meal) => (
              <MealCard meal={meal} key={meal.name} />
            ))}
          </div>
          <div className="app__gallery-images_arrows">
            <button
              type="button"
              className="gallery__arrow-icon"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              type="button"
              className="gallery__arrow-icon"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>
      </section>

      <section className="app__bg app__wrapper section__padding app__rewards" id="rewards">
        <div className="app__wrapper_info">
          <SubHeading title="Rewards" />
          <h1 className="headtext__cormorant app__rewards-heading">Rewards for healthier eating</h1>
          <div className="app__wrapper-content app__rewards-content">
            <p className="p__opensans">SafeDiet rewards consistency, not short-term effort.</p>
            <p className="p__cormorant app__rewards-label">Earn rewards for</p>
            <p className="p__opensans">
              Following your plan, staying on budget, and keeping healthy streaks
            </p>
            <p className="p__opensans">
              Redeem them on groceries, premium features, chef services, or partner discounts
            </p>
          </div>
          <Link href="/start-planning" className="custom__button app__rewards-button">
            Start Planning
          </Link>
        </div>

        <div className="app__wrapper_img app__rewards-image">
          <img src="/assets/reward.png" alt="SafeDiet rewards programme" />
        </div>
      </section>

      <Newsletter />

      <footer className="app__footer section__padding" id="login">
        <div className="app__footerOverlay" aria-hidden="true">
          <div className="app__footerOverlay-black" />
          <div className="app__footerOverlay-img app__bg" />
        </div>

        <div className="app__footer-links">
          <div className="app__footer-links_contact">
            <h1 className="app__footer-headtext">Start with your plan</h1>
            <p className="p__opensans">Budget-aware healthy meal planning</p>
            <p className="p__opensans">Chef support, groceries, and recipes</p>
            <p className="p__opensans">Delivery options that fit your week</p>
          </div>

          <div className="app__footer-links_logo">
            <img src="/brand/logo.png" alt="SafeDiet logo" />
            <p className="p__opensans">
              Personal chef planning that helps you eat healthier, spend smarter, and stay
              consistent through the week.
            </p>
            <img
              src="/assets/spoon.svg"
              alt="decorative spoon"
              className="spoon__img"
              style={{ marginTop: 15 }}
            />
            <div className="app__footer-links_icons" aria-hidden="true">
              <span>
                <svg viewBox="0 0 24 24">
                  <path
                    d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.5V3.8c-.3 0-1.1-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.9V10H8v3h2.7v8h2.8Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>
                <svg viewBox="0 0 24 24">
                  <path
                    d="M21 6.5c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.7.8-2.6 1-1.4-1.5-3.8-1.6-5.3-.2-1 .9-1.4 2.2-1.1 3.5-3-.2-5.8-1.7-7.7-4.1-1 1.7-.5 3.8 1.1 4.9-.6 0-1.2-.2-1.7-.5 0 1.9 1.3 3.5 3.2 3.9-.6.2-1.2.2-1.8.1.5 1.6 2 2.7 3.7 2.7A7.7 7.7 0 0 1 3 18.6 10.8 10.8 0 0 0 8.8 20c7 0 10.9-5.8 10.9-10.9v-.5c.8-.6 1.4-1.2 1.9-2.1Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3Zm0 1.8A3 3 0 0 0 4.8 7.8v8.4a3 3 0 0 0 3 3h8.4a3 3 0 0 0 3-3V7.8a3 3 0 0 0-3-3H7.8Zm8.9 1.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.6A4.4 4.4 0 1 1 7.6 12 4.4 4.4 0 0 1 12 7.6Zm0 1.8A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="app__footer-links_work">
            <h1 className="app__footer-headtext">Core support</h1>
            <p className="p__opensans">Set your goals and budget</p>
            <p className="p__opensans">Receive daily or weekly meal plans</p>
            <p className="p__opensans">Request meals, groceries, or recipes</p>
            <p className="p__opensans">Get deliveries that keep your plan moving</p>
          </div>
        </div>

        <div className="footer__copyright">
          <p className="p__opensans">2026 SafeDiet. All Rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
