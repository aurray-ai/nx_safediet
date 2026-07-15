import { proxyJsonRequest } from "@/lib/api-route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  return proxyJsonRequest({
    path: `/admin/meals${query ? `?${query}` : ""}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load meals.",
  });
}

export async function POST(request: Request) {
  return proxyJsonRequest({
    request,
    path: "/admin/meals",
    method: "POST",
    successStatus: 201,
    errorMessage: "Unable to create meal.",
  });
}
