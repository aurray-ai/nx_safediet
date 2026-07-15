import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/config";
import {
  getDashboardHrefForRole,
  getRoleFromSlug,
  getRoleSlug,
  resolveDashboardRole,
  type DashboardRole,
} from "@/lib/roles";

function readSessionRole(request: NextRequest): DashboardRole | null {
  const rawCookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!rawCookie) {
    return null;
  }

  try {
    const payload = JSON.parse(rawCookie) as {
      activeRole?: string;
      user?: { user_types?: string[] };
    };

    if (
      payload.activeRole === "admin" ||
      payload.activeRole === "user" ||
      payload.activeRole === "chef" ||
      payload.activeRole === "shopper" ||
      payload.activeRole === "delivery_agent"
    ) {
      return payload.activeRole;
    }

    return resolveDashboardRole(payload.user?.user_types ?? []);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const role = readSessionRole(request);
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const roleSlug = pathname.split("/")[2] || "";
  if (!roleSlug) {
    return NextResponse.redirect(new URL(getDashboardHrefForRole(role), request.url));
  }

  const roleFromPath = getRoleFromSlug(roleSlug);
  if (!roleFromPath || getRoleSlug(role) !== roleSlug) {
    return NextResponse.redirect(new URL(getDashboardHrefForRole(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
