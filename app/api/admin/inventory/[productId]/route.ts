import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    productId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/groceries/inventory/${params.productId}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load inventory item.",
  });
}

export async function PUT(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/groceries/inventory/${params.productId}`,
    method: "PUT",
    successStatus: 200,
    errorMessage: "Unable to save inventory item.",
  });
}
