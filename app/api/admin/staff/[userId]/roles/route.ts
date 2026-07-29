import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    userId: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/staff/${params.userId}/roles`,
    method: "POST",
    successStatus: 200,
    errorMessage: "Unable to update staff roles.",
  });
}
