import { proxyJsonRequest } from "@/lib/api-route";

export async function GET() {
  return proxyJsonRequest({
    path: "/admin/surveys/templates",
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load survey templates.",
  });
}
