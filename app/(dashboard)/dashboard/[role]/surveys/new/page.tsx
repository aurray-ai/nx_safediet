import type { Route } from "next";
import Link from "next/link";

import { SurveyBuilder } from "@/components/dashboard/surveys/survey-builder";
import { fetchAdminSurveyTemplates } from "@/lib/api";

export default async function NewSurveyPage({
  params,
}: {
  params: { role: string };
}) {
  const templates = await fetchAdminSurveyTemplates();

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Surveys</p>
          <h2 className="app__admin-groceriesTitle">Create survey</h2>
          <p>Build a new response flow, configure collection settings, and prepare it for publication.</p>
        </div>

        <div className="app__admin-groceriesActions">
          <Link href={`/dashboard/${params.role}/surveys` as Route} className="app__admin-secondaryButton">
            Back to surveys
          </Link>
        </div>
      </section>

      <SurveyBuilder role={params.role} templates={templates.items} />
    </section>
  );
}
