"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./home.module.css";
import { IconClose, IconMenu } from "./icons";

const NAV_ITEMS = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/meals", label: "Meals" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#about", label: "About Us" },
  { href: "/", label: "Blog" },
] as const;

export function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`${styles.wrap} ${styles.headerRow}`}>
        <Link href="/" className={styles.logo}>
          <Image src="/brand/logo.png" alt="SafeDiet logo" width={30} height={30} />
          SafeDiet
        </Link>

        <ul className={styles.navLinks}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <div className={styles.headerActions}>
          <Link href="/login" className={`${styles.btn} ${styles.btnGhost}`}>
            Log in
          </Link>
          <Link href="/start-planning" className={`${styles.btn} ${styles.btnPrimary}`}>
            Start Planning
          </Link>
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
          <Link href="/login" onClick={() => setIsOpen(false)}>
            Log in
          </Link>
        </div>
      ) : null}
    </header>
  );
}
