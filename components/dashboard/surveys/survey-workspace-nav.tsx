import type { Route } from "next";
import Link from "next/link";

type SurveyWorkspaceNavProps = {
  role: string;
  surveyId: string;
  active: "overview" | "builder" | "responses" | "reports";
  exportHref?: string;
};

const NAV_ITEMS: Array<{
  key: SurveyWorkspaceNavProps["active"];
  label: string;
  path: (role: string, surveyId: string) => Route;
}> = [
  {
    key: "overview",
    label: "General",
    path: (role, surveyId) => `/dashboard/${role}/surveys/${surveyId}` as Route,
  },
  {
    key: "builder",
    label: "Builder",
    path: (role, surveyId) => `/dashboard/${role}/surveys/${surveyId}/builder` as Route,
  },
  {
    key: "responses",
    label: "Responses",
    path: (role, surveyId) => `/dashboard/${role}/surveys/${surveyId}/responses` as Route,
  },
  {
    key: "reports",
    label: "Core Reports",
    path: (role, surveyId) => `/dashboard/${role}/surveys/${surveyId}/reports` as Route,
  },
];

export function SurveyWorkspaceNav({
  role,
  surveyId,
  active,
  exportHref,
}: SurveyWorkspaceNavProps) {
  return (
    <aside className="survey-workspace__settings">
      <h3>Workspace</h3>
      <div className="survey-workspace__settingsNav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.path(role, surveyId)}
            className={item.key === active ? "is-active" : undefined}
          >
            {item.label}
          </Link>
        ))}
        {exportHref ? (
          <a href={exportHref}>Export CSV</a>
        ) : null}
      </div>
    </aside>
  );
}
