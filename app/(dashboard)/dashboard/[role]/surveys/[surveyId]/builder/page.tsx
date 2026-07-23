import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SurveyBuilder } from "@/components/dashboard/surveys/survey-builder";
import { fetchAdminSurvey } from "@/lib/api";

export default async function SurveyBuilderPage({
  params,
}: {
  params: { role: string; surveyId: string };
}) {
  try {
    const survey = await fetchAdminSurvey(params.surveyId);

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Survey Builder</p>
            <h2 className="app__admin-groceriesTitle">{survey.title}</h2>
            <p>Build sections, reorder questions, and tune the question settings panel.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={`/dashboard/${params.role}/surveys/${survey.id}` as Route} className="app__admin-secondaryButton">
              Back to workspace
            </Link>
          </div>
        </section>

        <SurveyBuilder role={params.role} initialSurvey={survey} />
      </section>
    );
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
