import type { Metadata } from "next";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = {
  title: "Start Planning",
  description:
    "Set your weekly food budget, dietary needs and preferences — SAFEDIET builds your first AI-planned week for free.",
  alternates: {
    canonical: "/start-planning",
  },
};

export default function StartPlanningPage() {
  return <OnboardingFlow initialStep={0} />;
}
