"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TOTAL_DURATION_MS = 20000;
const TICK_MS = 120;

const PROGRESS_STEPS = [
  { threshold: 0.16, label: "Setting up your account" },
  { threshold: 0.36, label: "Saving your goals" },
  { threshold: 0.56, label: "Matching your meal preferences" },
  { threshold: 0.78, label: "Preparing groceries and delivery support" },
  { threshold: 1, label: "Finalizing your Safediet setup" },
];

export default function AccountSetupPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();

    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(elapsed / TOTAL_DURATION_MS, 1);

      setProgress(nextProgress);

      if (nextProgress >= 1) {
        window.clearInterval(intervalId);
        router.push("/install-app");
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [router]);

  const currentStep =
    PROGRESS_STEPS.find((step) => progress <= step.threshold) || PROGRESS_STEPS[PROGRESS_STEPS.length - 1];

  return (
    <section className="app__accountSetup section__padding">
      <Link href="/" className="app__accountSetup-homeLink">
        Back to home
      </Link>

      <div className="app__accountSetup-shell">
        <div className="app__accountSetup-logoWrap" aria-hidden="true">
          <div className="app__accountSetup-logoGlow" />
          <img src="/brand/logo.png" alt="" className="app__accountSetup-logo" />
        </div>

        <p className="app__accountSetup-eyebrow">Almost there</p>
        <h1 className="app__accountSetup-title">Getting your Safediet profile ready.</h1>
        <p className="app__accountSetup-status">{currentStep.label}</p>

        <div className="app__accountSetup-progressTrack" aria-hidden="true">
          <div
            className="app__accountSetup-progressFill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <div className="app__accountSetup-progressMeta">
          <span>{Math.round(progress * 100)}%</span>
          <span>Preparing your mobile handoff</span>
        </div>
      </div>
    </section>
  );
}
