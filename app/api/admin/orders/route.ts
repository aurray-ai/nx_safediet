import { proxyJsonRequest } from "@/lib/api-route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  return proxyJsonRequest({
    path: `/admin/grocery-orders${query ? `?${query}` : ""}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load grocery orders.",
  });
}
