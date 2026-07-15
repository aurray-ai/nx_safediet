import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    orderId: string;
    itemId: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/grocery-orders/${params.orderId}/items/${params.itemId}/substitution`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to apply substitution decision.",
  });
}
