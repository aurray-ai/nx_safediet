import type { Route } from "next";
import Link from "next/link";

import { CopyPublicLinkButton } from "@/components/dashboard/surveys/copy-public-link-button";
import { formatDate, formatLabel } from "@/lib/admin-format";
import type { AdminSurvey } from "@/lib/types";

type SurveyListProps = {
  items: AdminSurvey[];
  total: number;
  role: string;
  search: string;
};

export function SurveyList({ items, total, role, search }: SurveyListProps) {
  const publishedCount = items.filter((item) => item.status === "published").length;
  const responseCount = items.reduce((sum, item) => sum + item.response_count, 0);

  return (
    <section className="survey-listPage">
      <section className="survey-listPage__header">
        <div>
          <p className="app__admin-eyebrow">Surveys</p>
          <h2 className="app__admin-groceriesTitle">Surveys</h2>
          <p>Create, manage and analyse your surveys.</p>
        </div>

        <Link href={`/dashboard/${role}/surveys/new` as Route} className="app__admin-primaryButton">
          + Create Survey
        </Link>
      </section>

      <section className="survey-listPage__filters">
        <form className="survey-listPage__filterBar" action={`/dashboard/${role}/surveys`}>
          <input
            name="search"
            defaultValue={search}
            placeholder="Search your surveys..."
            className="app__admin-input"
          />
          <select className="app__admin-select" defaultValue="all">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <select className="app__admin-select" defaultValue="all">
            <option value="all">All Type</option>
            <option value="public">Public</option>
            <option value="internal">Internal</option>
          </select>
        </form>
      </section>

      <section className="survey-listPage__stats">
        <article>
          <strong>{total}</strong>
          <span>Total Surveys</span>
          <small>+3 this month</small>
        </article>
        <article>
          <strong>{publishedCount}</strong>
          <span>Published</span>
          <small>Live and collecting</small>
        </article>
        <article>
          <strong>{responseCount}</strong>
          <span>Responses</span>
          <small>+132 this week</small>
        </article>
        <article>
          <strong>{items.length > 0 ? "68%" : "--"}</strong>
          <span>Completion Rate</span>
          <small>Average</small>
        </article>
      </section>

      {items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No surveys</p>
          <h2>No surveys found</h2>
          <p>Create the first survey or try a different search term.</p>
        </section>
      ) : (
        <section className="survey-listPage__table">
          <div className="survey-listPage__tableHead">
            <span>Survey</span>
            <span>Status</span>
            <span>Responses</span>
            <span>Completion Rate</span>
            <span>Updated</span>
            <span>Actions</span>
          </div>
          {items.map((survey) => (
            <article key={survey.id} className="survey-listPage__row">
              <div className="survey-listPage__meta">
                <strong>{survey.title}</strong>
                <span>Created {formatDate(survey.created_at)}</span>
              </div>
              <span className={`survey-workspace__status survey-workspace__status--${survey.status}`}>
                {formatLabel(survey.status)}
              </span>
              <span>{survey.response_count}</span>
              <span>{survey.response_count > 0 ? "74%" : "--"}</span>
              <span>{formatDate(survey.updated_at)}</span>
              <div className="survey-listPage__actions">
                <Link href={`/dashboard/${role}/surveys/${survey.id}` as Route} className="app__admin-secondaryButton">
                  Workspace
                </Link>
                <Link href={`/dashboard/${role}/surveys/${survey.id}/builder` as Route} className="app__admin-link">
                  Builder
                </Link>
                <Link href={`/dashboard/${role}/surveys/${survey.id}/responses` as Route} className="app__admin-link">
                  Responses
                </Link>
                <CopyPublicLinkButton slug={survey.slug} className="app__admin-link" label="Copy Link" />
              </div>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
