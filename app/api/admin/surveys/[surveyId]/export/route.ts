import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/config";
import { getAuthenticatedSession } from "@/lib/api-route";

type RouteContext = {
  params: {
    surveyId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  const { response: authResponse, session } = await getAuthenticatedSession();
  if (authResponse) {
    return authResponse;
  }
  if (!session) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  try {
    const upstreamResponse = await fetch(`${API_BASE_URL}/admin/surveys/${params.surveyId}/export.csv`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    const content = await upstreamResponse.text();
    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { detail: content || "Unable to export survey responses." },
        { status: upstreamResponse.status },
      );
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": upstreamResponse.headers.get("content-disposition") ?? `attachment; filename="survey-${params.surveyId}-responses.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to export survey responses." },
      { status: 500 },
    );
  }
}
