import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    surveyId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/surveys/${params.surveyId}/analytics`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load survey analytics.",
  });
}
