import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/config";
import { getSession } from "@/lib/session";

export async function POST(
  _request: Request,
  context: { params: { token: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ detail: "Authentication required." }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/households/invitations/${context.params.token}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      },
    );
    const payload = (await response.json()) as Record<string, unknown>;
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to accept invitation." },
      { status: 500 },
    );
  }
}
