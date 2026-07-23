import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    surveyId: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/surveys/${params.surveyId}/publish`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to publish survey.",
  });
}
