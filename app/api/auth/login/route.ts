import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/config";
import { loginAdmin } from "@/lib/api";
import { getDashboardHrefForRole, resolveDashboardRole } from "@/lib/roles";
import type { AdminSession } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email?: string; password?: string };

    if (!payload.email || !payload.password) {
      return NextResponse.json(
        { detail: "Email and password are required." },
        { status: 400 },
      );
    }

    const result = await loginAdmin(payload.email, payload.password);
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

    return NextResponse.json({ ok: true, redirectTo: defaultDashboardHref, role: activeRole });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to sign in." },
      { status: 401 },
    );
  }
}
