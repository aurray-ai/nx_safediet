import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/config";
import { registerCustomer } from "@/lib/api";
import { getDashboardHrefForRole, resolveDashboardRole } from "@/lib/roles";
import type { AdminSession } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      user_types?: string[];
      user_configuration?: Record<string, unknown>;
    };

    if (!payload.name || !payload.email || !payload.password) {
      return NextResponse.json(
        { detail: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    const userTypes = Array.from(new Set([...(payload.user_types ?? []), "customer"]));
    const defaultUserConfiguration = {
      mode: "solo",
      goal: "maintain",
      weekly_budget: 85,
      culture_preferences: ["East African", "Italian"],
      diet_rules: [],
      household_size: 1,
      selected_plan_types: ["Breakfast", "Lunch", "Dinner"],
      allergies: [],
      gender: "Prefer not to say",
      age: 24,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
    };

    const result = await registerCustomer({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      user_types: userTypes,
      user_configuration: payload.user_configuration ?? defaultUserConfiguration,
    });

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

    return NextResponse.json({ ok: true, redirectTo: "/account-setup" });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Unable to create account." },
      { status: 400 },
    );
  }
}
