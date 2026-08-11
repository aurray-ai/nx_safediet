import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    discountId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/discounts/${params.discountId}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load discount.",
  });
}

export async function PUT(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/discounts/${params.discountId}`,
    method: "PUT",
    successStatus: 200,
    errorMessage: "Unable to update discount.",
  });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/discounts/${params.discountId}`,
    method: "DELETE",
    successStatus: 204,
    errorMessage: "Unable to delete discount.",
  });
}
