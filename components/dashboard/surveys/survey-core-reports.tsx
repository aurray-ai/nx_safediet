import type { Route } from "next";
import Link from "next/link";

import { formatNumber } from "@/lib/admin-format";
import type { SurveyAnalytics, SurveyRankedItem, SurveyReportMetric } from "@/lib/types";

type SurveyCoreReportProps = {
  analytics: SurveyAnalytics;
  exportHref: string;
};

type SurveyInsightsPreviewProps = SurveyCoreReportProps & {
  reportsHref: Route;
};

type ReportMetricGridProps = {
  metrics: SurveyReportMetric[];
};

type RankedListProps = {
  items: SurveyRankedItem[];
  emptyLabel: string;
};

function ReportMetricGrid({ metrics }: ReportMetricGridProps) {
  return (
    <div className="survey-report__metricGrid">
      {metrics.map((metric) => (
        <article key={metric.label} className="survey-report__metricCard">
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.detail}</small>
        </article>
      ))}
    </div>
  );
}

function RankedList({ items, emptyLabel }: RankedListProps) {
  if (items.length === 0) {
    return <p className="survey-report__emptyLabel">{emptyLabel}</p>;
  }

  const highestCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="survey-report__barList">
      {items.map((item) => (
        <article key={item.label} className="survey-report__barRow">
          <div className="survey-report__barMeta">
            <strong>{item.label}</strong>
            <span>
              {formatNumber(item.count)} responses
              {item.percent > 0 ? ` (${item.percent}%)` : ""}
            </span>
          </div>
          <div className="survey-report__barTrack" aria-hidden="true">
            <span
              className="survey-report__barFill"
              style={{ width: item.count > 0 ? `${Math.max(8, Math.round((item.count / highestCount) * 100))}%` : "0%" }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

export function SurveyInsightsPreview({
  analytics,
  exportHref,
  reportsHref,
}: SurveyInsightsPreviewProps) {
  const reportData = analytics.core_reports;

  return (
    <section className="survey-workspace__card survey-report__preview">
      <div className="survey-workspace__cardHeader">
        <div>
          <h3>Core insights</h3>
          <span className="survey-workspace__muted">
            Derived from submitted survey responses, not placeholder analytics.
          </span>
        </div>
        <div className="survey-workspace__miniActions">
          <Link href={reportsHref} className="app__admin-secondaryButton">
            View reports
          </Link>
          <a href={exportHref} className="app__admin-primaryButton">
            Export CSV
          </a>
        </div>
      </div>

      <div className="survey-workspace__metricGrid survey-report__previewGrid">
        <article>
          <strong>{formatNumber(reportData.response_count)}</strong>
          <span>Responses</span>
        </article>
        <article>
          <strong>{reportData.overview.top_blocker}</strong>
          <span>Top blocker</span>
        </article>
        <article>
          <strong>{reportData.overview.top_feature}</strong>
          <span>Top feature request</span>
        </article>
        <article>
          <strong>{reportData.overview.dominant_theme}</strong>
          <span>Dominant open-feedback theme</span>
        </article>
      </div>

      <div className="survey-report__chipRow">
        <span className="survey-report__chip">Pain signal: {reportData.overview.top_issue_share}%</span>
        <span className="survey-report__chip">Feature demand: {reportData.overview.feature_demand_share}%</span>
        <span className="survey-report__chip">Theme coverage: {reportData.overview.theme_share}%</span>
      </div>
    </section>
  );
}

export function SurveyCoreReports({ analytics, exportHref }: SurveyCoreReportProps) {
  const reportData = analytics.core_reports;

  if (!reportData.has_responses) {
    return (
      <section id="core-reports" className="survey-reports">
        <section className="survey-workspace__card">
          <div className="survey-workspace__cardHeader">
            <div>
              <h3>Core reports</h3>
              <span className="survey-workspace__muted">
                These reports will populate as soon as the survey receives submissions.
              </span>
            </div>
            <a href={exportHref} className="app__admin-primaryButton">
              Export CSV
            </a>
          </div>
          <p className="survey-report__emptyLabel">
            No submitted responses yet. Publish the survey and collect answers to unlock the four core strategy reports.
          </p>
        </section>
      </section>
    );
  }

  return (
    <section id="core-reports" className="survey-reports">
      <div className="survey-reports__header">
        <div>
          <p className="app__admin-eyebrow">Core reports</p>
          <h3>Strategy reporting from live survey responses</h3>
          <p>These four views turn Safediet survey answers into decision-ready product insight.</p>
        </div>
        <a href={exportHref} className="app__admin-primaryButton">
          Export CSV
        </a>
      </div>

      <div className="survey-reports__grid">
        <article className="survey-report__card">
          <div className="survey-workspace__cardHeader">
            <div>
              <h3>Meal Planning Pain Report</h3>
              <span className="survey-workspace__muted">
                Planning frequency, perceived difficulty, and the blockers stopping users from staying consistent.
              </span>
            </div>
          </div>
          <ReportMetricGrid metrics={reportData.meal_planning.metrics} />
          <div className="survey-report__split">
            <section className="survey-report__panel">
              <h4>Planning frequency</h4>
              <RankedList
                items={reportData.meal_planning.frequency}
                emptyLabel="No meal-planning answers available yet."
              />
            </section>
            <section className="survey-report__panel">
              <h4>Top planning challenges</h4>
              <RankedList
                items={reportData.meal_planning.challenges}
                emptyLabel="No planning challenge answers available yet."
              />
            </section>
          </div>
          <section className="survey-report__panel">
            <div className="survey-workspace__cardHeader">
              <h4>Household segments</h4>
              <span className="survey-workspace__muted">Best respondent grouping for first-level segmentation</span>
            </div>
            <div className="survey-report__chipRow">
              {reportData.meal_planning.segments.map((segment) => (
                <span key={segment.label} className="survey-report__chip">
                  {segment.label}: {segment.percent}%
                </span>
              ))}
            </div>
          </section>
        </article>

        <article className="survey-report__card">
          <div className="survey-workspace__cardHeader">
            <div>
              <h3>Budget Risk Report</h3>
              <span className="survey-workspace__muted">
                Budget discipline, overspend exposure, and the money leaks users want fixed.
              </span>
            </div>
          </div>
          <ReportMetricGrid metrics={reportData.budget_risk.metrics} />
          <div className="survey-report__triple">
            <section className="survey-report__panel">
              <h4>Budget cadence</h4>
              <RankedList
                items={reportData.budget_risk.cadence}
                emptyLabel="No budget-cadence answers available yet."
              />
            </section>
            <section className="survey-report__panel">
              <h4>Overspend frequency</h4>
              <RankedList
                items={reportData.budget_risk.overspend_frequency}
                emptyLabel="No overspend-frequency answers available yet."
              />
            </section>
            <section className="survey-report__panel">
              <h4>Top overspend causes</h4>
              <RankedList
                items={reportData.budget_risk.overspend_causes}
                emptyLabel="No overspend-cause answers available yet."
              />
            </section>
          </div>
        </article>

        <article className="survey-report__card">
          <div className="survey-workspace__cardHeader">
            <div>
              <h3>Feature Demand Report</h3>
              <span className="survey-workspace__muted">
                The highest-demand feature ideas, the concentration of interest, and who wants what most.
              </span>
            </div>
          </div>
          <ReportMetricGrid metrics={reportData.feature_demand.metrics} />
          <div className="survey-report__triple">
            <section className="survey-report__panel">
              <h4>Requested features</h4>
              <RankedList
                items={reportData.feature_demand.features}
                emptyLabel="No feature-demand answers available yet."
              />
            </section>
            <section className="survey-report__panel">
              <h4>Weekly time burden</h4>
              <RankedList
                items={reportData.feature_demand.time_bands}
                emptyLabel="No weekly-time answers available yet."
              />
            </section>
            <section className="survey-report__panel">
              <h4>Demand by household segment</h4>
              <div className="survey-report__segmentList">
                {reportData.feature_demand.segment_demand.map((segment) => (
                  <article key={segment.segment} className="survey-report__segmentRow">
                    <div>
                      <strong>{segment.segment}</strong>
                      <span>{formatNumber(segment.response_count)} responses</span>
                    </div>
                    <div>
                      <strong>{segment.top_feature}</strong>
                      <span>{segment.top_feature_percent}% selected</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>

        <article className="survey-report__card">
          <div className="survey-workspace__cardHeader">
            <div>
              <h3>Open Feedback Theme Report</h3>
              <span className="survey-workspace__muted">
                A keyword-based first pass over text responses to reveal recurring themes, tone, and urgency.
              </span>
            </div>
          </div>
          <ReportMetricGrid metrics={reportData.open_feedback.metrics} />
          <div className="survey-report__split">
            <section className="survey-report__panel">
              <h4>Theme distribution</h4>
              <RankedList
                items={reportData.open_feedback.themes}
                emptyLabel="No text feedback themes detected yet."
              />
            </section>
            <section className="survey-report__panel">
              <h4>Sentiment and urgency</h4>
              <div className="survey-report__stackedMeta">
                <div>
                  <span className="survey-report__metaLabel">Sentiment</span>
                  <div className="survey-report__chipRow">
                    {reportData.open_feedback.sentiment.map((item) => (
                      <span
                        key={item.label}
                        className={`survey-report__chip survey-report__chip--${item.label.toLowerCase()}`}
                      >
                        {item.label}: {item.percent}%
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="survey-report__metaLabel">Urgency</span>
                  <div className="survey-report__chipRow">
                    {reportData.open_feedback.urgency.map((item) => (
                      <span
                        key={item.label}
                        className={`survey-report__chip survey-report__chip--${item.label.toLowerCase()}`}
                      >
                        {item.label}: {item.percent}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
          <section className="survey-report__panel">
            <div className="survey-workspace__cardHeader">
              <h4>Representative snippets</h4>
              <span className="survey-workspace__muted">The first four responses are tagged for quick review</span>
            </div>
            <div className="survey-report__snippetList">
              {reportData.open_feedback.snippets.map((snippet, index) => (
                <article key={`${index}-${snippet.text.slice(0, 24)}`} className="survey-report__snippet">
                  <p>“{snippet.text}”</p>
                  <div className="survey-report__chipRow">
                    {snippet.tags.map((tag) => (
                      <span key={`${index}-${tag}`} className="survey-report__chip">
                        {tag}
                      </span>
                    ))}
                    <span className={`survey-report__chip survey-report__chip--${snippet.tone}`}>
                      {snippet.tone}
                    </span>
                    <span className={`survey-report__chip survey-report__chip--${snippet.urgency}`}>
                      {snippet.urgency} urgency
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </article>
      </div>
    </section>
  );
}
