import { proxyJsonRequest } from "@/lib/api-route";

export async function DELETE(request: Request) {
  return proxyJsonRequest({
    request,
    path: "/admin/meals/bulk-delete",
    method: "DELETE",
    successStatus: 200,
    errorMessage: "Unable to delete selected meals.",
  });
}
