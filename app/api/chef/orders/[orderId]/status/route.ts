import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    orderId: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/chef/orders/${params.orderId}/status`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to update order status.",
  });
}
