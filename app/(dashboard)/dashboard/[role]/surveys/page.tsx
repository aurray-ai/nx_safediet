import { SurveyList } from "@/components/dashboard/surveys/survey-list";
import { fetchAdminSurveys } from "@/lib/api";

export default async function SurveysPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { search?: string };
}) {
  const search = searchParams?.search?.trim() || "";
  const response = await fetchAdminSurveys({ search: search || undefined, page: 1, pageSize: 50 });

  return (
    <section className="app__admin-groceries">
      <SurveyList items={response.items} total={response.total} role={params.role} search={search} />
    </section>
  );
}
