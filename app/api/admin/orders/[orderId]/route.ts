import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    orderId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/grocery-orders/${params.orderId}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load order.",
  });
}
