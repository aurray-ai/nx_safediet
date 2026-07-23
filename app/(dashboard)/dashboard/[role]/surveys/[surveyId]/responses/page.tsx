import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SurveyResponsesTable } from "@/components/dashboard/surveys/survey-responses-table";
import { fetchAdminSurvey, fetchAdminSurveyAnalytics, fetchAdminSurveyResponses } from "@/lib/api";

export default async function SurveyResponsesPage({
  params,
}: {
  params: { role: string; surveyId: string };
}) {
  try {
    const [survey, responses, analytics] = await Promise.all([
      fetchAdminSurvey(params.surveyId),
      fetchAdminSurveyResponses(params.surveyId),
      fetchAdminSurveyAnalytics(params.surveyId),
    ]);

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Surveys</p>
            <h2 className="app__admin-groceriesTitle">{survey.title} responses</h2>
            <p>Review submissions, inspect answer details, and export the collected dataset.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={`/dashboard/${params.role}/surveys/${survey.id}` as Route} className="app__admin-secondaryButton">
              Back to workspace
            </Link>
            <Link href={`/api/admin/surveys/${survey.id}/export` as Route} className="app__admin-primaryButton">
              Export CSV
            </Link>
          </div>
        </section>

        <SurveyResponsesTable
          role={params.role}
          surveyId={survey.id}
          items={responses.items}
          total={responses.total}
          analytics={analytics}
        />
      </section>
    );
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
