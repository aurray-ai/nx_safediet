import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SurveyCoreReports } from "@/components/dashboard/surveys/survey-core-reports";
import { SurveyWorkspaceNav } from "@/components/dashboard/surveys/survey-workspace-nav";
import { fetchAdminSurvey, fetchAdminSurveyAnalytics } from "@/lib/api";

export default async function SurveyReportsPage({
  params,
}: {
  params: { role: string; surveyId: string };
}) {
  try {
    const [survey, analytics] = await Promise.all([
      fetchAdminSurvey(params.surveyId),
      fetchAdminSurveyAnalytics(params.surveyId),
    ]);

    const exportPath = `/api/admin/surveys/${survey.id}/export`;

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Survey Reports</p>
            <h2 className="app__admin-groceriesTitle">{survey.title}</h2>
            <p>Four strategy reports built directly from survey responses for product and insight planning.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={`/dashboard/${params.role}/surveys/${survey.id}` as Route} className="app__admin-secondaryButton">
              Back to workspace
            </Link>
            <Link href={exportPath as Route} className="app__admin-primaryButton">
              Export CSV
            </Link>
          </div>
        </section>

        <section className="survey-workspace__grid">
          <SurveyWorkspaceNav
            role={params.role}
            surveyId={survey.id}
            active="reports"
            exportHref={exportPath}
          />
          <div className="survey-reports__main">
            <SurveyCoreReports analytics={analytics} exportHref={exportPath} />
          </div>
        </section>
      </section>
    );
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
