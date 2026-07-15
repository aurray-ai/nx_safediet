import { proxyMultipartRequest } from "@/lib/api-route";

export async function POST(request: Request) {
  return proxyMultipartRequest({
    request,
    path: "/admin/groceries/products/uploads",
    successStatus: 201,
    errorMessage: "Unable to upload product assets.",
  });
}
