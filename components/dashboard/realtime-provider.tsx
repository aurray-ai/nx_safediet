"use client";

import { createContext, useContext, useEffect, useRef } from "react";

import { createRealtimeConnection, type RealtimeConnection, type RealtimeDeliveryEvent } from "@/lib/realtime-client";

const RealtimeContext = createContext<RealtimeConnection | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const connectionRef = useRef<RealtimeConnection | null>(null);
  if (connectionRef.current === null) {
    connectionRef.current = createRealtimeConnection();
  }

  useEffect(() => {
    const connection = connectionRef.current;
    if (!connection) {
      return;
    }
    void connection.connect();
    return () => connection.disconnect();
  }, []);

  return <RealtimeContext.Provider value={connectionRef.current}>{children}</RealtimeContext.Provider>;
}

export function useRealtimeEvent(
  deliveryType: string,
  location: string,
  handler: (event: RealtimeDeliveryEvent) => void,
): void {
  const connection = useContext(RealtimeContext);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!connection) {
      return;
    }
    return connection.on((event) => {
      if (event.delivery_type === deliveryType && event.location === location) {
        handlerRef.current(event);
      }
    });
  }, [connection, deliveryType, location]);
}
