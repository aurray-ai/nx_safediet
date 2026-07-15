import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/config";
import { getSession } from "@/lib/session";

export async function parseUpstreamResponse(response: Response) {
  const raw = await response.text();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as { detail?: string };
  } catch {
    return { detail: raw };
  }
}

export async function getAuthenticatedSession() {
  const session = await getSession();
  if (!session) {
    return {
      response: NextResponse.json({ detail: "Not authenticated." }, { status: 401 }),
      session: null,
    };
  }

  return { response: null, session };
}

type ProxyJsonRequestOptions = {
  request?: Request;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  successStatus: number;
  errorMessage: string;
};

export async function proxyJsonRequest({
  request,
  path,
  method,
  successStatus,
  errorMessage,
}: ProxyJsonRequestOptions) {
  const { response: authResponse, session } = await getAuthenticatedSession();
  if (authResponse) {
    return authResponse;
  }
  if (!session) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = request ? await request.text() : undefined;
    const upstreamResponse = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${session.accessToken}`,
      },
      body,
      cache: "no-store",
    });

    if (successStatus === 204 && upstreamResponse.ok) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await parseUpstreamResponse(upstreamResponse);
    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { detail: data?.detail ?? errorMessage },
        { status: upstreamResponse.status },
      );
    }

    return NextResponse.json(data, { status: successStatus });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : errorMessage },
      { status: 500 },
    );
  }
}

type ProxyMultipartRequestOptions = {
  request: Request;
  path: string;
  method?: "POST" | "PUT";
  successStatus: number;
  errorMessage: string;
};

export async function proxyMultipartRequest({
  request,
  path,
  method = "POST",
  successStatus,
  errorMessage,
}: ProxyMultipartRequestOptions) {
  const { response: authResponse, session } = await getAuthenticatedSession();
  if (authResponse) {
    return authResponse;
  }
  if (!session) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const upstreamResponse = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: formData,
      cache: "no-store",
    });

    const data = await parseUpstreamResponse(upstreamResponse);
    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { detail: data?.detail ?? errorMessage },
        { status: upstreamResponse.status },
      );
    }

    return NextResponse.json(data, { status: successStatus });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : errorMessage },
      { status: 500 },
    );
  }
}
