import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meal Catalog",
  description:
    "Browse every meal SAFEDIET plans into your week — breakfast, lunch and dinner, priced and ready to add to your budget-aware plan.",
  alternates: {
    canonical: "/meals",
  },
};

export default function MealsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
