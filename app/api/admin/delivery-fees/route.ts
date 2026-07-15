import { proxyJsonRequest } from "@/lib/api-route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  return proxyJsonRequest({
    path: `/admin/groceries/inventory/delivery-fees/list${query ? `?${query}` : ""}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load delivery fee rules.",
  });
}

export async function POST(request: Request) {
  return proxyJsonRequest({
    request,
    path: "/admin/groceries/inventory/delivery-fees",
    method: "POST",
    successStatus: 201,
    errorMessage: "Unable to create delivery fee rule.",
  });
}
