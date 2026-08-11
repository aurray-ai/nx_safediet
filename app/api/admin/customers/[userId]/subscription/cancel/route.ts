import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    userId: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/customers/${params.userId}/subscription/cancel`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to cancel subscription.",
  });
}
