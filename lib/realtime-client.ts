"use client";

import type { RealtimeSessionResponse } from "@/lib/types";

export type RealtimeDeliveryEvent = {
  type: string;
  user_id: string;
  delivery_type: string;
  location: string;
  status: string;
  trace_id: string | null;
  conversation_id: string | null;
  payload: Record<string, unknown>;
  channels: string[];
  metadata: Record<string, unknown>;
};

type EventHandler = (event: RealtimeDeliveryEvent) => void;

const RECONNECT_BASE_DELAY_MS = 1000;
const RECONNECT_MAX_DELAY_MS = 15000;

export class RealtimeConnection {
  private socket: WebSocket | null = null;
  private handlers = new Set<EventHandler>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private closedByCaller = false;

  async connect(): Promise<void> {
    this.closedByCaller = false;
    await this.openSocket();
  }

  private async openSocket(): Promise<void> {
    let session: RealtimeSessionResponse;
    try {
      const response = await fetch("/api/realtime/session", { cache: "no-store" });
      if (!response.ok) {
        this.scheduleReconnect();
        return;
      }
      session = (await response.json()) as RealtimeSessionResponse;
    } catch {
      this.scheduleReconnect();
      return;
    }

    if (session.locations.length === 0) {
      return;
    }

    const url = `${session.wsUrl}?access_token=${encodeURIComponent(session.accessToken)}&locations=${encodeURIComponent(
      session.locations.join(","),
    )}`;

    const socket = new WebSocket(url);
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempts = 0;
    };

    socket.onmessage = (messageEvent) => {
      let parsed: RealtimeDeliveryEvent;
      try {
        parsed = JSON.parse(messageEvent.data as string) as RealtimeDeliveryEvent;
      } catch {
        return;
      }
      if (parsed.type !== "delivery") {
        return;
      }
      for (const handler of this.handlers) {
        handler(parsed);
      }
    };

    socket.onclose = () => {
      this.socket = null;
      if (!this.closedByCaller) {
        this.scheduleReconnect();
      }
    };

    socket.onerror = () => {
      socket.close();
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer !== null) {
      return;
    }
    const delay = Math.min(RECONNECT_BASE_DELAY_MS * 2 ** this.reconnectAttempts, RECONNECT_MAX_DELAY_MS);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.closedByCaller) {
        void this.openSocket();
      }
    }, delay);
  }

  on(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect(): void {
    this.closedByCaller = true;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
  }
}

export function createRealtimeConnection(): RealtimeConnection {
  return new RealtimeConnection();
}
