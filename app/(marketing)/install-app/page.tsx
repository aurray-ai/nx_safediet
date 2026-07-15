import Link from "next/link";

export default function InstallAppPage() {
  return (
    <main className="marketing-page">
      <section className="marketing-section split-section">
        <div className="section-copy-block">
          <span className="eyebrow">Install app</span>
          <h1 className="hero-title">Continue on mobile when you want the full experience.</h1>
          <p className="section-copy">
            The install flow will move here later. For now this page keeps the route available and
            maintains the same visual system.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard/admin" className="primary-button">
              Open dashboard
            </Link>
            <Link href="/" className="secondary-button">
              Back to home
            </Link>
          </div>
        </div>
        <div className="rewards-image-card">
          <img src="/assets/app_install.png" alt="Install SafeDiet app preview" loading="lazy" />
        </div>
      </section>
    </main>
  );
}
