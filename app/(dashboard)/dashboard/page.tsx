import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

export default async function DashboardEntryPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  redirect(session.defaultDashboardHref);
}
