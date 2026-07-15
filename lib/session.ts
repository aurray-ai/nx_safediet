import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/config";
import { getDashboardHrefForRole, resolveDashboardRole } from "@/lib/roles";
import type { AdminSession } from "@/lib/types";

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AdminSession> & {
      user?: {
        id?: string;
        name?: string;
        email?: string;
        user_types?: string[];
      };
    };

    if (
      !parsed.accessToken ||
      !parsed.tokenType ||
      !parsed.user?.id ||
      !parsed.user?.name ||
      !parsed.user?.email ||
      !Array.isArray(parsed.user.user_types)
    ) {
      return null;
    }

    const activeRole = parsed.activeRole ?? resolveDashboardRole(parsed.user.user_types);
    if (!activeRole) {
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      tokenType: parsed.tokenType,
      user: parsed.user,
      activeRole,
      defaultDashboardHref: parsed.defaultDashboardHref ?? getDashboardHrefForRole(activeRole),
    };
  } catch {
    return null;
  }
}
