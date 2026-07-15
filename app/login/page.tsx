import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <section className="app__auth section__padding">
      <Link href="/" className="app__auth-homeLink">
        Back to home
      </Link>

      <div className="app__auth-shell">
        {/* <div className="app__auth-brand" aria-hidden="true">
          <img src="/brand/logo.png" alt="" className="app__auth-logo" />
        </div> */}

        <div className="app__auth-panel">
          <div className="app__auth-panelInner">
            <p className="app__auth-eyebrow">Welcome back</p>
            <h2 className="app__auth-title">Sign in to Safediet</h2>
            {/* <p className="app__auth-copy">
              Use the same customer account you created during onboarding.
            </p> */}

            <LoginForm />

            <div className="app__auth-meta">
              <p className="app__auth-helper">
                New here? <Link href="/start-planning">Create your account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
