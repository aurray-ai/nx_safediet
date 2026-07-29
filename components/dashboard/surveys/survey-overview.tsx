import type { Route } from "next";
import Link from "next/link";

import { CopyPublicLinkButton } from "@/components/dashboard/surveys/copy-public-link-button";
import { SurveyInsightsPreview } from "@/components/dashboard/surveys/survey-core-reports";
import { SurveyWorkspaceNav } from "@/components/dashboard/surveys/survey-workspace-nav";
import { formatDate } from "@/lib/admin-format";
import type { AdminSurvey, SurveyAnalytics, SurveySubmission } from "@/lib/types";

type SurveyOverviewProps = {
  role: string;
  survey: AdminSurvey;
  analytics: SurveyAnalytics;
  responses: SurveySubmission[];
};

export function SurveyOverview({
  role,
  survey,
  analytics,
  responses,
}: SurveyOverviewProps) {
  const publicPath = `/surveys/${survey.slug}`;
  const exportPath = `/api/admin/surveys/${survey.id}/export`;
  const reportsPath = `/dashboard/${role}/surveys/${survey.id}/reports`;

  return (
    <section className="survey-workspace">
      <section className="survey-workspace__hero">
        <div>
          <p className="app__admin-eyebrow">Survey Workspace</p>
          <h2 className="app__admin-groceriesTitle">{survey.title}</h2>
          <p className="survey-workspace__copy">
            Manage settings, share the public link, monitor response health, and jump into the builder from one place.
          </p>
        </div>

        <div className="survey-workspace__actions">
          <Link href={`/dashboard/${role}/surveys/${survey.id}/builder` as Route} className="app__admin-primaryButton">
            Open Builder
          </Link>
          <Link href={publicPath as Route} className="app__admin-secondaryButton">
            Preview Public Form
          </Link>
          <CopyPublicLinkButton slug={survey.slug} />
        </div>
      </section>

      <section className="survey-workspace__grid">
        <SurveyWorkspaceNav
          role={role}
          surveyId={survey.id}
          active="overview"
          exportHref={exportPath}
        />

        <section className="survey-workspace__card">
          <div className="survey-workspace__cardHeader">
            <h3>General</h3>
            <span className={`survey-workspace__status survey-workspace__status--${survey.status}`}>
              {survey.status}
            </span>
          </div>

          <div className="survey-workspace__detailGrid">
            <div>
              <span>Survey Title</span>
              <strong>{survey.title}</strong>
            </div>
            <div>
              <span>Description</span>
              <strong>{survey.description || "No description yet."}</strong>
            </div>
            <div>
              <span>Survey Type</span>
              <strong>{survey.settings.is_public ? "Public Survey" : "Internal Survey"}</strong>
            </div>
            <div>
              <span>Language</span>
              <strong>English (UK)</strong>
            </div>
            <div>
              <span>Sections</span>
              <strong>{survey.sections.length}</strong>
            </div>
            <div>
              <span>Questions</span>
              <strong>{survey.questions.length}</strong>
            </div>
          </div>
        </section>

        <section className="survey-workspace__card">
          <div className="survey-workspace__cardHeader">
            <h3>Share & Publish</h3>
            <span className={`survey-workspace__pill ${survey.settings.accepting_responses ? "is-live" : ""}`}>
              {survey.settings.accepting_responses ? "Published" : "Closed"}
            </span>
          </div>

          <p className="survey-workspace__muted">
            {survey.settings.accepting_responses
              ? "Your survey is live and collecting responses."
              : "This survey is not currently collecting responses."}
          </p>

          <div className="survey-workspace__shareRow">
            <div>
              <span>Public Survey Link</span>
              <code>{publicPath}</code>
            </div>
            <CopyPublicLinkButton slug={survey.slug} />
          </div>

          <div className="survey-workspace__chips">
            <button type="button">Email</button>
            <button type="button">WhatsApp</button>
            <button type="button">Facebook</button>
            <button type="button">X</button>
            <button type="button">QR Code</button>
          </div>
        </section>

        <section className="survey-workspace__card survey-workspace__responses">
          <div className="survey-workspace__cardHeader">
            <div>
              <h3>Responses</h3>
              <span className="survey-workspace__muted">{analytics.total_responses} responses</span>
            </div>
            <div className="survey-workspace__miniActions">
              <Link href={`/dashboard/${role}/surveys/${survey.id}/responses` as Route} className="app__admin-secondaryButton">
                View All
              </Link>
              <Link href={exportPath as Route} className="app__admin-primaryButton">
                Export
              </Link>
            </div>
          </div>

          <div className="survey-workspace__table">
            <div className="survey-workspace__tableHead">
              <span>Respondent</span>
              <span>Status</span>
              <span>Started</span>
              <span>Completed</span>
            </div>
            {responses.slice(0, 5).map((response) => (
              <div key={response.id} className="survey-workspace__tableRow">
                <div className="survey-workspace__cell" data-label="Respondent">
                  <span>{response.respondent.email || response.respondent.name || "Anonymous"}</span>
                </div>
                <div className="survey-workspace__cell" data-label="Status">
                  <span className="survey-workspace__pill is-live">Completed</span>
                </div>
                <div className="survey-workspace__cell" data-label="Started">
                  <span>{formatDate(response.created_at)}</span>
                </div>
                <div className="survey-workspace__cell" data-label="Completed">
                  <span>{formatDate(response.submitted_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SurveyInsightsPreview
          analytics={analytics}
          exportHref={exportPath}
          reportsHref={reportsPath as Route}
        />
      </section>
    </section>
  );
}
