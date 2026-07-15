import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    productId: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  return proxyJsonRequest({
    path: `/admin/groceries/inventory/${params.productId}/adjustments${query ? `?${query}` : ""}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load stock adjustments.",
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/groceries/inventory/${params.productId}/adjustments`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to apply stock adjustment.",
  });
}
