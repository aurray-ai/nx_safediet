import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/config";
import { acceptStaffInvitation } from "@/lib/api";
import { getDashboardHrefForRole, resolveDashboardRole } from "@/lib/roles";
import type { AdminSession } from "@/lib/types";

type RouteContext = {
  params: {
    token: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const payload = (await request.json()) as { password?: string };

    if (!payload.password) {
      return NextResponse.json({ detail: "A password is required." }, { status: 400 });
    }

    const result = await acceptStaffInvitation(params.token, payload.password);

    const activeRole = resolveDashboardRole(result.user.user_types);
    if (!activeRole) {
      return NextResponse.json(
        { detail: "No supported dashboard role was found for this account." },
        { status: 403 },
      );
    }

    const defaultDashboardHref = getDashboardHrefForRole(activeRole);
    const session: AdminSession = {
      accessToken: result.access_token,
      tokenType: result.token_type,
      user: result.user,
      activeRole,
      defaultDashboardHref,
    };

    cookies().set(SESSION_COOKIE, JSON.stringify(session), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true, redirectTo: defaultDashboardHref });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to set up your account." },
      { status: 400 },
    );
  }
}
