import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    orderId: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/shopper/orders/${params.orderId}/decline`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to decline order.",
  });
}
