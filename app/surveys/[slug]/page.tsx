import { PublicSurveyForm } from "@/components/surveys/public-survey-form";
import { SurveyUnavailablePage } from "@/components/surveys/survey-unavailable-page";
import { fetchPublicSurvey } from "@/lib/api";

export default async function PublicSurveyPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const survey = await fetchPublicSurvey(params.slug);
    return <PublicSurveyForm survey={survey} />;
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes("not published")) {
        return <SurveyUnavailablePage reason="not_published" slug={params.slug} />;
      }

      if (message.includes("not publicly available")) {
        return <SurveyUnavailablePage reason="not_public" slug={params.slug} />;
      }

      if (message.includes("not found")) {
        return <SurveyUnavailablePage reason="not_found" slug={params.slug} />;
      }
    }

    throw error;
  }
}
