import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    ruleId: string;
  };
};

export async function PUT(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/groceries/inventory/delivery-fees/${params.ruleId}`,
    method: "PUT",
    successStatus: 200,
    errorMessage: "Unable to update delivery fee rule.",
  });
}
