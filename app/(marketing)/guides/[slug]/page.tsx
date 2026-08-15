import Link from "next/link";
import { notFound } from "next/navigation";

import { HomeFinalCta } from "@/components/marketing/home/home-final-cta";
import { HomeFooter } from "@/components/marketing/home/home-footer";
import { HomeNavbar } from "@/components/marketing/home/home-navbar";
import styles from "@/components/marketing/home/home.module.css";
import { BreadcrumbJsonLd } from "@/components/marketing/content/breadcrumb-jsonld";
import { getGuideBySlug, guides } from "@/components/marketing/content/guides-data";
import { getSession } from "@/lib/session";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

const PILLAR_LABELS: Record<string, string> = {
  "ai-meal-planning": "AI Meal Planning",
  "grocery-delivery": "Grocery Delivery",
  "kitchen-pantry-tracker": "Kitchen & Pantry Tracker",
  "split-grocery-bills": "Split Grocery Bills",
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    notFound();
  }

  const session = await getSession();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishedAt,
    author: {
      "@type": "Organization",
      name: "SAFEDIET",
    },
    publisher: {
      "@type": "Organization",
      name: "SAFEDIET",
    },
  };

  return (
    <div className={styles.home}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ]}
      />
      <HomeNavbar dashboardHref={session?.defaultDashboardHref ?? null} />
      <main>
        <section className={styles.catalogHero}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>{guide.tag}</span>
            <h1 className={styles.sharedBudgetTitle} style={{ textAlign: "center" }}>
              {guide.title}
            </h1>
            <div className={styles.guideMeta}>
              <span>{new Date(guide.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span>·</span>
              <span>{guide.readingTime}</span>
            </div>
          </div>
        </section>

        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.wrap}>
            <article className={styles.guideArticle}>
              {guide.sections.map((section) => (
                <div key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  {section.list ? (
                    <ul>
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </article>

            <div className={styles.guideArticle} style={{ marginTop: 40, textAlign: "center" }}>
              <Link href={`/${guide.pillarSlug}`} className={`${styles.btn} ${styles.btnGhost}`}>
                Learn more about {PILLAR_LABELS[guide.pillarSlug]}
              </Link>
              <div style={{ marginTop: 16 }}>
                <Link href="/guides" className={styles.secondaryLink}>
                  Back to all guides
                </Link>
              </div>
            </div>
          </div>
        </section>

        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
