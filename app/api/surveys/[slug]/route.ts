import { proxyPublicJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyPublicJsonRequest({
    path: `/surveys/${params.slug}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load survey.",
  });
}
