import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    surveyId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/surveys/${params.surveyId}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load survey.",
  });
}

export async function PUT(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/surveys/${params.surveyId}`,
    method: "PUT",
    successStatus: 200,
    errorMessage: "Unable to update survey.",
  });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/surveys/${params.surveyId}`,
    method: "DELETE",
    successStatus: 204,
    errorMessage: "Unable to delete survey.",
  });
}
