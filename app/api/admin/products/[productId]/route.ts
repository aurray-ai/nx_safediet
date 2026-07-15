import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    productId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/groceries/products/${params.productId}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load product.",
  });
}

export async function PUT(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/groceries/products/${params.productId}`,
    method: "PUT",
    successStatus: 200,
    errorMessage: "Unable to update product.",
  });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/groceries/products/${params.productId}`,
    method: "DELETE",
    successStatus: 204,
    errorMessage: "Unable to delete product.",
  });
}
