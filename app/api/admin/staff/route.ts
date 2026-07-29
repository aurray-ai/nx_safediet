import { proxyJsonRequest } from "@/lib/api-route";

export async function POST(request: Request) {
  return proxyJsonRequest({
    request,
    path: "/admin/staff",
    method: "POST",
    successStatus: 201,
    errorMessage: "Unable to create staff account.",
  });
}
