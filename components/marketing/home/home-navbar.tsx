"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";

import styles from "./home.module.css";
import { IconClose, IconMenu } from "./icons";

type HomeNavbarProps = {
  dashboardHref?: string | null;
};

const NAV_ITEMS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/meals", label: "Meals" },
  { href: "/#pricing", label: "Pricing" },
] as const;

export function HomeNavbar({ dashboardHref = null }: HomeNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = Boolean(dashboardHref);
  const resolvedDashboardHref = (dashboardHref ?? "/dashboard") as Route;

  return (
    <header className={styles.header}>
      <div className={`${styles.wrap} ${styles.headerRow}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>
            <Image src="/assets/logo.png" alt="SAFEDIET logo" width={52} height={52} />
          </span>
          <span className={styles.logoWordmark}>SAFEDIET</span>
        </Link>

        <ul className={styles.navLinks}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <div className={styles.headerActions}>
          {isAuthenticated ? (
            <Link href={resolvedDashboardHref} className={`${styles.btn} ${styles.btnPrimary}`}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={`${styles.btn} ${styles.btnGhost}`}>
                Log in
              </Link>
              <Link href="/start-planning" className={`${styles.btn} ${styles.btnPrimary}`}>
                Start Planning
              </Link>
            </>
          )}
          <button
            type="button"
            className={styles.navToggle}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className={`${styles.wrap} ${styles.mobileMenu}`}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href={isAuthenticated ? resolvedDashboardHref : "/login"} onClick={() => setIsOpen(false)}>
            {isAuthenticated ? "Dashboard" : "Log in"}
          </Link>
          {!isAuthenticated ? (
            <Link href="/start-planning" onClick={() => setIsOpen(false)}>
              Start Planning
            </Link>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
