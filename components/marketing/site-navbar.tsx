"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/start-planning", label: "Planner" },
  { href: "/meals", label: "Meals" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#rewards", label: "Rewards" },
] as const;

export function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <Link href="/">
          <img src="/brand/logo.png" alt="SafeDiet logo" />
        </Link>
      </div>

      <ul className="app__navbar-links">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className="p__opensans">
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>

      <div className="app__navbar-login">
        <Link href="/login" className="p__opensans">
          Log In
        </Link>
        <div />
        <Link href="/start-planning" className="p__opensans">
          Start Planning
        </Link>
      </div>

      <div className="app__navbar-smallscreen">
        <button
          type="button"
          className="app__navbar-menuButton"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {isOpen ? (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <button
              type="button"
              className="overlay__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <ul className="app__navbar-smallscreen_links">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/start-planning" onClick={() => setIsOpen(false)}>
                  Start Planning
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
