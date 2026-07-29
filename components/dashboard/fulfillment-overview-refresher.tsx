"use client";

import { useRouter } from "next/navigation";

import { useRealtimeEvent } from "@/components/dashboard/realtime-provider";

export function FulfillmentOverviewRefresher() {
  const router = useRouter();

  useRealtimeEvent("fulfillment_update", "admin.meal_orders", () => router.refresh());
  useRealtimeEvent("fulfillment_update", "admin.grocery_orders", () => router.refresh());

  return null;
}
