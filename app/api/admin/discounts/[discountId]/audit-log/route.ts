import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    discountId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/discounts/${params.discountId}/audit-log`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load audit log.",
  });
}
