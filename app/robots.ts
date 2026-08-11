import type { MetadataRoute } from "next";

const SITE_URL = "https://safediet.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/dashboard/",
          "/login",
          "/register",
          "/account-setup",
          "/household-invite",
          "/staff-invite",
          "/onboarding-prototype",
          "/surveys",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
