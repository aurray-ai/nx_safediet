import Link from "next/link";

import { StaffInviteForm } from "@/components/auth/staff-invite-form";

type StaffInvitePageProps = {
  params: {
    token: string;
  };
};

export default function StaffInvitePage({ params }: StaffInvitePageProps) {
  return (
    <section className="app__auth section__padding">
      <Link href="/" className="app__auth-homeLink">
        Back to home
      </Link>

      <div className="app__auth-shell">
        <div className="app__auth-panel">
          <div className="app__auth-panelInner">
            <p className="app__auth-eyebrow">Welcome to the team</p>
            <h2 className="app__auth-title">Set up your Safediet account</h2>
            <p className="app__auth-copy">
              You've been added to the Safediet team. Choose a password to finish setting up your account.
            </p>

            <StaffInviteForm token={params.token} />

            <div className="app__auth-meta">
              <p className="app__auth-helper">
                Already set up your account? <Link href="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
