import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/config";
import { getSession } from "@/lib/session";
import type { RealtimeSessionResponse } from "@/lib/types";

function locationsForRole(activeRole: string): string[] {
  switch (activeRole) {
    case "admin":
      return ["admin.meal_orders", "admin.grocery_orders"];
    case "chef":
      return ["chef.orders"];
    case "shopper":
      return ["shopper.orders"];
    default:
      return [];
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  const wsUrl = `${API_BASE_URL.replace(/^http/, "ws")}/realtime/ws`;

  const payload: RealtimeSessionResponse = {
    accessToken: session.accessToken,
    wsUrl,
    locations: locationsForRole(session.activeRole),
  };

  return NextResponse.json(payload, { status: 200 });
}
