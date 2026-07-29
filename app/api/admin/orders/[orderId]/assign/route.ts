import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    orderId: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/grocery-orders/${params.orderId}/assign`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to assign order to a shopper.",
  });
}
