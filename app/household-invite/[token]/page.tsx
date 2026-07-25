import { HouseholdInviteView } from "@/components/household/household-invite-view";
import inviteStyles from "@/components/household/household-invite-view.module.css";
import { PublicSiteLayout } from "@/components/marketing/public-site-layout";
import { getSession } from "@/lib/session";

type HouseholdInvitePageProps = {
  params: {
    token: string;
  };
};

export default async function HouseholdInvitePage({ params }: HouseholdInvitePageProps) {
  const session = await getSession();

  return (
    <PublicSiteLayout>
      <section className={inviteStyles.pageSection}>
        <div className={inviteStyles.wrap}>
          <HouseholdInviteView
            token={params.token}
            isAuthenticated={session !== null}
            currentEmail={session?.user.email ?? null}
          />
        </div>
      </section>
    </PublicSiteLayout>
  );
}
