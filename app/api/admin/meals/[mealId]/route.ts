import { proxyJsonRequest } from "@/lib/api-route";

type RouteContext = {
  params: {
    mealId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/meals/${params.mealId}`,
    method: "GET",
    successStatus: 200,
    errorMessage: "Unable to load meal.",
  });
}

export async function PUT(request: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    request,
    path: `/admin/meals/${params.mealId}`,
    method: "PUT",
    successStatus: 200,
    errorMessage: "Unable to update meal.",
  });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  return proxyJsonRequest({
    path: `/admin/meals/${params.mealId}`,
    method: "DELETE",
    successStatus: 204,
    errorMessage: "Unable to delete meal.",
  });
}
