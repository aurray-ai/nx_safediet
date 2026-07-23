import Link from "next/link";

import { HouseholdInviteView } from "@/components/household/household-invite-view";
import { getSession } from "@/lib/session";

type HouseholdInvitePageProps = {
  params: {
    token: string;
  };
};

export default async function HouseholdInvitePage({ params }: HouseholdInvitePageProps) {
  const session = await getSession();

  return (
    <section className="app__auth section__padding">
      <Link href="/" className="app__auth-homeLink">
        Back to home
      </Link>

      <div className="app__auth-shell">
        <HouseholdInviteView
          token={params.token}
          isAuthenticated={session !== null}
          currentEmail={session?.user.email ?? null}
        />
      </div>
    </section>
  );
}
