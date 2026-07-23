import type { Route } from "next";
import Link from "next/link";

import { formatDate } from "@/lib/admin-format";
import type { SurveyAnalytics, SurveySubmission } from "@/lib/types";

type SurveyResponsesTableProps = {
  role: string;
  surveyId: string;
  items: SurveySubmission[];
  total: number;
  analytics: SurveyAnalytics;
};

export function SurveyResponsesTable({
  role,
  surveyId,
  items,
  total,
  analytics,
}: SurveyResponsesTableProps) {
  return (
    <>
      <section className="app__admin-summaryGrid">
        <article className="app__admin-productStat">
          <strong>{total}</strong>
          <span>Total responses</span>
        </article>
        <article className="app__admin-productStat">
          <strong>{analytics.question_stats.length}</strong>
          <span>Tracked questions</span>
        </article>
        <article className="app__admin-productStat">
          <strong>{analytics.latest_response_at ? formatDate(analytics.latest_response_at) : "None"}</strong>
          <span>Latest response</span>
        </article>
        <article className="app__admin-productStat">
          <strong>{analytics.question_stats.filter((item) => Object.keys(item.choice_counts).length > 0).length}</strong>
          <span>Choice summaries</span>
        </article>
      </section>

      {items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No responses</p>
          <h2>No one has answered this survey yet</h2>
        </section>
      ) : (
        <section className="app__admin-productSection">
          <div className="app__admin-dataList">
            {items.map((response) => (
              <article key={response.id} className="app__admin-dataRow">
                <div className="app__admin-stack">
                  <strong>{response.respondent.email || response.respondent.name || "Anonymous respondent"}</strong>
                  <span>{response.answers.length} recorded answers</span>
                </div>

                <div className="app__admin-dataStats">
                  <span>Submitted: {formatDate(response.submitted_at)}</span>
                  <span>Version: {response.survey_version}</span>
                </div>

                <div className="app__admin-actionsWrap">
                  <Link
                    href={`/dashboard/${role}/surveys/${surveyId}/responses/${response.id}` as Route}
                    className="app__admin-primaryButton"
                  >
                    Open response
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="app__admin-productSection">
            <h2>Question summaries</h2>
            <div className="app__admin-dataList">
              {analytics.question_stats.map((question) => (
                <article key={question.question_id} className="app__admin-dataRow app__admin-dataRow--stacked">
                  <div className="app__admin-stack">
                    <strong>{question.title}</strong>
                    <span>{question.response_count} responses</span>
                  </div>
                  {Object.keys(question.choice_counts).length > 0 ? (
                    <div className="app__admin-tagRow">
                      {Object.entries(question.choice_counts).map(([label, count]) => (
                        <span key={`${question.question_id}-${label}`} className="app__admin-tagPill">
                          {label}: {count}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="app__admin-inlineMeta">No aggregate choices for this question type.</span>
                  )}
                </article>
              ))}
            </div>
          </section>
        </section>
      )}
    </>
  );
}
