import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    userId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/customers/${params.userId}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load customer.",
  });
}
