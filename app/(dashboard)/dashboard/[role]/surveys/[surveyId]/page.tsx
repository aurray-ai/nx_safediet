import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SurveyOverview } from "@/components/dashboard/surveys/survey-overview";
import { fetchAdminSurvey, fetchAdminSurveyAnalytics, fetchAdminSurveyResponses } from "@/lib/api";

export default async function SurveyDetailPage({
  params,
}: {
  params: { role: string; surveyId: string };
}) {
  try {
    const [survey, analytics, responses] = await Promise.all([
      fetchAdminSurvey(params.surveyId),
      fetchAdminSurveyAnalytics(params.surveyId),
      fetchAdminSurveyResponses(params.surveyId),
    ]);

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Surveys</p>
            <h2 className="app__admin-groceriesTitle">{survey.title}</h2>
            <p>Overview, sharing, response health, and analytics in one workspace.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={`/dashboard/${params.role}/surveys` as Route} className="app__admin-secondaryButton">
              Back to surveys
            </Link>
            <Link href={`/dashboard/${params.role}/surveys/${survey.id}/builder` as Route} className="app__admin-primaryButton">
              Open builder
            </Link>
          </div>
        </section>

        <SurveyOverview
          role={params.role}
          survey={survey}
          analytics={analytics}
          responses={responses.items}
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
