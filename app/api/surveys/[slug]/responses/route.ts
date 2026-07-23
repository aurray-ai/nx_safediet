import { proxyPublicJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  return proxyPublicJsonRequest({
    request,
    path: `/surveys/${params.slug}/responses`,
    method: "POST",
    successStatus: 201,
    errorMessage: "Unable to submit survey response.",
  });
}
