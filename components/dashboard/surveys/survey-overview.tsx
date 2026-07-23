import type { Route } from "next";
import Link from "next/link";

import { CopyPublicLinkButton } from "@/components/dashboard/surveys/copy-public-link-button";
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
        <aside className="survey-workspace__settings">
          <h3>Settings</h3>
          <div className="survey-workspace__settingsNav">
            <span className="is-active">General</span>
            <span>Access & Visibility</span>
            <span>Responses</span>
            <span>Notifications</span>
            <span>Thank You Page</span>
            <span>Integrations</span>
          </div>
        </aside>

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
              <Link href={`/api/admin/surveys/${survey.id}/export` as Route} className="app__admin-primaryButton">
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
                <span>{response.respondent.email || response.respondent.name || "Anonymous"}</span>
                <span className="survey-workspace__pill is-live">Completed</span>
                <span>{formatDate(response.created_at)}</span>
                <span>{formatDate(response.submitted_at)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="survey-workspace__card survey-workspace__analytics">
          <div className="survey-workspace__cardHeader">
            <h3>Analytics Overview</h3>
            <span className="survey-workspace__muted">Last 30 days</span>
          </div>

          <div className="survey-workspace__metricGrid">
            <article>
              <strong>{analytics.total_responses}</strong>
              <span>Responses</span>
            </article>
            <article>
              <strong>{responses.length > 0 ? "74%" : "--"}</strong>
              <span>Completion Rate</span>
            </article>
            <article>
              <strong>{responses.length > 0 ? "06:24" : "--:--"}</strong>
              <span>Avg. Time</span>
            </article>
            <article>
              <strong>{responses.length > 0 ? "26%" : "--"}</strong>
              <span>Drop-off</span>
            </article>
          </div>

          <div className="survey-workspace__analyticsBody">
            <div className="survey-workspace__bars">
              {Array.from({ length: 18 }).map((_, index) => (
                <span
                  key={index}
                  className="survey-workspace__bar"
                  style={{ height: `${18 + ((index * 13) % 92)}px` }}
                />
              ))}
            </div>
            <div className="survey-workspace__donut">
              <div>
                <strong>74%</strong>
                <span>Completed</span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
