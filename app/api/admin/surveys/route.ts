import { proxyJsonRequest } from "@/lib/api-route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  return proxyJsonRequest({
    path: `/admin/surveys${query ? `?${query}` : ""}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load surveys.",
  });
}

export async function POST(request: Request) {
  return proxyJsonRequest({
    request,
    path: "/admin/surveys",
    method: "POST",
    successStatus: 201,
    errorMessage: "Unable to create survey.",
  });
}
