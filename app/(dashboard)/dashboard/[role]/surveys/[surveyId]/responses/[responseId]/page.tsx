import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/lib/admin-format";
import { fetchAdminSurvey, fetchAdminSurveyResponse } from "@/lib/api";

export default async function SurveyResponseDetailPage({
  params,
}: {
  params: { role: string; surveyId: string; responseId: string };
}) {
  try {
    const [survey, response] = await Promise.all([
      fetchAdminSurvey(params.surveyId),
      fetchAdminSurveyResponse(params.surveyId, params.responseId),
    ]);

    const questionMap = new Map(survey.questions.map((question) => [question.id, question]));

    return (
      <section className="app__admin-groceries">
        <section className="app__admin-groceriesHeader">
          <div>
            <p className="app__admin-eyebrow">Survey response</p>
            <h2 className="app__admin-groceriesTitle">{response.respondent.email || response.respondent.name || response.id}</h2>
            <p>Submitted {formatDate(response.submitted_at)}.</p>
          </div>

          <div className="app__admin-groceriesActions">
            <Link href={`/dashboard/${params.role}/surveys/${survey.id}/responses` as Route} className="app__admin-secondaryButton">
              Back to responses
            </Link>
          </div>
        </section>

        <section className="app__admin-productSection">
          <div className="app__admin-dataList">
            {response.answers.map((answer) => {
              const question = questionMap.get(answer.question_id);
              return (
                <article key={answer.question_id} className="app__admin-dataRow app__admin-dataRow--stacked">
                  <div className="app__admin-stack">
                    <strong>{question?.title ?? answer.question_id}</strong>
                    {question?.description ? <span>{question.description}</span> : null}
                  </div>
                  <div className="app__admin-tagRow">
                    <span className="app__admin-categoryPill">{question?.type ?? answer.type}</span>
                  </div>
                  <p>
                    {Array.isArray(answer.value)
                      ? answer.value.map((item) => String(item)).join(", ")
                      : String(answer.value ?? "")}
                  </p>
                </article>
              );
            })}
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
