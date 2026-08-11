import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    discountId: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  return proxyJsonRequest({
    path: `/admin/discounts/${params.discountId}/products${query ? `?${query}` : ""}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load products for this discount.",
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/discounts/${params.discountId}/products`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to assign products to this discount.",
  });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/discounts/${params.discountId}/products`,
    method: "DELETE",
    successStatus: 200,
    errorMessage: "Unable to remove products from this discount.",
  });
}
