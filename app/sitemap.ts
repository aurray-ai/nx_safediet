import type { MetadataRoute } from "next";

import { guides } from "@/components/marketing/content/guides-data";

const SITE_URL = "https://safediet.org";

const ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" },
  { path: "/meals", priority: 0.7, changeFrequency: "weekly" },
  { path: "/ai-meal-planning", priority: 0.9, changeFrequency: "monthly" },
  { path: "/grocery-delivery", priority: 0.9, changeFrequency: "monthly" },
  { path: "/kitchen-pantry-tracker", priority: 0.9, changeFrequency: "monthly" },
  { path: "/split-grocery-bills", priority: 0.9, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.7, changeFrequency: "weekly" },
  { path: "/start-planning", priority: 0.6, changeFrequency: "monthly" },
  { path: "/install-app", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const guideEntries = guides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...guideEntries];
}
