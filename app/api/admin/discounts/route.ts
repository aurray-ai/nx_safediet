import { proxyJsonRequest } from "@/lib/api-route";

export async function GET() {
  return proxyJsonRequest({
    path: "/admin/discounts",
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load discounts.",
  });
}

export async function POST(request: Request) {
  return proxyJsonRequest({
    request,
    path: "/admin/discounts",
    method: "POST",
    successStatus: 201,
    errorMessage: "Unable to create discount.",
  });
}
