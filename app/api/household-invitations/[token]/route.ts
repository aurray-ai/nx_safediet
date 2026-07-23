import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/config";

export async function GET(
  _request: Request,
  context: { params: { token: string } },
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/households/invitations/${context.params.token}`,
      { cache: "no-store" },
    );
    const payload = (await response.json()) as Record<string, unknown>;
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to load invitation." },
      { status: 500 },
    );
  }
}
