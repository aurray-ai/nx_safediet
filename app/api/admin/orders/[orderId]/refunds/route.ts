import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    orderId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/grocery-orders/${params.orderId}/refunds`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load refund history.",
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/grocery-orders/${params.orderId}/refunds`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to create refund.",
  });
}
